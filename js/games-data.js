/* ============ Atlas Arcade — contenu des 17 jeux ============ */
(function(){
const r=String.raw; const C=window.GC; const {text,arrow,circle,glow,line,rrect,col,pick,ri,rnd,shuffle}=C;
const D=window.GDEFS={};
const deg=Math.PI/180;
const ask=(draw,q,opts,a,e,keep)=>({draw,q,opts,a,e,keep});
/* choix aléatoire d’un type de manche en évitant les répétitions */
const cyc=(fns)=>{ let bag=[]; return i=>{ if(!bag.length) bag=shuffle(fns); return bag.pop()(i); }; };

/* ==================================== PHYSIQUE ==================================== */
/* ---------- ch0 : vecteurs ---------- */
const vec2=(c,O,a,L,colr,lab)=>{ const x=O[0]+L*Math.cos(a), y=O[1]-L*Math.sin(a); arrow(c,O[0],O[1],x,y,colr,4,14); text(c,lab,x+16*Math.cos(a),y-16*Math.sin(a),colr,20,'center',800); };
D.ch0={kind:'visual',rounds:12,lives:3,time:14,intro:'Une rafale de vecteurs : produit scalaire, produit vectoriel, gradient, coordonnées. Réponds vite, chaque seconde compte.',outro:'Rappel : u·v = |u||v|cos θ ; u×v perpendiculaire (main droite) ; le gradient monte le plus raide.',
gen:cyc([
 ()=>{ const a=rnd(0,2*Math.PI), d=pick([30,60,90,120,150,90])*deg*(Math.random()<.5?1:-1); const cs=Math.cos(d); const ans=Math.abs(cs)<1e-6?2:cs>0?0:1;
   return ask(c=>{ const O=[400,270]; vec2(c,O,a,150,col.e,'u'); vec2(c,O,a+d,130,col.b,'v'); c.strokeStyle=col.gold; c.lineWidth=2; c.beginPath(); c.arc(O[0],O[1],40,-a,-(a+d),d>0); c.stroke(); circle(c,O[0],O[1],5,'#fff'); },
     'Le produit scalaire $\\vec u\\cdot\\vec v$ est…',['positif','négatif','nul'],ans,`Angle de ${Math.round(Math.abs(d)/deg)}° : u·v = |u||v|cos θ, ${ans===0?'cos > 0':ans===1?'cos < 0':'cos 90° = 0'}.`); },
 ()=>{ const a=rnd(0,2*Math.PI); const col0=Math.random()<.15; const d=col0?pick([0,Math.PI]):pick([1,-1])*rnd(35,150)*deg; const z=Math.sin(d); const ans=col0?2:z>0?0:1;
   return ask(c=>{ const O=[400,270]; vec2(c,O,a,150,col.e,'u'); vec2(c,O,a+d,col0&&d===0?95:130,col.b,'v'); circle(c,O[0],O[1],5,'#fff'); },
     'Le produit vectoriel $\\vec u\\times\\vec v$…',['⊙ sort de l’écran','⊗ entre dans l’écran','est nul'],ans,'Main droite : on tourne de u vers v par le plus petit angle. Sens inverse des aiguilles d’une montre ⇒ ⊙ (vers toi). Vecteurs colinéaires ⇒ produit nul.'); },
 ()=>{ const S=[rnd(180,620),rnd(140,360)], hill=Math.random()<.65; const P=[S[0]+pick([-1,1])*rnd(110,170),S[1]+pick([-1,1])*rnd(50,90)]; const u=[S[0]-P[0],S[1]-P[1]]; const L=Math.hypot(...u); const up=[u[0]/L,u[1]/L];
   const dirs=[hill?up:[-up[0],-up[1]],hill?[-up[0],-up[1]]:up,[-up[1],up[0]],[up[1],-up[0]]]; const labs=shuffle(['A','B','C','D']);
   return ask(c=>{ for(let k=1;k<=6;k++){ c.strokeStyle=`rgba(${hill?'255,180,90':'90,170,255'},${.12+.06*k})`; c.lineWidth=2; c.beginPath(); c.arc(S[0],S[1],k*38,0,7); c.stroke(); text(c,''+(hill?(7-k)*10:k*10),S[0]+k*38-10,S[1]-6,col.dim,10,'center',600); }
     text(c,hill?'▲ sommet':'▼ cuvette',S[0],S[1],hill?col.gold:col.b,13); circle(c,P[0],P[1],6,'#fff'); text(c,'P',P[0]-14,P[1]-14,'#fff',15);
     dirs.forEach((d,k)=>{ arrow(c,P[0],P[1],P[0]+d[0]*70,P[1]+d[1]*70,[col.e,col.b,col.vio,col.ok][k],3,11); text(c,labs[k],P[0]+d[0]*88,P[1]+d[1]*88,'#fff',16); }); },
     'Les cercles sont des lignes de niveau (altitude). Où pointe $\\overrightarrow{\\mathrm{grad}}\\,f$ en P ?',['A','B','C','D'],['A','B','C','D'].indexOf(labs[0]),'Le gradient pointe vers la montée la plus raide, perpendiculairement aux lignes de niveau : vers le sommet (ou en s’éloignant du fond d’une cuvette).',true); },
 ()=>{ const k=ri(0,3); const ans=[2,1,0,1][k];
   return ask(c=>{ const x=400,y=270; if(k===0){ const g=c.createRadialGradient(x-30,y-30,10,x,y,110); g.addColorStop(0,'#ffb089'); g.addColorStop(1,'#a8402a'); c.fillStyle=g; c.beginPath(); c.arc(x,y,100,0,7); c.fill(); text(c,'boule chargée',x,y+130,col.dim,14); }
     if(k===1){ line(c,x,60,x,440,col.gold,6); arrow(c,x+30,320,x+30,200,col.gold,2,9); text(c,'fil infini parcouru par I',x,460,col.dim,14); }
     if(k===2){ c.fillStyle='rgba(91,147,255,.35)'; c.beginPath(); c.moveTo(220,330); c.lineTo(480,330); c.lineTo(580,210); c.lineTo(320,210); c.closePath(); c.fill(); text(c,'plan infini chargé',x,380,col.dim,14); }
     if(k===3){ c.strokeStyle=col.b; c.lineWidth=3; c.beginPath(); c.ellipse(x,120,60,18,0,0,7); c.stroke(); line(c,x-60,120,x-60,400,col.b,3); line(c,x+60,120,x+60,400,col.b,3); c.beginPath(); c.ellipse(x,400,60,18,0,0,Math.PI); c.stroke(); text(c,'câble coaxial',x,450,col.dim,14); } },
     'Quelles coordonnées choisir ?',['cartésiennes','cylindriques','sphériques'],ans,'Plan → cartésiennes ; axe (fil, cylindre, câble) → cylindriques ; point (sphère, boule) → sphériques.'); }
])};

/* ---------- ch1 : champ électrique (puzzle) ---------- */
D.ch1={kind:'field',rounds:6,lives:0,maxPerRound:100,successDelay:1400,intro:'La particule (+) part vers la droite. Place des charges + ou − sur le terrain pour la dévier jusqu’à la cible 🎯. Les petites flèches montrent le champ E en chaque point : regarde-les changer quand tu poses une charge.',outro:'Même signe ⇒ répulsion, signes opposés ⇒ attraction, et la force décroît en 1/r². Le champ total est la somme des champs de chaque charge.',
levels:[
 {start:[70,250],v:[150,0],goal:[720,110,34],fixed:[],max:1,hint:'Une charge <b>−</b> attire la particule +.'},
 {start:[70,250],v:[150,0],goal:[720,390,34],fixed:[[430,170,1]],max:1,hint:'Charge fixe + : elle repousse. Dévie vers le bas.'},
 {start:[70,250],v:[150,0],goal:[720,250,36],fixed:[],walls:[[380,170,30,160]],max:2,hint:'Contourne le mur.'},
 {start:[70,250],v:[150,0],goal:[700,90,34],fixed:[[480,350,-1]],max:2,hint:'La charge − fixe attire vers le bas…'},
 {start:[70,400],v:[150,0],goal:[700,100,34],fixed:[[400,250,1]],walls:[[560,180,30,190]],max:3,hint:'Monte en évitant la charge et le mur.'},
 {start:[70,250],v:[150,0],goal:[720,420,34],fixed:[],walls:[[290,0,30,230],[510,270,30,230]],max:3,hint:'Slalom !'}]};

/* ---------- ch2 : condensateurs, résistances (réglages) ---------- */
const fmtE=(v,u)=>{ const P=[[1e-12,'p'],[1e-9,'n'],[1e-6,'µ'],[1e-3,'m'],[1,''],[1e3,'k'],[1e6,'M']]; let b=P[0]; for(const p of P) if(Math.abs(v)>=p[0]*0.999) b=p; return (v/b[0]).toPrecision(3).replace('.',',')+' '+b[1]+u; };
D.ch2={kind:'tuner',rounds:9,lives:3,intro:'L’atelier : règle la géométrie pour obtenir exactement la capacité, la résistance ou l’énergie demandée. Une capacité ne dépend que de la forme ! Valide quand la bille est dans la zone verte.',outro:'C = ε₀εᵣS/e, R = ρL/S, W = ½CU² : retiens ce qui augmente et ce qui diminue chaque grandeur.',
gen:cyc([
 ()=>{ const S0=ri(2,40)*10,e0=ri(2,30)/10,er0=ri(1,8); const f=v=>8.85e-12*v.er*v.S*1e-4/(v.e*1e-3);
   return {q:'Règle le condensateur plan pour obtenir la capacité demandée.',name:'C',target:f({S:S0,e:e0,er:er0}),tol:.05,fmtv:v=>fmtE(v,'F'),f,
     params:[{key:'S',label:'Surface S',min:10,max:400,step:10,val:200,fmt:v=>v+' cm²'},{key:'e',label:'Écart e',min:.1,max:5,step:.1,val:1,fmt:v=>v.toFixed(1)+' mm'},{key:'er',label:'εᵣ',min:1,max:10,step:1,val:1}],
     e:'C = ε₀εᵣS/e : plus de surface ou un meilleur isolant (εᵣ) ⇒ C augmente ; plaques plus écartées ⇒ C diminue.',
     draw:(c,v)=>{ const w=40+(v.S||200)/400*220, g=10+(v.e||1)*22; const x=400; c.fillStyle='rgba(255,122,77,.85)'; c.fillRect(x-w/2,170-g/2-8,w,8); c.fillStyle='rgba(91,147,255,.85)'; c.fillRect(x-w/2,170+g/2,w,8);
       c.fillStyle=`rgba(164,139,255,${.06*(v.er||1)})`; c.fillRect(x-w/2,170-g/2,w,g); text(c,'+Q',x-w/2-24,170-g/2-4,col.e,14); text(c,'−Q',x-w/2-24,170+g/2+4,col.n,14); text(c,'C = ε₀εᵣS / e',400,100,col.dim,14,'center',600); } }; },
 ()=>{ const L0=ri(2,90),S0=ri(1,16)/2; const f=v=>1.7e-8*v.L/(v.S*1e-6);
   return {q:'Câble en cuivre (ρ = 1,7·10⁻⁸ Ω·m) : règle longueur et section pour la résistance demandée.',name:'R',target:f({L:L0,S:S0}),tol:.05,fmtv:v=>fmtE(v,'Ω'),f,
     params:[{key:'L',label:'Longueur L',min:1,max:100,step:1,val:50,fmt:v=>v+' m'},{key:'S',label:'Section S',min:.5,max:8,step:.5,val:2,fmt:v=>v.toFixed(1)+' mm²'}],
     e:'R = ρL/S : un fil plus long résiste plus, un fil plus gros (section) résiste moins.',
     draw:(c,v)=>{ const len=80+(v.L||50)*5, th=2+(v.S||2)*3; c.strokeStyle='#e08a4a'; c.lineWidth=th; c.beginPath(); c.moveTo(400-len/2,170); for(let k=0;k<=40;k++){ c.lineTo(400-len/2+len*k/40,170+Math.sin(k*.8)*6);} c.stroke(); text(c,'R = ρ L / S',400,100,col.dim,14,'center',600); } }; },
 ()=>{ const C0=ri(1,100),U0=ri(2,50); const f=v=>.5*v.C*1e-6*v.U*v.U;
   return {q:'Stocke l’énergie demandée dans le condensateur.',name:'W',target:f({C:C0,U:U0}),tol:.05,fmtv:v=>fmtE(v,'J'),f,
     params:[{key:'C',label:'Capacité C',min:1,max:100,step:1,val:10,fmt:v=>v+' µF'},{key:'U',label:'Tension U',min:1,max:50,step:1,val:10,fmt:v=>v+' V'}],
     e:'W = ½CU² : doubler U multiplie l’énergie par 4, doubler C la double seulement.',
     draw:(c,v)=>{ const fill=Math.min(1,f(v)/0.12); rrect(c,330,110,140,120,14,null,'rgba(255,255,255,.4)'); rrect(c,330,110+120*(1-fill),140,120*fill,14,'rgba(255,212,92,.6)'); text(c,'⚡',400,170,'#fff',30); text(c,'W = ½ C U²',400,90,col.dim,14,'center',600); } }; }
])};

/* ---------- ch3 : cyclotron ---------- */
const PARTS=[{name:'proton',q:1,m:1,v:1},{name:'antiproton',q:-1,m:1,v:1},{name:'deutéron',q:1,m:2,v:1},{name:'particule α',q:2,m:4,v:1},{name:'proton rapide',q:1,m:1,v:1.6},{name:'positon lourd',q:1,m:1.5,v:1.2},{name:'ion négatif',q:-1,m:2,v:1}];
function bfLevels(){ const out=[]; let guard=0; while(out.length<8&&guard++<5000){ const p=out.length<2?PARTS[out.length]:pick(PARTS); const x=rnd(260,740), dy=pick([1,-1])*rnd(70,200); const dx=x-80; const R=(dx*dx+dy*dy)/(2*Math.abs(dy)); const B=120*p.m*p.v/(Math.abs(p.q)*R);
  if(B<.45||B>2.8) continue; const th=Math.atan2(dx/R,1-Math.abs(dy)/R); const ymax=th>Math.PI/2?Math.min(2*R,R*(1-Math.cos(th))):Math.abs(dy); const xmax=th>Math.PI/2?80+R:x; if(250+ymax>460||250-ymax<40||xmax>790) continue;
  out.push({p,det:[x,250+dy]}); } return out; }
D.ch3={kind:'bfield',rounds:8,lives:0,maxPerRound:100,successDelay:1400,get levels(){ return this._l||(this._l=bfLevels()); },intro:'Un accélérateur envoie des particules chargées vers la droite. Choisis le sens du champ B (⊙ ou ⊗) et son intensité pour que la trajectoire circulaire finisse dans le détecteur.',outro:'F = q v × B courbe la trajectoire ; rayon R = mv/(|q|B) : plus lourd ou plus rapide ⇒ plus grand cercle ; B ou q plus grand ⇒ plus petit cercle. Le signe de q inverse le sens.'};

/* ---------- ch4 : induction ---------- */
D.ch4={kind:'visual',rounds:12,lives:3,time:16,intro:'Aimants qui approchent, barres qui glissent, spires qui traversent un champ : prédis le phénomène induit. Une seule règle : la nature s’oppose au changement (Lenz).',outro:'Lenz : le courant induit crée un effet qui s’oppose à la variation de flux qui lui a donné naissance.',
gen:cyc([
 ()=>{ const N=Math.random()<.5, appro=Math.random()<.5, q=Math.random()<.5; const towardMag=(N&&appro)||(!N&&!appro);
   const draw=(c,t)=>{ const off=appro?Math.min(60,t*25):-Math.min(60,t*25); const x0=150+off; rrect(c,x0,225,80,50,6,N?'#3b5bdb':'#e03131'); rrect(c,x0+80,225,80,50,6,N?'#e03131':'#3b5bdb'); text(c,N?'S':'N',x0+40,250,'#fff',20); text(c,N?'N':'S',x0+120,250,'#fff',20);
     arrow(c,x0+80,195,x0+80+(appro?70:-70),195,col.gold,3,10); text(c,appro?'approche':'s’éloigne',x0+80,175,col.gold,14);
     c.strokeStyle='#ffd45c'; c.lineWidth=5; c.beginPath(); c.ellipse(560,250,26,90,0,0,7); c.stroke(); text(c,'spire',560,370,col.dim,14); };
   if(q) return ask(draw,'Le champ magnétique <b>induit</b> au centre de la spire pointe…',['← vers l’aimant','→ à l’opposé de l’aimant'],towardMag?0:1,`Le flux ${appro?'augmente':'diminue'} : la spire ${appro?'repousse':'retient'} l’aimant ; elle présente un pôle ${appro?(N?'N':'S'):(N?'S':'N')} face à lui. Le champ sort d’un pôle N et entre dans un pôle S.`);
   return ask(draw,'La spire et l’aimant…',['se repoussent','s’attirent'],appro?0:1,'Lenz : la spire s’oppose au mouvement. Il approche ⇒ elle le repousse ; il s’éloigne ⇒ elle le retient.'); },
 ()=>{ const right=Math.random()<.5, Bout=Math.random()<.5, kind=ri(0,2);
   const draw=(c,t)=>{ for(let x=120;x<700;x+=50) for(let y=140;y<380;y+=50){ c.globalAlpha=.4; Bout?C.dotOut(c,x,y,7,'#9fb4ff'):C.crossIn(c,x,y,7,'#9fb4ff'); c.globalAlpha=1; }
     line(c,100,150,720,150,'#c0c4d8',5); line(c,100,370,720,370,'#c0c4d8',5); const bx=400+((t*40)%120)*(right?1:-1)*0; line(c,bx,140,bx,380,col.gold,8); arrow(c,bx,260,bx+(right?90:-90),260,col.ok,4,13); text(c,'v',bx+(right?100:-100),245,col.ok,16);
     rrect(c,90,240,20,40,4,'#ff7a4d'); text(c,'R',75,260,col.dim,14); };
   if(kind===2) return ask(draw,'On double la vitesse de la barre. La force de freinage…',['double','est multipliée par 4','ne change pas'],0,'fem e = Bℓv ⇒ i = Bℓv/R ⇒ F = iℓB = B²ℓ²v/R : proportionnelle à v.');
   return ask(draw,'La force de Laplace sur la barre est dirigée…',['← vers la gauche','→ vers la droite','nulle'],right?0:1,'Quel que soit le sens de B, la force induite FREINE le mouvement (Lenz) : elle est opposée à v.'); },
 ()=>{ const st=ri(0,3); const yes=st===1||st===3; const xs=[90,250,420,600][st];
   return ask(c=>{ rrect(c,300,120,240,260,10,'rgba(91,147,255,.12)','rgba(91,147,255,.5)'); for(let x=320;x<540;x+=40) for(let y=140;y<380;y+=40) C.crossIn(c,x,y,6,'rgba(159,180,255,.6)'); text(c,'zone de champ B',420,105,col.dim,13);
     rrect(c,xs,200,110,100,6,null,col.gold); arrow(c,xs+55,250,xs+120,250,col.ok,3,10); text(c,['complètement dehors','en train d’entrer','complètement dedans','en train de sortir'][st],xs+55,320,col.dim,12); },
     'La spire se déplace à vitesse constante. Y a-t-il un courant induit ?',['oui','non'],yes?0:1,'Il faut que le FLUX VARIE : il change seulement quand la spire entre ou sort de la zone. Dehors ou complètement dedans, le flux est constant ⇒ pas de courant.'); }
])};

/* ---------- ch5 : Maxwell & onde ---------- */
const AX={x:[1,0,0],y:[0,1,0],z:[0,0,1]}; const iso=v=>[-v[0]*0.87+v[1]*0.87,-(v[2]*1)+v[0]*0.5+v[1]*0.5];
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const vname=v=>{ const k=v.findIndex(x=>x!==0); return (v[k]>0?'+':'−')+'xyz'[k]; };
D.ch5={kind:'visual',rounds:12,lives:3,time:16,intro:'L’onde électromagnétique et les quatre équations de Maxwell : directions de E, B et de la propagation, et quelle équation décrit quelle situation.',outro:'Onde plane : E ⟂ B ⟂ direction de propagation, et E × B pointe dans le sens de propagation. λ = c/f.',
gen:cyc([
 ()=>{ const ks=shuffle(['x','y','z']); const sE=pick([1,-1]), sK=pick([1,-1]); const E=AX[ks[0]].map(v=>v*sE), Kv=AX[ks[1]].map(v=>v*sK); const B=cross(Kv,E); const Bo=B.map(v=>-v); const third=AX[ks[0]].map(v=>v*-sE);
   const opts=[vname(B),vname(Bo),vname(Kv.map(v=>-v))];
   return ask(c=>{ const O=[400,280]; ['x','y','z'].forEach(k=>{ const p=iso(AX[k]); arrow(c,O[0],O[1],O[0]+p[0]*150,O[1]+p[1]*150,'rgba(255,255,255,.35)',2,9); text(c,k,O[0]+p[0]*168,O[1]+p[1]*168,col.dim,16); });
     const pe=iso(E), pk=iso(Kv); arrow(c,O[0],O[1],O[0]+pe[0]*120,O[1]+pe[1]*120,col.e,5,14); text(c,'E',O[0]+pe[0]*135+12,O[1]+pe[1]*135,col.e,20); arrow(c,O[0],O[1],O[0]+pk[0]*120,O[1]+pk[1]*120,col.gold,5,14); text(c,'k (propagation)',O[0]+pk[0]*140,O[1]+pk[1]*140-16,col.gold,15); },
     `$\\vec E$ selon ${vname(E)}, l’onde se propage selon ${vname(Kv)}. $\\vec B$ est selon…`,opts,0,`Trièdre direct (E, B, k) : B = k × E / c, ici selon ${vname(B)}.`); },
 ()=>{ const k=ri(0,3); const names=[r`$\mathrm{div}\,\vec E=\rho/\varepsilon_0$`,r`$\mathrm{div}\,\vec B=0$`,r`$\overrightarrow{\mathrm{rot}}\,\vec E=-\partial_t\vec B$`,r`$\overrightarrow{\mathrm{rot}}\,\vec B=\mu_0\vec j+\mu_0\varepsilon_0\partial_t\vec E$`];
   const others=shuffle([0,1,2,3].filter(x=>x!==k)).slice(0,2);
   return ask((c,t)=>{ const x=400,y=270;
     if(k===0){ C.charge(c,x,y,16,1); for(let a=0;a<12;a++){ const u=a*Math.PI/6; arrow(c,x+30*Math.cos(u),y+30*Math.sin(u),x+120*Math.cos(u),y+120*Math.sin(u),col.e,2.5,9);} text(c,'des lignes de champ qui JAILLISSENT d’une charge',x,y+170,col.dim,14); }
     if(k===1){ rrect(c,x-70,y-20,70,40,4,'#e03131'); rrect(c,x,y-20,70,40,4,'#3b5bdb'); for(let s=1;s<=3;s++){ c.strokeStyle='rgba(60,199,214,.7)'; c.lineWidth=2; c.beginPath(); c.ellipse(x,y,90+s*30,30+s*28,0,0,7); c.stroke(); } text(c,'lignes de B toujours FERMÉES, sans source',x,y+170,col.dim,14); }
     if(k===2){ const g=1+.25*Math.sin(t*3); for(let a=-1;a<=1;a++) for(let b=-1;b<=1;b++) C.dotOut(c,x+a*40,y+b*40,8*g,'#9fb4ff'); c.strokeStyle=col.e; c.lineWidth=3; c.beginPath(); c.arc(x,y,120,0,7); c.stroke(); arrow(c,x+120,y+5,x+118,y-25,col.e,3,12); text(c,'B augmente ⇒ un E tourne autour',x,y+170,col.dim,14); }
     if(k===3){ line(c,x,90,x,440,col.gold,6); arrow(c,x,330,x,200,col.gold,3,12); text(c,'I',x+16,260,col.gold,16); [60,100,140].forEach(rr=>{ c.strokeStyle='rgba(60,199,214,.8)'; c.lineWidth=2; c.beginPath(); c.ellipse(x,y,rr,rr*.35,0,0,7); c.stroke(); }); text(c,'un courant ⇒ un B qui tourne autour',x,y+170,col.dim,14); } },
     'Quelle équation de Maxwell décrit cette image ?',[names[k],names[others[0]],names[others[1]]],0,'div = « ce qui jaillit d’un point » (sources) ; rot = « ce qui tourne autour ». Faraday : B variable ⇒ E qui tourne ; Ampère : courant (ou E variable) ⇒ B qui tourne.'); },
 ()=>{ const cs=[[1e8,'100 MHz (radio FM)','3 m'],[2.4e9,'2,4 GHz (Wi-Fi)','12,5 cm'],[5e14,'5·10¹⁴ Hz (lumière)','600 nm'],[50,'50 Hz (secteur)','6 000 km'],[1e10,'10 GHz (radar)','3 cm']]; const k=ri(0,cs.length-1); const wrong=shuffle(cs.filter((_,j)=>j!==k)).slice(0,2);
   return ask((c,t)=>{ c.strokeStyle=col.b; c.lineWidth=3; c.beginPath(); for(let x=80;x<=720;x+=4){ const y=260-80*Math.sin((x-80)/160*2*Math.PI-t*3); x===80?c.moveTo(x,y):c.lineTo(x,y);} c.stroke(); line(c,80,380,240,380,col.gold,2); line(c,80,370,80,390,col.gold,2); line(c,240,370,240,390,col.gold,2); text(c,'λ',160,400,col.gold,18); text(c,`f = ${cs[k][1]}`,400,120,'#fff',18); },
     'Longueur d’onde dans le vide ($c=3\\cdot10^8$ m/s) ?',[cs[k][2],wrong[0][2],wrong[1][2]],0,`λ = c / f = 3·10⁸ / ${cs[k][1].split(' (')[0]} = ${cs[k][2]}.`); }
])};

/* ==================================== ÉLECTRONIQUE ==================================== */
const E12=[1,1.2,1.5,1.8,2.2,2.7,3.3,3.9,4.7,5.6,6.8,8.2];
const res=(c,x1,y1,x2,y2,lab,colr='#fff')=>{ const mx=(x1+x2)/2,my=(y1+y2)/2, h=x1===x2; line(c,x1,y1,h?x1:mx-28,h?my-28:y1,'#c0c4d8',3); line(c,h?x2:mx+28,h?my+28:y2,x2,y2,'#c0c4d8',3); if(h) rrect(c,mx-12,my-28,24,56,4,null,colr); else rrect(c,mx-28,my-12,56,24,4,null,colr); text(c,lab,h?mx+20:mx,h?my:my-24,colr,14,h?'left':'center'); };
const kO=v=>{v=Math.round(v);return v>=1000?(v/1000).toFixed(v%1000?1:0).replace('.',',')+' kΩ':v+' Ω';};
D.el1={kind:'tuner',rounds:9,lives:3,intro:'Le banc de test : choisis les résistances pour obtenir la tension, la résistance équivalente ou le courant demandés. Diviseurs, associations et Thévenin.',outro:'Diviseur : U₂ = E·R₂/(R₁+R₂). Série : on additionne. Parallèle : R₁R₂/(R₁+R₂). Thévenin chargé : I = E_th/(R_th + R_L).',
gen:cyc([
 ()=>{ const E=pick([5,9,12,15,24]); const r1=ri(1,50)*200, r2=ri(1,50)*200; const f=v=>E*v.R2/(v.R1+v.R2);
   return {q:`Diviseur de tension sous E = ${E} V : règle R₁ et R₂ pour obtenir U₂.`,name:'U₂',target:f({R1:r1,R2:r2}),tol:.03,fmtv:v=>v.toFixed(2).replace('.',',')+' V',f,
    params:[{key:'R1',label:'R₁',min:200,max:10000,step:200,val:5000,fmt:kO},{key:'R2',label:'R₂',min:200,max:10000,step:200,val:5000,fmt:kO}],
    e:'U₂ = E·R₂/(R₁+R₂) : c’est la part de R₂ dans la résistance totale. Seul le RAPPORT compte.',
    draw:(c,v)=>{ line(c,240,90,560,90,'#c0c4d8',3); line(c,240,250,560,250,'#c0c4d8',3); line(c,240,90,240,250,'#c0c4d8',3); circle(c,240,170,20,'#151a33','#ffd45c'); text(c,E+' V',200,170,col.gold,14,'right');
      res(c,560,90,560,170,'R₁ '+kO(v.R1||0)); res(c,560,170,560,250,'R₂ '+kO(v.R2||0),col.b); arrow(c,650,240,650,180,col.b,2.5,9); text(c,'U₂',668,210,col.b,15,'left'); line(c,560,170,640,170,'#c0c4d8',2); line(c,560,250,640,250,'#c0c4d8',2); } }; },
 ()=>{ const a=pick(E12)*pick([100,1000]),b=pick(E12)*1000,cc=pick(E12)*1000; const f=v=>v.R1+v.R2*v.R3/(v.R2+v.R3);
   return {q:'R₁ en série avec (R₂ ∥ R₃) : atteins la résistance équivalente demandée.',name:'R_eq',target:f({R1:a,R2:b,R3:cc}),tol:.03,fmtv:v=>kO(Math.round(v)),f,
    params:[{key:'R1',label:'R₁',min:100,max:10000,step:100,val:1000,fmt:kO},{key:'R2',label:'R₂',min:100,max:10000,step:100,val:1000,fmt:kO},{key:'R3',label:'R₃',min:100,max:10000,step:100,val:1000,fmt:kO}],
    e:'Série : on additionne. Parallèle : produit / somme (toujours plus petit que la plus petite). Ici R_eq = R₁ + R₂R₃/(R₂+R₃).',
    draw:(c,v)=>{ line(c,120,170,200,170,'#c0c4d8',3); res(c,200,170,360,170,'R₁',col.e); line(c,360,170,420,170,'#c0c4d8',3); line(c,420,110,420,230,'#c0c4d8',3); line(c,580,110,580,230,'#c0c4d8',3); res(c,420,110,580,110,'R₂'); res(c,420,230,580,230,'R₃'); line(c,580,170,680,170,'#c0c4d8',3); circle(c,120,170,6,'#fff'); circle(c,680,170,6,'#fff'); } }; },
 ()=>{ const Eth=pick([6,9,12,20]), Rth=pick(E12)*pick([100,1000]); const RL0=ri(1,50)*200; const f=v=>Eth/(Rth+v.RL)*1000;
   return {q:`Générateur de Thévenin (E_th = ${Eth} V, R_th = ${kO(Rth)}) : choisis la charge R_L pour obtenir le courant demandé.`,name:'I',target:f({RL:RL0}),tol:.03,fmtv:v=>v.toFixed(2).replace('.',',')+' mA',f,
    params:[{key:'RL',label:'R_L',min:200,max:10000,step:200,val:5000,fmt:kO}],
    e:'I = E_th/(R_th + R_L) : la charge et la résistance interne sont en série.',
    draw:(c,v)=>{ rrect(c,150,80,230,190,14,null,'rgba(164,139,255,.6)'); text(c,'Thévenin',265,100,col.vio,13); circle(c,200,175,20,'#151a33',col.gold); text(c,Eth+' V',200,215,col.gold,13); res(c,220,135,370,135,'R_th '+kO(Rth));
      line(c,200,155,200,135,'#c0c4d8',3); line(c,200,195,200,250,'#c0c4d8',3); line(c,200,250,560,250,'#c0c4d8',3); line(c,370,135,560,135,'#c0c4d8',3); res(c,560,135,560,250,'R_L '+kO(v.RL||0),col.b); arrow(c,450,120,500,120,col.ok,2.5,9); text(c,'I',475,104,col.ok,15); } }; }
])};

/* ---------- el2 : chrono τ ---------- */
const fmtT=s=>s<1?(s*1000).toFixed(s<.01?1:0)+' ms':s.toFixed(2).replace('.',',')+' s';
D.el2={kind:'timing',rounds:10,lives:3,successDelay:1300,intro:'La courbe se trace en direct. Appuie sur STOP (bouton, espace ou clic) exactement au moment demandé. Pour certaines manches il faut d’abord calculer τ = RC ou τ = L/R !',outro:'À t = τ : 63 % (charge) ou 37 % (décharge). À t = 3τ : 95 %. Moitié du chemin : t = τ·ln 2 ≈ 0,69τ.',
gen:cyc([
 ()=>{ const R=pick([1,2.2,4.7,10])*1e3, Cc=pick([10,22,47,100])*1e-6, tau=R*Cc; return {q:`R = ${kO(R)}, C = ${Math.round(Cc*1e6)} µF. Arrête le chrono à <b>t = τ</b>.`,tau,target:tau,f:t=>1-Math.exp(-t/tau),top:'E',fmt:fmtT,circuit:'Charge RC : u_C(t)',e:`τ = RC = ${kO(R)} × ${Math.round(Cc*1e6)} µF = ${fmtT(tau)}.`}; },
 ()=>{ const tau=rnd(.05,.5); return {q:'Charge d’un condensateur : arrête quand <b>u_C atteint 63 % de E</b>.',tau,target:tau,f:t=>1-Math.exp(-t/tau),top:'E',fmt:fmtT,circuit:'Charge RC : u_C(t)',e:'1 − e⁻¹ ≈ 0,63 : 63 % de E sont atteints à t = τ.'}; },
 ()=>{ const tau=rnd(.05,.5); return {q:'Charge : arrête quand <b>u_C = E/2</b>.',tau,target:tau*Math.LN2,f:t=>1-Math.exp(-t/tau),top:'E',fmt:fmtT,circuit:'Charge RC : u_C(t)',e:'1 − e^(−t/τ) = 1/2 ⇒ t = τ ln 2 ≈ 0,69 τ.'}; },
 ()=>{ const tau=rnd(.05,.5); return {q:'Décharge : arrête quand <b>u_C ne vaut plus que 37 % de sa valeur initiale</b>.',tau,target:tau,f:t=>Math.exp(-t/tau),top:'U₀',fmt:fmtT,circuit:'Décharge RC : u_C(t)',colr:'#ff7a4d',e:'e⁻¹ ≈ 0,37 : à t = τ, il reste 37 %.'}; },
 ()=>{ const L=pick([10,22,47,100])*1e-3, R=pick([10,22,47,100]), tau=L/R; return {q:`Circuit RL : L = ${Math.round(L*1e3)} mH, R = ${R} Ω. Arrête quand <b>i atteint 95 % de E/R</b>.`,tau,target:3*tau,f:t=>1-Math.exp(-t/tau),top:'E/R',fmt:fmtT,circuit:'Établissement du courant RL : i(t)',colr:'#3ddc84',e:`τ = L/R = ${fmtT(tau)} ; 95 % sont atteints à 3τ = ${fmtT(3*tau)}.`}; },
 ()=>{ const R=pick([1,2.2,4.7])*1e3, Cc=pick([10,22,47])*1e-6, tau=R*Cc; return {q:`R = ${kO(R)}, C = ${Math.round(Cc*1e6)} µF. Arrête à <b>t = 3τ</b>.`,tau,target:3*tau,f:t=>1-Math.exp(-t/tau),top:'E',fmt:fmtT,circuit:'Charge RC : u_C(t)',e:`τ = RC = ${fmtT(tau)} donc 3τ = ${fmtT(3*tau)} (95 % de la charge).`}; }
])};

/* ---------- el3 : Bode ---------- */
const BT={pb1:['Passe-bas 1',(u)=>-10*Math.log10(1+u*u)],ph1:['Passe-haut 1',(u)=>-10*Math.log10(1+1/(u*u))],pb2:['Passe-bas 2',(u,Q)=>-10*Math.log10((1-u*u)**2+(u/Q)**2)],pbd:['Passe-bande',(u,Q)=>-10*Math.log10(1+Q*Q*(u-1/u)**2)]};
const hz=x=>{ const f=1000*10**x; return f>=1000?(f/1000).toPrecision(2).replace('.',',')+' kHz':Math.round(f)+' Hz'; };
D.el3={kind:'matcher',rounds:8,lives:3,intro:'Une courbe de gain (en dB) s’affiche en pointillés dorés. Choisis le type de filtre et règle la fréquence de coupure (et Q) pour que ta courbe se superpose à la cible.',outro:'1ᵉʳ ordre : pente de 20 dB/décade, −3 dB à la coupure. 2ᵈ ordre : 40 dB/décade, et une résonance si Q > 0,7.',
gen:i=>{ const types=i<3?['pb1','ph1']:['pb1','ph1','pb2','pbd']; const ty=pick(types), xc=Math.round(rnd(-1.2,1.2)*20)/20, Q=Math.round(rnd(.5,4)*10)/10;
  const tg=x=>BT[ty][1](10**(x-xc),Q);
  return {q:'Superpose ta courbe de gain à la cible.',target:tg,xr:[-2,2],yr:[-50,15],thr:.93,grid:[-2,-1,0,1,2].map(x=>({x,t:hz(x)})),
    controls:[{type:'choice',key:'ty',val:'pb1',opts:Object.entries(BT).map(([k,v])=>[k,v[0]])},{type:'slider',key:'xc',label:'f_c',min:-1.5,max:1.5,step:.05,val:0,fmt:hz},{type:'slider',key:'Q',label:'Q',min:.3,max:5,step:.1,val:1,fmt:v=>v.toFixed(1)}],
    f:v=>x=>BT[v.ty][1](10**(x-v.xc),v.Q), e:`C’était un ${BT[ty][0].toLowerCase()} avec f_c = ${hz(xc)}${ty.endsWith('2')||ty==='pbd'?` et Q = ${Q}`:''}.`};}};

/* ==================================== MATHS ==================================== */
D.ma1={kind:'rotor',rounds:8,lives:3,maxPerRound:100,successDelay:1300,intro:'Ton vaisseau est un nombre complexe. Chaque carte le transforme : ×i le fait tourner de 90°, ×2 l’éloigne, ×(1+i) le tourne de 45° en l’étirant de √2, z̄ le reflète… Atteins la cible avec le moins de coups possible.',outro:'Multiplier = tourner (de l’argument) et étirer (du module). Ajouter = translater. Conjuguer = symétrie par rapport à l’axe réel.',
levels:[{starts:[[1,0],[0,1],[2,0]],ops:['i','m1'],depth:[1,2]},{starts:[[1,0],[1,1]],ops:['i','x2'],depth:[2,3]},{starts:[[2,0],[2,2]],ops:['i','h','x2'],depth:[2,3]},{starts:[[1,0],[0,1]],ops:['p1i','m1'],depth:[2,3]},
  {starts:[[1,1],[2,1]],ops:['cj','i','a1'],depth:[2,4]},{starts:[[2,0],[1,1]],ops:['p1i','h','mi'],depth:[3,4]},{starts:[[1,0],[0,1]],ops:['i','a1','ai','x2'],depth:[3,4]},{starts:[[1,1],[2,0],[-1,1]],ops:['m1i','x2','cj','s1'],depth:[3,5]}]};

D.ma2={kind:'catch',rounds:10,lives:3,ask:'Attrape une <b>primitive</b> de',intro:'Des formules tombent. Déplace le panier (souris, doigt ou flèches ← →) pour attraper UNE PRIMITIVE de la fonction affichée. Attention aux pièges : dérivées, oublis de facteur, mauvais signes.',outro:'Pour vérifier une primitive : DÉRIVE-la, tu dois retrouver f. Repère les formes u′uⁿ, u′/u, u′e^u.',
items:[
 {q:'f(x)=2x',good:'x^2',bad:['2','x^2/2','2x^2'],e:'(x²)′ = 2x.'},
 {q:'f(x)=\\cos x',good:'\\sin x',bad:['-\\sin x','\\tan x','\\cos^2 x'],e:'(sin x)′ = cos x.'},
 {q:'f(x)=e^{3x}',good:'\\frac{e^{3x}}{3}',bad:['3e^{3x}','e^{3x}','\\frac{e^{3x+1}}{3x+1}'],e:'On divise par 3 pour compenser la dérivée de 3x.'},
 {q:'f(x)=\\frac1x',good:'\\ln|x|',bad:['-\\frac{1}{x^2}','\\ln(x^2)','\\frac{1}{\\ln x}'],e:'(ln|x|)′ = 1/x.'},
 {q:'f(x)=\\sin x',good:'-\\cos x',bad:['\\cos x','-\\sin x','\\frac{\\sin^2x}{2}'],e:'(−cos x)′ = sin x : attention au signe.'},
 {q:'f(x)=\\frac{1}{1+x^2}',good:'\\arctan x',bad:['\\ln(1+x^2)','\\arcsin x','\\frac{-2x}{(1+x^2)^2}'],e:'(arctan x)′ = 1/(1+x²).'},
 {q:'f(x)=\\frac{2x}{x^2+1}',good:'\\ln(x^2+1)',bad:['\\arctan x','\\frac{1}{x^2+1}','\\ln(2x)'],e:'Forme u′/u avec u = x² + 1.'},
 {q:'f(x)=x\\,e^{x^2}',good:'\\frac12e^{x^2}',bad:['e^{x^2}','2x\\,e^{x^2}','\\frac{x^2}{2}e^{x^2}'],e:'Forme ½·u′e^u avec u = x².'},
 {q:'f(x)=3x^2+1',good:'x^3+x',bad:['6x','x^3','3x^3+x'],e:'Terme à terme : x³ + x.'},
 {q:'f(x)=\\cos 2x',good:'\\frac12\\sin 2x',bad:['\\sin 2x','2\\sin 2x','-\\frac12\\sin 2x'],e:'On divise par 2.'},
 {q:'f(x)=\\frac{1}{\\sqrt x}',good:'2\\sqrt x',bad:['\\frac{\\sqrt x}{2}','-\\frac{1}{2x\\sqrt x}','\\ln\\sqrt x'],e:'(2√x)′ = 1/√x.'},
 {q:'f(x)=x\\cos x',good:'x\\sin x+\\cos x',bad:['x\\sin x','x\\sin x-\\cos x','\\frac{x^2}{2}\\sin x'],e:'IPP : u = x, v′ = cos x.'},
 {q:'f(x)=\\ln x',good:'x\\ln x-x',bad:['\\frac1x','x\\ln x','\\frac{(\\ln x)^2}{2}'],e:'IPP avec v′ = 1.'},
 {q:'f(x)=\\frac{1}{x-2}',good:'\\ln|x-2|',bad:['\\frac{-1}{(x-2)^2}','\\ln|x|-\\ln2','\\frac1x-\\frac12'],e:'Élément simple 1/(x − a) → ln|x − a|.'},
 {q:'f(x)=\\sin x\\cos x',good:'\\frac{\\sin^2x}{2}',bad:['\\cos^2x','\\sin^2x','\\frac{\\sin 2x}{2}'],e:'Forme u′u avec u = sin x.'}]};

D.ma3={kind:'matcher',rounds:8,lives:3,intro:'La cible est la solution de u″ + 2λu′ + ω₀²u = 0 avec u(0) = 1, u′(0) = 0. Règle l’amortissement λ et la pulsation propre ω₀ pour retrouver exactement la courbe.',outro:'λ contrôle l’enveloppe e^(−λt) ; ω₀ la vitesse des oscillations. λ < ω₀ : oscillations ; λ = ω₀ : critique ; λ > ω₀ : apériodique.',
gen:i=>{ const sol=(l,w)=>{ const D2=l*l-w*w; if(D2<-1e-6){ const om=Math.sqrt(-D2); return t=>Math.exp(-l*t)*(Math.cos(om*t)+l/om*Math.sin(om*t)); } if(D2<=1e-6) return t=>(1+l*t)*Math.exp(-l*t); const s=Math.sqrt(D2),a=-l+s,b=-l-s; return t=>(b*Math.exp(a*t)-a*Math.exp(b*t))/(b-a); };
  const l=Math.round(rnd(.05,i<4?.6:2.2)*20)/20, w=Math.round(rnd(.6,2.6)*20)/20;
  return {q:'Règle λ et ω₀ pour imiter la réponse cible.',target:sol(l,w),xr:[0,12],yr:[-1.2,1.2],thr:.95,grid:[0,2,4,6,8,10,12].map(x=>({x,t:'t='+x})),
    controls:[{type:'slider',key:'l',label:'λ',min:0,max:2.5,step:.05,val:1.2,fmt:v=>v.toFixed(2)},{type:'slider',key:'w',label:'ω₀',min:.3,max:3,step:.05,val:1,fmt:v=>v.toFixed(2)}],
    f:v=>sol(v.l,v.w), e:`C’était λ = ${l}, ω₀ = ${w}. Compte les oscillations (pseudo-pulsation √(ω₀² − λ²)) et regarde à quelle vitesse l’enveloppe décroît (λ).`};}};

D.ma4={kind:'visual',rounds:12,lives:3,time:18,intro:'Des domaines d’intégration défilent. Pour chacun, trouve les bonnes bornes (tranche verticale ou horizontale) ou le bon système de coordonnées.',outro:'Dessine toujours le domaine. Bornes intérieures = fonctions de la variable extérieure ; bornes extérieures = des nombres.',
gen:cyc([
 ()=>{ const a=ri(1,3); const Dm=pick([
   {f:[x=>0,x=>a-x],xr:[0,a],v:r`$0\le y\le ${a}-x$`,h:r`$0\le x\le ${a}-y$`,w:[r`$0\le y\le ${a}$`,r`$x\le y\le ${a}$`,r`$0\le y\le ${a}+x$`]},
   {f:[x=>x*x,x=>x],xr:[0,1],v:r`$x^2\le y\le x$`,h:r`$y\le x\le\sqrt y$`,w:[r`$x\le y\le x^2$`,r`$0\le y\le x^2$`,r`$\sqrt x\le y\le x$`]},
   {f:[x=>x,x=>2*x],xr:[0,1],v:r`$x\le y\le 2x$`,h:null,w:[r`$0\le y\le 2x$`,r`$2x\le y\le x$`,r`$x\le y\le 2$`]},
   {f:[x=>0,x=>Math.sqrt(Math.max(0,1-x*x))],xr:[0,1],v:r`$0\le y\le\sqrt{1-x^2}$`,h:r`$0\le x\le\sqrt{1-y^2}$`,w:[r`$0\le y\le 1-x^2$`,r`$0\le y\le 1-x$`,r`$x\le y\le 1$`]},
   {f:[x=>0,x=>x],xr:[0,1],v:r`$0\le y\le x$`,h:r`$y\le x\le 1$`,w:[r`$x\le y\le 1$`,r`$0\le y\le 1$`,r`$0\le x\le y$`]}]);
   const horiz=Dm.h&&Math.random()<.4; const good=horiz?Dm.h:Dm.v; const sc=300/Math.max(Dm.xr[1],Dm.f[1](Dm.xr[1])||1,1)*.95;
   const bad=shuffle(Dm.w.concat(horiz?[Dm.v]:[]).filter(s=>s!==good)).slice(0,2);
   return ask((c,t)=>{ const O=[250,420]; line(c,O[0]-20,O[1],O[0]+380,O[1],'rgba(255,255,255,.5)',2); line(c,O[0],O[1]+20,O[0],80,'rgba(255,255,255,.5)',2); text(c,'x',O[0]+390,O[1],col.dim,15); text(c,'y',O[0],70,col.dim,15);
     c.fillStyle='rgba(61,220,132,.25)'; c.beginPath(); for(let k=0;k<=80;k++){const x=Dm.xr[1]*k/80; c.lineTo(O[0]+x*sc,O[1]-Dm.f[1](x)*sc);} for(let k=80;k>=0;k--){const x=Dm.xr[1]*k/80; c.lineTo(O[0]+x*sc,O[1]-Dm.f[0](x)*sc);} c.closePath(); c.fill(); c.strokeStyle=col.ok; c.lineWidth=2; c.stroke();
     [0.5,1,1.5,2,2.5,3].filter(v=>v<=Math.max(Dm.xr[1],1)).forEach(v=>{ text(c,(''+v).replace('.',','),O[0]+v*sc,O[1]+16,col.dim,12); text(c,(''+v).replace('.',','),O[0]-16,O[1]-v*sc,col.dim,12); });
     const s=(Math.sin(t*1.5)+1)/2*.8+.1;
     if(!horiz){ const x=Dm.xr[1]*s; line(c,O[0]+x*sc,O[1]-Dm.f[0](x)*sc,O[0]+x*sc,O[1]-Dm.f[1](x)*sc,col.e,5); }
     else { const ymax=Dm.f[1](Dm.xr[1]); const y=ymax*s; let xa=0,xb=0; for(let k=0;k<=400;k++){ const x=Dm.xr[1]*k/400; if(Dm.f[0](x)<=y&&Dm.f[1](x)>=y){ if(!xa) xa=x||1e-9; xb=x; } } line(c,O[0]+xa*sc,O[1]-y*sc,O[0]+xb*sc,O[1]-y*sc,col.e,5); } },
     horiz?'Tranche <b>horizontale</b> (y fixé) : x va…':'Tranche <b>verticale</b> (x fixé) : y va…',[good,...bad],0,'Lis sur le dessin où la tranche rouge entre dans le domaine et où elle en sort : ce sont les deux courbes qui le bordent.'); },
 ()=>{ const k=ri(0,3); const ans=[1,1,2,0][k]; const opts=['cartésiennes','polaires / cylindriques','sphériques'];
   return ask(c=>{ const x=400,y=260; if(k===0){ c.fillStyle='rgba(61,220,132,.3)'; c.beginPath(); c.arc(x,y,150,0,7); c.arc(x,y,70,0,7,true); c.fill(); text(c,'couronne  1 ≤ x² + y² ≤ 4',x,y+190,col.dim,14); }
     if(k===1){ c.strokeStyle=col.b; c.lineWidth=3; c.beginPath(); c.ellipse(x,130,90,26,0,0,7); c.stroke(); line(c,x-90,130,x-90,380,col.b,3); line(c,x+90,130,x+90,380,col.b,3); c.beginPath(); c.ellipse(x,380,90,26,0,0,Math.PI); c.stroke(); text(c,'cylindre x² + y² ≤ R², 0 ≤ z ≤ h',x,440,col.dim,14); }
     if(k===2){ const g=c.createRadialGradient(x-40,y-40,10,x,y,150); g.addColorStop(0,'#8fe6c3'); g.addColorStop(1,'#0b5d47'); c.fillStyle=g; c.beginPath(); c.arc(x,y,140,0,7); c.fill(); text(c,'boule x² + y² + z² ≤ R²',x,y+180,col.dim,14); }
     if(k===3){ c.fillStyle='rgba(61,220,132,.3)'; c.fillRect(x-160,y-100,320,200); text(c,'rectangle [0, 2] × [0, 1]',x,y+140,col.dim,14); } },
     'Quelles coordonnées pour intégrer sur ce domaine ?',opts,ans,'Rond dans le plan ou symétrie d’axe ⇒ polaires/cylindriques (r dr dθ) ; boule ⇒ sphériques (r² cos φ) ; rectangle ⇒ cartésiennes.'); }
])};

D.ma5={kind:'gauss',rounds:6,lives:3,maxPerRound:100,successDelay:1400,intro:'Une matrice augmentée (système 3×3). Clique la ligne à modifier, puis la ligne pivot, et choisis k pour faire Lᵢ ← Lᵢ + k·Lⱼ. But : des 0 partout sous la diagonale, en un minimum de coups. Puis trouve z.',outro:'On élimine colonne par colonne avec le pivot du dessus. Lᵢ ← Lᵢ + kLⱼ ne change pas les solutions (ni le déterminant).',
levels:[{piv:[1],k:2},{piv:[1],k:2},{piv:[1,-1],k:3},{piv:[1,-1],k:3},{piv:[1,2,-1],k:3},{piv:[1,2,-1,3],k:3}]};

D.ma6={kind:'matcher',rounds:8,lives:3,intro:'Synthétiseur de Fourier : la cible est une somme de sinusoïdes. Règle l’amplitude de chaque harmonique b₁ sin t, b₂ sin 2t… pour reconstruire le signal. Le spectre (barres) t’aide.',outro:'Un signal périodique = somme d’harmoniques. Le créneau n’a que des harmoniques impaires (en 1/n), la dent de scie a toutes les harmoniques avec des signes alternés.',
gen:i=>{ const N=i<2?2:i<5?3:4; let b; if(i===5) b=[1.15,0,.38,0]; else if(i===6) b=[1,-.5,.35,-.25]; else b=Array.from({length:4},(_,k)=>k<N?Math.round(rnd(-1,1)*4)/4:0); if(b.every(v=>!v)) b[0]=1;
  const S=bb=>t=>bb.reduce((s,v,k)=>s+v*Math.sin((k+1)*t),0);
  const controls=Array.from({length:N},(_,k)=>({type:'slider',key:'b'+k,label:`b${'₁₂₃₄'[k]}`,min:-1.2,max:1.2,step:.05,val:0,fmt:v=>v.toFixed(2)}));
  return {q:i===5?'Reconstruis ce <b>créneau</b> (approché).':i===6?'Reconstruis cette <b>dent de scie</b>.':'Retrouve les amplitudes des harmoniques.',target:S(b),xr:[0,4*Math.PI],yr:[-2.2,2.2],thr:.95,
    controls,f:v=>S(Array.from({length:4},(_,k)=>v['b'+k]||0)),grid:[0,1,2,3,4].map(k=>({x:k*Math.PI,t:k?k+'π':'0'})),e:`Les amplitudes étaient : ${b.slice(0,N).map((v,k)=>`b${k+1} = ${v}`).join(', ')}.`,
    extra:(c,v)=>{ for(let k=0;k<N;k++){ const x=90+k*40; rrect(c,x,40+(1-Math.abs(b[k])/1.2)*36,14,Math.abs(b[k])/1.2*36,3,'rgba(255,212,92,.7)'); rrect(c,x+16,40+(1-Math.abs(v['b'+k]||0)/1.2)*36,14,Math.abs(v['b'+k]||0)/1.2*36,3,col.b); text(c,''+(k+1),x+15,88,col.dim,11); } } };}};

D.ma7={kind:'visual',rounds:12,lives:3,time:18,intro:'Le prisme : associe chaque signal à son spectre, devine l’effet d’un retard ou d’une compression, et décide si une intégrale généralisée converge.',outro:'Signal bref ⇔ spectre large. Un retard ne change pas |f̂|. ∫₁^∞ dt/t^α converge ⇔ α > 1 ; ∫₀¹ dt/t^α converge ⇔ α < 1.',
gen:cyc([
 ()=>{ const a=pick([.5,1,2]); const ws=shuffle([a,a*2,a/2]); const lab=['A','B','C']; const ans=ws.indexOf(a);
   const sinc=x=>Math.abs(x)<1e-9?1:Math.sin(Math.PI*x)/(Math.PI*x);
   return ask(c=>{ text(c,'signal : porte de largeur '+String(a).replace('.',','),200,100,'#fff',15); line(c,40,260,360,260,'rgba(255,255,255,.4)',1.5); const sc=60; c.strokeStyle=col.gold; c.lineWidth=3; c.beginPath(); c.moveTo(40,260); c.lineTo(200-a/2*sc,260); c.lineTo(200-a/2*sc,170); c.lineTo(200+a/2*sc,170); c.lineTo(200+a/2*sc,260); c.lineTo(360,260); c.stroke();
     ws.forEach((w,k)=>{ const y0=110+k*120; line(c,420,y0+40,760,y0+40,'rgba(255,255,255,.3)',1); c.strokeStyle=[col.e,col.b,col.vio][k]; c.lineWidth=2.5; c.beginPath(); for(let j=0;j<=200;j++){ const l=-3+6*j/200; const y=y0+40-sinc(w*l)*45; j?c.lineTo(420+j*1.7,y):c.moveTo(420,y);} c.stroke(); text(c,lab[k],405,y0+20,'#fff',16); for(let l=-2;l<=2;l++){ const X=420+(l+3)/6*340; line(c,X,y0+36,X,y0+44,'rgba(255,255,255,.5)',1.5); text(c,''+l,X,y0+54,col.dim,10); } }); text(c,'λ →',770,450,col.dim,12,'right'); },
     'Quel spectre correspond à ce signal ?',['A','B','C'],ans,`Le spectre d’une porte de largeur a est en sin(πaλ)/(πλ) : premier zéro en λ = 1/a = ${String(1/a).replace('.',',')}. Plus la porte est large, plus le spectre est étroit.`,true); },
 ()=>{ const k=ri(0,3); const yes=k===1||k===3; const names=['échelon U(t)','e^(−|t|)','constante 1','porte Π(t)'];
   return ask(c=>{ line(c,100,320,700,320,'rgba(255,255,255,.4)',1.5); line(c,400,340,400,120,'rgba(255,255,255,.4)',1.5); c.strokeStyle=col.gold; c.lineWidth=3; c.beginPath();
     for(let j=0;j<=300;j++){ const t=-5+10*j/300; const y=[t>=0?1:0,Math.exp(-Math.abs(t)),1,Math.abs(t)<.5?1:0][k]; const X=400+t*60, Y=320-y*150; j?c.lineTo(X,Y):c.moveTo(X,Y);} c.stroke(); text(c,names[k],400,90,'#fff',17); },
     'Ce signal a-t-il une transformée de Fourier (au sens des fonctions) ?',['oui','non'],yes?0:1,'Il faut ∫|f| < ∞ (aire finie). U(t) et 1 ont une aire infinie : pas de TF (on utilise Laplace pour U).'); },
 ()=>{ const inf=Math.random()<.5; const al=pick([.5,1,1.5,2,3]); const conv=inf?al>1:al<1;
   return ask(c=>{ line(c,100,380,700,380,'rgba(255,255,255,.4)',1.5); line(c,120,400,120,80,'rgba(255,255,255,.4)',1.5); c.strokeStyle=col.b; c.lineWidth=3; c.beginPath(); for(let j=0;j<=300;j++){ const t=inf?1+j/300*14:.02+j/300*.98; const y=Math.pow(t,-al); const X=inf?120+(t-1)/14*560:120+t*560, Y=380-Math.min(y,inf?1.1:12)*(inf?260:24); j?c.lineTo(X,Y):c.moveTo(X,Y);} c.stroke();
     text(c,`f(t) = 1/t^${String(al).replace('.',',')}  sur ${inf?'[1, +∞[':']0, 1]'}`,400,60,'#fff',17); },
     `L’intégrale $\\int_{${inf?'1':'0'}}^{${inf?'+\\infty':'1'}}\\frac{\\mathrm dt}{t^{${String(al)}}}$…`,['converge','diverge'],conv?0:1,inf?'En +∞ : converge ⇔ α > 1 (la courbe tombe assez vite).':'En 0 : converge ⇔ α < 1 (la courbe ne monte pas trop vite).'); },
 ()=>{ const k=ri(0,1);
   return ask((c,t)=>{ line(c,80,300,720,300,'rgba(255,255,255,.4)',1.5); const g=(x,cx,w)=>Math.exp(-(((x-cx)/w)**2)); c.lineWidth=3;
     c.strokeStyle='rgba(255,212,92,.5)'; c.beginPath(); for(let j=0;j<=300;j++){ const x=80+j*640/300; const y=300-140*g(x,300,40); j?c.lineTo(x,y):c.moveTo(x,y);} c.stroke(); text(c,'f(t)',300,140,col.gold,15);
     c.strokeStyle=col.b; c.beginPath(); for(let j=0;j<=300;j++){ const x=80+j*640/300; const y=300-140*(k?g(x,520,40):g(x,300,20)); j?c.lineTo(x,y):c.moveTo(x,y);} c.stroke(); text(c,k?'f(t − a)':'f(2t)',k?520:360,k?140:180,col.b,15); },
     k?'Le module $|\\hat g(\\lambda)|$ du signal <b>retardé</b>, comparé à $|\\hat f|$, est…':'Le spectre du signal <b>compressé</b> f(2t) est…',k?['identique','plus large','plus étroit']:['plus large','identique','plus étroit'],0,k?'Retard : ĝ = e^(−2iπλa) f̂ : seule la phase tourne, le module ne change pas.':'f(at) → (1/|a|) f̂(λ/a) : compresser le temps étale le spectre.'); }
])};

D.ma8={kind:'catch',rounds:10,lives:3,ask:'Attrape la <b>transformée de Laplace</b> de',intro:'Le traducteur : des transformées tombent, attrape la bonne image F(p) de la fonction affichée. Le dictionnaire et les propriétés (retard, décalage, dérivation) doivent devenir des réflexes.',outro:'1 → 1/p, tⁿ → n!/pⁿ⁺¹, e^{at} → 1/(p−a), cos → p/(p²+ω²), sin → ω/(p²+ω²), retard → ×e^{−ap}, dérivée → pF − f(0).',
items:[
 {q:'1',good:'\\frac1p',bad:['p','1','\\frac1{p^2}']},
 {q:'t',good:'\\frac1{p^2}',bad:['\\frac1p','\\frac2{p^3}','p^2']},
 {q:'t^2',good:'\\frac2{p^3}',bad:['\\frac1{p^3}','\\frac2{p^2}','\\frac1{p^2}']},
 {q:'e^{2t}',good:'\\frac1{p-2}',bad:['\\frac1{p+2}','\\frac2p','e^{-2p}']},
 {q:'e^{-3t}',good:'\\frac1{p+3}',bad:['\\frac1{p-3}','\\frac{-3}{p}','\\frac3{p^2+9}']},
 {q:'\\cos 2t',good:'\\frac{p}{p^2+4}',bad:['\\frac2{p^2+4}','\\frac{p}{p^2-4}','\\frac{p}{p^2+2}']},
 {q:'\\sin 3t',good:'\\frac3{p^2+9}',bad:['\\frac{p}{p^2+9}','\\frac3{p^2-9}','\\frac1{p^2+9}']},
 {q:'U(t-2)',good:'\\frac{e^{-2p}}{p}',bad:['\\frac{e^{2p}}{p}','\\frac1{p-2}','e^{-2p}']},
 {q:'t\\,e^{t}',good:'\\frac1{(p-1)^2}',bad:['\\frac1{(p+1)^2}','\\frac1{p(p-1)}','\\frac1{p^2}']},
 {q:'e^{-t}\\cos t',good:'\\frac{p+1}{(p+1)^2+1}',bad:['\\frac{p}{(p+1)^2+1}','\\frac1{(p+1)^2+1}','\\frac{p-1}{(p-1)^2+1}']},
 {q:'\\sinh 2t',good:'\\frac2{p^2-4}',bad:['\\frac2{p^2+4}','\\frac{p}{p^2-4}','\\frac1{p-2}']},
 {q:"f'(t)",good:'pF(p)-f(0)',bad:['\\frac{F(p)}{p}','pF(p)',"F'(p)"]},
 {q:'\\int_0^tf(u)\\,\\mathrm du',good:'\\frac{F(p)}{p}',bad:['pF(p)',"-F'(p)",'F(p)-f(0)']},
 {q:'(t-1)\\,U(t-1)',good:'\\frac{e^{-p}}{p^2}',bad:['\\frac{e^{p}}{p^2}','\\frac1{(p-1)^2}','\\frac1{p^2}-e^{-p}']},
 {q:'\\delta(t)',good:'1',bad:['0','\\frac1p','p']}]};
})();
