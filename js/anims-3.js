/* ============ Animations : Chapitres 4, 5 et TD ============ */
(function(){
const A=window.EM_A, H=window.EM_H;

/* ---------- Rails de Laplace ---------- */
A.rails = S=>{
  const mode=S.ui.choice([['imp','Vitesse imposée'],['lib','Barre lancée puis libre']],'imp');
  const Bs=S.ui.slider('B (T)',0.2,1.5,0.05,1,v=>v.toFixed(2)), Rs=S.ui.slider('R (Ω)',0.5,5,0.1,1,v=>v.toFixed(1)), vs=S.ui.slider('v / v₀ (m/s)',0.2,3,0.1,1,v=>v.toFixed(1));
  const go=S.ui.button('▶ Lancer',()=>{x=0.05;v=vs.v;hist=[];tt=0;});
  const l=0.2, m=0.05, pxm=110; let x=0.05, v=1, hist=[], tt=0, ph=0;
  mode.onchange=()=>{x=0.05;v=vs.v;hist=[];tt=0;};
  return {draw(dt){
    const c=S.ctx,P=S.P; const B=Bs.v,R=Rs.v; const top=S.h*0.16, bot=S.h*0.62, x0=S.w*0.08, xe=S.w*0.96;
    if(mode.v==='imp'){ v=vs.v; x+=v*dt; if(x0+x*pxm>xe-20){x=0.05;} }
    else { const a=-(B*B*l*l/(m*R))*v; v+=a*dt; x+=v*dt; if(x0+x*pxm>xe-20){x=(xe-20-x0)/pxm;v=0;} }
    tt+=dt; const e=-B*l*v, i=e/R, F=B*B*l*l*v/R; hist.push([tt,v,i]); if(hist.length>400) hist.shift();
    const xb=x0+x*pxm;
    c.fillStyle=H.rgba(P.acc,0.10); c.fillRect(x0,top,xb-x0,bot-top);
    for(let yy=top+18;yy<bot;yy+=30)for(let xx=x0+18;xx<xe;xx+=30) H.crossIn(c,xx,yy,5,H.rgba(P.b,xx<xb?0.7:0.3));
    H.line(c,x0,top,xe,top,P.ink2,4); H.line(c,x0,bot,xe,bot,P.ink2,4); H.line(c,x0,top,x0,bot,P.ink2,4);
    c.fillStyle=P.bg2; c.strokeStyle=P.ink; c.lineWidth=2; c.fillRect(x0-12,(top+bot)/2-26,24,52); c.strokeRect(x0-12,(top+bot)/2-26,24,52); H.text(c,'R',x0-24,(top+bot)/2,P.ink,14,'right',700);
    H.line(c,xb,top-10,xb,bot+10,P.e,7);
    // courant (sens trigo à l'écran si i<0 avec orientation horaire)
    ph+= Math.abs(i)*dt*120; const per=2*((xb-x0)+(bot-top)); const ns=Math.max(4,Math.round(per/40));
    if(Math.abs(i)>1e-3) for(let k=0;k<ns;k++){ let s=((k/ns)*per+ph)%per; let px,py; const W=xb-x0, Hh=bot-top;
      if(s<W){px=x0+s;py=bot;} else if((s-=W)<Hh){px=xb;py=bot-s;} else if((s-=Hh)<W){px=xb-s;py=top;} else {s-=W;px=x0;py=top+s;}
      c.fillStyle=P.rem; c.beginPath(); c.arc(px,py,3.5,0,7); c.fill(); }
    if(Math.abs(i)>1e-3){ H.arrow(c,(x0+xb)/2-20,bot+18,(x0+xb)/2+20,bot+18,P.rem,2.5,9); H.text(c,'i induit',(x0+xb)/2,bot+34,P.rem,12,'center',700);
      if(xb-x0>60){ H.dotOut(c,(x0+xb)/2,(top+bot)/2,10,P.ok); H.text(c,'B induit',(x0+xb)/2,(top+bot)/2+22,P.ok,11.5,'center',700); } }
    if(v>0.01){ H.arrow(c,xb+8,(top+bot)/2-24,xb+8+40*v,(top+bot)/2-24,P.acc,3,10); H.text(c,'v',xb+14+40*v,(top+bot)/2-24,P.acc,13,'left',700);
      H.arrow(c,xb-8,(top+bot)/2+24,xb-8-Math.min(140,F*400),(top+bot)/2+24,P.e,3,10); H.text(c,'F Laplace',xb-12-Math.min(140,F*400),(top+bot)/2+42,P.e,12,'center',700); }
    H.text(c,'B appliqué ⊗',xe-4,top-14,P.b,12,'right',700);
    const pb={x:12,y:bot+48,w:S.w-24,h:S.h-bot-56};
    if(pb.h>50){ const tm=Math.max(4,tt); H.plot(c,P,pb,[{f:t=>{const h=hist.find(q=>q[0]>=t);return h?h[1]:NaN;},col:P.acc},{f:t=>{const h=hist.find(q=>q[0]>=t);return h?-h[2]*10:NaN;},col:P.rem}],{xmin:Math.max(0,tm-4),xmax:tm,ymin:0,ymax:3.2,yl:'v(t) (violet)   |i|(t)×10 (orange)'}); }
    S.read(`Φ = Bℓx = ${(B*l*x).toFixed(3)} Wb   e = −Bℓv = ${e.toFixed(3)} V   i = e/R = ${i.toFixed(3)} A   F = B²ℓ²v/R = ${F.toFixed(3)} N\n${mode.v==='imp'?`P_opérateur = Fv = ${(F*v).toFixed(3)} W = P_Joule = Ri² = ${(R*i*i).toFixed(3)} W ✓`:`Barre libre : la force de Laplace freine → v décroît exponentiellement, τ = mR/(B²ℓ²) = ${(m*R/(B*B*l*l)).toFixed(2)} s.`}`);
  }};
};

/* ---------- Loi de Lenz : aimant et spire ---------- */
A.lenz = S=>{
  const md=S.ui.choice([['auto','Va-et-vient'],['drag','À la main']],'auto'), pol=S.ui.choice([['N','pôle N vers la spire'],['S','pôle S vers la spire']],'N');
  let xm=0, prev=null, hist=[], tt=0;
  S.draggables.push({r:60,get:()=>({x:xm,y:S.h*0.32}),set:(x,y)=>{ if(md.v==='drag') xm=Math.min(x,S.w*0.62-40); }});
  return {draw(dt){
    const c=S.ctx,P=S.P,cy=S.h*0.32,cx=S.w*0.62,ry=S.h*0.2,rx=ry*0.28; tt+=dt;
    if(md.v==='auto'||!xm) xm = cx-130-S.w*0.11*(1+Math.sin(tt*1.4));
    const d=(cx-xm)/80, s=pol.v==='N'?1:-1; const Phi=s/Math.pow(1+d*d,1.5);
    let e=0; if(prev!==null&&dt>0) e=-(Phi-prev)/dt; prev=Phi; hist.push([tt,Phi,e]); if(hist.length>500) hist.shift();
    H.line(c,10,cy,S.w-10,cy,P.ink3,1,[4,6]);
    c.strokeStyle=P.ink3; c.lineWidth=3; c.setLineDash([5,5]); c.beginPath(); c.ellipse(cx,cy,rx,ry,0,Math.PI/2,3*Math.PI/2); c.stroke(); c.setLineDash([]);
    const mw=120, mh=46; const nCol=P.qp, sCol=P.qn;
    c.fillStyle=pol.v==='N'?sCol:nCol; c.fillRect(xm-mw,cy-mh/2,mw/2,mh); c.fillStyle=pol.v==='N'?nCol:sCol; c.fillRect(xm-mw/2,cy-mh/2,mw/2,mh);
    H.text(c,pol.v==='N'?'S':'N',xm-mw*0.75,cy,'#fff',18,'center',800); H.text(c,pol.v==='N'?'N':'S',xm-mw*0.25,cy,'#fff',18,'center',800);
    for(let k=-2;k<=2;k++){ const yy=cy+k*12; const len=60*Math.max(0.15,Math.abs(Phi)); H.arrow(c,xm+4+(s<0?len:0),yy,xm+4+(s<0?0:len),yy,H.rgba(P.b,0.7),1.5,6); }
    c.strokeStyle=P.ink; c.lineWidth=3.5; c.beginPath(); c.ellipse(cx,cy,rx,ry,0,-Math.PI/2,Math.PI/2); c.stroke();
    const ii=e; if(Math.abs(ii)>0.05){ const up=ii<0; // i>0 => devant vers le bas (orientation n = +x)
      const ay=cy+ (up?ry*0.25:-ry*0.25); H.arrow(c,cx+rx,ay+(up?20:-20),cx+rx,ay+(up?-20:20),P.rem,3.5,11); H.text(c,'i induit',cx+rx+12,cy,P.rem,13,'left',700);
      const bl=H.clamp(Math.abs(ii)*25,20,80); const dir=ii>0?1:-1; H.arrow(c,cx,cy,cx+dir*bl,cy,P.ok,3.5,11); H.text(c,'B induit',cx+dir*bl,cy-14,P.ok,12,'center',700); }
    const pb={x:12,y:S.h*0.6,w:S.w-24,h:S.h*0.38}; const t0=Math.max(0,tt-6);
    const look=k=>t=>{const h=hist.find(q=>q[0]>=t);return h?h[k]:NaN;};
    H.plot(c,P,pb,[{f:look(1),col:P.b},{f:t=>{const v=look(2)(t);return v/3;},col:P.rem}],{xmin:t0,xmax:t0+6,ymin:-1.1,ymax:1.1,yl:'Φ(t) (bleu)   e(t) = −dΦ/dt (orange)'});
    S.read(Math.abs(e)<0.05?'Flux constant → pas de fem, pas de courant (même si B est intense !).':(e<0?'Le flux AUGMENTE → e < 0 : le courant induit crée un B opposé à celui de l’aimant (la spire présente un pôle '+(pol.v==='N'?'N':'S')+' à l’aimant : elle le repousse).':'Le flux DIMINUE → e > 0 : le B induit renforce le flux qui s’en va (la spire attire l’aimant qui s’éloigne).')+'\nLenz : le courant induit s’oppose toujours à la CAUSE (la variation du flux), pas au champ lui-même.');
  }};
};

/* ---------- Oscillateur LC ---------- */
A.lc = S=>{
  const Ls=S.ui.slider('L',0.3,3,0.1,1,v=>v.toFixed(1)), Cs=S.ui.slider('C',0.3,3,0.1,1,v=>v.toFixed(1)); S.ui.play();
  let ph=0, hist=[], tt=0;
  return {draw(dt){
    const c=S.ctx,P=S.P; const w=1/Math.sqrt(Ls.v*Cs.v)*2.2; ph+=w*dt; tt+=dt; const q=Math.cos(ph), i=-Math.sin(ph); hist.push([tt,q,i]); if(hist.length>600) hist.shift();
    const cx=S.w*0.33, cy=S.h*0.33, W=S.w*0.4, Hh=S.h*0.4; const x1=cx-W/2,x2=cx+W/2,y1=cy-Hh/2,y2=cy+Hh/2;
    H.line(c,x1,y1,x2,y1,P.ink2,2.5); H.line(c,x1,y2,x2,y2,P.ink2,2.5); H.line(c,x1,y1,x1,cy-12,P.ink2,2.5); H.line(c,x1,cy+12,x1,y2,P.ink2,2.5);
    H.line(c,x1-22,cy-12,x1+22,cy-12,q>0?P.qp:P.qn,5); H.line(c,x1-22,cy+12,x1+22,cy+12,q>0?P.qn:P.qp,5);
    for(let k=-1;k<=1;k++) if(Math.abs(q)>0.08) H.arrow(c,x1+k*12,cy-10*Math.sign(q),x1+k*12,cy+10*Math.sign(q),H.rgba(P.e,Math.abs(q)),1.6,5);
    H.text(c,'C',x1-34,cy,P.ink,15,'right',700);
    H.line(c,x2,y1,x2,cy-36,P.ink2,2.5); H.line(c,x2,cy+36,x2,y2,P.ink2,2.5);
    c.strokeStyle=P.ink2; c.lineWidth=2.5; c.beginPath(); for(let k=0;k<4;k++){ c.arc(x2,cy-27+k*18,9,-Math.PI/2,Math.PI/2); } c.stroke();
    if(Math.abs(i)>0.08){ c.strokeStyle=H.rgba(P.b,Math.abs(i)); c.lineWidth=1.6; for(let k=1;k<=2;k++){c.beginPath(); c.ellipse(x2,cy,16*k+6,40+10*k,0,0,7); c.stroke();}
      H.arrow(c,x2,cy+20*Math.sign(i),x2,cy-20*Math.sign(i),P.b,3,9); }
    H.text(c,'L',x2+48,cy,P.ink,15,'left',700);
    const ph2=(ph*1.2)%1; if(Math.abs(i)>0.05) for(let k=0;k<10;k++){ const s=((k/10+ph2*Math.sign(i))%1+1)%1; const per=2*(W+Hh); let d=s*per,px,py; if(d<W){px=x1+d;py=y1;} else if((d-=W)<Hh){px=x2;py=y1+d;} else if((d-=Hh)<W){px=x2-d;py=y2;} else {d-=W;px=x1;py=y2-d;}
      c.fillStyle=H.rgba(P.rem,Math.abs(i)); c.beginPath(); c.arc(px,py,3,0,7); c.fill(); }
    const bx=S.w*0.62, bw=S.w*0.34, base=S.h*0.58; H.text(c,'Énergie',bx,20,P.ink,13,'left',700);
    const E1=q*q, E2=i*i; const bh=base-40;
    c.fillStyle=P.e; c.fillRect(bx,base,bw*0.28,-E1*bh); c.fillStyle=P.b; c.fillRect(bx+bw*0.36,base,bw*0.28,-E2*bh); c.fillStyle=P.ink3; c.fillRect(bx+bw*0.72,base,bw*0.28,-(E1+E2)*bh);
    H.text(c,'½q²/C',bx+bw*0.14,base+12,P.e,11.5,'center',700); H.text(c,'½Li²',bx+bw*0.5,base+12,P.b,11.5,'center',700); H.text(c,'total',bx+bw*0.86,base+12,P.ink2,11.5,'center',700);
    const t0=Math.max(0,tt-8); const look=k=>t=>{const h=hist.find(z=>z[0]>=t);return h?h[k]:NaN;};
    H.plot(c,P,{x:12,y:S.h*0.66,w:S.w-24,h:S.h*0.32},[{f:look(1),col:P.e},{f:look(2),col:P.b}],{xmin:t0,xmax:t0+8,ymin:-1.15,ymax:1.15,yl:'q(t) (orange)   i(t) (bleu)'});
    S.read(`ω₀ = 1/√(LC) ; T₀ = 2π√(LC) ∝ ${(2*Math.PI*Math.sqrt(Ls.v*Cs.v)).toFixed(2)}.  L’énergie passe du champ E (condensateur) au champ B (bobine) et revient — sans perte.\nC’est exactement ce couplage E ↔ B qui, répété de proche en proche, donnera la propagation (Ch. 5).`);
  }};
};

/* ---------- Courant de déplacement ---------- */
A.displacement = S=>{
  const surf=S.ui.choice([['s1','Surface plate S₁'],['s2','Surface « sac » S₂']],'s1');
  let tt=0, ph=0;
  return {draw(dt){
    const c=S.ctx,P=S.P; tt+=dt; const tau=1.2, cyc=tt%(5*tau); const q=1-Math.exp(-cyc/tau), i=Math.exp(-cyc/tau);
    const cy=S.h*0.45, xp1=S.w*0.6, xp2=S.w*0.68, ph_=S.h*0.26;
    H.line(c,10,cy,xp1,cy,P.ink2,3); H.line(c,xp2,cy,S.w-10,cy,P.ink2,3);
    c.fillStyle=P.qp; c.fillRect(xp1-4,cy-ph_,6,2*ph_); c.fillStyle=P.qn; c.fillRect(xp2-2,cy-ph_,6,2*ph_);
    const nch=Math.round(q*7); for(let k=0;k<nch;k++){const y=cy-ph_+(k+0.5)*2*ph_/7; H.text(c,'+',xp1-12,y,P.qp,12,'center',800); H.text(c,'−',xp2+12,y,P.qn,12,'center',800);}
    for(let k=0;k<5;k++){const y=cy-ph_*0.8+k*ph_*0.4; if(q>0.05) H.arrow(c,xp1+3,y,xp1+3+(xp2-xp1-6)*q,y,P.e,1.8,6);}
    ph+=i*dt*160; for(let k=0;k<14;k++){ const x=((k*40+ph)%(xp1-10))+10; c.fillStyle=P.rem; c.beginPath(); c.arc(x,cy,3.2,0,7); c.fill(); const x2=((k*40+ph)%(S.w-10-xp2))+xp2; c.beginPath(); c.arc(x2,cy,3.2,0,7); c.fill(); }
    const gx=S.w*0.3, gr=S.h*0.2;
    if(surf.v==='s1'){ c.fillStyle=H.rgba(P.acc,0.18); c.beginPath(); c.ellipse(gx,cy,gr*0.3,gr,0,0,7); c.fill(); }
    else { c.fillStyle=H.rgba(P.ok,0.14); c.strokeStyle=P.ok; c.lineWidth=1.5; c.beginPath(); c.moveTo(gx,cy-gr); c.bezierCurveTo(S.w*0.55,cy-gr*1.5,S.w*0.66,cy-gr*0.9,S.w*0.645,cy); c.bezierCurveTo(S.w*0.66,cy+gr*0.9,S.w*0.55,cy+gr*1.5,gx,cy+gr); c.closePath(); c.fill(); c.stroke(); }
    c.strokeStyle=P.acc; c.lineWidth=3; c.beginPath(); c.ellipse(gx,cy,gr*0.3,gr,0,0,7); c.stroke(); H.text(c,'Γ',gx-gr*0.3-10,cy-gr+6,P.acc,16,'right',800);
    for(let k=1;k<=2;k++){ c.strokeStyle=H.rgba(P.b,0.25+0.6*i); c.lineWidth=1.4; c.beginPath(); c.ellipse(S.w*0.15,cy,6*k,22*k,0,0,7); c.stroke(); c.beginPath(); c.ellipse((xp1+xp2)/2,cy,10*k,(ph_+18*k),0,0,7); c.stroke(); }
    H.text(c,'B existe aussi autour de l’espace entre armatures !',(xp1+xp2)/2,cy+ph_+48,P.b,12,'center',600);
    const pb={x:12,y:S.h*0.8,w:S.w-24,h:S.h*0.18-6};
    H.text(c,`i (fil) = ${i.toFixed(2)}     i_D = ε₀ dΦ_E/dt = ${i.toFixed(2)}`,S.w/2,S.h*0.88,P.ink,15,'center',700);
    S.read(surf.v==='s1'?'S₁ (plate) est percée par le fil : i_enlacé = i. Ampère « version Ch. 3 » marche.':'S₂ (en sac) passe ENTRE les armatures : aucune charge ne la traverse → i_enlacé = 0 ?! Contradiction…\n…levée par Maxwell : E croît entre les armatures, et ε₀ dΦ_E/dt = dQ/dt = i. Même résultat avec S₁ et S₂ ✓');
  }};
};

/* ---------- Onde électromagnétique plane ---------- */
A.emwave = S=>{
  const lam=S.ui.slider('λ',0.4,1.5,0.05,0.8,v=>v.toFixed(2)); S.ui.play(); const pl=S.ui.check(' montrer les plans d’onde',false);
  return {draw(dt){
    const c=S.ctx,P=S.P; const ox=S.w*0.08, oy=S.h*0.52, Lz=S.w*0.86, A0=S.h*0.3; const yx=-0.55, yy=0.38;
    H.arrow(c,ox,oy,ox+Lz+10,oy,P.ink2,1.8,9); H.text(c,'z (propagation)',ox+Lz,oy+16,P.ink2,12,'right',700);
    H.arrow(c,ox,oy,ox,oy-A0-20,P.e,1.5,8); H.text(c,'x : E',ox+6,oy-A0-22,P.e,12,'left',700);
    H.arrow(c,ox,oy,ox+yx*A0*1.1,oy+yy*A0*1.1,P.b,1.5,8); H.text(c,'y : B',ox+yx*A0*1.1-4,oy+yy*A0*1.1+12,P.b,12,'left',700);
    const k=2*Math.PI/(lam.v*Lz/2.2), w=2.4; const N=70;
    const pE=[],pB=[];
    for(let j=0;j<=N;j++){ const z=j/N*Lz, ph=Math.cos(k*z-w*S.t); const x=ox+z; pE.push([x,oy-ph*A0]); pB.push([x+yx*ph*A0*0.8,oy+yy*ph*A0*0.8]);
      if(j%2===0){ H.line(c,x,oy,x,oy-ph*A0,H.rgba(P.e,0.55),1.4); H.line(c,x,oy,x+yx*ph*A0*0.8,oy+yy*ph*A0*0.8,H.rgba(P.b,0.55),1.4);} }
    c.lineWidth=2.6; c.strokeStyle=P.e; c.beginPath(); pE.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1])); c.stroke();
    c.strokeStyle=P.b; c.beginPath(); pB.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1])); c.stroke();
    if(pl.v){ for(let m=0;m<4;m++){ const z=((w*S.t/k)+m*2*Math.PI/k)%Lz; const x=ox+z; c.fillStyle=H.rgba(P.acc,0.10); c.beginPath(); c.moveTo(x,oy-A0); c.lineTo(x+yx*A0,oy-A0+yy*A0); c.lineTo(x+yx*A0,oy+A0+yy*A0); c.lineTo(x,oy+A0); c.closePath(); c.fill(); } }
    S.read('E (x) ⟂ B (y) ⟂ direction de propagation (z) ; E et B en phase, ‖E‖/‖B‖ = c.\nIls vérifient ∂E/∂z = −∂B/∂t et ∂B/∂z = −ε₀μ₀ ∂E/∂t ⇒ ∂²E/∂z² = (1/c²) ∂²E/∂t² avec c = 1/√(ε₀μ₀) ≈ 3×10⁸ m/s.');
  }};
};

