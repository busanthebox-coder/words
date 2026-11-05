const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const study = require('../words-study.js');
const sessions = require('../words-session.js');
const html = fs.readFileSync(require.resolve('../index.html'), 'utf8');
const entries = JSON.parse(html.match(/<script id="payload" type="application\/json">([\s\S]*?)<\/script>/)[1]).entries;
function scriptOf(text) { return text.match(/<script>\s*\/\/ ============ Data load ============([\s\S]*?)<\/script>/)[1]; }
function app(source = scriptOf(html), saved = {}) {
  const elements = new Map();
  const storage = new Map(Object.entries(saved).map(([k,v]) => [k, JSON.stringify(v)]));
  function element(id) {
    if (elements.has(id)) return elements.get(id);
    const handlers = new Map(); const classes = new Set();
    const el = {id, value:'', innerHTML:'', textContent:'', style:{}, dataset:{}, children:[], disabled:false,
      classList:{add:(...v)=>v.forEach(x=>classes.add(x)), remove:(...v)=>v.forEach(x=>classes.delete(x)), toggle:(x,yes)=>yes?classes.add(x):classes.delete(x), contains:x=>classes.has(x)},
      addEventListener:(k,fn)=>handlers.set(k,fn), setAttribute(){}, removeAttribute(){}, getAttribute(){return null;}, focus(){}, setSelectionRange(){}, scrollTo(){},
      querySelector:q=>element(id+q), querySelectorAll:()=>[], appendChild(child){this.children.push(child);},
      click(){if(!this.disabled) {handlers.get('click')?.({target:this,stopPropagation(){}});this.onclick?.();}},
      handlers};
    elements.set(id,el); return el;
  }
  element('payload').textContent = JSON.stringify({entries:structuredClone(entries)});
  const document={getElementById:element, querySelectorAll:()=>[], addEventListener(){}, createElement:tag=>element('created-'+tag+'-'+elements.size), body:{style:{}}};
  const context={document, VocabStudy:study, VocabSession:sessions, localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)}, location:{hash:'',pathname:'/',search:''}, history:{replaceState(){},pushState(){}}, console, Date, Math, setTimeout, clearTimeout};
  context.window=context; context.window.scrollTo=()=>{}; context.window.addEventListener=()=>{};
  vm.createContext(context); vm.runInContext(source,context);
  return {run:code=>vm.runInContext(code,context),elements,storage,element};
}
const ids = list => list.map(w=>w.no);
test('actual payload has 3000 unique word IDs; new inline JS compiles',()=>{
  assert.equal(entries.length,3000);assert.equal(new Set(ids(entries)).size,3000);new vm.Script(scriptOf(html));
});
test('daily recommendations rotate, exclude mastered/recent words and contain no duplicates',()=>{
  const a=study.recommend(entries,{day:'2026-11-05'});
  const b=study.recommend(entries,{day:'2026-11-06',history:[{ids:ids(a)}],known:new Set([entries[0].lookup])});
  assert.equal(a.length,6);assert.equal(b.length,6);assert.equal(new Set(ids(b)).size,6);
  assert.ok(b.every(w=>!ids(a).includes(w.no)&&w.lookup!==entries[0].lookup));
  assert.deepEqual(ids(a),ids(study.recommend(entries,{day:'2026-11-05'})));
});
test('daily state survives reload; refresh and date rollover change every featured word',()=>{
  const originalLocalDay = study.localDay;
  try {
    study.localDay=()=> '2026-11-05';
    const first=app();const a=JSON.parse(JSON.stringify(first.run('dailyWords().map(w=>w.no)')));
    const saved=Object.fromEntries([...first.storage].map(([k,v])=>[k,JSON.parse(v)]));
    const reload=app(scriptOf(html),saved);assert.deepEqual(JSON.parse(JSON.stringify(reload.run('dailyWords().map(w=>w.no)'))),a);
    const b=JSON.parse(JSON.stringify(reload.run('dailyWords(true).map(w=>w.no)')));assert.ok(b.every(id=>!a.includes(id)));
    study.localDay=()=> '2026-11-06';
    const c=JSON.parse(JSON.stringify(reload.run('dailyWords().map(w=>w.no)')));assert.ok(c.every(id=>!a.includes(id)&&!b.includes(id)));
  } finally { study.localDay=originalLocalDay; }
});
test('all-mastered and tiny pools are valid; recommendations never loop or invent words',()=>{
  assert.deepEqual(study.recommend(entries,{day:'x',known:new Set(entries.map(w=>w.lookup))}),[]);
  assert.equal(study.recommend(entries.slice(0,2),{day:'x',history:[{ids:ids(entries.slice(0,2))}]}).length,2);
});
test('collections are explicit lists with real source-backed counts',()=>{
  const expected={conversation:20,'travel-kit':22,'work-kit':19,feelings:20};
  for(const c of study.collections){const list=study.collectionEntries(entries,c.id);assert.equal(list.length,expected[c.id]);assert.ok(list.every(w=>c.words.includes(w.lookup)));}
  assert.deepEqual(study.collectionEntries(entries,'missing'),[]);
});
test('unknown/mastered are exclusive; useful and legacy favorites remain independent after save/reload',()=>{
  const a=app(scriptOf(html),{'vocab.fav':['app'],'vocab.review':['book'],'vocab.useful':['book']});
  a.run("study.setLearning(known,review,'book','known');saveSets()");
  assert.deepEqual(JSON.parse(a.storage.get('vocab.known')),['book']);assert.deepEqual(JSON.parse(a.storage.get('vocab.review')),[]);
  assert.deepEqual(JSON.parse(a.storage.get('vocab.fav')),['app']);assert.deepEqual(JSON.parse(a.storage.get('vocab.useful')),['book']);
  a.run("study.setLearning(known,review,'book','unknown');saveSets()");assert.deepEqual(JSON.parse(a.storage.get('vocab.known')),[]);
  a.run("openShelf('useful')");assert.deepEqual(JSON.parse(JSON.stringify(a.run('filteredEntries().map(w=>w.lookup)'))),['book']);
});
test('ID-based flash deck stays inside selected scope, resumes and never falls back to all words',()=>{
  const a=app();a.run("setMode('flashcard')");const first=a.run('flashWord().no');assert.notEqual(first,1);
  a.run("state.flashIdx=4;renderFlashcard()");const current=a.run('flashWord().no');
  const saved=Object.fromEntries([...a.storage].map(([k,v])=>[k,JSON.parse(v)]));
  const b=app(scriptOf(html),saved);b.run("setMode('flashcard')");assert.equal(b.run('flashWord().no'),current);
  b.run("resetBrowseFilters();state.collectionFilter='conversation';renderFlashcard()");
  assert.ok(study.collectionEntries(entries,'conversation').some(w=>w.no===b.run('flashWord().no')));
  b.run("state.collectionFilter='missing';renderFlashcard()");assert.equal(b.run('deckList().length'),0);assert.equal(b.run('flashWord()'),null);
  assert.deepEqual(study.reconcileOrder([1,2,2,9999],entries.slice(0,2),'scope'),[1,2]);
});
test('cloze blanks entire inflected token once, respects word boundaries and handles irregulars',()=>{
  assert.deepEqual(study.makeCloze({lookup:'paint',headword:'paint',example:'We painted the wall.'}),{question:'We ____ the wall.',answer:'painted'});
  assert.deepEqual(study.makeCloze({lookup:'take',headword:'take',example:'She took the bus.'}),{question:'She ____ the bus.',answer:'took'});
  assert.equal(study.makeCloze({lookup:'app',headword:'app',example:'I am happy.'}),null);
  assert.equal(study.makeCloze({lookup:'book',headword:'book',example:'I booked a book.'}).question,'I ____ a book.');
  for(const w of entries){const c=study.makeCloze(w);if(c){assert.equal(c.question.split('____').length,2);assert.equal(c.question.replace('____',c.answer),w.example);}}
});
test('skipped questions retain their words and reach results without crashing',()=>{
  const a=app();a.run("state.quizQuestions=_data.slice(0,4).map(word=>({type:'cloze',word,cloze:study.makeCloze(word)||{question:'____',answer:word.lookup}}));state.quizQ=0;state.quizAnswers=[];renderQuiz()");
  for(let i=0;i<4;i++){
    a.element('quizCard[data-q="skip"]').click();
    const card=a.element('quizCard');const next=card.children.at(-1);next.click();
  }
  assert.equal(a.run('state.quizAnswers.length'),4);assert.ok(a.element('quizCard').innerHTML.includes('틀린 문제 (4)'));
  assert.equal(JSON.parse(a.storage.get('vocab.review')).length,4);
});
test('storage failure is visible instead of claiming persistence',()=>{
  const a=app();
  assert.equal(a.run("localStorage.setItem=()=>{throw new Error('quota')};lsSet('vocab.useful',['book'])"),false);
  assert.equal(a.element('storageWarning').hidden,false);
  assert.match(a.element('storageWarning').textContent,/저장하지 못했어요/);
});

