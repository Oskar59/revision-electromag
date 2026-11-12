/* ============ Animations « images mentales » : hydraulique, paysage, équations universelles ============ */
(function(){
const A=window.EM_A, H=window.EM_H; if(!A) return;

/* ---------- Le circuit hydraulique ---------- */
A.hydro = S=>{
  const md=S.ui.choice([['R','Résistance seule'],['C','Condensateur (ballon)'],['L','Bobine (roue lourde)'],['LC','LC / RLC (va-et-vient)']],'C');
  const pump=S.ui.button('Pompe : ARRÊT',b=>{on=!on; b.innerHTML=on?'Pompe : MARCHE':'Pompe : ARRÊT'; b.classList.toggle('on',on);});
  const rel=S.ui.button('Gonfler le ballon puis relâcher',()=>{q=Cs.v;i=0;on=false;pump.innerHTML='Pompe : ARRÊT';pump.classList.remove('on');hist=[];});
  const Rs=S.ui.slider('R (étranglement)',0.05,2,0.05,0.6,v=>v.toFixed(2)), Cs=S.ui.slider('C (souplesse du ballon)',0.3,2,0.1,1,v=>v.toFixed(1)), Ls=S.ui.slider('L (masse de la roue)',0.2,2,0.1,0.6,v=>v.toFixed(1));
  let on=false,q=0,i=0,ang=0,ph=0,hist=[],tt=0;
  md.onchange=()=>{q=0;i=0;hist=[];if(md.v==='LC'){q=Cs.v;on=false;pump.innerHTML='Pompe : ARRÊT';pump.classList.remove('on');}};
  return {draw(dt){
    const c=S.ctx,P=S.P,E=on?1:0,R=Rs.v,C=Cs.v,L=Ls.v,m=md.v; const sub=6;
    for(let k=0;k<sub;k++){ const h=dt/sub*1.6;
      if(m==='R'){ i=E/R; }
      if(m==='C'){ i=(E-q/C)/R; q+=i*h; }
      if(m==='L'){ i+=(E-R*i)/L*h; }
      if(m==='LC'){ const di=(E-q/C-R*i)/L; i+=di*h; q+=i*h; } }
    tt+=dt; hist.push([tt,i,q]); if(hist.length>420) hist.shift();
    const W=S.w*0.62, x0=40, x1=W-30, y0=40, y1=S.h-60, pw=16;
    const water=P.dark?'#2b6f9e':'#8cc8ec', wall=P.ink2;
    c.lineCap='round'; c.lineJoin='round';
    c.strokeStyle=wall; c.lineWidth=pw+6; c.strokeRect(x0,y0,x1-x0,y1-y0); c.strokeStyle=water; c.lineWidth=pw; c.strokeRect(x0,y0,x1-x0,y1-y0);
    // étranglement (R) en haut
    const rx=(x0+x1)/2, rw=Math.max(40,(x1-x0)*0.22), nar=Math.max(3,pw*(0.15+0.5*(1-R/2)));
    c.fillStyle=P.bg; c.fillRect(rx-rw/2,y0-pw/2-4,rw,(pw-nar)/2+4); c.fillRect(rx-rw/2,y0+nar/2,rw,(pw-nar)/2+4);
    c.strokeStyle=wall; c.lineWidth=2.5; c.strokeRect(rx-rw/2,y0-nar/2,rw,nar);
    H.text(c,'R = tuyau étroit',rx,y0-pw-6,P.ink2,12,'center',700);
    // particules
    const per=2*((x1-x0)+(y1-y0)); ph+=i*dt*120; const n=34;
    for(let k=0;k<n;k++){ let s=((k/n)*per+ph)%per; if(s<0)s+=per; let px,py; const Wd=x1-x0,Hd=y1-y0;
      if(s<Wd){px=x0+s;py=y0;} else if((s-=Wd)<Hd){px=x1;py=y0+s;} else if((s-=Hd)<Wd){px=x1-s;py=y1;} else {s-=Wd;px=x0;py=y1-s;}
      c.fillStyle=P.dark?'#bfe6ff':'#1f6fa8'; c.beginPath(); c.arc(px,py,3.2,0,7); c.fill(); }
    // pompe (générateur) à gauche
    const py0=(y0+y1)/2; c.fillStyle=P.bg2; c.strokeStyle=wall; c.lineWidth=2.5; c.beginPath(); c.arc(x0,py0,24,0,7); c.fill(); c.stroke();
    if(on) H.arrow(c,x0,py0+14,x0,py0-14,P.e,3,9); else H.text(c,'off',x0,py0,P.ink3,12,'center',700);
    H.text(c,'pompe = générateur',x0+30,py0+42,P.ink2,12,'left',700); H.text(c,'pression = tension E',x0+30,py0+58,P.ink3,11.5,'left');
    // élément à droite
    const ex=x1, ey=py0;
    if(m==='C'||m==='LC'){ const b=H.clamp(q/2,-1,1)*34; const cy=m==='LC'?ey-40:ey;
      c.strokeStyle='#c2185b'; c.lineWidth=4; c.beginPath(); c.moveTo(ex-pw/2-3,cy); c.quadraticCurveTo(ex,cy+b*1.6,ex+pw/2+3,cy); c.stroke();
      H.text(c,'membrane élastique = C',ex-22,cy-6,'#c2185b',12,'right',700); H.text(c,'gonflement = charge q',ex-22,cy+10,P.ink3,11.5,'right'); }
    if(m==='L'||m==='LC'){ const cy=m==='LC'?ey+40:ey; ang+=i*dt*6; c.save(); c.translate(ex,cy); c.rotate(ang); c.strokeStyle=P.b; c.lineWidth=4; for(let k=0;k<6;k++){c.rotate(Math.PI/3); c.beginPath(); c.moveTo(0,0); c.lineTo(22,0); c.stroke();} c.restore();
      c.fillStyle=P.b; c.beginPath(); c.arc(ex,cy,7,0,7); c.fill(); H.text(c,'roue lourde = L',ex-30,cy-6,P.b,12,'right',700); H.text(c,'vitesse = courant i',ex-30,cy+10,P.ink3,11.5,'right'); }
    // graphe
    const bx=W+10; const t0=Math.max(0,tt-8); const look=k=>t=>{const h=hist.find(z=>z[0]>=t);return h?h[k]:NaN;};
    H.plot(c,P,{x:bx,y:10,w:S.w-bx-10,h:S.h-20},[{f:look(1),col:P.dark?'#bfe6ff':'#1f6fa8'},{f:look(2),col:'#c2185b'}],{xmin:t0,xmax:t0+8,ymin:-2.2,ymax:2.2,yl:'débit i (bleu)  gonflement q (rose)'});
    const msg={R:'Résistance : le débit est immédiatement proportionnel à la pression : i = E/R (loi d’Ohm). Plus le tuyau est étroit, moins ça passe.',
      C:'Ballon : au début il est mou, l’eau entre à plein débit. Plus il se gonfle, plus il repousse : le débit tombe à 0. Le gonflement (= u_C) ne peut PAS sauter : il faut du temps pour remplir un ballon.',
      L:'Roue lourde : elle met du temps à accélérer (le courant monte progressivement) et, si on coupe la pompe, elle continue de tourner : le courant d’une bobine ne peut PAS s’arrêter net.',
      LC:'Le ballon se vide en lançant la roue ; la roue, lancée, regonfle le ballon de l’autre côté… L’énergie fait des allers-retours (oscillations). L’étranglement R freine : oscillations amorties.'};
    S.read(msg[m]+(m!=='LC'&&!on?'\n→ Appuie sur « Pompe » pour fermer l’interrupteur.':''));
  }};
};

/* ---------- Le paysage du potentiel : une bille ---------- */
A.bille = S=>{
  const sg=S.ui.choice([['p','bille = charge +'],['n','bille = électron']],'p'); S.ui.button('Effacer les traces',()=>{trails=[];});
  let Q=[],off=null,balls=[],trails=[];
  const V=(x,y)=>{let v=0;for(const o of Q)v+=o.q/Math.sqrt((x-o.x)**2+(y-o.y)**2+400);return v;};
  const E=(x,y)=>{let ex=0,ey=0;for(const o of Q){const dx=x-o.x,dy=y-o.y,r2=dx*dx+dy*dy+400,r=Math.sqrt(r2);ex+=o.q*dx/(r2*r);ey+=o.q*dy/(r2*r);}return{x:ex,y:ey};};
  function init(){ Q=[{x:S.w*0.35,y:S.h*0.5,q:1},{x:S.w*0.68,y:S.h*0.45,q:-1}]; const s=4,W=Math.ceil(S.w/s),Hh=Math.ceil(S.h/s); off=document.createElement('canvas'); off.width=W; off.height=Hh;
    const oc=off.getContext('2d'),im=oc.createImageData(W,Hh),P=S.P,mid=P.dark?[28,30,42]:[247,246,242];
    for(let j=0;j<Hh;j++)for(let i=0;i<W;i++){const v=Math.tanh(V(i*s,j*s)*45);const lev=Math.round(v*9);const vr=Math.tanh(V((i+1)*s,j*s)*45),vd=Math.tanh(V(i*s,(j+1)*s)*45);const edge=Math.round(vr*9)!==lev||Math.round(vd*9)!==lev;
      const col=v>0?[226,85,43]:[47,106,214]; const a=Math.abs(v)*0.75; const p=(j*W+i)*4; const d=edge?0.7:1;
      for(let k=0;k<3;k++) im.data[p+k]=(mid[k]+(col[k]-mid[k])*a)*d; im.data[p+3]=255;}
    oc.putImageData(im,0,0); }
  S.cursor='crosshair'; S.onDown=(p)=>{ balls.push({x:p.x,y:p.y,tr:[]}); if(balls.length>6) balls.shift(); };
  return {resize:init,theme:init,draw(dt){
    const c=S.ctx,P=S.P; if(!off) init(); c.drawImage(off,0,0,S.w,S.h);
    H.text(c,'COLLINE (V élevé)',Q[0].x,Q[0].y-46,P.ink,13,'center',800); H.text(c,'CUVETTE (V bas)',Q[1].x,Q[1].y-46,P.ink,13,'center',800);
    Q.forEach(o=>H.charge(c,o.x,o.y,10,o.q,P));
    const s=sg.v==='p'?1:-1;
    balls.forEach(b=>{ for(let k=0;k<6;k++){ const e=E(b.x,b.y),m=Math.hypot(e.x,e.y)||1; const near=Q.some(o=>Math.hypot(o.x-b.x,o.y-b.y)<14); if(near||b.x<0||b.y<0||b.x>S.w||b.y>S.h) break; b.x+=s*e.x/m*dt*12; b.y+=s*e.y/m*dt*12; b.tr.push([b.x,b.y]); }
      c.strokeStyle=P.ink; c.lineWidth=2; c.beginPath(); b.tr.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1])); c.stroke();
      c.fillStyle=s>0?'#fff':'#ffe08a'; c.strokeStyle=P.ink; c.lineWidth=2; c.beginPath(); c.arc(b.x,b.y,7,0,7); c.fill(); c.stroke(); });
    S.read(balls.length?`La ${s>0?'charge +':'charge −'} suit toujours la ligne de plus grande pente ${s>0?'en DESCENDANT (vers le bleu)':'en MONTANT (vers le rouge)'} : c’est une ligne de champ.\nAltitude = potentiel V, pente = champ E (E = −grad V), lignes de niveau = équipotentielles. Clique ailleurs pour lâcher d’autres billes.`:'Clique n’importe où pour poser une bille sur ce paysage : rouge = colline (potentiel élevé, autour du +), bleu = cuvette (potentiel bas, autour du −).');
  }};
};

