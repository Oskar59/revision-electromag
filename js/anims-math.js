/* ============ Animations — Mathématiques ============ */
(function(){
const A=window.EM_A, H=window.EM_H; if(!A) return;
const PI=Math.PI, TAU=2*PI;
/* ---- repère : box {x,y,w,h}, xr [a,b], yr [c,d] ---- */
function view(box,xr,yr){
  const X=v=>box.x+(v-xr[0])/(xr[1]-xr[0])*box.w, Y=v=>box.y+box.h-(v-yr[0])/(yr[1]-yr[0])*box.h;
  const IX=p=>xr[0]+(p-box.x)/box.w*(xr[1]-xr[0]), IY=p=>yr[0]+(box.y+box.h-p)/box.h*(yr[1]-yr[0]);
  return {X,Y,IX,IY,box,xr,yr};
}
function axes(c,P,V,o={}){
  const {box,xr,yr,X,Y}=V;
  if(o.bg!==false){ c.fillStyle=P.bg2; c.strokeStyle=P.line; c.lineWidth=1; c.beginPath(); c.roundRect?c.roundRect(box.x,box.y,box.w,box.h,8):c.rect(box.x,box.y,box.w,box.h); c.fill(); c.stroke(); }
  c.save(); c.beginPath(); c.rect(box.x,box.y,box.w,box.h); c.clip();
  if(o.grid){ const g=o.grid; c.strokeStyle=H.rgba(P.dark?'#ffffff':'#000000',0.06); c.lineWidth=1; c.beginPath();
    for(let v=Math.ceil(xr[0]/g)*g; v<=xr[1]; v+=g){ c.moveTo(X(v),box.y); c.lineTo(X(v),box.y+box.h);}
    for(let v=Math.ceil(yr[0]/g)*g; v<=yr[1]; v+=g){ c.moveTo(box.x,Y(v)); c.lineTo(box.x+box.w,Y(v));} c.stroke(); }
  const y0=H.clamp(0,yr[0],yr[1]), x0=H.clamp(0,xr[0],xr[1]);
  H.line(c,box.x,Y(y0),box.x+box.w,Y(y0),P.ink3,1.2); H.line(c,X(x0),box.y,X(x0),box.y+box.h,P.ink3,1.2);
  if(o.ticks){ const [sx,sy,fx,fy]=o.ticks;
    for(let v=Math.ceil(xr[0]/sx)*sx; v<=xr[1]+1e-9; v+=sx){ if(Math.abs(v)<1e-9) continue; H.line(c,X(v),Y(y0)-3,X(v),Y(y0)+3,P.ink3,1); H.text(c,fx?fx(v):(+v.toFixed(2))+'',X(v),Y(y0)+12,P.ink3,10.5,'center'); }
    for(let v=Math.ceil(yr[0]/sy)*sy; v<=yr[1]+1e-9; v+=sy){ if(Math.abs(v)<1e-9) continue; H.line(c,X(x0)-3,Y(v),X(x0)+3,Y(v),P.ink3,1); H.text(c,fy?fy(v):(+v.toFixed(2))+'',X(x0)-6,Y(v),P.ink3,10.5,'right'); } }
  if(o.xl) H.text(c,o.xl,box.x+box.w-6,Y(y0)-10,P.ink2,12,'right',600);
  if(o.yl) H.text(c,o.yl,X(x0)+7,box.y+12,P.ink2,12,'left',600);
  c.restore();
}
function curve(c,V,f,col,w=2.2,a,b,n=300,dash){
  a=a===undefined?V.xr[0]:a; b=b===undefined?V.xr[1]:b; const {box}=V;
  c.save(); c.beginPath(); c.rect(box.x,box.y,box.w,box.h); c.clip();
  c.strokeStyle=col; c.lineWidth=w; c.setLineDash(dash||[]); c.beginPath(); let st=false;
  for(let i=0;i<=n;i++){ const x=a+(b-a)*i/n; let y=f(x); if(!isFinite(y)){st=false;continue;}
    y=H.clamp(y,V.yr[0]-10*(V.yr[1]-V.yr[0]),V.yr[1]+10*(V.yr[1]-V.yr[0]));
    if(!st){c.moveTo(V.X(x),V.Y(y));st=true;} else c.lineTo(V.X(x),V.Y(y)); }
  c.stroke(); c.setLineDash([]); c.restore();
}
function fill(c,V,f,g,col,a,b,n=200){ const {box}=V; c.save(); c.beginPath(); c.rect(box.x,box.y,box.w,box.h); c.clip();
  c.fillStyle=col; c.beginPath(); for(let i=0;i<=n;i++){const x=a+(b-a)*i/n; c.lineTo(V.X(x),V.Y(f(x)));} for(let i=n;i>=0;i--){const x=a+(b-a)*i/n; c.lineTo(V.X(x),V.Y(g(x)));} c.closePath(); c.fill(); c.restore(); }
const dot=(c,x,y,r,col)=>{c.fillStyle=col;c.beginPath();c.arc(x,y,r,0,7);c.fill();};
const deg=a=>Math.round(a*180/PI);
const f2=v=>{const s=(Math.abs(v)<5e-3?0:v).toFixed(2); return s.replace(/\.?0+$/,'').replace('-0','0').replace('.',',');};
const cx=(a,b)=>`${f2(a)} ${b<0?'−':'+'} ${f2(Math.abs(b))}i`;
const rad=a=>{ const k=a/PI; const fr=[[0,'0'],[1/6,'π/6'],[1/4,'π/4'],[1/3,'π/3'],[1/2,'π/2'],[2/3,'2π/3'],[3/4,'3π/4'],[5/6,'5π/6'],[1,'π']]; for(const [v,s] of fr){ if(Math.abs(Math.abs(k)-v)<0.004) return (k<0&&v?'−':'')+s; } return f2(a); };
const MATH=window.EM_MATH={view,axes,curve,fill};

/* ===================== 1. PLAN COMPLEXE ===================== */
A.cplx=S=>{
  const mode=S.ui.choice([['z','z seul'],['conj','conjugué z̄'],['add','somme z + w'],['mul','produit z × w'],['inv','inverse 1/z']],'z');
  const z={x:1.5,y:1}, w={x:0.5,y:1.2}; let V;
  const snap=v=>Math.round(v*10)/10;
  function setup(){ const u=Math.min(S.h/7.2,S.w/12); V=view({x:0,y:0,w:S.w,h:S.h},[-(S.w*0.45)/u,(S.w*0.55)/u],[-S.h/2/u,S.h/2/u]); }
  S.draggables.push({get:()=>({x:V.X(z.x),y:V.Y(z.y)}),set:(px,py)=>{z.x=snap(V.IX(px));z.y=snap(V.IY(py));}});
  S.draggables.push({get:()=>mode.v==='add'||mode.v==='mul'?{x:V.X(w.x),y:V.Y(w.y)}:{x:-99,y:-99},set:(px,py)=>{w.x=snap(V.IX(px));w.y=snap(V.IY(py));}});
  function vec(p,col,lab,lw=2.6){ H.arrow(S.ctx,V.X(0),V.Y(0),V.X(p.x),V.Y(p.y),col,lw,10); dot(S.ctx,V.X(p.x),V.Y(p.y),6,col); if(lab) H.text(S.ctx,lab,V.X(p.x)+9,V.Y(p.y)-11,col,14,'left',700); }
  function arc(a,r,col,lab){ const c=S.ctx; c.strokeStyle=col; c.lineWidth=1.6; c.beginPath(); c.arc(V.X(0),V.Y(0),r,0,-a,a>0); c.stroke(); if(lab) H.text(c,lab,V.X(0)+(r+14)*Math.cos(a/2),V.Y(0)-(r+14)*Math.sin(a/2),col,12,'center',600); }
  return {resize:setup,always:false,draw(){
    if(!V) setup(); const c=S.ctx,P=S.P;
    axes(c,P,V,{grid:1,ticks:[1,1],xl:'Re',yl:'Im',bg:false});
    const u=V.X(1)-V.X(0); c.strokeStyle=P.ink3; c.setLineDash([4,4]); c.lineWidth=1; c.beginPath(); c.arc(V.X(0),V.Y(0),u,0,7); c.stroke(); c.setLineDash([]);
    const r=Math.hypot(z.x,z.y), th=Math.atan2(z.y,z.x);
    H.line(c,V.X(z.x),V.Y(z.y),V.X(z.x),V.Y(0),P.ink3,1,[3,3]); H.line(c,V.X(z.x),V.Y(z.y),V.X(0),V.Y(z.y),P.ink3,1,[3,3]);
    H.text(c,'a = '+f2(z.x),V.X(z.x),V.Y(0)+(z.y>=0?14:-14),P.ink2,11.5,'center',600); H.text(c,'b = '+f2(z.y),V.X(0)-6,V.Y(z.y),P.ink2,11.5,'right',600);
    arc(th,Math.min(34,u*0.6),P.acc,'θ');
    vec(z,P.acc,'z');
    let txt=`z = ${cx(z.x,z.y)}   |z| = ${f2(r)}   arg z = ${rad(th)} (${deg(th)}°)   z = ${f2(r)}·e^(i·${rad(th)})`;
    if(mode.v==='conj'){ vec({x:z.x,y:-z.y},P.e,'z̄'); H.line(c,V.X(z.x),V.Y(z.y),V.X(z.x),V.Y(-z.y),P.e,1,[2,4]);
      txt=`z̄ = ${cx(z.x,-z.y)} : symétrique par rapport à l’axe réel. z·z̄ = |z|² = ${f2(r*r)} (réel !)   z + z̄ = 2Re(z) = ${f2(2*z.x)}`; }
    if(mode.v==='add'){ const s={x:z.x+w.x,y:z.y+w.y}; vec(w,P.b,'w'); H.line(c,V.X(z.x),V.Y(z.y),V.X(s.x),V.Y(s.y),P.b,1.2,[5,4]); H.line(c,V.X(w.x),V.Y(w.y),V.X(s.x),V.Y(s.y),P.acc,1.2,[5,4]); vec(s,P.e,'z + w');
      txt=`z + w = ${cx(s.x,s.y)} : on additionne parties réelles et imaginaires (règle du parallélogramme). Déplace w aussi.`; }
    if(mode.v==='mul'){ const p={x:z.x*w.x-z.y*w.y,y:z.x*w.y+z.y*w.x}; const rw=Math.hypot(w.x,w.y), tw=Math.atan2(w.y,w.x);
      vec(w,P.b,'w'); arc(tw,Math.min(52,u*0.9),P.b); vec(p,P.e,'z·w'); arc(Math.atan2(p.y,p.x),Math.min(70,u*1.2),P.e);
      txt=`|zw| = ${f2(r)} × ${f2(rw)} = ${f2(r*rw)}   arg(zw) = ${deg(th)}° + ${deg(tw)}° = ${deg(th+tw)}° : multiplier = TOURNER de arg w et ÉTIRER de |w|`; }
    if(mode.v==='inv'&&r>0.05){ const q={x:z.x/(r*r),y:-z.y/(r*r)}; vec(q,P.e,'1/z');
      txt=`1/z = z̄/|z|² = ${cx(q.x,q.y)}   |1/z| = 1/${f2(r)} = ${f2(1/r)}   arg(1/z) = −arg z = ${deg(-th)}°`; }
    S.read(txt+'   (déplace les points)');
  }};
};

/* ===================== 2. EULER : e^{iθ} ===================== */
A.euler=S=>{
  const sp=S.ui.slider('Vitesse',0,2,0.05,0.6,v=>v.toFixed(2)); const both=S.ui.check(' montrer aussi e^(−iθ)',false); S.ui.play();
  let th=0.6; const hist=[];
  return {draw(dt){ const c=S.ctx,P=S.P; th+=dt*sp.v; if(th>4*PI){th-=4*PI;}
    const R=Math.min(S.h*0.36,S.w*0.17), ox=R+30, oy=S.h/2;
    c.strokeStyle=P.line; c.lineWidth=1; H.line(c,ox-R-18,oy,ox+R+18,oy,P.ink3,1); H.line(c,ox,oy-R-18,ox,oy+R+18,P.ink3,1);
    c.strokeStyle=P.ink3; c.beginPath(); c.arc(ox,oy,R,0,7); c.stroke();
    const px=ox+R*Math.cos(th), py=oy-R*Math.sin(th);
    H.line(c,px,py,px,oy,P.e,2); H.line(c,px,py,ox,py,P.b,2);
    H.line(c,ox,oy,px,oy,P.e,4); H.line(c,ox,oy,ox,py,P.b,4);
    H.arrow(c,ox,oy,px,py,P.acc,2.6,10); dot(c,px,py,6,P.acc); H.text(c,'e^(iθ)',px+(Math.cos(th)>=0?10:-10),py-12,P.acc,13,Math.cos(th)>=0?'left':'right',700);
    c.strokeStyle=P.acc; c.lineWidth=1.5; c.beginPath(); c.arc(ox,oy,22,0,-(th%TAU),true); c.stroke(); H.text(c,'θ',ox+30*Math.cos((th%TAU)/2),oy-30*Math.sin((th%TAU)/2),P.acc,12,'center',700);
    if(both.v){ const qy=oy+R*Math.sin(th); H.arrow(c,ox,oy,px,qy,P.ink2,2,9); dot(c,px,qy,5,P.ink2); H.text(c,'e^(−iθ)',px+8,qy+12,P.ink2,12,'left',600);
      H.text(c,'somme = 2cos θ (réel)',ox,oy+R+30,P.e,12,'center',700); }
    H.text(c,'cos θ',ox+R*Math.cos(th)/2,oy+12,P.e,11.5,'center',700); H.text(c,'sin θ',ox-6,oy-R*Math.sin(th)/2,P.b,11.5,'right',700);
    // tracés
    const x0=ox+R+50, x1=S.w-16, span=4*PI; const X=t=>x0+(t/span)*(x1-x0), Y=v=>oy-v*R;
    H.line(c,x0,oy,x1,oy,P.ink3,1); H.line(c,x0,oy-R-10,x0,oy+R+10,P.ink3,1);
    [[PI,'π'],[2*PI,'2π'],[3*PI,'3π'],[4*PI,'4π']].forEach(([v,s])=>{H.line(c,X(v),oy-3,X(v),oy+3,P.ink3,1);H.text(c,s,X(v),oy+13,P.ink3,10.5,'center');});
    const tc=th%(4*PI);
    [[Math.cos,P.e,'cos θ'],[Math.sin,P.b,'sin θ']].forEach(([f,col,lab],k)=>{ c.strokeStyle=H.rgba(col.startsWith('#')?col:'#888888',0.25); c.lineWidth=1.5; c.beginPath(); for(let i=0;i<=300;i++){const t=span*i/300; i?c.lineTo(X(t),Y(f(t))):c.moveTo(X(t),Y(f(t)));} c.stroke();
      c.strokeStyle=col; c.lineWidth=2.4; c.beginPath(); for(let i=0;i<=200;i++){const t=tc*i/200; i?c.lineTo(X(t),Y(f(t))):c.moveTo(X(t),Y(f(t)));} c.stroke(); dot(c,X(tc),Y(f(tc)),4.5,col); H.text(c,lab,x1-4,oy-R-6+k*16,col,12,'right',700); });
    H.line(c,px,py,X(tc),Y(Math.sin(tc)),P.b,1,[3,4]);
    S.read(`θ = ${deg(th%TAU)}°   e^(iθ) = cos θ + i sin θ = ${f2(Math.cos(th))} + ${f2(Math.sin(th))}i   — le point tourne, son ombre horizontale fait cos, son ombre verticale fait sin.`);
  }};
};

/* ===================== 3. RACINES n-ièmes ===================== */
A.roots=S=>{
  const n=S.ui.slider('n',2,8,1,3,v=>v); const c0={x:0,y:-8}; let V;
  function setup(){ const u=Math.min(S.h/7,S.w/11); V=view({x:0,y:0,w:S.w,h:S.h},[-(S.w*0.5)/u,(S.w*0.5)/u],[-S.h/2/u,S.h/2/u]); }
  S.draggables.push({get:()=>({x:V.X(c0.x/4),y:V.Y(c0.y/4)}),set:(px,py)=>{c0.x=Math.round(V.IX(px)*4*2)/2;c0.y=Math.round(V.IY(py)*4*2)/2;}});
  return {resize:setup,always:false,draw(){ if(!V) setup(); const c=S.ctx,P=S.P;
    axes(c,P,V,{grid:1,ticks:[1,1],xl:'Re',yl:'Im',bg:false});
    const N=n.v, r=Math.hypot(c0.x,c0.y), a=Math.atan2(c0.y,c0.x), rr=Math.pow(r,1/N);
    const u=V.X(1)-V.X(0);
    H.arrow(c,V.X(0),V.Y(0),V.X(c0.x/4),V.Y(c0.y/4),P.e,2.2,9); dot(c,V.X(c0.x/4),V.Y(c0.y/4),6,P.e); H.text(c,`c (échelle ¼)`,V.X(c0.x/4)+9,V.Y(c0.y/4)-12,P.e,12.5,'left',700);
    c.strokeStyle=P.acc; c.setLineDash([5,4]); c.lineWidth=1.2; c.beginPath(); c.arc(V.X(0),V.Y(0),rr*u,0,7); c.stroke(); c.setLineDash([]);
    const pts=[]; for(let k=0;k<N;k++){ const t=a/N+2*PI*k/N; pts.push([V.X(rr*Math.cos(t)),V.Y(rr*Math.sin(t))]); }
    c.fillStyle=H.rgba(P.dark?'#45d1a5':'#0d8a6a',0.12); c.strokeStyle=P.acc; c.lineWidth=1.6; c.beginPath(); pts.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p)); c.closePath(); c.fill(); c.stroke();
    pts.forEach((p,k)=>{ H.line(c,V.X(0),V.Y(0),p[0],p[1],P.acc,1,[2,3]); dot(c,p[0],p[1],6,P.acc); H.text(c,'z'+String.fromCharCode(8320+k),p[0]+8,p[1]-10,P.acc,12.5,'left',700); });
    c.strokeStyle=P.e; c.lineWidth=1.5; c.beginPath(); c.arc(V.X(0),V.Y(0),26,0,-a,a>0); c.stroke();
    c.strokeStyle=P.acc; c.beginPath(); c.arc(V.X(0),V.Y(0),40,0,-a/N,a>0); c.stroke();
    S.read(`c = ${cx(c0.x,c0.y)} = ${f2(r)}·e^(i·${rad(a)})  ⇒  z_k = ${f2(r)}^(1/${N}) · e^(i(${rad(a)}/${N} + 2kπ/${N})) : module ${f2(rr)}, ${N} points régulièrement espacés de ${deg(2*PI/N)}°, le premier à arg c / n = ${deg(a/N)}°.`);
  }};
};