test('cloze duplicate submit is ignored; navigation away has no quiz timer',()=>{
  const a=app();a.run("state.quizQuestions=[{type:'cloze',word:_data[0],cloze:{question:'____',answer:'a'}}];state.quizQ=0;state.quizAnswers=[];renderQuiz()");
  a.element('qInput').value='a';a.run('submitCloze(_data[0]);submitCloze(_data[0])');assert.equal(a.run('state.quizAnswers.length'),1);
  assert.ok(!/setTimeout/.test(a.run('advanceAfter.toString()')));
});

test('daily UI completes ten fixed IDs, persists resume, and undoes the final answer',()=>{
  const a=app();a.run('startToday()');const selected=a.run('todaySession().ids.join()');
  for(let i=0;i<3;i++)a.run("markFlash('known')");
  const saved=Object.fromEntries([...a.storage].map(([k,v])=>[k,JSON.parse(v)]));
  const b=app(scriptOf(html),saved);b.run('startToday()');
  assert.equal(b.run('sessions.progress(todaySession()).completed'),3);assert.equal(b.run('deckList().length'),10);
  assert.equal(b.run('todaySession().ids.join()'),selected);
  for(let i=0;i<7;i++)b.run("markFlash('unknown')");
  assert.match(b.element('flashcard').innerHTML,/오늘 10단어 학습 완료/);
  assert.equal(b.run('sessions.progress(todaySession()).done'),true);
  b.run('undoFlash()');assert.equal(b.run('sessions.progress(todaySession()).completed'),9);
  assert.equal(b.run('sessions.progress(todaySession()).done'),false);
});
test('ordinary flash undo restores a removed final card and the prior classification',()=>{
  const a=app();a.run("state.searchQuery='app';state.statusFilter='review';review.add('app');setMode('flashcard')");
  assert.equal(a.run('deckList().length'),1);a.run("markFlash('known')");assert.equal(a.run('deckList().length'),0);
  a.run('undoFlash()');assert.equal(a.run('deckList().length'),1);assert.equal(a.run("review.has('app')"),true);assert.equal(a.run("known.has('app')"),false);
});
test('leaving today restores the ordinary deck rather than mixing its ID order',()=>{
  const a=app();a.run("setMode('flashcard');navigateFlash(4)");const old=a.run('flashWord().no');
  a.run("startToday();goHome();setMode('flashcard')");assert.equal(a.run('flashWord().no'),old);
});
test('a directly opened word closes in the app instead of navigating to a foreign page',()=>{
  const a=app();a.run("location.hash='#w=1';history.state=null;history.back=()=>{throw new Error('must not leave app')};history.replaceState=(value,title,url)=>{location.hash='';location.pathname=url};closeWordModal()");
  assert.equal(a.run('location.hash'),'');assert.equal(a.run('location.pathname'),'/');
});
test('search does not replace the home input on its first character or reparent an already placed input',()=>{
  const a=app();assert.equal(a.element('homeSearch').handlers.has('input'),false);
  a.run("window.matchMedia=()=>({matches:true});state.view='list';document.getElementById('searchControl').parentElement=document.getElementById('browseSearchSlot');document.getElementById('browseSearchSlot').appendChild=()=>{throw new Error('focus would be lost')};placeSearch()");
});
test('storage failure preserves current-tab daily progress and warns about persistence',()=>{
  const a=app();a.run("localStorage.setItem=()=>{throw new Error('quota')};startToday();markFlash('unknown')");
  assert.equal(a.run('sessions.progress(todaySession()).completed'),1);
  assert.match(a.element('storageWarning').textContent,/저장하지 못했어요/);
});
