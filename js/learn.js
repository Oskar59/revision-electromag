/* ============ Composants d'apprentissage : injection, cartes logiques, prédictions,
   formules annotées, TD guidés, animations commentées ============ */
(function(){
const L=window.LEARN||{}; const page=document.body.dataset.page; const art=document.querySelector('article.content'); if(!art) return;
const esc=s=>s; // le contenu vient de nos propres données
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
function place(sel,where,node){ const t=art.querySelector(sel); if(!t) return false;
  if(where==='before') t.before(node); else if(where==='after') t.after(node); else if(where==='prepend') t.prepend(node); else t.append(node); return true; }
const frag=html=>{const d=document.createElement('div'); d.innerHTML=html; return d.children.length===1?d.firstElementChild:d;};

/* ---- 1. injections libres (images mentales, formules annotées…) ---- */
(L.inject||[]).filter(x=>x.p===page).forEach(x=>place(x.sel,x.w||'after',frag(x.html)));

/* ---- 2. carte logique du chapitre ---- */
const M=(L.maps||{})[page];
if(M){ const box=document.createElement('div'); box.className='lmap';
  let h=`<h3>🧠 La logique du chapitre</h3><div class="sub">${M.sub||'Clique sur une étape pour l’ouvrir. Lis les flèches : elles disent POURQUOI on passe à la suite.'}</div>`;
  M.nodes.forEach((n,i)=>{ h+=`<button type="button" class="lnode"><span class="k">${i+1}</span><b>${n.t}</b><div class="det">${n.d}${n.s?` <a href="${n.s}">→ voir la section</a>`:''}</div></button>`;
    if(n.why && i<M.nodes.length-1) h+=`<div class="larrow"><i>↓</i><span>${n.why}</span></div>`; });
  box.innerHTML=h; box.querySelectorAll('.lnode').forEach(b=>b.addEventListener('click',e=>{ if(e.target.tagName==='A') return; b.classList.toggle('open'); }));
  const anchor=art.querySelector('.card.key'); if(anchor) anchor.after(box); else art.querySelector('h1')?.after(box);
}

/* ---- 3. « Prédis avant de voir » ---- */
(L.predict||[]).filter(x=>x.p===page).forEach(x=>{
  const d=document.createElement('div'); d.className='predict';
  const order=shuffle(x.o.map((t,j)=>({t,j})));
  d.innerHTML=`<span class="tag">🔮 Prédis avant de manipuler</span><div class="q">${x.q}</div><div class="opts"></div><div class="res"></div>`;
  const opts=d.querySelector('.opts');
  order.forEach(o=>{ const b=document.createElement('button'); b.type='button'; b.className='opt'; b.innerHTML=o.t;
    b.onclick=()=>{ if(d.classList.contains('done')) return; d.classList.add('done');
      opts.querySelectorAll('.opt').forEach((bb,k)=>{ bb.disabled=true; if(order[k].j===x.a) bb.classList.add('good'); });
      if(o.j!==x.a) b.classList.add('badc');
      d.querySelector('.res').innerHTML=(o.j===x.a?'✅ <b>Bien vu.</b> ':'❌ <b>Pas tout à fait.</b> ')+x.e+(x.sel?' <b>Vérifie-le avec l’animation juste en dessous.</b>':'');
      window.EM_renderMath&&EM_renderMath(d);
      const f=d.nextElementSibling; if(f&&f.matches('figure')){ f.classList.remove('flash'); void f.offsetWidth; f.classList.add('flash'); }
    }; opts.append(b); });
  place(x.sel,'before',d);
});

/* ---- 4. TD guidés : « choisis l'étape suivante » ---- */
Object.entries(L.guided||{}).forEach(([key,steps])=>{
  const [pg,id]=key.split('#'); if(pg!==page) return; const sec=art.querySelector('#'+id); if(!sec) return;
  const g=document.createElement('div'); g.className='guided';
  g.innerHTML=`<span class="tag">🧭 Mode guidé — choisis toi-même l’étape suivante</span>`;
  let k=0;
  function addStep(){ const s=steps[k]; const st=document.createElement('div'); st.className='gstep';
    const order=shuffle(s.o.map((t,j)=>({t,j})));
    st.innerHTML=`<div class="gq">${k+1}. ${s.q}</div><div class="opts"></div><div class="ge"></div>`;
    const op=st.querySelector('.opts');
    order.forEach(o=>{ const b=document.createElement('button'); b.type='button'; b.className='opt'; b.innerHTML=o.t;
      b.onclick=()=>{ if(st.classList.contains('done')) return; st.classList.add('done');
        op.querySelectorAll('.opt').forEach((bb,i)=>{bb.disabled=true; if(order[i].j===s.a) bb.classList.add('good');}); if(o.j!==s.a) b.classList.add('badc');
        st.querySelector('.ge').innerHTML=(o.j===s.a?'✅ ':'❌ La bonne idée : ')+s.e; window.EM_renderMath&&EM_renderMath(st);
        k++; if(k<steps.length) addStep(); else g.classList.add('fin'); };
      op.append(b); });
    g.querySelector('.gend').before(st); window.EM_renderMath&&EM_renderMath(st); }
  const end=document.createElement('div'); end.className='gend'; end.textContent='✓ Tu as trouvé le chemin. Déroule maintenant la correction détaillée pour vérifier les calculs.'; g.append(end);
  const target=sec.querySelector('.steps')||sec.querySelector('.body'); if(target.classList.contains('steps')) target.before(g); else target.append(g);
  addStep();
});

/* ---- 5. Formules annotées : surbrillance des termes ---- */
function wireAnnot(){ art.querySelectorAll('.annot[data-legend]').forEach(a=>{ if(a._w) return; a._w=1;
  let leg; try{ leg=JSON.parse(a.dataset.legend);}catch(e){return;}
  const L2=document.createElement('div'); L2.className='legend'; const ex=document.createElement('div'); ex.className='expl'; ex.textContent='Survole ou clique un terme coloré (ou une pastille) pour savoir ce qu’il représente.';
  const show=(i,on)=>{ const [cls,lab,txt]=leg[i]; a.querySelectorAll('.katex .'+cls).forEach(e=>e.classList.toggle('hl',on)); L2.children[i].classList.toggle('on',on); if(on){ ex.innerHTML=`<b>${lab}</b> — ${txt}`; window.EM_renderMath&&EM_renderMath(ex);} };
  leg.forEach(([cls,lab],i)=>{ const b=document.createElement('button'); b.type='button'; b.className='chip k'+cls.slice(1); b.textContent=lab;
    b.onmouseenter=()=>show(i,true); b.onmouseleave=()=>show(i,false); b.onclick=()=>{ leg.forEach((_,j)=>j!==i&&show(j,false)); show(i,true); }; L2.append(b);
    a.querySelectorAll('.katex .'+cls).forEach(el=>{ el.addEventListener('mouseenter',()=>show(i,true)); el.addEventListener('mouseleave',()=>show(i,false)); el.addEventListener('click',()=>show(i,true)); }); });
  const sent=a.querySelector('.sentence'); (sent||a.lastElementChild).before(L2); L2.after(ex);
}); }
window.addEventListener('mathready',()=>setTimeout(wireAnnot,30));

/* ---- 6. Animations commentées ---- */
function storyFor(fig,st){
  const stage=fig.querySelector('.stage'), ctrl=fig.querySelector('.controls'); if(!stage) return false;
  const cap=document.createElement('div'); cap.className='storycap'; stage.append(cap);
  const bar=document.createElement('div'); bar.className='storybar';
  bar.innerHTML=`<button class="sb" data-a="play">▶ Explication guidée</button><button class="sb ghost" data-a="prev">⟵</button><button class="sb ghost" data-a="next">⟶</button><button class="sb ghost" data-a="stop">✕</button><span class="dots">${st.steps.map(()=>'<i></i>').join('')}</span>`;
  stage.after(bar);
  const F={ rng(i,v){const r=ctrl.querySelectorAll('input[type=range]')[i]; if(r){r.value=v; r.dispatchEvent(new Event('input'));}},
    btn(t){const b=[...ctrl.querySelectorAll('button')].find(b=>b.textContent.includes(t)); if(b) b.click();},
    chk(i,v){const c=ctrl.querySelectorAll('input[type=checkbox]')[i]; if(c&&c.checked!==v){c.checked=v; c.dispatchEvent(new Event('change'));}} };
  let k=-1, timer=null, playing=false; const dots=[...bar.querySelectorAll('.dots i')], pb=bar.querySelector('[data-a=play]');
  function go(n){ k=Math.max(0,Math.min(st.steps.length-1,n)); const s=st.steps[k];
    try{ s.a&&s.a(F); }catch(e){ console.warn(e); }
    cap.innerHTML=`<b>${k+1}/${st.steps.length}</b> · ${s.c}`; cap.classList.remove('on'); void cap.offsetWidth; cap.classList.add('on'); window.EM_renderMath&&EM_renderMath(cap);
    dots.forEach((d,i)=>d.classList.toggle('on',i<=k)); clearTimeout(timer);
    if(playing){ if(k<st.steps.length-1) timer=setTimeout(()=>go(k+1),s.d||6000); else { playing=false; pb.textContent='↺ Revoir'; } } }
  bar.addEventListener('click',e=>{ const a=e.target.dataset.a; if(!a) return;
    if(a==='play'){ if(playing){ playing=false; clearTimeout(timer); pb.textContent='▶ Reprendre'; } else { playing=true; pb.textContent='❚❚ Pause'; go(k<0||k>=st.steps.length-1?0:k+1); } }
    if(a==='next'){ playing=false; pb.textContent='▶ Reprendre'; go(k+1); }
    if(a==='prev'){ playing=false; pb.textContent='▶ Reprendre'; go(k-1); }
    if(a==='stop'){ playing=false; clearTimeout(timer); k=-1; cap.classList.remove('on'); dots.forEach(d=>d.classList.remove('on')); pb.textContent='▶ Explication guidée'; } });
  return true;
}
function bootStories(n){ const list=(L.stories||{})[page]||[]; let pending=0;
  list.forEach(st=>{ const fig=art.querySelector(st.sel); if(!fig||fig._story) return; if(!fig.querySelector('.stage')){pending++;return;} fig._story=storyFor(fig,st); });
  if(pending&&n<40) setTimeout(()=>bootStories(n+1),150); }
if(document.readyState==='complete') setTimeout(()=>bootStories(0),200); else window.addEventListener('load',()=>setTimeout(()=>bootStories(0),200));
})();
