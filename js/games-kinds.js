/* ============ Atlas Arcade — les 9 mécaniques de jeu ============ */
(function(){
const K=window.GKINDS=window.GKINDS||{};
const C=window.GC;
const {text,arrow,circle,glow,line,rrect,col}=C;

/* =============== 1. VISUAL : scène dessinée + choix rapide =============== */
K.visual={
  round(G,i){ const R=G.r=G.def.gen(i); R.t0=G.t; G.prompt(R.q); const T=G.def.time||15;
    const order=R.keep?R.opts.map((t,j)=>({t,j})):C.shuffle(R.opts.map((t,j)=>({t,j})));
    const items=G.panel(order.map(o=>({label:o.t,on:()=>{ if(G.busy) return; const ok=o.j===R.a;
      items.forEach((it,k)=>{ if(order[k].j===R.a) it.el.classList.add('good'); }); if(!ok) items.find((it,k)=>order[k]===o).el.classList.add('bad');
      if(ok){ G.burst(400,250,col.ok); G.success(60+Math.round(40*Math.max(0,1-(G.t-R.t0)/T))); } else G.fail('Non…',R.e); }})));
  },
  update(G){ const R=G.r; if(R&&!G.busy&&G.t-R.t0>(G.def.time||15)){ G.fail('Temps écoulé !',R.e); } },
  draw(G,c){ const R=G.r; if(!R) return; const T=G.def.time||15; const f=G.busy?0:Math.max(0,1-(G.t-R.t0)/T);
    rrect(c,20,8,760,6,3,'rgba(255,255,255,.08)'); rrect(c,20,8,760*f,6,3,f>.3?col.b:col.bad);
    c.save(); R.draw(c,G.t-R.t0); c.restore(); }
};

/* =============== 2. FIELD : placer des charges pour guider une particule =============== */
const KQ=2.4e6;
K.field={
  round(G,i,retry){ const L=G.def.levels[i]; if(!retry){ G.fl={L,placed:[],sign:1,att:0}; } const F=G.fl; F.run=false; F.trail=[]; F.p={x:L.start[0],y:L.start[1],vx:L.v[0],vy:L.v[1]}; F.time=0;
    G.prompt(`${L.hint} <span style="opacity:.7">(${F.placed.length}/${L.max} charges)</span>`);
    const its=G.panel([{label:'⊕ charge +',cls:F.sign>0?'sel':'',on:b=>{F.sign=1;its[0].el.classList.add('sel');its[1].el.classList.remove('sel');}},
      {label:'⊖ charge −',cls:F.sign<0?'sel':'',on:b=>{F.sign=-1;its[1].el.classList.add('sel');its[0].el.classList.remove('sel');}},
      {label:'↶ Tout retirer',on:()=>{F.placed=[];K.field.round(G,G.i,true);}},
      {label:'🚀 Lancer',on:()=>{ if(F.run||G.busy) return; F.run=true; F.att++; F.trail=[]; }}]);
  },
  acc(G,x,y){ const F=G.fl; let ax=0,ay=0; [...F.L.fixed,...F.placed.map(p=>[p.x,p.y,p.q])].forEach(([qx,qy,q])=>{ const dx=x-qx,dy=y-qy; const r2=dx*dx+dy*dy+120; const r=Math.sqrt(r2); ax+=KQ*q*dx/(r2*r); ay+=KQ*q*dy/(r2*r); }); return [ax,ay]; },
  pointer(G,t,x,y){ const F=G.fl; if(t!=='down'||F.run||G.busy) return; if(y<40||y>440) return;
    const hit=F.placed.findIndex(p=>Math.hypot(p.x-x,p.y-y)<20); if(hit>=0){ F.placed.splice(hit,1); G.sfx('click'); K.field.round(G,G.i,true); return; }
    if(F.placed.length>=F.L.max){ G.toast(`Maximum ${F.L.max} charge${F.L.max>1?'s':''}`,col.gold); return; }
    F.placed.push({x,y,q:F.sign}); G.sfx('click'); K.field.round(G,G.i,true); },
  update(G,dt){ const F=G.fl; if(!F||!F.run||G.busy) return; const L=F.L;
    for(let k=0;k<6;k++){ const h=dt/6; const [ax,ay]=K.field.acc(G,F.p.x,F.p.y); F.p.vx+=ax*h; F.p.vy+=ay*h; F.p.x+=F.p.vx*h; F.p.y+=F.p.vy*h; F.time+=h;
      const p=F.p; let dead=null;
      if(p.x<0||p.x>800||p.y<0||p.y>500) dead='Sortie du terrain';
      if((L.walls||[]).some(([wx,wy,ww,wh])=>p.x>wx&&p.x<wx+ww&&p.y>wy&&p.y<wy+wh)) dead='Choc contre le mur';
      if([...L.fixed,...F.placed.map(q=>[q.x,q.y,q.q])].some(([qx,qy])=>Math.hypot(p.x-qx,p.y-qy)<14)) dead='Collision avec une charge';
      if(F.time>12) dead='Trop lent';
      if(Math.hypot(p.x-L.goal[0],p.y-L.goal[1])<L.goal[2]){ F.run=false; G.burst(p.x,p.y,col.gold,40); G.success(Math.max(40,100-15*(F.att-1)),F.att===1?'Du premier coup !':'Dans la cible !'); return; }
      if(dead){ F.run=false; G.burst(p.x,p.y,col.bad); G.fail(dead,null,{retry:true,life:false}); return; } }
    F.trail.push([F.p.x,F.p.y]); if(F.trail.length>600) F.trail.shift(); },
  draw(G,c){ const F=G.fl; if(!F) return; const L=F.L;
    // carte du champ
    for(let x=25;x<800;x+=50) for(let y=45;y<470;y+=50){ const [ax,ay]=K.field.acc(G,x,y); const m=Math.hypot(ax,ay); if(m<1) continue; const l=Math.min(18,6+Math.log10(1+m)*3);
      c.globalAlpha=Math.min(.55,.12+Math.log10(1+m)*.12); arrow(c,x-ax/m*l/2,y-ay/m*l/2,x+ax/m*l/2,y+ay/m*l/2,'#9fb4ff',1.4,5); c.globalAlpha=1; }
    (L.walls||[]).forEach(([x,y,w,h])=>rrect(c,x,y,w,h,6,'rgba(255,255,255,.12)','rgba(255,255,255,.3)'));
    glow(c,L.goal[0],L.goal[1],L.goal[2]*1.8,'rgba(255,212,92,.25)'); circle(c,L.goal[0],L.goal[1],L.goal[2],null,col.gold,3); text(c,'🎯',L.goal[0],L.goal[1],'#fff',20);
    L.fixed.forEach(([x,y,q])=>{ C.charge(c,x,y,13,q); circle(c,x,y,18,null,'rgba(255,255,255,.35)',1); });
    F.placed.forEach(p=>C.charge(c,p.x,p.y,13,p.q));
    if(F.trail.length>1){ c.strokeStyle=col.gold; c.lineWidth=2.5; c.beginPath(); F.trail.forEach((p,k)=>k?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1])); c.stroke(); }
    glow(c,F.p.x,F.p.y,22,'rgba(255,212,92,.5)'); circle(c,F.p.x,F.p.y,8,'#ffe28a');
    if(!F.run){ arrow(c,L.start[0],L.start[1],L.start[0]+L.v[0]*.35,L.start[1]+L.v[1]*.35,'rgba(255,226,138,.7)',2,8); }
    text(c,'charges fixes : anneau blanc · clique une de tes charges pour la retirer',400,488,col.dim,12,'center',500);
  }
};

