/* ============ Moteur d'animations (canvas) ============
   Usage HTML : <figure class="anim" data-anim="nom"><figcaption>…</figcaption></figure>
   Chaque animation : EM_A.nom = function(S){ ...; return {draw(dt)} }               */
(function(){
const A = {}; window.EM_A = A;
const css = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
function palette(){ return {bg:css('--bg3'),bg2:css('--bg2'),ink:css('--ink'),ink2:css('--ink2'),ink3:css('--ink3'),line:css('--line'),
  e:css('--e'),b:css('--b'),qp:css('--qp'),qn:css('--qn'),acc:css('--accent'),ok:css('--ok'),bad:css('--bad'),rem:css('--rem'),
  dark: (document.documentElement.dataset.theme||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'))==='dark'}; }
const H = window.EM_H = {};

/* ---------- drawing helpers ---------- */
H.arrow = (c,x1,y1,x2,y2,col,w=2,head=8)=>{
  const dx=x2-x1, dy=y2-y1, L=Math.hypot(dx,dy); if(L<0.5) return;
  const ux=dx/L, uy=dy/L, hh=Math.min(head,L*0.6);
  c.strokeStyle=col; c.fillStyle=col; c.lineWidth=w; c.lineCap='round';
  c.beginPath(); c.moveTo(x1,y1); c.lineTo(x2-ux*hh*0.7,y2-uy*hh*0.7); c.stroke();
  c.beginPath(); c.moveTo(x2,y2); c.lineTo(x2-ux*hh-uy*hh*0.5,y2-uy*hh+ux*hh*0.5); c.lineTo(x2-ux*hh+uy*hh*0.5,y2-uy*hh-ux*hh*0.5); c.closePath(); c.fill();
};
H.text = (c,s,x,y,col,size=13,align='left',weight=500,base='middle')=>{
  c.fillStyle=col; c.font=`${weight} ${size}px Inter,system-ui,sans-serif`; c.textAlign=align; c.textBaseline=base; c.fillText(s,x,y);
};
H.charge = (c,x,y,r,q,P)=>{
  const col = q>0?P.qp:(q<0?P.qn:P.ink3);
  const g=c.createRadialGradient(x-r*0.35,y-r*0.35,r*0.1,x,y,r); g.addColorStop(0,'#fff'); g.addColorStop(0.25,col); g.addColorStop(1,col);
  c.fillStyle=g; c.beginPath(); c.arc(x,y,r,0,7); c.fill();
  c.strokeStyle='rgba(0,0,0,.25)'; c.lineWidth=1; c.stroke();
  c.strokeStyle='#fff'; c.lineWidth=Math.max(1.6,r*0.16); c.beginPath(); c.moveTo(x-r*0.45,y); c.lineTo(x+r*0.45,y);
  if(q>0){ c.moveTo(x,y-r*0.45); c.lineTo(x,y+r*0.45); } c.stroke();
};
H.dotOut = (c,x,y,r,col)=>{ c.strokeStyle=col; c.lineWidth=1.6; c.beginPath(); c.arc(x,y,r,0,7); c.stroke(); c.fillStyle=col; c.beginPath(); c.arc(x,y,r*0.28,0,7); c.fill(); };
H.crossIn = (c,x,y,r,col)=>{ c.strokeStyle=col; c.lineWidth=1.6; c.beginPath(); c.arc(x,y,r,0,7); c.stroke(); const k=r*0.6; c.beginPath(); c.moveTo(x-k,y-k); c.lineTo(x+k,y+k); c.moveTo(x+k,y-k); c.lineTo(x-k,y+k); c.stroke(); };
H.line = (c,x1,y1,x2,y2,col,w=1,dash=null)=>{ c.strokeStyle=col; c.lineWidth=w; c.setLineDash(dash||[]); c.beginPath(); c.moveTo(x1,y1); c.lineTo(x2,y2); c.stroke(); c.setLineDash([]); };
H.rgba = (hex,a)=>{ hex=hex.replace('#',''); if(hex.length===3) hex=hex.split('').map(x=>x+x).join(''); const n=parseInt(hex,16); return `rgba(${n>>16&255},${n>>8&255},${n&255},${a})`; };
H.mix = (h1,h2,t)=>{ const p=h=>{h=h.replace('#','');if(h.length===3)h=h.split('').map(x=>x+x).join('');const n=parseInt(h,16);return[n>>16&255,n>>8&255,n&255]}; const a=p(h1),b=p(h2); return a.map((v,i)=>Math.round(v+(b[i]-v)*t)); };
H.clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
H.fmt=(v,d=2)=>{ if(!isFinite(v)) return '∞'; if(v===0) return '0'; const a=Math.abs(v); if(a>=1e4||a<1e-2){ const e=Math.floor(Math.log10(a)); return (v/10**e).toFixed(d)+'×10^'+e; } return v.toFixed(d); };
/* simple plot: data = array of [x,y]; box = {x,y,w,h}; opts {xmin,xmax,ymin,ymax,col,label,xl,yl,marker} */
H.plot = (c,P,box,fn,o)=>{
  const {x,y,w,h}=box; c.fillStyle=P.bg2; c.strokeStyle=P.line; c.lineWidth=1; c.beginPath(); c.roundRect?c.roundRect(x,y,w,h,8):c.rect(x,y,w,h); c.fill(); c.stroke();
  const X=v=>x+28+(v-o.xmin)/(o.xmax-o.xmin)*(w-40), Y=v=>y+h-20-(v-o.ymin)/(o.ymax-o.ymin)*(h-34);
  const y0 = H.clamp(0,o.ymin,o.ymax);
  H.line(c,X(o.xmin),Y(y0),X(o.xmax),Y(y0),P.ink3,1); H.line(c,X(Math.max(0,o.xmin)),Y(o.ymin),X(Math.max(0,o.xmin)),Y(o.ymax),P.ink3,1);
  (Array.isArray(fn)?fn:[{f:fn,col:o.col}]).forEach(F=>{
    c.strokeStyle=F.col||o.col; c.lineWidth=2.2; c.beginPath(); let st=false;
    for(let i=0;i<=200;i++){ const xv=o.xmin+(o.xmax-o.xmin)*i/200; let yv=F.f(xv); if(!isFinite(yv)){st=false;continue;} yv=H.clamp(yv,o.ymin-1e3,o.ymax+1e3);
      const py=H.clamp(Y(yv),y+2,y+h-2); if(!st){c.moveTo(X(xv),py);st=true;} else c.lineTo(X(xv),py); } c.stroke(); });
  if(o.xl) H.text(c,o.xl,x+w-8,Y(y0)-9,P.ink3,11,'right');
  if(o.yl) H.text(c,o.yl,X(Math.max(0,o.xmin))+6,y+11,P.ink2,11.5,'left',600);
  if(o.marker!==undefined){ const F=Array.isArray(fn)?fn[0]:{f:fn,col:o.col}; const mv=F.f(o.marker); if(isFinite(mv)){ c.fillStyle=F.col||o.col; c.beginPath(); c.arc(X(o.marker),H.clamp(Y(mv),y+2,y+h-2),5,0,7); c.fill(); H.line(c,X(o.marker),y+6,X(o.marker),y+h-20,P.ink3,1,[3,3]); } }
  if(o.marks) o.marks.forEach(m=>{ H.line(c,X(m.x),y+6,X(m.x),y+h-20,P.ink3,1,[2,4]); H.text(c,m.t,X(m.x)+3,y+h-10,P.ink3,10.5); });
  return {X,Y};
};

/* ---------- controls ---------- */
function mkControls(S){
  const ui = {};
  ui.slider=(label,min,max,step,val,fmt=v=>v)=>{
    const l=document.createElement('label'); l.innerHTML=`<span>${label}</span>`;
    const r=document.createElement('input'); r.type='range'; r.min=min; r.max=max; r.step=step; r.value=val;
    const s=document.createElement('span'); s.className='val'; const o={v:+val,el:r};
    const up=()=>{o.v=+r.value; s.textContent=fmt(o.v); S.dirty=true; o.onchange&&o.onchange(o.v);};
    r.oninput=up; l.append(r,s); S.ctrl.append(l); s.textContent=fmt(o.v); o.set=v=>{r.value=v;up();}; return o;
  };
  ui.choice=(opts,val)=>{
    const g=document.createElement('span'); g.style.display='inline-flex'; g.style.gap='6px'; g.style.flexWrap='wrap';
    const o={v:val}; const btns=opts.map(([k,lab])=>{ const b=document.createElement('button'); b.type='button'; b.innerHTML=lab; b.className=k===val?'on':'';
      b.onclick=()=>{o.v=k; btns.forEach(x=>x.className=''); b.className='on'; S.dirty=true; o.onchange&&o.onchange(k);}; g.append(b); return b;});
    S.ctrl.append(g); o.set=k=>{const i=opts.findIndex(x=>x[0]===k); if(i>=0) btns[i].click();}; return o;
  };
  ui.button=(lab,fn)=>{ const b=document.createElement('button'); b.type='button'; b.innerHTML=lab; b.onclick=()=>{fn(b);S.dirty=true;}; S.ctrl.append(b); return b; };
  ui.check=(lab,val)=>{ const l=document.createElement('label'); const i=document.createElement('input'); i.type='checkbox'; i.checked=val; const o={v:val};
    i.onchange=()=>{o.v=i.checked;S.dirty=true;o.onchange&&o.onchange(o.v);}; l.append(i,document.createTextNode(lab)); S.ctrl.append(l); return o; };
  ui.play=()=>{ const b=ui.button('❚❚ Pause',()=>{S.paused=!S.paused; b.innerHTML=S.paused?'▶ Lecture':'❚❚ Pause';}); return b; };
  return ui;
}

/* ---------- pointer / drag ---------- */
function mkPointer(S){
  const cv=S.cv; S.mouse={x:-1,y:-1,down:false,in:false};
  const pos=e=>{const r=cv.getBoundingClientRect(); return {x:e.clientX-r.left,y:e.clientY-r.top};};
  S.draggables=[]; let drag=null;
  cv.addEventListener('pointerdown',e=>{ const p=pos(e); S.mouse.down=true; Object.assign(S.mouse,p);
    let best=null,bd=1e9; S.draggables.forEach(d=>{ const q=d.get(); const dd=Math.hypot(q.x-p.x,q.y-p.y); if(dd<(d.r||22)&&dd<bd){bd=dd;best=d;} });
    if(best){drag=best; cv.setPointerCapture(e.pointerId); e.preventDefault();} S.onDown&&S.onDown(p,!!best); S.dirty=true; });
  cv.addEventListener('pointermove',e=>{ const p=pos(e); Object.assign(S.mouse,p); S.mouse.in=true;
    if(drag){ drag.set(H.clamp(p.x,4,S.w-4),H.clamp(p.y,4,S.h-4)); S.dirty=true; }
    cv.style.cursor = drag?'grabbing':(S.draggables.some(d=>{const q=d.get();return Math.hypot(q.x-p.x,q.y-p.y)<(d.r||22);})?'grab':(S.cursor||'default'));
    S.onMove&&S.onMove(p); });
  const up=()=>{ if(drag&&drag.end) drag.end(); drag=null; S.mouse.down=false; S.dirty=true; };
  cv.addEventListener('pointerup',up); cv.addEventListener('pointercancel',up);
  cv.addEventListener('pointerleave',()=>{S.mouse.in=false;S.dirty=true;});
}

/* ---------- boot ---------- */
function boot(){
  document.querySelectorAll('figure.anim[data-anim]').forEach(fig=>{
    const name=fig.dataset.anim; if(!A[name]){ console.warn('anim manquante',name); return; }
    const stage=document.createElement('div'); stage.className='stage';
    const cv=document.createElement('canvas'); stage.append(cv);
    if(fig.dataset.badge!==undefined){ const b=document.createElement('span'); b.className='anim-badge'; b.textContent=fig.dataset.badge||'Interactif'; stage.append(b); }
    const ctrl=document.createElement('div'); ctrl.className='controls';
    const ro=document.createElement('div'); ro.className='readout';
    const cap=fig.querySelector('figcaption');
    fig.prepend(stage); stage.after(ctrl); ctrl.after(ro);
    if(cap) fig.append(cap);
    const S={fig,cv,ctx:cv.getContext('2d'),ctrl,ro,w:0,h:0,t:0,P:palette(),dirty:true,paused:false,visible:false};
    S.ui=mkControls(S); mkPointer(S);
    S.read=t=>{ if(ro._t!==t){ ro.textContent=t; ro._t=t; } };
    const inst=A[name](S)||{};
    if(!ctrl.children.length) ctrl.style.display='none';
    function resize(){ const r=cv.getBoundingClientRect(); const d=window.devicePixelRatio||1; S.w=r.width; S.h=r.height;
      cv.width=Math.round(r.width*d); cv.height=Math.round(r.height*d); S.ctx.setTransform(d,0,0,d,0,0); S.dirty=true; inst.resize&&inst.resize(); }
    new ResizeObserver(resize).observe(cv); resize();
    new IntersectionObserver(es=>{S.visible=es[0].isIntersecting;},{rootMargin:'100px'}).observe(fig);
    window.addEventListener('themechange',()=>{S.P=palette();S.dirty=true;inst.theme&&inst.theme();});
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change',()=>{S.P=palette();S.dirty=true;inst.theme&&inst.theme();});
    let last=performance.now();
    function frame(now){ let dt=Math.min(0.05,(now-last)/1000); last=now;
      if(S.visible && S.w>0){ if(S.paused) dt=0; S.t+=dt; if(inst.draw && (inst.always!==false || S.dirty)){ S.ctx.clearRect(0,0,S.w,S.h); inst.draw(dt); S.dirty=false; } }
      requestAnimationFrame(frame); }
    requestAnimationFrame(frame);
  });
}
if(document.readyState==='complete') setTimeout(boot,0); else window.addEventListener('load',boot);
})();
