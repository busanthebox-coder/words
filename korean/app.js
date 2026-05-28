const DATA_FILES = [
  './data/words.json',
  './data/expressions.json',
  './data/patterns.json'
];

const TEXTBOOK_FILES = {
  course: './data/course.json',
  grammar: './data/grammar.json',
  activities: './data/activities.json'
};

const DATA_BUNDLE_KEYS = {
  './data/words.json': 'words',
  './data/expressions.json': 'expressions',
  './data/patterns.json': 'patterns',
  './data/course.json': 'course',
  './data/grammar.json': 'grammar',
  './data/activities.json': 'activities'
};

const FORM_GROUPS = [
  {
    key: 'essential',
    label: 'Essential',
    keys: ['dictionary', 'casualPresent', 'politePresent', 'formalPresent', 'negative']
  },
  {
    key: 'conversation',
    label: 'Conversation',
    keys: ['past', 'future', 'want', 'can', 'cannot']
  },
  {
    key: 'survival',
    label: 'Survival Patterns',
    keys: ['must', 'dontHaveTo', 'pleaseDo', 'pleaseDont', 'shallWe']
  }
];

const FORM_LABELS = {
  dictionary: 'Dictionary form',
  casualPresent: 'Casual present',
  politePresent: 'Polite present',
  formalPresent: 'Formal present',
  negative: 'Negative',
  past: 'Past',
  future: 'Future',
  want: 'Want to',
  can: 'Can',
  cannot: 'Cannot',
  must: 'Must / have to',
  dontHaveTo: "Don't have to",
  pleaseDo: 'Please do',
  pleaseDont: "Please don't",
  shallWe: 'Shall we / should I'
};

const FORM_TEACHING = {
  dictionary: {
    meaning: (base) => `to ${base}`,
    use: 'This is the dictionary form. Learn it as the name of the verb, but do not use it alone as a polite sentence.',
    build: 'This is the base form ending in 다.',
    exampleKo: (entry) => `${entry.hangul} means "${entry.english}".`,
    exampleEn: () => 'Use it for lookup and grammar study.'
  },
  casualPresent: {
    meaning: (base) => `I ${base}. / ${base}.`,
    use: 'Casual 반말. Use only with close friends, younger people, children, or when both people already use casual speech.',
    build: 'Remove 다, then add the natural 아/어 casual ending.',
    exampleKo: (_entry, form) => `지금 ${form}.`,
    exampleEn: (base) => `I ${base} now.`
  },
  politePresent: {
    meaning: (base) => `I ${base}.`,
    use: 'Default polite 해요체. This is the safest everyday form for shops, teachers, strangers, and most adult conversation.',
    build: 'Remove 다, then add 아요 or 어요. Many verbs contract naturally.',
    exampleKo: (_entry, form) => `지금 ${form}.`,
    exampleEn: (base) => `I ${base} now.`
  },
  formalPresent: {
    meaning: (base) => `I ${base}.`,
    use: 'Formal 합니다체. Use in presentations, announcements, interviews, written notices, and very formal service speech.',
    build: 'Use 습니다/ㅂ니다 after the verb stem.',
    exampleKo: (_entry, form) => `오늘 ${form}.`,
    exampleEn: (base) => `I ${base} today.`
  },
  negative: {
    meaning: (base) => `I do not ${base}.`,
    use: 'Short everyday negative. It usually means you do not do the action, not that you are unable to do it.',
    build: 'Put 안 before the polite present form. With noun + 하다 verbs, 안 often goes before 하다.',
    exampleKo: (_entry, form) => `오늘은 ${form}.`,
    exampleEn: (base) => `I do not ${base} today.`
  },
  past: {
    meaning: (base) => `I ${pastVerb(base)}.`,
    use: 'Use for completed actions: what happened, what you did, or what already changed.',
    build: 'Use the 아/어 form, then add ㅆ어요: 먹어요 becomes 먹었어요.',
    exampleKo: (_entry, form) => `어제 ${form}.`,
    exampleEn: (base) => `I ${pastVerb(base)} yesterday.`
  },
  future: {
    meaning: (base) => `I will ${base}. / I am going to ${base}.`,
    use: 'Use for plans, intentions, and likely future actions.',
    build: 'Use ㄹ 거예요 after a vowel-ending stem and 을 거예요 after a consonant-ending stem.',
    exampleKo: (_entry, form) => `내일 ${form}.`,
    exampleEn: (base) => `I will ${base} tomorrow.`
  },
  want: {
    meaning: (base) => `I want to ${base}.`,
    use: 'Use for your own wants. It is very common for food, travel, rest, shopping, and study plans.',
    build: 'Remove 다 from the dictionary form, then add 고 싶어요.',
    exampleKo: (_entry, form) => `지금 ${form}.`,
    exampleEn: (base) => `I want to ${base} now.`
  },
  can: {
    meaning: (base) => `I can ${base}.`,
    use: 'Use for ability or possibility. It can mean skill, schedule possibility, or whether something is possible in a situation.',
    build: 'Use ㄹ 수 있어요 after a vowel-ending stem and 을 수 있어요 after a consonant-ending stem.',
    exampleKo: (_entry, form) => `저는 ${form}.`,
    exampleEn: (base) => `I can ${base}.`
  },
  cannot: {
    meaning: (base) => `I cannot ${base}.`,
    use: 'Use when something is impossible because of ability, time, rules, health, or circumstances.',
    build: 'Put 못 before the normal polite verb: 가요 becomes 못 가요, 먹어요 becomes 못 먹어요. Do not add 해요 to a non-하다 verb. For 하다 verbs, use 못 해요 or noun 못 해요.',
    exampleKo: (_entry, form) => `오늘은 ${form}.`,
    exampleEn: (base) => `I cannot ${base} today.`
  },
  must: {
    meaning: (base) => `I have to ${base}.`,
    use: 'Use for rules, obligations, appointments, health needs, work, school, and things you really need to do.',
    build: 'Use the 아/어 form, then add 야 해요.',
    exampleKo: (_entry, form) => `오늘 ${form}.`,
    exampleEn: (base) => `I have to ${base} today.`
  },
  dontHaveTo: {
    meaning: (base) => `I do not have to ${base}.`,
    use: 'Use to say something is optional or not necessary. It often sounds like permission or relief.',
    build: 'Use 안 + 아/어도 돼요 for this starter form, or study the related pattern V지 않아도 돼요.',
    exampleKo: (_entry, form) => `오늘은 ${form}.`,
    exampleEn: (base) => `I do not have to ${base} today.`
  },
  pleaseDo: {
    meaning: (base) => `Please ${base}.`,
    use: 'Use when asking someone else to do the action. Add 좀 when you want the request to sound softer.',
    build: 'Use the 아/어 form, then add 주세요.',
    exampleKo: (_entry, form) => `잠깐 ${form}.`,
    exampleEn: (base) => `Please ${base} for a moment.`
  },
  pleaseDont: {
    meaning: (base) => `Please do not ${base}.`,
    use: 'Use for rules, warnings, or careful requests. It can sound like an instruction, so use it thoughtfully.',
    build: 'Remove 다 from the dictionary form, then add 지 마세요.',
    exampleKo: (_entry, form) => `여기서 ${form}.`,
    exampleEn: (base) => `Please do not ${base} here.`
  },
  shallWe: {
    meaning: (base) => `Shall we ${base}? / Should I ${base}?`,
    use: 'Use for suggestions or checking what action to take. Context decides whether it means “shall we” or “should I.”',
    build: 'Use ㄹ까요 after a vowel-ending stem and 을까요 after a consonant-ending stem.',
    exampleKo: (_entry, form) => `같이 ${form}`,
    exampleEn: (base) => `Shall we ${base} together?`
  }
};

const TYPE_LABELS = { word: 'Word', expression: 'Expression', pattern: 'Pattern' };
const SPEECH_LABELS = { casual: 'Casual', polite: 'Polite', formal: 'Formal' };
const CHOSEONG = ['g','kk','n','d','tt','r','m','b','pp','s','ss','','j','jj','ch','k','t','p','h'];
const JUNGSEONG = ['a','ae','ya','yae','eo','e','yeo','ye','o','wa','wae','oe','yo','u','wo','we','wi','yu','eu','ui','i'];
const JONGSEONG = ['', 'k','k','ks','n','nj','nh','t','l','lk','lm','lb','ls','lt','lp','lh','m','p','ps','t','t','ng','t','t','k','t','p','t'];
const LIAISON = {
  1: ['', 'g'], 2: ['', 'kk'], 3: ['k', 's'], 4: ['', 'n'], 5: ['n', 'j'], 6: ['n', ''],
  7: ['', 'd'], 8: ['', 'r'], 9: ['l', 'g'], 10: ['l', 'm'], 11: ['l', 'b'], 12: ['l', 's'],
  13: ['l', 't'], 14: ['l', 'p'], 15: ['l', ''], 16: ['', 'm'], 17: ['', 'b'], 18: ['p', 's'],
  19: ['', 's'], 20: ['', 'ss'], 22: ['', 'j'], 23: ['', 'ch'], 24: ['', 'k'], 25: ['', 't'],
  26: ['', 'p'], 27: ['', '']
};

const COURSE_UNITS = [
  {
    title: 'Start Speaking Politely',
    outcome: 'Greet someone, answer yes/no, say thank you, apologize, and keep the interaction polite.',
    scenario: 'First day in class, a shop, or a meeting.',
    entryIds: ['expr-001','expr-002','expr-003','expr-004','expr-006','expr-007','expr-008','expr-009'],
    patternIds: ['pattern-001'],
    task: 'Introduce yourself with one greeting, one name sentence, and one polite closing.'
  },
  {
    title: 'Make Your First Sentences',
    outcome: 'Use polite present verbs to say what you do now or every day.',
    scenario: 'Daily routine and classroom check-ins.',
    entryIds: ['word-verb-001','word-verb-002','word-verb-003','word-verb-004','word-verb-007','word-verb-015','word-verb-016'],
    patternIds: ['pattern-009','pattern-010'],
    task: 'Say three things you do and one thing you do not do today.'
  },
  {
    title: 'Want, Can, Cannot',
    outcome: 'Talk about wants, ability, and limits without sounding rude.',
    scenario: 'Food choices, schedules, language ability, and travel limits.',
    entryIds: ['word-verb-001','word-verb-003','word-verb-014','word-verb-018','expr-020','expr-021','expr-022','expr-023'],
    patternIds: ['pattern-005','pattern-006','pattern-007','pattern-008'],
    task: 'Say what you want to do, what you can do, and what you cannot do.'
  },
  {
    title: 'Survival Requests',
    outcome: 'Ask for help, ask permission, say what is required, and understand prohibitions.',
    scenario: 'Restaurants, classrooms, museums, stores, and public spaces.',
    entryIds: ['expr-012','expr-014','expr-015','expr-016','expr-017','expr-018','expr-024','word-verb-024','word-verb-030'],
    patternIds: ['pattern-011','pattern-012','pattern-013','pattern-014','pattern-015','pattern-016'],
    task: 'Ask for one item, ask someone to do one action, and ask if something is okay.'
  },
  {
    title: 'Food And Shopping',
    outcome: 'Order food, ask prices, pay, and explain basic food or payment restrictions.',
    scenario: 'Cafe, restaurant, convenience store, and market.',
    entryIds: ['word-verb-001','word-verb-002','word-verb-006','word-verb-028','expr-010','expr-011','expr-012','expr-013','expr-014','expr-015'],
    patternIds: ['pattern-004','pattern-007','pattern-008','pattern-013'],
    task: 'Order one thing, ask the price, and ask whether card payment is possible.'
  },
  {
    title: 'Travel And Transportation',
    outcome: 'Ask where things are, take transportation, get off, and explain you are lost.',
    scenario: 'Subway station, taxi, hotel, street, or airport.',
    entryIds: ['word-verb-003','word-verb-019','word-verb-020','word-verb-021','word-verb-029','expr-016','expr-017','expr-018','expr-019','expr-024','expr-025'],
    patternIds: ['pattern-002','pattern-003','pattern-011','pattern-013'],
    task: 'Ask where the bathroom or station is, then say where you need to go.'
  },
  {
    title: 'Classroom Korean',
    outcome: 'Ask someone to repeat, slow down, explain again, and say what you understand.',
    scenario: 'Korean class, tutoring, or language exchange.',
    entryIds: ['word-verb-011','word-verb-012','word-verb-013','word-verb-014','word-verb-015','expr-020','expr-021','expr-022','expr-023'],
    patternIds: ['pattern-007','pattern-008','pattern-015'],
    task: 'Tell a teacher you do not understand yet and ask them to say it again slowly.'
  },
  {
    title: 'Connect Your Ideas',
    outcome: 'Move beyond single sentences using because, and, if/when, and speaker promises.',
    scenario: 'Explaining reasons, making simple plans, and connecting daily actions.',
    entryIds: ['word-verb-026','word-verb-027','word-verb-028','word-verb-029','word-verb-030','expr-027','expr-030'],
    patternIds: ['pattern-017','pattern-018','pattern-019','pattern-020'],
    task: 'Make one sentence with a reason and one sentence with a condition.'
  }
];