/* =============== 3. TUNER : régler des paramètres pour atteindre une valeur =============== */
K.tuner={
  round(G,i){ const R=G.r=G.def.gen(i); R.t0=G.t; R.vals={}; G.prompt(R.q);
    const sl=R.params.map(p=>{ const s=G.slider(p.label,p.min,p.max,p.step,p.val,p.fmt,v=>{R.vals[p.key]=v;}); R.vals[p.key]=s.v; return s.lab; });
    G.panel([...sl,{label:'✓ Valider',on:()=>{ if(G.busy) return; const v=R.f(R.vals); const ok=Math.abs(v/R.target-1)<=R.tol;
      if(ok){ G.burst(400,230,col.ok); G.success(60+Math.round(40*Math.max(0,1-(G.t-R.t0)/40))); } else G.fail(v>R.target?'Trop grand':'Trop petit',R.e); }}]);
  },
  draw(G,c){ const R=G.r; if(!R) return; R.draw&&R.draw(c,R.vals); const v=R.f(R.vals);
    // jauge logarithmique centrée sur la cible
    const x0=120,x1=680,y=330; rrect(c,x0,y-12,x1-x0,24,12,'rgba(255,255,255,.08)');
    const pos=r=>x0+(C.clamp(Math.log10(r),-1,1)+1)/2*(x1-x0); const zl=pos(1-R.tol),zr=pos(1+R.tol);
    rrect(c,zl,y-12,zr-zl,24,6,'rgba(61,220,132,.35)'); line(c,pos(1),y-20,pos(1),y+20,col.ok,2);
    const px=pos(v/R.target); const ok=Math.abs(v/R.target-1)<=R.tol; glow(c,px,y,26,ok?'rgba(61,220,132,.5)':'rgba(255,212,92,.4)'); circle(c,px,y,10,ok?col.ok:col.gold);
    text(c,'÷10',x0,y+30,col.dim,12); text(c,'×10',x1,y+30,col.dim,12); text(c,'cible',pos(1),y+30,col.ok,12);
    text(c,`${R.name} = ${R.fmtv(v)}`,400,y+64,ok?col.ok:'#fff',22); text(c,`objectif : ${R.fmtv(R.target)} (± ${Math.round(R.tol*100)} %)`,400,y+92,col.dim,14,'center',600);
  }
};

