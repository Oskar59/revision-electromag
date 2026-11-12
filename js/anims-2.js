/* ============ Animations : Chapitres 2 & 3 ============ */
(function(){
const A=window.EM_A, H=window.EM_H;

/* ---------- Conducteur plongé dans un champ ---------- */
A.conductor = S=>{
  let on=false, s=0, els=[], ions=[];
  const btn=S.ui.button('Appliquer E_ext',b=>{on=!on; b.classList.toggle('on',on); b.textContent=on?'Couper E_ext':'Appliquer E_ext';});
  const dec=S.ui.check(' décomposer E_int = E_ext + E_induit',false);
  function init(){ els=[];ions=[]; const L=S.w*0.32,R=S.w*0.68,T=S.h*0.2,B=S.h*0.8;
    for(let i=0;i<7;i++)for(let j=0;j<5;j++) ions.push({x:L+(i+0.5)*(R-L)/7,y:T+(j+0.5)*(B-T)/5});
    ions.forEach((p,k)=>{ const row=k%5; els.push({hx:p.x+(Math.random()-0.5)*20,hy:p.y+(Math.random()-0.5)*20,tx:L+6+Math.random()*10,ty:T+6+(k/ions.length)*(B-T-12),ph:Math.random()*6}); }); }
  return {resize:init,draw(dt){
    const c=S.ctx,P=S.P,L=S.w*0.32,R=S.w*0.68,T=S.h*0.2,B=S.h*0.8;
    s+= ((on?1:0)-s)*Math.min(1,dt*1.6);
    const E0=on?1:0;
    for(let y=T-30;y<=B+30;y+=34){ if(E0){ H.arrow(c,14,y,L-14,y,P.e,2.2,9); H.arrow(c,R+14,y,S.w-14,y,P.e,2.2,9);} }
    c.fillStyle=H.rgba(P.ink3,0.16); c.strokeStyle=P.ink3; c.lineWidth=2; c.fillRect(L,T,R-L,B-T); c.strokeRect(L,T,R-L,B-T);
    H.text(c,'métal',L+8,T-10,P.ink2,12.5,'left',700);
    ions.forEach(p=>{ c.fillStyle=H.rgba(P.qp,0.35); c.font='600 13px Inter'; c.textAlign='center'; c.textBaseline='middle'; c.fillText('+',p.x,p.y); });
    const e=t=>t*t*(3-2*t), k=e(H.clamp(s,0,1));
    els.forEach(p=>{ p.ph+=dt*6; const jx=Math.cos(p.ph)*3*(1-k*0.7), jy=Math.sin(p.ph*1.3)*3*(1-k*0.7); const x=p.hx+(p.tx-p.hx)*k+jx, y=p.hy+(p.ty-p.hy)*k+jy;
      c.fillStyle=P.qn; c.beginPath(); c.arc(x,y,4,0,7); c.fill(); });
    for(let j=0;j<8;j++){ const y=T+10+j*(B-T-20)/7; c.fillStyle=H.rgba(P.qp,k); c.font='800 16px Inter'; c.fillText('+',R-8,y); }
    const Ein=E0*(1-k);
    for(let y=T+25;y<B;y+=50){ if(Ein>0.03) H.arrow(c,S.w/2-45*Ein,y,S.w/2+45*Ein,y,P.e,2.5,9);
      if(dec.v&&on){ H.arrow(c,S.w/2-45,y+12,S.w/2+45,y+12,H.rgba(P.e,0.45),1.5,7); if(k>0.03) H.arrow(c,S.w/2+45*k,y+20,S.w/2-45*k,y+20,H.rgba(P.qn,0.7),1.5,7);} }
    S.read(on?(k>0.97?'Équilibre atteint : E_int = 0. Les électrons se sont accumulés sur la face gauche (−), la face droite est dépeuplée (+).\nLe champ créé par ces charges de surface compense exactement E_ext à l’intérieur. Le métal est équipotentiel.':`Régime transitoire (~10⁻¹⁹ s en vrai !) : les électrons libres remontent E… E_int = ${(Ein).toFixed(2)} E_ext`):'Sans champ : électrons libres et ions se compensent en moyenne → aucune charge nette, E = 0.');
  }};
};

/* ---------- Condensateur plan ---------- */
A.capacitor = S=>{
  const Ss=S.ui.slider('S (cm²)',4,100,1,36,v=>v+' cm²'), es=S.ui.slider('e (mm)',0.5,10,0.1,2,v=>v.toFixed(1)+' mm'), Us=S.ui.slider('U (V)',0,100,1,50,v=>v+' V');
  return {always:false,draw(){
    const c=S.ctx,P=S.P; const side=Math.sqrt(Ss.v)/10*S.h*0.75, gap=es.v/10*S.w*0.42+10;
    const cx=S.w*0.42, cy=S.h/2, x1=cx-gap/2, x2=cx+gap/2, y1=cy-side/2, y2=cy+side/2;
    const eps0=8.854e-12, C=eps0*Ss.v*1e-4/(es.v*1e-3), Q=C*Us.v, E=Us.v/(es.v*1e-3), W=0.5*C*Us.v*Us.v;
    const dens=Us.v/es.v; const ns=Math.round(H.clamp(dens/50*14,0,40));
    const na=Math.max(3,Math.round(side/24)); const al=H.clamp(0.25+dens/100,0.25,1);
    for(let i=0;i<na;i++){ const y=y1+(i+0.5)*side/na; if(Us.v>0) H.arrow(c,x1+6,y,x2-6,y,H.rgba(P.e,al),1.6+Math.min(2,dens/80),7); }
    if(Us.v>0){ c.strokeStyle=H.rgba(P.e,0.25); c.lineWidth=1.2; [[y1,-1],[y2,1]].forEach(([yy,sg])=>{ c.beginPath(); c.moveTo(x1,yy); c.bezierCurveTo(x1-gap*0.2,yy+sg*gap*0.8,x2+gap*0.2,yy+sg*gap*0.8,x2,yy); c.stroke(); }); }
    c.fillStyle=P.qp; c.fillRect(x1-7,y1,7,side); c.fillStyle=P.qn; c.fillRect(x2,y1,7,side);
    for(let i=0;i<ns;i++){ const y=y1+(i+0.5)*side/ns; H.text(c,'+',x1-15,y,P.qp,12,'center',800); H.text(c,'−',x2+15,y,P.qn,12,'center',800); }
    H.text(c,'+Q',x1-4,y1-14,P.qp,13,'center',700); H.text(c,'−Q',x2+4,y1-14,P.qn,13,'center',700);
    H.line(c,x1,y2+18,x2,y2+18,P.ink3,1); H.text(c,'e',cx,y2+30,P.ink2,13,'center',700);
    const bx=S.w*0.72; H.text(c,'C = ε₀S/e',bx,S.h*0.2,P.acc,18,'left',800);
    H.text(c,'= '+(C*1e12).toFixed(1)+' pF',bx,S.h*0.2+26,P.ink,16,'left',600);
    H.text(c,'Q = CU = '+(Q*1e9).toFixed(2)+' nC',bx,S.h*0.2+60,P.ink2,13.5);
    H.text(c,'E = U/e = '+H.fmt(E,1)+' V/m',bx,S.h*0.2+82,P.ink2,13.5);
    H.text(c,'W = ½CU² = '+(W*1e9).toFixed(2)+' nJ',bx,S.h*0.2+104,P.ink2,13.5);
    S.read(`Vérif. « l’énergie est dans le champ » : ½ε₀E² × (volume S·e) = ${(0.5*eps0*E*E*Ss.v*1e-4*es.v*1e-3*1e9).toFixed(2)} nJ = ½CU² ✓\nDouble S → C double. Double e → C divisé par 2. À U fixé, rapprocher les plaques augmente E et la charge stockée.`);
  }};
};

/* ---------- Modèle de Drude ---------- */
A.drude = S=>{
  const Es=S.ui.slider('E (vers la droite)',0,1,0.05,0.5,v=>v.toFixed(2)), ts=S.ui.slider('τ (entre collisions)',0.1,1.5,0.05,0.5,v=>v.toFixed(2)+' s');
  let els=[], vd=0, trail=[]; const vth=150, kacc=420;
  function rnd(){const a=Math.random()*2*Math.PI;return{x:vth*Math.cos(a),y:vth*Math.sin(a)};}
  return {resize(){ if(!els.length) for(let i=0;i<40;i++){const v=rnd();els.push({x:Math.random()*S.w,y:Math.random()*S.h,vx:v.x,vy:v.y,col:0});} },draw(dt){
    const c=S.ctx,P=S.P;
    for(let y=20;y<S.h;y+=40)for(let x=20;x<S.w;x+=40){c.fillStyle=H.rgba(P.qp,0.25);c.beginPath();c.arc(x,y,5,0,7);c.fill();}
    let sum=0; els.forEach((e,i)=>{ e.vx+= -kacc*Es.v*dt; if(Math.random()<dt/ts.v){const v=rnd();e.vx=v.x;e.vy=v.y;e.col=0.4;} e.col=Math.max(0,e.col-dt);
      e.x+=e.vx*dt; e.y+=e.vy*dt; if(e.x<0)e.x+=S.w; if(e.x>S.w)e.x-=S.w; if(e.y<0)e.y+=S.h; if(e.y>S.h)e.y-=S.h; sum+=e.vx;
      if(i===0){ trail.push([e.x,e.y]); if(trail.length>260) trail.shift(); }
      c.fillStyle=e.col>0?P.rem:P.qn; c.beginPath(); c.arc(e.x,e.y,i===0?6:4,0,7); c.fill(); });
    c.strokeStyle=H.rgba(P.qn,0.5); c.lineWidth=1.3; c.beginPath(); trail.forEach((p,i)=>{ if(i&&Math.abs(p[0]-trail[i-1][0])>50){c.moveTo(p[0],p[1]);return;} i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]); }); c.stroke();
    vd+= (sum/els.length - vd)*Math.min(1,dt*0.8);
    c.fillStyle=H.rgba(P.bg2,0.9); c.fillRect(10,10,250,70); H.arrow(c,24,30,24+120*Es.v,30,P.e,3,10); H.text(c,'E',30+120*Es.v,30,P.e,14,'left',700);
    H.arrow(c,150,58,150+H.clamp(vd,-130,130)*0.8,58,P.qn,3,10); H.text(c,'v_dérive',24,58,P.qn,12.5,'left',700);
    S.read(`Vitesse de dérive mesurée ≈ ${(-vd).toFixed(0)} u.a. vers la GAUCHE (théorie eτE/m ≈ ${(kacc*Es.v*ts.v).toFixed(0)}) ; agitation thermique ≈ ${vth} u.a. dans tous les sens.\nOrange = collision. Double E ou τ → la dérive double : j = (ne²τ/m) E, c’est la loi d’Ohm.`);
  }};
};

