/* Progressive CE 6300 concept coaching. Works alongside, not in place of, the full curriculum. */
(() => {
  'use strict';
  const esc = x => String(x ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
  const original = 'Original in-depth theory, equation, symbols, assumptions and derivation';
  const paths = ['Understand', 'See an example', 'Full theory', 'Exam recall', 'Practice'];
  const shortcuts = `<nav class="learning-shortcuts" aria-label="How to navigate this topic"><strong>LEARN THIS WAY:</strong>
    ${paths.map((v,i)=>`<button type="button" data-learn-target="${['start-here','walk-through','deep-theory','exam-memory','practice-challenges'][i]}">${esc(v)}</button>`).join('')}
  </nav>`;
  function intro(d) {
    return `<section class="learning-bridge" id="start-here" aria-labelledby="learn-start-title">
      <div class="learn-eyebrow">START SIMPLE · READ BEFORE THE FORMULAS</div>
      <h2 id="learn-start-title">Get the idea in one minute 🌱</h2>
      <p class="learn-lede">${esc(d.simple)}</p>
      <div class="learn-grid"><div class="learn-tile"><b>🎬 Picture it</b><p>${esc(d.picture)}</p></div>
      <div class="learn-tile"><b>🔎 How the exam might describe it</b><p>${esc(d.trigger)}</p></div></div>
      <div class="learn-route"><span>Understand the question</span><span class="learn-arrow">→</span><span>Choose the method</span><span class="learn-arrow">→</span><span>Calculate</span><span class="learn-arrow">→</span><span>Check the answer</span></div>
      <div class="learn-mini" id="walk-through"><div class="learn-eyebrow">STUDY ONE SMALL EXAMPLE</div>
        <h3>Try it together, one step at a time ✏️</h3>
        <p class="mini-problem"><strong>Question:</strong> ${esc(d.mini[0])}</p>
        <p class="learn-coach">Think for 10 seconds before opening each step. Say <em>why</em> that step is needed; don't merely copy the numbers.</p>
        <ol>${d.mini.slice(1).map((step,i)=>`<li><details><summary>Reveal step ${i+1} of ${d.mini.length-1}</summary><p>${esc(step)}</p></details></li>`).join('')}</ol>
        <p class="learn-coach">Now cover the solutions and try the same procedure with the new questions below. If you get stuck, open the detailed theory.</p>
      </div>
    </section>`;
  }
  function exam(d) {
    return `<section class="exam-bridge" id="exam-memory" aria-labelledby="exam-recall-title">
      <span class="exam-small">EXAM RECALL · CHOOSE FIRST, CALCULATE SECOND</span><h2 id="exam-recall-title">How to recognize and remember it 🧠</h2>
      <div class="exam-trigger"><strong>When you see a question like this ...</strong><p>${esc(d.trigger)}</p></div>
      <div class="exam-trigger"><strong>... use this reasoning pattern</strong><p>${esc(d.do)}</p></div>
      <div class="learn-memory">💡 ${esc(d.memory)}</div>
      <div class="exam-trap"><strong>Common exam trap:</strong> ${esc(d.trap)}</div>
      <details><summary>🎯 Two-minute closed-book self-test</summary><p><strong>Question:</strong> ${esc(d.test[0])}</p><p><strong>Reasoning:</strong> ${esc(d.test[1])}</p></details>
      <p class="exam-small" style="margin:17px 0 5px">SIMPLE RETRIEVAL SCHEDULE — NO RE-READING FIRST</p>
      <div class="exam-reminder"><div><span>Tomorrow</span>Explain the method from memory in 60 seconds.</div><div><span>After 3 days</span>Classify and solve a fresh question without notes.</div><div><span>After 7 days</span>Mix this topic with neighboring methods in a short exam drill.</div></div>
      <p style="font-size:12px">If a step is missed, correct it immediately and retry sooner. These are suggested intervals, not a guaranteed optimal schedule.</p>
    </section>`;
  }
  function apply() {
    const article=document.getElementById('reading-content');
    if (!article || !article.classList.contains('reader-article') || article.dataset.learningBoosted) return;
    const match=(location.hash || '').match(/^#topic\/([^/?]+)/);
    if(!match)return;
    const id=decodeURIComponent(match[1]);
    const data=window.RS_LEARNING_BOOST?.[id];
    if(!data)return;
    const sections=Array.from(article.children).filter(el=>el.classList.contains('reader-section'));
    if(sections.length<9 || !article.querySelector('.reader-objectives'))return;
    // Use the existing long course material in place; hide only the first four reference sections by default.
    article.dataset.learningBoosted=id;
    article.classList.add('learning-enhanced');
    article.querySelector('.reader-lede')?.insertAdjacentHTML('afterend',shortcuts);
    article.querySelector('.reader-objectives').insertAdjacentHTML('afterend',intro(data));
    sections.slice(0,4).forEach(s=>s.classList.add('learning-advanced'));
    sections[0].id='deep-theory';
    sections[0].insertAdjacentHTML('beforebegin',`<div class="reader-deep-drawer" id="deep-theory-controls"><button type="button" class="reader-deep-toggle" data-learning-toggle aria-expanded="false" aria-controls="deep-theory">▾ ${original}</button><p class="reader-deep-caption">The full long lesson is preserved here whenever you want to understand the underlying mathematics.</p></div>`);
    const practice=sections.find(s=>s.querySelector('h2')?.textContent.trim().startsWith('07 ·'));
    if(practice){practice.id='practice-challenges';practice.insertAdjacentHTML('beforebegin',exam(data));}
  }
  function init() {
    const root=document.getElementById('main-content');
    if(!root)return;
    const watcher=new MutationObserver(apply);
    watcher.observe(root,{childList:true});
    apply();
  }
  document.addEventListener('click',event=>{
    const btn=event.target.closest('[data-learn-target],[data-learning-toggle]');
    if(!btn)return;
    const article=document.getElementById('reading-content');
    if(!article)return;
    const expand=()=>{
      article.classList.add('advanced-open');
      const control=article.querySelector('[data-learning-toggle]');
      if(control){control.setAttribute('aria-expanded','true');control.textContent=`▴ Hide ${original.toLowerCase()}`;}
    };
    if(btn.hasAttribute('data-learning-toggle')){
      if(article.classList.contains('advanced-open')){
        article.classList.remove('advanced-open');btn.setAttribute('aria-expanded','false');btn.textContent='▾ '+original;
      }else{expand();}
      return;
    }
    const target=btn.getAttribute('data-learn-target');
    if(target==='deep-theory')expand();
    document.getElementById(target)?.scrollIntoView({behavior:'smooth',block:'start'});
  });
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();