/* =============== 4. BFIELD : courber une particule dans un champ B =============== */
K.bfield={
  round(G,i,retry){ const L=G.def.levels[i]; if(!retry) G.bf={L,att:0,dir:1,B:1}; const F=G.bf; F.run=false; F.th=0; F.trail=[];
    G.prompt(`Envoie le <b>${L.p.name}</b> (q = ${L.p.q>0?'+':'−'}${Math.abs(L.p.q)}e, m = ${L.p.m}, v = ${L.p.v}) dans le détecteur 🎯`);
    const its=G.panel([{label:'⊙ B sortant',cls:F.dir>0?'sel':'',on:()=>{F.dir=1;its[0].el.classList.add('sel');its[1].el.classList.remove('sel');}},
      {label:'⊗ B entrant',cls:F.dir<0?'sel':'',on:()=>{F.dir=-1;its[1].el.classList.add('sel');its[0].el.classList.remove('sel');}},
      G.slider('|B|',0.3,3,0.05,F.B,v=>v.toFixed(2)+' T',v=>{F.B=v;}).lab,
      {label:'🚀 Tirer',on:()=>{ if(F.run||G.busy) return; F.run=true; F.att++; F.th=0; F.trail=[]; }}]);
  },
  R(F){ return 120*F.L.p.m*F.L.p.v/(Math.abs(F.L.p.q)*F.B); },
  update(G,dt){ const F=G.bf; if(!F||!F.run||G.busy) return; const R=K.bfield.R(F); const s=Math.sign(F.L.p.q*F.dir); // s>0 : vers le bas
    F.th+=dt*170*F.L.p.v/R; const x=80+R*Math.sin(F.th), y=250+s*R*(1-Math.cos(F.th)); F.trail.push([x,y]); F.pos=[x,y];
    const [dx,dy]=F.L.det; if(Math.hypot(x-dx,y-dy)<22){ F.run=false; G.burst(x,y,col.gold,40); G.success(Math.max(40,100-15*(F.att-1)),F.att===1?'Dans le mille !':'Détecté !'); return; }
    if(x<0||x>800||y<30||y>470||F.th>2*Math.PI){ F.run=false; G.burst(x,y,col.bad); G.fail(F.th>2*Math.PI?'Un tour complet…':'Perdu dans le vide',null,{retry:true,life:false}); } },
  draw(G,c){ const F=G.bf; if(!F) return; const L=F.L;
    for(let x=40;x<800;x+=60) for(let y=60;y<460;y+=60){ c.globalAlpha=.35; F.dir>0?C.dotOut(c,x,y,6,'#9fb4ff'):C.crossIn(c,x,y,6,'#9fb4ff'); c.globalAlpha=1; }
    const [dx,dy]=L.det; glow(c,dx,dy,44,'rgba(255,212,92,.3)'); circle(c,dx,dy,20,null,col.gold,3); text(c,'🎯',dx,dy,'#fff',18);
    rrect(c,20,232,60,36,8,'rgba(255,255,255,.1)','rgba(255,255,255,.3)'); text(c,'source',50,250,col.dim,11);
    if(F.trail.length>1){ c.strokeStyle=L.p.q>0?col.p:col.n; c.lineWidth=3; c.beginPath(); F.trail.forEach((p,k)=>k?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1])); c.stroke(); }
    const p=F.run&&F.pos?F.pos:[80,250]; C.charge(c,p[0],p[1],9,L.p.q);
    if(!F.run){ arrow(c,92,250,150,250,'rgba(255,255,255,.6)',2,8); text(c,'v',140,236,col.dim,13); }
    const R=K.bfield.R(F); rrect(c,560,420,224,62,12,'rgba(10,12,30,.75)');
    text(c,`R = mv / (|q|B) → ${Math.round(R)} px`,672,440,'#fff',13); text(c,`F = q v × B : ${Math.sign(L.p.q*F.dir)>0?'vers le bas ↓':'vers le haut ↑'}`,672,464,col.dim,12,'center',600);
  }
};