/* ---------- Expérience d'Ørsted ---------- */
A.oersted = S=>{
  const I=S.ui.slider('i (A)  — signe : ⊙ / ⊗',-10,10,0.5,6,v=>v>0?v+' ⊙':(v<0?(-v)+' ⊗':'0')), Ter=S.ui.check(' champ terrestre',true);
  let ang=[];
  return {draw(dt){
    const c=S.ctx,P=S.P,cx=S.w/2,cy=S.h/2; const sp=58; let k=0;
    [70,130,190].forEach(r=>{ if(I.v===0) return; c.strokeStyle=H.rgba(P.b,0.35); c.lineWidth=1.3; c.beginPath(); c.arc(cx,cy,r,0,7); c.stroke();
      for(let q=0;q<4;q++){const a=q*Math.PI/2+0.5; const x=cx+r*Math.cos(a),y=cy+r*Math.sin(a); const s=I.v>0?1:-1; const tx=Math.sin(a)*s, ty=-Math.cos(a)*s; H.arrow(c,x-tx*6,y-ty*6,x+tx*8,y+ty*8,H.rgba(P.b,0.7),1.5,7);} });
    for(let y=sp/2;y<S.h;y+=sp)for(let x=sp/2;x<S.w;x+=sp){ const dx=x-cx,dy=y-cy,r=Math.hypot(dx,dy); if(r<40){k++;continue;}
      const b=I.v*2200/(r*r); let bx=dy*b, by=-dx*b; if(Ter.v){bx+=12;}
      const tgt=Math.atan2(by,bx); let a=ang[k]??tgt; let d=((tgt-a+Math.PI*3)%(Math.PI*2))-Math.PI; a+=d*Math.min(1,dt*5); ang[k]=a; k++;
      if(Math.hypot(bx,by)<1e-6) continue;
      c.save(); c.translate(x,y); c.rotate(a); c.fillStyle=P.bad; c.beginPath(); c.moveTo(16,0); c.lineTo(0,-4.5); c.lineTo(0,4.5); c.fill(); c.fillStyle=P.ink3; c.beginPath(); c.moveTo(-16,0); c.lineTo(0,-4.5); c.lineTo(0,4.5); c.fill(); c.restore();
      c.strokeStyle=H.rgba(P.ink3,0.4); c.lineWidth=1; c.beginPath(); c.arc(x,y,19,0,7); c.stroke(); }
    c.fillStyle=P.bg2; c.beginPath(); c.arc(cx,cy,16,0,7); c.fill();
    if(I.v>0) H.dotOut(c,cx,cy,14,P.acc); else if(I.v<0) H.crossIn(c,cx,cy,14,P.acc); else { c.strokeStyle=P.ink3; c.beginPath(); c.arc(cx,cy,14,0,7); c.stroke(); }
    if(Ter.v) { H.arrow(c,20,S.h-20,90,S.h-20,P.ink2,2,8); H.text(c,'B_terre',96,S.h-20,P.ink2,12); }
    S.read(I.v===0?'Pas de courant : les boussoles indiquent le champ terrestre.':`Courant ${I.v>0?'sortant (⊙) → B tourne dans le sens trigo':'entrant (⊗) → B tourne dans le sens horaire'} (règle de la main droite : pouce = i, doigts = B).\nB = μ₀i/(2πr) : près du fil il domine le champ terrestre, loin il s’efface.`);
  }};
};