/* ---------- Une seule équation, beaucoup de systèmes ---------- */
const SYS1=[
  {n:'Charge RC',y:'u_C(t)',y0:'0',yi:'E',tau:'RC',up:true},
  {n:'Décharge RC',y:'u_C(t)',y0:'E',yi:'0',tau:'RC',up:false},
  {n:'Établissement RL',y:'i(t)',y0:'0',yi:'E/R',tau:'L/R',up:true},
  {n:'Rails de Laplace (barre libre)',y:'v(t)',y0:'v₀',yi:'0',tau:'mR/(B²ℓ²)',up:false},
  {n:'Électron de Drude',y:'v(t)',y0:'0',yi:'−eτE/m',tau:'τ (collisions)',up:true},
  {n:'Chute avec frottement',y:'v(t)',y0:'0',yi:'mg/k',tau:'m/k',up:true},
  {n:'Café qui refroidit',y:'T(t)',y0:'T₀',yi:'T_pièce',tau:'(inertie thermique)',up:false}];
const SYS2=[
  {n:'Circuit LC',y:'q(t)',w:'1/√(LC)',d:'R (si RLC)',e:'½q²/C ↔ ½Li²'},
  {n:'Masse-ressort',y:'x(t)',w:'√(k/m)',d:'frottement',e:'½kx² ↔ ½mv²'},
  {n:'Pendule (petits angles)',y:'θ(t)',w:'√(g/ℓ)',d:'air',e:'potentielle ↔ cinétique'},
  {n:'Ballon + roue (hydraulique)',y:'gonflement',w:'1/√(LC)',d:'étranglement',e:'ballon ↔ roue'},
  {n:'Onde EM (en un point)',y:'E(t)',w:'ω',d:'— (vide)',e:'½ε₀E² ↔ B²/2μ₀'}];