/* =============== 5. TIMING : arrêter le chrono au bon moment =============== */
K.timing={
  round(G,i){ const R=G.r=G.def.gen(i); R.tt=0; R.stopped=false; G.prompt(R.q);
    G.panel([{label:'⏹ STOP (espace)',cls:'sel',on:()=>K.timing.stop(G)}]); },
  key(G,k,down){ if(down&&k===' ') K.timing.stop(G); },
  pointer(G,t){ if(t==='down') K.timing.stop(G); },
  stop(G){ const R=G.r; if(!R||R.stopped||G.busy||R.tt<0.02*R.tau) return; R.stopped=true; const err=Math.abs(R.tt-R.target)/R.tau;
    if(err<=.06){ G.burst(400,200,col.gold,40); G.success(100,'Parfait !'); } else if(err<=.18){ G.success(60,'Presque !'); }
    else G.fail(R.tt<R.target?'Trop tôt':'Trop tard',R.e+` <br>Tu as arrêté à ${R.fmt(R.tt)} au lieu de ${R.fmt(R.target)}.`); },
  update(G,dt){ const R=G.r; if(!R||R.stopped||G.busy) return; R.tt+=dt*R.tau/1.3; if(R.tt>5*R.tau){ R.stopped=true; G.fail('Trop tard',R.e); } },
  draw(G,c){ const R=G.r; if(!R) return; const x0=90,x1=760,y0=410,y1=110, X=t=>x0+t/(5*R.tau)*(x1-x0), Y=v=>y0-v*(y0-y1);
    C.plotBox(c,50,90,740,350); line(c,x0,y0,x1,y0,col.dim,1.5); line(c,x0,y0,x0,y1-10,col.dim,1.5);
    line(c,x0,Y(1),x1,Y(1),'rgba(255,255,255,.25)',1,[6,6]); text(c,R.top,x0-8,Y(1),col.dim,13,'right');
    for(let k=1;k<=5;k++){ line(c,X(k*R.tau),y0-4,X(k*R.tau),y0+4,col.dim,1); if(R.showTau) text(c,`${k}τ`,X(k*R.tau),y0+16,col.dim,11); }
    if(!R.showTau) for(let k=0;k<=5;k++){ const tt=k*R.tau; text(c,R.fmt(tt),X(tt),y0+16,col.dim,11); }
    c.strokeStyle=R.colr||col.b; c.lineWidth=3.5; c.beginPath(); for(let k=0;k<=200;k++){ const t=R.tt*k/200; const v=R.f(t); k?c.lineTo(X(t),Y(v)):c.moveTo(X(t),Y(v)); } c.stroke();
    glow(c,X(R.tt),Y(R.f(R.tt)),20,'rgba(60,199,214,.5)'); circle(c,X(R.tt),Y(R.f(R.tt)),6,'#fff');
    if(R.stopped){ line(c,X(R.target),y1-10,X(R.target),y0,col.ok,2,[5,4]); text(c,'cible',X(R.target),y1-18,col.ok,12); }
    text(c,`⏱ ${R.fmt(R.tt)}`,740,70,'#fff',22,'right',800); text(c,R.circuit,70,70,col.dim,14,'left',600);
  }
};