const PARTICLE_GUIDES = [
  {
    particle: '은 / 는',
    romanization: 'eun / neun',
    title: 'Topic and contrast',
    meaning: '“As for...” or “when we talk about this...”',
    rule: 'Use 은 after a final consonant and 는 after a vowel: 학생은, 저는.',
    use: 'Use it to set the topic of the sentence, introduce yourself, or contrast one thing with another.',
    examples: [
      ['저는 학생이에요.', 'jeoneun haksaeng-ieyo.', 'As for me, I am a student.'],
      ['오늘은 못 가요.', 'oneureun mot gayo.', 'As for today, I cannot go.'],
      ['이건 뭐예요?', 'igeon mwoyeyo?', 'What is this?']
    ],
    watch: 'Do not translate it as a separate English word every time. It often just tells the listener what the sentence is about.'
  },
  {
    particle: '이 / 가',
    romanization: 'i / ga',
    title: 'Subject and new information',
    meaning: 'Marks who or what the sentence is identifying or talking about right now.',
    rule: 'Use 이 after a final consonant and 가 after a vowel: 시간이, 친구가.',
    use: 'Use it with existence, absence, feelings, body parts, and when the subject is new or important.',
    examples: [
      ['시간이 있어요.', 'sigani isseoyo.', 'I have time. / There is time.'],
      ['친구가 와요.', 'chinguga wayo.', 'A friend is coming.'],
      ['머리가 아파요.', 'meoriga apayo.', 'My head hurts.']
    ],
    watch: '은/는 sets the topic; 이/가 points to the subject more directly. Beginners can first memorize common chunks like 시간이 있어요 and 머리가 아파요.'
  },
  {
    particle: '을 / 를',
    romanization: 'eul / reul',
    title: 'Object marker',
    meaning: 'Marks the thing that receives the action.',
    rule: 'Use 을 after a final consonant and 를 after a vowel: 밥을, 커피를.',
    use: 'Use it with action verbs such as eat, drink, buy, read, write, study, and watch.',
    examples: [
      ['밥을 먹어요.', 'babeul meogeoyo.', 'I eat rice / a meal.'],
      ['커피를 마셔요.', 'keopireul masyeoyo.', 'I drink coffee.'],
      ['한국어를 공부해요.', 'hangugeoreul gongbuhaeyo.', 'I study Korean.']
    ],
    watch: 'In fast conversation Koreans often drop 을/를, but learners should understand it because it makes sentence structure clear.'
  },
  {
    particle: '에',
    romanization: 'e',
    title: 'Time, destination, and existence location',
    meaning: 'At, to, in, or on, depending on the sentence.',
    rule: 'Attach 에 after a time, destination, or location where something exists.',
    use: 'Use 에 for where you go, when something happens, or where something is.',
    examples: [
      ['학교에 가요.', 'hakgyoe gayo.', 'I go to school.'],
      ['7시에 일어나요.', 'ilgopsie ireonayo.', 'I wake up at seven.'],
      ['집에 있어요.', 'jibe isseoyo.', 'I am at home.']
    ],
    watch: 'For destination, use 에. For where an action happens, use 에서: 학교에 가요 but 학교에서 공부해요.'
  },
  {
    particle: '에서',
    romanization: 'eseo',
    title: 'Action place and starting point',
    meaning: 'At/in a place where an action happens, or from a place.',
    rule: 'Attach 에서 after the place where the action is happening.',
    use: 'Use it with verbs like study, work, eat, wait, buy, and meet when the location is the action setting.',
    examples: [
      ['학교에서 공부해요.', 'hakgyoeseo gongbuhaeyo.', 'I study at school.'],
      ['회사에서 일해요.', 'hoesaeseo ilhaeyo.', 'I work at a company.'],
      ['서울에서 왔어요.', 'seoureseo wasseoyo.', 'I came from Seoul.']
    ],
    watch: 'Do not use 에서 for simple destination with 가다. Say 학교에 가요, not 학교에서 가요.'
  },
  {
    particle: '에게 / 한테',
    romanization: 'ege / hante',
    title: 'To a person',
    meaning: 'To someone, usually for giving, telling, asking, or sending.',
    rule: '에게 is neutral or written; 한테 is common in speech. Use 께 for honorific speech.',
    use: 'Use it when a person receives an item, message, action, or question.',
    examples: [
      ['친구에게 줘요.', 'chingu-ege jwoyo.', 'I give it to a friend.'],
      ['저한테 주세요.', 'jeohante juseyo.', 'Please give it to me.'],
      ['선생님께 물어봐요.', 'seonsaengnimkke mureobwayo.', 'I ask the teacher.']
    ],
    watch: '에게/한테 is for people or animals, not normal destinations. For “go to school,” use 학교에 가요.'
  },
  {
    particle: '로 / 으로',
    romanization: 'ro / euro',
    title: 'Method, direction, and language',
    meaning: 'By, with, toward, or in a language.',
    rule: 'Use 로 after a vowel or ㄹ ending. Use 으로 after most consonants: 카드로, 지하철로, 펜으로.',
    use: 'Use it for transportation, payment method, tools, direction, and language.',
    examples: [
      ['카드로 살 수 있어요?', 'kadeuro sal su isseoyo?', 'Can I buy it by card?'],
      ['한국어로 말해요.', 'hangugeoro malhaeyo.', 'I speak in Korean.'],
      ['지하철로 가요.', 'jihacheollo gayo.', 'I go by subway.']
    ],
    watch: '로/으로 does not mark the object. 카드로 사요 means “buy by card,” not “buy a card.”'
  },
  {
    particle: '도',
    romanization: 'do',
    title: 'Also / too / even',
    meaning: 'Adds something to the same idea.',
    rule: 'Attach 도 after the word you are adding: 저도, 이것도, 오늘도.',
    use: 'Use it to say “me too,” “this too,” or “today too.”',
    examples: [
      ['저도 가요.', 'jeodo gayo.', 'I am going too.'],
      ['이것도 주세요.', 'igeotdo juseyo.', 'This too, please.'],
      ['오늘도 공부해요.', 'oneuldo gongbuhaeyo.', 'I study today too.']
    ],
    watch: '도 often replaces 은/는, 이/가, or 을/를 in the same position. 저도 가요 is more natural than 저는도 가요.'
  },
  {
    particle: '만',
    romanization: 'man',
    title: 'Only / just',
    meaning: 'Limits the sentence to one thing.',
    rule: 'Attach 만 after the word you want to limit: 물만, 오늘만, 이것만.',
    use: 'Use it for ordering, restrictions, schedules, and polite limits.',
    examples: [
      ['물만 마셔요.', 'mulman masyeoyo.', 'I only drink water.'],
      ['오늘만 쉬어요.', 'oneulman swieoyo.', 'I rest only today.'],
      ['이것만 주세요.', 'igeotman juseyo.', 'Only this, please.']
    ],
    watch: '만 changes the focus of the sentence. 고기만 안 먹어요 means “only meat, I do not eat,” not “I only do not eat.”'
  },
  {
    particle: '부터 / 까지',
    romanization: 'buteo / kkaji',
    title: 'From / until',
    meaning: 'Marks the starting point and ending point.',
    rule: 'Use 부터 for the start and 까지 for the end.',
    use: 'Use it with time, place, schedules, business hours, and travel range.',
    examples: [
      ['9시부터 6시까지 일해요.', 'ahopssibuteo yeoseotssikkaji ilhaeyo.', 'I work from 9 to 6.'],
      ['월요일부터 금요일까지 공부해요.', 'woryoilbuteo geumyoilkkaji gongbuhaeyo.', 'I study from Monday to Friday.'],
      ['여기부터 역까지 걸어요.', 'yeogibuteo yeokkkaji georeoyo.', 'I walk from here to the station.']
    ],
    watch: '까지 can mean “until” for time or “as far as” for place. Context decides the English.'
  }
];

const CURRICULUM_GUIDE = [
  {
    title: 'Before Unit 1: Hangul and sound',
    tag: 'Foundation',
    goal: 'Read Korean syllable blocks accurately before relying on romanization.',
    points: [
      'Know that each block is built from initial consonant + vowel + optional final consonant.',
      'Practice final consonants because they affect the next syllable: 먹어요 sounds smoother than separate meok-eo-yo.',
      'Use romanization only as a support, then switch your attention back to Hangul and audio.'
    ],
    task: 'Read five phrases from the particle section aloud, then play the audio and compare.'
  },
  {
    title: 'Every unit: vocabulary, grammar, conversation',
    tag: 'Study loop',
    goal: 'Do not study words alone. Move from word to pattern to real exchange.',
    points: [
      'Vocabulary: learn the Korean chunk and one common sentence frame.',
      'Grammar: learn the particle or ending that makes the sentence work.',
      'Conversation: say the item inside a mini dialogue, then change one word.'
    ],
    task: 'Open one word card, one related pattern, and one expression before doing the final task.'
  },
  {
    title: 'Beginner functions to cover',
    tag: 'Can-do map',
    goal: 'Make sure the course teaches survival communication, not only translation.',
    points: [
      'Greeting and introducing yourself politely.',
      'Ordering food, buying items, asking price, and paying.',
      'Asking location, using transportation, making phone/classroom requests, and inviting or suggesting.'
    ],
    task: 'After each unit, say one sentence you would actually use in Korea today.'
  },
  {
    title: 'Culture and politeness layer',
    tag: 'Usage',
    goal: 'Choose a sentence that fits the person and situation.',
    points: [
      'Default to 해요체 with adults, staff, teachers, and strangers.',
      'Notice titles and honorific direction before using casual speech.',
      'Learn signs and staff instructions such as V지 마세요 even if you do not use them often yourself.'
    ],
    task: 'For each expression, decide whether it is casual, polite everyday, or formal/service speech.'
  }
];

const $ = (id) => document.getElementById(id);
const esc = (s = '') => String(s).replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[c]));
const norm = (s = '') => String(s).toLowerCase().trim();
const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];
const shuffle = (arr) => arr.slice().sort(() => Math.random() - 0.5);
const hasHangul = (s = '') => /[가-힣]/.test(String(s));