/* ---------- Ligne LC : propagation d'une impulsion ---------- */
A.line = S=>{
  const Ls=S.ui.slider('𝓛 (par m)',0.3,3,0.1,1,v=>v.toFixed(1)), Cs=S.ui.slider('𝒞 (par m)',0.3,3,0.1,1,v=>v.toFixed(1));
  let t0=0, tt=0; S.ui.button('⚡ Envoyer une impulsion',()=>{t0=tt;});
  return {draw(dt){
    const c=S.ctx,P=S.P; tt+=dt; const v=1/Math.sqrt(Ls.v*Cs.v); const pos=(tt-t0)*v*0.22; const Vz=z=>Math.exp(-(((z-pos)/0.06)**2));
    const n=12, x0=20, x1=S.w-20, yt=S.h*0.12, yb=S.h*0.36, cw=(x1-x0)/n;
    H.line(c,x0,yb,x1,yb,P.ink2,2);
    for(let k=0;k<n;k++){ const xa=x0+k*cw, xm=xa+cw*0.55; H.line(c,xa,yt,xa+cw*0.15,yt,P.ink2,2); c.strokeStyle=P.b; c.lineWidth=2; c.beginPath(); for(let q=0;q<3;q++) c.arc(xa+cw*0.2+q*cw*0.1,yt,cw*0.05,Math.PI,0); c.stroke();
      H.line(c,xa+cw*0.5,yt,xa+cw,yt,P.ink2,2); const Vk=Vz((xm-x0)/(x1-x0)); H.line(c,xm,yt,xm,(yt+yb)/2-5,P.ink2,2); H.line(c,xm,(yt+yb)/2+5,xm,yb,P.ink2,2);
      c.strokeStyle=H.rgba(P.e,0.3+0.7*Vk); c.lineWidth=4; H.line(c,xm-10,(yt+yb)/2-5,xm+10,(yt+yb)/2-5,H.rgba(P.e,0.3+0.7*Vk),4); H.line(c,xm-10,(yt+yb)/2+5,xm+10,(yt+yb)/2+5,H.rgba(P.e,0.3+0.7*Vk),4); }
    H.text(c,'𝓛dz',x0+cw*0.3,yt-14,P.b,11.5,'center',700); H.text(c,'𝒞dz',x0+cw*0.55+16,(yt+yb)/2,P.e,11.5,'left',700);
    H.plot(c,P,{x:12,y:S.h*0.45,w:S.w-24,h:S.h*0.52},Vz,{xmin:0,xmax:1,ymin:-0.1,ymax:1.15,col:P.e,yl:'V(z, t)',xl:'z'});
    S.read(`v = 1/√(𝓛𝒞) ∝ ${v.toFixed(2)}.  L’impulsion se déplace SANS se déformer : c’est une solution de ∂²V/∂z² = 𝓛𝒞 ∂²V/∂t².\nPour un coaxial dans le vide, 𝓛𝒞 = μ₀ε₀ → v = c. Avec un isolant (εᵣ) : v = c/√εᵣ ≈ 0,66c pour le polyéthylène.`);
  }};
};

