/* ============ Atlas Arcade — vrais jeux de maths (ch. 3, 4, 6, 7) ============ */
(function(){
const K=window.GKINDS, D=window.GDEFS, C=window.GC; const {text,arrow,circle,glow,line,rrect,col,pick,ri,rnd,shuffle,clamp}=C;
['ma3','ma4','ma6','ma7'].forEach(k=>{ if(D[k]) D[k+'q']=D[k]; });
const fr=(v,d=2)=>(+v.toFixed(d)).toString().replace('.',',');
const r=String.raw;

/* =================================================================== */
/*  MA.3 — SUSPENSION : u″ + 2λu′ + ω₀²u = excitation de la route         */
/* =================================================================== */
const bump=(h,w)=>x=>x>0&&x<w?h*0.5*(1-Math.cos(2*Math.PI*x/w)):0;
const ROADS=[
 {len:2600,feats:[[400,'b',30,80],[1000,'b',30,80],[1600,'b',-30,80],[2100,'b',30,80]],msg:'Des bosses isolées. Trouve un amortissement qui ne fait ni rebondir ni secouer.'},
 {len:2800,feats:[[400,'b',32,70],[620,'b',32,70],[1200,'w',7,140,800],[2200,'b',-32,70]],msg:'⚠ Tôle ondulée annoncée : attention à la RÉSONANCE.'},
 {len:3000,feats:[[350,'w',6,70,900],[1500,'b',38,90],[1750,'b',38,90],[2300,'w',6,70,600]],msg:'Tôle ondulée rapide, puis grosses bosses : adapte ω₀ en roulant.'},
 {len:3000,feats:[[400,'b',30,70],[700,'b',30,70],[1000,'b',30,70],[1300,'b',30,70],[1800,'w',8,160,900]],msg:'Bosses régulières : si elles tombent au rythme de ta suspension, ça s’amplifie !'},
 {len:3200,feats:[[300,'w',6,60,800],[1300,'b',-38,80],[1600,'b',38,80],[2100,'w',8,150,800],[3000,'b',30,70]],msg:'Le grand test : tout à la fois.'},
 {len:3400,feats:[[300,'b',35,70],[520,'b',35,70],[900,'w',7,70,900],[2000,'w',9,170,700],[2900,'b',-40,90]],msg:'Rallye final.'}];
K.susp={
  start(G){ G.su={l:1,w:8,keys:{}}; },
  round(G,i){ const S0=G.su, R=ROADS[i%ROADS.length];
    const road=x=>R.feats.reduce((s,f)=>{ const [x0,t,h,w,L]=f; if(t==='b') return s+bump(h,w)(x-x0); if(x>x0&&x<x0+L) return s+h*Math.sin(2*Math.PI*(x-x0)/w); return s; },0);
    Object.assign(S0,{R,road,X:0,y:0,v:0,cafe:1,tal:0,acc:0,hist:[]}); G.prompt(R.msg); clearTimeout(G._ph); G._ph=setTimeout(()=>G.state==='play'&&G.prompt(null),4500);
    G.panel([{label:'λ −',on:()=>{S0.l=Math.max(.3,S0.l-.3);}},{label:'λ +',on:()=>{S0.l=Math.min(12,S0.l+.3);}},{label:'ω₀ −',on:()=>{S0.w=Math.max(2,S0.w-.5);}},{label:'ω₀ +',on:()=>{S0.w=Math.min(16,S0.w+.5);}}]); },
  key(G,k,d){ const S0=G.su; if(!d) return; if(k==='ArrowUp') S0.l=Math.min(12,S0.l+.3); if(k==='ArrowDown') S0.l=Math.max(.3,S0.l-.3); if(k==='ArrowRight') S0.w=Math.min(16,S0.w+.5); if(k==='ArrowLeft') S0.w=Math.max(2,S0.w-.5); },
  update(G,dt){ const S0=G.su; if(!S0||!S0.road||G.busy) return; const V=170; const n=6, h=dt/n;
    for(let k=0;k<n;k++){ const r=S0.road(S0.X+250), rp=(S0.road(S0.X+250+1)-S0.road(S0.X+250-1))/2*V; const a=-2*S0.l*(S0.v-rp)-S0.w*S0.w*(S0.y-r); S0.v+=a*h; S0.y+=S0.v*h; S0.X+=V*h; S0.acc=a;
      if(Math.abs(a)>900) S0.cafe-=(Math.abs(a)-900)*0.0006*h; S0.tal-=h; if(Math.abs(S0.y-r)>24&&S0.tal<=0){ S0.tal=0.6; S0.cafe-=0.3; G.shake(); G.sfx('bad'); G.toast('Talonnage !',col.bad); } }
    S0.hist.push(S0.acc); if(S0.hist.length>200) S0.hist.shift();
    if(S0.cafe<=0){ S0.cafe=0; return G.fail('Café renversé !',`Repère : λ = amortissement, ω₀ = raideur. Bosses : λ ≈ ω₀ (régime critique) évite le rebond. Tôle ondulée à ω_route : il faut ω₀ BIEN PLUS PETIT que ω_route (filtrage, comme un passe-bas) et surtout pas ω₀ ≈ ω_route (résonance). Trop souple ⇒ talonnage sur les grosses bosses.`,{retry:true}); }
    if(S0.X>S0.R.len) G.success(40+Math.round(60*S0.cafe),S0.cafe>.8?'Pas une goutte !':'Arrivé !'); },
  draw(G,c){ const S0=G.su; if(!S0||!S0.road) return; const base=360, X0=S0.X;
    c.fillStyle='#1a1f3d'; c.beginPath(); c.moveTo(0,500); for(let sx=0;sx<=800;sx+=4) c.lineTo(sx,base-S0.road(X0+sx)); c.lineTo(800,500); c.closePath(); c.fill(); c.strokeStyle='#8790b8'; c.lineWidth=3; c.beginPath(); for(let sx=0;sx<=800;sx+=4){ const y=base-S0.road(X0+sx); sx?c.lineTo(sx,y):c.moveTo(sx,y);} c.stroke();
    S0.R.feats.forEach(f=>{ if(f[1]==='w'){ const sx=f[0]-X0; if(sx>-f[4]&&sx<820){ const om=2*Math.PI*170/f[3]; text(c,`⚠ tôle ondulée · ω_route = ${fr(om,1)} rad/s`,clamp(sx+60,120,700),base-90,col.gold,12); } } });
    const r=S0.road(X0+250), wy=base-r, by=base-S0.y-55;
    [215,285].forEach(wx=>{ circle(c,wx,wy-14,14,'#222','#999',3); line(c,wx,wy-14,wx,by+18,'#c0c4d8',2,[3,3]); });
    rrect(c,180,by-6,140,30,10,'#5b4bd6'); rrect(c,205,by-28,80,26,8,'#3a2f99'); const tilt=clamp(S0.acc/3000,-0.6,0.6);
    c.save(); c.translate(250,by-38); c.rotate(tilt*0.3); rrect(c,-10,-18,20,22,4,'rgba(255,255,255,.85)'); c.fillStyle='#6b3b1f'; c.fillRect(-8,-16+(1-S0.cafe)*18,16,Math.max(0,S0.cafe*18)); c.restore();
    rrect(c,14,40,270,92,12,'rgba(10,12,30,.82)'); text(c,`λ = ${fr(S0.l,1)} s⁻¹   ω₀ = ${fr(S0.w,1)} rad/s`,149,60,'#fff',14);
    const reg=S0.l<S0.w*0.9?'pseudo-périodique (rebondit)':S0.l>S0.w*1.1?'apériodique (raide)':'≈ critique'; text(c,reg,149,82,col.dim,12);
    rrect(c,24,98,250*S0.cafe,12,6,S0.cafe>.4?'#c58b4a':'#ff5470'); text(c,'☕ café',149,122,col.dim,11);
    const gx=520,gy=40,gw=266,gh=64; rrect(c,gx,gy,gw,gh,10,'rgba(10,12,30,.8)'); line(c,gx,gy+gh/2-900/3000*gh/2,gx+gw,gy+gh/2-900/3000*gh/2,'rgba(255,84,112,.4)',1,[4,4]); line(c,gx,gy+gh/2+900/3000*gh/2,gx+gw,gy+gh/2+900/3000*gh/2,'rgba(255,84,112,.4)',1,[4,4]);
    c.strokeStyle=col.b; c.lineWidth=2; c.beginPath(); S0.hist.forEach((a,k)=>{ const yy=gy+gh/2-clamp(a,-3000,3000)/3000*gh/2; k?c.lineTo(gx+k/200*gw,yy):c.moveTo(gx,yy); }); c.stroke(); text(c,'accélération ressentie',gx+8,gy+10,col.dim,10,'left');
    rrect(c,300,470,500*0+400*Math.min(1,S0.X/S0.R.len),6,3,col.ok); text(c,'↑↓ λ · ←→ ω₀',700,488,col.dim,11); }
};
D.ma3={kind:'susp',rounds:6,lives:3,maxPerRound:100,successDelay:1400,
 intro:'Ta voiture transporte un café sans couvercle. Sa suspension obéit à y″ + 2λ(y′ − r′) + ω₀²(y − r) = 0, où r(x) est la route. Règle en roulant l’amortissement λ (↑ ↓) et la raideur ω₀ (← →) : trop peu amorti, ça rebondit ; trop raide, ça secoue ; trop souple, ça talonne ; et gare à la résonance.',
 outro:'λ < ω₀ : oscillations amorties ; λ = ω₀ : critique (retour le plus rapide sans rebond) ; λ > ω₀ : apériodique. Excitation périodique à ω : résonance si ω ≈ ω₀, filtrage si ω ≫ ω₀.'};

/* =================================================================== */
/*  MA.4 — DÉCOUPE : trancher le bon domaine                            */
/* =================================================================== */
const N=40, arc=(cx,cy,r,a0,a1)=>Array.from({length:N+1},(_,k)=>{ const a=a0+(a1-a0)*k/N; return [cx+r*Math.cos(a),cy+r*Math.sin(a)]; });
const fn=(f,a,b)=>Array.from({length:N+1},(_,k)=>{ const x=a+(b-a)*k/N; return [x,f(x)]; });
const SH=[
 {id:'t1',b:r`0\le x\le1,\ \ 0\le y\le 1-x`,p:[[0,0],[1,0],[0,1]],box:[0,1.2]},
 {id:'t2',b:r`0\le x\le1,\ \ 0\le y\le x`,p:[[0,0],[1,0],[1,1]],box:[0,1.2]},
 {id:'t3',b:r`0\le x\le1,\ \ x\le y\le 1`,p:[[0,0],[1,1],[0,1]],box:[0,1.2]},
 {id:'ln',b:r`0\le x\le1,\ \ x^2\le y\le x`,p:[...fn(x=>x,0,1),...fn(x=>x*x,1,0)],box:[0,1.2]},
 {id:'up',b:r`0\le x\le1,\ \ 0\le y\le x^2`,p:[[0,0],[1,0],...fn(x=>x*x,1,0)],box:[0,1.2]},
 {id:'rc',b:r`0\le x\le2,\ \ 0\le y\le 1`,p:[[0,0],[2,0],[2,1],[0,1]],box:[0,2.2]},
 {id:'qd',b:r`0\le r\le1,\ \ 0\le\theta\le\frac\pi2`,p:[[0,0],...arc(0,0,1,0,Math.PI/2)],box:[0,1.2]},
 {id:'hd',b:r`0\le r\le1,\ \ 0\le\theta\le\pi`,p:arc(0,0,1,0,Math.PI),box:[-1.1,1.1],cy:true},
 {id:'qa',b:r`1\le r\le2,\ \ 0\le\theta\le\frac\pi2`,p:[...arc(0,0,2,0,Math.PI/2),...arc(0,0,1,Math.PI/2,0)],box:[0,2.2]},
 {id:'dk',b:r`0\le r\le1,\ \ 0\le\theta\le2\pi`,p:arc(0,0,1,0,2*Math.PI),box:[-1.1,1.1],cen:true},
 {id:'dq',b:r`0\le y\le1,\ \ 0\le x\le\sqrt{y}`,p:[[0,0],...fn(y=>Math.sqrt(y),0,1).map(([y,x])=>[x,y]),[0,1]],box:[0,1.2]}];
K.slicer={
  start(G){ G.sl={trail:[]}; },
  round(G,i){ const S0=G.sl; const tgt=pick(SH); Object.assign(S0,{tgt,fly:[],t:0,wave:0}); G.prompt(`Tranche le domaine : &nbsp;$${tgt.b}$`); K.slicer.launch(G); G.panel([]); },
  launch(G){ const S0=G.sl; const others=shuffle(SH.filter(s=>s!==S0.tgt)).slice(0,2+Math.min(2,Math.floor(G.i/4))); const set=shuffle([S0.tgt,...others]);
    set.forEach((s,k)=>S0.fly.push({s,x:rnd(130,670),y:560+k*60,vx:rnd(-60,60),vy:-rnd(520,600)-G.i*8,cut:false})); S0.wave++; },
  pointer(G,t,x,y){ const S0=G.sl; if(t==='down'){ S0.down=true; S0.trail=[[x,y,G.t]]; } if(t==='up') S0.down=false;
    if(t==='move'&&S0.down&&!G.busy){ const p=S0.trail[S0.trail.length-1]; S0.trail.push([x,y,G.t]); if(S0.trail.length>20) S0.trail.shift();
      S0.fly.forEach(f=>{ if(f.cut) return; const d=segDist(f.x,f.y,p[0],p[1],x,y); if(d<52&&Math.hypot(x-p[0],y-p[1])>6){ f.cut=true; f.ct=0;
        if(f.s===S0.tgt){ G.burst(f.x,f.y,col.ok,40); G.success(70+Math.max(0,30-Math.round(S0.t*3)),'Tranché !'); }
        else { G.burst(f.x,f.y,col.bad,30); G.fail('Mauvais domaine',`Tu as tranché le domaine $${f.s.b}$. Lis les bornes : la variable extérieure a des bornes NUMÉRIQUES, l’intérieure peut dépendre de l’autre (y entre deux courbes, ou r et θ en polaires).`); } } }); } },
  update(G,dt){ const S0=G.sl; if(!S0||!S0.fly) return; S0.t+=dt; S0.fly.forEach(f=>{ f.vy+=520*dt; f.x+=f.vx*dt; f.y+=f.vy*dt; if(f.cut) f.ct+=dt; });
    if(!G.busy&&S0.fly.every(f=>f.y>600||f.cut)){ S0.fly=[]; K.slicer.launch(G); } S0.trail=S0.trail.filter(p=>G.t-p[2]<.25); },
  draw(G,c){ const S0=G.sl; if(!S0||!S0.fly) return;
    S0.fly.forEach(f=>{ const s=f.s, sz=104; c.save(); c.translate(f.x,f.y); if(f.cut){ c.globalAlpha=Math.max(0,1-f.ct*2); c.rotate(f.ct*3); }
      rrect(c,-sz/2,-sz/2,sz,sz,14,'rgba(20,24,52,.92)','rgba(255,255,255,.25)'); const [a,b]=s.box, sc=(sz-26)/(b-a), ox=-sz/2+13, oy=sz/2-13;
      const X=u=>ox+(u-a)*sc, Y=v=>oy-(v-(s.cen||s.cy?a:0))*sc*(s.cen?1:1);
      const yy=v=>s.cen?oy-(v-a)*sc:oy-v*sc*(s.cy?1:1); const xa=s.cen||s.cy?X(0):X(0), ya=s.cen?yy(0):oy;
      line(c,ox-4,ya,sz/2-6,ya,'rgba(255,255,255,.5)',1.2); line(c,xa,oy+4,xa,-sz/2+6,'rgba(255,255,255,.5)',1.2);
      c.fillStyle='rgba(61,220,132,.55)'; c.strokeStyle='#3ddc84'; c.lineWidth=2; c.beginPath(); s.p.forEach(([u,v],k)=>{ const px=X(u), py=s.cen?yy(v):oy-v*sc; k?c.lineTo(px,py):c.moveTo(px,py); }); c.closePath(); c.fill(); c.stroke();
      text(c,'x',sz/2-8,ya-8,'#aaa',10); text(c,'y',xa+8,-sz/2+10,'#aaa',10); c.restore(); });
    if(S0.trail.length>1){ c.strokeStyle='rgba(255,255,255,.85)'; c.lineWidth=4; c.lineCap='round'; c.beginPath(); S0.trail.forEach((p,k)=>k?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1])); c.stroke(); } }
};
function segDist(px,py,x1,y1,x2,y2){ const dx=x2-x1,dy=y2-y1,L=dx*dx+dy*dy; let t=L?((px-x1)*dx+(py-y1)*dy)/L:0; t=clamp(t,0,1); return Math.hypot(px-x1-t*dx,py-y1-t*dy); }
D.ma4={kind:'slicer',rounds:12,lives:3,maxPerRound:100,successDelay:1100,
 intro:'Des domaines d’intégration sont lancés en l’air. Les bornes demandées s’affichent en haut : tranche (glisse la souris ou le doigt) UNIQUEMENT le domaine qui correspond. Attention aux pièges : triangles retournés, polaires vs cartésiennes…',
 outro:'Pour lire des bornes : la variable extérieure a des bornes numériques ; à x fixé, y va de la courbe du bas à la courbe du haut. En polaires, r est la distance à l’origine et θ l’angle depuis l’axe des x.'};

