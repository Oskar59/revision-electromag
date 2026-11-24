/* ============ Atlas Arcade — moteur commun des jeux ============
   Espace virtuel 800 × 500, mis à l'échelle du canvas.
   Un jeu = {kind, rounds, lives, intro, how[]} ; un « kind » = {start, round, update, draw, pointer, key}. */
(function(){
const VW=800, VH=500;
const K=window.GKINDS=window.GKINDS||{};
const C=window.GC={VW,VH,
  col:{ink:'#eef0ff',dim:'#9aa0c8',faint:'rgba(255,255,255,.08)',e:'#ff7a4d',b:'#3cc7d6',p:'#ff5f6d',n:'#5b93ff',ok:'#3ddc84',bad:'#ff5470',gold:'#ffd45c',vio:'#a48bff'},
  rnd:(a,b)=>a+Math.random()*(b-a), ri:(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick:a=>a[Math.floor(Math.random()*a.length)],
  shuffle:a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;},
  clamp:(v,a,b)=>Math.max(a,Math.min(b,v))};
/* ---------- dessin ---------- */
C.text=(c,s,x,y,col='#eef0ff',size=16,align='center',weight=700,base='middle')=>{c.fillStyle=col;c.font=`${weight} ${size}px Inter,system-ui,sans-serif`;c.textAlign=align;c.textBaseline=base;c.fillText(s,x,y);};
C.arrow=(c,x1,y1,x2,y2,col,w=3,head=12)=>{const dx=x2-x1,dy=y2-y1,L=Math.hypot(dx,dy);if(L<1)return;const ux=dx/L,uy=dy/L,h=Math.min(head,L*.5);
  c.strokeStyle=col;c.fillStyle=col;c.lineWidth=w;c.lineCap='round';c.beginPath();c.moveTo(x1,y1);c.lineTo(x2-ux*h*.7,y2-uy*h*.7);c.stroke();
  c.beginPath();c.moveTo(x2,y2);c.lineTo(x2-ux*h-uy*h*.55,y2-uy*h+ux*h*.55);c.lineTo(x2-ux*h+uy*h*.55,y2-uy*h-ux*h*.55);c.closePath();c.fill();};
C.circle=(c,x,y,r,fill,stroke,w=2)=>{c.beginPath();c.arc(x,y,r,0,7);if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=w;c.stroke();}};
C.glow=(c,x,y,r,col)=>{const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,col);g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,7);c.fill();};
C.line=(c,x1,y1,x2,y2,col,w=1,dash)=>{c.strokeStyle=col;c.lineWidth=w;c.setLineDash(dash||[]);c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.stroke();c.setLineDash([]);};
C.rrect=(c,x,y,w,h,r,fill,stroke)=>{c.beginPath();c.roundRect?c.roundRect(x,y,w,h,r):c.rect(x,y,w,h);if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=2;c.stroke();}};
C.charge=(c,x,y,r,q)=>{const col=q>0?C.col.p:C.col.n;C.glow(c,x,y,r*2.4,q>0?'rgba(255,95,109,.35)':'rgba(91,147,255,.35)');C.circle(c,x,y,r,col);
  c.strokeStyle='#fff';c.lineWidth=2.4;c.beginPath();c.moveTo(x-r*.45,y);c.lineTo(x+r*.45,y);if(q>0){c.moveTo(x,y-r*.45);c.lineTo(x,y+r*.45);}c.stroke();};
C.dotOut=(c,x,y,r,col)=>{C.circle(c,x,y,r,null,col,2);C.circle(c,x,y,r*.3,col);};
C.crossIn=(c,x,y,r,col)=>{C.circle(c,x,y,r,null,col,2);const k=r*.6;c.strokeStyle=col;c.lineWidth=2;c.beginPath();c.moveTo(x-k,y-k);c.lineTo(x+k,y+k);c.moveTo(x+k,y-k);c.lineTo(x-k,y+k);c.stroke();};
C.plotBox=(c,x,y,w,h)=>{C.rrect(c,x,y,w,h,14,'rgba(255,255,255,.04)','rgba(255,255,255,.1)');};