/* ---------- TD1 : sphères chargées E(r), V(r) ---------- */
A.sphereEV = S=>{
  const md=S.ui.choice([['u','Exo 4 : ρ uniforme (réf. V(∞)=0)'],['v','Exo 5 : ρ = ρ₀r/R (réf. V(O)=0)']],'u');
  const rs=S.ui.slider('r / R',0,3,0.01,0.6,v=>v.toFixed(2));
  return {always:false,draw(){
    const c=S.ctx,P=S.P,W=S.w*0.3,cx=W/2,cy=S.h/2,R=Math.min(W*0.32,S.h*0.2);
    const g=c.createRadialGradient(cx,cy,0,cx,cy,R); if(md.v==='u'){g.addColorStop(0,H.rgba(P.qp,0.45));g.addColorStop(1,H.rgba(P.qp,0.45));} else {g.addColorStop(0,H.rgba(P.qp,0.03));g.addColorStop(1,H.rgba(P.qp,0.75));}
    c.fillStyle=g; c.beginPath(); c.arc(cx,cy,R,0,7); c.fill(); c.strokeStyle=P.qp; c.lineWidth=1.5; c.stroke();
    c.strokeStyle=P.acc; c.lineWidth=2; c.setLineDash([5,4]); c.beginPath(); c.arc(cx,cy,Math.max(2,rs.v*R),0,7); c.stroke(); c.setLineDash([]);
    H.text(c,'R',cx+R*0.7+6,cy-R*0.7,P.qp,13,'left',700); H.text(c,'sphère de Gauss r',cx,cy+Math.max(R,rs.v*R)+18,P.acc,12,'center',600);
    let fE,fV,ymV;
    if(md.v==='u'){ fE=r=>r<=1?r/3:1/(3*r*r); fV=r=>r<=1?(3-r*r)/6:1/(3*r); ymV=[0,0.55]; }
    else { fE=r=>r<=1?r*r/4:1/(4*r*r); fV=r=>r<=1?-r*r*r/12:1/(4*r)-1/3; ymV=[-0.36,0.02]; }
    const bx=W+6, bw=S.w-W-16, hh=(S.h-24)/2;
    H.plot(c,P,{x:bx,y:8,w:bw,h:hh},fE,{xmin:0,xmax:3,ymin:0,ymax:0.38,col:P.e,yl:md.v==='u'?'E(r) en ρR/ε₀':'E(r) en ρ₀R/ε₀',xl:'r/R',marker:rs.v,marks:[{x:1,t:'R'}]});
    H.plot(c,P,{x:bx,y:16+hh,w:bw,h:hh},fV,{xmin:0,xmax:3,ymin:ymV[0],ymax:ymV[1],col:P.acc,yl:md.v==='u'?'V(r) en ρR²/ε₀':'V(r) en ρ₀R²/ε₀',xl:'r/R',marker:rs.v,marks:[{x:1,t:'R'}]});
    S.read(md.v==='u'?'Intérieur : E = ρr/3ε₀ (linéaire), extérieur : E = Q/4πε₀r² (comme une charge ponctuelle). E et V continus en r = R (pas de charge surfacique).\nV(0) = ρR²/2ε₀ = (3/2)V(R) : maximum au centre, tangente horizontale car E(0) = 0.':'Intérieur : E = ρ₀r²/4ε₀R (en r², charge concentrée en périphérie). Référence V(O) = 0 → V(∞) = −ρ₀R²/3ε₀ ≠ 0.\nV décroît partout (E > 0) : en −r³ dedans, puis asymptote horizontale.');
  }};
};