/* =================================================================== */
/*  MA.6 — DÉFENSE HARMONIQUE : identifier le rang n                     */
/* =================================================================== */
K.harmdef={
  round(G,i){ const S0=G.hd={en:[],q:[],t:0,n:7+i*2,done:0,laser:[]}; for(let k=0;k<S0.n;k++){ const md=i<2?'sig':i<4?pick(['sig','sig','win2']):pick(['sig','win2','spec']); S0.q.push({at:k*(2.6-i*0.22),h:ri(2,9),lane:ri(0,3),md}); }
    G.prompt(`Vague ${i+1} : tape le <b>rang n</b> de chaque harmonique (touches 2 à 9) avant qu’il atteigne la base.`); clearTimeout(G._ph); G._ph=setTimeout(()=>G.state==='play'&&G.prompt(null),4000);
    G.panel([2,3,4,5,6,7,8,9].map(n=>({label:'n = '+n,on:()=>K.harmdef.shoot(G,n)}))); },
  key(G,k,d){ if(d&&/^[2-9]$/.test(k)) K.harmdef.shoot(G,+k); },
  shoot(G,n){ const S0=G.hd; if(!S0||G.busy) return; const tg=S0.en.filter(e=>!e.dead&&e.h===n).sort((a,b)=>a.x-b.x)[0];
    if(tg){ tg.dead=true; S0.laser.push({x:tg.x,y:tg.y,t:.25}); G.score+=15+Math.min(G.combo,6)*3; G.combo++; G.sfx('good'); G.burst(tg.x+80,tg.y,col.gold,18); G.hud(); }
    else { G.combo=0; G.score=Math.max(0,G.score-5); G.sfx('tick'); G.toast(`aucun harmonique n = ${n}`,col.gold); G.hud(); } },
  update(G,dt){ const S0=G.hd; if(!S0||G.busy) return; S0.t+=dt; while(S0.q.length&&S0.q[0].at<=S0.t){ const q=S0.q.shift(); S0.en.push({...q,x:820,y:[90,170,250,330][q.lane]}); }
    const sp=48+G.i*9; S0.en.forEach(e=>{ if(e.dead) return; e.x-=sp*dt; if(e.x<95){ e.dead=true; S0.lost=true; G.lives--; G.combo=0; G.shake(); G.sfx('bad'); G.toast(`C’était n = ${e.h}`,col.bad); G.hud(); if(G.lives<=0) G.finish(false); } });
    S0.done=S0.en.filter(e=>e.dead).length; S0.laser.forEach(l=>l.t-=dt); S0.laser=S0.laser.filter(l=>l.t>0); S0.en=S0.en.filter(e=>!e.dead||e.x>0&&false);
    if(!S0.q.length&&!S0.en.length&&G.state==='play') G.success(60,'Vague repoussée !'); },
  draw(G,c){ const S0=G.hd; if(!S0) return; rrect(c,8,60,80,320,14,'rgba(60,199,214,.12)','rgba(60,199,214,.5)'); text(c,'🎛',48,220,'#fff',30); text(c,'base',48,258,col.dim,11);
    S0.laser.forEach(l=>{ c.globalAlpha=l.t*4; line(c,88,220,l.x+60,l.y,'#ffd45c',3); c.globalAlpha=1; });
    S0.en.forEach(e=>{ const w=160,h=66,x=e.x,y=e.y; rrect(c,x,y-h/2,w,h,10,'rgba(40,20,60,.9)','#ff5470');
      if(e.md==='spec'){ for(let k=1;k<=10;k++){ const bx=x+10+(k-1)*14.5; line(c,bx,y+24,bx,y+24-(k===1?36:k===e.h?28:2),k===1?'#9fb4ff':'#ff7a4d',5); } text(c,'spectre',x+w-6,y-18,'#ffb3c0',9,'right'); }
      else { const per=e.md==='win2'?2:1; c.strokeStyle='#ff7a4d'; c.lineWidth=2; c.beginPath(); for(let k=0;k<=150;k++){ const t=k/150*per*2*Math.PI; const yy=y-18*Math.sin(e.h*t); k?c.lineTo(x+5+k,yy):c.moveTo(x+5,yy); } c.stroke(); text(c,per===2?'fenêtre = 2T':'fenêtre = T',x+w-6,y+20,'#ffb3c0',9,'right'); } });
    text(c,'touches 2 … 9',740,486,col.dim,11); }
};
D.ma6={kind:'harmdef',rounds:6,lives:4,maxPerRound:200,successDelay:1400,
 intro:'Des harmoniques parasites attaquent ! Chacune est une sinusoïde de rang n : sur une période fondamentale T, elle fait exactement n oscillations. Compte-les et tape n (touches 2 à 9) pour la détruire. Plus tard : fenêtres de 2T (il faut diviser par 2) et spectres (lis la raie).',
 outro:'L’harmonique de rang n a une fréquence n/T : n oscillations par période du fondamental. Sur un spectre, elle apparaît comme une raie à la position n (le fondamental est n = 1).'};

