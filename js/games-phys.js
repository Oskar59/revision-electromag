/* ============ Atlas Arcade — vrais jeux de physique (ch. 0, 2, 4, 5) ============ */
(function(){
const K=window.GKINDS, D=window.GDEFS, C=window.GC; const {text,arrow,circle,glow,line,rrect,col,pick,ri,rnd,shuffle,clamp}=C;
['ch0','ch2','ch4','ch5'].forEach(k=>{ if(D[k]) D[k+'q']=D[k]; });
const fr=(v,d=2)=>(+v.toFixed(d)).toString().replace('.',',');

/* =================================================================== */
/*  CH.0 — BROUILLARD : suivre le gradient                              */
/* =================================================================== */
K.fog={
  start(G){ G.fg={keys:{}}; },
  round(G,i){ const S0=G.fg; const modes=['max','min','contour','max','contour','min','max','contour']; const mode=modes[i%modes.length];
    let bumps; for(let tries=0;tries<50;tries++){ bumps=[]; const n=ri(3,4); for(let k=0;k<n;k++) bumps.push({x:rnd(90,710),y:rnd(90,410),A:k===0?1.1:k===1?-1:pick([.6,-.6,.8]),s:rnd(55,95)}); if(bumps.every((b,j)=>bumps.every((c2,k)=>k<=j||Math.hypot(b.x-c2.x,b.y-c2.y)>140))) break; }
    const f=(x,y)=>bumps.reduce((s,b)=>s+b.A*Math.exp(-((x-b.x)**2+(y-b.y)**2)/(2*b.s*b.s)),0);
    let best={v:-1e9}, worst={v:1e9}; for(let x=20;x<780;x+=4) for(let y=50;y<440;y+=4){ const v=f(x,y); if(v>best.v) best={v,x,y}; if(v<worst.v) worst={v,x,y}; }
    const dots=[]; const st=8, lv=v=>Math.floor(v/0.12); for(let x=0;x<800;x+=st) for(let y=40;y<450;y+=st){ const a=lv(f(x,y)); if(a!==lv(f(x+st,y))||a!==lv(f(x,y+st))) dots.push([x,y,f(x,y)]); }
    let p,g2=0; do{ p={x:rnd(60,740),y:rnd(70,420)}; }while(g2++<800&&(Math.hypot(p.x-best.x,p.y-best.y)<220||Math.hypot(p.x-worst.x,p.y-worst.y)<220||(mode==='contour'&&Math.abs(f(p.x,p.y))<0.15)));
    const orbs=[]; if(mode==='contour'){ const c0=f(p.x,p.y); const cand=[]; for(let x=20;x<780;x+=5) for(let y=50;y<440;y+=5) if(Math.abs(f(x,y)-c0)<0.012) cand.push([x,y]);
      shuffle(cand).forEach(q=>{ if(orbs.length<4&&Math.hypot(q[0]-p.x,q[1]-p.y)>90&&orbs.every(o=>Math.hypot(o.x-q[0],o.y-q[1])>110)) orbs.push({x:q[0],y:q[1]}); }); S0.c0=c0; }
    Object.assign(S0,{f,best,worst,dots,mode,p,orbs,t:0,T:mode==='contour'?55:32,trail:[],drift:0});
    G.prompt(mode==='max'?'Trouve le <b>SOMMET</b> le plus haut dans le brouillard.':mode==='min'?'Trouve le <b>FOND</b> de la cuvette la plus basse.':`Ramasse les 4 orbes : elles sont toutes à ton <b>altitude actuelle</b> (f = ${fr(S0.c0)}).`);
    clearTimeout(G._ph); G._ph=setTimeout(()=>G.state==='play'&&G.prompt(null),4500); G.panel([]); },
  grad(S0,x,y){ const h=2; return [(S0.f(x+h,y)-S0.f(x-h,y))/(2*h),(S0.f(x,y+h)-S0.f(x,y-h))/(2*h)]; },
  pointer(G,t,x,y){ const S0=G.fg; if(t==='down') S0.tgt={x,y}; if(t==='move'&&S0.tgt) S0.tgt={x,y}; if(t==='up') S0.tgt=null; },
  key(G,k,d){ G.fg.keys[k]=d; },
  update(G,dt){ const S0=G.fg; if(!S0||!S0.f||G.busy) return; S0.t+=dt; const sp=150; let vx=0,vy=0; const k=S0.keys;
    if(k.ArrowLeft) vx-=1; if(k.ArrowRight) vx+=1; if(k.ArrowUp) vy-=1; if(k.ArrowDown) vy+=1;
    if(S0.tgt){ const dx=S0.tgt.x-S0.p.x, dy=S0.tgt.y-S0.p.y, L=Math.hypot(dx,dy); if(L>4){ vx=dx/L; vy=dy/L; } }
    const L=Math.hypot(vx,vy)||1; S0.p.x=clamp(S0.p.x+vx/L*sp*dt*(vx||vy?1:0),10,790); S0.p.y=clamp(S0.p.y+vy/L*sp*dt*(vx||vy?1:0),45,445);
    if(G.t%0.1<dt) { S0.trail.push([S0.p.x,S0.p.y]); if(S0.trail.length>200) S0.trail.shift(); }
    const T=S0.mode==='max'?S0.best:S0.mode==='min'?S0.worst:null;
    if(T&&Math.hypot(S0.p.x-T.x,S0.p.y-T.y)<20){ G.burst(T.x,T.y,col.gold,50); return G.success(50+Math.round(50*Math.max(0,1-S0.t/S0.T)),S0.mode==='max'?'Sommet atteint !':'Fond atteint !'); }
    if(S0.mode==='contour'){ S0.orbs.forEach(o=>{ if(!o.got&&Math.hypot(S0.p.x-o.x,S0.p.y-o.y)<16){ o.got=true; G.burst(o.x,o.y,col.b,20); G.sfx('good'); G.score+=10; G.hud(); } });
      if(S0.orbs.every(o=>o.got)) return G.success(50+Math.round(40*Math.max(0,1-S0.t/S0.T)),'Ligne de niveau suivie !'); }
    if(S0.t>S0.T) G.fail('Temps écoulé',S0.mode==='contour'?'Sur une ligne de niveau, f ne change pas : il faut se déplacer PERPENDICULAIREMENT au gradient (la flèche).':`Le gradient pointe vers la montée la plus raide : il suffisait de ${S0.mode==='max'?'SUIVRE':'remonter à CONTRE-SENS de'} la flèche.`); },
  draw(G,c){ const S0=G.fg; if(!S0||!S0.f) return; const R=95;
    S0.dots.forEach(([x,y,v])=>{ if(Math.hypot(x-S0.p.x,y-S0.p.y)>R+10&&G.state==='play') return; c.fillStyle=v>0?`rgba(255,${180-v*80|0},90,.8)`:`rgba(90,${170+v*60|0},255,.8)`; c.fillRect(x,y,2.4,2.4); });
    S0.orbs.forEach(o=>{ if(o.got) return; glow(c,o.x,o.y,22,'rgba(60,199,214,.6)'); circle(c,o.x,o.y,6,'#bff2ff'); });
    if(G.state==='play'){ c.save(); c.fillStyle='rgba(4,5,12,.97)'; c.beginPath(); c.rect(0,0,800,500); c.arc(S0.p.x,S0.p.y,R,0,7,true); c.fill('evenodd'); c.restore();
      c.strokeStyle='rgba(255,255,255,.1)'; c.lineWidth=1; c.beginPath(); c.arc(S0.p.x,S0.p.y,R,0,7); c.stroke(); }
    else { const T=S0.mode==='max'?S0.best:S0.mode==='min'?S0.worst:null; if(T) text(c,S0.mode==='max'?'▲':'▼',T.x,T.y,col.gold,22); }
    c.strokeStyle='rgba(255,212,92,.35)'; c.lineWidth=2; c.beginPath(); S0.trail.forEach((q,k)=>k?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1])); c.stroke();
    const [gx,gy]=K.fog.grad(S0,S0.p.x,S0.p.y), gm=Math.hypot(gx,gy); if(gm>1e-5){ const L2=Math.min(80,12+gm*9000); arrow(c,S0.p.x,S0.p.y,S0.p.x+gx/gm*L2,S0.p.y+gy/gm*L2,col.gold,3.5,12); text(c,'grad f',S0.p.x+gx/gm*(L2+18),S0.p.y+gy/gm*(L2+18),col.gold,11); }
    circle(c,S0.p.x,S0.p.y,9,'#fff'); circle(c,S0.p.x,S0.p.y,4,'#3cc7d6');
    const v=S0.f(S0.p.x,S0.p.y); rrect(c,640,40,150,62,12,'rgba(10,12,30,.8)'); text(c,`altitude f = ${fr(v)}`,715,60,'#fff',13); text(c,`⏱ ${Math.max(0,Math.ceil(S0.T-S0.t))} s`,715,84,col.dim,13);
  }
};
D.ch0={kind:'fog',rounds:8,lives:3,maxPerRound:100,successDelay:1400,
 intro:'Ton drone vole dans un brouillard épais : tu ne vois que les lignes de niveau autour de toi. Seul instrument : la flèche du GRADIENT. Monte au sommet, descends au fond d’une cuvette, ou suis une ligne de niveau. Déplace-toi à la souris (maintenir) ou aux flèches.',
 outro:'Le gradient pointe vers la montée la plus raide et il est perpendiculaire aux lignes de niveau. Le suivre ⇒ on monte ; à contre-sens ⇒ on descend ; perpendiculairement ⇒ on reste à la même altitude.'};