/* ===================== 4. SOMMES DE RIEMANN ===================== */
const FUN={
  sq:{t:'x²',f:x=>x*x,F:x=>x**3/3,b:[0.5,2.5,2],y:[-0.5,6.5]},
  sin:{t:'sin x',f:Math.sin,F:x=>-Math.cos(x),b:[0.5,6.28,3.14],y:[-1.3,1.3]},
  exp:{t:'e^(−x)',f:x=>Math.exp(-x),F:x=>-Math.exp(-x),b:[0.5,4,2],y:[-0.2,1.2]},
  xsin:{t:'x·sin x (IPP)',f:x=>x*Math.sin(x),F:x=>Math.sin(x)-x*Math.cos(x),b:[0.5,6.28,3.14],y:[-5,2.6]}
};
A.riemann=S=>{
  const fn=S.ui.choice(Object.entries(FUN).map(([k,v])=>[k,v.t]),'sq');
  const meth=S.ui.choice([['l','gauche'],['m','milieu'],['r','droite'],['t','trapèzes']],'l');
  const n=S.ui.slider('n',1,60,1,6,v=>v); const b=S.ui.slider('b',0.5,6.28,0.01,2,v=>v.toFixed(2));
  fn.onchange=k=>{ b.el.max=FUN[k].b[1]; b.set(FUN[k].b[2]); };
  return {always:false,draw(){ const c=S.ctx,P=S.P,F=FUN[fn.v],B=Math.min(b.v,F.b[1]);
    const V=view({x:40,y:14,w:S.w-60,h:S.h-40},[-0.2,F.b[1]+0.2],F.y);
    axes(c,P,V,{ticks:[F.b[1]>3?1:0.5,F.y[1]>3?1:0.5],xl:'x',yl:F.t});
    const N=n.v, h=B/N; let sum=0;
    for(let i=0;i<N;i++){ const x0=i*h,x1=x0+h; let y0,y1;
      if(meth.v==='t'){ y0=F.f(x0); y1=F.f(x1); sum+=(y0+y1)/2*h; }
      else { const xs=meth.v==='l'?x0:meth.v==='r'?x1:(x0+x1)/2; y0=y1=F.f(xs); sum+=y0*h; }
      const pos=(y0+y1)>=0; c.fillStyle=H.rgba(pos?(P.dark?'#45d1a5':'#0d8a6a'):(P.dark?'#ff7a4d':'#e2552b'),0.28); c.strokeStyle=pos?P.acc:P.e; c.lineWidth=1;
      c.beginPath(); c.moveTo(V.X(x0),V.Y(0)); c.lineTo(V.X(x0),V.Y(y0)); c.lineTo(V.X(x1),V.Y(y1)); c.lineTo(V.X(x1),V.Y(0)); c.closePath(); c.fill(); c.stroke(); }
    curve(c,V,F.f,P.ink,2.4);
    H.line(c,V.X(B),V.box.y,V.X(B),V.box.y+V.box.h,P.ink3,1,[4,4]); H.text(c,'b',V.X(B)+4,V.box.y+12,P.ink2,12,'left',700);
    const ex=F.F(B)-F.F(0);
    S.read(`Somme des ${N} ${meth.v==='t'?'trapèzes':'rectangles'} = ${H.fmt(sum,4)}   ·   intégrale exacte ∫₀ᵇ = F(b) − F(0) = ${H.fmt(ex,4)}   ·   écart = ${H.fmt(Math.abs(sum-ex),4)}  (augmente n : l’écart → 0). Aire sous l’axe comptée NÉGATIVEMENT (orange).`);
  }};
};