/* =============== 6. MATCHER : faire coïncider une courbe =============== */
K.matcher={
  round(G,i){ const R=G.r=G.def.gen(i); R.t0=G.t; R.vals={}; R.hold=0; G.prompt(R.q);
    const items=[]; R.controls.forEach(ct=>{
      if(ct.type==='choice'){ R.vals[ct.key]=ct.val; ct.opts.forEach(([k,lab])=>items.push({label:lab,cls:k===ct.val?'sel':'',key:ct.key,k,on:b=>{ R.vals[ct.key]=k; items.filter(x=>x.key===ct.key).forEach(x=>x.el.classList.toggle('sel',x.k===k)); }})); }
      else { const s=G.slider(ct.label,ct.min,ct.max,ct.step,ct.val,ct.fmt,v=>{R.vals[ct.key]=v;}); R.vals[ct.key]=s.v; items.push(s.lab); } });
    G.panel(items); },
  sim(R){ const f=R.f(R.vals); let e=0,n=0,mn=1e9,mx=-1e9; for(let k=0;k<=160;k++){ const x=R.xr[0]+(R.xr[1]-R.xr[0])*k/160; const a=R.target(x), b=f(x); if(!isFinite(a)) continue; mn=Math.min(mn,a); mx=Math.max(mx,a); e+=(C.clamp(b,R.yr[0]-5,R.yr[1]+5)-a)**2; n++; }
    return Math.max(0,1-Math.sqrt(e/n)/((mx-mn)||1)*2.2); },
  update(G,dt){ const R=G.r; if(!R||G.busy) return; R.s=K.matcher.sim(R); if(R.s>=(R.thr||.94)){ R.hold+=dt; if(R.hold>.5){ G.burst(400,220,col.ok,40); G.success(60+Math.round(40*Math.max(0,1-(G.t-R.t0)/50)),'Verrouillé !'); } } else R.hold=0;
    if(G.t-R.t0>60&&!G.busy) G.fail('Temps écoulé',R.e); },
  draw(G,c){ const R=G.r; if(!R) return; const bx=50,by=95,bw=700,bh=290; C.plotBox(c,bx,by,bw,bh);
    const X=x=>bx+20+(x-R.xr[0])/(R.xr[1]-R.xr[0])*(bw-40), Y=y=>by+bh-14-(C.clamp(y,R.yr[0],R.yr[1])-R.yr[0])/(R.yr[1]-R.yr[0])*(bh-28);
    if(R.yr[0]<0&&R.yr[1]>0) line(c,bx+10,Y(0),bx+bw-10,Y(0),'rgba(255,255,255,.2)',1);
    (R.grid||[]).forEach(g=>{ line(c,X(g.x),by+10,X(g.x),by+bh-10,'rgba(255,255,255,.08)',1); text(c,g.t,X(g.x),by+bh+12,col.dim,11); });
    const plot=(f,colr,w,dash)=>{ c.strokeStyle=colr; c.lineWidth=w; c.setLineDash(dash||[]); c.beginPath(); for(let k=0;k<=300;k++){ const x=R.xr[0]+(R.xr[1]-R.xr[0])*k/300; const y=f(x); k?c.lineTo(X(x),Y(y)):c.moveTo(X(x),Y(y)); } c.stroke(); c.setLineDash([]); };
    c.save(); c.shadowColor=col.gold; c.shadowBlur=12; plot(R.target,'rgba(255,212,92,.85)',5,[10,8]); c.restore();
    plot(R.f(R.vals),col.b,3);
    const s=R.s||0; rrect(c,250,410,300,14,7,'rgba(255,255,255,.1)'); rrect(c,250,410,300*s,14,7,s>=(R.thr||.94)?col.ok:col.gold);
    text(c,`Ressemblance ${Math.round(s*100)} %`,400,442,'#fff',15); text(c,'— cible   — toi',740,80,col.dim,12,'right',600);
    R.extra&&R.extra(c,R.vals);
  }
};

/* =============== 7. ROTOR : complexes, multiplier = tourner =============== */
const cm=(a,b)=>[a[0]*b[0]-a[1]*b[1],a[0]*b[1]+a[1]*b[0]];
const OPS={i:{l:'× i',f:z=>cm(z,[0,1]),m:[0,1]},m1:{l:'× (−1)',f:z=>[-z[0],-z[1]],m:[-1,0]},x2:{l:'× 2',f:z=>[2*z[0],2*z[1]],m:[2,0]},h:{l:'× ½',f:z=>[z[0]/2,z[1]/2],m:[.5,0]},
  p1i:{l:'× (1+i)',f:z=>cm(z,[1,1]),m:[1,1]},m1i:{l:'× (1−i)',f:z=>cm(z,[1,-1]),m:[1,-1]},mi:{l:'× (−i)',f:z=>cm(z,[0,-1]),m:[0,-1]},cj:{l:'conjugué z̄',f:z=>[z[0],-z[1]]},
  a1:{l:'+ 1',f:z=>[z[0]+1,z[1]],a:[1,0]},ai:{l:'+ i',f:z=>[z[0],z[1]+1],a:[0,1]},s1:{l:'− 1',f:z=>[z[0]-1,z[1]],a:[-1,0]}};