/* ---------- shell ---------- */
function boot(){
const params=new URLSearchParams(location.search); const gid=params.get('g')||'ma1';
const LIST=window.ATLAS_GAMES||[]; const meta=LIST.find(g=>g.id===gid)||LIST[0];
const DEF=(window.GDEFS||{})[gid];
const host=document.getElementById('game'); if(!host||!DEF) return;
const kind=K[DEF.kind];
document.title=`${meta.t} — Atlas Arcade`;
const LS={get(k,d){try{const v=localStorage.getItem('em:'+k);return v===null?d:JSON.parse(v);}catch(e){return d;}},set(k,v){try{localStorage.setItem('em:'+k,JSON.stringify(v));}catch(e){}}};
host.innerHTML=`<div class="game"><canvas></canvas>
 <div class="hud"><span class="chip">🏁 <b class="h-lv">1</b>/<span class="h-n"></span></span><span class="chip">⭐ <b class="h-sc">0</b></span><span class="chip h-cb" style="display:none">🔥 x<b class="h-cbv">1</b></span><span class="sp"></span><span class="chip h-lives"></span><span class="chip h-snd" style="pointer-events:auto;cursor:pointer" title="Son">🔊</span></div>
 <div class="prompt" style="display:none"></div><div class="toast"></div><div class="expl"></div><div class="panel"></div><div class="overlay"></div></div>`;
const root=host.querySelector('.game'), cv=root.querySelector('canvas'), ctx=cv.getContext('2d');
const $=s=>root.querySelector(s);
let W=0,H=0,S=1,OX=0,OY=0,dpr=1;
function resize(){ const r=cv.getBoundingClientRect(); dpr=window.devicePixelRatio||1; W=r.width; H=r.height; cv.width=Math.round(W*dpr); cv.height=Math.round(H*dpr); S=Math.min(W/VW,H/VH); OX=(W-VW*S)/2; OY=(H-VH*S)/2; }
new ResizeObserver(resize).observe(cv); resize();
/* son */
let snd=LS.get('snd',true), AC=null; $('.h-snd').textContent=snd?'🔊':'🔇';
$('.h-snd').onclick=()=>{snd=!snd;LS.set('snd',snd);$('.h-snd').textContent=snd?'🔊':'🔇';};
function sfx(type){ if(!snd) return; try{ AC=AC||new (window.AudioContext||window.webkitAudioContext)(); const t=AC.currentTime;
  const seq={good:[[660,.0],[880,.07],[1320,.14]],bad:[[220,0],[160,.1]],click:[[520,0]],win:[[523,0],[659,.1],[784,.2],[1046,.3]],tick:[[900,0]]}[type]||[[440,0]];
  seq.forEach(([f,d])=>{ const o=AC.createOscillator(), g=AC.createGain(); o.type=type==='bad'?'sawtooth':'triangle'; o.frequency.value=f; g.gain.setValueAtTime(.0001,t+d); g.gain.exponentialRampToValueAtTime(type==='tick'?.05:.12,t+d+.01); g.gain.exponentialRampToValueAtTime(.0001,t+d+.16); o.connect(g).connect(AC.destination); o.start(t+d); o.stop(t+d+.18); }); }catch(e){} }
/* particules */
const parts=[]; let shakeT=0;
const stars=Array.from({length:90},()=>({x:Math.random(),y:Math.random(),z:Math.random()*0.8+0.2}));
const G=window.G={def:DEF,meta,ctx,C,VW,VH,sfx,LS,root,
  get w(){return W}, get h(){return H},
  score:0,lives:DEF.lives??3,combo:0,i:0,n:DEF.rounds||10,state:'intro',busy:false,t:0,
  burst(x,y,col,n=22){ for(let k=0;k<n;k++){ const a=Math.random()*7,v=C.rnd(60,260); parts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:C.rnd(.4,.9),col}); } },
  shake(){shakeT=.35;},
  prompt(html){ const p=$('.prompt'); if(!html){p.style.display='none';return;} p.style.display=''; p.innerHTML=html; window.EM_renderMath&&EM_renderMath(p); },
  toast(txt,col){ const t=$('.toast'); t.textContent=txt; t.style.color=col||'#fff'; t.classList.add('on'); clearTimeout(t._h); t._h=setTimeout(()=>t.classList.remove('on'),850); },
  expl(html){ const e=$('.expl'); if(!html){e.classList.remove('on');return;} e.innerHTML=html; e.classList.add('on'); window.EM_renderMath&&EM_renderMath(e); },
  panel(items){ const p=$('.panel'); p.innerHTML=''; (items||[]).forEach(it=>{ if(it.nodeType){p.append(it);return;} const b=document.createElement('button'); b.innerHTML=it.label; if(it.cls) b.className=it.cls; b.onclick=()=>{sfx('click');it.on(b);}; p.append(b); it.el=b; }); window.EM_renderMath&&EM_renderMath(p); return items; },
  slider(label,min,max,step,val,fmt,on){ const l=document.createElement('label'); l.innerHTML=`<span>${label}</span>`; const r=document.createElement('input'); r.type='range'; r.min=min; r.max=max; r.step=step; r.value=val; const s=document.createElement('span'); s.style.minWidth='64px'; const o={v:+val,el:r,lab:l}; const up=()=>{o.v=+r.value; s.textContent=fmt?fmt(o.v):o.v; on&&on(o.v);}; r.oninput=up; l.append(r,s); up(); o.set=v=>{r.value=v;up();}; return o; },
  hud(){ $('.h-lv').textContent=Math.min(G.i+1,G.n); $('.h-n').textContent=G.n; $('.h-sc').textContent=Math.round(G.score);
    $('.h-cb').style.display=G.combo>1?'':'none'; $('.h-cbv').textContent=G.combo;
    $('.h-lives').textContent=DEF.lives===0?'∞':'❤'.repeat(Math.max(0,G.lives))+'♡'.repeat(Math.max(0,(DEF.lives??3)-G.lives)); },
  success(pts=100,msg){ if(G.busy) return; G.busy=true; G.combo++; const gain=Math.round(pts*(1+Math.min(G.combo-1,5)*0.1)); G.score+=gain; sfx('good');
    G.toast((msg||C.pick(['Bien vu !','Parfait !','Exact !','Bravo !']))+` +${gain}`,C.col.ok); G.hud(); setTimeout(()=>{G.busy=false;G.next();},DEF.successDelay||1100); },
  fail(msg,expl,opts={}){ if(G.busy) return; G.busy=true; G.combo=0; if(opts.life!==false && DEF.lives!==0) G.lives--; sfx('bad'); G.shake(); G.toast(msg||'Raté…',C.col.bad); G.hud();
    const go=()=>{ G.expl(null); G.busy=false; if(G.lives<=0 && DEF.lives!==0) return G.finish(false); if(opts.retry) kind.round(G,G.i,true); else G.next(); };
    if(expl){ G.expl(expl+`<div style="margin-top:8px"><button class="gbtn" style="padding:8px 16px;font-size:14px">${opts.retry?'Réessayer':'Continuer'} →</button></div>`); $('.expl button').onclick=go; }
    else setTimeout(go,900); },
  next(){ G.i++; G.hud(); if(G.i>=G.n) return G.finish(true); G.expl(null); kind.round(G,G.i); },
  finish(done){ G.state='end'; G.prompt(null); G.panel([]); G.expl(null);
    const max=G.n*(DEF.maxPerRound||100)*1.25; const ratio=G.score/max; const st=!done?0:ratio>=.8?3:ratio>=.55?2:1;
    const rec=LS.get('game:'+gid,{best:0,stars:0}); const nb=G.score>rec.best; LS.set('game:'+gid,{best:Math.max(rec.best,Math.round(G.score)),stars:Math.max(rec.stars,st),plays:(rec.plays||0)+1});
    sfx(done?'win':'bad');
    overlay(`<div class="big">${done?['🙂','🎉','🏆','🌟'][st]:'💥'}</div><h2>${done?'Niveau terminé !':'Plus de vies…'}</h2>
      <p style="font-size:28px;letter-spacing:6px">${'★'.repeat(st)}<span style="opacity:.25">${'★'.repeat(3-st)}</span></p>
      <p>Score : <b>${Math.round(G.score)}</b>${nb?' — <b style="color:#ffd45c">nouveau record !</b>':` (record : ${rec.best})`}</p>
      <p style="font-size:14px;opacity:.85">${DEF.outro||''}</p>
      <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center"><button class="gbtn" data-a="again">↻ Rejouer</button><a class="gbtn ghost" href="${meta.ch}.html" style="text-decoration:none">📖 Revoir le cours</a><a class="gbtn ghost" href="jeux.html" style="text-decoration:none">🕹 Arcade</a></div>`);
    $('.overlay [data-a=again]').onclick=start; },
  /* coordonnées */
  toV(px,py){ return {x:(px-OX)/S,y:(py-OY)/S}; },
  toS(x,y){ return {x:OX+x*S,y:OY+y*S,s:S}; }
};
function overlay(html){ const o=$('.overlay'); if(!html){o.style.display='none';return;} o.style.display=''; o.innerHTML=html; window.EM_renderMath&&EM_renderMath(o); }
G.overlay=overlay;
function start(){ overlay(null); G.score=0; G.lives=DEF.lives??3; G.combo=0; G.i=0; G.state='play'; G.busy=false; G.expl(null); kind.start&&kind.start(G); G.hud(); kind.round(G,0); sfx('click'); }
const rec=LS.get('game:'+gid,{best:0,stars:0});
overlay(`<div class="big">${meta.ico}</div><h2>${meta.t}</h2><p>${DEF.intro}</p>
  <p style="font-size:13.5px;opacity:.8">${DEF.rounds} niveaux · ${DEF.lives===0?'vies illimitées':`${DEF.lives??3} vies`}${rec.best?` · record ${rec.best} · ${'★'.repeat(rec.stars)}`:''}</p>
  <button class="gbtn" data-a="go">▶ Jouer</button>`);