function romanizeKorean(text = '') {
  const chars = String(text).split('');
  let carry = '';
  return chars.map((char, index) => {
    const code = char.charCodeAt(0);
    if (code < 0xac00 || code > 0xd7a3) return char;
    const offset = code - 0xac00;
    const initial = Math.floor(offset / 588);
    const vowel = Math.floor((offset % 588) / 28);
    const final = offset % 28;
    const nextCode = chars[index + 1]?.charCodeAt(0) || 0;
    const nextOffset = nextCode - 0xac00;
    const nextInitial = nextCode >= 0xac00 && nextCode <= 0xd7a3 ? Math.floor(nextOffset / 588) : -1;
    const liaison = final && nextInitial === 11 ? LIAISON[final] : null;
    const onset = carry || CHOSEONG[initial];
    carry = liaison?.[1] || '';
    return onset + JUNGSEONG[vowel] + (liaison ? liaison[0] : JONGSEONG[final]);
  }).join('').replace(/\s+/g, ' ').trim();
}

function romanizationLine(text = '', provided = '') {
  const value = provided || (hasHangul(text) ? romanizeKorean(text) : '');
  return value ? `<div class="romanization">${esc(value)}</div>` : '';
}

const state = {
  entries: [],
  chapters: [],
  grammarItems: [],
  endingItems: [],
  curriculumGuide: [],
  functionTags: [],
  chapterActivities: [],
  mode: 'course',
  search: '',
  filters: {
    type: new Set(),
    level: new Set(),
    topic: new Set(),
    pos: new Set(),
    hasConjugation: false,
    irregular: false
  },
  speechLevel: 'polite',
  selectedId: null,
  flashIdx: 0,
  flashRevealed: false,
  flashOrder: [],
  deckSignature: '',
  quizIdx: 0,
  quizQuestions: [],
  quizAnswers: [],
  quizChapterId: null,
  paletteFocus: 0
};

const saved = {
  known: new Set(JSON.parse(localStorage.getItem('korean.known') || '[]')),
  review: new Set(JSON.parse(localStorage.getItem('korean.review') || '[]')),
  favorite: new Set(JSON.parse(localStorage.getItem('korean.favorite') || '[]'))
};

function saveProgress() {
  localStorage.setItem('korean.known', JSON.stringify([...saved.known]));
  localStorage.setItem('korean.review', JSON.stringify([...saved.review]));
  localStorage.setItem('korean.favorite', JSON.stringify([...saved.favorite]));
}

async function init() {
  try {
    const [payloads, course, grammar, activities] = await Promise.all([
      Promise.all(DATA_FILES.map(file => fetchJson(file))),
      fetchJson(TEXTBOOK_FILES.course),
      fetchJson(TEXTBOOK_FILES.grammar),
      fetchJson(TEXTBOOK_FILES.activities)
    ]);
    state.entries = payloads.flatMap(p => p.entries || []).sort((a, b) => a.sort - b.sort);
    state.chapters = (course.chapters || []).sort((a, b) => a.number - b.number);
    state.curriculumGuide = course.curriculumGuide || [];
    state.functionTags = course.functionTags || [];
    state.grammarItems = grammar.grammarItems || [];
    state.endingItems = grammar.endingItems || [];
    state.chapterActivities = activities.chapterActivities || [];
    wireGlobalEvents();
    renderFilters();
    renderCourse();
    renderBrowse();
  } catch (err) {
    const serverUrl = window.KOREAN_CORE_SERVER_URL || 'http://127.0.0.1:4173/korean/';
    const fileHint = location.protocol === 'file:'
      ? `<p><a class="primary-link" href="${serverUrl}">Open ${serverUrl}</a></p>`
      : '';
    const errorHtml = `
      <div class="empty-state">
        <div>
          <h1>Could not load Korean Core Starter.</h1>
          <p>Run this folder through a local server so the browser can fetch JSON files.</p>
          ${fileHint}
          <p class="muted">${esc(err.message)}</p>
        </div>
      </div>
    `;
    $('courseView').innerHTML = errorHtml;
    $('browseView').innerHTML = errorHtml;
  }
}

async function fetchJson(file) {
  const bundled = bundledJson(file);
  if (location.protocol === 'file:' && bundled) return bundled;

  try {
    const res = await fetch(file);
    if (!res.ok) throw new Error(`${file} returned ${res.status}`);
    return res.json();
  } catch (err) {
    if (bundled) return bundled;
    throw err;
  }
}

function bundledJson(file) {
  const key = DATA_BUNDLE_KEYS[file];
  const bundle = window.KOREAN_CORE_DATA;
  if (!key || !bundle || !bundle[key]) return null;
  return structuredCloneSafe(bundle[key]);
}

function structuredCloneSafe(value) {
  if (typeof structuredClone === 'function') return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}

function wireGlobalEvents() {
  document.querySelectorAll('.mode-tab').forEach(btn => {
    btn.addEventListener('click', () => setMode(btn.dataset.mode));
  });
  $('homeButton').addEventListener('click', goHome);
  $('searchInput').addEventListener('input', e => {
    state.search = e.target.value;
    renderBrowse();
  });
  $('clearFilters').addEventListener('click', clearFilters);
  $('shuffleDeck').addEventListener('click', () => {
    state.flashOrder = shuffle(filteredEntries().map(e => e.id));
    state.flashIdx = 0;
    state.flashRevealed = false;
    renderFlashcard();
  });
  $('modalClose').addEventListener('click', closeDetail);
  $('detailModal').addEventListener('click', e => {
    if (e.target === $('detailModal')) closeDetail();
  });
  $('searchButton').addEventListener('click', openPalette);
  $('paletteModal').addEventListener('click', e => {
    if (e.target === $('paletteModal')) closePalette();
  });
  $('paletteInput').addEventListener('input', e => renderPalette(e.target.value));
  $('paletteInput').addEventListener('keydown', handlePaletteKeys);
  document.addEventListener('keydown', handleKeys);
}

function setMode(mode) {
  state.mode = mode;
  document.querySelectorAll('.mode-tab').forEach(btn => btn.classList.toggle('is-active', btn.dataset.mode === mode));
  document.querySelectorAll('.pane').forEach(pane => pane.classList.remove('is-active'));
  $(`${mode}Pane`).classList.add('is-active');
  if (mode === 'course') renderCourse();
  if (mode === 'browse') renderBrowse();
  if (mode === 'flashcard') {
    resetDeckIfNeeded();
    renderFlashcard();
  }
  if (mode === 'quiz') {
    if (state.quizChapterId) startChapterQuiz(state.quizChapterId, false);
    else startQuiz();
  }
}

function filteredEntries() {
  let list = state.entries.slice();
  const { type, level, topic, pos, hasConjugation, irregular } = state.filters;
  if (type.size) list = list.filter(e => type.has(e.type));
  if (level.size) list = list.filter(e => level.has(e.level));
  if (topic.size) list = list.filter(e => (e.topic || []).some(t => topic.has(t)));
  if (pos.size) list = list.filter(e => pos.has(e.partOfSpeech || 'pattern'));
  if (hasConjugation) list = list.filter(e => !!e.forms || !!e.speechLevels);
  if (irregular) list = list.filter(e => !!e.irregular);
  if (state.search.trim()) {
    const q = norm(state.search);
    list = list.filter(e => searchableText(e).includes(q));
  }
  return list;
}

function searchableText(e) {
  return norm([
    e.hangul, e.romanization, e.english, e.shortExplanation, e.explanation, e.nuance, e.partOfSpeech,
    e.studyGuide?.title, e.studyGuide?.whenToUse, e.studyGuide?.learnerPath,
    ...(e.studyGuide?.howToBuild || []),
    ...(e.topic || []),
    ...(e.tags || []),
    ...(e.usagePhrases || []).flatMap(x => [x.ko, x.romanization, x.en, x.note]),
    ...(e.examples || []).flatMap(x => [x.ko, x.romanization, x.en, x.note]),
    ...(e.commonMistakes || [])
  ].join(' '));
}

function renderFilters() {
  renderFilterGroup('typeFilters', ['word', 'expression', 'pattern'], 'type', TYPE_LABELS);
  renderFilterGroup('levelFilters', unique('level'), 'level');
  renderFilterGroup('topicFilters', uniqueTopics(), 'topic', null, titleCase);
  renderFilterGroup('posFilters', unique('partOfSpeech').filter(Boolean), 'pos', null, titleCase);
  $('hasConjugationCount').textContent = count(e => !!e.forms || !!e.speechLevels);
  $('irregularCount').textContent = count(e => !!e.irregular);
  document.querySelectorAll('[data-toggle]').forEach(btn => {
    btn.classList.toggle('is-active', !!state.filters[btn.dataset.toggle]);
    btn.onclick = () => {
      state.filters[btn.dataset.toggle] = !state.filters[btn.dataset.toggle];
      renderFilters();
      renderBrowse();
    };
  });
}

function renderFilterGroup(containerId, values, key, labels = null, formatter = (x) => x) {
  const container = $(containerId);
  container.innerHTML = values.map(value => `
    <button class="filter-row ${state.filters[key].has(value) ? 'is-active' : ''}" type="button" data-filter-key="${key}" data-filter-value="${esc(value)}">
      ${esc(labels?.[value] || formatter(value))}
      <span>${countByFilter(key, value)}</span>
    </button>
  `).join('');
  container.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      const set = state.filters[btn.dataset.filterKey];
      if (set.has(btn.dataset.filterValue)) set.delete(btn.dataset.filterValue);
      else set.add(btn.dataset.filterValue);
      renderFilters();
      renderBrowse();
    });
  });
}

function unique(key) {
  return [...new Set(state.entries.map(e => e[key]).filter(Boolean))].sort((a, b) => String(a).localeCompare(String(b)));
}
function uniqueTopics() {
  return [...new Set(state.entries.flatMap(e => e.topic || []))].sort((a, b) => a.localeCompare(b));
}
function count(predicate) {
  return state.entries.filter(predicate).length;
}
function countByFilter(key, value) {
  if (key === 'topic') return state.entries.filter(e => (e.topic || []).includes(value)).length;
  if (key === 'pos') return state.entries.filter(e => (e.partOfSpeech || 'pattern') === value).length;
  return state.entries.filter(e => e[key] === value).length;
}
function findEntry(id) {
  return state.entries.find(e => e.id === id);
}
function findGrammar(id) {
  return [...state.grammarItems, ...state.endingItems].find(item => item.id === id);
}
function chapterActivities(chapterId) {
  return state.chapterActivities.find(group => group.chapterId === chapterId)?.items || [];
}
function baseEnglish(entry) {
  return (entry.english || '').replace(/^to /, '');
}
function pastVerb(base) {
  const irregular = {
    eat: 'ate',
    drink: 'drank',
    go: 'went',
    come: 'came',
    'see / watch': 'saw / watched',
    buy: 'bought',
    do: 'did',
    sleep: 'slept',
    'wake up / get up': 'woke up / got up',
    sit: 'sat',
    read: 'read',
    'write / use': 'wrote / used',
    listen: 'listened',
    'speak / say': 'spoke / said',
    study: 'studied',
    work: 'worked',
    meet: 'met',
    wait: 'waited',
    'ride / take': 'rode / took',
    'get off': 'got off',
    'find / look for': 'found / looked for',
    give: 'gave',
    receive: 'received',
    open: 'opened',
    close: 'closed',
    rest: 'rested',
    'call by phone': 'called',
    order: 'ordered',
    'reserve / book': 'reserved / booked',
    'take a photo': 'took a photo'
  };
  return irregular[base] || `${base}ed`;
}
function titleCase(s = '') {
  return s.replace(/-/g, ' ').replace(/\b\w/g, m => m.toUpperCase());
}

function renderBrowse() {
  resetDeckIfNeeded();
  renderFilters();
  const list = filteredEntries();
  const hasFilters = state.search.trim() || Object.values(state.filters).some(v => v instanceof Set ? v.size : v);
  $('browseView').innerHTML = hasFilters ? renderList(list) : renderHome();
  wireBrowseCards();
}

