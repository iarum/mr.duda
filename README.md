# mr. duda - learn Georgian

A free chatbot tutor for learning Georgian, for English and Russian speakers.

- 12 lessons (140 words), the Georgian alphabet, grammar tips
- Smart quizzes with spaced repetition (words you're about to forget come back first)
- Translator: type English, Russian or Georgian
- Example sentences from [Tatoeba](https://tatoeba.org)
- Three moods: friendly, funny, flirty
- Works offline and installs on phones (PWA)

Plain HTML, CSS and JavaScript - no build step, no accounts, no tracking.
Progress is stored in the browser (localStorage).

## Run locally

```
python -m http.server 8000
```

Then open http://localhost:8000. (Opening `index.html` directly works too, but
install and offline mode need http.)

## Releasing a change

Bump `CACHE` in `sw.js` (e.g. `mr-duda-v5` -> `mr-duda-v6`) so installed copies update.

## Credits

Icons: [Lucide](https://lucide.dev) (ISC). Example sentences: [Tatoeba](https://tatoeba.org) (CC BY 2.0 FR).