/* ---------- Force de Lorentz : rayon de Larmor ---------- */
A.larmor = S=>{
  const q=S.ui.choice([['p','q > 0'],['n','q < 0']],'p'), Bd=S.ui.choice([['in','B ⊗'],['out','B ⊙']],'in');
  const vs=S.ui.slider('v',0.5,2,0.05,1,v=>v.toFixed(2)), ms=S.ui.slider('m',0.5,2,0.05,1,v=>v.toFixed(2)), Bs=S.ui.slider('B',0.5,2,0.05,1,v=>v.toFixed(2));
  let p,v,tr=[]; const sc0=28; const reset=()=>{ const R=vs.v*sc0*ms.v/Bs.v; const sg=(q.v==='p'?1:-1)*(Bd.v==='in'?1:-1); p={x:S.w*0.5,y:S.h*0.5+sg*R};v={x:1,y:0};tr=[];};
  [q,Bd,vs,ms,Bs].forEach(o=>o.onchange=reset);
  return {resize:reset,draw(dt){
    const c=S.ctx,P=S.P; const sc=sc0; const R=ms.v*vs.v/Bs.v; const sg=(q.v==='p'?1:-1)*(Bd.v==='in'?1:-1); const w=sg*Bs.v/ms.v*vs.v/1;
    for(let y=25;y<S.h;y+=42)for(let x=25;x<S.w;x+=42){ (Bd.v==='in'?H.crossIn:H.dotOut)(c,x,y,6,H.rgba(P.b,0.45)); }
    const om = sg*Bs.v/ms.v*2.0; // rad/s (math, CCW positif)
    const n=8; for(let i=0;i<n;i++){ const a=om*dt/n; const ca=Math.cos(a),sa=Math.sin(a); const vx=v.x*ca-v.y*sa, vy=v.x*sa+v.y*ca; v={x:vx,y:vy}; p.x+=v.x*vs.v*sc*2.0*dt/n/ (1); p.y-=v.y*vs.v*sc*2.0*dt/n; }
    tr.push([p.x,p.y]); if(tr.length>500) tr.shift();
    c.strokeStyle=H.rgba(q.v==='p'?P.qp:P.qn,0.6); c.lineWidth=2; c.beginPath(); tr.forEach((t,i)=>i?c.lineTo(t[0],t[1]):c.moveTo(t[0],t[1])); c.stroke();
    H.arrow(c,p.x,p.y,p.x+v.x*50,p.y-v.y*50,P.acc,2.5,9); H.text(c,'v',p.x+v.x*58,p.y-v.y*58,P.acc,13,'center',700);
    const fx=-v.y*Math.sign(om), fy=v.x*Math.sign(om); H.arrow(c,p.x,p.y,p.x+fx*42,p.y-fy*42,P.e,2.5,9); H.text(c,'F',p.x+fx*52,p.y-fy*52,P.e,13,'center',700);
    H.charge(c,p.x,p.y,9,q.v==='p'?1:-1,P);
    S.read(`R = mv/(|q|B) ∝ ${R.toFixed(2)}   période T = 2πm/(|q|B) ∝ ${(ms.v/Bs.v).toFixed(2)} (indépendante de v !)\nF = q v∧B est toujours ⟂ à v : elle courbe la trajectoire sans changer la vitesse (aucun travail). Rotation ${om>0?'sens trigo':'sens horaire'}.`);
  }};
};

