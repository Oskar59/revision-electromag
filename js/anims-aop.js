/* ============ Animations : amplificateur opérationnel (Électronique ch. 4) ============ */
(function(){
const A=window.EM_A, H=window.EM_H; if(!A) return;
const EL=()=>window.EM_EL;
const f2=v=>(Math.abs(v)<0.005?'0':v.toFixed(2)).replace('.',',');
/* triangle d'AOP : entrées à gauche (− en haut, + en bas), sortie à droite */
function aop(c,x,y,s,P,labels=true,topPlus=false){ c.fillStyle=P.bg2; c.strokeStyle=P.ink; c.lineWidth=2.2; c.beginPath(); c.moveTo(x,y-s); c.lineTo(x,y+s); c.lineTo(x+s*1.6,y); c.closePath(); c.fill(); c.stroke();
  if(labels){ H.text(c,topPlus?'+':'−',x+10,y-s*0.5,topPlus?P.ok:P.bad,16,'center',800); H.text(c,topPlus?'−':'+',x+10,y+s*0.5,topPlus?P.bad:P.ok,16,'center',800); }
  return {inTop:[x,y-s*0.5],inBot:[x,y+s*0.5],out:[x+s*1.6,y]}; }
window.EM_AOP={aop};
function wire(c,pts,col){ c.strokeStyle=col; c.lineWidth=2; c.beginPath(); pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1])); c.stroke(); }
function plot(c,P,box,fns,yr,xl){ const {x,y,w,h}=box; c.fillStyle=P.bg2; c.strokeStyle=P.line; c.lineWidth=1; c.beginPath(); c.roundRect?c.roundRect(x,y,w,h,8):c.rect(x,y,w,h); c.fill(); c.stroke();
  const Y=v=>y+h/2-v/yr*(h/2-8); H.line(c,x+6,Y(0),x+w-6,Y(0),P.ink3,1);
  fns.forEach(F=>{ c.strokeStyle=F.col; c.lineWidth=F.w||2.2; c.setLineDash(F.dash||[]); c.beginPath(); for(let i=0;i<=300;i++){ const t=i/300; const v=Math.max(-yr,Math.min(yr,F.f(t))); i?c.lineTo(x+6+t*(w-12),Y(v)):c.moveTo(x+6,Y(v)); } c.stroke(); c.setLineDash([]); if(F.lab) H.text(c,F.lab,x+w-10,y+14+(F.k||0)*16,F.col,12,'right',700); });
  if(xl) H.text(c,xl,x+8,y+12,P.ink3,11,'left',600); return Y; }