A.universal = S=>{
  const md=S.ui.choice([['o1','1ᵉʳ ordre : τy′ + y = y∞'],['o2','Oscillateur : ÿ + (ω₀/Q)ẏ + ω₀²y = 0']],'o1');
  const sys=S.ui.slider('système',0,6,1,0,v=>v); const Qs=S.ui.slider('Q (oscillateur)',0.3,15,0.1,6,v=>v.toFixed(1));
  md.onchange=()=>{sys.el.max=md.v==='o1'?SYS1.length-1:SYS2.length-1; if(+sys.el.value>+sys.el.max) sys.set(0); S.dirty=true;};
  return {always:false,draw(){
    const c=S.ctx,P=S.P,W=S.w*0.56;
    if(md.v==='o1'){ const s=SYS1[sys.v]; const f=t=>s.up?1-Math.exp(-t):Math.exp(-t);
      H.plot(c,P,{x:12,y:10,w:W,h:S.h-20},f,{xmin:0,xmax:5,ymin:0,ymax:1.15,col:P.acc,yl:`${s.y}  (normalisé)`,xl:'t / τ',marks:[{x:1,t:'τ : 63 %'},{x:3,t:'3τ'},{x:5,t:'5τ'}]});
      const bx=W+24; H.text(c,s.n,bx,30,P.ink,15,'left',800);
      [['grandeur y',s.y],['valeur initiale',s.y0],['valeur finale y∞',s.yi],['constante de temps τ',s.tau]].forEach((r,k)=>{H.text(c,r[0],bx,62+k*36,P.ink3,12);H.text(c,r[1],bx,78+k*36,P.acc,15,'left',700);});
      H.text(c,'y(t) = y∞ + (y₀ − y∞)·e^(−t/τ)',bx,S.h-28,P.ink,13.5,'left',800);
      S.read('Même équation, même courbe : seule la « traduction » des symboles change. Dès que la VITESSE de variation est proportionnelle à l’ÉCART à l’équilibre, tu obtiens cette exponentielle.');
    } else { const s=SYS2[Math.min(sys.v,SYS2.length-1)]; const Q=Qs.v, l=1/(2*Q), w=Math.sqrt(Math.max(1-l*l,1e-6));
      const f=t=>{ if(Math.abs(Q-0.5)<0.02) return Math.exp(-t)*(1+t); if(Q>0.5) return Math.exp(-l*t)*(Math.cos(w*t)+l/w*Math.sin(w*t)); const d=Math.sqrt(l*l-1),r1=-l+d,r2=-l-d; return (r1*Math.exp(r2*t)-r2*Math.exp(r1*t))/(r1-r2); };
      H.plot(c,P,{x:12,y:10,w:W,h:S.h-20},[{f:t=>Math.exp(-l*t),col:H.rgba(P.ink3,0.6)},{f:t=>-Math.exp(-l*t),col:H.rgba(P.ink3,0.6)},{f,col:P.e}],{xmin:0,xmax:30,ymin:-1.1,ymax:1.1,yl:`${s.y} (normalisé)`,xl:'ω₀t'});
      const bx=W+24; H.text(c,s.n,bx,30,P.ink,15,'left',800);
      [['grandeur',s.y],['pulsation propre ω₀',s.w],['ce qui amortit',s.d],['échange d’énergie',s.e]].forEach((r,k)=>{H.text(c,r[0],bx,62+k*36,P.ink3,12);H.text(c,r[1],bx,78+k*36,P.e,14,'left',700);});
      S.read(`Un « ressort » (qui ramène vers l’équilibre) + une « inertie » (qui fait dépasser l’équilibre) = oscillations. Q = ${Q.toFixed(1)} : ${Q>0.5?'oscillations amorties (pseudo-périodique)':'pas d’oscillation (apériodique)'}.`); }
  }};
};
})();