/* ---------- TD1 : plans infinis ---------- */
A.planes = S=>{
  const md=S.ui.choice([['1','Un plan +σ'],['2','Deux plans +σ / −σ']],'1');
  return {always:false,draw(){
    const c=S.ctx,P=S.P,W=S.w*0.38,cy=S.h/2,k=S.h*0.16;
    const pl=(y,col,lab)=>{ c.fillStyle=H.rgba(col,0.3); c.beginPath(); c.moveTo(14,y+14); c.lineTo(W-40,y+14); c.lineTo(W-10,y-14); c.lineTo(44,y-14); c.closePath(); c.fill(); H.text(c,lab,W-6,y,col,12.5,'left',700); };
    if(md.v==='1'){ pl(cy,P.qp,'+σ'); for(let i=0;i<6;i++){const x=34+i*(W-70)/5; H.arrow(c,x,cy-10,x,cy-2.2*k,P.e,1.8,7); H.arrow(c,x,cy+10,x,cy+2.2*k,P.e,1.8,7);} H.text(c,'z',8,20,P.ink3,12); }
    else { pl(cy+k*0.8,P.qp,'+σ (z=0)'); pl(cy-k*0.8,P.qn,'−σ (z=d)'); for(let i=0;i<6;i++){const x=34+i*(W-70)/5; H.arrow(c,x,cy+k*0.8-8,x,cy-k*0.8+8,P.e,2.2,8);} H.text(c,'E = 0',W/2,cy+2*k,P.ink3,13,'center',700); H.text(c,'E = 0',W/2,cy-2*k,P.ink3,13,'center',700); }
    const bx=W+8,bw=S.w-W-18,hh=(S.h-24)/2;
    if(md.v==='1'){ H.plot(c,P,{x:bx,y:8,w:bw,h:hh},z=>z>0?0.5:-0.5,{xmin:-2,xmax:2,ymin:-0.7,ymax:0.7,col:P.e,yl:'E_z en σ/ε₀',xl:'z'}); H.plot(c,P,{x:bx,y:16+hh,w:bw,h:hh},z=>-Math.abs(z)/2,{xmin:-2,xmax:2,ymin:-1.1,ymax:0.1,col:P.acc,yl:'V(z) = −σ|z|/2ε₀',xl:'z'}); }
    else { H.plot(c,P,{x:bx,y:8,w:bw,h:hh},z=>z>0&&z<1?1:0,{xmin:-1,xmax:2,ymin:-0.1,ymax:1.2,col:P.e,yl:'E_z en σ/ε₀',xl:'z/d'}); H.plot(c,P,{x:bx,y:16+hh,w:bw,h:hh},z=>z<0?0:(z<1?-z:-1),{xmin:-1,xmax:2,ymin:-1.2,ymax:0.15,col:P.acc,yl:'V(z) en σd/ε₀',xl:'z/d'}); }
    S.read(md.v==='1'?'Champ uniforme de chaque côté, de norme σ/2ε₀, qui CHANGE DE SENS à la traversée (saut σ/ε₀). V continu mais anguleux.':'Superposition : les champs s’ajoutent entre les plans (σ/ε₀) et se compensent dehors (0). V linéaire entre les plans : U = σd/ε₀ → c’est le condensateur plan.');
  }};
};