/* ---------- 1. Modèle : vs = A·ε, saturation ---------- */
A.aopmodel=S=>{
  const eps=S.ui.slider('ε = v₊ − v₋ (µV)',-300,300,1,40,v=>v+' µV'); const Ag=S.ui.choice([['1e5','A = 10⁵'],['1e6','A = 10⁶']],'1e5');
  return {always:false,draw(){ const c=S.ctx,P=S.P; const Vsat=13, Av=+Ag.v; const vs=Math.max(-Vsat,Math.min(Vsat,Av*eps.v*1e-6));
    const o=aop(c,70,S.h/2,60,P); H.text(c,'v₋',o.inTop[0]-24,o.inTop[1],P.bad,13); H.text(c,'v₊',o.inBot[0]-24,o.inBot[1],P.ok,13);
    H.line(c,o.out[0],o.out[1],o.out[0]+40,o.out[1],P.ink,2); H.text(c,'vs = '+f2(vs)+' V',o.out[0]+44,o.out[1]-14,Math.abs(vs)>=Vsat-0.01?P.bad:P.acc,14,'left',800);
    // caractéristique
    const bx=S.w*0.45, bw=S.w*0.5, by=20, bh=S.h-40; c.fillStyle=P.bg2; c.strokeStyle=P.line; c.fillRect(bx,by,bw,bh); c.strokeRect(bx,by,bw,bh);
    const X=e=>bx+bw/2+e/300*(bw/2-10), Y=v=>by+bh/2-v/15*(bh/2-10); H.line(c,bx+5,Y(0),bx+bw-5,Y(0),P.ink3,1); H.line(c,X(0),by+5,X(0),by+bh-5,P.ink3,1);
    c.strokeStyle=P.acc; c.lineWidth=3; c.beginPath(); for(let e=-300;e<=300;e+=1){ const v=Math.max(-Vsat,Math.min(Vsat,Av*e*1e-6)); e===-300?c.moveTo(X(e),Y(v)):c.lineTo(X(e),Y(v)); } c.stroke();
    H.line(c,bx+5,Y(Vsat),bx+bw-5,Y(Vsat),P.bad,1,[4,4]); H.line(c,bx+5,Y(-Vsat),bx+bw-5,Y(-Vsat),P.bad,1,[4,4]); H.text(c,'+Vsat',bx+bw-8,Y(Vsat)-9,P.bad,11,'right'); H.text(c,'−Vsat',bx+bw-8,Y(-Vsat)+10,P.bad,11,'right');
    c.fillStyle=P.e; c.beginPath(); c.arc(X(eps.v),Y(vs),6,0,7); c.fill(); H.text(c,'ε (µV)',bx+bw-8,Y(0)+12,P.ink3,11,'right'); H.text(c,'vs (V)',X(0)+6,by+12,P.ink3,11,'left');
    const lin=Vsat/Av*1e6; S.read(`vs = A·ε, saturée à ±${Vsat} V. Zone linéaire : |ε| < ${f2(lin)} µV seulement ! Dès que vs est fini (pas saturé), ε ≈ 0 : c’est pour ça qu’on écrit v₊ = v₋ en régime linéaire.`); }};
};

