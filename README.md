# Everyday English 2026

한국인을 위한 진짜 생활영어 루틴 교재입니다. Pages 원본의 everyday activity 흐름을 바탕으로 60개 레슨을 정리했고, 중복된 `SECTION 4: MANAGING A HOUSEHOLD`는 제거했습니다. 전화번호부, 공중전화, 신문 영화표 같은 오래된 상황은 연락처 앱, 메시지, 스트리밍, 모바일 결제, 모바일뱅킹, 배송 추적 등 2026년 맥락으로 바꿨습니다.

## How to open locally

`index.html`은 `data/lessons.json`을 `fetch()`로 불러옵니다. 브라우저에서 파일을 직접 열면 보안 정책 때문에 JSON 로딩이 막힐 수 있으니 작은 로컬 서버로 여는 것을 권장합니다.

```bash
cd "/Users/hannam/Documents/New project 3"
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## File structure

```text
index.html
styles.css
app.js
data/
  lessons.json
assets/
  prompts/
    image-prompts.md
README.md
```

## What is included

- 6 modules and 60 normalized lessons
- Korean-friendly scene explanations
- English story lines with Korean translation and notes
- Vocabulary split by verbs, nouns, chunks, phrasal verbs, adjectives/adverbs
- Grammar focus, expression upgrades, learner traps, speaking practice, mini quiz
- Hidden answer keys with accordions
- Visual Duct-Tape image prompts for every lesson
- Search/filter by title, Korean title, tag, story, and vocabulary
- Dark mode, Korean explanation toggle, teacher mode, print button
- Local progress tracking with `localStorage`

## How to add a new lesson

Open `data/lessons.json`, choose the target module, and add a lesson object with the same shape as the existing lessons:

```json
{
  "id": "lesson-61",
  "number": 61,
  "title": "Doing a Video Meeting",
  "titleKo": "화상회의 하기",
  "difficulty": "B1",
  "situationTag": "online meeting",
  "grammarFocus": "Polite requests / Could you...?",
  "estimatedStudyTime": "22 min",
  "sceneKo": "...",
  "story": [{ "en": "...", "ko": "...", "noteKo": "..." }],
  "vocabulary": {
    "verbs": [],
    "nouns": [],
    "phrases": [],
    "phrasalVerbs": [],
    "adjectives": []
  },
  "grammar": {},
  "expressionUpgrade": {},
  "learnerTrap": {},
  "practice": {},
  "quiz": {},
  "imagePrompts": {},
  "teacherNote": {}
}
```

After editing, validate:

```bash
python3 -m json.tool data/lessons.json >/tmp/lessons.valid.json
```

## How to generate images

Use `assets/prompts/image-prompts.md` or the in-app “Copy image prompt” buttons. Paste the prompt into GPT-5.5 / ChatGPT Images and generate the image. Keep these rules:

- Do not put written labels inside the image.
- Avoid logos, brand marks, copyrighted characters, and stereotypes.
- Use realistic Korean adult learner contexts.
- Add captions and labels in HTML, not inside the generated image.

## Replacing placeholders with generated images

The current UI uses prompt placeholders so the page never breaks when images are missing. To add real images later, place them in an image folder such as `assets/images/`, add an `imageSrc` field to the relevant `imagePrompts` object, and update `app.js` to render `<img>` when that field exists.

## Printing handouts

Use the top-right `Print` button. It renders the currently filtered lesson set into a print collection with page breaks between lessons. To print only one module, choose that module in the filter first, then press `Print`.

## Notes for teachers

Teacher mode reveals classroom notes for each lesson. In class, keep the rhythm simple:

1. Start with the Today’s Scene in Korean.
2. Read the English story once for meaning.
3. Drill 3-4 key chunks aloud.
4. Upgrade one Basic sentence into Natural and More native-like versions.
5. End with the 30-second self-speaking challenge.

The goal is not perfect translation. The goal is for learners to feel, “아, 이거 내가 바로 말할 수 있겠다.”