/* ---------- TD2 : influence électrostatique ---------- */
A.influence = S=>{
  const st=S.ui.choice([['1','Étape 1'],['2','Étape 2'],['3','Étape 3'],['4','Étape 4'],['5','Étape 5']],'1');
  return {always:false,draw(){
    const c=S.ctx,P=S.P,cy=S.h*0.45,R=Math.min(S.h*0.2,S.w*0.12),ax=S.w*0.32,bx=S.w*0.62,s=+st.v;
    if(s===1||s===5){ H.line(c,(ax+bx)/2,cy-R*1.8,(ax+bx)/2,cy+R*1.8,P.ink2,3,[8,6]); H.text(c,'écran',(ax+bx)/2,cy-R*1.8-12,P.ink2,12,'center',700); }
    [[ax,'A'],[bx,'B']].forEach(([x,n])=>{ c.fillStyle=H.rgba(P.ink3,0.15); c.strokeStyle=P.ink2; c.lineWidth=2; c.beginPath(); c.arc(x,cy,R,0,7); c.fill(); c.stroke(); H.text(c,n,x,cy,P.ink2,18,'center',800); });
    const put=(x,list,sign)=>list.forEach(a=>H.text(c,sign>0?'+':'−',x+(R+10)*Math.cos(a),cy+(R+10)*Math.sin(a),sign>0?P.qp:P.qn,17,'center',800));
    const uni=n=>Array.from({length:n},(_,i)=>i/n*2*Math.PI);
    const side=(n,center,spread)=>Array.from({length:n},(_,i)=>center+(i-(n-1)/2)*spread);
    const ground=(x,y,conn)=>{ H.line(c,x,y,x,y+(conn?30:14),P.ink2,2); const yy=y+(conn?30:44); if(!conn){ H.text(c,'(déconnecté)',x+28,y+30,P.ink3,11,'left'); } H.line(c,x-16,yy,x+16,yy,P.ink2,2.5); H.line(c,x-10,yy+6,x+10,yy+6,P.ink2,2); H.line(c,x-4,yy+12,x+4,yy+12,P.ink2,2); };
    if(s===1){ put(ax,uni(10),1); }
    if(s>=2&&s<=4){ put(ax,side(10,0,0.28),1); put(bx,side(5,Math.PI,0.32),-1); if(s===2) put(bx,side(5,0,0.32),1); }
    if(s===3) ground(bx,cy+R,true); if(s===4) ground(bx,cy+R,false);
    if(s===5){ put(bx,uni(5),-1); ground(ax,cy+R,true); }
    const txt={1:'A porte Q > 0 réparti uniformément (pas d’influence grâce à l’écran). B est neutre : aucune charge.',
      2:'Écran retiré → INFLUENCE. Le champ de A attire les électrons de B sur sa face en regard (−) et laisse la face opposée chargée + (B reste globalement neutre). Les charges de A se concentrent du côté de B.',
      3:'B relié à la Terre : les charges + de la face éloignée « s’écoulent » vers la Terre (le potentiel de B est fixé à 0). B porte maintenant une charge NÉGATIVE nette, toujours face à A.',
      4:'On coupe la liaison à la Terre : B est isolé et CONSERVE sa charge négative. Rien ne bouge tant que A est là.',
      5:'Écran remis (plus d’influence) et A relié à la Terre : A se décharge complètement (Q_A = 0). B garde sa charge négative, désormais répartie uniformément.'};
    S.read(txt[s]);
  }};
};