/* ---------- 2. Les montages linéaires ---------- */
A.aopmontage=S=>{
  const m=S.ui.choice([['suiv','Suiveur'],['inv','Inverseur'],['ninv','Non-inverseur'],['som','Sommateur'],['diff','Soustracteur']],'inv');
  const R1=S.ui.slider('R₁ (kΩ)',1,20,1,10,v=>v+' k'), R2=S.ui.slider('R₂ (kΩ)',1,100,1,20,v=>v+' k'), Ve=S.ui.slider('amplitude Ve (V)',0.1,8,0.1,2,v=>v.toFixed(1)+' V');
  return {draw(){ const c=S.ctx,P=S.P,t=S.t, Vcc=12; const r1=R1.v,r2=R2.v,a=Ve.v; const sh=c=>EL(); const E=EL();
    const ve1=tt=>a*Math.sin(2*Math.PI*(tt)), ve2=tt=>a*0.6*Math.sin(2*Math.PI*2*tt+1);
    let G,form,vs;
    if(m.v==='suiv'){ G=1; form='Vs = Ve'; vs=tt=>ve1(tt); }
    if(m.v==='inv'){ G=-r2/r1; form=`Vs = −(R₂/R₁)·Ve = ${f2(G)}·Ve`; vs=tt=>G*ve1(tt); }
    if(m.v==='ninv'){ G=1+r2/r1; form=`Vs = (1 + R₂/R₁)·Ve = ${f2(G)}·Ve`; vs=tt=>G*ve1(tt); }
    if(m.v==='som'){ form=`Vs = −R₂·(Ve₁/R₁ + Ve₂/R₁) (Rf = R₂)`; vs=tt=>-r2/r1*(ve1(tt)+ve2(tt)); }
    if(m.v==='diff'){ form=`Vs = (R₂/R₁)(Ve₂ − Ve₁) (R₃ = R₁, R₄ = R₂)`; vs=tt=>r2/r1*(ve2(tt)-ve1(tt)); }
    const clip=v=>Math.max(-Vcc,Math.min(Vcc,v));
    // schéma
    const sw=Math.min(S.w*0.46,360), ox=40, oy=S.h/2;
    const o=aop(c,ox+150,oy,46,P,true,m.v==='suiv'||m.v==='ninv'?false:false);
    const out=o.out; H.line(c,out[0],out[1],out[0]+40,out[1],P.ink,2); H.text(c,'Vs',out[0]+48,out[1],P.e,14,'left',800);
    if(m.v==='suiv'){ wire(c,[[ox,o.inBot[1]],o.inBot],P.ink); H.text(c,'Ve',ox-4,o.inBot[1],P.b,14,'right',800); wire(c,[o.inTop,[o.inTop[0]-20,o.inTop[1]],[o.inTop[0]-20,oy-80],[out[0]+20,oy-80],[out[0]+20,out[1]]],P.ink); }
    if(m.v==='inv'||m.v==='som'){ E.res(c,ox,o.inTop[1],o.inTop[0]-20,o.inTop[1],P.ink,'R₁'); wire(c,[[o.inTop[0]-20,o.inTop[1]],o.inTop],P.ink); H.text(c,'Ve'+(m.v==='som'?'₁':''),ox-4,o.inTop[1],P.b,14,'right',800);
      if(m.v==='som'){ E.res(c,ox,o.inTop[1]-50,o.inTop[0]-40,o.inTop[1]-50,P.ink,'R₁'); wire(c,[[o.inTop[0]-40,o.inTop[1]-50],[o.inTop[0]-20,o.inTop[1]-50],[o.inTop[0]-20,o.inTop[1]]],P.ink); H.text(c,'Ve₂',ox-4,o.inTop[1]-50,P.rem,14,'right',800); }
      wire(c,[[o.inTop[0]-20,o.inTop[1]],[o.inTop[0]-20,oy-95]],P.ink); E.res(c,o.inTop[0]-20,oy-95,out[0]+20,oy-95,P.ink,'R₂'); wire(c,[[out[0]+20,oy-95],[out[0]+20,out[1]]],P.ink);
      wire(c,[o.inBot,[o.inBot[0]-20,o.inBot[1]],[o.inBot[0]-20,oy+90]],P.ink); H.line(c,o.inBot[0]-32,oy+90,o.inBot[0]-8,oy+90,P.ink,2); H.text(c,'masse',o.inBot[0]-20,oy+104,P.ink3,11); }
    if(m.v==='ninv'){ wire(c,[[ox,o.inBot[1]],o.inBot],P.ink); H.text(c,'Ve',ox-4,o.inBot[1],P.b,14,'right',800); wire(c,[o.inTop,[o.inTop[0]-20,o.inTop[1]],[o.inTop[0]-20,oy-95]],P.ink); E.res(c,o.inTop[0]-20,oy-95,out[0]+20,oy-95,P.ink,'R₂'); wire(c,[[out[0]+20,oy-95],[out[0]+20,out[1]]],P.ink);
      wire(c,[[o.inTop[0]-20,oy-95],[ox+40,oy-95]],P.ink); E.res(c,ox+40,oy-95,ox+40,oy+90,P.ink,'R₁'); H.line(c,ox+28,oy+90,ox+52,oy+90,P.ink,2); }
    if(m.v==='diff'){ E.res(c,ox,o.inTop[1],o.inTop[0]-20,o.inTop[1],P.ink,'R₁'); wire(c,[[o.inTop[0]-20,o.inTop[1]],o.inTop],P.ink); H.text(c,'Ve₁',ox-4,o.inTop[1],P.b,14,'right',800);
      wire(c,[[o.inTop[0]-20,o.inTop[1]],[o.inTop[0]-20,oy-95]],P.ink); E.res(c,o.inTop[0]-20,oy-95,out[0]+20,oy-95,P.ink,'R₂'); wire(c,[[out[0]+20,oy-95],[out[0]+20,out[1]]],P.ink);
      E.res(c,ox,o.inBot[1],o.inBot[0]-20,o.inBot[1],P.ink,'R₁'); wire(c,[[o.inBot[0]-20,o.inBot[1]],o.inBot],P.ink); H.text(c,'Ve₂',ox-4,o.inBot[1],P.rem,14,'right',800); E.res(c,o.inBot[0]-20,o.inBot[1],o.inBot[0]-20,oy+95,P.ink,'R₂'); }
    // courbes
    const bx=Math.max(sw+60,S.w*0.5); const box={x:bx,y:16,w:S.w-bx-12,h:S.h-32}; const tt=x=>x*2+t*0.25;
    const fns=[{f:x=>ve1(tt(x)),col:P.b,lab:'Ve'+(m.v==='som'||m.v==='diff'?'₁':''),k:0},{f:x=>clip(vs(tt(x))),col:P.e,w:3,lab:'Vs',k:2}];
    if(m.v==='som'||m.v==='diff') fns.splice(1,0,{f:x=>ve2(tt(x)),col:P.rem,lab:'Ve₂',k:1});
    const Y=plot(c,P,box,fns,15); H.line(c,box.x+6,Y(Vcc),box.x+box.w-6,Y(Vcc),P.bad,1,[4,4]); H.line(c,box.x+6,Y(-Vcc),box.x+box.w-6,Y(-Vcc),P.bad,1,[4,4]); H.text(c,'±Vcc = ±12 V',box.x+10,Y(Vcc)-9,P.bad,11,'left');
    let mx=0; for(let k=0;k<=100;k++) mx=Math.max(mx,Math.abs(vs(k/50))); const sat=mx>Vcc;
    S.read(`${form}${sat?'   ⚠ SATURATION : la sortie ne peut pas dépasser ±12 V, elle est écrêtée.':''}${m.v==='ninv'?'   (gain toujours ≥ 1)':''}`); }};
};