/* =================================================================== */
/*  CH.2 — OSCILLOSCOPE : déviation entre deux plaques                   */
/* =================================================================== */
const SENS=0.5; // cm de déviation sur l'écran par volt, pour e = 1 cm
K.crt={
  start(G){ G.cr={keys:{}}; },
  round(G,i){ const S0=G.cr; const e=i<2?1:pick([1,2,0.5]); const part=i<4?'électron':pick(['électron','ion positif']); const n=i<3?3:4;
    const tg=[]; for(let k=0;k<n;k++){ let y; do{ y=Math.round(rnd(-4.5,4.5)*2)/2; }while(Math.abs(y)<1||tg.some(t=>Math.abs(t.y0-y)<1)); tg.push({y0:y,y,mov:i>=5?rnd(.6,1.2)*pick([1,-1]):0,ph:rnd(0,6),hit:false}); }
    Object.assign(S0,{e,part,q:part==='électron'?-1:1,U:0,tg,shots:[],ammo:n+2,ti:0,hold:0});
    G.prompt(`Plaques écartées de e = ${fr(e)} cm · particule : <b>${part}</b>. Sensibilité : ${SENS} cm de déviation par volt quand e = 1 cm. Le faisceau est invisible : <b>calcule U</b>, puis tire !`);
    clearTimeout(G._ph); G._ph=setTimeout(()=>G.state==='play'&&G.prompt(null),7000);
    G.panel([{label:'U − 5',on:()=>{S0.U-=5;}},{label:'U − 1',on:()=>{S0.U-=1;}},{label:'U + 1',on:()=>{S0.U+=1;}},{label:'U + 5',on:()=>{S0.U+=5;}},{label:'⚡ Tirer (espace)',cls:'sel',on:()=>K.crt.fire(G)}]); },
  defl(S0,U){ return S0.q*-1*SENS*U/S0.e; }, // + : vers le haut quand la plaque du haut est + pour un électron
  fire(G){ const S0=G.cr; if(G.busy||S0.ammo<=0) return; S0.ammo--; S0.shots.push({U:S0.U,t:0}); G.sfx('click'); },
  key(G,k,d){ const S0=G.cr; if(!d) return; if(k==='ArrowUp') S0.U+=1; if(k==='ArrowDown') S0.U-=1; if(k==='PageUp') S0.U+=5; if(k==='PageDown') S0.U-=5; if(k===' ') K.crt.fire(G); S0.U=clamp(S0.U,-60,60); },
  update(G,dt){ const S0=G.cr; if(!S0||!S0.tg||G.busy) return; S0.U=clamp(S0.U,-60,60); S0.tg.forEach(t=>{ if(t.mov){ t.ph+=dt*t.mov; t.y=clamp(t.y0+1.5*Math.sin(t.ph),-5,5);} });
    S0.shots.forEach(s=>{ s.t+=dt*1.8; if(s.t>=1&&!s.done){ s.done=true; const y=K.crt.defl(S0,s.U); s.y=y; const hit=S0.tg.find(t=>!t.hit&&Math.abs(t.y-y)<0.3);
      if(hit){ hit.hit=true; G.score+=25; G.combo++; G.sfx('good'); G.burst(720,250-hit.y*38,col.ok,20); G.hud(); } else { G.combo=0; G.sfx('tick'); } } });
    if(S0.tg.every(t=>t.hit)) return G.success(40+S0.ammo*15,'Toutes les cibles !');
    if(S0.ammo<=0&&S0.shots.every(s=>s.done)) G.fail('Plus de munitions',`Déviation = ${SENS}·U/e (cm, e en cm), vers la plaque de signe OPPOSÉ à la particule (attraction). Pour un ${S0.part} et une cible à +y cm : U = ${S0.q<0?'+':'−'}y·e/${SENS}.`); },
  draw(G,c){ const S0=G.cr; if(!S0||!S0.tg) return; const Ys=y=>250-y*38;
    rrect(c,30,226,70,48,10,'#2a2f55','#9fb4ff'); text(c,'canon',65,250,col.dim,11);
    const gap=26*S0.e; const top=S0.U>=0; rrect(c,150,250-gap-8,190,8,3,top?'#ff5f6d':'#5b93ff'); rrect(c,150,250+gap,190,8,3,top?'#5b93ff':'#ff5f6d');
    text(c,top?'+':'−',140,250-gap-4,top?col.p:col.n,18); text(c,top?'−':'+',140,250+gap+4,top?col.n:col.p,18); text(c,`e = ${fr(S0.e)} cm`,245,250+gap+24,col.dim,12);
    for(let y=-6;y<=6;y++){ c.globalAlpha=.4; line(c,700,Ys(y),716,Ys(y),'#3cc7d6',y%2?1:2); if(!(y%2)) text(c,''+y,690,Ys(y),'#3cc7d6',11,'right'); c.globalAlpha=1; }
    rrect(c,716,20,40,460,10,'rgba(60,199,214,.08)','rgba(60,199,214,.4)'); text(c,'écran (cm)',736,490,col.dim,10);
    S0.tg.forEach(t=>{ if(t.hit){ circle(c,736,Ys(t.y),7,'rgba(61,220,132,.6)'); return; } glow(c,736,Ys(t.y),22,'rgba(255,212,92,.35)'); circle(c,736,Ys(t.y),9,null,col.gold,2.5); text(c,(t.y>0?'+':'')+fr(t.y,1),770,Ys(t.y),col.gold,12,'left'); });
    S0.shots.forEach(s=>{ const yEnd=K.crt.defl(S0,s.U); const pts=[]; for(let k=0;k<=40;k++){ const u=k/40; const x=100+u*620; const ux=clamp((x-150)/190,0,1); const frac=x<340?ux*ux*0.35:0.35+(x-340)/380*0.65; pts.push([x,Ys(yEnd*frac)]); }
      const m=Math.floor(Math.min(1,s.t)*40); c.strokeStyle=s.done?'rgba(120,220,255,.18)':'#bff2ff'; c.lineWidth=2; c.beginPath(); pts.slice(0,m+1).forEach((p,k)=>k?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1])); c.stroke();
      if(s.done) { glow(c,736,Ys(s.y),14,'rgba(120,220,255,.5)'); } });
    rrect(c,14,330,250,110,12,'rgba(10,12,30,.8)'); text(c,`U = ${S0.U>0?'+':''}${S0.U} V`,139,354,'#fff',22,'center',800); text(c,`plaque du haut ${S0.U>=0?'+':'−'}`,139,380,col.dim,12);
    text(c,`${S0.part} (q ${S0.q<0?'< 0':'> 0'}) · munitions : ${S0.ammo}`,139,402,col.dim,12); text(c,'↑ ↓ : ±1 V · PgUp/PgDn : ±5 V',139,424,col.dim,11); }
};
D.ch2={kind:'crt',rounds:8,lives:3,maxPerRound:150,successDelay:1400,
 intro:'Tube d’oscilloscope : la particule traverse deux plaques chargées. Entre elles règne un champ UNIFORME E = U/e qui la dévie. Le faisceau est invisible : règle la tension U (calcul !) puis tire pour toucher les cibles de l’écran. Munitions limitées.',
 outro:'Entre deux plaques : champ uniforme E = U/e, dirigé du + vers le −. Force F = qE : un électron va vers la plaque +, un ion positif vers la plaque −. Déviation ∝ U/e : doubler e divise la déviation par 2.'};