/* ---------- TD2 : couronne fendue ---------- */
A.couronne = S=>{
  const rs=S.ui.slider('anneau élémentaire de rayon r',0.05,0.95,0.01,0.5,v=>'R₁ + '+Math.round(v*100)+'% (R₂−R₁)');
  const eq=S.ui.check(' équipotentielles',true);
  return {always:false,draw(){
    const c=S.ctx,P=S.P,cx=S.w*0.3,cy=S.h/2,R2=Math.min(S.h*0.44,S.w*0.25),R1=R2*0.42,gap=0.07;
    c.fillStyle=H.rgba(P.ink3,0.18); c.beginPath(); c.arc(cx,cy,R2,gap,2*Math.PI-gap); c.arc(cx,cy,R1,2*Math.PI-gap,gap,true); c.closePath(); c.fill(); c.strokeStyle=P.ink2; c.lineWidth=1.5; c.stroke();
    if(eq.v) for(let k=1;k<12;k++){ const a=gap+k*(2*Math.PI-2*gap)/12; const t=k/12; c.strokeStyle=H.rgba(P.acc,0.5); H.line(c,cx+R1*Math.cos(a),cy+R1*Math.sin(a),cx+R2*Math.cos(a),cy+R2*Math.sin(a),H.rgba(P.acc,0.55),1.2,[3,3]); }
    for(let k=1;k<=4;k++){ const r=R1+k*(R2-R1)/5; c.strokeStyle=H.rgba(P.e,0.55); c.lineWidth=1.4; c.beginPath(); c.arc(cx,cy,r,gap+0.05,2*Math.PI-gap-0.05); c.stroke(); const a=Math.PI*0.95; H.arrow(c,cx+r*Math.cos(a-0.12),cy+r*Math.sin(a-0.12),cx+r*Math.cos(a+0.05),cy+r*Math.sin(a+0.05),P.e,1.6,6); }
    const r=R1+rs.v*(R2-R1), dr=(R2-R1)*0.06; c.strokeStyle=P.rem; c.lineWidth=dr; c.beginPath(); c.arc(cx,cy,r,gap,2*Math.PI-gap); c.stroke();
    H.text(c,'V₁',cx+R2+8,cy-12,P.qp,14,'left',800); H.text(c,'V₂',cx+R2+8,cy+14,P.qn,14,'left',800);
    const tx=S.w*0.6, fs=Math.max(10.5,Math.min(13,S.w/58)), L=[['Anneau de rayon r, largeur dr :',P.ink,700],['longueur 2πr, section e·dr',P.ink2,500],['dR = ρ·2πr / (e·dr)',P.rem,700],['',0,0],['Même tension V₁−V₂ pour tous',P.ink2,500],['→ anneaux en PARALLÈLE :',P.ink2,700],['1/R = ∫ e·dr / (2πρ·r)',P.acc,700],['',0,0],['R = 2πρ / (e·ln(R₂/R₁))',P.ok,800]];
    L.forEach((l,k)=>{ if(l[0]) H.text(c,l[0],tx,S.h*0.14+k*fs*1.75,l[1],fs+(k===8?2:0),'left',l[2]); });
    S.read('Lignes de courant = cercles (orthoradiales) : le courant fait le tour. Équipotentielles = demi-droites radiales (θ = cste), V varie linéairement avec θ.\nL’anneau extérieur est plus long → plus résistant → il transporte moins de courant (j ∝ 1/r).');
  }};
};