/* ---------- 3. Intégrateur / dérivateur ---------- */
A.aopintdiff=S=>{
  const m=S.ui.choice([['int','Intégrateur'],['der','Dérivateur']],'int'), sig=S.ui.choice([['sq','créneau'],['tri','triangle'],['sin','sinus']],'sq'), k=S.ui.slider('1/RC (s⁻¹)',1,10,0.5,4,v=>v.toFixed(1));
  return {draw(){ const c=S.ctx,P=S.P,t=S.t; const T=1; const sq=x=>((x%T+T)%T)<T/2?1:-1, tri=x=>{const u=((x%T+T)%T)/T; return u<.5?4*u-1:3-4*u;}, sn=x=>Math.sin(2*Math.PI*x);
    const ve={sq,tri,sin:sn}[sig.v]; let vs;
    if(m.v==='int'){ // −(1/RC)∫ve, primitive numérique de moyenne nulle
      const N=400, cum=[0]; for(let i=1;i<=N;i++) cum.push(cum[i-1]+ve((i-.5)/N*T)*T/N); const mean=cum.reduce((s,v)=>s+v,0)/cum.length;
      vs=x=>{ const u=((x%T+T)%T)/T; return -k.v*(cum[Math.round(u*N)]-mean)*2; }; }
    else { const D={sq:x=>{ const u=((x%T+T)%T); const d=Math.min(Math.abs(u),Math.abs(u-T/2),Math.abs(u-T)); const s=Math.abs(u-T/2)<0.02?-1:1; return d<0.02?s*5:0; },tri:x=>{const u=((x%T+T)%T)/T; return u<.5?4:-4;},sin:x=>2*Math.PI*Math.cos(2*Math.PI*x)}[sig.v]; vs=x=>-D(x)/k.v; }
    const box={x:10,y:10,w:S.w-20,h:S.h-20}; plot(c,P,box,[{f:x=>2*ve(x*3+t*0.3),col:P.b,lab:'Ve',k:0},{f:x=>2*vs(x*3+t*0.3),col:P.e,w:3,lab:'Vs',k:1}],6);
    S.read(m.v==='int'?'Intégrateur Vs = −(1/RC)∫Ve dt : un créneau donne un triangle (une constante intégrée = une rampe), un sinus donne un cosinus. Le signe − vient de l’entrée inverseuse.':'Dérivateur Vs = −RC·dVe/dt : un triangle donne un créneau (pente constante), un créneau donne des pics à chaque front. Sensible au bruit : on l’utilise peu.'); }};
};

