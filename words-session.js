/* A daily unit records study decisions, not a claim of language mastery. */
(function (root) {
  'use strict';
  const study = typeof module !== 'undefined' && module.exports ? require('./words-study.js') : root.VocabStudy;
  function progress(s) {
    const values = s.ids.map(id => s.decisions[id]).filter(v => v === 'known' || v === 'unknown');
    return {completed:values.length,total:s.ids.length,known:values.filter(v=>v==='known').length,unknown:values.filter(v=>v==='unknown').length,done:s.ids.length>0 && values.length===s.ids.length};
  }
  function load(entries, saved, {day,known=new Set(),history=[]}) {
    const available = new Set(entries.map(w=>w.no));
    if (saved && saved.day===day && Array.isArray(saved.ids) && saved.decisions && typeof saved.decisions==='object') {
      const ids=[...new Set(saved.ids)].filter(id=>available.has(id)).slice(0,10);
      const decisions={};
      ids.forEach(id=>{if(['known','unknown'].includes(saved.decisions[id])) decisions[id]=saved.decisions[id];});
      const cursor=Math.max(0,Math.min(Number.isInteger(saved.cursor)?saved.cursor:0,Math.max(0,ids.length-1)));
      const last=saved.last && ids.includes(saved.last.id) && saved.last.flags ? saved.last : null;
      return {day,ids,decisions,cursor,last};
    }
    return {day,ids:study.recommend(entries,{day,known,history,count:10}).map(w=>w.no),decisions:{},cursor:0,last:null};
  }
  function answer(s,id,action,flags) {
    if (!s.ids.includes(id) || !['known','unknown'].includes(action)) return s;
    const decisions={...s.decisions,[id]:action};
    const last={id,cursor:s.cursor,previousDecision:s.decisions[id]||null,flags:{known:!!flags.known,review:!!flags.review}};
    const after=s.ids.findIndex((no,i)=>i>s.cursor && !decisions[no]);
    const remaining=s.ids.findIndex(no=>!decisions[no]);
    return {...s,decisions,last,cursor:after>=0?after:remaining>=0?remaining:s.cursor};
  }
  function undo(s) {
    if (!s.last) return {session:s,previous:null};
    const decisions={...s.decisions};
    if (s.last.previousDecision) decisions[s.last.id]=s.last.previousDecision;
    else delete decisions[s.last.id];
    return {session:{...s,decisions,cursor:s.last.cursor,last:null},previous:s.last};
  }
  function move(s,delta) { return {...s,cursor:Math.max(0,Math.min(s.ids.length-1,s.cursor+delta))}; }
  const api={load,answer,undo,move,progress};
  if(typeof module!=='undefined'&&module.exports) module.exports=api;
  else root.VocabSession=api;
})(typeof window==='undefined'?globalThis:window);