const key=z=>z[0].toFixed(3)+','+z[1].toFixed(3);
const ctex=z=>{ const f=v=>(Math.abs(v-Math.round(v))<1e-9?''+Math.round(v):(Math.abs(v*2-Math.round(v*2))<1e-9?(Math.round(v*2)+'/2'):v.toFixed(2))).replace('-','−'); if(Math.abs(z[1])<1e-9) return f(z[0]); const im=Math.abs(z[1]); const it=(Math.abs(im-1)<1e-9?'':f(im))+'i'; if(Math.abs(z[0])<1e-9) return (z[1]<0?'−':'')+it; return f(z[0])+(z[1]<0?' − ':' + ')+it; };
K.rotor={
  round(G,i,retry){ let L; if(retry&&G.ro) L=G.ro.L; else { L=K.rotor.make(G.def.levels[i]); } G.ro={L,z:L.z0.slice(),moves:0,anim:null};
    G.prompt(`Amène le vaisseau 🚀 sur la cible 🎯 en ${L.opt} coup${L.opt>1?'s':''} (max ${L.opt+2})`);
    G.panel([...L.ops.map(k=>({label:OPS[k].l,on:()=>K.rotor.apply(G,k)})),{label:'↺',on:()=>{ G.ro.z=L.z0.slice(); G.ro.moves=0; G.ro.anim=null; }}]); },
  make(cfg){ for(let tries=0;tries<400;tries++){ const z0=C.pick(cfg.starts); let z=z0.slice(); const d=C.ri(cfg.depth[0],cfg.depth[1]); for(let k=0;k<d;k++) z=OPS[C.pick(cfg.ops)].f(z);
      if(Math.abs(z[0])>4||Math.abs(z[1])>3||key(z)===key(z0)) continue;
      // BFS
      const seen=new Map([[key(z0),0]]); let fr=[z0], opt=null;
      for(let dep=1;dep<=6&&opt===null;dep++){ const nf=[]; for(const a of fr) for(const k of cfg.ops){ const b=OPS[k].f(a); const kb=key(b); if(seen.has(kb)||Math.abs(b[0])>8||Math.abs(b[1])>8) continue; seen.set(kb,dep); if(kb===key(z)){opt=dep;} nf.push(b); } fr=nf; }
      if(opt&&opt>=cfg.depth[0]) return {z0,t:z,opt,ops:cfg.ops}; }
    return {z0:[1,0],t:[0,1],opt:1,ops:['i','m1']}; },
  apply(G,k){ const R=G.ro; if(G.busy||R.anim) return; const from=R.z.slice(), to=OPS[k].f(from); R.anim={from,to,op:OPS[k],k,t:0}; R.moves++; },
  update(G,dt){ const R=G.ro; if(!R||!R.anim) return; R.anim.t+=dt/0.7; if(R.anim.t>=1){ R.z=R.anim.to; R.anim=null;
      if(key(R.z)===key(R.L.t)){ G.burst(...K.rotor.P(R.z),col.gold,50); G.success(Math.max(40,100-20*(R.moves-R.L.opt)),R.moves===R.L.opt?'Optimal !':'Arrivé !'); }
      else if(R.moves>=R.L.opt+2) G.fail('Plus de carburant',`Une solution en ${R.L.opt} coups existait. Rappel : × i = rotation de 90°, × (1+i) = rotation de 45° et ×√2, × ½ = rapprocher de l’origine.`,{retry:true}); } },
  P(z){ return [330+z[0]*55,250-z[1]*55]; },
  cur(R){ const A=R.anim; if(!A) return R.z; const s=A.t<.5?2*A.t*A.t:1-2*(1-A.t)**2;
    if(A.op.m){ const r0=Math.hypot(...A.from), a0=Math.atan2(A.from[1],A.from[0]), rm=Math.hypot(...A.op.m), am=Math.atan2(A.op.m[1],A.op.m[0]); const r=r0*Math.pow(rm,s), a=a0+am*s; return [r*Math.cos(a),r*Math.sin(a)]; }
    return [A.from[0]+(A.to[0]-A.from[0])*s,A.from[1]+(A.to[1]-A.from[1])*s]; },
  draw(G,c){ const R=G.ro; if(!R) return; const O=K.rotor.P([0,0]);
    for(let x=-5;x<=5;x++) line(c,O[0]+x*55,30,O[0]+x*55,470,x?'rgba(255,255,255,.06)':'rgba(255,255,255,.3)',1);
    for(let y=-4;y<=4;y++) line(c,40,O[1]-y*55,620,O[1]-y*55,y?'rgba(255,255,255,.06)':'rgba(255,255,255,.3)',1);
    circle(c,O[0],O[1],55,null,'rgba(255,255,255,.18)',1); text(c,'Re',612,O[1]-10,col.dim,12); text(c,'Im',O[0]+16,40,col.dim,12);
    const T=K.rotor.P(R.L.t); glow(c,T[0],T[1],40,'rgba(255,212,92,.35)'); circle(c,T[0],T[1],16,null,col.gold,3); text(c,'🎯',T[0],T[1],'#fff',15);
    const z=K.rotor.cur(R), P=K.rotor.P(z); arrow(c,O[0],O[1],P[0],P[1],'rgba(164,139,255,.6)',2,8);
    c.save(); c.translate(P[0],P[1]); c.rotate(-Math.atan2(z[1],z[0])); text(c,'🚀',0,0,'#fff',26); c.restore();
    rrect(c,640,60,150,200,14,'rgba(10,12,30,.7)');
    text(c,'toi',715,84,col.vio,13); text(c,ctex(R.z),715,108,'#fff',17); text(c,`|z|=${Math.hypot(...R.z).toFixed(2)}  arg=${Math.round(Math.atan2(R.z[1],R.z[0])*180/Math.PI)}°`,715,130,col.dim,11,'center',500);
    text(c,'cible',715,162,col.gold,13); text(c,ctex(R.L.t),715,186,'#fff',17); text(c,`|z|=${Math.hypot(...R.L.t).toFixed(2)}  arg=${Math.round(Math.atan2(R.L.t[1],R.L.t[0])*180/Math.PI)}°`,715,208,col.dim,11,'center',500);
    text(c,`coups : ${R.moves} / ${R.L.opt+2}`,715,240,'#fff',13);
  }
};