/* ---------- 4. Comparateurs (simple / hystérésis) ---------- */
A.comparator=S=>{
  const m=S.ui.choice([['simple','Comparateur simple'],['hyst','Hystérésis']],'simple'), noise=S.ui.slider('bruit',0,1.5,0.05,0.6,v=>v.toFixed(2)+' V'), Vr=S.ui.slider('Vref (V)',-3,3,0.1,0,v=>v.toFixed(1)), rr=S.ui.slider('R₁/R₂',0.05,0.6,0.01,0.25,v=>v.toFixed(2));
  let seed=[]; for(let i=0;i<600;i++) seed.push(Math.random()*2-1);
  return {draw(){ const c=S.ctx,P=S.P,t=S.t,Vcc=12; const ve=x=>4*Math.sin(2*Math.PI*x)+noise.v*seed[Math.floor(((x*150)%600+600)%600)];
    const a=rr.v; const VTp=(1+a)*Vr.v+a*Vcc, VTm=(1+a)*Vr.v-a*Vcc;
    const w=S.w*0.62; const box={x:10,y:10,w:w-20,h:S.h-20}; let st=-Vcc, n=0; const N=400, out=[];
    for(let i=0;i<=N;i++){ const x=i/N*2+t*0.15; const v=ve(x); let ns=st; if(m.v==='simple') ns=v>Vr.v?Vcc:-Vcc; else { if(st<0&&v>VTp) ns=Vcc; if(st>0&&v<VTm) ns=-Vcc; } if(i&&ns!==st) n++; st=ns; out.push(st); }
    const Y=plot(c,P,box,[{f:x=>ve(x*2+t*0.15),col:P.b,lab:'Ve',k:0},{f:x=>out[Math.round(x*N)]*0.4,col:P.e,w:3,lab:'Vs (÷2,5)',k:1}],8);
    if(m.v==='simple') H.line(c,box.x+6,Y(Vr.v),box.x+box.w-6,Y(Vr.v),P.acc,1.5,[5,4]); else { H.line(c,box.x+6,Y(VTp),box.x+box.w-6,Y(VTp),P.ok,1.5,[5,4]); H.line(c,box.x+6,Y(VTm),box.x+box.w-6,Y(VTm),P.bad,1.5,[5,4]); }
    // caractéristique
    const bx=w, bw=S.w-w-10, by=10, bh=S.h-20; c.fillStyle=P.bg2; c.strokeStyle=P.line; c.fillRect(bx,by,bw,bh); c.strokeRect(bx,by,bw,bh);
    const X=v=>bx+bw/2+v/8*(bw/2-8), YY=v=>by+bh/2-v/14*(bh/2-8); H.line(c,bx+4,YY(0),bx+bw-4,YY(0),P.ink3,1); H.line(c,X(0),by+4,X(0),by+bh-4,P.ink3,1);
    c.strokeStyle=P.acc; c.lineWidth=2.5; c.beginPath();
    if(m.v==='simple'){ c.moveTo(X(-8),YY(-Vcc)); c.lineTo(X(Vr.v),YY(-Vcc)); c.lineTo(X(Vr.v),YY(Vcc)); c.lineTo(X(8),YY(Vcc)); }
    else { c.moveTo(X(-8),YY(-Vcc)); c.lineTo(X(VTp),YY(-Vcc)); c.lineTo(X(VTp),YY(Vcc)); c.lineTo(X(8),YY(Vcc)); c.moveTo(X(8),YY(Vcc)); c.lineTo(X(VTm),YY(Vcc)); c.lineTo(X(VTm),YY(-Vcc)); c.lineTo(X(-8),YY(-Vcc)); }
    c.stroke(); H.text(c,'Vs(Ve)',bx+8,by+12,P.ink3,11,'left',600);
    S.read(m.v==='simple'?`Sans contre-réaction : Vs = +Vcc si Ve > Vref, −Vcc sinon. Avec du bruit autour de Vref, la sortie bascule ${n} fois au lieu de 2 par période !`:`Réaction POSITIVE (R₂ vers V₊) : deux seuils VT+ = ${f2(VTp)} V et VT− = ${f2(VTm)} V (écart 2·(R₁/R₂)·Vcc). Le bruit plus petit que l’écart ne fait plus basculer : ${n} basculements.`); }};
};

