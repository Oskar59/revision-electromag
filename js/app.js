/* ============ Shell, navigation, KaTeX, quiz, flashcards, progression ============ */
(function(){
const SUBJ = {phys:{t:"Physique — Électromagnétisme", short:"Physique", home:"physique.html", ico:"∇", form:"formulaire.html"}, elec:{t:"Électronique analogique", short:"Électronique", home:"electronique.html", ico:"Ω", form:"el-formulaire.html"}, math:{t:"Mathématiques", short:"Maths", home:"mathematiques.html", ico:"∫", form:"ma-formulaire.html"}};
const GAMES=window.ATLAS_GAMES=[
 {id:"ch0",ch:"ch0",s:"phys",ico:"🌫",t:"Brouillard",d:"Exploration à l’aveugle : seule la flèche du gradient te guide vers les sommets."},
 {id:"ch0q",ch:"ch0",s:"phys",ico:"🧭",t:"Main droite",d:"Entraînement : vecteurs, gradient, coordonnées.",q:1},
 {id:"ch1",ch:"ch1",s:"phys",ico:"⚡",t:"Champ libre",d:"Pose des charges + et − pour guider une particule jusqu’à la cible."},
 {id:"ch2",ch:"ch2",s:"phys",ico:"📺",t:"Oscilloscope",d:"Faisceau invisible : calcule la tension des plaques pour toucher les cibles."},
 {id:"ch2q",ch:"ch2",s:"phys",ico:"🔋",t:"L’atelier",d:"Entraînement : capacité, résistance, énergie.",q:1},
 {id:"ch3",ch:"ch3",s:"phys",ico:"🌀",t:"Cyclotron",d:"Choisis le champ B pour courber les particules dans le détecteur."},
 {id:"ch4",ch:"ch4",s:"phys",ico:"🧲",t:"Dynamo",d:"Agite l’aimant pour éclairer la ville… contre la loi de Lenz."},
 {id:"ch4q",ch:"ch4",s:"phys",ico:"🔁",t:"Loi de Lenz",d:"Entraînement : prédire le phénomène induit.",q:1},
 {id:"ch5",ch:"ch5",s:"phys",ico:"📡",t:"Radio",d:"Règle et oriente ton antenne : λ/2 et polarisation."},
 {id:"ch5q",ch:"ch5",s:"phys",ico:"🌊",t:"Onde & Maxwell",d:"Entraînement : trièdre, équations, λ = c/f.",q:1},
 {id:"el1",ch:"el1",s:"elec",ico:"💡",t:"Court-circuit",d:"Un vrai circuit calculé en direct : place les résistances, allume, ne grille pas les fusibles."},
 {id:"el2",ch:"el2",s:"elec",ico:"🔫",t:"Condensator",d:"Shoot’em up : ton canon tire l’énergie ½Cu² d’un condensateur en charge."},
 {id:"el3",ch:"el3",s:"elec",ico:"🛡",t:"Filtre-Défense",d:"Bloque le bruit, laisse passer les données : choisis et règle ton filtre en temps réel."},
 {id:"el4",ch:"el4",s:"elec",ico:"🛸",t:"Saturation",d:"Ton vaisseau est la sortie de l’AOP : change de montage pour passer les portes."},
 {id:"el1q",ch:"el1",s:"elec",ico:"🔌",t:"Banc de test",d:"Entraînement : diviseurs, associations, Thévenin.",q:1},
 {id:"el2q",ch:"el2",s:"elec",ico:"⏱",t:"Chrono τ",d:"Entraînement : arrête la charge au bon instant.",q:1},
 {id:"el3q",ch:"el3",s:"elec",ico:"📈",t:"Bode match",d:"Entraînement : retrouve le filtre à partir de la courbe.",q:1},
 {id:"ma1",ch:"ma1",s:"math",ico:"🚀",t:"Rotor complexe",d:"Multiplie pour tourner : amène le vaisseau sur la cible."},
 {id:"ma2",ch:"ma2",s:"math",ico:"🎯",t:"Chasseur de primitives",d:"Attrape la bonne primitive, évite les pièges."},
 {id:"ma3",ch:"ma3",s:"math",ico:"🚗",t:"Suspension",d:"Règle λ et ω₀ en roulant : ni rebond, ni secousse, ni résonance."},
 {id:"ma3q",ch:"ma3",s:"math",ico:"🎛",t:"Régime parfait",d:"Entraînement : imiter la solution de l’EDO.",q:1},
 {id:"ma4",ch:"ma4",s:"math",ico:"🔪",t:"Découpe",d:"Tranche au vol le domaine qui correspond aux bornes."},
 {id:"ma4q",ch:"ma4",s:"math",ico:"🍰",t:"Tranches",d:"Entraînement : bornes et repères.",q:1},
 {id:"ma5",ch:"ma5",s:"math",ico:"🧮",t:"Pivot",d:"Échelonne la matrice en un minimum de coups."},
 {id:"ma6",ch:"ma6",s:"math",ico:"🎯",t:"Défense harmonique",d:"Compte les oscillations, tape le rang n, détruis l’harmonique."},
 {id:"ma6q",ch:"ma6",s:"math",ico:"🎹",t:"Synthé de Fourier",d:"Entraînement : reconstruire un signal.",q:1},
 {id:"ma7",ch:"ma7",s:"math",ico:"⏳",t:"Incertitude",d:"Ton impulsion doit tenir en temps ET en fréquence."},
 {id:"ma7q",ch:"ma7",s:"math",ico:"🌈",t:"Le prisme",d:"Entraînement : signaux et spectres.",q:1},
 {id:"ma8",ch:"ma8",s:"math",ico:"📖",t:"Traducteur de Laplace",d:"Attrape la bonne image F(p)."}];
const NAV = [
  {s:"phys",h:"Démarrer"},
  {s:"phys",id:"physique", href:"physique.html", n:"⌂", t:"Accueil Physique & carte"},
  {s:"phys",id:"methodes", href:"methodes.html", n:"★", t:"Patterns : quoi faire quand…"},
  {s:"phys",h:"Cours — Partie A"},
  {s:"phys",id:"ch0", href:"ch0.html", n:"0", t:"Le langage de la physique"},
  {s:"phys",id:"ch1", href:"ch1.html", n:"1", t:"Électrostatique : charges, champ, potentiel, Gauss"},
  {s:"phys",id:"ch2", href:"ch2.html", n:"2", t:"Conducteurs, condensateurs, courant"},
  {s:"phys",id:"ch3", href:"ch3.html", n:"3", t:"Magnétostatique"},
  {s:"phys",id:"ch4", href:"ch4.html", n:"4", t:"Induction électromagnétique"},
  {s:"phys",id:"ch5", href:"ch5.html", n:"5", t:"Équations de Maxwell & onde EM"},
  {s:"phys",h:"Travaux dirigés"},
  {s:"phys",id:"td1", href:"td1.html", n:"T1", t:"TD 1 — Électrostatique"},
  {s:"phys",id:"td2", href:"td2.html", n:"T2", t:"TD 2 — Conducteurs & courant"},
  {s:"phys",id:"td3", href:"td3.html", n:"T3", t:"TD 3 — Magnétostatique (Ampère)"},
  {s:"phys",h:"S'entraîner"},
  {s:"phys",id:"jeux", href:"jeux.html", n:"🕹", t:"Arcade : les jeux"},
  {s:"phys",id:"liens", href:"liens.html", n:"∞", t:"Les mêmes équations partout"},
  {s:"phys",id:"formulaire", href:"formulaire.html", n:"Σ", t:"Formulaire complet"},
  {s:"phys",id:"quiz", href:"quiz.html", n:"?", t:"Examen blanc & flashcards"},
  {s:"elec",h:"Démarrer"},
  {s:"elec",id:"electronique", href:"electronique.html", n:"⌂", t:"Accueil Électronique & carte"},
  {s:"elec",id:"el-methodes", href:"el-methodes.html", n:"★", t:"Patterns : quoi faire quand…"},
  {s:"elec",h:"Cours"},
  {s:"elec",id:"el1", href:"el1.html", n:"1", t:"Notions de base : lois, diviseurs, Thévenin, Millman"},
  {s:"elec",id:"el2", href:"el2.html", n:"2", t:"Régime transitoire : RC, RL, RLC"},
  {s:"elec",id:"el3", href:"el3.html", n:"3", t:"Régime sinusoïdal & filtrage (Bode)"},
  {s:"elec",id:"el4", href:"el4.html", n:"4", t:"Amplificateur opérationnel (AOP)"},
  {s:"elec",h:"Travaux dirigés"},
  {s:"elec",id:"eltd1", href:"eltd1.html", n:"T1", t:"TD 1 — Notions de base"},
  {s:"elec",id:"eltd2", href:"eltd2.html", n:"T2", t:"TD 2 — Régime transitoire"},
  {s:"elec",id:"eltd3", href:"eltd3.html", n:"T3", t:"TD 3 — Sinusoïdal & fonction de transfert"},
  {s:"elec",h:"S'entraîner"},
  {s:"elec",id:"jeux", href:"jeux.html", n:"🕹", t:"Arcade : les jeux"},
  {s:"elec",id:"liens", href:"liens.html", n:"∞", t:"Les mêmes équations partout"},
  {s:"elec",id:"el-formulaire", href:"el-formulaire.html", n:"Σ", t:"Formulaire complet"},
  {s:"elec",id:"el-quiz", href:"el-quiz.html", n:"?", t:"Examen blanc & flashcards"},
  {s:"math",h:"Démarrer"},
  {s:"math",id:"mathematiques", href:"mathematiques.html", n:"⌂", t:"Accueil Maths & carte"},
  {s:"math",id:"ma-methodes", href:"ma-methodes.html", n:"★", t:"Patterns : quoi faire quand…"},
  {s:"math",id:"ma-gen", href:"ma-gen.html", n:"⚄", t:"Générateur d'exercices"},
  {s:"math",h:"Analyse"},
  {s:"math",id:"ma1", href:"ma1.html", n:"1", t:"Nombres complexes"},
  {s:"math",id:"ma2", href:"ma2.html", n:"2", t:"Calcul intégral"},
  {s:"math",id:"ma3", href:"ma3.html", n:"3", t:"Équations différentielles linéaires"},
  {s:"math",id:"ma4", href:"ma4.html", n:"4", t:"Intégrales doubles & triples"},
  {s:"math",h:"Algèbre linéaire"},
  {s:"math",id:"ma5", href:"ma5.html", n:"5", t:"Matrices, systèmes, déterminants"},
  {s:"math",h:"Analyse de Fourier"},
  {s:"math",id:"ma6", href:"ma6.html", n:"6", t:"Séries de Fourier"},
  {s:"math",id:"ma7", href:"ma7.html", n:"7", t:"Intégrales généralisées & transformée de Fourier"},
  {s:"math",id:"ma8", href:"ma8.html", n:"8", t:"Transformée de Laplace"},
  {s:"math",h:"S'entraîner"},
  {s:"math",id:"jeux", href:"jeux.html", n:"🕹", t:"Arcade : les jeux"},
  {s:"math",id:"liens", href:"liens.html", n:"∞", t:"Les mêmes équations partout"},
  {s:"math",id:"ma-formulaire", href:"ma-formulaire.html", n:"Σ", t:"Formulaire complet"},
  {s:"math",id:"ma-quiz", href:"ma-quiz.html", n:"?", t:"Examen blanc & flashcards"},
];
window.EM_NAV = NAV;
const page = document.body.dataset.page || "index";
const cur = NAV.find(n=>n.id===page);
const gameQ = page==="jeu" ? GAMES.find(g=>g.id===new URLSearchParams(location.search).get("g")) : null;
const subj = (page==="liens"||page==="jeux") ? null : gameQ ? gameQ.s : (cur ? cur.s : null);
if(subj) document.documentElement.dataset.subj = subj;
const LS = {
  get(k,d){try{const v=localStorage.getItem("em:"+k);return v===null?d:JSON.parse(v)}catch(e){return d}},
  set(k,v){try{localStorage.setItem("em:"+k,JSON.stringify(v))}catch(e){}}
};
window.EM_LS = LS;

/* ---- theme ---- */
const savedTheme = LS.get("theme",null);
if(savedTheme) document.documentElement.dataset.theme = savedTheme;

/* ---- build shell ---- */
const article = document.querySelector("article.content");
const top = document.createElement("header");
top.className="topbar";
top.innerHTML = `<button class="iconbtn" id="menuBtn" aria-label="Menu">☰</button>
  <a class="brand" href="index.html"><span class="logo">${subj?SUBJ[subj].ico:"✦"}</span>Atlas${subj?` <span class="brand-sub">· ${SUBJ[subj].short}</span>`:` <span class="brand-sub">· AP3</span>`}</a>
  <span class="spacer"></span>
  <a class="toparcade" href="jeux.html" title="Les jeux pour apprendre">🕹 <span>Arcade</span></a>
  <a class="iconbtn" href="${subj?SUBJ[subj].form:"formulaire.html"}" title="Formulaire" style="display:grid;place-items:center;text-decoration:none">Σ</a>
  <button class="iconbtn" id="themeBtn" title="Thème clair/sombre">◐</button>`;
const layout = document.createElement("div"); layout.className="layout";
const side = document.createElement("nav"); side.className="sidebar";
let sh = `<a href="index.html" class="${page==="index"?"active":""}"><span class="num">⌂</span><span>Accueil (toutes les matières)</span></a><a href="liens.html" class="${page==="liens"?"active":""}"><span class="num">∞</span><span>Les mêmes équations partout</span></a><a href="jeux.html" class="arcade-link ${page==="jeux"||page==="jeu"?"active":""}"><span class="num">🕹</span><span>Arcade : ${GAMES.length} jeux</span></a><div class="subjsw">${Object.entries(SUBJ).map(([k,v])=>`<a href="${v.home}" class="${k===subj?"on":""}">${v.ico} ${v.short}</a>`).join("")}</div>`;
NAV.forEach(it=>{
  if(subj ? it.s!==subj : true) return;
  if(it.h){sh+=`<h4>${it.h}</h4>`;return;}
  const pct = progressOf(it.id);
  sh+=`<a href="${it.href}" class="${it.id===page?"active":""}"><span class="num">${it.n}</span><span>${it.t}</span>${pct!==null?`<span class="pbar" title="${pct}% maîtrisé"><i style="width:${pct}%"></i></span>`:""}</a>`;
});
side.innerHTML = sh;
const main = document.createElement("main");
const toc = document.createElement("aside"); toc.className="toc";
document.body.prepend(top);
article.parentNode.insertBefore(layout, article);
layout.append(side, main, toc);
main.append(article);

document.getElementById("menuBtn").onclick=()=>document.body.classList.toggle("nav-open");
main.addEventListener("click",()=>document.body.classList.remove("nav-open"));
document.getElementById("themeBtn").onclick=()=>{
  const cur = document.documentElement.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");
  const nx = cur==="dark"?"light":"dark";
  document.documentElement.dataset.theme = nx; LS.set("theme",nx);
  window.dispatchEvent(new Event("themechange"));
};

function progressOf(id){
  const total = LS.get("t:"+id,null); if(!total) return null;
  const m = LS.get("m:"+id,{}); const n = Object.values(m).filter(Boolean).length;
  return Math.round(100*n/total);
}
window.EM_progressOf = progressOf;

/* ---- carte « jeu du chapitre » ---- */
const myGame=GAMES.find(g=>g.ch===page);
if(myGame){ const rec=LS.get("game:"+myGame.id,{best:0,stars:0}); const gc=document.createElement("a"); gc.className="gamecard"; gc.href="jeu.html?g="+myGame.id;
  gc.innerHTML=`<div class="gico">${myGame.ico}</div><div><span>🎮 Le jeu du chapitre ${rec.stars?"· "+"★".repeat(rec.stars):""}</span><b>${myGame.t}</b><span>${myGame.d}</span></div><div class="play">▶ Jouer</div>`;
  const anchor=article.querySelector(".lmap")||article.querySelector(".card.key"); if(anchor) anchor.after(gc); else article.querySelector("h1")?.after(gc);
  const gc2=gc.cloneNode(true); const fl=article.querySelector("#flash,#retenir"); if(fl) fl.before(gc2); }

/* ---- TOC + mastery toggles ---- */
const h2s = [...article.querySelectorAll("h2[id]")];
if(h2s.length){
  let th = `<h5>Sur cette page</h5>`;
  h2s.forEach(h=>{ th+=`<a href="#${h.id}">${h.dataset.short||h.textContent.replace(/^\s*\d+(\.\d+)?\s*/,"")}</a>`; });
  toc.innerHTML = th;
  const tocLinks=[...toc.querySelectorAll("a")];
  const obs = new IntersectionObserver(es=>{
    es.forEach(e=>{ if(e.isIntersecting){ tocLinks.forEach(a=>a.classList.toggle("on",a.getAttribute("href")==="#"+e.target.id)); } });
  },{rootMargin:"-10% 0px -80% 0px"});
  h2s.forEach(h=>obs.observe(h));
}
const trackable = h2s.filter(h=>!h.hasAttribute("data-nomaster"));
if(trackable.length && page!=="index"){
  LS.set("t:"+page, trackable.length);
  const m = LS.get("m:"+page,{});
  trackable.forEach(h=>{
    const b=document.createElement("button"); b.className="master"+(m[h.id]?" on":"");
    b.textContent = m[h.id]?"✓ Maîtrisé":"Je maîtrise ?";
    b.title="Cocher quand tu sais refaire / réexpliquer cette partie sans notes";
    b.onclick=()=>{ const mm=LS.get("m:"+page,{}); mm[h.id]=!mm[h.id]; LS.set("m:"+page,mm);
      b.classList.toggle("on",mm[h.id]); b.textContent=mm[h.id]?"✓ Maîtrisé":"Je maîtrise ?"; refreshSide(); };
    h.append(b);
  });
}
function refreshSide(){
  side.querySelectorAll("a").forEach((a,i)=>{});
  const it = NAV.find(n=>n.id===page); if(!it) return;
  const a = side.querySelector("a.active .pbar i"); const p=progressOf(page);
  if(a&&p!==null){a.style.width=p+"%";}
}

/* ---- pager ---- */
const flat = NAV.filter(n=>n.id && n.s===subj);
const idx = flat.findIndex(n=>n.id===page);
if(idx>=0 && !article.hasAttribute("data-nopager")){
  const pv=flat[idx-1], nx=flat[idx+1];
  const pg=document.createElement("div"); pg.className="pager";
  pg.innerHTML=(pv?`<a href="${pv.href}"><small>← Précédent</small>${pv.t}</a>`:"<span></span>")+(nx?`<a class="next" href="${nx.href}"><small>Suivant →</small>${nx.t}</a>`:"<span></span>");
  article.append(pg);
}

/* ---- step-by-step reveal ---- */
article.querySelectorAll(".steps").forEach(st=>{
  const steps=[...st.querySelectorAll(":scope>.step")]; let k=0;
  const bar=document.createElement("div"); bar.className="stepbar";
  const next=document.createElement("button"); next.className="btn";
  const all=document.createElement("button"); all.className="btn ghost"; all.textContent="Tout afficher";
  const reset=document.createElement("button"); reset.className="btn ghost"; reset.textContent="Recommencer";
  function upd(){ steps.forEach((s,i)=>s.classList.toggle("shown",i<k));
    next.textContent = k===0? (st.dataset.start||"Afficher la 1ʳᵉ étape") : (k<steps.length?`Étape suivante (${k+1}/${steps.length})`:"Terminé ✓");
    next.disabled = k>=steps.length; }
  next.onclick=()=>{k++;upd();}; all.onclick=()=>{k=steps.length;upd();}; reset.onclick=()=>{k=0;upd();};
  bar.append(next,all,reset); st.append(bar); upd();
});

/* ---- quiz engine ---- */
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
window.EM_shuffle=shuffle;
function buildQuiz(el, qs, key){
  el.innerHTML="";
  let answered=0, good=0;
  const score=document.createElement("div"); score.className="qscore";
  const best=LS.get("qbest:"+key,null);
  function updScore(){ score.innerHTML=`<span>Score : ${good} / ${answered} répondues (${qs.length} questions)</span>`+(best!==null?`<span class="muted small">Meilleur score : ${best}/${qs.length}</span>`:"")+`<span style="margin-left:auto"></span>`;
    const r=document.createElement("button"); r.className="btn ghost"; r.textContent="Mélanger & recommencer"; r.onclick=()=>buildQuiz(el, el._pool?pickPool(el):shuffle(qs), key); score.append(r);
    if(answered===qs.length){ const b=LS.get("qbest:"+key,0); if(good>b) LS.set("qbest:"+key,good); } }
  qs.forEach((q,i)=>{
    const c=document.createElement("div"); c.className="qcard";
    const order=shuffle(q.o.map((t,j)=>({t,j})));
    c.innerHTML=`<div class="qn">QUESTION ${i+1}${q.ch?` · ${q.ch}`:""}</div><div class="q">${q.q}</div><div class="opts"></div><div class="expl"></div>`;
    const opts=c.querySelector(".opts");
    order.forEach(o=>{ const b=document.createElement("button"); b.className="opt"; b.innerHTML=o.t;
      b.onclick=()=>{ if(c.classList.contains("done"))return; c.classList.add("done"); answered++;
        const ok=o.j===q.a; if(ok)good++;
        opts.querySelectorAll(".opt").forEach((bb,k)=>{bb.disabled=true; if(order[k].j===q.a) bb.classList.add("good");});
        if(!ok) b.classList.add("badc");
        c.querySelector(".expl").innerHTML=(ok?"✅ <b>Exact.</b> ":"❌ <b>Non.</b> ")+q.e;
        renderMath(c.querySelector(".expl")); updScore(); };
      opts.append(b); });
    el.append(c);
  });
  el.append(score); updScore(); renderMath(el);
}
function pickPool(el){ return shuffle(el._pool).slice(0, el._n||el._pool.length); }
window.EM_buildQuiz=buildQuiz;
article.querySelectorAll(".quiz[data-quiz]").forEach(el=>{
  const keys=el.dataset.quiz.split(",");
  let pool=[]; keys.forEach(k=>{ (window.EM_DATA?.quiz?.[k]||[]).forEach(q=>pool.push(Object.assign({ch: keys.length>1?chapName(k):null},q))); });
  el._pool=pool; el._n=+el.dataset.n||pool.length;
  buildQuiz(el, keys.length>1||el.dataset.n?pickPool(el):pool, el.dataset.quiz);
});
function chapName(k){ return {ch0:"Ch. 0",ch1:"Ch. 1",ch2:"Ch. 2",ch3:"Ch. 3",ch4:"Ch. 4",ch5:"Ch. 5",td1:"TD1",td2:"TD2",td3:"TD3",el1:"Ch. 1",el2:"Ch. 2",el3:"Ch. 3",el4:"Ch. 4",eltd1:"TD1",eltd2:"TD2",eltd3:"TD3",ma1:"Complexes",ma2:"Intégrales",ma3:"EDO",ma4:"Int. multiples",ma5:"Matrices",ma6:"Séries de Fourier",ma7:"Transf. Fourier",ma8:"Laplace"}[k]||k; }

/* ---- flashcards ---- */
article.querySelectorAll(".flash[data-cards]").forEach(el=>{
  const keys=el.dataset.cards.split(",");
  let deck=[]; keys.forEach(k=>(window.EM_DATA?.cards?.[k]||[]).forEach(c=>deck.push(Object.assign({k},c))));
  let order=deck.slice(), i=0, known=new Set(LS.get("fc:"+el.dataset.cards,[]));
  el.innerHTML=`<div class="fc-stage"><div class="fc"><div class="face front"><small>Question</small><div class="txt"></div></div><div class="face back"><small>Réponse</small><div class="txt"></div></div></div></div>
  <div class="fc-bar"><button class="btn ghost" data-a="prev">←</button><button class="btn" data-a="flip">Retourner</button><button class="btn ghost" data-a="ok">✓ Je savais</button><button class="btn ghost" data-a="ko">↻ À revoir</button><button class="btn ghost" data-a="next">→</button><button class="btn ghost" data-a="shuf">Mélanger</button><span class="count"></span></div>`;
  const fc=el.querySelector(".fc"), fr=el.querySelector(".front .txt"), bk=el.querySelector(".back .txt"), cnt=el.querySelector(".count");
  function show(){ const c=order[i]; fc.classList.remove("flip"); fr.innerHTML=c.f; bk.innerHTML=c.b; renderMath(fc);
    cnt.textContent=`${i+1}/${order.length} · ${[...known].filter(x=>deck.some(d=>d.f===x)).length} sues`; }
  fc.onclick=()=>fc.classList.toggle("flip");
  el.querySelector(".fc-bar").onclick=e=>{ const a=e.target.dataset.a; if(!a)return;
    if(a==="flip")fc.classList.toggle("flip");
    if(a==="next"){i=(i+1)%order.length;show();}
    if(a==="prev"){i=(i-1+order.length)%order.length;show();}
    if(a==="ok"){known.add(order[i].f);LS.set("fc:"+el.dataset.cards,[...known]);i=(i+1)%order.length;show();}
    if(a==="ko"){known.delete(order[i].f);LS.set("fc:"+el.dataset.cards,[...known]);order.push(order[i]);i=(i+1)%order.length;show();}
    if(a==="shuf"){order=shuffle(deck);i=0;show();}
  };
  if(deck.length) show(); else el.textContent="(pas de cartes)";
});

/* ---- KaTeX ---- */
function renderMath(node){
  if(window.renderMathInElement){
    renderMathInElement(node,{delimiters:[{left:"$$",right:"$$",display:true},{left:"\\[",right:"\\]",display:true},{left:"$",right:"$",display:false},{left:"\\(",right:"\\)",display:false}],
      throwOnError:false, strict:false, trust:(c)=>c.command==="\\htmlClass", macros:{"\\vec":"\\overrightarrow{#1}","\\rot":"\\overrightarrow{\\mathrm{rot}}\\,","\\dive":"\\mathrm{div}\\,","\\grad":"\\overrightarrow{\\mathrm{grad}}\\,","\\d":"\\mathrm{d}","\\ur":"\\overrightarrow{e_r}","\\uz":"\\overrightarrow{e_z}","\\ut":"\\overrightarrow{e_\\theta}","\\ux":"\\overrightarrow{e_x}","\\uy":"\\overrightarrow{e_y}"}});
  }
}
window.EM_renderMath=renderMath;
function initMath(){ if(window.renderMathInElement){ renderMath(article); window.dispatchEvent(new Event("mathready")); } else setTimeout(initMath,60); }
initMath();

/* ---- révélation au scroll ---- */
if("IntersectionObserver" in window){ const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target);} }),{rootMargin:"0px 0px -6% 0px"});
  article.querySelectorAll(":scope>.card,:scope>.grid2,:scope>.grid3,:scope>figure,:scope>.exo,:scope>.chapgrid,:scope>.subjects,:scope>.quick,:scope>.arcade-grid,:scope>.decision,:scope>.tablewrap,:scope>.gamecard").forEach(el=>{ const r=el.getBoundingClientRect(); if(r.top>innerHeight){ el.classList.add("rv"); io.observe(el);} });
  const showAll=()=>article.querySelectorAll(".rv:not(.in)").forEach(el=>{ const r=el.getBoundingClientRect(); if(r.top<innerHeight*1.2) el.classList.add("in"); });
  window.addEventListener("scroll",()=>{ clearTimeout(showAll._t); showAll._t=setTimeout(showAll,250); },{passive:true}); }

/* ---- home progress cards ---- */
document.querySelectorAll("[data-progress]").forEach(el=>{
  const ks=el.dataset.progress.split(","); const vals=ks.map(progressOf); const seen=vals.filter(v=>v!==null);
  const p=seen.length?Math.round(vals.reduce((a,v)=>a+(v||0),0)/ks.length):null; const i=el.querySelector("i"); if(i) i.style.width=(p||0)+"%";
  const lab=el.parentNode.querySelector(".plabel"); if(lab) lab.textContent = p===null?"Pas encore ouvert":`${p}% maîtrisé`;
});

/* ---- formulaire search ---- */
const sb=document.querySelector(".searchbox[data-filter]");
if(sb){ sb.addEventListener("input",()=>{ const q=sb.value.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
  document.querySelectorAll(sb.dataset.filter).forEach(r=>{ const t=(r.dataset.k||r.textContent).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,""); r.style.display=t.includes(q)?"":"none"; });
  document.querySelectorAll(".fgroup").forEach(g=>{ const vis=[...g.querySelectorAll(sb.dataset.filter)].some(r=>r.style.display!=="none"); g.style.display=vis?"":"none"; });
}); }
})();