/* =================================================================== */
/*  CH.4 — DYNAMO : produire du courant avec un aimant                   */
/* =================================================================== */
const DLV=[{E:25,T:22,diode:false,N:1,face:1,msg:'Produis 25 J : bouge l’aimant pour faire VARIER le flux.'},{E:35,T:22,diode:false,N:1,face:1,msg:'35 J. Astuce : où le flux varie-t-il le plus vite ?'},
 {E:20,T:22,diode:true,N:1,face:1,msg:'Diode : seul le courant POSITIF compte. Quel mouvement le produit ?'},{E:20,T:22,diode:true,N:1,face:-1,msg:'On a retourné l’aimant (pôle S face à la bobine), toujours avec la diode.'},
 {E:60,T:22,diode:false,N:3,face:1,msg:'Bobine de 3× plus de spires : plus de fem… mais l’aimant résiste plus (Lenz).'},{E:45,T:20,diode:true,N:2,face:-1,msg:'Final : diode, pôle S, 2× plus de spires.'}];
K.dynamo={
  start(G){ G.dy={keys:{}}; },
  round(G,i){ const S0=G.dy, L=DLV[i%DLV.length]; Object.assign(S0,{L,x:180,v:0,tx:180,E:0,t:0,hist:[],phi:K.dynamo.phi(180)*L.face*L.N});
    G.prompt(L.msg); clearTimeout(G._ph); G._ph=setTimeout(()=>G.state==='play'&&G.prompt(null),5000); G.panel([]); },
  phi(x){ return 1/Math.pow(1+((x-470)/70)**2,1.5); },
  pointer(G,t,x){ const S0=G.dy; if(t==='down'||t==='move'&&S0.drag){ S0.drag=true; S0.tx=clamp(x,90,760); } if(t==='up') S0.drag=false; },
  key(G,k,d){ G.dy.keys[k]=d; },
  update(G,dt){ const S0=G.dy; if(!S0||!S0.L||G.busy) return; const L=S0.L; S0.t+=dt; if(S0.keys.ArrowLeft) S0.tx-=600*dt; if(S0.keys.ArrowRight) S0.tx+=600*dt; S0.tx=clamp(S0.tx,90,760);
    // aimant attaché au pointeur par un ressort + freinage de Lenz ∝ (dΦ/dx)² v
    const h=dt/4; for(let k=0;k<4;k++){ const dphi=(K.dynamo.phi(S0.x+1)-K.dynamo.phi(S0.x-1))/2; const lenz=-L.N*L.N*2.5e5*dphi*dphi*S0.v; const a=260*(S0.tx-S0.x)-26*S0.v+lenz; S0.v+=a*h; S0.x+=S0.v*h; }
    const ph=K.dynamo.phi(S0.x)*L.face*L.N; const e=-(ph-S0.phi)/dt*5; S0.phi=ph; S0.e=e; const P=L.diode?(e>0?e*e:0):e*e; S0.E+=P*dt*0.012; S0.hist.push(e); if(S0.hist.length>240) S0.hist.shift();
    if(S0.E>=L.E) return G.success(50+Math.round(50*Math.max(0,1-S0.t/L.T)),'Ville éclairée !');
    if(S0.t>L.T) G.fail('Panne de courant',`Seule une VARIATION de flux crée une fem (e = −dΦ/dt) : l’aimant immobile, même dans la bobine, ne produit rien. Le flux varie le plus vite aux ENTRÉES de la bobine. ${L.diode?`Avec la diode, seul un sens compte : ${L.face>0?'en approchant le pôle N le flux augmente ⇒ e < 0… c’est en ÉLOIGNANT l’aimant que e > 0':'pôle S : Φ est négatif, il « augmente en valeur absolue » en approchant ⇒ e > 0 en APPROCHANT'}.`:''}`); },
  draw(G,c){ const S0=G.dy; if(!S0||!S0.L) return; const L=S0.L, x=S0.x;
    const lit=Math.min(1,S0.E/L.E); for(let k=0;k<8;k++){ const bx=40+k*95, h=40+(k*37%50); rrect(c,bx,400-h,60,h,4,'#141834'); for(let w=0;w<3;w++) rrect(c,bx+8+w*17,400-h+10,10,10,2,`rgba(255,212,92,${lit*(0.4+0.6*((k+w)%3?1:.6))})`); }
    text(c,`🏙 ${Math.round(lit*100)} %`,400,420,lit>=1?col.gold:col.dim,14);
    c.strokeStyle='#d98b3a'; c.lineWidth=4; for(let k=0;k<6*L.N;k++){ const cx=420+k*(100/(6*L.N)); c.beginPath(); c.ellipse(cx,200,10,52,0,0,7); c.stroke(); }
    text(c,`bobine · ${L.N>1?L.N+'× ':''}spires`,470,130,col.dim,12);
    const lamp=Math.min(1,Math.abs(S0.e||0)/30)*(L.diode&&(S0.e||0)<=0?0:1); glow(c,470,300,40+lamp*60,`rgba(255,212,92,${lamp*.8})`); circle(c,470,300,14,lamp>0.05?'#ffe28a':'#2a2f55','#fff',2); text(c,L.diode?'💡 + diode':'💡',470,330,col.dim,12);
    const N=L.face>0; rrect(c,x-110,182,55,36,5,N?'#3b5bdb':'#e03131'); rrect(c,x-55,182,55,36,5,N?'#e03131':'#3b5bdb'); text(c,N?'S':'N',x-82,200,'#fff',16); text(c,N?'N':'S',x-28,200,'#fff',16);
    text(c,'glisse l’aimant ⇆',x-55,235,col.dim,11);
    const gx=520,gy=40,gw=260,gh=70; rrect(c,gx,gy,gw,gh,10,'rgba(10,12,30,.8)'); line(c,gx,gy+gh/2,gx+gw,gy+gh/2,'rgba(255,255,255,.2)',1); c.strokeStyle=col.b; c.lineWidth=2; c.beginPath(); S0.hist.forEach((e,k)=>{ const yy=gy+gh/2-clamp(e,-40,40)/40*(gh/2-4); k?c.lineTo(gx+k/240*gw,yy):c.moveTo(gx,yy); }); c.stroke(); text(c,'fem e(t) = −dΦ/dt',gx+8,gy+12,col.dim,11,'left');
    rrect(c,20,40,250,60,10,'rgba(10,12,30,.8)'); rrect(c,30,74,230*Math.min(1,S0.E/L.E),12,6,col.gold); text(c,`énergie ${Math.round(S0.E)} / ${L.E} J   ⏱ ${Math.max(0,Math.ceil(L.T-S0.t))} s`,145,58,'#fff',13); }
};
D.ch4={kind:'dynamo',rounds:6,lives:3,maxPerRound:100,successDelay:1400,
 intro:'La ville est dans le noir. Fais glisser l’aimant (souris ou ← →) près de la bobine pour produire du courant. Attention : la bobine se défend (loi de Lenz), et certaines lampes ont une diode qui ne laisse passer qu’un sens de courant.',
 outro:'Faraday : e = −dΦ/dt, seul le CHANGEMENT de flux compte (le flux varie le plus vite aux bords de la bobine). Le signe dépend du sens du mouvement et du pôle. Lenz : le courant induit freine le mouvement ; plus de spires = plus de fem et plus de freinage.'};

