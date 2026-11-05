/* Learning selection helpers shared by the static page and regression tests. */
(function (root) {
  'use strict';
  const collections = [
    { id: 'conversation', name: '회화의 첫마디', description: '질문하고, 부탁하고, 대답할 때', words: 'ask answer mean want need think know understand explain suggest agree prefer remember forget tell say help try feel enjoy'.split(' ') },
    { id: 'travel-kit', name: '여행에서 바로', description: '예약부터 길 찾기, 주문까지', words: 'book reservation ticket airport flight luggage passport hotel room check arrive leave station train bus trip travel order menu bill pay price address'.split(' ') },
    { id: 'work-kit', name: '직장에서 자주', description: '회의와 일정, 동료와의 대화', words: 'meeting schedule appointment project deadline task report discuss plan change confirm available busy finish send reply team colleague customer request'.split(' ') },
    { id: 'feelings', name: '내 생각과 기분', description: '좋고 싫음, 걱정과 기대 표현하기', words: 'happy sad worried excited nervous tired comfortable disappointed upset glad proud afraid interested hope expect believe opinion reason decide choice'.split(' ') }
  ];
  function hash(text) {
    let n = 2166136261;
    for (const c of String(text)) { n ^= c.charCodeAt(0); n = Math.imul(n, 16777619); }
    return n >>> 0;
  }
  function seededShuffle(items, seed) {
    const out = items.slice();
    let s = hash(seed);
    const random = () => { s += 0x6D2B79F5; let t = s; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
    for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; }
    return out;
  }
  function localDay(date = new Date()) {
    return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
  }
  function recommend(entries, { day, round = 0, known = new Set(), history = [], count = 6 }) {
    const available = entries.filter(w => !known.has(w.lookup));
    const recent = new Set(history.flatMap(h => h.ids || []));
    const shuffled = seededShuffle(available, `${day}:${round}`);
    return shuffled.filter(w => !recent.has(w.no)).concat(shuffled.filter(w => recent.has(w.no))).slice(0, count);
  }
  function collectionEntries(entries, id) {
    const collection = collections.find(c => c.id === id);
    if (!collection) return [];
    const order = new Map(collection.words.map((word, i) => [word, i]));
    return entries.filter(w => order.has(w.lookup)).sort((a, b) => order.get(a.lookup) - order.get(b.lookup));
  }
  function setLearning(known, review, lookup, action) {
    if (action === 'known') { known.add(lookup); review.delete(lookup); }
    if (action === 'unknown') { review.add(lookup); known.delete(lookup); }
  }
  function reconcileOrder(ids, entries, seed) {
    const available = new Set(entries.map(w => w.no));
    const kept = [...new Set(ids || [])].filter(id => available.has(id));
    const seen = new Set(kept);
    return kept.concat(seededShuffle(entries.filter(w => !seen.has(w.no)).map(w => w.no), seed));
  }
  function makeCloze(w) {
    const bases = [...new Set([w.lookup, ...w.headword.split(/,\s*/)].filter(Boolean))];
    const irregular = { be: ['am', 'is', 'are', 'was', 'were', 'been'], have: ['has', 'had'], do: ['does', 'did', 'done'], go: ['went', 'gone'], get: ['got', 'gotten'], take: ['took', 'taken'], make: ['made'], say: ['said'], tell: ['told'], think: ['thought'], buy: ['bought'], bring: ['brought'], leave: ['left'], feel: ['felt'], meet: ['met'], find: ['found'], see: ['saw', 'seen'], give: ['gave', 'given'], write: ['wrote', 'written'], speak: ['spoke', 'spoken'], choose: ['chose', 'chosen'], pay: ['paid'], send: ['sent'], run: ['ran'], know: ['knew', 'known'], understand: ['understood'] };
    const forms = bases.flatMap(base => {
      if (!/^[a-z]+$/i.test(base)) return [base];
      const root = base.replace(/e$/, '');
      return [base, base + 's', base + 'es', base + 'ed', base + 'ing', root + 'ed', root + 'ing', ...(base.endsWith('y') ? [base.slice(0, -1) + 'ies', base.slice(0, -1) + 'ied'] : []), ...(irregular[base] || [])];
    });
    const escape = text => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp('(^|[^A-Za-z])(' + [...new Set(forms)].sort((a, b) => b.length - a.length).map(escape).join('|') + ')(?=$|[^A-Za-z])', 'i');
    const match = String(w.example || '').match(pattern);
    if (!match) return null;
    return { question: w.example.replace(pattern, (_, prefix) => prefix + '____'), answer: match[2] };
  }
  const api = { collections, seededShuffle, localDay, recommend, collectionEntries, setLearning, reconcileOrder, makeCloze };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.VocabStudy = api;
})(typeof window === 'undefined' ? globalThis : window);