/* ===================== 5. PRIMITIVE = AIRE ACCUMULÉE ===================== */
const PF={
  cos:{t:'f(x) = cos x',f:Math.cos,a:0,r:[0,9],y:[-1.3,1.3],Fy:[-1.3,1.3],Ft:'F(x) = sin x'},
  lin:{t:'f(x) = x − 1',f:x=>x-1,a:0,r:[0,3.2],y:[-1.3,2.4],Fy:[-0.8,1.8],Ft:'F(x) = x²/2 − x'},
  inv:{t:'f(x) = 1/x',f:x=>1/x,a:1,r:[0.2,7],y:[-0.2,3],Fy:[-1.8,2.2],Ft:'F(x) = ln x (primitive qui s’annule en 1)'},
  gau:{t:'f(x) = e^(−x²)',f:x=>Math.exp(-x*x),a:0,r:[-3,3],y:[-0.2,1.2],Fy:[-1,1],Ft:'F(x) = ∫₀ˣ e^(−t²)dt : existe, mais AUCUNE formule usuelle !'}
};
A.primitive=S=>{
  const fn=S.ui.choice(Object.entries(PF).map(([k,v])=>[k,v.t.replace('f(x) = ','')]),'cos');
  const xs=S.ui.slider('x',0,1,0.001,0.5,v=>''); const auto=S.ui.check(' balayage auto',true);
  let ph=0.5;
  return {draw(dt){ const c=S.ctx,P=S.P,F=PF[fn.v];
    if(auto.v){ ph=(ph+dt*0.08)%1; xs.el.value=ph; xs.v=ph; } else ph=xs.v;
    const x=F.r[0]+(F.r[1]-F.r[0])*ph, hh=(S.h-36)/2;
    const V1=view({x:40,y:8,w:S.w-56,h:hh},F.r,F.y), V2=view({x:40,y:hh+26,w:S.w-56,h:hh},F.r,F.Fy);
    axes(c,P,V1,{ticks:[1,1],yl:F.t}); axes(c,P,V2,{ticks:[1,1],yl:F.Ft});
    const lo=Math.min(F.a,x), hi=Math.max(F.a,x);
    const g=t=>Math.max(0,F.f(t)), l=t=>Math.min(0,F.f(t));
    fill(c,V1,g,()=>0,H.rgba(P.dark?'#45d1a5':'#0d8a6a',0.35),lo,hi); fill(c,V1,l,()=>0,H.rgba(P.dark?'#ff7a4d':'#e2552b',0.35),lo,hi);
    curve(c,V1,F.f,P.ink,2.2,F.r[0]+(fn.v==='inv'?0.15:0),F.r[1]);
    H.line(c,V1.X(x),V1.box.y,V1.X(x),V2.box.y+V2.box.h,P.ink3,1,[4,4]);
    // F par intégration numérique depuis a
    const Fv=t=>{ const N=200,h=(t-F.a)/N; let s=0; for(let i=0;i<N;i++){ s+=F.f(F.a+(i+0.5)*h)*h; } return s; };
    c.save(); c.beginPath(); c.rect(V2.box.x,V2.box.y,V2.box.w,V2.box.h); c.clip();
    c.strokeStyle=H.rgba(P.dark?'#ffffff':'#000000',0.18); c.lineWidth=2; c.beginPath(); let acc=0, prev=null; const N=300;
    const pts=[]; for(let i=0;i<=N;i++){ const t=F.r[0]+(F.r[1]-F.r[0])*i/N; if(fn.v==='inv'&&t<0.2){continue;} pts.push([t,Fv(t)]); }
    pts.forEach((p,i)=>i?c.lineTo(V2.X(p[0]),V2.Y(p[1])):c.moveTo(V2.X(p[0]),V2.Y(p[1]))); c.stroke();
    c.strokeStyle=P.acc; c.lineWidth=2.6; c.beginPath(); let st=false; pts.forEach(p=>{ if((p[0]-F.a)*(x-F.a)<0||Math.abs(p[0]-F.a)>Math.abs(x-F.a)) return; st?c.lineTo(V2.X(p[0]),V2.Y(p[1])):(c.moveTo(V2.X(p[0]),V2.Y(p[1])),st=true); }); c.stroke();
    const Fx=Fv(x), sl=F.f(x), k=(V2.Y(1)-V2.Y(0))/(V2.X(1)-V2.X(0)), d=40/Math.sqrt(1+(sl*k)**2);
    H.line(c,V2.X(x)-d,V2.Y(Fx)+sl*k*(-d)*-1*-1,V2.X(x)+d,V2.Y(Fx)+sl*k*d,P.e,2);
    c.restore(); dot(c,V2.X(x),V2.Y(Fx),5.5,P.acc); dot(c,V1.X(x),V1.Y(sl),5,P.e);
    S.read(`x = ${f2(x)}   aire signée de ${F.a} à x = F(x) = ${f2(Fx)}   ·   pente de F en x (tangente orange) = f(x) = ${f2(sl)}  → F′ = f : la hauteur de f dit à quelle vitesse l’aire grandit.`);
  }};
};