/* =============== 8. CATCH : attraper la bonne formule =============== */
K.catch={
  start(G){ G.ca={x:400,keys:{},order:C.shuffle(G.def.items)}; },
  round(G,i){ const A=G.ca; A.toks&&A.toks.forEach(t=>t.el.remove()); const it=A.it=A.order[i%A.order.length]; A.toks=[]; A.spawnT=0; A.queue=C.shuffle([{tex:it.good,ok:true},...it.bad.map(b=>({tex:b,ok:false}))]); A.qi=0;
    G.prompt(`${G.def.ask} &nbsp;$\\displaystyle ${it.q}$`); G.panel([]); },
  spawn(G){ const A=G.ca; const s=A.queue[A.qi++%A.queue.length]; const el=document.createElement('div'); el.className='token'; el.innerHTML=`$\\displaystyle ${s.tex}$`; G.root.append(el); window.EM_renderMath&&EM_renderMath(el);
    A.toks.push({el,ok:s.ok,x:C.rnd(90,710),y:60,v:C.rnd(60,85)+G.i*7}); },
  pointer(G,t,x){ if(t!=='up') G.ca.x=C.clamp(x,70,730); },
  key(G,k,d){ G.ca.keys[k]=d; },
  update(G,dt){ const A=G.ca; if(!A||!A.toks) return; if(A.keys.ArrowLeft) A.x-=420*dt; if(A.keys.ArrowRight) A.x+=420*dt; A.x=C.clamp(A.x,70,730);
    if(G.busy){ return; } A.spawnT-=dt; if(A.spawnT<=0){ K.catch.spawn(G); A.spawnT=Math.max(.75,1.35-G.i*.05); }
    for(let k=A.toks.length-1;k>=0;k--){ const T=A.toks[k]; T.y+=T.v*dt; const s=G.toS(T.x,T.y); T.el.style.left=s.x+'px'; T.el.style.top=s.y+'px';
      if(T.y>440&&T.y<470&&Math.abs(T.x-A.x)<80){ T.el.remove(); A.toks.splice(k,1);
        if(T.ok){ G.burst(A.x,450,col.ok,30); A.toks.forEach(t=>t.el.remove()); A.toks=[]; G.success(100); }
        else { G.burst(A.x,450,col.bad,30); A.toks.forEach(t=>t.el.remove()); A.toks=[]; G.fail('Mauvaise formule',`La bonne réponse : $${A.it.good}$. ${A.it.e||''}`); }
        return; }
      if(T.y>520){ T.el.remove(); A.toks.splice(k,1); } } },
  draw(G,c){ const A=G.ca; if(!A) return; const x=A.x; glow(c,x,462,90,'rgba(60,199,214,.25)'); rrect(c,x-80,452,160,22,11,'#3cc7d6'); text(c,'⟵  attrape  ⟶',x,463,'#062028',12,'center',800);
    if(G.state==='end'&&A.toks){ A.toks.forEach(t=>t.el.remove()); A.toks=[]; } }
};