function renderCourse() {
  const chapters = state.chapters.length ? state.chapters : COURSE_UNITS.map((unit, index) => ({
    ...unit,
    id: `legacy-${index + 1}`,
    number: index + 1,
    goal: unit.outcome,
    linkedEntryIds: [...unit.entryIds, ...unit.patternIds],
    coreVocabularyIds: unit.entryIds,
    grammarFocus: [],
    realLifeTask: unit.task
  }));
  const totalItems = chapters.reduce((sum, chapter) => {
    const linked = new Set([
      ...(chapter.linkedEntryIds || []),
      ...state.entries.filter(entry => (entry.chapterIds || []).includes(chapter.id)).map(entry => entry.id)
    ]);
    return sum + linked.size + (chapter.grammarFocus || []).length;
  }, 0);
  $('courseView').innerHTML = `
    <section class="course-hero" id="course-top">
      <div class="course-hero-inner">
        <div class="eyebrow">Web textbook path</div>
        <h1>Korean Core Starter</h1>
        <p>Eleven beginner chapters built like a web textbook: Hangul, grammar spine, guided practice, real-life tasks, review quizzes, and linked learner cards.</p>
        <div class="course-stats">
          <div><strong>${chapters.length}</strong><span>chapters</span></div>
          <div><strong>${state.entries.length}</strong><span>cards</span></div>
          <div><strong>${totalItems}</strong><span>study links</span></div>
        </div>
      </div>
    </section>
    ${renderCourseJumpNav(chapters)}
    <section class="section">
      <div class="textbook-note">
        <strong>How to use this course</strong>
        <span>Follow the units in order. Use romanization as a pronunciation helper, but listen to the Korean audio whenever possible because Korean sounds change across syllables.</span>
      </div>
    </section>
    <section class="section" id="course-map">
      <div class="section-head"><h2>Textbook-style study map</h2><span class="muted">Built from beginner curriculum patterns</span></div>
      ${renderCurriculumGuide()}
    </section>
    <section class="section" id="course-grammar">
      <div class="section-head"><h2>Grammar spine before more words</h2><span class="muted">Particles, endings, frames, mistakes, and practice</span></div>
      ${renderParticleGuide()}
    </section>
    <section class="section" id="course-card-guide">
      <div class="section-head"><h2>Inside every lesson card</h2><span class="muted">Built for self-study and classroom review</span></div>
      <div class="book-feature-grid">
        ${[
          ['Meaning in context', 'A plain-English explanation of when the Korean is natural.'],
          ['Common ways to say it', 'Reusable chunks with Hangul, romanization, English, and notes.'],
          ['Mini dialogue', 'A short exchange so the item is learned as conversation, not a list.'],
          ['Forms and patterns', 'Verb forms show meaning, use, build rule, example, audio, and linked grammar.'],
          ['Learner warnings', 'Common beginner mistakes are called out directly.'],
          ['Self-check', 'Quick questions to confirm the student can actually use the item.']
        ].map(([title, body]) => `
          <div class="book-feature">
            <strong>${esc(title)}</strong>
            <span>${esc(body)}</span>
          </div>
        `).join('')}
      </div>
    </section>
    <section class="section" id="course-chapters">
      <div class="unit-list">
        ${chapters.map((chapter, index) => renderChapter(chapter, index, chapters)).join('')}
      </div>
    </section>
  `;
  wireBrowseCards();
  wireCourseActions();
}

function renderCourseJumpNav(chapters) {
  return `
    <section class="course-jump-wrap" aria-label="Course quick navigation">
      <div class="course-jump">
        <button type="button" data-course-jump="course-map">Study map</button>
        <button type="button" data-course-jump="course-grammar">Grammar spine</button>
        <button type="button" data-course-jump="course-card-guide">Card guide</button>
        <button type="button" data-course-jump="course-chapters">Chapters</button>
        ${chapters.map(chapter => `
          <button type="button" data-course-jump="${esc(chapter.id)}">
            ${esc(`Ch ${chapter.number}`)}
          </button>
        `).join('')}
      </div>
    </section>
  `;
}

function renderCurriculumGuide() {
  const guide = state.curriculumGuide.length ? state.curriculumGuide : CURRICULUM_GUIDE;
  const tags = state.functionTags.length
    ? state.functionTags
    : ['Hangul reading', 'Basic particles', 'Polite endings', 'Greeting', 'Self-introduction', 'Ordering food', 'Shopping', 'Directions', 'Transportation', 'Phone/classroom help', 'Inviting', 'Culture and titles'];
  return `
    <div class="curriculum-note">
      <strong>What changed after benchmarking</strong>
      <span>The course now separates the learner path into foundation reading, vocabulary, grammar, conversation, task practice, and politeness. This matches the way serious beginner programs build from Hangul and short sentence structure into real-life functions.</span>
    </div>
    <div class="curriculum-grid">
      ${guide.map(item => `
        <article class="curriculum-card">
          <div class="curriculum-card-head">
            <span>${esc(item.tag)}</span>
            <h3>${esc(item.title)}</h3>
          </div>
          <p>${esc(item.goal)}</p>
          <ul>${item.points.map(point => `<li>${esc(point)}</li>`).join('')}</ul>
          <div class="curriculum-task"><strong>Practice:</strong> ${esc(item.task)}</div>
        </article>
      `).join('')}
    </div>
    <div class="function-strip">
      ${tags.map(item => `<span>${esc(item)}</span>`).join('')}
    </div>
  `;
}

function renderParticleGuide() {
  const particles = state.grammarItems.length ? state.grammarItems.filter(item => item.type === 'particle') : PARTICLE_GUIDES;
  return `
    <div class="particle-intro">
      <strong>Why this matters</strong>
      <span>Korean particles are small endings attached to nouns. They show the job of each word in the sentence: topic, subject, object, place, person, method, limit, or range. Learn them as sentence frames with examples, mistakes, and practice.</span>
    </div>
    <div class="particle-compare">
      <div>
        <strong>은/는 vs 이/가</strong>
        <span>은/는 sets the topic or contrast. 이/가 points to the subject or new information.</span>
        <em>저는 학생이에요. 시간이 있어요.</em>
      </div>
      <div>
        <strong>에 vs 에서</strong>
        <span>에 is for destination, time, or where something exists. 에서 is where an action happens.</span>
        <em>학교에 가요. 학교에서 공부해요.</em>
      </div>
      <div>
        <strong>에게/한테 vs 에</strong>
        <span>에게/한테 goes to a person. 에 goes to a place.</span>
        <em>친구에게 줘요. 학교에 가요.</em>
      </div>
    </div>
    <div class="particle-grid">
      ${particles.map(renderParticleCard).join('')}
    </div>
  `;
}

function renderParticleCard(item) {
  const examples = (item.examples || []).map(example => Array.isArray(example) ? {
    ko: example[0],
    romanization: example[1],
    en: example[2]
  } : example);
  const frames = item.sentenceFrames || [];
  const mistakes = item.commonMistakes || (item.watch ? [item.watch] : []);
  return `
    <article class="particle-card">
      <div class="particle-head">
        <div>
          <h3>${esc(item.hangul || item.particle)}</h3>
          <div class="romanization">${esc(item.romanization)}</div>
        </div>
        <span>${esc(item.title)}</span>
      </div>
      <p class="particle-meaning">${esc(item.plainEnglish || item.meaning)}</p>
      <div class="particle-rule"><strong>Attach:</strong> ${esc(item.attachmentRule || item.rule)}</div>
      <div class="particle-use"><strong>Use:</strong> ${esc(item.whenToUse || item.use)}</div>
      ${item.contrastWith ? `<div class="particle-use"><strong>Compare:</strong> ${esc(item.contrastWith)}</div>` : ''}
      ${item.beginnerExplanation ? `<div class="particle-use beginner-explain"><strong>Beginner explanation:</strong> ${esc(item.beginnerExplanation)}</div>` : ''}
      ${frames.length ? `<div class="frame-row">${frames.map(frame => `<code>${esc(frame)}</code>`).join('')}</div>` : ''}
      <div class="particle-examples">
        ${examples.map(({ ko, romanization, en }) => `
          <div>
            <div class="example-ko">${esc(ko)} ${speakButton(ko)}</div>
            ${romanizationLine(ko, romanization)}
            <div class="example-en">${esc(en)}</div>
          </div>
        `).join('')}
      </div>
      <div class="particle-watch"><strong>Watch out:</strong> ${mistakes.map(esc).join(' ')}</div>
    </article>
  `;
}

function renderChapter(chapter, index, chapters = []) {
  const chapterEntryIds = new Set([
    ...(chapter.linkedEntryIds || []),
    ...state.entries.filter(entry => (entry.chapterIds || []).includes(chapter.id)).map(entry => entry.id)
  ]);
  const entries = [...chapterEntryIds].map(findEntry).filter(Boolean);
  const coreIds = new Set([
    ...(chapter.coreVocabularyIds || chapter.entryIds || []),
    ...entries.filter(entry => entry.type === 'word').map(entry => entry.id)
  ]);
  const core = [...coreIds].map(findEntry).filter(Boolean).slice(0, 10);
  const patterns = (chapter.patternIds || []).map(findEntry).filter(Boolean);
  const grammar = (chapter.grammarFocus || []).map(findGrammar).filter(Boolean);
  const activities = chapterActivities(chapter.id).slice(0, 5);
  const prev = chapters[index - 1];
  const next = chapters[index + 1];
  return `
    <article class="unit-card" id="${esc(chapter.id)}">
      <div class="unit-number">Chapter ${chapter.number || index + 1}</div>
      <div class="unit-main">
        <h2>${esc(chapter.title)}</h2>
        <p class="unit-outcome">${esc(chapter.goal || chapter.outcome)}</p>
        <div class="unit-meta">
          <span>${esc(chapter.scenario || 'Beginner Korean')}</span>
          <span>${entries.length} cards</span>
          <span>${grammar.length} grammar</span>
          <span>${activities.length} practice</span>
        </div>
        ${renderChapterBeginnerGuide(chapter)}
        ${renderWarmupDialogue(chapter.dialogue || [])}
        <div class="unit-task"><strong>Real-life task</strong><span>${esc(chapter.realLifeTask || chapter.task || '')}</span></div>
        <div class="unit-routine">
          ${[
            ['1', 'Start lesson', 'Read the warm-up dialogue and listen before translating.'],
            ['2', 'Grammar', 'Study the particle or ending that makes the sentence work.'],
            ['3', 'Practice', 'Do recognition, blank, particle, transform, and sentence-build tasks.'],
            ['4', 'Review', 'Take the chapter quiz and mark weak cards for review.']
          ].map(([step, title, body]) => `
            <div>
              <b>${esc(step)}</b>
              <strong>${esc(title)}</strong>
              <span>${esc(body)}</span>
            </div>
          `).join('')}
        </div>
        ${grammar.length ? `
          <div class="unit-section-label">Grammar focus</div>
          <div class="chapter-grammar-grid">${grammar.map(renderChapterGrammar).join('')}</div>
        ` : ''}
        ${activities.length ? `
          <div class="unit-section-label">Guided practice</div>
          <div class="practice-strip">${activities.map(renderPracticePreview).join('')}</div>
        ` : ''}
        <div class="unit-section-label">Core cards</div>
        <div class="unit-link-grid">
          ${core.map(renderCompactEntryLink).join('')}
        </div>
        ${patterns.length ? `
          <div class="unit-section-label">Grammar patterns</div>
          <div class="unit-pattern-row">${patterns.map(renderCompactEntryLink).join('')}</div>
        ` : ''}
        <div class="friend-practice"><strong>Practice with a Korean friend</strong><span>${esc(chapter.friendPractice || 'Read the dialogue together, then substitute one word and say it again.')}</span></div>
        ${chapter.checkpoints?.length ? `
          <div class="chapter-checkpoints">
            <strong>Before moving on</strong>
            <ul>${chapter.checkpoints.map(item => `<li>${esc(item)}</li>`).join('')}</ul>
          </div>
        ` : ''}
        <div class="chapter-actions">
          <button class="primary-button" type="button" data-chapter-quiz="${esc(chapter.id)}">Review quiz</button>
          ${prev ? `<button class="action-button" type="button" data-course-jump="${esc(prev.id)}">Previous chapter</button>` : ''}
          ${next ? `<button class="action-button" type="button" data-course-jump="${esc(next.id)}">Next chapter</button>` : ''}
          <button class="action-button" type="button" data-course-jump="course-top">Top</button>
          <span>${esc(chapter.review || 'Review this chapter and try the task out loud.')}</span>
        </div>
      </div>
    </article>
  `;
}