/* ---------- Théorème d'Ampère : contour et courants enlacés ---------- */
A.ampere = S=>{
  let W=[], ctr={x:0,y:0}, init=false;
  const rs=S.ui.slider('rayon du contour',30,200,1,110,v=>v+' px');
  ['A','B','C'].forEach((n,i)=>S.ui.button('Inverser '+n,()=>{W[i].i=-W[i].i;}));
  S.ui.button('Fil C : on/off',()=>{W[2].i=W[2].i?0:1;});
  return {always:false,resize(){ if(!init){ W=[{x:S.w*0.42,y:S.h*0.45,i:2,n:'A'},{x:S.w*0.6,y:S.h*0.6,i:-1,n:'B'},{x:S.w*0.82,y:S.h*0.35,i:1,n:'C'}]; ctr={x:S.w*0.5,y:S.h*0.5}; init=true;
      W.forEach(w=>S.draggables.push({r:18,get:()=>w,set:(x,y)=>{w.x=x;w.y=y;}})); S.draggables.push({r:14,get:()=>ctr,set:(x,y)=>{ctr={x,y}}}); } },draw(){
    const c=S.ctx,P=S.P,R=rs.v; const B=(x,y)=>{let bx=0,by=0;W.forEach(w=>{const dx=x-w.x,dy=y-w.y,r2=dx*dx+dy*dy+30;bx+=w.i*dy/r2*40;by+=-w.i*dx/r2*40;});return{x:bx,y:by};};
    // circulation (sens trigo à l'écran = normale sortante ⊙)
    let circ=0; const N=360; for(let k=0;k<N;k++){const a=k/N*2*Math.PI, x=ctr.x+R*Math.cos(a), y=ctr.y+R*Math.sin(a); const b=B(x,y); const tx=Math.sin(a), ty=-Math.cos(a); circ+=(b.x*tx+b.y*ty)*R*2*Math.PI/N;}
    let ienl=0; W.forEach(w=>{ if(Math.hypot(w.x-ctr.x,w.y-ctr.y)<R) ienl+=w.i; });
    c.strokeStyle=P.acc; c.lineWidth=2.5; c.beginPath(); c.arc(ctr.x,ctr.y,R,0,7); c.stroke();
    for(let k=0;k<4;k++){const a=k*Math.PI/2+0.3; const x=ctr.x+R*Math.cos(a), y=ctr.y+R*Math.sin(a); H.arrow(c,x-Math.sin(a)*1,y+Math.cos(a)*1,x+Math.sin(a)*12,y-Math.cos(a)*12,P.acc,2.5,9);}
    for(let k=0;k<24;k++){const a=k/24*2*Math.PI, x=ctr.x+R*Math.cos(a), y=ctr.y+R*Math.sin(a); const b=B(x,y), m=Math.hypot(b.x,b.y); if(m<1e-4) continue; const L=H.clamp(m*60,4,26); const tg=b.x*Math.sin(a)-b.y*Math.cos(a);
      H.arrow(c,x,y,x+b.x/m*L,y+b.y/m*L,tg>0?P.ok:P.bad,1.8,6);}
    c.fillStyle=P.acc; c.beginPath(); c.arc(ctr.x,ctr.y,5,0,7); c.fill(); H.text(c,'Γ',ctr.x+R*0.72,ctr.y-R*0.72-8,P.acc,16,'center',800);
    W.forEach(w=>{ c.fillStyle=P.bg2; c.beginPath(); c.arc(w.x,w.y,13,0,7); c.fill(); if(w.i>0) H.dotOut(c,w.x,w.y,12,P.ink); else if(w.i<0) H.crossIn(c,w.x,w.y,12,P.ink); else {c.strokeStyle=P.ink3;c.beginPath();c.arc(w.x,w.y,12,0,7);c.stroke();}
      H.text(c,w.n+' ('+(w.i>0?'+':'')+w.i+')',w.x+17,w.y-14,P.ink2,12,'left',700); });
    S.read(`∮ B·dl (calculé numériquement) = ${(circ/ (40*2*Math.PI)).toFixed(2)} × μ₀      μ₀·i_enlacé = ${ienl} × μ₀   ✓\nDéplace les fils (⊙ compte +, ⊗ compte −) ou le centre du contour : seuls les courants À L’INTÉRIEUR comptent, même si B dépend de tous les fils.`);
  }};
};