$('.overlay [data-a=go]').onclick=start;
/* entrées */
const pos=e=>{const r=cv.getBoundingClientRect(); return G.toV(e.clientX-r.left,e.clientY-r.top);};
cv.addEventListener('pointerdown',e=>{ if(G.state!=='play') return; const p=pos(e); kind.pointer&&kind.pointer(G,'down',p.x,p.y,e); });
cv.addEventListener('pointermove',e=>{ if(G.state!=='play') return; const p=pos(e); kind.pointer&&kind.pointer(G,'move',p.x,p.y,e); });
window.addEventListener('pointerup',e=>{ if(G.state!=='play') return; const p=pos(e); kind.pointer&&kind.pointer(G,'up',p.x,p.y,e); });
window.addEventListener('keydown',e=>{ if(G.state!=='play'||!kind.key) return; if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown',' '].includes(e.key)) e.preventDefault(); kind.key(G,e.key,true); });
window.addEventListener('keyup',e=>{ if(G.state!=='play'||!kind.key) return; kind.key(G,e.key,false); });
/* boucle */
let last=performance.now();
function frame(now){ const dt=Math.min(.05,(now-last)/1000); last=now; G.t+=dt;
  ctx.setTransform(dpr,0,0,dpr,0,0);
  const g=ctx.createLinearGradient(0,0,0,H); g.addColorStop(0,'#141a38'); g.addColorStop(1,'#070912'); ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  stars.forEach(s=>{ ctx.fillStyle=`rgba(200,210,255,${.15+.5*s.z*(0.6+0.4*Math.sin(G.t*2*s.z+s.x*20))})`; ctx.fillRect(s.x*W,(s.y*H+G.t*6*s.z)%H,1.6*s.z,1.6*s.z); });
  let sx=0,sy=0; if(shakeT>0){ shakeT-=dt; sx=(Math.random()-.5)*12*shakeT; sy=(Math.random()-.5)*12*shakeT; }
  ctx.setTransform(dpr*S,0,0,dpr*S,dpr*(OX+sx),dpr*(OY+sy));
  if(G.state==='play'||G.state==='end'){ try{ kind.update&&G.state==='play'&&kind.update(G,dt); kind.draw&&kind.draw(G,ctx); }catch(err){ console.error(err); } }
  for(let k=parts.length-1;k>=0;k--){ const p=parts[k]; p.life-=dt; if(p.life<=0){parts.splice(k,1);continue;} p.x+=p.vx*dt; p.y+=p.vy*dt; p.vy+=200*dt; ctx.globalAlpha=Math.min(1,p.life*2); ctx.fillStyle=p.col; ctx.fillRect(p.x-2,p.y-2,4,4); ctx.globalAlpha=1; }
  requestAnimationFrame(frame); }
requestAnimationFrame(frame);
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else setTimeout(boot,0);
})();