/* ===================== 6. CHAMP DE DIRECTIONS (EDO 1er ordre) ===================== */
const SM={c:{t:'1',f:t=>1},t:{t:'t',f:t=>t},s:{t:'sin 2t',f:t=>Math.sin(2*t)},z:{t:'0',f:t=>0}};
A.slope=S=>{
  const a=S.ui.slider('a',-0.6,3,0.1,1,v=>v.toFixed(1)); const sm=S.ui.choice(Object.entries(SM).map(([k,v])=>[k,'b(t) = '+v.t]),'s');
  S.ui.button('Effacer les courbes',()=>{starts.length=0; def();});
  const starts=[]; const def=()=>{[-2.5,-1,0.5,2,2.8].forEach(u=>starts.push([0,u]));}; def();
  let V; const setup=()=>{V=view({x:34,y:10,w:S.w-48,h:S.h-30},[0,8],[-3,3]);};
  S.onDown=(p,hit)=>{ if(!V) return; const t=V.IX(p.x),u=V.IY(p.y); if(t>=0&&t<=8&&Math.abs(u)<=3){ starts.push([t,u]); if(starts.length>14) starts.shift(); S.dirty=true; } };
  S.cursor='crosshair';
  const fr=(t,u)=>-a.v*u+SM[sm.v].f(t);
  function sol(t0,u0,dir){ const pts=[[t0,u0]]; let t=t0,u=u0; const h=0.02*dir; for(let i=0;i<500;i++){ const k1=fr(t,u),k2=fr(t+h/2,u+h/2*k1),k3=fr(t+h/2,u+h/2*k2),k4=fr(t+h,u+h*k3); u+=h/6*(k1+2*k2+2*k3+k4); t+=h; if(t<0||t>8||Math.abs(u)>8) break; pts.push([t,u]); } return pts; }
  return {resize:setup,always:false,draw(){ if(!V) setup(); const c=S.ctx,P=S.P; axes(c,P,V,{ticks:[1,1],xl:'t',yl:'u(t)'});
    for(let t=0.25;t<8;t+=0.5) for(let u=-2.75;u<3;u+=0.5){ const s=fr(t,u); const dx=1, dy=s; const k=(V.Y(1)-V.Y(0))/(V.X(1)-V.X(0)); const L=Math.hypot(1,dy*k), l=9/L;
      H.line(c,V.X(t)-l,V.Y(u)-l*dy*k*-1*-1,V.X(t)+l,V.Y(u)+l*dy*k,P.ink3,1.2); }
    starts.forEach(([t0,u0],i)=>{ const pts=[...sol(t0,u0,-1).reverse(),...sol(t0,u0,1)];
      c.save(); c.beginPath(); c.rect(V.box.x,V.box.y,V.box.w,V.box.h); c.clip(); c.strokeStyle=i%2?P.b:P.acc; c.lineWidth=2; c.beginPath(); pts.forEach((p,j)=>j?c.lineTo(V.X(p[0]),V.Y(p[1])):c.moveTo(V.X(p[0]),V.Y(p[1]))); c.stroke(); c.restore();
      dot(c,V.X(t0),V.Y(u0),4.5,P.e); });
    const conv=a.v>0?`a > 0 : toutes les courbes oublient leur départ (Ce^(−at) → 0) et se collent à la solution particulière`:a.v<0?`a < 0 : e^(−at) EXPLOSE, les courbes s’écartent`:`a = 0 : u′ = b(t), on intègre simplement`;
    S.read(`u′ + ${f2(a.v)}·u = ${SM[sm.v].t}   ·   chaque trait = la pente imposée par l’équation en ce point. Clique pour lancer une solution.   ${conv}.`);
  }};
};

