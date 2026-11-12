/* ============ Animations : Chapitre 0 & 1 ============ */
(function(){
const A=window.EM_A, H=window.EM_H;

/* ---------- Produit scalaire ---------- */
A.dot = S=>{
  let u={x:3,y:2};
  const k=()=>Math.min(S.w/11,S.h/7.5), O=()=>({x:S.w*0.28,y:S.h*0.68});
  S.draggables.push({r:26,get:()=>{const o=O();return{x:o.x+u.x*k(),y:o.y-u.y*k()}},set:(x,y)=>{const o=O();u={x:(x-o.x)/k(),y:(o.y-y)/k()};}});
  const vl=S.ui.slider('‖v‖',1,6,0.5,4,v=>v.toFixed(1));
  return {always:false,draw(){
    const c=S.ctx,P=S.P,o=O(),K=k();
    for(let i=-6;i<=12;i++){H.line(c,o.x+i*K,0,o.x+i*K,S.h,P.line,1);} for(let j=-6;j<=8;j++){H.line(c,0,o.y-j*K,S.w,o.y-j*K,P.line,1);}
    const v=vl.v, dotp=u.x*v, nu=Math.hypot(u.x,u.y), th=Math.atan2(u.y,u.x);
    const px=o.x+u.x*K;
    H.line(c,px,o.y-u.y*K,px,o.y,P.ink3,1.5,[5,4]);
    c.strokeStyle=dotp>=0?P.ok:P.bad; c.lineWidth=7; c.globalAlpha=.45; c.beginPath(); c.moveTo(o.x,o.y); c.lineTo(px,o.y); c.stroke(); c.globalAlpha=1;
    H.arrow(c,o.x,o.y,o.x+v*K,o.y,P.e,3,12); H.text(c,'v',o.x+v*K+8,o.y+14,P.e,16,'left',700);
    H.arrow(c,o.x,o.y,px,o.y-u.y*K,P.acc,3,12); H.text(c,'u  (glisse-moi)',px+10,o.y-u.y*K-10,P.acc,14,'left',700);
    c.strokeStyle=P.ink2; c.lineWidth=1.5; c.beginPath(); c.arc(o.x,o.y,34,Math.min(0,-th),Math.max(0,-th)); c.stroke();
    H.text(c,'θ = '+(th*180/Math.PI).toFixed(0)+'°',o.x+40,o.y-16,P.ink2,13);
    H.text(c,'projection ‖u‖cosθ = '+(u.x).toFixed(2),(o.x+px)/2,o.y+22,dotp>=0?P.ok:P.bad,13,'center',600);
    S.read(`u·v = ‖u‖‖v‖cosθ = ${nu.toFixed(2)} × ${v.toFixed(1)} × ${Math.cos(th).toFixed(2)} = ${dotp.toFixed(2)}   ${Math.abs(dotp)<0.15?'→ ≈ 0 : vecteurs perpendiculaires':(dotp>0?'→ positif : même sens':'→ négatif : sens opposés')}`);
  }};
};

/* ---------- Produit vectoriel ---------- */
A.cross = S=>{
  let u={x:3,y:0.6}, v={x:1,y:2.6};
  const k=()=>Math.min(S.w/10,S.h/6.4), O=()=>({x:S.w*0.3,y:S.h*0.72});
  const mk=p=>({r:26,get:()=>{const o=O();return{x:o.x+p.x*k(),y:o.y-p.y*k()}},set:(x,y)=>{const o=O();p.x=(x-o.x)/k();p.y=(o.y-y)/k();}});
  S.draggables.push(mk(u),mk(v));
  return {always:false,draw(){
    const c=S.ctx,P=S.P,o=O(),K=k(); const z=u.x*v.y-u.y*v.x;
    const U={x:o.x+u.x*K,y:o.y-u.y*K}, V={x:o.x+v.x*K,y:o.y-v.y*K}, W={x:U.x+v.x*K,y:U.y-v.y*K};
    c.fillStyle=H.rgba(z>=0?P.ok:P.bad,0.16); c.beginPath(); c.moveTo(o.x,o.y); c.lineTo(U.x,U.y); c.lineTo(W.x,W.y); c.lineTo(V.x,V.y); c.closePath(); c.fill();
    H.line(c,U.x,U.y,W.x,W.y,P.ink3,1,[4,4]); H.line(c,V.x,V.y,W.x,W.y,P.ink3,1,[4,4]);
    H.arrow(c,o.x,o.y,U.x,U.y,P.acc,3,12); H.text(c,'u',U.x+8,U.y+12,P.acc,16,'left',700);
    H.arrow(c,o.x,o.y,V.x,V.y,P.e,3,12); H.text(c,'v',V.x+8,V.y-6,P.e,16,'left',700);
    const bx=S.w-110, by=70;
    if(Math.abs(z)>0.05){ (z>0?H.dotOut:H.crossIn)(c,bx,by,26,z>0?P.ok:P.bad); }
    H.text(c,'u ∧ v',bx,by+44,P.ink,14,'center',700);
    H.text(c,Math.abs(z)<0.05?'nul (colinéaires)':(z>0?'sort de l’écran ⊙':'rentre dans l’écran ⊗'),bx,by+64,P.ink2,12.5,'center');
    S.read(`‖u∧v‖ = aire du parallélogramme = |uₓvᵧ − uᵧvₓ| = ${Math.abs(z).toFixed(2)}   (composante z = ${z.toFixed(2)})\nRègle de la main droite : index = u, majeur = v, pouce = u∧v. Fais tourner v de l’autre côté de u : le sens s’inverse.`);
  }};
};

/* ---------- Gradient & lignes de niveau ---------- */
A.gradient = S=>{
  const mode=S.ui.choice([['bol','Bol x²+y²'],['coll','Colline'],['dip','Deux charges ±']],'coll');
  const show=S.ui.choice([['g','grad f (montée)'],['e','−grad f (= E si f = V)']],'g');
  let off=null, key='';
  const toU=(x,y)=>({X:(x-S.w/2)/(S.h/4.2),Y:(S.h/2-y)/(S.h/4.2)});
  const f=(X,Y)=>{ const m=mode.v; if(m==='bol') return (X*X+Y*Y)/4; if(m==='coll') return 1.6*Math.exp(-((X-0.6)**2+(Y-0.2)**2)/1.2)+0.8*Math.exp(-((X+1.7)**2+(Y+0.6)**2)/0.5);
    const r1=Math.hypot(X-1,Y)+0.08, r2=Math.hypot(X+1,Y)+0.08; return 0.5/r1-0.5/r2; };
  const g=(X,Y)=>{const h=1e-3;return{x:(f(X+h,Y)-f(X-h,Y))/(2*h),y:(f(X,Y+h)-f(X,Y-h))/(2*h)};};
  function heat(){ const s=3, W=Math.ceil(S.w/s), Hh=Math.ceil(S.h/s); off=document.createElement('canvas'); off.width=W; off.height=Hh;
    const oc=off.getContext('2d'), im=oc.createImageData(W,Hh), P=S.P; const vals=new Float32Array(W*Hh);
    let mn=1e9,mx=-1e9; for(let j=0;j<Hh;j++)for(let i=0;i<W;i++){const u=toU(i*s,j*s);let v=f(u.X,u.Y); if(mode.v==='dip') v=Math.tanh(v*1.5); vals[j*W+i]=v; mn=Math.min(mn,v); mx=Math.max(mx,v);}
    const hi=H.mix('#ffffff',P.qp,1), lo=H.mix('#ffffff',P.qn,1), mid=P.dark?[30,32,45]:[250,250,248];
    const lev=v=>Math.floor((v-mn)/(mx-mn+1e-9)*12);
    for(let j=0;j<Hh;j++)for(let i=0;i<W;i++){ const v=vals[j*W+i]; let t=(v-mn)/(mx-mn+1e-9); let col;
      if(mode.v==='dip'){ const a=Math.abs(v); col=(v>0?hi:lo).map((cc,q)=>mid[q]+(cc-mid[q])*a*0.75); }
      else col=[0,1,2].map(q=>mid[q]+((P.dark?[120,90,255]:[90,63,214])[q]-mid[q])*t*0.6);
      const L=lev(v); const edge=(i<W-1&&lev(vals[j*W+i+1])!==L)||(j<Hh-1&&lev(vals[(j+1)*W+i])!==L);
      const p=(j*W+i)*4; const d=edge?0.55:1; im.data[p]=col[0]*d; im.data[p+1]=col[1]*d; im.data[p+2]=col[2]*d; im.data[p+3]=255; }
    oc.putImageData(im,0,0); key=mode.v+S.w+'x'+S.h+P.dark; }
  return {always:false,resize(){off=null;},theme(){off=null;},draw(){
    const c=S.ctx,P=S.P; if(!off||key!==mode.v+S.w+'x'+S.h+P.dark) heat();
    c.imageSmoothingEnabled=true; c.drawImage(off,0,0,S.w,S.h);
    const sg=show.v==='g'?1:-1, col=show.v==='g'?P.acc:P.e;
    for(let y=22;y<S.h;y+=34)for(let x=22;x<S.w;x+=34){ const u=toU(x,y), G=g(u.X,u.Y), m=Math.hypot(G.x,G.y); if(m<1e-4) continue;
      const L=Math.min(15,6+10*Math.sqrt(m)); H.arrow(c,x,y,x+sg*G.x/m*L,y-sg*G.y/m*L,H.rgba(col,0.85),1.5,5); }
    if(S.mouse.in){ const u=toU(S.mouse.x,S.mouse.y), G=g(u.X,u.Y), m=Math.hypot(G.x,G.y)||1;
      const tx=-G.y/m, ty=G.x/m; H.line(c,S.mouse.x-tx*60,S.mouse.y+ty*60,S.mouse.x+tx*60,S.mouse.y-ty*60,P.ink,2,[6,4]);
      H.arrow(c,S.mouse.x,S.mouse.y,S.mouse.x+sg*G.x/m*55,S.mouse.y-sg*G.y/m*55,col,3.5,13);
      S.read(`f = ${f(u.X,u.Y).toFixed(3)}   ‖grad f‖ = ${m.toFixed(3)} (la pente)\nTirets noirs = direction de la ligne de niveau ; la flèche lui est toujours perpendiculaire.`);
    } else S.read('Survole la carte : la flèche (gradient) est toujours ⟂ aux lignes de niveau (bandes sombres) et pointe vers la montée la plus raide.');
  }};
};

/* ---------- Flux à travers une surface ---------- */
A.flux = S=>{
  const th=S.ui.slider('angle θ entre n et A',0,180,1,30,v=>v+'°');
  const sz=S.ui.slider('taille S',0.3,1,0.05,0.7,v=>v.toFixed(2));
  return {always:false,draw(){
    const c=S.ctx,P=S.P, cx=S.w*0.55, cy=S.h/2, L=S.h*0.42*sz.v; const t=th.v*Math.PI/180;
    // surface : segment perpendiculaire à n ; n fait l'angle t avec +x
    const nx=Math.cos(t), ny=-Math.sin(t); const sx=-ny, sy=nx;
    const ax=cx-sx*L, ay=cy-sy*L, bx=cx+sx*L, by=cy+sy*L;
    let hits=0, tot=0;
    for(let y=14;y<S.h;y+=18){ tot++;
      // intersection de la droite horizontale y avec le segment
      const dy=by-ay; let hit=false, xh=0; if(Math.abs(dy)>1e-6){ const s=(y-ay)/dy; if(s>=0&&s<=1){hit=true;xh=ax+s*(bx-ax);} }
      if(hit){hits++; H.arrow(c,20,y,xh-2,y,P.e,2,7); H.line(c,xh+2,y,S.w-20,y,H.rgba(P.e,0.35),1.5); }
      else H.arrow(c,20,y,S.w-20,y,H.rgba(P.ink3,0.5),1.2,6);
    }
    c.strokeStyle=P.acc; c.lineWidth=6; c.lineCap='round'; c.beginPath(); c.moveTo(ax,ay); c.lineTo(bx,by); c.stroke();
    H.arrow(c,cx,cy,cx+nx*60,cy+ny*60,P.ok,3,11); H.text(c,'n',cx+nx*72,cy+ny*72,P.ok,16,'center',700);
    H.text(c,'surface S (vue de profil)',bx+10,by,P.acc,12.5,'left',600);
    const phi=Math.cos(t)*sz.v;
    S.read(`Φ = A·S·cosθ ∝ ${phi.toFixed(2)}   — lignes interceptées : ${hits}\n${Math.abs(Math.cos(t))<0.05?'θ = 90° : A est TANGENT à la surface → flux nul.':(Math.cos(t)>0?'Le champ traverse dans le sens de n → flux positif.':'Le champ traverse contre n → flux négatif.')}`);
  }};
};

/* ---------- Loi de Coulomb ---------- */
A.coulomb = S=>{
  let p1={x:0,y:0},p2={x:0,y:0}, init=false;
  const q1=S.ui.slider('q₁ (nC)',-5,5,1,2,v=>(v>0?'+':'')+v), q2=S.ui.slider('q₂ (nC)',-5,5,1,3,v=>(v>0?'+':'')+v);
  S.draggables.push({r:26,get:()=>p1,set:(x,y)=>{p1={x,y}}},{r:26,get:()=>p2,set:(x,y)=>{p2={x,y}}});
  return {always:false,resize(){ if(!init||p1.x>S.w){p1={x:S.w*0.3,y:S.h/2};p2={x:S.w*0.7,y:S.h/2};init=true;} },draw(){
    const c=S.ctx,P=S.P; const pxcm=S.w/24; const dx=p2.x-p1.x, dy=p2.y-p1.y, d=Math.hypot(dx,dy)||1, r=d/pxcm/100;
    const F=9e9*Math.abs(q1.v*q2.v)*1e-18/(r*r); const ux=dx/d, uy=dy/d; const s=q1.v*q2.v>0?1:-1;
    H.line(c,p1.x,p1.y,p2.x,p2.y,P.ink3,1,[5,5]); H.text(c,(r*100).toFixed(1)+' cm',(p1.x+p2.x)/2,(p1.y+p2.y)/2-14,P.ink3,12.5,'center');
    if(q1.v*q2.v!==0){ const L=H.clamp(25+28*Math.log10(1+F*1e6),20,170);
      H.arrow(c,p2.x+ux*24*s,p2.y+uy*24*s,p2.x+ux*(24+L)*s,p2.y+uy*(24+L)*s,P.e,3.5,13);
      H.arrow(c,p1.x-ux*24*s,p1.y-uy*24*s,p1.x-ux*(24+L)*s,p1.y-uy*(24+L)*s,P.e,3.5,13);
      H.text(c,'F₁→₂',p2.x+ux*(30+L)*s,p2.y+uy*(30+L)*s-14,P.e,13,'center',700); H.text(c,'F₂→₁',p1.x-ux*(30+L)*s,p1.y-uy*(30+L)*s-14,P.e,13,'center',700); }
    H.charge(c,p1.x,p1.y,18,q1.v,P); H.charge(c,p2.x,p2.y,18,q2.v,P);
    H.text(c,'q₁',p1.x,p1.y+32,P.ink2,13,'center',700); H.text(c,'q₂',p2.x,p2.y+32,P.ink2,13,'center',700);
    S.read(q1.v*q2.v===0?'Une charge nulle : aucune force.':`F = (1/4πε₀)·|q₁q₂|/r² = 9×10⁹ × ${Math.abs(q1.v*q2.v)}×10⁻¹⁸ / (${r.toFixed(3)})² = ${(F*1e6).toFixed(2)} µN — ${s>0?'RÉPULSION (même signe)':'ATTRACTION (signes opposés)'}\nLes deux forces ont même norme et sens opposés (3ᵉ loi de Newton). Double la distance → force ÷ 4.`);
  }};
};

/* ---------- Carte de champ E et potentiel V ---------- */
A.field = S=>{
  let Q=[]; let off=null, lines=[], dirty=true;
  const preset=S.ui.choice([['dip','Dipôle'],['pp','Deux +'],['one','Charge seule'],['cap','Condensateur']],'dip');
  const showV=S.ui.check(' Potentiel V (couleurs)',true), showL=S.ui.check(' Lignes de champ',true);
  S.ui.button('+ charge',()=>{Q.push({x:S.w*(0.3+0.4*Math.random()),y:S.h*(0.25+0.5*Math.random()),q:1});rebuild();});
  S.ui.button('− charge',()=>{Q.push({x:S.w*(0.3+0.4*Math.random()),y:S.h*(0.25+0.5*Math.random()),q:-1});rebuild();});
  S.ui.button('Effacer',()=>{Q=[];rebuild();});
  function setPreset(){ const w=S.w,h=S.h; Q=[];
    if(preset.v==='dip'){Q=[{x:w*0.38,y:h/2,q:1},{x:w*0.62,y:h/2,q:-1}];}
    if(preset.v==='pp'){Q=[{x:w*0.38,y:h/2,q:1},{x:w*0.62,y:h/2,q:1}];}
    if(preset.v==='one'){Q=[{x:w/2,y:h/2,q:1}];}
    if(preset.v==='cap'){for(let i=0;i<9;i++){const x=w*0.32+i*w*0.045; Q.push({x,y:h*0.33,q:0.6},{x,y:h*0.67,q:-0.6});}}
    rebuild(); }
  preset.onchange=setPreset;
  function rebuild(){ S.draggables.length=0; Q.forEach(o=>S.draggables.push({r:18,get:()=>o,set:(x,y)=>{o.x=x;o.y=y;dirty=true;},end:()=>{dirty=true;}})); dirty=true; S.dirty=true; }
  const E=(x,y)=>{let ex=0,ey=0;for(const o of Q){const dx=x-o.x,dy=y-o.y,r2=dx*dx+dy*dy+25,r=Math.sqrt(r2);ex+=o.q*dx/(r2*r);ey+=o.q*dy/(r2*r);}return{x:ex,y:ey};};
  const V=(x,y)=>{let v=0;for(const o of Q)v+=o.q/Math.sqrt((x-o.x)**2+(y-o.y)**2+25);return v;};
  function compute(){ const P=S.P, s=4, W=Math.ceil(S.w/s), Hh=Math.ceil(S.h/s);
    off=document.createElement('canvas'); off.width=W; off.height=Hh; const oc=off.getContext('2d'), im=oc.createImageData(W,Hh);
    const hi=H.mix('#ffffff',P.qp,1), lo=H.mix('#ffffff',P.qn,1), mid=P.dark?[28,30,42]:[247,246,242];
    const vals=new Float32Array(W*Hh); for(let j=0;j<Hh;j++)for(let i=0;i<W;i++) vals[j*W+i]=Math.tanh(V(i*s,j*s)*70);
    const lev=v=>Math.round(v*8);
    for(let j=0;j<Hh;j++)for(let i=0;i<W;i++){const v=vals[j*W+i],a=Math.abs(v);const col=(v>0?hi:lo).map((cc,q)=>mid[q]+(cc-mid[q])*a*0.55);
      const L=lev(v); const edge=(i<W-1&&lev(vals[j*W+i+1])!==L)||(j<Hh-1&&lev(vals[(j+1)*W+i])!==L);
      const p=(j*W+i)*4,d=edge?(P.dark?1.6:0.8):1; im.data[p]=Math.min(255,col[0]*d);im.data[p+1]=Math.min(255,col[1]*d);im.data[p+2]=Math.min(255,col[2]*d);im.data[p+3]=255;}
    oc.putImageData(im,0,0);
    lines=[]; const pos=Q.filter(o=>o.q>0), src=pos.length?pos:Q.filter(o=>o.q<0), dir=pos.length?1:-1;
    src.forEach(o=>{ const n=Math.max(6,Math.round(14*Math.abs(o.q))); for(let k=0;k<n;k++){ const a=2*Math.PI*(k+0.5)/n; let x=o.x+12*Math.cos(a), y=o.y+12*Math.sin(a); const pts=[[x,y]];
      for(let it=0;it<700;it++){ let e=E(x,y),m=Math.hypot(e.x,e.y)||1; const mx=x+dir*2*e.x/m, my=y+dir*2*e.y/m; e=E(mx,my); m=Math.hypot(e.x,e.y)||1; x+=dir*4*e.x/m; y+=dir*4*e.y/m; pts.push([x,y]);
        if(x<-40||y<-40||x>S.w+40||y>S.h+40) break; if(Q.some(p=>p.q*dir<0&&Math.hypot(p.x-x,p.y-y)<10)) break; }
      lines.push(pts);} });
    dirty=false; }
  return {always:false,resize(){ if(!Q.length) setPreset(); else dirty=true; },theme(){dirty=true;},draw(){
    const c=S.ctx,P=S.P; if(dirty||!off) compute();
    if(showV.v) c.drawImage(off,0,0,S.w,S.h);
    if(showL.v){ c.strokeStyle=H.rgba(P.e,0.75); c.lineWidth=1.4; lines.forEach(pts=>{c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke();
      const m=Math.floor(pts.length/2); if(pts.length>12){const a=pts[m-1],b=pts[m+1]; const d=pts.length? (Q.some(o=>o.q>0)?1:-1):1; H.arrow(c,a[0],a[1],a[0]+(b[0]-a[0])*d*2.4,a[1]+(b[1]-a[1])*d*2.4,P.e,1.5,7);} }); }
    else { for(let y=18;y<S.h;y+=30)for(let x=18;x<S.w;x+=30){const e=E(x,y),m=Math.hypot(e.x,e.y);if(m<1e-7)continue;const a=H.clamp(0.25+Math.log10(m*1e4)*0.3,0.15,1); H.arrow(c,x-e.x/m*7,y-e.y/m*7,x+e.x/m*7,y+e.y/m*7,H.rgba(P.e,a),1.4,5);} }
    Q.forEach(o=>H.charge(c,o.x,o.y,11,o.q,P));
    if(S.mouse.in && !S.mouse.down){ const e=E(S.mouse.x,S.mouse.y), m=Math.hypot(e.x,e.y); if(m>0){ const L=H.clamp(18+14*Math.log10(m*1e5),12,70); H.arrow(c,S.mouse.x,S.mouse.y,S.mouse.x+e.x/m*L,S.mouse.y+e.y/m*L,P.ink,2.5,10);} c.fillStyle=P.ink; c.beginPath(); c.arc(S.mouse.x,S.mouse.y,3,0,7); c.fill();
      S.read(`Sonde : V ≈ ${(V(S.mouse.x,S.mouse.y)*100).toFixed(2)} (u.a.)   ‖E‖ ≈ ${(m*1e4).toFixed(2)} (u.a.)\nE pointe vers les V décroissants (du rouge vers le bleu) et coupe les équipotentielles à angle droit.`);
    } else S.read('Glisse les charges. Rouge = V élevé, bleu = V bas, liserés = équipotentielles. Survole pour sonder E et V.');
    if(S.mouse.down) dirty=true;
  }};
};

/* ---------- Anneau chargé : superposition ---------- */
A.ring = S=>{
  const zs=S.ui.slider('z / R',0,3,0.01,1.2,v=>v.toFixed(2)); S.ui.play();
  return {draw(){
    const c=S.ctx,P=S.P; const sceneH=S.h*0.58; const cx=S.w*0.14, cy=sceneH*0.52; const R=Math.min(85,sceneH*0.38,(0.82*S.w-30)/3.3);
    const z=zs.v; const proj=(X,Y,Z)=>({x:cx+X*R+Z*R*0.33,y:cy-Y*R+Z*R*0.12});
    H.line(c,cx-20,cy,S.w-16,cy,P.ink3,1.2); H.text(c,'axe Oz',S.w-20,cy-12,P.ink3,12,'right');
    // anneau
    c.strokeStyle=P.qp; c.lineWidth=3; c.beginPath(); for(let i=0;i<=80;i++){const f=i/80*2*Math.PI; const p=proj(0,Math.cos(f),Math.sin(f)); i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y);} c.stroke();
    const M=proj(z,0,0); const phi=(S.t*0.6)%(2*Math.PI);
    const N=12; for(let i=0;i<N;i++){const f=i/N*2*Math.PI; const p=proj(0,Math.cos(f),Math.sin(f)); c.fillStyle=H.rgba(P.qp,0.6); c.beginPath(); c.arc(p.x,p.y,3,0,7); c.fill();}
    const d2=1+z*z, len=Math.min(95,85/d2*1.2); let sumx=0,sumy=0;
    [phi,phi+Math.PI].forEach((f,k)=>{ const p=proj(0,Math.cos(f),Math.sin(f)); const vx=z*R-0.33*Math.sin(f)*R, vy=Math.cos(f)*R-0.12*Math.sin(f)*R; const m=Math.hypot(vx,vy)||1;
      const ex=vx/m*len, ey=vy/m*len; H.line(c,p.x,p.y,M.x,M.y,H.rgba(P.ink3,0.6),1,[4,4]); c.fillStyle=P.qp; c.beginPath(); c.arc(p.x,p.y,6,0,7); c.fill(); H.text(c,'dq',p.x-10,p.y-12,P.qp,12,'right',700);
      H.arrow(c,M.x,M.y,M.x+ex,M.y+ey,H.rgba(P.e,0.85),2.2,9); sumx+=ex; sumy+=ey; });
    H.arrow(c,M.x,M.y,M.x+sumx,M.y+sumy*0,P.ok,4,13);
    c.fillStyle=P.ink; c.beginPath(); c.arc(M.x,M.y,4.5,0,7); c.fill(); H.text(c,'M',M.x-4,M.y+16,P.ink,13,'right',700);
    H.text(c,'Les composantes ⟂ à l’axe des deux dE se compensent ; seule la somme axiale (vert) survit.',16,sceneH-6,P.ink2,12.5);
    const f=x=>x/Math.pow(1+x*x,1.5);
    H.plot(c,P,{x:12,y:sceneH+8,w:S.w-24,h:S.h-sceneH-16},f,{xmin:0,xmax:3,ymin:0,ymax:0.45,col:P.e,yl:'E(z)  ∝ z/(R²+z²)^(3/2)',xl:'z/R',marker:z,marks:[{x:1/Math.SQRT2,t:'max en R/√2'}]});
    S.read(`E(z) = Qz / [4πε₀ (R²+z²)^(3/2)] → ${f(z).toFixed(3)} × Q/(4πε₀R²)   ${z<0.02?'(au centre : E = 0 par symétrie)':(z>2.5?'(loin : ≈ Q/4πε₀z², comme une charge ponctuelle)':'')}`);
  }};
};

/* ---------- Potentiel & mouvement d'une charge ---------- */
A.potential = S=>{
  const prof=S.ui.choice([['aff','V affine'],['exp','V exponentiel'],['bar','Barrière de potentiel']],'aff');
  const sg=S.ui.choice([['p','charge q > 0'],['n','électron (q < 0)']],'p');
  const v0=S.ui.slider('v₀',-3,3,0.1,0,v=>v.toFixed(1));
  const showEp=S.ui.check(' tracer Eₚ = qV',false);
  let x=1,v=0,run=false; S.ui.button('▶ Lâcher',()=>{reset();run=true;}); S.ui.button('↺',()=>{reset();run=false;});
  const Vf=X=>prof.v==='aff'?8-0.7*X:(prof.v==='exp'?8*Math.exp(-0.35*X):1+5*Math.exp(-((X-5)**2)));
  const Ef=X=>-(Vf(X+1e-3)-Vf(X-1e-3))/2e-3;
  function reset(){ const q=sg.v==='p'?1:-1; x = (prof.v==='bar')?1.2:(q>0?1:9); v=v0.v; }
  prof.onchange=()=>{reset();run=false;}; sg.onchange=()=>{reset();run=false;}; reset();
  return {draw(dt){
    const c=S.ctx,P=S.P,q=sg.v==='p'?1:-1;
    if(run){ for(let i=0;i<10;i++){ const a=q*Ef(x)*0.6; v+=a*dt/10*3; x+=v*dt/10*3; } if(x<0||x>10){run=false;} }
    const hTop=S.h*0.5;
    const pv=H.plot(c,P,{x:12,y:8,w:S.w*0.7,h:hTop-12},showEp.v?[{f:Vf,col:P.acc},{f:X=>q*Vf(X),col:P.rem}]:Vf,{xmin:0,xmax:10,ymin:showEp.v&&q<0?-9:0,ymax:9,col:P.acc,yl:showEp.v?'V(x) (violet)   Eₚ=qV (orange)':'V(x)',xl:'x'});
    const xc=H.clamp(x,0,10); const bx=pv.X(xc), by=pv.Y(showEp.v?q*Vf(xc):Vf(xc));
    H.charge(c,bx,by-9,9,q,P);
    const pe=H.plot(c,P,{x:12,y:hTop+4,w:S.w*0.7,h:S.h-hTop-12},Ef,{xmin:0,xmax:10,ymin:-6,ymax:6,col:P.e,yl:'E(x) = −dV/dx',xl:'x',marker:xc});
    const F=q*Ef(xc); H.arrow(c,bx,by+14,bx+H.clamp(F*14,-60,60),by+14,P.e,2.5,8);
    // barres d'énergie
    const Ep=q*Vf(xc), Ec=0.5*v*v; const bx0=S.w*0.76, bw=S.w*0.2, base=S.h-30, sc=(S.h-80)/25;
    H.text(c,'Énergies',bx0+bw/2,24,P.ink,13,'center',700);
    const bar=(i,val,col,lab)=>{const X=bx0+i*bw/3+6, W=bw/3-12, Y0=base-12*sc; c.fillStyle=col; c.fillRect(X,Y0,W,-val*sc); H.text(c,lab,X+W/2,base+12,P.ink2,11.5,'center',600);};
    H.line(c,bx0,base-12*sc,bx0+bw,base-12*sc,P.ink3,1);
    bar(0,Ep,P.acc,'Eₚ'); bar(1,Ec,P.ok,'E꜀'); bar(2,Ep+Ec,P.ink2,'total');
    S.read(`${q>0?'Charge positive : elle descend les potentiels (sens de E).':'Électron : il remonte les potentiels (sens opposé à E) mais DESCEND son énergie potentielle Eₚ = qV.'}  x = ${xc.toFixed(2)}  V = ${Vf(xc).toFixed(2)}  E = ${Ef(xc).toFixed(2)}\nEₚ + E꜀ = constante : ce que perd l’une, l’autre le gagne.${prof.v==='bar'?' Barrière : il faut assez d’énergie cinétique (v₀) pour passer le sommet !':''}`);
  }};
};

/* ---------- Théorème de Gauss : géométrie ---------- */
A.gauss = S=>{
  const mode=S.ui.choice([['pt','Charge ponctuelle'],['fil','Fil infini'],['plan','Plan infini']],'pt');
  const rr=S.ui.slider('r (taille de la surface de Gauss)',0.4,2.6,0.01,1.2,v=>v.toFixed(2));
  return {always:false,draw(){
    const c=S.ctx,P=S.P,W=S.w*0.56,cx=W/2,cy=S.h/2,k=Math.min(W,S.h)/6.2,r=rr.v;
    if(mode.v==='pt'){ const n=16; for(let i=0;i<n;i++){const a=i/n*2*Math.PI; H.arrow(c,cx+14*Math.cos(a),cy+14*Math.sin(a),cx+(3*k)*Math.cos(a),cy+(3*k)*Math.sin(a),H.rgba(P.e,0.8),1.6,7);}
      c.fillStyle=H.rgba(P.acc,0.10); c.strokeStyle=P.acc; c.lineWidth=2; c.setLineDash([6,4]); c.beginPath(); c.arc(cx,cy,r*k,0,7); c.fill(); c.stroke(); c.setLineDash([]);
      c.strokeStyle=H.rgba(P.acc,0.5); c.beginPath(); c.ellipse(cx,cy,r*k,r*k*0.3,0,0,7); c.stroke();
      H.charge(c,cx,cy,10,1,P); H.text(c,'sphère : aire 4πr²',cx,cy+r*k+16,P.acc,12.5,'center',600); }
    if(mode.v==='fil'){ H.line(c,cx,14,cx,S.h-14,P.qp,4); const h=S.h*0.55; const top=cy-h/2, bot=cy+h/2;
      for(let j=0;j<6;j++){const y=top+12+j*(h-24)/5; H.arrow(c,cx+4,y,cx+3*k,y,H.rgba(P.e,0.8),1.6,7); H.arrow(c,cx-4,y,cx-3*k,y,H.rgba(P.e,0.8),1.6,7);}
      c.strokeStyle=P.acc; c.lineWidth=2; c.setLineDash([6,4]); c.fillStyle=H.rgba(P.acc,0.10); c.fillRect(cx-r*k,top,2*r*k,h); c.strokeRect(cx-r*k,top,2*r*k,h);
      c.beginPath(); c.ellipse(cx,top,r*k,r*k*0.25,0,0,7); c.stroke(); c.beginPath(); c.ellipse(cx,bot,r*k,r*k*0.25,0,0,7); c.stroke(); c.setLineDash([]);
      H.text(c,'cylindre : aire latérale 2πrh',cx,bot+r*k*0.25+16,P.acc,12.5,'center',600); H.text(c,'h',cx+r*k+8,cy,P.acc,13,'left',700); }
    if(mode.v==='plan'){ c.fillStyle=H.rgba(P.qp,0.25); c.beginPath(); c.moveTo(20,cy+18); c.lineTo(W-60,cy+18); c.lineTo(W-20,cy-18); c.lineTo(60,cy-18); c.closePath(); c.fill();
      for(let i=0;i<9;i++){const x=40+i*(W-80)/8; H.arrow(c,x,cy-8,x,cy-3*k*0.9,H.rgba(P.e,0.8),1.6,7); H.arrow(c,x,cy+8,x,cy+3*k*0.9,H.rgba(P.e,0.8),1.6,7);}
      const bw=k*0.9; c.strokeStyle=P.acc; c.lineWidth=2; c.setLineDash([6,4]); c.fillStyle=H.rgba(P.acc,0.10); c.fillRect(cx-bw,cy-r*k,2*bw,2*r*k); c.strokeRect(cx-bw,cy-r*k,2*bw,2*r*k); c.setLineDash([]);
      H.text(c,'boîte : 2 faces d’aire S (constante !)',cx,cy+r*k+16,P.acc,12.5,'center',600); }
    const f = mode.v==='pt'?x=>1/(x*x):(mode.v==='fil'?x=>1/x:x=>1);
    H.plot(c,P,{x:W+10,y:14,w:S.w-W-22,h:S.h-28},f,{xmin:0,xmax:2.7,ymin:0,ymax:4,col:P.e,yl:mode.v==='pt'?'E ∝ 1/r²':(mode.v==='fil'?'E ∝ 1/r':'E = σ/2ε₀ = cste'),xl:'r',marker:r});
    const area = mode.v==='pt'?'4πr²':(mode.v==='fil'?'2πrh':'2S');
    S.read(`Flux total = Q_int/ε₀ : il NE dépend PAS de r (mêmes lignes qui traversent).\nIl se répartit sur l’aire utile ${area} ${mode.v==='plan'?'qui ne grandit pas → E constant.':(mode.v==='fil'?'qui croît comme r → E en 1/r.':'qui croît comme r² → E en 1/r².')}`);
  }};
};

/* ---------- Divergence & rotationnel : roue à aubes ---------- */
A.divrot = S=>{
  const fld=S.ui.choice([['src','Source (ρ>0)'],['sink','Puits (ρ<0)'],['uni','Uniforme'],['rot','Tourbillon'],['vor','Vortex 1/r (fil)'],['riv','Rivière']],'src');
  let wheel={x:0,y:0}, ang=0, parts=[], init=false;
  S.draggables.push({r:34,get:()=>wheel,set:(x,y)=>{wheel={x,y}}});
  const a0=0.32;
  const toN=(x,y)=>{const s=Math.min(S.w,S.h)/2.3;return{X:(x-S.w/2)/s,Y:(S.h/2-y)/s};};
  const F=(X,Y)=>{ const r2=X*X+Y*Y, m=fld.v;
    if(m==='src'||m==='sink'){const s=m==='src'?1:-1; const f=r2<a0*a0?1/(a0*a0):1/r2; return{x:s*0.35*X*f,y:s*0.35*Y*f};}
    if(m==='uni') return{x:0.8,y:0};
    if(m==='rot') return{x:-0.8*Y,y:0.8*X};
    if(m==='vor'){const f=r2<a0*a0?1/(a0*a0):1/r2; return{x:-0.35*Y*f,y:0.35*X*f};}
    if(m==='riv'){return{x:1.1*(1-Y*Y/1.2),y:0};} };
  const diff=(X,Y)=>{const h=0.004;const a=F(X+h,Y),b=F(X-h,Y),c=F(X,Y+h),d=F(X,Y-h);return{div:(a.x-b.x)/(2*h)+(c.y-d.y)/(2*h),rot:(a.y-b.y)/(2*h)-(c.x-d.x)/(2*h)};};
  function spawn(p){p.x=Math.random()*S.w;p.y=Math.random()*S.h;p.life=1+Math.random()*3;}
  return {resize(){ if(!init){wheel={x:S.w*0.68,y:S.h*0.32};init=true;} if(!parts.length) for(let i=0;i<260;i++){const p={};spawn(p);parts.push(p);} },draw(dt){
    const c=S.ctx,P=S.P,s=Math.min(S.w,S.h)/2.3;
    if(fld.v==='src'||fld.v==='sink'||fld.v==='vor'){ c.fillStyle=H.rgba(fld.v==='sink'?P.qn:(fld.v==='vor'?P.b:P.qp),0.15); c.beginPath(); c.arc(S.w/2,S.h/2,a0*s,0,7); c.fill(); }
    for(let y=20;y<S.h;y+=32)for(let x=20;x<S.w;x+=32){const n=toN(x,y),v=F(n.X,n.Y),m=Math.hypot(v.x,v.y);if(m<1e-6)continue;const L=H.clamp(m*14,3,13);H.arrow(c,x-v.x/m*L/2,y+v.y/m*L/2,x+v.x/m*L/2,y-v.y/m*L/2,H.rgba(P.ink3,0.55),1.2,4);}
    c.fillStyle=P.acc; parts.forEach(p=>{const n=toN(p.x,p.y),v=F(n.X,n.Y); const sp=Math.min(Math.hypot(v.x,v.y),3); const k=sp>0?Math.min(1,3/Math.hypot(v.x,v.y)):1; p.x+=v.x*k*dt*s*0.5; p.y-=v.y*k*dt*s*0.5; p.life-=dt; if(p.life<0||p.x<0||p.y<0||p.x>S.w||p.y>S.h) spawn(p); c.globalAlpha=Math.min(1,p.life)*0.8; c.fillRect(p.x-1.3,p.y-1.3,2.6,2.6);}); c.globalAlpha=1;
    const n=toN(wheel.x,wheel.y), d=diff(n.X,n.Y); ang+=0.5*d.rot*dt*1.2;
    const bs=30; const dc=Math.abs(d.div)<0.05?P.ink3:(d.div>0?P.ok:P.bad);
    c.fillStyle=H.rgba(dc,0.18); c.strokeStyle=dc; c.lineWidth=2; c.fillRect(wheel.x-bs,wheel.y-bs,2*bs,2*bs); c.strokeRect(wheel.x-bs,wheel.y-bs,2*bs,2*bs);
    c.save(); c.translate(wheel.x,wheel.y); c.rotate(-ang); c.strokeStyle=P.ink; c.lineWidth=3; for(let i=0;i<4;i++){c.rotate(Math.PI/2); c.beginPath(); c.moveTo(0,0); c.lineTo(20,0); c.stroke(); c.fillStyle=P.e; c.fillRect(14,-4,8,8);} c.restore();
    c.fillStyle=P.ink; c.beginPath(); c.arc(wheel.x,wheel.y,4,0,7); c.fill();
    H.text(c,'glisse la roue',wheel.x,wheel.y+bs+14,P.ink2,11.5,'center',600);
    S.read(`div ≈ ${Math.abs(d.div)<0.05?'0':d.div.toFixed(2)}  (cadre ${Math.abs(d.div)<0.05?'gris : autant entre que sort':(d.div>0?'vert : il SORT plus qu’il n’entre → source':'rouge : il ENTRE plus → puits')})\nrot_z ≈ ${Math.abs(d.rot)<0.05?'0':d.rot.toFixed(2)}  (la roue ${Math.abs(d.rot)<0.05?'est entraînée sans tourner sur elle-même':(d.rot>0?'tourne dans le sens trigo':'tourne dans le sens horaire')})`);
  }};
};

/* ---------- Stokes / Ostrogradski : compensation des bords internes ---------- */
A.stokes = S=>{
  const mode=S.ui.choice([['c','Circulation (Stokes)'],['f','Flux (Ostrogradski)']],'c');
  const t=S.ui.slider('assembler les cellules',0,1,0.01,0,v=>Math.round(v*100)+'%');
  return {always:false,draw(){
    const c=S.ctx,P=S.P,nx=4,ny=2,cw=Math.min((S.w-80)/nx,(S.h-60)/ny),x0=(S.w-cw*nx)/2,y0=(S.h-cw*ny)/2,g=8*(1-t.v),inner=1-t.v;
    for(let i=0;i<nx;i++)for(let j=0;j<ny;j++){ const x=x0+i*cw,y=y0+j*cw; c.fillStyle=H.rgba(P.acc,0.07); c.fillRect(x+g/2,y+g/2,cw-g,cw-g);
      c.strokeStyle=H.rgba(P.ink3,0.5); c.lineWidth=1; c.strokeRect(x+g/2,y+g/2,cw-g,cw-g);
      const edges=[{a:[x+g,y+cw-g],b:[x+cw-g,y+cw-g],bd:j===ny-1,n:[0,1]},{a:[x+cw-g,y+cw-g],b:[x+cw-g,y+g],bd:i===nx-1,n:[1,0]},{a:[x+cw-g,y+g],b:[x+g,y+g],bd:j===0,n:[0,-1]},{a:[x+g,y+g],b:[x+g,y+cw-g],bd:i===0,n:[-1,0]}];
      edges.forEach(e=>{ const al=e.bd?1:inner; if(al<0.02) return; const col=e.bd?P.e:H.rgba(P.e,al*0.9);
        if(mode.v==='c'){ const mx=(e.a[0]+e.b[0])/2,my=(e.a[1]+e.b[1])/2,dx=(e.b[0]-e.a[0])*0.3,dy=(e.b[1]-e.a[1])*0.3; H.arrow(c,mx-dx,my-dy,mx+dx,my+dy,col,e.bd?2.6:1.8,8); }
        else { const mx=(e.a[0]+e.b[0])/2,my=(e.a[1]+e.b[1])/2; H.arrow(c,mx-e.n[0]*10,my-e.n[1]*10,mx+e.n[0]*16,my+e.n[1]*16,col,e.bd?2.6:1.8,8); } });
    }
    S.read(mode.v==='c'?'Chaque petite cellule a sa circulation (rot·dS). Sur un côté partagé, les deux cellules le parcourent en sens OPPOSÉS → ça s’annule.\nIl ne reste que le pourtour : ∮ A·dl = ∬ rot A · dS (Stokes).':'Chaque cellule a son flux sortant (div·dV). Sur une face partagée, ce qui SORT de l’une ENTRE dans l’autre → ça s’annule.\nIl ne reste que la surface extérieure : ∯ A·dS = ∭ div A dV (Ostrogradski).');
  }};
};
})();