/* =================================================================== */
/*  CH.5 — RADIO : longueur d'antenne et polarisation                    */
/* =================================================================== */
const RF=[[50,3],[75,2],[100,1.5],[150,1],[300,0.5],[600,0.25],[60,2.5],[120,1.25]];
K.radio={
  start(G){ G.ra={pol:'v',Li:4,keys:{}}; },
  round(G,i){ const S0=G.ra; const n=6+i; const q=[]; for(let k=0;k<n;k++){ const [f,l2]=pick(i<2?RF.slice(0,6):RF); q.push({at:k*(i<3?3.2:2.6-i*0.15),f,l2,pol:i<1?'v':pick(['v','h'])}); }
    Object.assign(S0,{q,w:[],t:0,n,done:0}); G.prompt(`Vague ${i+1} : capte chaque émission. Antenne demi-onde : L = λ/2 = c/(2f), et parallèle au champ E.`);
    clearTimeout(G._ph); G._ph=setTimeout(()=>G.state==='play'&&G.prompt(null),5000); K.radio.ui(G); },
  Ls:[0.25,0.5,1,1.25,1.5,2,2.5,3],
  ui(G){ const S0=G.ra; G.panel([{label:'L −',on:()=>{S0.Li=Math.max(0,S0.Li-1);}},{label:'L +',on:()=>{S0.Li=Math.min(7,S0.Li+1);}},{label:'↻ Tourner l’antenne (R)',on:()=>{S0.pol=S0.pol==='v'?'h':'v';}}]); },
  key(G,k,d){ const S0=G.ra; if(!d) return; if(k==='ArrowUp') S0.Li=Math.min(7,S0.Li+1); if(k==='ArrowDown') S0.Li=Math.max(0,S0.Li-1); if(k==='r'||k==='R'||k===' ') S0.pol=S0.pol==='v'?'h':'v'; },
  update(G,dt){ const S0=G.ra; if(!S0||!S0.q||G.busy) return; S0.t+=dt; while(S0.q.length&&S0.q[0].at<=S0.t) S0.w.push({...S0.q.shift(),x:830});
    const sp=95+G.i*10; S0.w.forEach(w=>{ w.x-=sp*dt; if(w.x<200&&!w.done){ w.done=true; S0.done++; const okL=Math.abs(K.radio.Ls[S0.Li]-w.l2)<1e-6, okP=S0.pol===w.pol;
      if(okL&&okP){ G.score+=20+Math.min(G.combo,5)*3; G.combo++; G.sfx('good'); G.burst(170,250,col.ok,18); G.hud(); }
      else { G.combo=0; G.lives--; G.sfx('bad'); G.shake(); G.toast(!okP?'Mauvaise polarisation':`λ/2 = ${fr(w.l2)} m`,col.bad); G.hud(); if(G.lives<=0) G.finish(false); } } });
    S0.w=S0.w.filter(w=>w.x>-60); if(S0.done>=S0.n&&G.state==='play') G.success(60,'Toutes les émissions captées !'); },
  draw(G,c){ const S0=G.ra; if(!S0||!S0.w) return;
    S0.w.forEach(w=>{ const y=250; const k=0.02+w.f/600*0.1; c.strokeStyle=w.done?'rgba(255,255,255,.15)':'#ff7a4d'; c.lineWidth=3; c.beginPath();
      for(let d=0;d<=130;d+=2){ const x=w.x+d, a=26*Math.sin((x+G.t*90)*k*Math.PI); if(w.pol==='v'){ d?c.lineTo(x,y-a):c.moveTo(x,y-a); } else { const yy=y-a*0.35; d?c.lineTo(x,yy):c.moveTo(x,yy); } } c.stroke();
      if(w.pol==='h'){ for(let d=0;d<=130;d+=13){ const a=26*Math.sin((w.x+d+G.t*90)*k*Math.PI); c.globalAlpha=.6; line(c,w.x+d-a*0.7,250+a*0.25,w.x+d+a*0.7,250-a*0.25,'#ff7a4d',1.5); c.globalAlpha=1; } }
      text(c,`${w.f} MHz`,w.x+65,y-60,'#ffb08a',14); text(c,w.pol==='v'?'E vertical ↕':'E horizontal ↔',w.x+65,y+60,'#ffb08a',11); });
    const L=K.radio.Ls[S0.Li], px=L*44; glow(c,160,250,40,'rgba(60,199,214,.3)');
    if(S0.pol==='v') line(c,160,250-px,160,250+px,'#3cc7d6',6); else line(c,160-px,250,160+px,250,'#3cc7d6',6); circle(c,160,250,6,'#fff');
    rrect(c,14,40,250,66,10,'rgba(10,12,30,.8)'); text(c,`antenne : L = ${fr(L)} m · ${S0.pol==='v'?'verticale':'horizontale'}`,139,60,'#fff',13); text(c,'c = 3·10⁸ m/s · ↑↓ longueur · R tourner',139,84,col.dim,11); }
};
D.ch5={kind:'radio',rounds:6,lives:4,maxPerRound:170,successDelay:1400,
 intro:'Station de réception : des ondes radio arrivent à la vitesse de la lumière. Pour capter une émission, ton antenne doit être PARALLÈLE au champ E de l’onde et mesurer λ/2. Règle la longueur (↑ ↓) et l’orientation (R) avant que l’onde arrive.',
 outro:'λ = c/f avec c = 3·10⁸ m/s : 100 MHz ⇒ 3 m, 300 MHz ⇒ 1 m. L’onde est transverse : E (et B) sont perpendiculaires à la propagation, et c’est E qui met les électrons de l’antenne en mouvement.'};
})();