/* ===================== 7. EDO 2nd ORDRE : racines ↔ régime ===================== */
A.ode2=S=>{
  const lam=S.ui.slider('λ (amortissement)',-0.4,3,0.02,0.3,v=>v.toFixed(2)); const w0=S.ui.slider('ω₀',0.5,3,0.02,1.5,v=>v.toFixed(2));
  return {always:false,draw(){ const c=S.ctx,P=S.P, l=lam.v, w=w0.v; const side=Math.min(S.h-20,S.w*0.36);
    const nar=S.w<560, s1=nar?Math.min(S.w-20,S.h*0.42):side;
    const V1=nar?view({x:(S.w-s1)/2,y:8,w:s1,h:s1*0.62},[-4.2,1.2],[-2.7,2.7]):view({x:10,y:10,w:side,h:side},[-4.2,1.2],[-2.7,2.7]);
    const V2=nar?view({x:30,y:s1*0.62+22,w:S.w-44,h:S.h-s1*0.62-40},[0,12],[-1.6,1.6]):view({x:side+44,y:10,w:S.w-side-58,h:S.h-30},[0,12],[-1.6,1.6]);
    axes(c,P,V1,{grid:1,xl:'Re',yl:'Im'}); axes(c,P,V2,{ticks:[2,1],xl:'t',yl:'u(t), u(0)=1, u′(0)=0'});
    c.fillStyle=H.rgba(P.dark?'#ff7a4d':'#e2552b',0.08); c.fillRect(V1.X(0),V1.box.y,V1.box.x+V1.box.w-V1.X(0),V1.box.h);
    if(!nar) H.text(c,'instable',V1.box.x+V1.box.w-6,V1.box.y+V1.box.h-12,P.e,10.5,'right',600);
    const D=l*l-w*w; let r1,r2,f,reg;
    if(D<-1e-4){ const om=Math.sqrt(-D); r1=[-l,om]; r2=[-l,-om]; f=t=>Math.exp(-l*t)*(Math.cos(om*t)+l/om*Math.sin(om*t)); reg=`Δ < 0 : racines complexes −λ ± iω, ω = √(ω₀² − λ²) = ${f2(om)} → PSEUDO-PÉRIODIQUE : u = e^(−λt)(A cos ωt + B sin ωt)`;
      if(l>0){ curve(c,V2,t=>Math.exp(-l*t),P.ink3,1,0,12,100,[4,4]); curve(c,V2,t=>-Math.exp(-l*t),P.ink3,1,0,12,100,[4,4]); } }
    else if(D<=1e-4){ r1=r2=[-l,0]; f=t=>(1+l*t)*Math.exp(-l*t); reg=`Δ = 0 : racine double r = −λ → CRITIQUE : u = (A + Bt)e^(−λt), retour le plus rapide sans dépasser`; }
    else { const s=Math.sqrt(D); const a=-l+s,b=-l-s; r1=[a,0]; r2=[b,0]; f=t=>(b*Math.exp(a*t)-a*Math.exp(b*t))/(b-a); reg=`Δ > 0 : deux racines réelles ${f2(a)} et ${f2(b)} → APÉRIODIQUE : u = A e^(r₁t) + B e^(r₂t)`; }
    [r1,r2].forEach(r=>{ dot(c,V1.X(r[0]),V1.Y(r[1]),7,P.acc); });
    c.strokeStyle=P.ink3; c.setLineDash([3,4]); c.beginPath(); c.arc(V1.X(0),V1.Y(0),(V1.X(1)-V1.X(0))*w,PI/2,3*PI/2); c.stroke(); c.setLineDash([]);
    if(!nar) H.text(c,'racines de r² + 2λr + ω₀²',V1.box.x+8,V1.box.y+V1.box.h-10,P.ink2,11,'left',600);
    curve(c,V2,f,P.acc,2.6,0,12,400);
    S.read(`u″ + ${f2(2*l)}u′ + ${f2(w*w)}u = 0   ·   ${reg}${l<0?'   ·   λ < 0 : racines à DROITE ⇒ ça explose':''}`);
  }};
};

/* ===================== 8. FUBINI : découper en tranches ===================== */
const DOM={
  T:{t:'triangle x+y ≤ 1',lo:x=>0,hi:x=>1-x,lo2:y=>0,hi2:y=>1-y,
     v:['x fixé, de 0 à 1','y va de 0 à 1 − x','∬ = ∫₀¹ ( ∫₀^(1−x) f dy ) dx'],h:['y fixé, de 0 à 1','x va de 0 à 1 − y','∬ = ∫₀¹ ( ∫₀^(1−y) f dx ) dy']},
  P:{t:'entre y = x² et y = x',lo:x=>x*x,hi:x=>x,lo2:y=>y,hi2:y=>Math.sqrt(y),
     v:['x fixé, de 0 à 1','y va de x² à x','∬ = ∫₀¹ ( ∫_(x²)^x f dy ) dx'],h:['y fixé, de 0 à 1','x va de y à √y','∬ = ∫₀¹ ( ∫_y^(√y) f dx ) dy']},
  Q:{t:'quart de disque',lo:x=>0,hi:x=>Math.sqrt(Math.max(0,1-x*x)),lo2:y=>0,hi2:y=>Math.sqrt(Math.max(0,1-y*y)),
     v:['x fixé, de 0 à 1','y va de 0 à √(1 − x²)','(en polaire c’est bien plus simple !)'],h:['y fixé, de 0 à 1','x va de 0 à √(1 − y²)','(en polaire c’est bien plus simple !)']}
};
A.fubini=S=>{
  const dm=S.ui.choice(Object.entries(DOM).map(([k,v])=>[k,v.t]),'T'); const ord=S.ui.choice([['v','tranches verticales (dy puis dx)'],['h','tranches horizontales (dx puis dy)']],'v');
  const pos=S.ui.slider('tranche',0,1,0.001,0.35,v=>''); const auto=S.ui.check(' balayage',false);
  return {draw(dt){ const c=S.ctx,P=S.P,D=DOM[dm.v],v=ord.v==='v'; if(auto.v){ pos.v=(pos.v+dt*0.15)%1; pos.el.value=pos.v; }
    const nar=S.w<560; const side=nar?Math.min(S.w-20,S.h-150):Math.min(S.h-20,S.w*0.55); const V=view({x:nar?(S.w-side)/2:10,y:10,w:side,h:side},[-0.15,1.2],[-0.15,1.2]);
    axes(c,P,V,{ticks:[0.5,0.5],xl:'x',yl:'y'});
    const acc=P.dark?'#45d1a5':'#0d8a6a';
    fill(c,V,D.hi,D.lo,H.rgba(acc,0.15),0,1);
    const s=pos.v;
    if(v) fill(c,V,D.hi,D.lo,H.rgba(acc,0.35),0,s);
    else { c.save(); c.fillStyle=H.rgba(acc,0.35); c.beginPath(); for(let i=0;i<=100;i++){const y=s*i/100; c.lineTo(V.X(D.lo2(y)),V.Y(y));} for(let i=100;i>=0;i--){const y=s*i/100; c.lineTo(V.X(D.hi2(y)),V.Y(y));} c.closePath(); c.fill(); c.restore(); }
    curve(c,V,D.hi,P.ink2,1.6,0,1); curve(c,V,D.lo,P.ink2,1.6,0,1);
    const w=0.018;
    if(v){ const a=D.lo(s),b=D.hi(s); c.fillStyle=P.e; c.fillRect(V.X(s-w/2),V.Y(b),V.X(s+w/2)-V.X(s-w/2),V.Y(a)-V.Y(b));
      dot(c,V.X(s),V.Y(a),5,P.b); dot(c,V.X(s),V.Y(b),5,P.b); H.text(c,'y = '+D.v[1].split(' à ')[0].replace('y va de ',''),V.X(s)+8,V.Y(a)+(a<0.05?-10:12),P.b,12,'left',700); H.text(c,'y = '+D.v[1].split(' à ')[1],V.X(s)+8,V.Y(b)-10,P.b,12,'left',700); H.text(c,'x',V.X(s),V.Y(0)+30,P.e,12,'center',700); }
    else { const a=D.lo2(s),b=D.hi2(s); c.fillStyle=P.e; c.fillRect(V.X(a),V.Y(s+w/2),V.X(b)-V.X(a),V.Y(s-w/2)-V.Y(s+w/2));
      dot(c,V.X(a),V.Y(s),5,P.b); dot(c,V.X(b),V.Y(s),5,P.b); H.text(c,'x = '+D.h[1].split(' à ')[0].replace('x va de ',''),V.X(a)-6,V.Y(s)-12,P.b,12,'right',700); H.text(c,'x = '+D.h[1].split(' à ')[1],V.X(b)+6,V.Y(s)-12,P.b,12,'left',700); H.text(c,'y',V.X(0)-12,V.Y(s),P.e,12,'center',700); }
    const L=v?D.v:D.h, tx=nar?14:side+30, ty=nar?side+30:40, lh=nar?20:26, fs=nar?12:13.5; const lines=['1. Tranche (rouge) : '+L[0],'2. Sur la tranche : '+L[1],'3. On empile les tranches :','   '+L[2]];
    lines.forEach((t,i)=>H.text(c,t,tx,ty+i*lh,i===3?P.acc:P.ink,fs,'left',i===3?700:500));
    if(!nar){ H.text(c,'Bornes INTÉRIEURES : dépendent de la variable extérieure.',tx,40+4*26+10,P.ink3,12);
    H.text(c,'Bornes EXTÉRIEURES : des NOMBRES.',tx,40+5*26+4,P.ink3,12); }
    S.read(`Fubini : on découpe le domaine en tranches. Change l’ordre : les bornes changent, le résultat non.`);
  }};
};