function renderChapterBeginnerGuide(chapter) {
  const guide = chapter.beginnerGuide || [];
  if (!guide.length) return '';
  return `
    <div class="chapter-beginner-guide">
      ${guide.map(item => `
        <section>
          <strong>${esc(item.title)}</strong>
          <p>${esc(item.body)}</p>
        </section>
      `).join('')}
    </div>
  `;
}

function renderWarmupDialogue(dialogue) {
  if (!dialogue.length) return '';
  return `
    <div class="warmup-dialogue">
      <div class="unit-section-label">Warm-up dialogue</div>
      ${dialogue.map(line => `
        <div class="dialogue-line">
          <div class="dialogue-speaker">${esc(line.speaker)}</div>
          <div>
            <div class="example-ko">${esc(line.ko)} ${speakButton(line.ko)}</div>
            ${romanizationLine(line.ko, line.romanization)}
            <div class="example-en">${esc(line.en)}</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderChapterGrammar(item) {
  const examples = (item.examples || []).slice(0, 2);
  const mistakes = (item.commonMistakes || []).slice(0, 1);
  return `
    <article class="chapter-grammar-card">
      <strong>${esc(item.hangul)}</strong>
      <span>${esc(item.title)}</span>
      <p>${esc(item.plainEnglish || '')}</p>
      ${item.attachmentRule ? `<p><b>Build:</b> ${esc(item.attachmentRule)}</p>` : ''}
      ${item.contrastWith ? `<p><b>Compare:</b> ${esc(item.contrastWith)}</p>` : ''}
      ${(item.sentenceFrames || []).slice(0, 3).map(frame => `<code>${esc(frame)}</code>`).join('')}
      ${examples.length ? `
        <div class="chapter-grammar-examples">
          ${examples.map(ex => `
            <div>
              <em>${esc(ex.ko)}</em>
              <small>${esc(ex.en)}</small>
            </div>
          `).join('')}
        </div>
      ` : ''}
      ${mistakes.length ? `<div class="chapter-grammar-watch">${esc(mistakes[0])}</div>` : ''}
    </article>
  `;
}

function renderPracticePreview(item) {
  return `
    <div class="practice-preview">
      <strong>${esc(activityLabel(item))}</strong>
      <span>${esc(item.prompt)}</span>
    </div>
  `;
}

function activityLabel(item) {
  return item.label || titleCase(item.type);
}

function renderCompactEntryLink(entry) {
  const title = entryTitle(entry);
  const subtitle = entrySubtitle(entry);
  return `
    <button class="compact-entry-link" type="button" data-entry="${esc(entry.id)}">
      <span class="badge type-${entry.type}">${TYPE_LABELS[entry.type]}</span>
      <strong>${esc(title)}</strong>
      <span>${esc(subtitle)}</span>
    </button>
  `;
}

function renderHome() {
  const words = state.entries.filter(e => e.type === 'word').length;
  const expressions = state.entries.filter(e => e.type === 'expression').length;
  const patterns = state.entries.filter(e => e.type === 'pattern').length;
  const verbs = state.entries.filter(e => e.forms).slice(0, 6);
  const patternPath = ['pattern-005', 'pattern-007', 'pattern-008', 'pattern-011', 'pattern-012', 'pattern-013', 'pattern-014', 'pattern-015', 'pattern-016']
    .map(id => findEntry(id))
    .filter(Boolean);
  const featured = shuffle(state.entries).slice(0, 9);
  return `
    <section class="home-hero">
      <div class="home-hero-inner">
        <div class="eyebrow">Static Korean learner deck</div>
        <h1>Korean Core Starter</h1>
        <p>A curated beginner deck with practical verbs, everyday expressions, reusable patterns, Korean TTS, and fixed 15-form verb panels.</p>
        <div class="stats-row">
          <div class="stat"><div class="stat-value">${state.entries.length}</div><div class="stat-label">curated entries</div></div>
          <div class="stat"><div class="stat-value">${words}</div><div class="stat-label">words</div></div>
          <div class="stat"><div class="stat-value">${expressions}</div><div class="stat-label">expressions</div></div>
          <div class="stat"><div class="stat-value">${patterns}</div><div class="stat-label">patterns</div></div>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="section-head"><h2>Start by type</h2><span class="muted">Beginner-safe starter content</span></div>
      <div class="quick-grid">
        ${['word','expression','pattern'].map(type => `
          <button class="quick-tile" type="button" data-set-filter="type" data-value="${type}">
            <div class="badge-row"><span class="badge type-${type}">${TYPE_LABELS[type]}</span></div>
            <div class="tile-title">${TYPE_LABELS[type]} deck</div>
            <div class="romanization">${state.entries.filter(e => e.type === type).length} entries</div>
          </button>
        `).join('')}
      </div>
    </section>
    <section class="section">
      <div class="section-head"><h2>15-form verb preview</h2><button class="small-button" type="button" data-set-filter="pos" data-value="verb">Show all verbs</button></div>
      <div class="entry-grid">${verbs.map(renderEntryCard).join('')}</div>
    </section>
    <section class="section">
      <div class="section-head"><h2>Conversation survival path</h2><span class="muted">Patterns that turn words into usable sentences</span></div>
      <div class="path-grid">
        ${patternPath.map((entry, index) => `
          <button class="path-card" type="button" data-entry="${esc(entry.id)}">
            <span class="path-step">${index + 1}</span>
            <strong>${esc(entry.hangul)}</strong>
            <span>${esc(entry.english)}</span>
          </button>
        `).join('')}
      </div>
    </section>
    <section class="section">
      <div class="section-head"><h2>Today's mix</h2><button class="small-button" type="button" data-action="refresh">Refresh</button></div>
      <div class="entry-grid">${featured.map(renderEntryCard).join('')}</div>
    </section>
  `;
}

function renderList(list) {
  return `
    <section class="section">
      <div class="list-head">
        <div>
          <h1>${list.length.toLocaleString()} entries</h1>
          <div class="chip-row">${activeChips().map(c => `<span class="chip">${esc(c)}</span>`).join('')}</div>
        </div>
        <button class="small-button" type="button" data-action="clear">Reset</button>
      </div>
      ${list.length ? `<div class="entry-grid">${list.map(renderEntryCard).join('')}</div>` : '<div class="empty-state">No entries match these filters.</div>'}
    </section>
  `;
}

function activeChips() {
  const chips = [];
  if (state.search.trim()) chips.push(`Search: ${state.search.trim()}`);
  for (const [key, value] of Object.entries(state.filters)) {
    if (value instanceof Set) value.forEach(v => chips.push(`${titleCase(key)}: ${titleCase(v)}`));
    else if (value) chips.push(titleCase(key));
  }
  return chips;
}

function renderEntryCard(e) {
  const ex = e.examples?.[0];
  const usage = e.usagePhrases?.[0];
  const title = entryTitle(e);
  return `
    <button class="entry-card" type="button" data-entry="${esc(e.id)}">
      <div class="badge-row">
        <span class="badge type-${e.type}">${TYPE_LABELS[e.type]}</span>
        <span class="badge">${esc(e.level)}</span>
        <span class="badge">${esc(titleCase(e.partOfSpeech || 'pattern'))}</span>
        ${e.irregular ? `<span class="badge">Irregular</span>` : ''}
      </div>
      <div class="card-title">${esc(title)}</div>
      ${e.type === 'pattern' ? `<div class="pattern-line">${esc(e.hangul)}</div>` : ''}
      <div class="romanization">${esc(e.romanization)}</div>
      <div class="card-english">${esc(e.english)}</div>
      ${usage ? `<div class="usage-preview">${esc(usage.ko)}${romanizationLine(usage.ko, usage.romanization)}<span>${esc(usage.en)}</span></div>` : ''}
      ${ex ? `<div class="card-example">${esc(ex.ko)}${romanizationLine(ex.ko, ex.romanization)}${esc(ex.en)}</div>` : ''}
    </button>
  `;
}

function wireBrowseCards() {
  document.querySelectorAll('[data-entry]').forEach(card => {
    card.addEventListener('click', () => openDetail(card.dataset.entry));
  });
  document.querySelectorAll('[data-set-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      clearFilters(false);
      state.filters[btn.dataset.setFilter].add(btn.dataset.value);
      renderBrowse();
    });
  });
  document.querySelectorAll('[data-action="clear"]').forEach(btn => btn.addEventListener('click', clearFilters));
  document.querySelectorAll('[data-action="refresh"]').forEach(btn => btn.addEventListener('click', renderBrowse));
}

function wireCourseActions() {
  document.querySelectorAll('[data-course-jump]').forEach(btn => {
    btn.addEventListener('click', () => scrollToCourseTarget(btn.dataset.courseJump));
  });
  document.querySelectorAll('[data-chapter-quiz]').forEach(btn => {
    btn.addEventListener('click', () => startChapterQuiz(btn.dataset.chapterQuiz));
  });
  document.querySelectorAll('#courseView [data-speak]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      speak(btn.dataset.speak);
    });
  });
}