/* ---------- 5. Gain × bande passante ---------- */
A.gbw=S=>{
  const G=S.ui.slider('gain du montage G',1,10000,1,100,v=>v);
  return {always:false,draw(){ const c=S.ctx,P=S.P; const GBW=2e6, f0=20; const bx=50,by=16,bw=S.w-70,bh=S.h-50;
    const X=lf=>bx+(lf-0)/7*bw, Y=db=>by+bh-(db+10)/(120)*bh; c.fillStyle=P.bg2; c.strokeStyle=P.line; c.fillRect(bx,by,bw,bh); c.strokeRect(bx,by,bw,bh);
    for(let k=0;k<=7;k++){ H.line(c,X(k),by,X(k),by+bh,P.line,1); H.text(c,['1','10','100','1k','10k','100k','1M','10M'][k]+' Hz',X(k),by+bh+12,P.ink3,10.5); }
    for(let d=0;d<=100;d+=20){ H.text(c,d+' dB',bx-6,Y(d),P.ink3,10.5,'right'); }
    const A0=GBW/f0, Adb=lf=>20*Math.log10(A0/Math.sqrt(1+(10**lf/f0)**2));
    c.strokeStyle=P.ink2; c.lineWidth=2.5; c.beginPath(); for(let i=0;i<=300;i++){ const lf=7*i/300; i?c.lineTo(X(lf),Y(Adb(lf))):c.moveTo(X(lf),Y(Adb(lf))); } c.stroke(); H.text(c,'A(f) de l’AOP (boucle ouverte)',X(4.6),Y(Adb(4.6))-14,P.ink2,12,'left',700);
    const gdb=20*Math.log10(G.v), BW=GBW/G.v; H.line(c,X(0),Y(gdb),X(Math.log10(BW)),Y(gdb),P.acc,3); c.strokeStyle=P.acc; c.lineWidth=3; c.beginPath(); for(let i=0;i<=100;i++){ const lf=Math.log10(BW)+i/100*(7-Math.log10(BW)); i?c.lineTo(X(lf),Y(Adb(lf))):c.moveTo(X(lf),Y(Adb(lf))); } c.stroke();
    H.line(c,X(Math.log10(BW)),Y(gdb),X(Math.log10(BW)),by+bh,P.e,1.5,[4,4]); H.text(c,'BW',X(Math.log10(BW)),by+bh-10,P.e,12,'center',800);
    S.read(`Le montage garde son gain G = ${G.v} (${f2(gdb)} dB) tant que A(f) ≫ G. Au-delà, il suit la courbe de l’AOP. G × BW = GBW = 2 MHz ⇒ BW = ${BW>=1e6?(BW/1e6).toFixed(2)+' MHz':BW>=1e3?(BW/1e3).toFixed(1)+' kHz':BW.toFixed(0)+' Hz'}. Plus de gain = moins de bande passante.`); }};
};

/* ---------- 6. Slew rate ---------- */
A.slew=S=>{
  const f=S.ui.slider('fréquence (kHz)',1,100,1,20,v=>v+' kHz'), Am=S.ui.slider('amplitude (V)',0.5,10,0.5,5,v=>v+' V');
  return {draw(){ const c=S.ctx,P=S.P,SR=0.9e6; const fr=f.v*1e3, a=Am.v; const need=2*Math.PI*fr*a; const N=600, T=2/fr; let y=0; const ideal=[],real=[];
    for(let i=0;i<=N;i++){ const tt=i/N*T; const v=a*Math.sin(2*Math.PI*fr*tt); ideal.push(v); const dt=T/N; const d=v-y; const mx=SR*dt; y+=Math.max(-mx,Math.min(mx,d)); real.push(y); }
    const box={x:10,y:10,w:S.w-20,h:S.h-20}; plot(c,P,box,[{f:x=>ideal[Math.round(x*N)],col:P.b,lab:'sortie idéale',k:0,dash:[5,4]},{f:x=>real[Math.round(x*N)],col:P.e,w:3,lab:'sortie réelle',k:1}],11);
    S.read(`Pente maximale demandée : 2πfA = ${(need/1e6).toFixed(2).replace('.',',')} V/µs ; slew rate de l’AOP : 0,9 V/µs (MCP6271). ${need>SR?'⚠ Trop rapide : la sortie ne suit plus, le sinus devient un TRIANGLE.':'OK : la sortie suit.'}`); }};
};
})();
