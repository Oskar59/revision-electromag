/* ============ Animations : Électronique analogique ============ */
(function(){
const A=window.EM_A, H=window.EM_H;
const cx2=(re,im)=>({re,im}), cmul=(a,b)=>cx2(a.re*b.re-a.im*b.im,a.re*b.im+a.im*b.re), cdiv=(a,b)=>{const d=b.re*b.re+b.im*b.im;return cx2((a.re*b.re+a.im*b.im)/d,(a.im*b.re-a.re*b.im)/d);}, cabs=a=>Math.hypot(a.re,a.im), carg=a=>Math.atan2(a.im,a.re);
/* --- composants de circuit --- */
function res(c,x1,y1,x2,y2,col,lab){ const dx=x2-x1,dy=y2-y1,L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L,w=Math.min(46,L*0.5),h=12; const mx=(x1+x2)/2,my=(y1+y2)/2;
  H.line(c,x1,y1,mx-ux*w/2,my-uy*w/2,col,2); H.line(c,mx+ux*w/2,my+uy*w/2,x2,y2,col,2);
  c.save(); c.translate(mx,my); c.rotate(Math.atan2(dy,dx)); c.fillStyle=H.rgba(col,0.08); c.strokeStyle=col; c.lineWidth=2; c.fillRect(-w/2,-h/2,w,h); c.strokeRect(-w/2,-h/2,w,h); c.restore();
  if(lab) H.text(c,lab,mx-uy*20,my+ux*20,col,12.5,'center',700); }
function cap(c,x1,y1,x2,y2,col,lab){ const dx=x2-x1,dy=y2-y1,L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L,mx=(x1+x2)/2,my=(y1+y2)/2,g=5;
  H.line(c,x1,y1,mx-ux*g,my-uy*g,col,2); H.line(c,mx+ux*g,my+uy*g,x2,y2,col,2);
  [-1,1].forEach(s=>H.line(c,mx+ux*g*s-uy*14,my+uy*g*s+ux*14,mx+ux*g*s+uy*14,my+uy*g*s-ux*14,col,3));
  if(lab) H.text(c,lab,mx-uy*26,my+ux*26,col,12.5,'center',700); }
function ind(c,x1,y1,x2,y2,col,lab){ const dx=x2-x1,dy=y2-y1,L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L,mx=(x1+x2)/2,my=(y1+y2)/2,w=Math.min(48,L*0.6);
  H.line(c,x1,y1,mx-ux*w/2,my-uy*w/2,col,2); H.line(c,mx+ux*w/2,my+uy*w/2,x2,y2,col,2);
  c.save(); c.translate(mx,my); c.rotate(Math.atan2(dy,dx)); c.strokeStyle=col; c.lineWidth=2; c.beginPath(); for(let k=0;k<4;k++) c.arc(-w/2+w/8+k*w/4,0,w/8,Math.PI,0); c.stroke(); c.restore();
  if(lab) H.text(c,lab,mx-uy*22,my+ux*22,col,12.5,'center',700); }
function vsrc(c,x,y1,y2,col,lab){ const my=(y1+y2)/2; H.line(c,x,y1,x,my-16,col,2); H.line(c,x,my+16,x,y2,col,2); c.strokeStyle=col; c.lineWidth=2; c.beginPath(); c.arc(x,my,16,0,7); c.stroke(); H.line(c,x,my-16,x,my+16,col,1.5); H.arrow(c,x-26,my+14,x-26,my-14,col,1.5,6); if(lab) H.text(c,lab,x-32,my,col,12.5,'right',700); }
window.EM_EL={res,cap,ind,vsrc};

/* ---------- Diviseur de tension ---------- */
A.divider = S=>{
  const E=S.ui.slider('E (V)',1,20,0.5,10,v=>v+' V'), R1=S.ui.slider('R₁ (kΩ)',0.5,20,0.5,3,v=>v+' k'), R2=S.ui.slider('R₂ (kΩ)',0.5,20,0.5,7,v=>v+' k');
  const ch=S.ui.check(' brancher une charge R_L',false), RL=S.ui.slider('R_L (kΩ)',0.5,50,0.5,7,v=>v+' k');
  return {always:false,draw(){
    const c=S.ctx,P=S.P,x0=60,x1=Math.min(S.w*0.55,330),y0=50,y1=S.h-50; const R2e=ch.v?R2.v*RL.v/(R2.v+RL.v):R2.v; const I=E.v/(R1.v+R2e), U2=I*R2e, U1=I*R1.v;
    vsrc(c,x0,y0,y1,P.ink,'E'); res(c,x0,y0,x1,y0,P.e,'R₁'); res(c,x1,y0,x1,y1,P.acc,'R₂'); H.line(c,x0,y1,x1,y1,P.ink,2);
    if(ch.v){ H.line(c,x1,y0,x1+70,y0,P.ink,2); res(c,x1+70,y0,x1+70,y1,P.rem,'R_L'); H.line(c,x1,y1,x1+70,y1,P.ink,2); }
    H.arrow(c,x1-30,y1-10,x1-30,y0+20,P.acc,1.6,7); H.text(c,'U₂',x1-36,(y0+y1)/2,P.acc,13,'right',700);
    const bx=S.w*0.72,bw=40,bt=40,bb=S.h-40,sc=(bb-bt)/E.v;
    c.fillStyle=H.rgba(P.e,0.75); c.fillRect(bx,bt,bw,U1*sc); c.fillStyle=H.rgba(P.acc,0.75); c.fillRect(bx,bt+U1*sc,bw,U2*sc);
    H.text(c,'U₁ = '+U1.toFixed(2)+' V',bx+bw+8,bt+U1*sc/2,P.e,12.5,'left',700); H.text(c,'U₂ = '+U2.toFixed(2)+' V',bx+bw+8,bt+U1*sc+U2*sc/2,P.acc,12.5,'left',700); H.text(c,'E',bx+bw/2,bt-12,P.ink,13,'center',700);
    S.read(`I = E/(R₁+R₂) = ${(I).toFixed(3)} mA   U₂ = E·R₂/(R₁+R₂) = ${U2.toFixed(2)} V\n${ch.v?`Avec la charge : R₂ devient R₂∥R_L = ${R2e.toFixed(2)} kΩ → U₂ chute ! La formule du diviseur n'est valable que si AUCUN courant ne sort au point milieu.`:'La tension se partage proportionnellement aux résistances (même courant dans les deux).'}`);
  }};
};

/* ---------- Thévenin : caractéristique et point de fonctionnement ---------- */
A.thevenin = S=>{
  const Eth=S.ui.slider('E_th (V)',1,20,0.5,10,v=>v+' V'), Rth=S.ui.slider('R_th (Ω)',1,100,1,20,v=>v+' Ω'), RL=S.ui.slider('charge R_L (Ω)',1,200,1,40,v=>v+' Ω');
  return {always:false,draw(){
    const c=S.ctx,P=S.P,In=Eth.v/Rth.v, I=Eth.v/(Rth.v+RL.v), U=RL.v*I;
    const box={x:12,y:10,w:S.w*0.58,h:S.h-20}; const Im=Math.max(In,0.05)*1.1, Um=Eth.v*1.15;
    const p=H.plot(c,P,box,i=>Eth.v-Rth.v*i,{xmin:0,xmax:Im,ymin:0,ymax:Um,col:P.acc,yl:'U (V) — caractéristique U = E_th − R_th·I',xl:'I (A)'});
    c.strokeStyle=P.rem; c.lineWidth=2; c.setLineDash([6,4]); c.beginPath(); c.moveTo(p.X(0),p.Y(0)); const ie=Math.min(Im,Um/RL.v); c.lineTo(p.X(ie),p.Y(RL.v*ie)); c.stroke(); c.setLineDash([]);
    c.fillStyle=P.ok; c.beginPath(); c.arc(p.X(I),p.Y(U),6,0,7); c.fill();
    H.text(c,'E_th (à vide)',p.X(0)+8,p.Y(Eth.v)-10,P.acc,12,'left',700); if(In<Im) H.text(c,'I_N = E_th/R_th',p.X(In)-4,p.Y(0)-12,P.acc,12,'right',700);
    const bx=S.w*0.64; H.text(c,'Modèle de Thévenin',bx,30,P.ink,13,'left',800); H.text(c,`E_th = ${Eth.v} V en série avec R_th = ${Rth.v} Ω`,bx,50,P.ink2,12);
    H.text(c,'Modèle de Norton',bx,84,P.ink,13,'left',800); H.text(c,`I_N = ${In.toFixed(3)} A en // avec R_N = ${Rth.v} Ω`,bx,104,P.ink2,12);
    H.text(c,'Point de fonctionnement',bx,140,P.ok,13,'left',800); H.text(c,`I = ${I.toFixed(3)} A, U = ${U.toFixed(2)} V`,bx,160,P.ink2,12); H.text(c,`P(R_L) = ${(U*I).toFixed(3)} W`,bx,180,P.ink2,12);
    H.text(c,`P max si R_L = R_th : ${(Eth.v*Eth.v/(4*Rth.v)).toFixed(3)} W`,bx,200,P.ink3,11.5);
    S.read('Une source réelle = droite U(I) : ordonnée à l’origine = tension à vide E_th, abscisse = courant de court-circuit I_N, pente = −R_th.\nLe point vert est l’intersection avec la droite de charge U = R_L·I. Thévenin et Norton donnent EXACTEMENT la même droite.');
  }};
};

/* ---------- Charge / décharge RC et RL ---------- */
A.rcrl = S=>{
  const md=S.ui.choice([['rc','Circuit RC'],['rl','Circuit RL']],'rc'), ph=S.ui.choice([['on','Charge / établissement'],['off','Décharge / extinction']],'on');
  const Rs=S.ui.slider('R (Ω)',10,500,10,100,v=>v+' Ω'), Xs=S.ui.slider('C (µF) ou L (mH)',10,500,10,100,v=>v);
  let t=0; S.ui.button('↺ Rejouer',()=>{t=0;}); [md,ph].forEach(o=>o.onchange=()=>{t=0;}); Rs.onchange=()=>{t=0;}; Xs.onchange=()=>{t=0;};
  const E=6;
  return {draw(dt){
    const c=S.ctx,P=S.P,rc=md.v==='rc',on=ph.v==='on'; const tau= rc? Rs.v*Xs.v*1e-6 : Xs.v*1e-3/Rs.v; const tmax=6*tau; t=Math.min(t+dt*tmax/4,tmax);
    const ex=on?(s=>1-Math.exp(-s/tau)):(s=>Math.exp(-s/tau));
    // grandeur « lente » (continue) et grandeur « rapide » (discontinue)
    const slow= rc? (s=>E*ex(s)) : (s=>E/Rs.v*ex(s)*1000); // uC en V, ou iL en mA
    const fast= rc? (s=>(on?1:-1)*E/Rs.v*Math.exp(-s/tau)*1000) : (s=>(on?1:-1)*E*Math.exp(-s/tau)); // iC en mA, uL en V
    const hh=(S.h-24)/2, sm=rc?E:E/Rs.v*1000, fm=rc?E/Rs.v*1000:E;
    const p1=H.plot(c,P,{x:12,y:8,w:S.w-24,h:hh},s=>s<=t?slow(s):NaN,{xmin:0,xmax:tmax,ymin:0,ymax:sm*1.15,col:rc?P.e:P.b,yl:rc?'u_C(t) en V — continue (pas de saut)':'i_L(t) en mA — continue (pas de saut)',xl:'t',marks:[1,3,5].map(k=>({x:k*tau,t:k+'τ'}))});
    if(t>0){ c.strokeStyle=P.ink3; c.lineWidth=1.2; c.setLineDash([4,4]); c.beginPath(); if(on){c.moveTo(p1.X(0),p1.Y(0)); c.lineTo(p1.X(tau),p1.Y(sm));} else {c.moveTo(p1.X(0),p1.Y(sm)); c.lineTo(p1.X(tau),p1.Y(0));} c.stroke(); c.setLineDash([]); H.line(c,p1.X(0),p1.Y(on?sm:0),p1.X(tmax),p1.Y(on?sm:0),H.rgba(P.ink3,0.6),1,[2,4]); }
    H.plot(c,P,{x:12,y:16+hh,w:S.w-24,h:hh},s=>s<=t?fast(s):NaN,{xmin:0,xmax:tmax,ymin:-fm*1.15,ymax:fm*1.15,col:rc?P.acc:P.rem,yl:rc?'i(t) en mA — saute à t = 0':'u_L(t) en V — saute à t = 0',xl:'t',marks:[1,3,5].map(k=>({x:k*tau,t:k+'τ'}))});
    S.read(`τ = ${rc?'RC':'L/R'} = ${(tau*1000).toFixed(2)} ms.  À t = τ : ${on?'63 %':'37 %'} de la valeur finale ; à 5τ : régime permanent atteint à 99 %.\nLa tangente à l’origine (tirets) coupe l’asymptote en t = τ. ${rc?'Un condensateur interdit les sauts de TENSION':'Une bobine interdit les sauts de COURANT'} → c’est la condition initiale.`);
  }};
};

/* ---------- RLC série : les trois régimes ---------- */
A.rlc = S=>{
  const Rs=S.ui.slider('R (Ω)',1,400,1,20,v=>v+' Ω'); const L=0.05, C=2e-6, E=10; // ω0 = 3162 rad/s ; Rc = 2√(L/C) = 316 Ω
  return {always:false,draw(){
    const c=S.ctx,P=S.P,R=Rs.v,w0=1/Math.sqrt(L*C),lam=R/(2*L),Q=Math.sqrt(L/C)/R; let f,reg;
    if(lam<w0*0.999){ const w=Math.sqrt(w0*w0-lam*lam); f=t=>E*Math.exp(-lam*t)*(Math.cos(w*t)+lam/w*Math.sin(w*t)); reg='pseudo-périodique (Q > 1/2)'; }
    else if(lam>w0*1.001){ const d=Math.sqrt(lam*lam-w0*w0),r1=-lam+d,r2=-lam-d; f=t=>E*(r1*Math.exp(r2*t)-r2*Math.exp(r1*t))/(r1-r2); reg='apériodique (Q < 1/2)'; }
    else { f=t=>E*(1+lam*t)*Math.exp(-lam*t); reg='critique (Q = 1/2) — retour le plus rapide sans oscillation'; }
    const tm=0.012, W=S.w*0.68;
    H.plot(c,P,{x:12,y:10,w:W,h:S.h-20},[{f:t=>E*Math.exp(-lam*t),col:H.rgba(P.ink3,0.7)},{f:t=>-E*Math.exp(-lam*t),col:H.rgba(P.ink3,0.7)},{f,col:P.e}],{xmin:0,xmax:tm,ymin:-E*1.1,ymax:E*1.1,yl:'u_C(t) — décharge depuis E, enveloppe e^(−λt)',xl:'t (12 ms)'});
    // plan complexe des racines
    const px=W+20,pw=S.w-px-12,py=20,ph=S.h-40,ox=px+pw*0.75,oy=py+ph/2,sc=pw*0.6/(Math.max(lam,w0)*1.6+1);
    c.strokeStyle=P.line; c.strokeRect(px,py,pw,ph); H.line(c,px,oy,px+pw,oy,P.ink3,1); H.line(c,ox,py,ox,py+ph,P.ink3,1);
    c.strokeStyle=H.rgba(P.ink3,0.5); c.setLineDash([3,3]); c.beginPath(); c.arc(ox,oy,w0*sc,Math.PI/2,3*Math.PI/2); c.stroke(); c.setLineDash([]);
    let roots; if(lam<w0){const w=Math.sqrt(w0*w0-lam*lam); roots=[[-lam,w],[-lam,-w]];} else {const d=Math.sqrt(lam*lam-w0*w0); roots=[[-lam+d,0],[-lam-d,0]];}
    roots.forEach(r=>{ const x=ox+r[0]*sc,y=oy-r[1]*sc; if(x<px)return; c.strokeStyle=P.e; c.lineWidth=2.5; c.beginPath(); c.moveTo(x-6,y-6); c.lineTo(x+6,y+6); c.moveTo(x+6,y-6); c.lineTo(x-6,y+6); c.stroke(); });
    H.text(c,'racines r₁, r₂',px+6,py+12,P.ink2,11.5,'left',700); H.text(c,'Re',px+pw-16,oy-10,P.ink3,11); H.text(c,'Im',ox+6,py+12,P.ink3,11); H.text(c,'cercle |r| = ω₀',px+6,py+ph-10,P.ink3,10.5);
    S.read(`λ = R/2L = ${lam.toFixed(0)} s⁻¹   ω₀ = 1/√(LC) = ${w0.toFixed(0)} rad/s   Q = (1/R)√(L/C) = ${Q.toFixed(2)}   → régime ${reg}\nR critique = 2√(L/C) = ${(2*Math.sqrt(L/C)).toFixed(0)} Ω. Baisse R : les racines deviennent complexes (−λ ± jω) et ça oscille.`);
  }};
};

/* ---------- Phaseurs (représentation de Fresnel / complexe) ---------- */
A.phasor = S=>{
  const A2=S.ui.slider('amplitude de v₂',0.2,1,0.05,0.8,v=>v.toFixed(2)), ph=S.ui.slider('déphasage φ de v₂ (°)',-180,180,5,-45,v=>v+'°'); const sum=S.ui.check(' somme v₁ + v₂',false); S.ui.play();
  return {draw(){
    const c=S.ctx,P=S.P,R=Math.min(S.h*0.38,S.w*0.18),ox=R+30,oy=S.h/2,w=1.6,t=S.t,phi=ph.v*Math.PI/180;
    c.strokeStyle=P.line; c.beginPath(); c.arc(ox,oy,R,0,7); c.stroke(); H.line(c,ox-R-10,oy,ox+R+10,oy,P.ink3,1); H.line(c,ox,oy-R-10,ox,oy+R+10,P.ink3,1);
    H.text(c,'Re',ox+R+12,oy-10,P.ink3,11); H.text(c,'Im',ox+6,oy-R-8,P.ink3,11);
    const v1={re:Math.cos(w*t),im:Math.sin(w*t)}, v2={re:A2.v*Math.cos(w*t+phi),im:A2.v*Math.sin(w*t+phi)};
    const gx=ox+R+40, gw=S.w-gx-12; const T=2*Math.PI/w, span=2*T;
    const X=s=>gx+gw*(1-s/span), Y=v=>oy-v*R;   // le temps passé défile vers la droite ; le présent est à gauche (x = gx)
    H.line(c,gx,oy,gx+gw,oy,P.ink3,1);
    const draw=(fn,col)=>{c.strokeStyle=col;c.lineWidth=2.2;c.beginPath();for(let k=0;k<=200;k++){const s=span*k/200;const y=fn(t-s);k?c.lineTo(X(s),Y(y)):c.moveTo(X(s),Y(y));}c.stroke();};
    draw(u=>Math.sin(w*u),P.e); draw(u=>A2.v*Math.sin(w*u+phi),P.b); if(sum.v) draw(u=>Math.sin(w*u)+A2.v*Math.sin(w*u+phi),P.ok);
    // projections : on lit Re(·) sur l'axe horizontal, on la reporte verticalement sur le graphe (rotation de 90° pour la lisibilité)
    const pj=(z,col)=>{ const x=ox+z.re*R, y=oy-z.im*R; H.arrow(c,ox,oy,x,y,col,3,10); H.line(c,x,y,gx,y,H.rgba(col,0.45),1,[3,3]); };
    pj(v1,P.e); pj(v2,P.b); if(sum.v) pj({re:v1.re+v2.re,im:v1.im+v2.im},P.ok);
    H.text(c,'v₁',gx+gw-20,22,P.e,13,'right',800); H.text(c,'v₂',gx+gw-20,40,P.b,13,'right',800);
    S.read(`Un signal sinusoïdal = la PROJECTION d’un vecteur qui tourne à la vitesse angulaire ω (tirets). Amplitude = longueur, phase = angle à t = 0.\nv₂ = ${A2.v.toFixed(2)}·sin(ωt ${ph.v>=0?'+':'−'} ${Math.abs(ph.v)}°) : v₂ est ${ph.v<0?'EN RETARD':(ph.v>0?'EN AVANCE':'en phase')} sur v₁. ${sum.v?'La somme de deux sinusoïdes de même ω = somme des vecteurs : c’est tout l’intérêt des complexes.':''}`);
  }};
};

/* ---------- Bode interactif ---------- */
const FILTERS={
  pb1:{n:'Passe-bas 1ᵉʳ ordre (RC, sortie sur C)',H:(x)=>cdiv(cx2(1,0),cx2(1,x)),as:x=>x<1?0:-20*Math.log10(x),ap:x=>x<1?0:-90},
  ph1:{n:'Passe-haut 1ᵉʳ ordre (RL, sortie sur L)',H:(x)=>cdiv(cx2(0,x),cx2(1,x)),as:x=>x<1?20*Math.log10(x):0,ap:x=>x<1?90:0},
  pbd:{n:'Passe-bande 2ᵈ ordre (R + L∥C)',H:(x,Q)=>cdiv(cx2(1,0),cx2(1,Q*(x-1/x))),as:(x,Q)=>x<1?20*Math.log10(x/Q):-20*Math.log10(x*Q),ap:x=>x<1?90:-90},
  pb2:{n:'Passe-bas 2ᵈ ordre (RLC, sortie sur C)',H:(x,Q)=>cdiv(cx2(1,0),cx2(1-x*x,x/Q)),as:x=>x<1?0:-40*Math.log10(x),ap:x=>x<1?0:-180},
  wien:{n:'Pont de Wien (H₀ = 1/3, Q = 1/3)',H:(x)=>cdiv(cx2(1/3,0),cx2(1,(x-1/x)/3)),as:x=>x<1?20*Math.log10(x):-20*Math.log10(x),ap:x=>x<1?90:-90},
};
A.bode = S=>{
  const ft=S.ui.choice(Object.entries(FILTERS).map(([k,v])=>[k,v.n.split(' (')[0]]),'pb1'); const Qs=S.ui.slider('Q (2ᵈ ordre)',0.2,10,0.1,1,v=>v.toFixed(1)); const xs=S.ui.slider('fréquence réduite x = ω/ω₀',-2,2,0.01,0,v=>'x = '+(10**v).toFixed(2));
  return {always:false,draw(){
    const c=S.ctx,P=S.P,F=FILTERS[ft.v],Q=Qs.v,W=S.w*0.64,hh=(S.h-24)/2; const Hf=x=>F.H(x,Q);
    const g=lx=>20*Math.log10(cabs(Hf(10**lx))), p=lx=>carg(Hf(10**lx))*180/Math.PI;
    const gmax=Math.max(...Array.from({length:81},(_,i)=>g(-2+i*0.05)));
    const pg=H.plot(c,P,{x:12,y:8,w:W,h:hh},[{f:lx=>F.as(10**lx,Q),col:H.rgba(P.ink3,0.8)},{f:g,col:P.acc}],{xmin:-2,xmax:2,ymin:-45,ymax:Math.max(6,gmax+6),yl:'G_dB = 20 log|H| (gris : asymptotes)',xl:'log x',marker:xs.v});
    H.line(c,pg.X(-2),pg.Y(gmax-3),pg.X(2),pg.Y(gmax-3),H.rgba(P.rem,0.8),1,[5,4]); H.text(c,'−3 dB',pg.X(2)-4,pg.Y(gmax-3)-8,P.rem,11,'right',700);
    H.plot(c,P,{x:12,y:16+hh,w:W,h:hh},[{f:lx=>F.ap(10**lx),col:H.rgba(P.ink3,0.8)},{f:p,col:P.e}],{xmin:-2,xmax:2,ymin:-190,ymax:100,yl:'φ (°) = arg H',xl:'log x',marker:xs.v});
    // signaux temporels au point choisi
    const x=10**xs.v, Hx=Hf(x), G=cabs(Hx), phi=carg(Hx), bx=W+24, bw=S.w-bx-10, by=S.h*0.25, A=S.h*0.16;
    H.text(c,'Entrée / sortie à x = '+x.toFixed(2),bx,22,P.ink,12.5,'left',800);
    c.strokeStyle=P.line; c.strokeRect(bx,by-A-10,bw,2*A+20); H.line(c,bx,by,bx+bw,by,P.ink3,1);
    const tr=(amp,ph0,col)=>{c.strokeStyle=col;c.lineWidth=2;c.beginPath();for(let k=0;k<=120;k++){const th=k/120*4*Math.PI;const y=by-A*amp*Math.cos(th+ph0);k?c.lineTo(bx+k/120*bw,y):c.moveTo(bx,y);}c.stroke();};
    tr(1,0,H.rgba(P.ink2,0.8)); tr(Math.min(G,1.5),phi,P.acc);
    H.text(c,'v_e',bx+6,by+A+26,P.ink2,12,'left',700); H.text(c,'v_s',bx+46,by+A+26,P.acc,12,'left',700);
    H.text(c,`G = ${G.toFixed(3)} (${(20*Math.log10(G)).toFixed(1)} dB)`,bx,by+A+50,P.ink,12.5,'left',600); H.text(c,`φ = ${(phi*180/Math.PI).toFixed(1)}°`,bx,by+A+70,P.ink,12.5,'left',600);
    S.read(`${F.n}.  Pentes asymptotiques : ${ft.v==='pb1'?'0 puis −20 dB/déc':ft.v==='ph1'?'+20 puis 0 dB/déc':ft.v==='pb2'?'0 puis −40 dB/déc (résonance si Q > 0,7)':'+20 puis −20 dB/déc'}.\nBouge x : en BF/HF le gain suit les droites grises ; près de x = 1 la vraie courbe s’en écarte (−3 dB pour un 1ᵉʳ ordre).`);
  }};
};

/* ---------- Signal créneau à travers un filtre (séries de Fourier) ---------- */
A.square = S=>{
  const ft=S.ui.choice([['pb1','Passe-bas'],['ph1','Passe-haut'],['pbd','Passe-bande (Q=14)']],'pb1'); const xs=S.ui.slider('fréquence du créneau f / f₀',-1.5,1.5,0.01,0,v=>(10**v).toFixed(2)+' f₀');
  return {always:false,draw(){
    const c=S.ctx,P=S.P,x=10**xs.v,F=FILTERS[ft.v]; const out=th=>{let s=0;for(let n=1;n<=79;n+=2){const Hn=F.H(n*x,14);s+=4/(Math.PI*n)*cabs(Hn)*Math.sin(n*th+carg(Hn));}return s;};
    const inp=th=>((th%(2*Math.PI))+2*Math.PI)%(2*Math.PI)<Math.PI?1:-1;
    let mx=0; for(let k=0;k<=200;k++) mx=Math.max(mx,Math.abs(out(k/200*4*Math.PI)));
    const sc=mx<0.25?Math.min(1/mx,40):1;
    H.plot(c,P,{x:12,y:10,w:S.w-24,h:S.h-20},[{f:th=>inp(th),col:H.rgba(P.ink3,0.8)},{f:th=>out(th)*sc,col:P.acc}],{xmin:0,xmax:4*Math.PI,ymin:-1.6,ymax:1.6,yl:'gris : créneau d’entrée ±U   violet : sortie'+(sc>1?` (zoomée ×${sc.toFixed(0)})`:''),xl:'t'});
    const msg = ft.v==='pb1'? (x>4?'f ≫ f₀ : le passe-bas INTÈGRE → sortie triangulaire de faible amplitude.':(x<0.2?'f ≪ f₀ : le créneau passe presque intact (arrondi des fronts).':'Zone intermédiaire : charges/décharges exponentielles.'))
      : ft.v==='ph1'? (x<0.25?'f ≪ f₀ : le passe-haut DÉRIVE → impulsions aux fronts.':(x>5?'f ≫ f₀ : le créneau passe (palier légèrement incliné).':'Zone intermédiaire : fronts transmis, paliers qui décroissent.'))
      : (Math.abs(x-1)<0.03?'f = f₀ : le filtre sélectif ne garde QUE le fondamental → sinusoïde d’amplitude 4U/π.':(Math.abs(x-1/3)<0.02?'f = f₀/3 : c’est l’harmonique 3 qui tombe sur f₀ → sinusoïde à 3f, amplitude 4U/3π.':'Hors résonance : presque rien ne passe (sortie zoomée).'));
    S.read(`Un créneau = somme de sinusoïdes : (4U/π)[sin ωt + sin 3ωt/3 + sin 5ωt/5 + …]. Le filtre traite chaque harmonique avec son propre gain et déphasage.\n${msg}`);
  }};
};

/* ---------- |Z| de R, L, C en fonction de la fréquence ---------- */
A.zfreq = S=>{
  const fs=S.ui.slider('fréquence f',0,6,0.01,3,v=>{const f=10**v;return f>=1000?(f/1000).toFixed(f>=1e5?0:1)+' kHz':f.toFixed(0)+' Hz';});
  const R=100,L=0.01,C=1e-6;
  return {always:false,draw(){
    const c=S.ctx,P=S.P,lz=lf=>({r:Math.log10(R),l:Math.log10(2*Math.PI*10**lf*L),c:-Math.log10(2*Math.PI*10**lf*C)});
    H.plot(c,P,{x:12,y:10,w:S.w*0.66,h:S.h-20},[{f:lf=>lz(lf).r,col:P.ink2},{f:lf=>lz(lf).l,col:P.b},{f:lf=>lz(lf).c,col:P.e}],{xmin:0,xmax:6,ymin:-2,ymax:6,yl:'log₁₀|Z| (Ω)',xl:'log₁₀ f',marker:fs.v});
    const f=10**fs.v, zl=2*Math.PI*f*L, zc=1/(2*Math.PI*f*C), bx=S.w*0.7;
    const row=(y,col,t1,t2)=>{H.text(c,t1,bx,y,col,13,'left',800);H.text(c,t2,bx,y+18,P.ink2,12);};
    row(30,P.ink2,'R = 100 Ω','|Z_R| = R, indépendant de f');
    row(80,P.b,'L = 10 mH',`|Z_L| = Lω = ${H.fmt(zl,1)} Ω`); row(130,P.e,'C = 1 µF',`|Z_C| = 1/Cω = ${H.fmt(zc,1)} Ω`);
    H.text(c,zc>10*R?'→ C ≈ circuit OUVERT':(zc<R/10?'→ C ≈ FIL (court-circuit)':'→ C : ni l’un ni l’autre'),bx,190,P.e,12.5,'left',700);
    H.text(c,zl<R/10?'→ L ≈ FIL (court-circuit)':(zl>10*R?'→ L ≈ circuit OUVERT':'→ L : ni l’un ni l’autre'),bx,212,P.b,12.5,'left',700);
    S.read('LE réflexe pour deviner un filtre sans calcul : en BF (ω → 0) une bobine est un fil et un condensateur un interrupteur ouvert ; en HF c’est l’inverse.\nRemplace-les dans le schéma : si la sortie vaut l’entrée → ça passe, si la sortie est court-circuitée ou coupée → ça bloque.');
  }};
};
})();