function scrollToCourseTarget(id) {
  const target = document.getElementById(id);
  if (!target) return;
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function openDetail(id) {
  const entry = state.entries.find(e => e.id === id);
  if (!entry) return;
  state.selectedId = id;
  $('modalBody').innerHTML = renderDetail(entry);
  $('detailModal').classList.add('is-open');
  $('detailModal').setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  wireDetail(entry);
}

function closeDetail() {
  $('detailModal').classList.remove('is-open');
  $('detailModal').setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function renderDetail(e) {
  const title = entryTitle(e);
  return `
    <article class="detail">
      <header class="detail-head">
        <div>
          <div class="badge-row">
            <span class="badge type-${e.type}">${TYPE_LABELS[e.type]}</span>
            <span class="badge">${esc(e.level)}</span>
            <span class="badge">${esc(titleCase(e.partOfSpeech || 'pattern'))}</span>
            ${(e.topic || []).slice(0, 3).map(t => `<span class="badge">${esc(titleCase(t))}</span>`).join('')}
          </div>
          <h1>${esc(title)} ${speakButton(e.hangul)}</h1>
          ${e.type === 'pattern' ? `<div class="pattern-line">${esc(e.hangul)}</div>` : ''}
          <div class="romanization">${esc(e.romanization)}</div>
          <p class="card-english">${esc(e.english)}</p>
        </div>
        <div class="detail-actions">
          ${progressButton('favorite', e.id, 'Favorite')}
          ${progressButton('known', e.id, 'Known')}
          ${progressButton('review', e.id, 'Review')}
        </div>
      </header>
      <div class="learning-sections">
        ${renderLearningSection('Overview', renderOverview(e), true)}
        ${e.lesson ? renderLearningSection('Lesson', renderLesson(e), true) : ''}
        ${renderLearningSection('Usage', renderUsagePhrases(e), true)}
        ${renderLearningSection('Examples', renderExamples(e), true)}
        ${(e.forms || e.patternInfo || e.adjectiveForms || e.speechLevels) ? renderLearningSection('Forms', renderFormsSection(e), !!e.forms) : ''}
        ${(e.studyGuide || e.relatedPatternIds?.length || e.relatedWordIds?.length) ? renderLearningSection('Connections', renderConnections(e), true) : ''}
        ${renderLearningSection('Notes', renderNotesSection(e), false)}
      </div>
    </article>
  `;
}

function entryTitle(entry) {
  if (entry.type === 'pattern' && entry.studyGuide?.title) return entry.studyGuide.title;
  return entry.hangul;
}

function entrySubtitle(entry) {
  if (entry.type === 'pattern' && entry.studyGuide?.title) return entry.hangul;
  return entry.romanization;
}

function renderLearningSection(title, body, open = false) {
  return `
    <section class="learning-section ${open ? 'is-open' : ''}">
      <button class="learning-section-head" type="button" data-learning-section>
        <span>${esc(title)}</span>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
      </button>
      <div class="learning-section-body">${body}</div>
    </section>
  `;
}

function renderOverview(e) {
  return `
    <div class="detail-grid">
      <section class="panel">
        <div class="label">Explanation</div>
        <div>${esc(e.explanation || e.shortExplanation)}</div>
        ${e.learnerPriority ? `<p class="learner-priority">${esc(e.learnerPriority)}</p>` : ''}
        ${e.irregular ? `<p class="muted">Irregular note: ${esc(e.irregular)}</p>` : ''}
      </section>
      <section class="panel">
        <div class="label">Speech levels</div>
        ${renderSpeechLevels(e)}
      </section>
      ${e.contextHint ? `<section class="panel span2"><div class="label">Where it fits</div><div>${esc(e.contextHint)}</div></section>` : ''}
    </div>
  `;
}

function renderLesson(e) {
  const lesson = e.lesson;
  if (!lesson) return '';
  return `
    <div class="lesson-block">
      <section class="lesson-panel span2">
        <div class="label">Can-do goal</div>
        <p class="lesson-goal">${esc(lesson.canDo)}</p>
      </section>
      <section class="lesson-panel">
        <div class="label">Study flow</div>
        <ol class="lesson-steps">${(lesson.studyFlow || []).map(step => `<li>${esc(step)}</li>`).join('')}</ol>
      </section>
      <section class="lesson-panel">
        <div class="label">Teacher note</div>
        <p>${esc(lesson.teacherNote || '')}</p>
        ${lesson.pronunciationTip ? `<p class="pronunciation-tip">${esc(lesson.pronunciationTip)}</p>` : ''}
      </section>
      ${lesson.beginnerPath?.length ? `
        <section class="lesson-panel span2">
          <div class="label">Beginner path</div>
          <div class="beginner-path-grid">
            ${lesson.beginnerPath.map(item => `
              <div class="beginner-path-item">
                <strong>${esc(item.title)}</strong>
                <p>${esc(item.body)}</p>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}
      <section class="lesson-panel span2">
        <div class="label">Mini dialogue</div>
        <div class="dialogue-list">
          ${(lesson.miniDialogue || []).map(line => `
            <div class="dialogue-line">
              <div class="dialogue-speaker">${esc(line.speaker)}</div>
              <div>
                <div class="example-ko">${esc(line.ko)} ${speakButton(line.ko)}</div>
                ${romanizationLine(line.ko, line.romanization)}
                <div class="example-en">${esc(line.en)}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </section>
      <section class="lesson-panel">
        <div class="label">Substitution drill</div>
        <div class="drill-list">
          ${(lesson.drills || []).map(item => `
            <div class="drill-item">
              <div class="example-ko">${esc(item.ko)} ${speakButton(item.ko)}</div>
              ${romanizationLine(item.ko, item.romanization)}
              <div class="example-en">${esc(item.en)}</div>
              ${item.note ? `<div class="usage-note">${esc(item.note)}</div>` : ''}
            </div>
          `).join('')}
        </div>
      </section>
      <section class="lesson-panel">
        <div class="label">Self-check</div>
        <ul class="self-check">${(lesson.selfCheck || []).map(item => `<li>${esc(item)}</li>`).join('')}</ul>
      </section>
      ${lesson.classroomScript?.length ? `
        <section class="lesson-panel span2">
          <div class="label">Practice script</div>
          <ol class="lesson-steps">${lesson.classroomScript.map(item => `<li>${esc(item)}</li>`).join('')}</ol>
        </section>
      ` : ''}
    </div>
  `;
}

function renderUsagePhrases(e) {
  return `
    <div class="usage-grid">
      ${(e.usagePhrases || []).map(item => `
        <div class="usage-item">
          <div class="example-ko">${esc(item.ko)} ${speakButton(item.ko)}</div>
          ${romanizationLine(item.ko, item.romanization)}
          <div class="example-en">${esc(item.en || '')}</div>
          ${item.note ? `<div class="usage-note">${esc(item.note)}</div>` : ''}
        </div>
      `).join('')}
    </div>
  `;
}

function renderExamples(e) {
  return `
    <div class="example-list">
      ${(e.examples || []).map((item, index) => `
        <div class="example-item">
          <div class="example-index">${index + 1}</div>
          <div>
            <div class="example-ko">${esc(item.ko)} ${speakButton(item.ko)}</div>
            ${romanizationLine(item.ko, item.romanization)}
            <div class="example-en">${esc(item.en || '')}</div>
            ${item.note ? `<div class="usage-note">${esc(item.note)}</div>` : ''}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderFormsSection(e) {
  return `
    ${e.forms ? `<div class="label">15 Core Verb Forms</div>${renderFormGroups(e)}` : ''}
    ${e.adjectiveForms ? `<div class="label" style="margin-top:14px;">Adjective forms</div>${renderAdjectiveForms(e)}` : ''}
    ${e.patternInfo ? `<div class="label" style="margin-top:14px;">Pattern use</div>${renderPatternInfo(e.patternInfo)}` : ''}
    ${(!e.forms && !e.adjectiveForms && e.speechLevels) ? renderSpeechLevels(e) : ''}
  `;
}

function renderConnections(e) {
  const guide = e.studyGuide;
  const patternLinks = (e.relatedPatternIds || []).map(findEntry).filter(Boolean);
  const wordLinks = (e.relatedWordIds || []).map(findEntry).filter(Boolean);
  return `
    ${guide ? `
      <div class="study-guide">
        <div class="label">${esc(guide.title || 'Study guide')}</div>
        <div class="guide-grid">
          <section>
            <h3>How to build it</h3>
            <ol>${(guide.howToBuild || []).map(step => `<li>${esc(step)}</li>`).join('')}</ol>
          </section>
          <section>
            <h3>When to use it</h3>
            <p>${esc(guide.whenToUse || '')}</p>
            ${guide.learnerPath ? `<p class="guide-path">${esc(guide.learnerPath)}</p>` : ''}
          </section>
        </div>
      </div>
    ` : ''}
    ${patternLinks.length ? `
      <div class="link-block">
        <div class="label">Related patterns</div>
        <div class="link-grid">${patternLinks.map(renderLinkedEntry).join('')}</div>
      </div>
    ` : ''}
    ${wordLinks.length ? `
      <div class="link-block">
        <div class="label">Practice with words</div>
        <div class="link-grid">${wordLinks.map(renderLinkedEntry).join('')}</div>
      </div>
    ` : ''}
  `;
}

function renderAdjectiveForms(e) {
  return `
    <div class="forms-group is-open">
      <button class="forms-summary" type="button" data-forms-group>Natural adjective forms<span>5 forms</span></button>
      <div class="forms-table">
        <div class="form-row"><div class="form-label">Casual</div><div class="form-value">${esc(e.speechLevels.casual)} ${speakButton(e.speechLevels.casual)}</div></div>
        <div class="form-row"><div class="form-label">Polite</div><div class="form-value">${esc(e.speechLevels.polite)} ${speakButton(e.speechLevels.polite)}</div></div>
        <div class="form-row"><div class="form-label">Formal</div><div class="form-value">${esc(e.speechLevels.formal)} ${speakButton(e.speechLevels.formal)}</div></div>
        <div class="form-row"><div class="form-label">Past</div><div class="form-value">${esc(e.adjectiveForms.past)} ${speakButton(e.adjectiveForms.past)}</div></div>
        <div class="form-row"><div class="form-label">Future / guess</div><div class="form-value">${esc(e.adjectiveForms.future)} ${speakButton(e.adjectiveForms.future)}</div></div>
      </div>
    </div>
  `;
}

function renderNotesSection(e) {
  return `
    <div class="note-block">
      <div class="label">Learner note</div>
      <p>${esc(e.nuance || 'Practice this item as a whole sentence chunk, not only as a translation.')}</p>
    </div>
    <div class="note-block warning">
      <div class="label">Watch out</div>
      ${(e.commonMistakes || []).map(item => `<p>${esc(item)}</p>`).join('')}
    </div>
    ${e.notes?.length ? `<div class="note-block"><div class="label">Extra notes</div>${e.notes.map(n => `<p>${esc(n)}</p>`).join('')}</div>` : ''}
  `;
}

function speakButton(text) {
  return `<button class="speak-button" type="button" data-speak="${esc(text)}" title="Listen"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4V5Z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/></svg></button>`;
}

function progressButton(bucket, id, label) {
  const active = saved[bucket].has(id);
  return `<button class="action-button ${active ? 'is-active' : ''}" type="button" data-progress="${bucket}" data-id="${esc(id)}">${active ? '✓ ' : ''}${label}</button>`;
}

function renderSpeechLevels(e) {
  const levels = e.speechLevels || e.patternInfo?.speechLevelTabs;
  if (!levels) return '<div class="muted">No speech-level variants for this entry.</div>';
  const current = levels[state.speechLevel] ? state.speechLevel : Object.keys(levels)[0];
  return `
    <div class="speech-tabs">
      ${Object.keys(SPEECH_LABELS).map(key => `
        <button type="button" data-speech="${key}" class="${key === current ? 'is-active' : ''}" ${levels[key] ? '' : 'disabled'}>${SPEECH_LABELS[key]}</button>
      `).join('')}
    </div>
    <div class="speech-output">${esc(levels[current])} ${speakButton(levels[current])}${romanizationLine(levels[current])}</div>
  `;
}

function renderFormGroups(entry) {
  const forms = entry.forms || {};
  const info = entry.formGroupInfo || {};
  const links = entry.formLinks || {};
  return FORM_GROUPS.map(group => `
    <div class="forms-group is-open">
      <button class="forms-summary" type="button" data-forms-group>
        ${group.label}<span>${group.keys.length} forms</span>
      </button>
      <div class="forms-table">
        ${info[group.key] ? `
          <div class="form-row form-row-note">
            <div class="form-label">Meaning</div>
            <div class="form-value"><span>${esc(info[group.key].meaning)}</span><small>${esc(info[group.key].example)}</small></div>
          </div>
        ` : ''}
        ${group.keys.map(key => `
          <div class="form-row">
            <div class="form-label">${FORM_LABELS[key]}</div>
            <div class="form-value">
              <div class="form-main">${esc(forms[key] || '—')} ${forms[key] ? speakButton(forms[key]) : ''}</div>
              ${romanizationLine(forms[key])}
              ${renderFormTeaching(entry, key, forms[key])}
              ${links[key] ? renderPatternJump(links[key]) : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function renderFormTeaching(entry, key, value) {
  if (!value || !FORM_TEACHING[key]) return '';
  const base = baseEnglish(entry);
  const teaching = FORM_TEACHING[key];
  const meaning = teaching.meaning(base);
  const exampleKo = teaching.exampleKo(entry, value);
  const exampleEn = teaching.exampleEn(base);
  return `
    <div class="form-teaching">
      <div><strong>Means:</strong> ${esc(meaning)}</div>
      <div><strong>Use:</strong> ${esc(teaching.use)}</div>
      <div><strong>Build:</strong> ${esc(teaching.build)}</div>
      <div class="mini-example"><strong>Example:</strong> ${esc(exampleKo)} ${romanizationLine(exampleKo)}<span>${esc(exampleEn)}</span></div>
    </div>
  `;
}

function renderPatternInfo(info) {
  return `
    <div class="form-row"><div class="form-label">Meaning</div><div class="form-value">${esc(info.meaning)}</div></div>
    <div class="form-row"><div class="form-label">Used with</div><div class="form-value">${esc((info.usableWith || []).join(', '))}</div></div>
    <div class="form-row"><div class="form-label">Form note</div><div class="form-value">${esc(info.formNote || '')}</div></div>
  `;
}

function renderPatternJump(id) {
  const entry = findEntry(id);
  if (!entry) return '';
  return `<button class="inline-link-button" type="button" data-link-entry="${esc(entry.id)}">Study ${esc(entry.hangul)}</button>`;
}

function renderLinkedEntry(entry) {
  return `
    <button class="linked-entry" type="button" data-link-entry="${esc(entry.id)}">
      <span class="badge type-${entry.type}">${TYPE_LABELS[entry.type]}</span>
      <strong>${esc(entry.hangul)}</strong>
      <span>${esc(entry.english)}</span>
    </button>
  `;
}

function wireDetail(entry) {
  document.querySelectorAll('[data-speak]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      speak(btn.dataset.speak);
    });
  });
  document.querySelectorAll('[data-progress]').forEach(btn => {
    btn.addEventListener('click', () => {
      const bucket = btn.dataset.progress;
      const id = btn.dataset.id;
      if (saved[bucket].has(id)) saved[bucket].delete(id);
      else saved[bucket].add(id);
      if (bucket === 'known') saved.review.delete(id);
      if (bucket === 'review') saved.known.delete(id);
      saveProgress();
      $('modalBody').innerHTML = renderDetail(entry);
      wireDetail(entry);
    });
  });
  document.querySelectorAll('[data-speech]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.speechLevel = btn.dataset.speech;
      $('modalBody').innerHTML = renderDetail(entry);
      wireDetail(entry);
    });
  });
  document.querySelectorAll('[data-forms-group]').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.forms-group').classList.toggle('is-open');
    });
  });
  document.querySelectorAll('[data-learning-section]').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.learning-section').classList.toggle('is-open');
    });
  });
  document.querySelectorAll('[data-link-entry]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      openDetail(btn.dataset.linkEntry);
    });
  });
}

function speak(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ko-KR';
  utterance.rate = 0.88;
  window.speechSynthesis.speak(utterance);
}

function resetDeckIfNeeded() {
  const ids = filteredEntries().map(e => e.id);
  const signature = ids.join('|');
  if (signature !== state.deckSignature) {
    state.flashOrder = ids;
    state.deckSignature = signature;
    state.flashIdx = 0;
    state.flashRevealed = false;
  }
}

function currentFlashEntry() {
  const id = state.flashOrder[state.flashIdx];
  return state.entries.find(e => e.id === id);
}

function renderFlashcard() {
  const deck = state.flashOrder;
  const entry = currentFlashEntry();
  $('deckInfo').textContent = `Deck: ${deck.length}`;
  $('flashCounter').textContent = deck.length ? `${state.flashIdx + 1} / ${deck.length}` : '0 / 0';
  $('flashProgress').style.width = deck.length ? `${((state.flashIdx + 1) / deck.length) * 100}%` : '0%';
  if (!entry) {
    $('flashcard').innerHTML = '<div class="empty-state">No cards in this deck. Adjust filters in Browse.</div>';
    $('flashActions').innerHTML = '';
    return;
  }
  const front = `
    <div class="badge-row"><span class="badge type-${entry.type}">${TYPE_LABELS[entry.type]}</span><span class="badge">${entry.level}</span></div>
    <div class="flash-main">
      <div>
        <div class="flash-hangul">${esc(entry.hangul)}</div>
        <div class="flash-help">Click or press Space to reveal.</div>
      </div>
    </div>
  `;
  const back = `
    <div class="badge-row"><span class="badge type-${entry.type}">${TYPE_LABELS[entry.type]}</span><span class="badge">${titleCase(entry.partOfSpeech || 'pattern')}</span></div>
    <div class="flash-main">
      <div>
        <div class="flash-hangul" style="font-size:48px;">${esc(entry.hangul)} ${speakButton(entry.hangul)}</div>
        <div class="romanization">${esc(entry.romanization)}</div>
        <div class="card-english">${esc(entry.english)}</div>
        ${entry.usagePhrases?.[0] ? `<div class="usage-preview">${esc(entry.usagePhrases[0].ko)}${romanizationLine(entry.usagePhrases[0].ko, entry.usagePhrases[0].romanization)}<span>${esc(entry.usagePhrases[0].en)}</span></div>` : ''}
        ${entry.examples?.[0] ? `<div class="usage-preview">${esc(entry.examples[0].ko)}${romanizationLine(entry.examples[0].ko, entry.examples[0].romanization)}<span>${esc(entry.examples[0].en)}</span></div>` : `<div class="flash-help">${esc(entry.explanation || entry.shortExplanation)}</div>`}
        ${entry.forms?.politePresent ? `<div class="flash-help"><strong>Frame:</strong> 지금 ${esc(entry.forms.politePresent)}.</div>` : ''}
        ${entry.commonMistakes?.[0] ? `<div class="flash-help"><strong>Watch out:</strong> ${esc(entry.commonMistakes[0])}</div>` : ''}
      </div>
    </div>
  `;
  $('flashcard').innerHTML = state.flashRevealed ? back : front;
  $('flashcard').onclick = e => {
    if (e.target.closest('[data-speak]')) return;
    state.flashRevealed = !state.flashRevealed;
    renderFlashcard();
  };
  $('flashcard').querySelectorAll('[data-speak]').forEach(btn => btn.addEventListener('click', e => {
    e.stopPropagation();
    speak(btn.dataset.speak);
  }));
  $('flashActions').innerHTML = `
    <button class="danger-button" type="button" data-flash="review">Review</button>
    <button class="action-button" type="button" data-flash="prev">Previous</button>
    <button class="primary-button" type="button" data-flash="reveal">${state.flashRevealed ? 'Hide' : 'Reveal'}</button>
    <button class="action-button" type="button" data-flash="next">Next</button>
    <button class="primary-button" type="button" data-flash="known">Known</button>
  `;
  $('flashActions').querySelectorAll('[data-flash]').forEach(btn => btn.addEventListener('click', () => handleFlash(btn.dataset.flash, entry)));
}

function handleFlash(action, entry) {
  if (action === 'reveal') state.flashRevealed = !state.flashRevealed;
  if (action === 'next') {
    state.flashIdx = Math.min(state.flashOrder.length - 1, state.flashIdx + 1);
    state.flashRevealed = false;
  }
  if (action === 'prev') {
    state.flashIdx = Math.max(0, state.flashIdx - 1);
    state.flashRevealed = false;
  }
  if (action === 'known') {
    saved.known.add(entry.id);
    saved.review.delete(entry.id);
    saveProgress();
    state.flashIdx = Math.min(state.flashOrder.length - 1, state.flashIdx + 1);
    state.flashRevealed = false;
  }
  if (action === 'review') {
    saved.review.add(entry.id);
    saved.known.delete(entry.id);
    saveProgress();
    state.flashIdx = Math.min(state.flashOrder.length - 1, state.flashIdx + 1);
    state.flashRevealed = false;
  }
  renderFlashcard();
}

function startQuiz() {
  state.quizChapterId = null;
  const pool = filteredEntries();
  if (pool.length < 4) {
    $('quizCard').innerHTML = '<div class="empty-state">At least four entries are needed for a quiz.</div>';
    return;
  }
  state.quizIdx = 0;
  state.quizAnswers = [];
  state.quizQuestions = shuffle(pool).slice(0, Math.min(10, pool.length)).map(entry => makeQuestion(entry, pool));
  renderQuiz();
}

function startChapterQuiz(chapterId, switchMode = true) {
  const chapter = state.chapters.find(item => item.id === chapterId);
  const items = chapterActivities(chapterId);
  if (!chapter || items.length < 5) return;
  state.quizChapterId = chapterId;
  state.quizIdx = 0;
  state.quizAnswers = [];
  state.quizQuestions = items.map(item => makeActivityQuestion(item, chapter));
  if (switchMode) {
    document.querySelectorAll('.mode-tab').forEach(btn => btn.classList.toggle('is-active', btn.dataset.mode === 'quiz'));
    document.querySelectorAll('.pane').forEach(pane => pane.classList.remove('is-active'));
    $('quizPane').classList.add('is-active');
    state.mode = 'quiz';
  }
  renderQuiz();
}

function makeActivityQuestion(item, chapter) {
  const typed = ['fillBlank', 'formTransform', 'sentenceBuild'].includes(item.type);
  return {
    type: typed ? 'chapter-typed' : 'chapter-choice',
    activity: item,
    chapter,
    entry: { id: '', hangul: chapter.title, english: item.prompt }
  };
}

function makeQuestion(entry, pool) {
  const possible = ['en-to-ko', 'ko-to-en'];
  if ((entry.usagePhrases || []).length >= 4) possible.push('usage-choice', 'usage-natural');
  if ((entry.examples || []).length >= 1) possible.push('usage-fill');
  if (entry.forms) possible.push('form-choice', 'fill-form');
  if (entry.speechLevels || entry.patternInfo?.speechLevelTabs) possible.push('speech-level');
  return { type: sample(possible), entry, pool };
}

function renderQuiz() {
  const q = state.quizQuestions[state.quizIdx];
  if (!q) return renderQuizResults();
  $('quizCard').classList.remove('is-correct', 'is-wrong');
  $('quizCard').innerHTML = `
    <div class="quiz-progress"><span>${state.quizIdx + 1} / ${state.quizQuestions.length}</span><span>${quizTypeLabel(q.type)}</span></div>
    ${renderQuestionBody(q)}
  `;
  wireQuiz(q);
}

function quizTypeLabel(type) {
  return {
    'en-to-ko': 'English → Korean',
    'ko-to-en': 'Korean → English',
    'form-choice': '15 Core Forms',
    'fill-form': 'Typed Hangul',
    'speech-level': 'Speech Level',
    'usage-choice': 'Usage Phrase',
    'usage-natural': 'Natural Usage',
    'usage-fill': 'Fill the Sentence',
    'chapter-choice': 'Chapter Review',
    'chapter-typed': 'Chapter Review'
  }[type];
}

function renderQuestionBody(q) {
  if (q.type === 'chapter-choice') {
    q.correctAnswer = q.activity.answer;
    const choices = q.activity.choices || [q.activity.answer];
    return `
      <div class="quiz-question">${esc(q.activity.prompt)}</div>
      <div class="quiz-sub">${esc(q.chapter.title)} · ${esc(activityLabel(q.activity))}</div>
      <div class="quiz-options">${choices.map(o => optionButton(o, o === q.activity.answer)).join('')}</div>
    `;
  }
  if (q.type === 'chapter-typed') {
    q.correctAnswer = q.activity.answer;
    return `
      <div class="quiz-question">${esc(q.activity.prompt)}</div>
      <div class="quiz-sub">${esc(activityLabel(q.activity))} · ${esc(q.activity.hint || q.chapter.title)} Type the missing Korean or form.</div>
      <input class="quiz-input" id="quizInput" type="text" autocomplete="off" placeholder="한글로 입력">
      <div class="study-actions" style="justify-content:flex-start;"><button class="primary-button" type="button" data-submit-typed>Submit</button><button class="action-button" type="button" data-skip>Skip</button></div>
    `;
  }
  if (q.type === 'en-to-ko') {
    const options = shuffle([q.entry, ...distractors(q.entry, q.pool, 3)]);
    return `
      <div class="quiz-question">${esc(q.entry.english)}</div>
      <div class="quiz-sub">Choose the Korean entry.</div>
      <div class="quiz-options">${options.map(o => optionButton(o.hangul, o.id === q.entry.id)).join('')}</div>
    `;
  }
  if (q.type === 'ko-to-en') {
    const options = shuffle([q.entry, ...distractors(q.entry, q.pool, 3)]);
    return `
      <div class="quiz-question">${esc(q.entry.hangul)}</div>
      <div class="romanization">${esc(q.entry.romanization)}</div>
      <div class="quiz-options">${options.map(o => optionButton(o.english, o.id === q.entry.id)).join('')}</div>
    `;
  }
  if (q.type === 'speech-level') {
    const levels = q.entry.speechLevels || q.entry.patternInfo?.speechLevelTabs;
    const correctKey = sample(Object.keys(levels));
    q.correctAnswer = correctKey;
    return `
      <div class="quiz-question">${esc(levels[correctKey])}</div>
      <div class="quiz-sub">Which speech level is this?</div>
      <div class="quiz-options">${Object.entries(SPEECH_LABELS).map(([key, label]) => optionButton(label, key === correctKey, key)).join('')}</div>
    `;
  }
  if (q.type === 'usage-choice') {
    const target = sample(q.entry.usagePhrases);
    q.correctAnswer = target.ko;
    const otherPhrases = shuffle(q.pool
      .filter(e => e.id !== q.entry.id)
      .flatMap(e => e.usagePhrases || [])
      .map(p => p.ko))
      .slice(0, 3);
    const options = shuffle([target.ko, ...otherPhrases]);
    return `
      <div class="quiz-question">${esc(target.en)}</div>
      <div class="quiz-sub">Choose the Korean phrase that fits this meaning or situation.</div>
      <div class="quiz-options">${options.map(o => optionButton(o, o === target.ko)).join('')}</div>
    `;
  }
  if (q.type === 'usage-natural') {
    const target = sample(q.entry.usagePhrases);
    q.correctAnswer = target.ko;
    const otherPhrases = shuffle((q.entry.usagePhrases || []).filter(p => p.ko !== target.ko).map(p => p.ko)).slice(0, 3);
    const fallback = shuffle(q.pool.filter(e => e.id !== q.entry.id).flatMap(e => e.usagePhrases || []).map(p => p.ko)).slice(0, 3 - otherPhrases.length);
    const options = shuffle([target.ko, ...otherPhrases, ...fallback]);
    return `
      <div class="quiz-question">${esc(q.entry.hangul)}</div>
      <div class="quiz-sub">Which phrase is a natural way to use this item?</div>
      <div class="quiz-options">${options.map(o => optionButton(o, o === target.ko)).join('')}</div>
    `;
  }
  if (q.type === 'usage-fill') {
    const ex = sample(q.entry.examples || []);
    const blanked = ex.ko.includes(q.entry.hangul) ? ex.ko.replace(q.entry.hangul, '____') : `____ · ${ex.ko}`;
    q.correctAnswer = q.entry.hangul;
    return `
      <div class="quiz-question">${esc(blanked).replace('____', '<span class="blank"></span>')}</div>
      <div class="quiz-sub">${esc(ex.en)} Type the missing Hangul item.</div>
      <input class="quiz-input" id="quizInput" type="text" autocomplete="off" placeholder="한글로 입력">
      <div class="study-actions" style="justify-content:flex-start;"><button class="primary-button" type="button" data-submit-typed>Submit</button><button class="action-button" type="button" data-skip>Skip</button></div>
    `;
  }
  const formEntries = Object.entries(q.entry.forms || {});
  const [formKey, formValue] = sample(formEntries);
  q.correctAnswer = formValue;
  if (q.type === 'form-choice') {
    const wrong = shuffle(formEntries.filter(([k]) => k !== formKey).map(([, v]) => v)).slice(0, 3);
    const options = shuffle([formValue, ...wrong]);
    return `
      <div class="quiz-question">${esc(FORM_LABELS[formKey])}</div>
      <div class="quiz-sub">Choose the correct form for ${esc(q.entry.hangul)}.</div>
      <div class="quiz-options">${options.map(o => optionButton(o, o === formValue)).join('')}</div>
    `;
  }
  return `
    <div class="quiz-question">${esc(q.entry.english)} · ${esc(FORM_LABELS[formKey])}</div>
    <div class="quiz-sub">Type the Hangul form. Romanization is not accepted in v1.</div>
    <input class="quiz-input" id="quizInput" type="text" autocomplete="off" placeholder="한글로 입력">
    <div class="study-actions" style="justify-content:flex-start;"><button class="primary-button" type="button" data-submit-typed>Submit</button><button class="action-button" type="button" data-skip>Skip</button></div>
  `;
}

function optionButton(label, correct, value = '') {
  return `<button class="quiz-option" type="button" data-correct="${correct}" data-value="${esc(value || label)}">${esc(label)}</button>`;
}

function wireQuiz(q) {
  document.querySelectorAll('.quiz-option').forEach(btn => {
    btn.addEventListener('click', () => submitOption(btn, q));
  });
  const input = $('quizInput');
  if (input) {
    input.focus();
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') submitTyped(q);
    });
    document.querySelector('[data-submit-typed]').addEventListener('click', () => submitTyped(q));
    document.querySelector('[data-skip]').addEventListener('click', () => {
      state.quizAnswers.push({ correct: false, entry: q.entry, answer: '', prompt: q.activity?.prompt, correctAnswer: q.correctAnswer });
      nextQuestion();
    });
  }
}

function submitOption(btn, q) {
  const correct = btn.dataset.correct === 'true';
  document.querySelectorAll('.quiz-option').forEach(opt => {
    if (opt.dataset.correct === 'true') opt.classList.add('is-correct');
    else if (opt === btn) opt.classList.add('is-wrong');
    opt.disabled = true;
  });
  state.quizAnswers.push({ correct, entry: q.entry, answer: btn.dataset.value, prompt: q.activity?.prompt, correctAnswer: q.correctAnswer });
  setTimeout(nextQuestion, 850);
}

function submitTyped(q) {
  const value = $('quizInput').value.trim();
  const correct = value === q.correctAnswer;
  const feedback = document.createElement('div');
  feedback.className = 'quiz-feedback';
  feedback.innerHTML = correct ? `Correct: <strong>${esc(q.correctAnswer)}</strong>` : `Answer: <strong>${esc(q.correctAnswer)}</strong>`;
  $('quizCard').appendChild(feedback);
  state.quizAnswers.push({ correct, entry: q.entry, answer: value, prompt: q.activity?.prompt, correctAnswer: q.correctAnswer });
  setTimeout(nextQuestion, 950);
}

function nextQuestion() {
  state.quizIdx += 1;
  renderQuiz();
}

function renderQuizResults() {
  const total = state.quizAnswers.length;
  const correct = state.quizAnswers.filter(a => a.correct).length;
  const wrong = state.quizAnswers.filter(a => !a.correct);
  $('quizCard').innerHTML = `
    <div class="quiz-question">${correct} / ${total}</div>
    <div class="quiz-sub">${state.quizChapterId ? 'Chapter review' : 'Card review'} · Accuracy ${Math.round((correct / Math.max(total, 1)) * 100)}%</div>
    ${wrong.length ? `<div class="quiz-options">${wrong.map(a => a.entry?.id
      ? `<button class="quiz-option" type="button" data-entry="${esc(a.entry.id)}">${esc(a.entry.hangul)} · ${esc(a.entry.english)}</button>`
      : `<div class="quiz-option result-only">${esc(a.prompt || a.entry?.english || 'Review item')} · Answer: ${esc(a.correctAnswer || '')}</div>`
    ).join('')}</div>` : '<p class="quiz-feedback">Clean round. Nicely done.</p>'}
    <div class="study-actions" style="justify-content:flex-start;"><button class="primary-button" type="button" id="restartQuiz">New quiz</button><button class="action-button" type="button" id="backToBrowse">Browse</button></div>
  `;
  $('restartQuiz').addEventListener('click', () => state.quizChapterId ? startChapterQuiz(state.quizChapterId, false) : startQuiz());
  $('backToBrowse').addEventListener('click', () => setMode('browse'));
  document.querySelectorAll('#quizCard [data-entry]').forEach(btn => btn.addEventListener('click', () => openDetail(btn.dataset.entry)));
}

function distractors(entry, pool, n) {
  const sameType = pool.filter(e => e.id !== entry.id && e.type === entry.type);
  const fallback = pool.filter(e => e.id !== entry.id);
  return shuffle(sameType.length >= n ? sameType : fallback).slice(0, n);
}

function clearFilters(render = true) {
  state.search = '';
  $('searchInput').value = '';
  Object.entries(state.filters).forEach(([key, value]) => {
    if (value instanceof Set) value.clear();
    else state.filters[key] = false;
  });
  if (render) renderBrowse();
}

function goHome() {
  clearFilters(false);
  setMode('course');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openPalette() {
  $('paletteModal').classList.add('is-open');
  $('paletteModal').setAttribute('aria-hidden', 'false');
  $('paletteInput').value = '';
  state.paletteFocus = 0;
  renderPalette('');
  setTimeout(() => $('paletteInput').focus(), 30);
}
function closePalette() {
  $('paletteModal').classList.remove('is-open');
  $('paletteModal').setAttribute('aria-hidden', 'true');
}
function renderPalette(query) {
  const q = norm(query);
  const matches = (q ? state.entries.filter(e => searchableText(e).includes(q)) : state.entries).slice(0, 12);
  $('paletteResults').innerHTML = matches.map((e, i) => `
    <button class="palette-row ${i === state.paletteFocus ? 'is-focused' : ''}" type="button" data-entry="${esc(e.id)}">
      <strong>${esc(e.hangul)}</strong> <span class="muted">${esc(e.romanization)} · ${esc(e.english)}</span>
    </button>
  `).join('') || '<div class="empty-state">No matches.</div>';
  $('paletteResults').querySelectorAll('[data-entry]').forEach(btn => {
    btn.addEventListener('click', () => {
      closePalette();
      openDetail(btn.dataset.entry);
    });
  });
}
function handlePaletteKeys(e) {
  const rows = [...$('paletteResults').querySelectorAll('.palette-row')];
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    state.paletteFocus = Math.min(rows.length - 1, state.paletteFocus + 1);
    renderPalette($('paletteInput').value);
  }
  if (e.key === 'ArrowUp') {
    e.preventDefault();
    state.paletteFocus = Math.max(0, state.paletteFocus - 1);
    renderPalette($('paletteInput').value);
  }
  if (e.key === 'Enter') rows[state.paletteFocus]?.click();
  if (e.key === 'Escape') closePalette();
}

function handleKeys(e) {
  if (e.key === 'Escape') {
    closeDetail();
    closePalette();
  }
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    openPalette();
  }
  if (e.target.matches('input, textarea')) return;
  if (e.key === '1') setMode('course');
  if (e.key === '2') setMode('browse');
  if (e.key === '3') setMode('flashcard');
  if (e.key === '4') setMode('quiz');
  if (state.mode === 'flashcard') {
    if (e.code === 'Space') {
      e.preventDefault();
      state.flashRevealed = !state.flashRevealed;
      renderFlashcard();
    }
    if (e.key === 'ArrowRight') handleFlash('next', currentFlashEntry());
    if (e.key === 'ArrowLeft') handleFlash('prev', currentFlashEntry());
  }
}

init();