/* ===================== 9. COORDONNÉES POLAIRES ===================== */
A.polar=S=>{
  const r=S.ui.slider('r',0.2,2.4,0.01,1.6,v=>v.toFixed(2)); const th=S.ui.slider('θ (°)',0,350,1,35,v=>v+'°'); const fin=S.ui.slider('finesse',4,16,1,8,v=>v);
  return {always:false,draw(){ const c=S.ctx,P=S.P; const side=Math.min(S.h-20,S.w*0.5);
    const V=view({x:10,y:10,w:side,h:side},[-2.7,2.7],[-2.7,2.7]); axes(c,P,V,{xl:'x',yl:'y'});
    const n=fin.v, dr=2.5/n, dt=TAU/(3*n), u=V.X(1)-V.X(0);
    c.strokeStyle=P.line; c.lineWidth=1; for(let i=1;i<=n;i++){ c.beginPath(); c.arc(V.X(0),V.Y(0),i*dr*u,0,7); c.stroke(); }
    for(let j=0;j<3*n;j++){ const a=j*dt; H.line(c,V.X(0),V.Y(0),V.X(2.5*Math.cos(a)),V.Y(2.5*Math.sin(a)),P.line,1); }
    const i0=Math.min(n-1,Math.floor(r.v/dr)), j0=Math.floor((th.v*PI/180)/dt)%(3*n); const R0=i0*dr,R1=R0+dr,A0=j0*dt,A1=A0+dt;
    c.fillStyle=H.rgba(P.dark?'#45d1a5':'#0d8a6a',0.45); c.beginPath(); c.arc(V.X(0),V.Y(0),R1*u,-A0,-A1,true); c.arc(V.X(0),V.Y(0),R0*u,-A1,-A0,false); c.closePath(); c.fill();
    const i1=1, j1=j0; c.fillStyle=H.rgba(P.dark?'#ff7a4d':'#e2552b',0.45); c.beginPath(); c.arc(V.X(0),V.Y(0),2*dr*u,-A0,-A1,true); c.arc(V.X(0),V.Y(0),dr*u,-A1,-A0,false); c.closePath(); c.fill();
    const Rm=(R0+R1)/2; H.text(c,'r dθ',V.X((R1+0.18)*Math.cos((A0+A1)/2)),V.Y((R1+0.18)*Math.sin((A0+A1)/2)),P.acc,12,'center',700);
    // rectangle (r, θ)
    const W=view({x:side+40,y:10,w:S.w-side-54,h:side},[0,2.5],[0,TAU]); axes(c,P,W,{ticks:[0.5,PI/2,null,v=>rad(v)],xl:'r',yl:'θ'});
    c.strokeStyle=P.line; for(let i=1;i<=n;i++) H.line(c,W.X(i*dr),W.Y(0),W.X(i*dr),W.Y(TAU),P.line,1); for(let j=1;j<3*n;j++) H.line(c,W.X(0),W.Y(j*dt),W.X(2.5),W.Y(j*dt),P.line,1);
    c.fillStyle=H.rgba(P.dark?'#45d1a5':'#0d8a6a',0.45); c.fillRect(W.X(R0),W.Y(A1),W.X(R1)-W.X(R0),W.Y(A0)-W.Y(A1));
    c.fillStyle=H.rgba(P.dark?'#ff7a4d':'#e2552b',0.45); c.fillRect(W.X(dr),W.Y(A1),W.X(2*dr)-W.X(dr),W.Y(A0)-W.Y(A1));
    H.text(c,'en (r, θ) : le disque devient un RECTANGLE',W.box.x+8,W.box.y+W.box.h-12,P.ink2,11.5,'left',600);
    const aBig=Rm*dr*dt, aSmall=1.5*dr*dr*dt;
    S.read(`Cases de même taille dr × dθ à droite, mais pas à gauche : aire verte ≈ r·dr·dθ = ${f2(aBig)}, aire orange (près du centre) ≈ ${f2(aSmall)}. D’où dx dy = r dr dθ : le facteur r corrige l’étirement.`);
  }};
};

/* ===================== 10. MATRICE 2×2 = TRANSFORMATION ===================== */
A.linmap=S=>{
  const m={a:1.5,b:0.5,c:0.3,d:1.2}; let V;
  const pre=(a,b,c2,d)=>()=>{Object.assign(m,{a,b,c:c2,d});};
  S.ui.button('Identité',pre(1,0,0,1)); S.ui.button('Rotation 90°',pre(0,-1,1,0)); S.ui.button('Cisaillement',pre(1,1,0,1)); S.ui.button('Symétrie',pre(1,0,0,-1)); S.ui.button('det = 0',pre(1,2,0.5,1));
  const setup=()=>{ const u=Math.min(S.h/7,S.w/10); V=view({x:0,y:0,w:S.w,h:S.h},[-(S.w*0.42)/u,(S.w*0.58)/u],[-S.h/2/u,S.h/2/u]); };
  const sn=v=>Math.round(v*10)/10;
  S.draggables.push({get:()=>({x:V.X(m.a),y:V.Y(m.c)}),set:(px,py)=>{m.a=sn(V.IX(px));m.c=sn(V.IY(py));}});
  S.draggables.push({get:()=>({x:V.X(m.b),y:V.Y(m.d)}),set:(px,py)=>{m.b=sn(V.IX(px));m.d=sn(V.IY(py));}});
  return {resize:setup,always:false,draw(){ if(!V) setup(); const c=S.ctx,P=S.P; axes(c,P,V,{grid:1,bg:false});
    const T=(x,y)=>[V.X(m.a*x+m.b*y),V.Y(m.c*x+m.d*y)]; const det=m.a*m.d-m.b*m.c;
    c.strokeStyle=H.rgba(P.dark?'#9d8bff':'#5a3fd6',0.35); c.lineWidth=1; c.beginPath();
    for(let k=-6;k<=6;k++){ let p=T(k,-6),q=T(k,6); c.moveTo(...p); c.lineTo(...q); p=T(-6,k); q=T(6,k); c.moveTo(...p); c.lineTo(...q); } c.stroke();
    const col=Math.abs(det)<0.05?P.bad:det>0?(P.dark?'#45d1a5':'#0d8a6a'):(P.dark?'#ff7a4d':'#e2552b');
    c.fillStyle=H.rgba(P.dark?'#888888':'#888888',0.12); c.fillRect(V.X(0),V.Y(1),V.X(1)-V.X(0),V.Y(0)-V.Y(1));
    c.fillStyle=H.rgba(col,0.3); c.beginPath(); c.moveTo(...T(0,0)); c.lineTo(...T(1,0)); c.lineTo(...T(1,1)); c.lineTo(...T(0,1)); c.closePath(); c.fill();
    H.arrow(c,V.X(0),V.Y(0),...T(1,0),P.e,3,11); H.arrow(c,V.X(0),V.Y(0),...T(0,1),P.b,3,11);
    dot(c,...T(1,0),6,P.e); dot(c,...T(0,1),6,P.b); H.text(c,'A·e₁ = 1ʳᵉ colonne',T(1,0)[0]+9,T(1,0)[1]+14,P.e,12,'left',700); H.text(c,'A·e₂ = 2ᵉ colonne',T(0,1)[0]+9,T(0,1)[1]-12,P.b,12,'left',700);
    const bx=14,by=14; c.fillStyle=P.bg2; c.strokeStyle=P.line; c.beginPath(); c.roundRect?c.roundRect(bx,by,170,70,10):c.rect(bx,by,170,70); c.fill(); c.stroke();
    H.text(c,'A =',bx+12,by+35,P.ink,15,'left',700); H.text(c,f2(m.a),bx+80,by+22,P.e,14,'center',700); H.text(c,f2(m.c),bx+80,by+48,P.e,14,'center',700); H.text(c,f2(m.b),bx+135,by+22,P.b,14,'center',700); H.text(c,f2(m.d),bx+135,by+48,P.b,14,'center',700);
    H.line(c,bx+52,by+10,bx+52,by+60,P.ink2,1.5); H.line(c,bx+162,by+10,bx+162,by+60,P.ink2,1.5);
    S.read(`det A = ad − bc = ${f2(det)} : le carré unité (gris) devient le parallélogramme d’aire |det| = ${f2(Math.abs(det))}${det<-0.05?' — det < 0 : l’orientation est RETOURNÉE (effet miroir)':''}${Math.abs(det)<0.05?' — det = 0 : le plan est ÉCRASÉ sur une droite, impossible de revenir en arrière ⇒ A NON inversible':' ⇒ A inversible'}. Déplace les pointes des colonnes.`);
  }};
};