/* =============== 9. GAUSS : échelonner une matrice =============== */
K.gauss={
  round(G,i){ const cfg=G.def.levels[i]; const pv=()=>C.pick(cfg.piv), sm=()=>C.ri(-2,2);
    const U=[[pv(),sm(),sm()],[0,pv(),sm()],[0,0,pv()]]; const nzk=()=>{let v;do{v=C.ri(-cfg.k,cfg.k);}while(!v);return v;};
    const a=nzk(),b=C.ri(0,1)?nzk():0,cc=nzk(); const u1=U[0],u2=U[1],u3=U[2];
    const A=[u1.slice(),u2.map((v,k)=>v+a*u1[k]),u3.map((v,k)=>v+cc*u2[k]+b*u1[k])]; const X=[C.ri(-3,3),C.ri(-3,3),C.ri(-3,3)];
    const T=A.map(r=>[...r,r.reduce((s,v,k)=>s+v*X[k],0)]);
    G.ga={T,X,sel:[],moves:0,opt:[a,b,cc].filter(Boolean).length,phase:'elim'}; G.prompt('Mets des <b>0 sous la diagonale</b>'); K.gauss.ui(G); },
  ui(G){ const S=G.ga; if(S.phase!=='elim') return; const [ti,si]=S.sel;
    if(S.sel.length<2){ G.panel([{label:S.sel.length?`L${ti+1} ← L${ti+1} + k·L? : choisis la ligne pivot`:'Clique une ligne',on:()=>{}},{label:'Désélectionner',on:()=>{S.sel=[];K.gauss.ui(G);}}]); return; }
    G.panel([...[-3,-2,-1,1,2,3].map(k=>({label:`k = ${k>0?'+':'−'}${Math.abs(k)}`,on:()=>K.gauss.op(G,ti,si,k)})),{label:`⇅ L${ti+1} ↔ L${si+1}`,on:()=>K.gauss.swap(G,ti,si)},{label:'✕',on:()=>{S.sel=[];K.gauss.ui(G);}}]); },
  op(G,ti,si,k){ const S=G.ga; S.T[ti]=S.T[ti].map((v,j)=>v+k*S.T[si][j]); S.moves++; S.sel=[]; S.flash={r:ti,t:.6}; K.gauss.check(G); },
  swap(G,ti,si){ const S=G.ga; [S.T[ti],S.T[si]]=[S.T[si],S.T[ti]]; S.moves++; S.sel=[]; K.gauss.check(G); },
  check(G){ const S=G.ga, T=S.T; if(T[1][0]===0&&T[2][0]===0&&T[2][1]===0&&T[2][2]!==0){ S.phase='ask'; G.sfx('good'); G.toast('Échelonnée !',col.ok);
      const z=S.X[2]; const opts=C.shuffle([z,z+C.pick([1,-1]),-z||z+2].filter((v,k,a)=>a.indexOf(v)===k)); while(opts.length<3) opts.push(z+opts.length+1);
      G.prompt(`Dernière ligne : $${T[2][2]}z=${T[2][3]}$. Combien vaut $z$ ?`);
      G.panel(opts.map(v=>({label:'z = '+v,on:()=>{ if(G.busy) return; if(v===z){ G.burst(400,250,col.gold,40); G.success(Math.max(40,100-15*Math.max(0,S.moves-S.opt)),S.moves<=S.opt?'Optimal !':'Résolu !'); } else G.fail('Non',`z = ${T[2][3]} / ${T[2][2]} = ${z}. Puis on remonte : y avec la ligne 2, x avec la ligne 1. Solution : (${S.X.join(', ')}).`); }}))); }
    else K.gauss.ui(G); },
  pointer(G,t,x,y){ const S=G.ga; if(t!=='down'||!S||S.phase!=='elim'||G.busy) return; const r=Math.floor((y-150)/80); if(r<0||r>2||x<150||x>650) return;
    if(S.sel[0]===r) S.sel=[]; else if(S.sel.length<2) S.sel.push(r); else S.sel=[r]; G.sfx('click'); K.gauss.ui(G); },
  update(G,dt){ const S=G.ga; if(S&&S.flash){ S.flash.t-=dt; if(S.flash.t<=0) S.flash=null; } },
  draw(G,c){ const S=G.ga; if(!S) return; const T=S.T;
    T.forEach((row,r)=>{ const y=150+r*80; const sel=S.sel.indexOf(r);
      rrect(c,150,y+6,500,68,16,sel===0?'rgba(164,139,255,.35)':sel===1?'rgba(60,199,214,.3)':S.flash&&S.flash.r===r?'rgba(61,220,132,.3)':'rgba(255,255,255,.05)', sel>=0?'#fff':null);
      text(c,`L${r+1}`,120,y+40,sel===0?col.vio:sel===1?col.b:col.dim,18);
      row.forEach((v,j)=>{ const x=j<3?220+j*110:590; const need=j<r&&j<3; const z=v===0;
        if(need){ glow(c,x,y+40,34,z?'rgba(61,220,132,.3)':'rgba(255,84,112,.3)'); }
        text(c,''+v,x,y+40,need?(z?col.ok:col.bad):'#fff',28,'center',800); });
      line(c,540,y+14,540,y+66,'rgba(255,255,255,.3)',2); });
    text(c,'x',220,140,col.dim,14); text(c,'y',330,140,col.dim,14); text(c,'z',440,140,col.dim,14); text(c,'2ᵈ membre',590,140,col.dim,12);
    text(c,`coups : ${S.moves} (optimal : ${S.opt})`,400,404,col.dim,14,'center',600);
    text(c,S.sel.length===1?`Ligne modifiée : L${S.sel[0]+1}. Clique maintenant la ligne pivot.`:S.phase==='elim'?'Clique la ligne à modifier, puis la ligne pivot, puis choisis k.':'',400,428,S.sel.length===1?col.vio:col.dim,14);
  }
};
})();