/* =================================================================== */
/*  MA.7 — INCERTITUDE : durée ↔ largeur du spectre                     */
/* =================================================================== */
K.uncert={
  start(G){ G.un={a:1,t0:0,keys:{}}; },
  round(G,i){ const S0=G.un; const gates=[]; const n=6+i; for(let k=0;k<n;k++){ const kind=i<1?pick(['T','B']):i<3?pick(['T','B','TB']):pick(['TB','TB','sh','B']);
      let amin=0.2,amax=6,tc=0; if(kind==='T'||kind==='TB'||kind==='sh'){ amax=pick([0.6,0.8,1,1.5,2,3]); } if(kind==='B'||kind==='TB'||kind==='sh'){ amin=1/pick([0.6,0.8,1,1.5,2,3]); }
      if(amax/amin<1.35){ amin=amax/1.6; } if(kind==='sh') tc=pick([-2,-1.5,1.5,2]); const B=kind==='T'?null:1/amin, T=kind==='B'?null:amax;
      gates.push({y:-80-k*230,T,B,tc,amin,amax,kind}); }
    Object.assign(S0,{gates,passed:0}); G.prompt(`Vague ${i+1} : ↑ ↓ change la durée a de l’impulsion, ← → la retarde.`); clearTimeout(G._ph); G._ph=setTimeout(()=>G.state==='play'&&G.prompt(null),4000);
    G.panel([{label:'a ÷',on:()=>{S0.a=Math.max(.2,S0.a/1.25);}},{label:'a ×',on:()=>{S0.a=Math.min(6,S0.a*1.25);}},{label:'← retard',on:()=>{S0.t0=Math.max(-3,S0.t0-.5);}},{label:'retard →',on:()=>{S0.t0=Math.min(3,S0.t0+.5);}}]); },
  key(G,k,d){ G.un.keys[k]=d; },
  update(G,dt){ const S0=G.un; if(!S0||!S0.gates||G.busy) return; const ks=S0.keys; if(ks.ArrowUp) S0.a=Math.min(6,S0.a*Math.exp(1.1*dt)); if(ks.ArrowDown) S0.a=Math.max(.2,S0.a*Math.exp(-1.1*dt)); if(ks.ArrowRight) S0.t0=Math.min(3,S0.t0+2*dt); if(ks.ArrowLeft) S0.t0=Math.max(-3,S0.t0-2*dt);
    const sp=60+G.i*8; S0.gates.forEach(g=>{ g.y+=sp*dt; if(!g.done&&g.y>=360){ g.done=true; const okT=g.T==null||(S0.t0-S0.a/2>=g.tc-g.T/2-1e-6&&S0.t0+S0.a/2<=g.tc+g.T/2+1e-6), okB=g.B==null||1/S0.a<=g.B+1e-6;
      if(okT&&okB){ G.score+=25+Math.min(G.combo,5)*3; G.combo++; G.sfx('good'); G.burst(400,360,col.ok,16); G.hud(); }
      else { G.combo=0; G.lives--; G.sfx('bad'); G.shake(); G.toast(!okB?'Spectre trop large : impulsion trop courte':'Impulsion hors de la fenêtre de temps',col.bad); G.hud(); if(G.lives<=0) G.finish(false); } } });
    if(S0.gates.every(g=>g.done)&&G.state==='play') G.success(60,'Vague franchie !'); },
  draw(G,c){ const S0=G.un; if(!S0||!S0.gates) return; const P=[{x0:20,w:370,t:'temps t',sc:30},{x0:410,w:370,t:'fréquence λ',sc:30}];
    P.forEach((p,k)=>{ rrect(c,p.x0,40,p.w,400,14,'rgba(255,255,255,.03)','rgba(255,255,255,.1)'); text(c,p.t,p.x0+p.w/2,452,col.dim,12); const cx=p.x0+p.w/2; line(c,cx,50,cx,430,'rgba(255,255,255,.08)',1);
      for(let u=-5;u<=5;u++){ line(c,cx+u*p.sc,386,cx+u*p.sc,392,'rgba(255,255,255,.3)',1); } });
    S0.gates.forEach(g=>{ if(g.y<-20||g.y>430) return; const y=g.y;
      if(g.T!=null){ const cx=P[0].x0+P[0].w/2, l=cx+(g.tc-g.T/2)*30, r=cx+(g.tc+g.T/2)*30; c.fillStyle=g.done?'rgba(255,255,255,.08)':'#5b4bd6'; c.fillRect(P[0].x0,y-6,l-P[0].x0,12); c.fillRect(r,y-6,P[0].x0+P[0].w-r,12); text(c,`durée ≤ ${fr(g.T,1)}${g.tc?` centrée en ${fr(g.tc,1)}`:''}`,(l+r)/2,y-16,'#c9c2ff',11); }
      if(g.B!=null){ const cx=P[1].x0+P[1].w/2, l=cx-g.B*30, r=cx+g.B*30; c.fillStyle=g.done?'rgba(255,255,255,.08)':'#d9631e'; c.fillRect(P[1].x0,y-6,l-P[1].x0,12); c.fillRect(r,y-6,P[1].x0+P[1].w-r,12); text(c,`lobe ≤ ±${fr(g.B,2)}`,cx,y-16,'#ffc9a6',11); } });
    const cx0=P[0].x0+P[0].w/2, a=S0.a; rrect(c,cx0+(S0.t0-a/2)*30,340,a*30,40,4,'rgba(60,199,214,.8)'); line(c,P[0].x0,380,P[0].x0+P[0].w,380,'#3cc7d6',2);
    const cx1=P[1].x0+P[1].w/2; c.strokeStyle='#ffd45c'; c.lineWidth=2.5; c.beginPath(); for(let k=0;k<=300;k++){ const l=-6+12*k/300; const s=Math.abs(l)<1e-6?1:Math.abs(Math.sin(Math.PI*a*l)/(Math.PI*a*l)); const X=cx1+l*30; if(X<P[1].x0||X>P[1].x0+P[1].w) continue; const Y=380-s*40; c.lineTo(X,Y); } c.stroke();
    rrect(c,cx1-30/a,384,60/a,6,3,'rgba(255,212,92,.8)'); text(c,`a = ${fr(a)} · lobe ±1/a = ±${fr(1/a)} · retard ${fr(S0.t0,1)}`,400,26,'#fff',13); }
};
D.ma7={kind:'uncert',rounds:6,lives:4,maxPerRound:180,successDelay:1400,
 intro:'À gauche, ton impulsion dans le TEMPS (durée a). À droite, son SPECTRE : un sinus cardinal dont le lobe principal s’étend de −1/a à +1/a. Des portes descendent : il faut tenir dans la fenêtre de temps ET dans la fenêtre de fréquence. ↑ ↓ : durée, ← → : retard.',
 outro:'Une porte de largeur a a pour spectre sin(πaλ)/(πλ) : premier zéro en 1/a. Court en temps ⇔ large en fréquence. Un retard ne change pas |f̂| : on peut déplacer l’impulsion sans toucher à son spectre.'};
})();
