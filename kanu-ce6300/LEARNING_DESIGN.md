# Chapter 5 — understanding-first teaching release

This release **adds a beginner-friendly layer**; it does not replace the long engineering lessons, 53-topic curriculum, original examples, independent exam drills, or Chapter 5 six-minute review.

For every Chapter 5 topic:
1. **Start here** — a 60-second explanation in plain language; a concrete physical analogy and the exam question trigger.
2. **Learn together** — a new small numerical problem. The steps are hidden independently: learners should predict each next step, reveal it, and self-explain why it works.
3. **Go deeper** — the original full derivation, symbol glossary, assumptions and detailed mathematical explanation remain available in a collapsible in-depth reference.
4. **Recognize it on the exam** — a decision rule, meaningful recall cue, common error, diagnostic check and its hidden explanation.
5. **Independent transfer** — existing exercises and quizzes remain visible after instruction; practice is not replaced by memorizing a mnemonic.

### Why this pedagogy?
- Worked examples reduce initial cognitive overload for beginners; the guided solution becomes gradually less guided as skills improve (MIT Open Learning).
- Active retrieval and spaced practice are more effective for long-term access than repeated passive rereading (Dunlosky et al., 2013).
- Mnemonics serve as **reminders for causal decision rules** only, never as a substitute for explaining the choice or checking applicability.
- Suggested revision intervals of tomorrow, after three days, and after seven days are convenient defaults, **not a guaranteed optimal schedule**; revisit sooner when a prompt was missed.

### Updating the source
- Edit `learning-boost.json` to change a topic's simple analogy, exam decision or new worked example.
- Keep `learning-boost.js` synchronized: `window.RS_LEARNING_BOOST = ` + minified JSON + `;`.
- Every listed solution is an **original instructional example**, not an official faculty exam question. Confirm instructor scope before making exam coverage claims.