/* ---------- TD2 : câble coaxial avec fuite ---------- */
A.coaxleak = S=>{
  const ds=S.ui.slider('δ = √(ρ ln(R₂/R₁) / 2π(ρ₁+ρ₂))',0.1,1.5,0.01,0.35,v=>v.toFixed(2)+' L');
  return {always:false,draw(){
    const c=S.ctx,P=S.P,x0=30,x1=S.w-30,y1=S.h*0.32,y2=S.h*0.1,d=ds.v;
    c.fillStyle=H.rgba(P.ink3,0.3); c.fillRect(x0,y2-8,x1-x0,16); c.fillRect(x0,y1-8,x1-x0,16); c.fillStyle=H.rgba(P.rem,0.08); c.fillRect(x0,y2+8,x1-x0,y1-y2-16);
    H.text(c,'âme (A₁) — V₁(x), i(x) →',x0+4,y1+22,P.ink2,12,'left',700); H.text(c,'armature (A₂) — V₂(x), ← i(x)',x0+4,y2-20,P.ink2,12,'left',700);
    for(let k=0;k<16;k++){ const x=x0+(k+0.5)*(x1-x0)/16, f=Math.exp(-((x-x0)/(x1-x0))/d); if(f>0.02) H.arrow(c,x,y1-10,x,y1-10-(y1-y2-24)*f,H.rgba(P.rem,0.3+0.7*f),1.5+2*f,7); }
    H.text(c,'di_f (fuite à travers l’isolant)',x1-4,(y1+y2)/2,P.rem,12,'right',700);
    H.plot(c,P,{x:12,y:S.h*0.44,w:S.w-24,h:S.h*0.54},[{f:x=>Math.exp(-x/d),col:P.acc}],{xmin:0,xmax:1,ymin:0,ymax:1.1,col:P.acc,yl:'U(x)/U₀ = i(x)/i₀ = e^(−x/δ)',xl:'x / L',marks:[{x:Math.min(d,0.98),t:'δ'}]});
    S.read('Câble semi-infini : U = V₁−V₂ et i décroissent en e^(−x/δ). Plus l’isolant est bon (ρ grand), plus δ est grand → moins de pertes.\nV₁ décroît de ρ₁/(ρ₁+ρ₂)·U₀, V₂ croît de ρ₂/(ρ₁+ρ₂)·U₀ : ils se rejoignent à l’infini.');
  }};
};
})();
