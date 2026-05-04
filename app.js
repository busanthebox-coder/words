const DATA_URL = "data/lessons.json";
const STORAGE = {
  studied: "everyday-english-2026:studied",
  theme: "everyday-english-2026:theme",
  ko: "everyday-english-2026:ko-visible",
  teacher: "everyday-english-2026:teacher-mode"
};

const state = {
  course: null,
  lessons: [],
  filtered: [],
  selectedId: null,
  activeTab: "story",
  studied: new Set(),
  copyPayloads: new Map()
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function readJsonStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function saveStudied() {
  localStorage.setItem(STORAGE.studied, JSON.stringify([...state.studied]));
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(STORAGE.theme, theme);
  const isDark = theme === "dark";
  $("#theme-toggle").textContent = isDark ? "Light" : "Dark";
  $("#theme-toggle").setAttribute("aria-pressed", String(isDark));
}

function setKoVisible(visible) {
  document.body.classList.toggle("hide-ko", !visible);
  localStorage.setItem(STORAGE.ko, JSON.stringify(visible));
  $("#ko-toggle").setAttribute("aria-pressed", String(visible));
}

function setTeacherMode(enabled) {
  document.body.classList.toggle("teacher-mode", enabled);
  localStorage.setItem(STORAGE.teacher, JSON.stringify(enabled));
  $("#teacher-mode").setAttribute("aria-pressed", String(enabled));
  if (!enabled && state.activeTab === "teacher") {
    state.activeTab = "story";
    renderLesson(getSelectedLesson());
  }
}

function moduleForLesson(lesson) {
  return state.course.modules.find((module) => module.lessons.some((item) => item.id === lesson.id));
}

function allVocab(lesson) {
  const vocab = lesson.vocabulary || {};
  return Object.entries(vocab).flatMap(([category, items = []]) =>
    items.map((item) => ({ ...item, category }))
  );
}

function searchableText(lesson) {
  return [
    lesson.title,
    lesson.titleKo,
    lesson.situationTag,
    lesson.grammarFocus,
    ...(lesson.tags || []),
    ...allVocab(lesson).flatMap((item) => [item.en, item.ko, item.example]),
    ...(lesson.story || []).flatMap((line) => [line.en, line.ko])
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function registerCopy(text) {
  const id = `copy-${state.copyPayloads.size + 1}`;
  state.copyPayloads.set(id, text);
  return id;
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast("Copied.");
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.append(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
    showToast("Copied.");
  }
}

let toastTimer;
function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 1700);
}

function flattenCourse(course) {
  return course.modules.flatMap((module) =>
    module.lessons.map((lesson) => ({
      ...lesson,
      moduleId: module.id,
      moduleTitle: module.title,
      moduleTitleKo: module.titleKo,
      moduleAccent: module.accent
    }))
  );
}

function renderOverview() {
  const lessonCount = state.lessons.length;
  const vocabCount = state.lessons.reduce((sum, lesson) => sum + allVocab(lesson).length, 0);
  const promptCount = lessonCount * 4;
  const moduleCount = state.course.modules.length;
  $("#overview-stats").innerHTML = [
    ["Modules", moduleCount],
    ["Lessons", lessonCount],
    ["Vocabulary items", vocabCount],
    ["Image prompts", promptCount]
  ]
    .map(([label, value]) => `<div class="stat-card"><strong>${value}</strong><span>${label}</span></div>`)
    .join("");
}

function renderModuleCards() {
  $("#module-cards").innerHTML = state.course.modules
    .map((module) => {
      const count = module.lessons.length;
      return `
        <button class="module-card" data-module-jump="${escapeHtml(module.id)}" data-accent="${escapeHtml(module.accent)}" type="button">
          <p class="eyebrow">${escapeHtml(module.title)}</p>
          <h3>${escapeHtml(module.titleKo)}</h3>
          <p>${escapeHtml(module.descriptionKo)}</p>
          <div class="module-meta">
            <span>${count} lessons</span>
            <span>${escapeHtml(module.grammarGuideKo || "")}</span>
          </div>
        </button>
      `;
    })
    .join("");
}

function renderFilters() {
  const moduleSelect = $("#module-filter");
  moduleSelect.insertAdjacentHTML(
    "beforeend",
    state.course.modules
      .map((module) => `<option value="${escapeHtml(module.id)}">${escapeHtml(module.title)} / ${escapeHtml(module.titleKo)}</option>`)
      .join("")
  );

  const levels = [...new Set(state.lessons.map((lesson) => lesson.difficulty).filter(Boolean))].sort();
  $("#difficulty-filter").insertAdjacentHTML(
    "beforeend",
    levels.map((level) => `<option value="${escapeHtml(level)}">${escapeHtml(level)}</option>`).join("")
  );
}

function renderToc() {
  const toc = $("#toc-list");
  toc.innerHTML = state.course.modules
    .map((module) => {
      const links = module.lessons
        .map((lesson) => {
          const active = lesson.id === state.selectedId ? " is-active" : "";
          const studied = state.studied.has(lesson.id) ? " is-studied" : "";
          return `
            <button class="toc-link${active}${studied}" data-lesson-id="${escapeHtml(lesson.id)}" type="button">
              <span class="toc-number">${String(lesson.number).padStart(2, "0")}</span>
              <span>${escapeHtml(lesson.title)}</span>
            </button>
          `;
        })
        .join("");
      return `
        <div class="toc-module">
          <div class="toc-module-title">${escapeHtml(module.title)}</div>
          ${links}
        </div>
      `;
    })
    .join("");
}

function applyFilters() {
  const query = $("#search-input").value.trim().toLowerCase();
  const moduleId = $("#module-filter").value;
  const difficulty = $("#difficulty-filter").value;
  state.filtered = state.lessons.filter((lesson) => {
    const moduleMatch = moduleId === "all" || lesson.moduleId === moduleId;
    const difficultyMatch = difficulty === "all" || lesson.difficulty === difficulty;
    const searchMatch = !query || searchableText(lesson).includes(query);
    return moduleMatch && difficultyMatch && searchMatch;
  });

  if (!state.filtered.some((lesson) => lesson.id === state.selectedId)) {
    state.selectedId = state.filtered[0]?.id || state.lessons[0]?.id;
    state.activeTab = "story";
  }

  renderLessonList();
  renderToc();
  renderLesson(getSelectedLesson());
  renderBanks();
  updateProgress();
}

function renderLessonList() {
  $("#lesson-count").textContent = `${state.filtered.length} shown`;
  $("#lesson-list").innerHTML = state.filtered
    .map((lesson) => {
      const active = lesson.id === state.selectedId ? " is-active" : "";
      const studied = state.studied.has(lesson.id) ? "Studied" : lesson.difficulty || "";
      return `
        <button class="lesson-card-button${active}" data-lesson-id="${escapeHtml(lesson.id)}" type="button">
          <small>${String(lesson.number).padStart(2, "0")} · ${escapeHtml(lesson.moduleTitleKo)} · ${escapeHtml(studied)}</small>
          <strong>${escapeHtml(lesson.title)}</strong>
          <small>${escapeHtml(lesson.titleKo)}</small>
        </button>
      `;
    })
    .join("");
}

function getSelectedLesson() {
  return state.lessons.find((lesson) => lesson.id === state.selectedId) || state.lessons[0];
}

function renderLesson(lesson) {
  const detail = $("#lesson-detail");
  if (!lesson) {
    detail.innerHTML = '<div class="loading-card">No lesson found.</div>';
    return;
  }

  const module = moduleForLesson(lesson) || {};
  const storyCopy = (lesson.story || []).map((line) => `${line.en}\n${line.ko || ""}`).join("\n\n");
  const vocabCopy = allVocab(lesson)
    .map((item) => `${categoryLabel(item.category)} · ${item.en} = ${item.ko}\n${item.example || ""}`)
    .join("\n\n");
  const storyCopyId = registerCopy(storyCopy);
  const vocabCopyId = registerCopy(vocabCopy);
  const teacherClass = "teacher-only";

  detail.style.setProperty("--accent", `var(--${lesson.moduleAccent || "blue"})`);
  detail.innerHTML = `
    <header class="lesson-hero">
      <div class="lesson-kicker">
        <span class="level-tag">${escapeHtml(lesson.difficulty || "A2")}</span>
        <span class="tag">${escapeHtml(module.title || lesson.moduleTitle || "")}</span>
        <span class="tag">${escapeHtml(lesson.situationTag || "")}</span>
      </div>
      <h2>${String(lesson.number).padStart(2, "0")}. ${escapeHtml(lesson.title)}</h2>
      <p class="lesson-title-ko">${escapeHtml(lesson.titleKo || "")}</p>
      <div class="lesson-meta-row">
        <span class="tag">${escapeHtml(lesson.grammarFocus || "")}</span>
        <span class="tag">${escapeHtml(lesson.estimatedStudyTime || "")}</span>
        <label class="studied-control">
          <input type="checkbox" data-studied-toggle="${escapeHtml(lesson.id)}" ${state.studied.has(lesson.id) ? "checked" : ""} />
          Studied
        </label>
      </div>
    </header>

    <div class="tabs" role="tablist" aria-label="Lesson sections">
      ${tabButton("story", "Story")}
      ${tabButton("vocab", "Vocabulary")}
      ${tabButton("grammar", "Grammar")}
      ${tabButton("practice", "Practice")}
      ${tabButton("images", "Images")}
      ${tabButton("teacher", "Teacher Note", teacherClass)}
    </div>

    ${panel("story", renderStoryPanel(lesson, storyCopyId))}
    ${panel("vocab", renderVocabPanel(lesson, vocabCopyId))}
    ${panel("grammar", renderGrammarPanel(lesson))}
    ${panel("practice", renderPracticePanel(lesson))}
    ${panel("images", renderImagesPanel(lesson))}
    ${panel("teacher", renderTeacherPanel(lesson), teacherClass)}
  `;
}

function tabButton(tab, label, extraClass = "") {
  const selected = state.activeTab === tab;
  return `
    <button class="tab-button ${extraClass}" id="tab-${tab}" data-tab="${tab}" role="tab" aria-controls="panel-${tab}" aria-selected="${selected}" type="button">
      ${label}
    </button>
  `;
}

function panel(tab, html, extraClass = "") {
  const active = state.activeTab === tab ? " is-active" : "";
  return `
    <section class="tab-panel${active} ${extraClass}" id="panel-${tab}" role="tabpanel" aria-labelledby="tab-${tab}">
      ${html}
    </section>
  `;
}

function renderStoryPanel(lesson, copyId) {
  const story = lesson.story || [];
  const expressionExplanation = lesson.expressionUpgrade?.learnerExplanation;
  return `
    <section class="lesson-section">
      <h3>Today’s Scene</h3>
      <p class="scene-text">${escapeHtml(lesson.sceneKo || "")}</p>
      <div class="action-row">
        <button class="copy-button" data-copy-id="${copyId}" type="button">Copy story</button>
      </div>
    </section>
    <section class="lesson-section">
      <h3>Core English Story</h3>
      <ol class="story-list">
        ${story
          .map(
            (line, index) => `
          <li class="story-item">
            <span class="story-number">${index + 1}</span>
            <div>
              <p class="story-en">${escapeHtml(line.en || "")}</p>
              <p class="story-ko">${escapeHtml(line.ko || "")}</p>
              ${line.noteKo ? `<p class="story-note">${escapeHtml(line.noteKo)}</p>` : ""}
            </div>
          </li>
        `
          )
          .join("")}
      </ol>
    </section>
    <section class="lesson-section">
      <h3>Expression Upgrade</h3>
      <div class="upgrade-grid">
        <div class="upgrade-card"><strong>Basic</strong><p>${escapeHtml(lesson.expressionUpgrade?.basic || "")}</p></div>
        <div class="upgrade-card"><strong>Natural</strong><p>${escapeHtml(lesson.expressionUpgrade?.natural || "")}</p></div>
        <div class="upgrade-card"><strong>More native-like</strong><p>${escapeHtml(lesson.expressionUpgrade?.moreNativeLike || "")}</p></div>
      </div>
      ${expressionExplanation ? renderLearnerExplanation(expressionExplanation, "표현 업그레이드 감각") : ""}
    </section>
  `;
}

function renderVocabPanel(lesson, copyId) {
  const vocab = lesson.vocabulary || {};
  const groups = ["verbs", "nouns", "phrases", "phrasalVerbs", "adjectives"]
    .filter((key) => (vocab[key] || []).length)
    .map((key) => {
      const items = vocab[key] || [];
      return `
        <section class="vocab-group">
          <h4>${categoryLabel(key)}</h4>
          ${items
            .map(
              (item) => `
            <article class="vocab-item">
              <div class="vocab-head">
                <strong>${escapeHtml(item.en || "")}</strong>
                <span>${escapeHtml(item.ko || "")}</span>
              </div>
              <p>${escapeHtml(item.explanationEn || "")}</p>
              <p class="ko-copy">${escapeHtml(item.noteKo || "")}</p>
              <p><em>${escapeHtml(item.example || "")}</em></p>
            </article>
          `
            )
            .join("")}
        </section>
      `;
    })
    .join("");

  return `
    <section class="lesson-section">
      <div class="section-title">
        <div>
          <h3>Key Vocabulary</h3>
          <p>동사, 명사, 청크, 구동사를 장면 단위로 외웁니다.</p>
        </div>
        <button class="copy-button" data-copy-id="${copyId}" type="button">Copy vocabulary</button>
      </div>
      <div class="vocab-columns">${groups}</div>
    </section>
  `;
}

function renderGrammarPanel(lesson) {
  const grammar = lesson.grammar || {};
  const learner = grammar.learnerExplanation;
  const examples = grammar.nativeExamples || [];
  const badGood = grammar.badGood || [];
  return `
    <section class="lesson-section">
      <h3>Grammar / Pattern Focus</h3>
      ${learner ? renderLearnerExplanation(learner, lesson.grammarFocus || "Pattern") : `
        <div class="pattern-grid">
          <div class="pattern-card"><strong>한 줄 공식</strong><p>${escapeHtml(grammar.formulaKo || lesson.grammarFocus || "")}</p></div>
          <div class="pattern-card"><strong>언제 쓰는지</strong><p>${escapeHtml(grammar.usageKo || "")}</p></div>
          <div class="pattern-card"><strong>헷갈리는 포인트</strong><p>${escapeHtml(grammar.confusionKo || "")}</p></div>
        </div>
      `}
    </section>
    <section class="lesson-section">
      <h3>원어민식 자연스러운 예문</h3>
      <ul class="line-list">
        ${examples.map((example) => `<li>${escapeHtml(example)}</li>`).join("")}
      </ul>
    </section>
    <section class="lesson-section">
      <h3>Korean Learner Trap</h3>
      <ul class="trap-list">
        ${(lesson.learnerTrap?.items || [])
          .map((item) => `<li><strong>${escapeHtml(item.mistake || "")}</strong><p>${escapeHtml(item.fixKo || "")}</p></li>`)
          .join("")}
      </ul>
    </section>
    <section class="lesson-section">
      <h3>Bad vs Good</h3>
      <ul class="line-list">
        ${badGood
          .map(
            (item) => `
          <li>
            <strong>Bad:</strong> ${escapeHtml(item.bad || "")}<br />
            <strong>Good:</strong> ${escapeHtml(item.good || "")}
            <p class="ko-copy">${escapeHtml(item.noteKo || "")}</p>
          </li>
        `
          )
          .join("")}
      </ul>
    </section>
  `;
}

function renderLearnerExplanation(explanation, title) {
  const mistakes = explanation.commonMistakes || [];
  const patterns = explanation.shortPatterns || [];
  return `
    <div class="learner-explanation">
      <div class="learner-formula">
        <span>${escapeHtml(title)}</span>
        <strong>한 줄 공식:</strong>
        <p>${escapeHtml(explanation.formulaKo || "")}</p>
      </div>
      <div class="pattern-grid learner-grid">
        <article class="pattern-card">
          <strong>직역하면 어색한 이유</strong>
          <p>${escapeHtml(explanation.awkwardLiteralReasonKo || "")}</p>
        </article>
        <article class="pattern-card">
          <strong>한국어 감각으로 이해하는 이미지</strong>
          <p>${escapeHtml(explanation.imageKo || "")}</p>
        </article>
        <article class="pattern-card">
          <strong>원어민이 실제로 쓰는 상황</strong>
          <p>${escapeHtml(explanation.nativeSituationKo || "")}</p>
        </article>
      </div>
      <div class="learner-two-column">
        <article class="pattern-card">
          <strong>한국인이 자주 하는 실수</strong>
          <ul class="mistake-list">
            ${mistakes.map((item) => `
              <li>
                <span class="bad">X ${escapeHtml(item.wrong || "")}</span>
                <span class="good">O ${escapeHtml(item.right || "")}</span>
                ${item.noteKo ? `<p class="ko-copy">${escapeHtml(item.noteKo)}</p>` : ""}
              </li>
            `).join("")}
          </ul>
        </article>
        <article class="pattern-card">
          <strong>바로 말할 수 있는 짧은 패턴</strong>
          <ul class="speak-list">
            ${patterns.map((pattern) => `<li>${escapeHtml(pattern)}</li>`).join("")}
          </ul>
        </article>
      </div>
    </div>
  `;
}

function renderPracticePanel(lesson) {
  const practice = lesson.practice || {};
  const quiz = lesson.quiz || {};
  const answers = [
    ...(quiz.fillBlank || []).map((item, index) => `${index + 1}. ${item.answer}`),
    ...(quiz.translation || []).map((item, index) => `Translation ${index + 1}. ${item.answer}`)
  ];

  return `
    <section class="lesson-section">
      <h3>Speaking Practice</h3>
      <div class="practice-grid">
        <div class="practice-card">
          <strong>Repeat-after-me</strong>
          <ul class="line-list">${(practice.repeatAfterMe || []).map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul>
        </div>
        <div class="practice-card">
          <strong>Substitution drill</strong>
          <p>${escapeHtml(practice.substitutionDrill?.pattern || "")}</p>
          <p class="ko-copy">${escapeHtml((practice.substitutionDrill?.changeWords || []).join(" · "))}</p>
        </div>
        <div class="practice-card">
          <strong>30-second challenge</strong>
          <p>${escapeHtml(practice.selfSpeakingChallenge || "")}</p>
        </div>
      </div>
    </section>
    <section class="lesson-section">
      <h3>Pair Practice</h3>
      <ul class="line-list">
        ${(practice.pairPractice || [])
          .map((line) => `<li><strong>A:</strong> ${escapeHtml(line.a || "")}<br /><strong>B:</strong> ${escapeHtml(line.b || "")}</li>`)
          .join("")}
      </ul>
      <p class="ko-copy"><strong>Mini role-play:</strong> ${escapeHtml(practice.miniRolePlay || "")}</p>
    </section>
    <section class="lesson-section">
      <h3>Mini Quiz</h3>
      <div class="quiz-box">
        <h4>Fill in the blank</h4>
        <ol>${(quiz.fillBlank || []).map((item) => `<li>${escapeHtml(item.question || "")}</li>`).join("")}</ol>
        <h4>Translation</h4>
        <ol>${(quiz.translation || []).map((item) => `<li>${escapeHtml(item.ko || "")}</li>`).join("")}</ol>
        <h4>Speaking mission</h4>
        <p>${escapeHtml(quiz.speakingMission || "")}</p>
        <details>
          <summary>Answer key</summary>
          <div class="answer-key">${answers.map((answer) => `<p>${escapeHtml(answer)}</p>`).join("")}</div>
        </details>
      </div>
    </section>
  `;
}

function renderImagesPanel(lesson) {
  const prompts = lesson.imagePrompts || {};
  const entries = [
    ["hero", "Hero scene image"],
    ["process", "Step-by-step process image"],
    ["vocabCard", "Vocabulary visual card image"],
    ["rolePlay", "Speaking role-play scene image"]
  ];

  return `
    <section class="lesson-section">
      <h3>Visual Duct-Tape: 장면을 붙여주는 이미지 프롬프트</h3>
      <p class="scene-text">이미지 안에 글자를 넣지 말고, 필요한 라벨은 HTML이나 수업 자료에서 따로 붙이세요.</p>
      <div class="image-grid">
        ${entries
          .map(([key, label]) => {
            const item = prompts[key] || {};
            const promptPack = [
              `Lesson ${String(item.lessonNumber || lesson.number).padStart(2, "0")}: ${item.lessonTitle || lesson.title} / ${item.lessonTitleKo || lesson.titleKo}`,
              `Image type: ${item.imageType || label}`,
              `Purpose: ${item.purpose || ""}`,
              `Aspect ratio: ${item.aspectRatio || ""}`,
              `Recommended placement in HTML: ${item.recommendedPlacement || ""}`,
              "",
              "Prompt:",
              item.prompt || "",
              "",
              "Negative prompt:",
              item.negativePrompt || "",
              "",
              `Alt text: ${item.alt || ""}`,
              `Caption in Korean: ${item.captionKo || item.caption || ""}`,
              `Caption in English: ${item.captionEn || ""}`
            ].join("\n");
            const copyId = registerCopy(promptPack);
            return `
              <article class="image-card">
                <div class="image-placeholder">${escapeHtml(label)}</div>
                <strong>${escapeHtml(item.imageType || label)}</strong>
                <p>${escapeHtml(item.purpose || "")}</p>
                <div class="prompt-meta">
                  <span>${escapeHtml(item.aspectRatio || "")}</span>
                  <span>${escapeHtml(item.recommendedPlacement || "")}</span>
                </div>
                <div class="prompt-text">${escapeHtml(item.prompt || "")}</div>
                <details>
                  <summary>Negative prompt</summary>
                  <div class="answer-key">${escapeHtml(item.negativePrompt || "")}</div>
                </details>
                <p class="ko-copy">${escapeHtml(item.captionKo || item.caption || "")}</p>
                <p>${escapeHtml(item.captionEn || "")}</p>
                <button class="copy-button" data-copy-id="${copyId}" type="button">Copy image prompt</button>
              </article>
            `;
          })
          .join("")}
      </div>
    </section>
  `;
}

function renderTeacherPanel(lesson) {
  const note = lesson.teacherNote || {};
  return `
    <section class="lesson-section teacher-note">
      <h3>Teacher Note</h3>
      <p><strong>Emphasize:</strong> ${escapeHtml(note.emphasizeKo || "")}</p>
      <p><strong>Likely struggle:</strong> ${escapeHtml(note.struggleKo || "")}</p>
      <p><strong>Warm-up:</strong> ${escapeHtml(note.warmupQuestionKo || "")}</p>
      <p><strong>Extension:</strong> ${escapeHtml(note.extensionActivityKo || "")}</p>
      <p><strong>Source transformation:</strong> ${escapeHtml(lesson.sourceTransformationKo || "")}</p>
    </section>
  `;
}

function categoryLabel(key = "") {
  return {
    verbs: "Verbs",
    nouns: "Nouns",
    phrases: "Phrases / chunks",
    phrasalVerbs: "Phrasal verbs",
    adjectives: "Useful adjectives/adverbs"
  }[key] || key;
}

function renderBanks() {
  const vocabItems = state.filtered.flatMap((lesson) =>
    allVocab(lesson).map((item) => ({ ...item, lesson }))
  );

  $("#vocab-bank-grid").innerHTML = vocabItems
    .slice(0, 96)
    .map(
      (item) => `
      <article class="bank-card">
        <strong>${escapeHtml(item.en)} <span class="ko-copy">· ${escapeHtml(item.ko)}</span></strong>
        <p>${String(item.lesson.number).padStart(2, "0")} ${escapeHtml(item.lesson.title)}</p>
        <p>${escapeHtml(item.example || "")}</p>
      </article>
    `
    )
    .join("") || '<div class="loading-card">No vocabulary found.</div>';

  const promptCards = state.filtered.slice(0, 12).flatMap((lesson) =>
    Object.entries(lesson.imagePrompts || {}).map(([type, item]) => ({ lesson, type, item }))
  );
  $("#prompt-bank-grid").innerHTML = promptCards
    .map(({ lesson, type, item }) => {
      const copyId = registerCopy([
        `Lesson ${String(lesson.number).padStart(2, "0")}: ${lesson.title} / ${lesson.titleKo}`,
        `Image type: ${item.imageType || type}`,
        `Aspect ratio: ${item.aspectRatio || ""}`,
        `Recommended placement in HTML: ${item.recommendedPlacement || ""}`,
        "",
        "Prompt:",
        item.prompt || "",
        "",
        "Negative prompt:",
        item.negativePrompt || ""
      ].join("\n"));
      return `
        <article class="prompt-card">
          <strong>${String(lesson.number).padStart(2, "0")} ${escapeHtml(lesson.title)} · ${escapeHtml(item.imageType || type)}</strong>
          <p>${escapeHtml(item.captionKo || item.caption || "")}</p>
          <p>${escapeHtml(item.captionEn || "")}</p>
          <p>${escapeHtml(item.aspectRatio || "")} · ${escapeHtml(item.recommendedPlacement || "")}</p>
          <p class="prompt-preview">${escapeHtml(item.prompt || "")}</p>
          <button class="copy-button" data-copy-id="${copyId}" type="button">Copy image prompt</button>
        </article>
      `;
    })
    .join("") || '<div class="loading-card">No prompts found.</div>';
}

function updateProgress() {
  const studied = state.lessons.filter((lesson) => state.studied.has(lesson.id)).length;
  $("#progress-summary").textContent = `${studied} / ${state.lessons.length} studied`;
}

function selectLesson(id) {
  state.selectedId = id;
  state.activeTab = "story";
  renderLessonList();
  renderToc();
  renderLesson(getSelectedLesson());
  const detail = $("#lesson-viewer");
  detail.scrollIntoView({ behavior: "smooth", block: "start" });
  closeMenu();
}

function closeMenu() {
  $("#sidebar").classList.remove("is-open");
  $("#menu-toggle").setAttribute("aria-expanded", "false");
}

function renderPrintCollection() {
  let container = $("#print-collection");
  if (!container) {
    container = document.createElement("div");
    container.id = "print-collection";
    container.className = "print-collection";
    document.body.append(container);
  }

  const lessons = state.filtered.length ? state.filtered : state.lessons;
  container.innerHTML = lessons
    .map(
      (lesson) => `
      <article class="print-lesson">
        <h1>${String(lesson.number).padStart(2, "0")}. ${escapeHtml(lesson.title)}</h1>
        <h2>${escapeHtml(lesson.titleKo || "")}</h2>
        <p><strong>${escapeHtml(lesson.grammarFocus || "")}</strong> · ${escapeHtml(lesson.difficulty || "")}</p>
        <p>${escapeHtml(lesson.sceneKo || "")}</p>
        <h3>Story</h3>
        <ol>${(lesson.story || []).map((line) => `<li><strong>${escapeHtml(line.en || "")}</strong><br />${escapeHtml(line.ko || "")}</li>`).join("")}</ol>
        <h3>Vocabulary</h3>
        <ul>${allVocab(lesson).map((item) => `<li><strong>${escapeHtml(item.en)}</strong> · ${escapeHtml(item.ko)} · ${escapeHtml(item.example || "")}</li>`).join("")}</ul>
        <h3>Practice</h3>
        <p>${escapeHtml(lesson.practice?.selfSpeakingChallenge || "")}</p>
      </article>
    `
    )
    .join("");
}

function bindEvents() {
  $("#filters").addEventListener("input", applyFilters);
  $("#filters").addEventListener("change", applyFilters);

  $("#theme-toggle").addEventListener("click", () => {
    const current = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    setTheme(current);
  });

  $("#ko-toggle").addEventListener("click", () => {
    setKoVisible(document.body.classList.contains("hide-ko"));
  });

  $("#teacher-mode").addEventListener("click", () => {
    setTeacherMode(!document.body.classList.contains("teacher-mode"));
  });

  $("#print-button").addEventListener("click", () => {
    renderPrintCollection();
    document.body.classList.add("printing-all");
    window.print();
  });

  window.addEventListener("afterprint", () => {
    document.body.classList.remove("printing-all");
  });

  $("#menu-toggle").addEventListener("click", () => {
    const sidebar = $("#sidebar");
    const open = !sidebar.classList.contains("is-open");
    sidebar.classList.toggle("is-open", open);
    $("#menu-toggle").setAttribute("aria-expanded", String(open));
  });

  $("#menu-close").addEventListener("click", closeMenu);

  document.addEventListener("click", (event) => {
    const lessonButton = event.target.closest("[data-lesson-id]");
    if (lessonButton) {
      selectLesson(lessonButton.dataset.lessonId);
      return;
    }

    const moduleJump = event.target.closest("[data-module-jump]");
    if (moduleJump) {
      $("#module-filter").value = moduleJump.dataset.moduleJump;
      applyFilters();
      $("#lesson-viewer").scrollIntoView({ behavior: "smooth" });
      return;
    }

    const tab = event.target.closest("[data-tab]");
    if (tab) {
      state.activeTab = tab.dataset.tab;
      renderLesson(getSelectedLesson());
      return;
    }

    const copyButton = event.target.closest("[data-copy-id]");
    if (copyButton) {
      copyText(state.copyPayloads.get(copyButton.dataset.copyId) || "");
    }
  });

  document.addEventListener("change", (event) => {
    const input = event.target.closest("[data-studied-toggle]");
    if (!input) return;
    if (input.checked) state.studied.add(input.dataset.studiedToggle);
    else state.studied.delete(input.dataset.studiedToggle);
    saveStudied();
    renderLessonList();
    renderToc();
    updateProgress();
  });
}

async function init() {
  state.studied = new Set(readJsonStorage(STORAGE.studied, []));
  setTheme(localStorage.getItem(STORAGE.theme) || "light");
  setKoVisible(readJsonStorage(STORAGE.ko, true));
  setTeacherMode(readJsonStorage(STORAGE.teacher, false));
  bindEvents();

  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) throw new Error(`Could not load ${DATA_URL}`);
    state.course = await response.json();
    state.lessons = flattenCourse(state.course);
    state.filtered = [...state.lessons];
    state.selectedId = state.lessons[0]?.id || null;
    renderOverview();
    renderModuleCards();
    renderFilters();
    applyFilters();
  } catch (error) {
    $("#lesson-detail").innerHTML = `
      <div class="loading-card">
        <h2>Could not load lesson data.</h2>
        <p>${escapeHtml(error.message)}</p>
        <p>로컬 파일을 직접 열었다면 브라우저 보안 정책 때문에 JSON을 가져오지 못할 수 있습니다. README의 안내처럼 작은 로컬 서버로 열어 주세요.</p>
      </div>
    `;
  }
}

document.addEventListener("DOMContentLoaded", init);