/* ---------- Solénoïde & contour rectangulaire ---------- */
A.solenoid = S=>{
  const ns=S.ui.slider('spires visibles',6,22,1,14,v=>v), is=S.ui.slider('i',0,2,0.1,1,v=>v.toFixed(1));
  let rect={x:0,y:0}, init=false;
  S.draggables.push({r:30,get:()=>rect,set:(x,y)=>{rect={x,y}}});
  return {always:false,resize(){ if(!init){rect={x:S.w*0.5,y:S.h*0.5-S.h*0.22};init=true;} },draw(){
    const c=S.ctx,P=S.P,cy=S.h/2,Rs=S.h*0.22,x0=S.w*0.1,x1=S.w*0.9,n=ns.v; const B0=n*is.v;
    c.fillStyle=H.rgba(P.b,0.07); c.fillRect(x0,cy-Rs,x1-x0,2*Rs);
    const al=H.clamp(0.2+is.v*0.4,0,1);
    if(is.v>0) for(let j=0;j<5;j++){const y=cy-Rs*0.8+j*Rs*0.4; H.arrow(c,x0+10,y,x1-10,y,H.rgba(P.b,al),1.4+B0/20,9);}
    const pos=[]; for(let k=0;k<n;k++){const x=x0+(k+0.5)*(x1-x0)/n; pos.push({x,y:cy-Rs,s:1},{x,y:cy+Rs,s:-1});}
    pos.forEach(p=>{ c.fillStyle=P.bg2; c.beginPath(); c.arc(p.x,p.y,8,0,7); c.fill(); (p.s>0?H.dotOut:H.crossIn)(c,p.x,p.y,7,P.ink); });
    const L=S.w*0.24, hh=S.h*0.2; const rx=rect.x-L/2, ry=rect.y-hh/2;
    let enc=0; pos.forEach(p=>{ if(p.x>rx&&p.x<rx+L&&p.y>ry&&p.y<ry+hh) enc+=p.s; });
    const inside=y=>y>cy-Rs&&y<cy+Rs; const segIn=(y)=> inside(y) ? (Math.min(x1,rx+L)-Math.max(x0,rx))/((x1-x0)/n) : 0;
    const circ = is.v*(Math.max(0,segIn(ry+hh)) - Math.max(0,segIn(ry)));
    c.strokeStyle=P.acc; c.lineWidth=2.5; c.strokeRect(rx,ry,L,hh);
    H.arrow(c,rx+L*0.35,ry+hh,rx+L*0.65,ry+hh,P.acc,2.5,9); H.arrow(c,rx+L*0.65,ry,rx+L*0.35,ry,P.acc,2.5,9);
    H.text(c,'A',rx-8,ry+hh+10,P.acc,13,'center',800); H.text(c,'B',rx+L+8,ry+hh+10,P.acc,13,'center',800); H.text(c,'C',rx+L+8,ry-10,P.acc,13,'center',800); H.text(c,'D',rx-8,ry-10,P.acc,13,'center',800);
    H.text(c,'glisse le rectangle',rect.x,ry-22,P.ink2,11.5,'center',600);
    S.read(`∮B·dl ≈ ${circ.toFixed(1)} (u.a.)   μ₀·i_enlacé = ${(enc*is.v).toFixed(1)} (u.a.) → ${enc} spire(s) × i\nÀ cheval sur une rangée : seul le côté intérieur contribue (B ∥ dl), les côtés ⟂ donnent 0, l’extérieur B≈0 → B·L = μ₀ n L i ⇒ B = μ₀ n i, uniforme.`);
  }};
};
})();