/* ===================== 11. SÉRIES DE FOURIER ===================== */
const SIG={
  sq:{t:'créneau',f:t=>{const u=((t%TAU)+TAU)%TAU; return u<PI?1:-1;},a0:0,an:n=>0,bn:n=>n%2?4/(n*PI):0,y:[-1.6,1.6]},
  saw:{t:'f(t) = t',f:t=>{const u=((t+PI)%TAU+TAU)%TAU-PI; return u;},a0:0,an:n=>0,bn:n=>2*(n%2?1:-1)/n,y:[-4,4]},
  par:{t:'f(t) = t²',f:t=>{const u=((t+PI)%TAU+TAU)%TAU-PI; return u*u;},a0:PI*PI/3,an:n=>4*(n%2?-1:1)/(n*n),bn:n=>0,y:[-1.5,11]},
  half:{t:'sinus redressé (½ onde)',f:t=>{const u=((t%TAU)+TAU)%TAU; return u<PI?Math.sin(u):0;},a0:1/PI,an:n=>n===1?0:(n%2?0:-2/(PI*(n*n-1))),bn:n=>n===1?0.5:0,y:[-0.5,1.4]}
};
A.fseries=S=>{
  const sg=S.ui.choice(Object.entries(SIG).map(([k,v])=>[k,v.t]),'sq'); const N=S.ui.slider('N harmoniques',0,40,1,3,v=>v); const harm=S.ui.check(' voir chaque harmonique',false);
  return {always:false,draw(){ const c=S.ctx,P=S.P,G=SIG[sg.v]; const hh=S.h*0.64;
    const V=view({x:36,y:8,w:S.w-50,h:hh-10},[-3*PI,3*PI],G.y); axes(c,P,V,{ticks:[PI,G.y[1]>5?2:1,v=>(Math.round(v/PI)===1?'':Math.round(v/PI)===-1?'−':Math.round(v/PI))+'π'],xl:'t'});
    curve(c,V,G.f,H.rgba(P.dark?'#ffffff':'#000000',0.3),5,undefined,undefined,1200);
    const S_N=t=>{ let s=G.a0; for(let n=1;n<=N.v;n++) s+=G.an(n)*Math.cos(n*t)+G.bn(n)*Math.sin(n*t); return s; };
    if(harm.v) for(let n=1;n<=Math.min(N.v,8);n++){ const a=G.an(n),b=G.bn(n); if(Math.abs(a)+Math.abs(b)<1e-9) continue; curve(c,V,t=>a*Math.cos(n*t)+b*Math.sin(n*t),H.rgba(P.dark?'#5fd6e2':'#0f7f8c',0.6),1.2,undefined,undefined,600); }
    curve(c,V,S_N,P.acc,2.4,undefined,undefined,1500);
    const W=view({x:36,y:hh+8,w:S.w-50,h:S.h-hh-22},[-0.7,Math.max(10,N.v)+0.7],[0,1]);
    axes(c,P,W,{xl:'n',yl:'spectre Aₙ = √(aₙ² + bₙ²)'}); const amps=[Math.abs(G.a0)]; for(let n=1;n<=Math.max(10,N.v);n++) amps.push(Math.hypot(G.an(n),G.bn(n)));
    const mx=Math.max(...amps)||1; amps.forEach((A_,n)=>{ const on=n<=N.v; c.fillStyle=on?P.acc:H.rgba(P.dark?'#ffffff':'#000000',0.15); const x=W.X(n), bw=Math.max(2,(W.X(1)-W.X(0))*0.5); c.fillRect(x-bw/2,W.Y(A_/mx*0.9),bw,W.Y(0)-W.Y(A_/mx*0.9)); if(N.v<=20&&n%(N.v>12?2:1)===0) H.text(c,''+n,x,W.Y(0)+9,P.ink3,9.5,'center'); });
    S.read(`S_N(t) = a₀ + Σₙ₌₁^N (aₙ cos nt + bₙ sin nt), N = ${N.v}.  Plus on ajoute d’harmoniques, plus la somme colle au signal (gris). ${sg.v==='sq'||sg.v==='saw'?'Aux sauts : S_N → moyenne des deux limites (Dirichlet) et un dépassement d’environ 9 % subsiste (Gibbs).':'Signal continu : convergence rapide (coefficients en 1/n²).'}`);
  }};
};

/* ===================== 12. TRANSFORMÉE DE FOURIER ===================== */
const sinc=x=>Math.abs(x)<1e-9?1:Math.sin(PI*x)/(PI*x);
const FT={
  rect:{t:'porte Π_a',f:(t,a)=>Math.abs(t)<a/2?1:0,F:(l,a)=>a*sinc(a*l),txt:a=>`Π_a (largeur ${f2(a)}) → F(λ) = sin(πaλ)/(πλ) : premier zéro en λ = 1/a = ${f2(1/a)}`},
  tri:{t:'triangle Λ',f:(t,a)=>Math.max(0,1-Math.abs(t)/a),F:(l,a)=>a*sinc(a*l)**2,txt:a=>`triangle (demi-largeur ${f2(a)}) → a·sinc²(aλ) : toujours ≥ 0, décroît plus vite (signal continu)`},
  exp:{t:'e^(−|t|/a)',f:(t,a)=>Math.exp(-Math.abs(t)/a),F:(l,a)=>2*a/(1+4*PI*PI*a*a*l*l),txt:a=>`e^(−|t|/a) → 2a/(1 + 4π²a²λ²) (lorentzienne)`},
  gau:{t:'gaussienne',f:(t,a)=>Math.exp(-PI*t*t/(a*a)),F:(l,a)=>a*Math.exp(-PI*a*a*l*l),txt:a=>`e^(−πt²/a²) → a·e^(−πa²λ²) : une gaussienne reste une gaussienne !`}
};
A.ftrans=S=>{
  const sg=S.ui.choice(Object.entries(FT).map(([k,v])=>[k,v.t]),'rect'); const a=S.ui.slider('largeur a',0.3,3,0.01,1,v=>v.toFixed(2));
  return {always:false,draw(){ const c=S.ctx,P=S.P,G=FT[sg.v],w=(S.w-60)/2;
    const V1=view({x:14,y:10,w,h:S.h-28},[-3.2,3.2],[-0.35,1.25]); const V2=view({x:w+44,y:10,w,h:S.h-28},[-3.2,3.2],[-0.35*3,1.25*3]);
    axes(c,P,V1,{ticks:[1,0.5],xl:'t',yl:'f(t)'}); axes(c,P,V2,{ticks:[1,1],xl:'λ (fréquence)',yl:'f̂(λ)'});
    fill(c,V1,t=>G.f(t,a.v),()=>0,H.rgba(P.dark?'#45d1a5':'#0d8a6a',0.25),-3.2,3.2,800);
    curve(c,V1,t=>G.f(t,a.v),P.acc,2.4,undefined,undefined,800); curve(c,V2,l=>G.F(l,a.v),P.e,2.4,undefined,undefined,800);
    if(sg.v==='rect') [1,-1].forEach(s=>{ H.line(c,V2.X(s/a.v),V2.Y(0)-5,V2.X(s/a.v),V2.Y(0)+5,P.e,2); });
    S.read(`${G.txt(a.v)}.   Signal étroit ⇔ spectre large (et inversement) ; f̂(0) = ∫f(t)dt = aire du signal = ${f2(G.F(0,a.v))}.`);
  }};
};

