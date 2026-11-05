const test = require('node:test');
const assert = require('node:assert/strict');
const sessions = require('../words-session.js');
const entries = Array.from({length:40},(_,i)=>({no:i+1,lookup:'word'+(i+1)}));
const options = {day:'2026-11-05',known:new Set()};
test('today is a stable ten-word set, excluding known words at selection',()=>{
  const s=sessions.load(entries,null,{...options,known:new Set(['word1'])});
  assert.equal(s.ids.length,10);assert.equal(new Set(s.ids).size,10);assert.ok(!s.ids.includes(1));
  const resumed=sessions.load(entries,s,{...options,known:new Set(entries.map(w=>w.lookup))});
  assert.deepEqual(resumed.ids,s.ids);
});
test('only explicit known/unknown answers advance daily completion',()=>{
  let s=sessions.load(entries,null,options);
  s=sessions.move(s,1);assert.equal(sessions.progress(s).completed,0);
  const first=s.ids[s.cursor];
  s=sessions.answer(s,first,'unknown',{known:false,review:false});
  assert.equal(sessions.progress(s).completed,1);
  s=sessions.answer(s,first,'known',{known:false,review:true});
  assert.equal(sessions.progress(s).completed,1);
  assert.deepEqual(sessions.answer(s,99999,'known',{}),s);
});
test('all ten decisions complete today without claiming all ten mastered',()=>{
  let s=sessions.load(entries,null,options);
  s.ids.forEach((id,i)=>{s=sessions.answer(s,id,i%2?'known':'unknown',{known:false,review:false});});
  assert.deepEqual(sessions.progress(s),{completed:10,total:10,known:5,unknown:5,done:true});
});
test('resume retains cursor, decisions and last undo after reload',()=>{
  let s=sessions.load(entries,null,options);
  const first=s.ids[0];s=sessions.answer(s,first,'unknown',{known:true,review:false});
  const reloaded=sessions.load(entries,JSON.parse(JSON.stringify(s)),options);
  assert.equal(sessions.progress(reloaded).completed,1);assert.equal(reloaded.cursor,s.cursor);
  const undone=sessions.undo(reloaded);
  assert.equal(sessions.progress(undone.session).completed,0);assert.equal(undone.session.cursor,0);
  assert.deepEqual(undone.previous.flags,{known:true,review:false});assert.equal(undone.previous.id,first);
  assert.equal(undone.session.last,null);
});
test('undoing a changed answer restores the prior decision',()=>{
  let s=sessions.load(entries,null,options);const id=s.ids[0];
  s=sessions.answer(s,id,'unknown',{known:false,review:false});
  s=sessions.answer(s,id,'known',{known:false,review:true});
  s=sessions.undo(s).session;assert.equal(s.decisions[id],'unknown');assert.equal(sessions.progress(s).completed,1);
});
test('a new local day makes a new session and clears progress',()=>{
  let s=sessions.load(entries,null,options);s=sessions.answer(s,s.ids[0],'known',{});
  const next=sessions.load(entries,s,{...options,day:'2026-11-06',history:[{ids:s.ids}]});
  assert.equal(sessions.progress(next).completed,0);assert.equal(next.last,null);
  assert.ok(next.ids.every(id=>!s.ids.includes(id)));
});
test('short/empty pools are honest, and removed source IDs are pruned',()=>{
  const empty=sessions.load([],null,options);assert.equal(sessions.progress(empty).done,false);
  const short=sessions.load(entries.slice(0,3),null,options);assert.equal(short.ids.length,3);
  const pruned=sessions.load(entries.slice(0,2),short,options);assert.ok(pruned.ids.every(id=>id<=2));
  assert.ok(sessions.move(short,-100).cursor>=0);assert.ok(sessions.move(short,100).cursor<3);
});