/* ===================== 13. LAPLACE : pôles ↔ réponse ===================== */
A.laplace=S=>{
  const md=S.ui.choice([['r','pôle réel  1/(p − a)'],['c','pôles complexes  1/((p − σ)² + ω²)']],'c');
  const pole={x:-0.4,y:2}; let V1;
  S.draggables.push({get:()=>V1?{x:V1.X(pole.x),y:V1.Y(md.v==='r'?0:pole.y)}:{x:-99,y:-99},set:(px,py)=>{pole.x=Math.round(V1.IX(px)*20)/20; if(md.v==='c') pole.y=Math.max(0.3,Math.round(V1.IY(py)*20)/20);}});
  return {always:false,draw(){ const c=S.ctx,P=S.P; const side=Math.min(S.h-20,S.w*0.38);
    const nar=S.w<560, s1=Math.min(S.w-20,S.h*0.45);
    V1=nar?view({x:(S.w-s1)/2,y:8,w:s1,h:s1*0.62},[-2.5,1],[-3.5,3.5]):view({x:10,y:10,w:side,h:side},[-2.5,1],[-3.5,3.5]);
    const V2=nar?view({x:30,y:s1*0.62+22,w:S.w-44,h:S.h-s1*0.62-40},[0,10],[-1.6,2.6]):view({x:side+44,y:10,w:S.w-side-58,h:S.h-30},[0,10],[-1.6,2.6]);
    axes(c,P,V1,{grid:1,xl:'Re p',yl:'Im p'}); axes(c,P,V2,{ticks:[2,1],xl:'t',yl:'f(t) = original'});
    const s=pole.x; c.fillStyle=H.rgba(P.dark?'#45d1a5':'#0d8a6a',0.12); c.fillRect(V1.X(s),V1.box.y,V1.box.x+V1.box.w-V1.X(s),V1.box.h);
    H.line(c,V1.X(s),V1.box.y,V1.X(s),V1.box.y+V1.box.h,P.acc,1,[4,4]); H.text(c,'Re p > '+f2(s),V1.X(s)+5,V1.box.y+V1.box.h-10,P.acc,11,'left',600);
    const X=(x,y)=>{ const k=11; c.strokeStyle=P.e; c.lineWidth=3; c.beginPath(); c.moveTo(V1.X(x)-6,V1.Y(y)-6); c.lineTo(V1.X(x)+6,V1.Y(y)+6); c.moveTo(V1.X(x)+6,V1.Y(y)-6); c.lineTo(V1.X(x)-6,V1.Y(y)+6); c.stroke(); };
    let f,txt; const pm=s<0?`p + ${f2(-s)}`:`p − ${f2(s)}`;
    if(md.v==='r'){ X(s,0); f=t=>Math.exp(s*t); txt=`F(p) = 1/(${pm})  ⟷  f(t) = e^(${f2(s)}t)·U(t)`; }
    else { const w=pole.y; X(s,w); X(s,-w); f=t=>Math.exp(s*t)*Math.sin(w*t)/w; txt=`F(p) = 1/((${pm})² + ${f2(w)}²)  ⟷  f(t) = e^(${f2(s)}t)·sin(${f2(w)}t)/${f2(w)}`;
      if(s<0){ curve(c,V2,t=>Math.exp(s*t)/w,P.ink3,1,0,10,100,[4,4]); curve(c,V2,t=>-Math.exp(s*t)/w,P.ink3,1,0,10,100,[4,4]); } }
    curve(c,V2,f,P.acc,2.6,0,10,500);
    S.read(`${txt}.   Partie réelle du pôle = taux de croissance (${s<0?'< 0 : ça s’éteint':s>0?'> 0 : ça explose':'= 0 : ni l’un ni l’autre'})${md.v==='c'?' ; partie imaginaire = pulsation des oscillations':''}. La zone verte (Re p > abscisse de convergence) est là où l’intégrale de Laplace converge. Déplace le pôle ✕.`);
  }};
};

/* ===================== 14. RETARD (Laplace) ===================== */
A.retard=S=>{
  const sg=S.ui.choice([['u','échelon U(t)'],['r','rampe t·U(t)'],['s','sin t·U(t)']],'r'); const a=S.ui.slider('retard a',0,4,0.05,1.5,v=>v.toFixed(2));
  const F={u:['U(t)','1/p'],r:['t·U(t)','1/p²'],s:['sin t·U(t)','1/(p² + 1)']};
  const g={u:t=>t>=0?1:0,r:t=>t>=0?t:0,s:t=>t>=0?Math.sin(t):0};
  return {always:false,draw(){ const c=S.ctx,P=S.P; const V=view({x:36,y:10,w:S.w-50,h:S.h-30},[-1,10],sg.v==='r'?[-0.6,6]:[-1.4,1.6]);
    axes(c,P,V,{ticks:[1,1],xl:'t'}); const f=g[sg.v];
    curve(c,V,f,H.rgba(P.dark?'#ffffff':'#000000',0.35),2,undefined,undefined,600,[5,4]); curve(c,V,t=>f(t-a.v),P.acc,2.8,undefined,undefined,600);
    H.line(c,V.X(a.v),V.box.y,V.X(a.v),V.box.y+V.box.h,P.e,1,[3,3]); H.text(c,'t = a',V.X(a.v)+4,V.box.y+12,P.e,12,'left',700);
    S.read(`f(t) = ${F[sg.v][0]} (tirets) a pour image ${F[sg.v][1]}.  Retardée : f(t − a)·U(t − a) (vert) a pour image e^(−${f2(a.v)}p)·${F[sg.v][1]}.  Décaler dans le temps = MULTIPLIER par e^(−ap).`);
  }};
};

/* ===================== 15. INTÉGRALES GÉNÉRALISÉES ===================== */
A.improper=S=>{
  const md=S.ui.choice([['inf','∫₁^(+∞) dt/t^α'],['zero','∫₀¹ dt/t^α']],'inf'); const al=S.ui.slider('α',0.3,2.5,0.05,1.5,v=>v.toFixed(2)); const X=S.ui.slider('borne',0,1,0.001,0.4,v=>'');
  return {always:false,draw(){ const c=S.ctx,P=S.P,a=al.v,inf=md.v==='inf';
    const V=inf?view({x:36,y:10,w:S.w*0.6-40,h:S.h-30},[0,20],[-0.1,1.3]):view({x:36,y:10,w:S.w*0.6-40,h:S.h-30},[-0.05,1.1],[-0.3,8]);
    axes(c,P,V,{ticks:inf?[5,0.5]:[0.5,2],xl:'t',yl:'1/t^α'});
    const b=inf?1+19*X.v:Math.max(0.002,1-X.v*0.998); const lo=inf?1:b, hi=inf?b:1;
    fill(c,V,t=>Math.pow(t,-a),()=>0,H.rgba(P.dark?'#45d1a5':'#0d8a6a',0.35),lo,hi,300);
    curve(c,V,t=>Math.pow(t,-a),P.ink,2.2,inf?0.6:0.004,inf?20:1.1,400);
    const I=Math.abs(a-1)<1e-9?Math.log(hi/lo):(Math.pow(hi,1-a)-Math.pow(lo,1-a))/(1-a);
    const conv=inf?a>1:a<1; const lim=conv?(inf?1/(a-1):1/(1-a)):Infinity;
    // jauge
    const gx=S.w*0.6+20, gw=S.w*0.4-40; H.text(c,'Aire accumulée',gx,24,P.ink2,13,'left',700);
    const mx=conv?lim*1.15:Math.max(6,I*1.2); const bh=24; c.fillStyle=P.bg2; c.strokeStyle=P.line; c.fillRect(gx,40,gw,bh); c.strokeRect(gx,40,gw,bh);
    c.fillStyle=conv?P.acc:P.e; c.fillRect(gx,40,gw*Math.min(1,I/mx),bh);
    if(conv){ const lx=gx+gw*lim/mx; H.line(c,lx,34,lx,70,P.ink,2); H.text(c,'limite '+f2(lim),lx,82,P.ink,12,'center',700); }
    H.text(c,'aire = '+f2(I),gx,104,P.ink,15,'left',700);
    H.text(c,conv?'CONVERGE : l’aire se stabilise':'DIVERGE : l’aire grandit sans fin',gx,132,conv?P.ok:P.bad,14,'left',700);
    H.text(c,inf?'En +∞ : converge ⇔ α > 1':'En 0 : converge ⇔ α < 1',gx,160,P.ink2,13);
    H.text(c,inf?'(la courbe doit tomber assez VITE)':'(la courbe ne doit pas monter trop vite)',gx,180,P.ink3,12);
    S.read(`${inf?`∫₁^${f2(b)}`:`∫_${f2(b)}^1`} dt/t^${f2(a)} = ${f2(I)}. Pousse la borne : ${conv?`l’aire tend vers ${f2(lim)}`:'l’aire ne cesse de grandir'}. Cas limite α = 1 : ln → diverge des deux côtés.`);
  }};
};
})();
