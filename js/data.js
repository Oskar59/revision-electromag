/* ============ Banque de questions (quiz) et flashcards ============ */
(function(){
const r=String.raw;
const Q={}, C={};

/* ---------------- CHAPITRE 0 ---------------- */
Q.ch0=[
{q:r`Quelle est la dimension de $\omega_0 = 1/\sqrt{LC}$ ?`,o:[r`$\mathrm{T^{-1}}$ (inverse d'un temps)`,r`$\mathrm{T}$`,r`sans dimension`,r`$\mathrm{T^{2}}$`],a:0,e:r`$[L]=[U]\mathrm{T}/\mathrm{I}$ (loi de la bobine) et $[C]=\mathrm{I\,T}/[U]$ (car $Q=CU$, $Q=It$), donc $[LC]=\mathrm{T^2}$ et $[1/\sqrt{LC}]=\mathrm{T^{-1}}$ : c'est bien une pulsation.`},
{q:r`Si $\vec u \perp \vec v$, alors $\vec u\cdot\vec v$ vaut…`,o:[`0`,r`$\|\vec u\|\|\vec v\|$`,r`un vecteur perpendiculaire aux deux`,`1`],a:0,e:r`$\vec u\cdot\vec v=\|\vec u\|\|\vec v\|\cos\theta$ et $\cos 90°=0$. Le produit scalaire mesure la projection de l'un sur l'autre : elle est nulle.`},
{q:r`$(1,2,3)\wedge(4,5,6) = $ ?`,o:[r`$(-3,\,6,\,-3)$`,r`$(3,\,-6,\,3)$`,r`$32$`,r`$(4,\,10,\,18)$`],a:0,e:r`Astuce : on barre la 1ʳᵉ ligne, on recopie les deux premières en dessous, produits en croix. $x$ : $2\cdot6-3\cdot5=-3$ ; $y$ : $3\cdot4-1\cdot6=6$ ; $z$ : $1\cdot5-2\cdot4=-3$.`},
{q:`Pour un fil infini chargé, quel système de coordonnées choisir ?`,o:[`Cylindrique`,`Sphérique`,`Cartésien`,`N'importe lequel, c'est pareil`],a:0,e:`Le fil est invariant par rotation autour de son axe et par translation le long de l'axe : ce sont exactement les symétries des coordonnées cylindriques $(r,\\theta,z)$. Le bon système est celui qui possède les symétries du problème.`},
{q:`Élément de surface d'une sphère de rayon $r$ :`,o:[r`$r^2\sin\theta\,\mathrm d\theta\,\mathrm d\varphi$`,r`$r\,\mathrm dr\,\mathrm d\theta$`,r`$\mathrm dx\,\mathrm dy$`,r`$r\,\mathrm d\theta\,\mathrm dz$`],a:0,e:r`Sur la sphère ($r$ fixé), on se déplace de $r\,\mathrm d\theta$ et de $r\sin\theta\,\mathrm d\varphi$. Intégrée sur toute la sphère : $4\pi r^2$. ($r\,\mathrm d\theta\,\mathrm dz$ est la surface latérale d'un cylindre.)`},
{q:r`Développement au premier ordre : $f(x+\mathrm dx)\simeq$ ?`,o:[r`$f(x)+f'(x)\,\mathrm dx$`,r`$f(x)\,\mathrm dx$`,r`$f'(x)+f(x)\,\mathrm dx$`,r`$f(x)+f''(x)\,\mathrm dx^2$`],a:0,e:r`C'est la définition de la dérivée lue à l'envers : sur un petit intervalle, la courbe se confond avec sa tangente. On néglige les termes en $\mathrm dx^2$.`},
{q:`Le gradient d'un champ scalaire est…`,o:[`perpendiculaire aux surfaces de niveau, vers la montée`,`tangent aux surfaces de niveau`,`toujours nul`,`un nombre`],a:0,e:r`Le long d'une surface de niveau, $\mathrm df=\vec\nabla f\cdot\mathrm d\vec\ell=0$ pour tout déplacement : le gradient est donc ⟂ à la surface. Il pointe vers la croissance la plus forte.`},
{q:r`Le flux de $\vec A$ à travers une surface est nul si…`,o:[r`$\vec A$ est tangent à la surface`,r`$\vec A$ est perpendiculaire à la surface`,r`la surface est grande`,r`$\vec A$ est uniforme`],a:0,e:r`$\vec A\cdot\mathrm d\vec S = A\,\mathrm dS\cos\theta$ avec $\theta$ l'angle entre $\vec A$ et la normale. Tangent ⇒ $\theta=90°$ ⇒ rien ne traverse.`},
{q:r`Circulation de $\vec A=A(r)\,\vec e_\theta$ sur un cercle de rayon $r$ centré sur l'axe :`,o:[r`$2\pi r\,A(r)$`,r`$\pi r^2 A(r)$`,`0`,r`$4\pi r^2 A(r)$`],a:0,e:r`$\mathrm d\vec\ell = r\,\mathrm d\theta\,\vec e_\theta$, donc $\oint \vec A\cdot\mathrm d\vec\ell=\int_0^{2\pi}A(r)\,r\,\mathrm d\theta=2\pi rA(r)$. C'est LE calcul de toute application d'Ampère.`},
{q:r`$\dfrac{\partial}{\partial x}\left(x^2 y\right)=$ ?`,o:[r`$2xy$`,r`$x^2$`,r`$2x+y$`,r`$2xy+x^2$`],a:0,e:r`Dérivée partielle : on dérive par rapport à $x$ en gardant $y$ constant.`},
{q:`Lequel est un champ scalaire ?`,o:[`Le potentiel $V$`,`Le champ électrique $\\vec E$`,`Le champ magnétique $\\vec B$`,`La densité de courant $\\vec j$`],a:0,e:`Un champ scalaire associe un NOMBRE à chaque point (température, potentiel). $\\vec E$, $\\vec B$, $\\vec j$ associent un vecteur.`},
{q:`Le produit vectoriel de deux vecteurs colinéaires est…`,o:[`le vecteur nul`,`maximal`,`égal au produit scalaire`,`perpendiculaire et de norme 1`],a:0,e:r`$\|\vec u\wedge\vec v\|=\|\vec u\|\|\vec v\|\sin\theta$ et $\sin 0=0$ : l'aire du parallélogramme est nulle.`},
];
C.ch0=[
{f:`Comment vérifier une formule avant l'application numérique ?`,b:`Homogénéité : les deux membres doivent avoir la même dimension (M, L, T, I…). Toujours en unités SI.`},
{f:`Produit scalaire : définition et sens physique`,b:r`$\vec u\cdot\vec v=\|u\|\|v\|\cos\theta=u_xv_x+u_yv_y+u_zv_z$ — un NOMBRE, la projection. Sert au flux et à la circulation.`},
{f:`Produit vectoriel : norme, direction`,b:r`$\|\vec u\wedge\vec v\|=\|u\|\|v\|\sin\theta$ (aire du parallélogramme), ⟂ au plan $(\vec u,\vec v)$, sens main droite. Sert à Lorentz $q\vec v\wedge\vec B$.`},
{f:`Astuce de calcul du produit vectoriel`,b:`Barrer la 1ʳᵉ ligne, recopier les 2 premières lignes en dessous, faire les produits en croix dans l'ordre (y,z), (z,x), (x,y).`},
{f:`Volume élémentaire en cylindriques / sphériques`,b:r`Cyl. : $r\,\mathrm dr\,\mathrm d\theta\,\mathrm dz$. Sph. : $r^2\sin\theta\,\mathrm dr\,\mathrm d\theta\,\mathrm d\varphi$.`},
{f:`Déplacement élémentaire $\\mathrm d\\vec\\ell$ en cylindriques`,b:r`$\mathrm dr\,\vec e_r + r\,\mathrm d\theta\,\vec e_\theta + \mathrm dz\,\vec e_z$ (le $r$ devant $\mathrm d\theta$ = longueur d'arc).`},
{f:`Développement au 1er ordre`,b:r`$f(x+\mathrm dx)\simeq f(x)+f'(x)\mathrm dx$ ; à plusieurs variables : $f(x+\mathrm dx,y,z)-f(x,y,z)\simeq \frac{\partial f}{\partial x}\mathrm dx$.`},
{f:`Gradient : formule et propriété géométrique`,b:r`$\vec\nabla f=(\partial_x f,\partial_y f,\partial_z f)$ ; $\mathrm df=\vec\nabla f\cdot\mathrm d\vec\ell$ ; ⟂ aux surfaces de niveau, vers la montée.`},
{f:`Flux vs circulation`,b:r`Flux $\iint\vec A\cdot\mathrm d\vec S$ = ce qui TRAVERSE une surface. Circulation $\int\vec A\cdot\mathrm d\vec\ell$ = ce qui TOURNE / suit un chemin.`},
{f:`Quel système de coordonnées choisir ?`,b:`Celui qui a les symétries du problème : plan → cartésien ; axe (fil, coax, solénoïde) → cylindrique ; point (charge, sphère) → sphérique.`},
{f:`Primitives à connaître`,b:r`$\int \frac{\mathrm dr}{r^2}=-\frac1r$ (→ potentiel en $1/r$) ; $\int\frac{\mathrm dr}{r}=\ln r$ (→ coax, fil, couronne).`},
];

/* ---------------- CHAPITRE 1 ---------------- */
Q.ch1=[
{q:`Force entre $q_1=+2$ nC et $q_2=-3$ nC distantes de 5 cm ?`,o:[`21,6 µN, attractive`,`21,6 µN, répulsive`,`2,16 µN, attractive`,`10,8 mN, attractive`],a:0,e:r`$F=9\times10^9\times\frac{6\times10^{-18}}{(5\times10^{-2})^2}=2{,}16\times10^{-5}$ N = 21,6 µN. Signes opposés ⇒ attraction.`},
{q:`Unité de la densité linéique $\\lambda$ :`,o:[r`$\mathrm{C\,m^{-1}}$`,r`$\mathrm{C\,m^{-2}}$`,r`$\mathrm{C\,m^{-3}}$`,r`$\mathrm{C}$`],a:0,e:`Linéique = par unité de LONGUEUR. Multiplier par une longueur redonne des coulombs : $Q=\\lambda L$. L'unité identifie la densité sans ambiguïté.`},
{q:`Le champ d'une charge ponctuelle décroît comme…`,o:[r`$1/r^2$`,r`$1/r$`,r`$1/r^3$`,`il ne décroît pas`],a:0,e:r`$E=\frac{q}{4\pi\varepsilon_0 r^2}$ : le flux (constant) se répartit sur une sphère d'aire $4\pi r^2$.`},
{q:`Potentiel d'une charge ponctuelle (réf. $V(\\infty)=0$) :`,o:[r`$\dfrac{q}{4\pi\varepsilon_0 r}$`,r`$\dfrac{q}{4\pi\varepsilon_0 r^2}$`,r`$\dfrac{q}{2\pi\varepsilon_0 r}$`,r`$-\dfrac{q}{4\pi\varepsilon_0 r^2}$`],a:0,e:r`On intègre $\mathrm dV=-E\,\mathrm dr$ de $\infty$ à $r$ : primitive de $1/r^2$ = $-1/r$. V est en $1/r$, pas en $1/r^2$.`},
{q:`Le champ $\\vec E$ est dirigé vers…`,o:[`les potentiels décroissants`,`les potentiels croissants`,`les charges positives`,`perpendiculairement aux lignes de champ`],a:0,e:r`$\vec E=-\vec\nabla V$ : le gradient monte, le signe moins fait descendre. Une charge + « dévale » le potentiel comme une bille une pente.`},
{q:`Dans le théorème de Gauss, $Q_{int}$ désigne…`,o:[`uniquement les charges À L'INTÉRIEUR de la surface fermée`,`toutes les charges de l'espace`,`les charges sur la surface`,`les charges qui créent le champ au point M`],a:0,e:`Le flux sortant ne dépend que des charges enfermées. Les charges extérieures modifient $\\vec E$ en chaque point mais leur flux total à travers la surface est nul (ce qui entre ressort).`},
{q:`Champ d'un fil infini de densité $\\lambda$ :`,o:[r`$\dfrac{\lambda}{2\pi\varepsilon_0 r}$`,r`$\dfrac{\lambda}{4\pi\varepsilon_0 r^2}$`,r`$\dfrac{\lambda}{2\varepsilon_0}$`,r`$\dfrac{\lambda}{\varepsilon_0}$`],a:0,e:r`Cylindre de Gauss : $E\cdot2\pi rh=\lambda h/\varepsilon_0$. Seule la surface latérale compte, $h$ se simplifie.`},
{q:`Champ d'un plan infini de densité $\\sigma$ :`,o:[r`$\sigma/2\varepsilon_0$, indépendant de la distance`,r`$\sigma/\varepsilon_0$`,r`$\sigma/(2\varepsilon_0 z)$`,r`$\sigma/(4\pi\varepsilon_0 z^2)$`],a:0,e:r`Boîte de Gauss traversant le plan : deux faces d'aire $S$ ⇒ $2ES=\sigma S/\varepsilon_0$. L'aire utile ne grandit pas avec la distance ⇒ E constant.`},
{q:`En un point d'un plan de SYMÉTRIE de la distribution de charges, $\\vec E$ est…`,o:[`contenu dans le plan`,`perpendiculaire au plan`,`nul`,`quelconque`],a:0,e:`Vrai vecteur : sa composante ⟂ au plan changerait de signe par réflexion alors que les causes sont identiques ⇒ elle est nulle. (Plan d'ANTIsymétrie ⇒ ⟂ au plan. Et c'est l'inverse pour B !)`},
{q:`Dans une région vide de charges, $\\mathrm{div}\\,\\vec E$ vaut…`,o:[`0`,`$\\rho/\\varepsilon_0$ avec $\\rho$ des charges voisines`,`$\\infty$`,`$\\varepsilon_0$`],a:0,e:`Maxwell-Gauss est LOCAL : $\\mathrm{div}\\vec E=\\rho/\\varepsilon_0$ au point considéré. Pas de charge ici ⇒ les lignes traversent sans naître ni mourir.`},
{q:`$\\overrightarrow{\\mathrm{rot}}\\,\\vec E=\\vec 0$ en statique signifie…`,o:[`la circulation de E sur tout contour fermé est nulle`,`E est nul`,`E est uniforme`,`le flux de E est nul`],a:0,e:`$\\vec E=-\\vec\\nabla V$ ⇒ faire un tour fermé ramène au même potentiel ⇒ $\\oint\\vec E\\cdot d\\vec\\ell=0$ ⇒ (Stokes) rot E = 0. Faux dès que B varie (Ch. 4) !`},
{q:`Un électron initialement au repos traverse une ddp de 1 V : il gagne…`,o:[r`$1\ \mathrm{eV}=1{,}6\times10^{-19}$ J d'énergie cinétique`,`1 J`,r`$1{,}6\times10^{-19}$ V`,`rien, il perd de l'énergie`],a:0,e:`Il va vers les potentiels croissants, son énergie potentielle $E_p=-eV$ diminue d'autant, son énergie cinétique augmente : c'est la définition de l'électron-volt.`},
{q:`Le champ au CENTRE d'un anneau uniformément chargé vaut…`,o:[`0`,r`$Q/(4\pi\varepsilon_0R^2)$`,`infini`,r`$Q/(2\varepsilon_0)$`],a:0,e:r`$E(z)=\frac{Qz}{4\pi\varepsilon_0(R^2+z^2)^{3/2}}$ s'annule en $z=0$ : chaque élément est compensé par l'élément diamétralement opposé.`},
{q:`Densité volumique d'énergie électrique :`,o:[r`$\tfrac12\varepsilon_0E^2$`,r`$\varepsilon_0 E$`,r`$\tfrac12 qV$`,r`$E^2/2\mu_0$`],a:0,e:`$u_E=\\frac12\\varepsilon_0E^2$ en J·m⁻³ : l'énergie est stockée dans le CHAMP, donc dans l'espace.`},
{q:`$\\vec E=\\vec 0$ en un point implique-t-il $V=0$ ?`,o:[`Non : V peut être constant non nul`,`Oui, toujours`,`Oui si la charge est positive`,`Seulement à l'infini`],a:0,e:`E est la PENTE de V. Un plateau de V (V constant, par ex. 5 V) donne E = 0. Exemple : intérieur d'un conducteur.`},
];
C.ch1=[
{f:`3 propriétés de la charge électrique`,b:`Deux signes (attraction/répulsion) ; quantifiée ($q=\\pm Ne$, $e=1{,}602\\times10^{-19}$ C) ; conservée (système isolé).`},
{f:`Loi de Coulomb`,b:r`$\vec F_{1\to2}=\frac{1}{4\pi\varepsilon_0}\frac{q_1q_2}{r^2}\vec u_{1\to2}$, $\frac{1}{4\pi\varepsilon_0}\approx9\times10^9$ SI.`},
{f:`Champ d'une charge ponctuelle et force sur q'`,b:r`$\vec E=\frac{q}{4\pi\varepsilon_0r^2}\vec e_r$ (V/m) ; $\vec F=q'\vec E$.`},
{f:`Choisir λ, σ ou ρ ?`,b:`Quelles dimensions sont négligeables devant la distance d'observation ? 2 → ligne (λ), 1 → surface (σ), 0 → volume (ρ).`},
{f:`Principe de Curie + règles pratiques pour $\\vec E$`,b:`Les symétries des causes se retrouvent dans les effets. Plan de symétrie : E contenu dedans. Antisymétrie : E ⟂. Translation/rotation : E ne dépend pas de la coordonnée.`},
{f:`Champ sur l'axe d'un anneau`,b:r`$E(z)=\frac{1}{4\pi\varepsilon_0}\frac{Qz}{(R^2+z^2)^{3/2}}$ ; 0 au centre, $\approx Q/4\pi\varepsilon_0z^2$ loin.`},
{f:`Relation champ ↔ potentiel`,b:r`$\vec E=-\vec\nabla V$ ⟺ $\mathrm dV=-\vec E\cdot\mathrm d\vec\ell$ ⟺ $\int_A^B\vec E\cdot\mathrm d\vec\ell=V_A-V_B$.`},
{f:`Travail de la force électrique, tension`,b:r`$W_{A\to B}=q(V_A-V_B)=qU_{AB}$ ; $E_p=qV$ ; une tension = énergie par unité de charge.`},
{f:`Théorème de Gauss (intégral et local)`,b:r`$\oiint\vec E\cdot\mathrm d\vec S=Q_{int}/\varepsilon_0$ ; $\mathrm{div}\vec E=\rho/\varepsilon_0$.`},
{f:`Les 5 étapes de Gauss`,b:`1. Symétries/invariances 2. Surface fermée passant par M épousant les symétries 3. Flux = E × S_utile 4. Q_int 5. Égaler, isoler E.`},
{f:`E : point / fil / plan`,b:r`$\frac{q}{4\pi\varepsilon_0r^2}$ ; $\frac{\lambda}{2\pi\varepsilon_0 r}$ ; $\frac{\sigma}{2\varepsilon_0}$.`},
{f:`Divergence : formule & sens`,b:r`$\mathrm{div}\vec A=\partial_xA_x+\partial_yA_y+\partial_zA_z$ = flux sortant par unité de volume. >0 source, <0 puits.`},
{f:`Rotationnel : composante z & sens`,b:r`$(\mathrm{rot}\vec A)_z=\partial_xA_y-\partial_yA_x$ = circulation par unité de surface. Roue à aubes qui tourne sur elle-même.`},
{f:`Ostrogradski / Stokes`,b:r`$\oiint_S\vec A\cdot\mathrm d\vec S=\iiint_V\mathrm{div}\vec A\,\mathrm dV$ ; $\oint_\Gamma\vec A\cdot\mathrm d\vec\ell=\iint_S\overrightarrow{\mathrm{rot}}\vec A\cdot\mathrm d\vec S$.`},
{f:`Maxwell-Gauss et Maxwell-Faraday (statique)`,b:r`$\mathrm{div}\vec E=\rho/\varepsilon_0$ ; $\overrightarrow{\mathrm{rot}}\vec E=\vec 0$ (statique seulement !).`},
{f:`Densité d'énergie électrique`,b:r`$u_E=\frac12\varepsilon_0E^2$ (J/m³), stockée dans le champ.`},
];

/* ---------------- CHAPITRE 2 ---------------- */
Q.ch2=[
{q:`Dans un conducteur à l'équilibre électrostatique, $\\vec E_{int}$ =`,o:[`$\\vec 0$`,`$\\sigma/\\varepsilon_0$`,`maximal`,`dépend de la forme`],a:0,e:`Sinon les charges libres bougeraient (courant sans générateur : absurde). Équilibre ⇔ E_int = 0.`},
{q:`Où se trouvent les charges d'un conducteur à l'équilibre ?`,o:[`En surface`,`Uniformément en volume`,`Au centre`,`Nulle part`],a:0,e:`div E = ρ/ε₀ avec E = 0 ⇒ ρ = 0 dans le volume. Les charges se repoussent jusqu'à la surface.`},
{q:`Champ juste à l'extérieur d'un conducteur de densité $\\sigma$ :`,o:[r`$\dfrac{\sigma}{\varepsilon_0}\vec n$`,r`$\dfrac{\sigma}{2\varepsilon_0}\vec n$`,r`tangent à la surface`,`0`],a:0,e:`Théorème de Coulomb : petit cylindre « pincé » à cheval sur la surface. Face intérieure : E = 0. Une seule face contribue ⇒ $E\\,dS=\\sigma dS/\\varepsilon_0$. (Le plan isolé donne σ/2ε₀ car le flux sort des DEUX côtés.)`},
{q:`Capacité d'un condensateur plan :`,o:[r`$C=\varepsilon_0S/e$`,r`$C=\varepsilon_0e/S$`,r`$C=S/(\varepsilon_0e)$`,r`$C=\varepsilon_0 S e$`],a:0,e:`$E=\\sigma/\\varepsilon_0=Q/\\varepsilon_0S$, $U=Ee$ ⇒ $C=Q/U=\\varepsilon_0S/e$.`},
{q:`On double l'écartement $e$ d'un condensateur plan (S fixe) :`,o:[`C est divisée par 2`,`C double`,`C ne change pas`,`C est multipliée par 4`],a:0,e:`$C\\propto 1/e$. Charges + et − plus éloignées : il faut une tension plus grande pour la même charge.`},
{q:`Capacité par unité de longueur d'un câble coaxial (rayons a < b) :`,o:[r`$\dfrac{2\pi\varepsilon_0}{\ln(b/a)}$`,r`$\dfrac{\varepsilon_0}{b-a}$`,r`$2\pi\varepsilon_0\ln(b/a)$`,r`$\dfrac{4\pi\varepsilon_0 ab}{b-a}$`],a:0,e:r`$E=\lambda/2\pi\varepsilon_0r$ puis $U=\int_a^bE\,\mathrm dr=\frac{\lambda}{2\pi\varepsilon_0}\ln\frac ba$ ⇒ $C/\ell=\lambda/U$.`},
{q:`Unité de la densité de courant $\\vec j$ :`,o:[r`$\mathrm{A\,m^{-2}}$`,r`$\mathrm{A}$`,r`$\mathrm{A\,m^{-1}}$`,r`$\mathrm{C\,m^{-3}}$`],a:0,e:`$i=\\iint\\vec j\\cdot d\\vec S$ ⇒ j est un courant par unité de surface.`},
{q:`Ordre de grandeur de la vitesse de dérive des électrons dans un fil de cuivre (1 A, 1 mm²) :`,o:[`0,07 mm/s`,`300 000 km/s`,`1 m/s`,`1000 km/s`],a:0,e:r`$v_d=i/(neS)=1/(8{,}5\times10^{28}\times1{,}6\times10^{-19}\times10^{-6})\approx7\times10^{-5}$ m/s ≈ 7 cm/heure !`},
{q:`Pourquoi la lampe s'allume-t-elle instantanément malgré une dérive si lente ?`,o:[`Le CHAMP s'établit dans tout le circuit à ~c et met tous les électrons en mouvement en même temps`,`Les électrons vont en fait très vite`,`La lampe contient déjà de l'énergie`,`Le courant se propage à la vitesse de dérive`],a:0,e:`Ce n'est pas l'électron de l'interrupteur qui doit atteindre la lampe : c'est le champ (≈ 0,7c dans un câble) qui se propage.`},
{q:`Dans le modèle de Drude, la conductivité vaut…`,o:[r`$\sigma=ne^2\tau/m$`,r`$\sigma=m/(ne^2\tau)$`,r`$\sigma=ne\tau/m$`,r`$\sigma=ne^2/(m\tau)$`],a:0,e:r`Régime permanent de $m\frac{d\vec v}{dt}=-e\vec E-\frac{m\vec v}{\tau}$ : $\vec v_d=-\frac{e\tau}{m}\vec E$, puis $\vec j=n(-e)\vec v_d=\frac{ne^2\tau}{m}\vec E$.`},
{q:`Résistance d'un fil : on double sa longueur ET sa section.`,o:[`R inchangée`,`R double`,`R divisée par 2`,`R × 4`],a:0,e:`$R=\\rho_rL/S$ : ×2 / ×2 = inchangée.`},
{q:`En régime permanent, la conservation de la charge s'écrit…`,o:[r`$\oiint\vec j\cdot\mathrm d\vec S=0$ (loi des nœuds)`,r`$\mathrm{div}\,\vec E=0$`,r`$i=0$`,r`$\vec j=\vec 0$`],a:0,e:`$\\oiint\\vec j\\cdot d\\vec S=-dQ_{int}/dt$ et en permanent $dQ_{int}/dt=0$ : tout ce qui entre ressort.`},
{q:`Énergie stockée dans un condensateur :`,o:[r`$\tfrac12CU^2$`,r`$CU^2$`,r`$\tfrac12 CU$`,r`$Q^2C/2$`],a:0,e:`$W=\\frac12CU^2=\\frac{Q^2}{2C}$ ; on la retrouve en intégrant $\\frac12\\varepsilon_0E^2$ sur le volume S·e.`},
{q:`On remplit un condensateur d'un isolant de permittivité relative $\\varepsilon_r$ :`,o:[`C est multipliée par $\\varepsilon_r$`,`C est divisée par $\\varepsilon_r$`,`C ne change pas`,`C devient nulle`],a:0,e:`On remplace $\\varepsilon_0$ par $\\varepsilon_0\\varepsilon_r$ : l'isolant se polarise et affaiblit le champ ⇒ plus de charge stockée à tension égale.`},
];
C.ch2=[
{f:`Conducteur à l'équilibre : 3 conséquences de $\\vec E_{int}=\\vec 0$`,b:`1. ρ = 0 en volume (charges en surface). 2. Volume équipotentiel. 3. E normal à la surface juste à l'extérieur.`},
{f:`Théorème de Coulomb`,b:r`Juste à l'extérieur : $\vec E=\frac{\sigma}{\varepsilon_0}\vec n$ (normale sortante). Local, sans symétrie requise.`},
{f:`Cage de Faraday`,b:`Conducteur creux sans charge dans la cavité : E = 0 dans toute la cavité (une ligne de champ irait de V₀ à V₀ en faisant décroître V : impossible).`},
{f:`Pouvoir des pointes`,b:`σ est plus grand là où la courbure est forte ⇒ champ intense aux pointes (paratonnerre).`},
{f:`Méthode : calculer une capacité`,b:`1. Charge Q sur l'armature interne, E par Gauss. 2. $U=\\int_1^2\\vec E\\cdot d\\vec\\ell$. 3. C = Q/U (Q doit se simplifier !).`},
{f:`Capacités à connaître`,b:r`Plan : $\varepsilon_0S/e$. Coax : $\frac{2\pi\varepsilon_0\ell}{\ln(b/a)}$. Sphères : $\frac{4\pi\varepsilon_0R_1R_2}{R_2-R_1}$.`},
{f:`Intensité & densité de courant`,b:r`$i=\frac{\mathrm dq}{\mathrm dt}$ ; $\vec j=nq\vec v_d$ ; $i=\iint\vec j\cdot\mathrm d\vec S$.`},
{f:`Conservation de la charge (locale)`,b:r`$\mathrm{div}\vec j+\frac{\partial\rho}{\partial t}=0$ ; permanent : loi des nœuds.`},
{f:`Loi d'Ohm locale et modèle de Drude`,b:r`$\vec j=\sigma\vec E$, $\sigma=\frac{ne^2\tau}{m}$ ; loi de vitesse limite (frottement $-m\vec v/\tau$).`},
{f:`De la loi locale à U = Ri`,b:r`Fil : $E=U/L$, $j=\sigma E$, $i=jS$ ⇒ $R=\frac{L}{\sigma S}=\frac{\rho_rL}{S}$.`},
{f:`Puissances`,b:`Reçue $P=Ui$ ; dissipée par effet Joule $Ri^2$.`},
{f:`Condensateur : relations de circuit`,b:r`$Q=CU$ ; $i=C\frac{\mathrm du}{\mathrm dt}$ ; $W=\frac12CU^2$.`},
];

/* ---------------- CHAPITRE 3 ---------------- */
Q.ch3=[
{q:`Force de Lorentz :`,o:[r`$\vec F=q(\vec E+\vec v\wedge\vec B)$`,r`$\vec F=q(\vec E+\vec B\wedge\vec v)$`,r`$\vec F=q\vec v\cdot\vec B$`,r`$\vec F=i\,\mathrm d\vec\ell\wedge\vec B$`],a:0,e:`L'ordre compte : $\\vec v\\wedge\\vec B$ (et non l'inverse, qui donne le sens opposé). La dernière proposition est Laplace (sur un fil).`},
{q:`Le travail de la force magnétique sur une charge est…`,o:[`toujours nul`,`toujours positif`,`égal à qvB`,`négatif (elle freine)`],a:0,e:r`$\vec F\perp\vec v$ par construction ⇒ $\vec F\cdot\vec v=0$. B courbe la trajectoire sans changer la vitesse.`},
{q:`Rayon de la trajectoire d'une charge lancée ⟂ à B uniforme :`,o:[r`$R=\dfrac{mv}{|q|B}$`,r`$R=\dfrac{|q|B}{mv}$`,r`$R=\dfrac{mv^2}{qB}$`,r`$R=\dfrac{qvB}{m}$`],a:0,e:`PFD avec accélération centripète $v^2/R$ : $|q|vB=mv^2/R$.`},
{q:`Champ magnétique d'un fil rectiligne infini :`,o:[r`$\dfrac{\mu_0 i}{2\pi r}$, orthoradial`,r`$\dfrac{\mu_0 i}{2\pi r}$, radial`,r`$\mu_0 n i$`,r`$\dfrac{\mu_0 i}{4\pi r^2}$`],a:0,e:`Ampère sur un cercle (ligne de champ) : $B\\cdot2\\pi r=\\mu_0 i$. B tourne autour du fil (règle de la main droite).`},
{q:`Champ dans un solénoïde infini ($n$ spires/m) :`,o:[`$\\mu_0 n i$, uniforme et axial`,`$\\mu_0 n i/(2\\pi r)$`,`nul`,`$\\mu_0 N i$`],a:0,e:`Rectangle à cheval sur la paroi : seul le côté intérieur contribue, $BL=\\mu_0 nLi$. Ne dépend ni de la position ni du rayon.`},
{q:`$\\mathrm{div}\\,\\vec B=0$ signifie…`,o:[`pas de monopôle magnétique : les lignes de B se referment`,`B est nul`,`B est uniforme`,`pas de courant`],a:0,e:`Le flux de B à travers toute surface fermée est nul. Couper un aimant donne deux aimants complets.`},
{q:`En un point d'un plan de SYMÉTRIE des courants, $\\vec B$ est…`,o:[`perpendiculaire au plan`,`contenu dans le plan`,`nul`,`radial`],a:0,e:`B est un PSEUDO-vecteur : règles inversées par rapport à E. Pour le fil, tout plan contenant le fil est plan de symétrie ⇒ B ⟂ ⇒ orthoradial.`},
{q:`Câble coaxial (i aller dans l'âme, i retour dans le blindage) : B à l'extérieur =`,o:[`0`,r`$\mu_0 i/2\pi r$`,r`$2\mu_0 i/2\pi r$`,`infini`],a:0,e:`Le contour extérieur enlace $i+(-i)=0$. Le champ est confiné entre âme et blindage : pas de rayonnement, pas de perturbation.`},
{q:`Inductance d'un solénoïde : on double le nombre de spires (même longueur).`,o:[`L est multipliée par 4`,`L double`,`L inchangée`,`L divisée par 2`],a:0,e:`$L=\\mu_0N^2S/\\ell$ : chaque spire CRÉE du champ (×N) et chaque spire en REÇOIT (×N).`},
{q:`Force de Laplace sur un élément de fil :`,o:[r`$\mathrm d\vec F=i\,\mathrm d\vec\ell\wedge\vec B$`,r`$\mathrm d\vec F=i\,\vec B\wedge\mathrm d\vec\ell$`,r`$\mathrm d\vec F=q\vec E$`,r`$\mathrm d\vec F=i\,\mathrm d\ell\, B$ dirigée selon $\vec B$`],a:0,e:`C'est la somme des forces de Lorentz $q\\vec v_d\\wedge\\vec B$ sur tous les porteurs du morceau de fil. Elle est ⟂ au fil et à B.`},
{q:`Moment magnétique d'une boucle plane de surface S parcourue par i :`,o:[r`$\vec m=iS\vec n$ (A·m²)`,r`$\vec m=i/S$`,r`$\vec m=\mu_0 iS$`,r`$\vec m=qv$`],a:0,e:`La normale $\\vec n$ est orientée par la main droite à partir du sens du courant. m joue pour B le rôle de q pour E.`},
{q:`Pourquoi la plupart des corps ne sont-ils pas aimantés ?`,o:[`Les électrons s'apparient par spins opposés (Pauli) : moments compensés`,`Ils n'ont pas d'électrons`,`Leurs électrons sont immobiles`,`Le champ terrestre les désaimante`],a:0,e:`Seuls les atomes à couches incomplètes (Fe, Co, Ni, terres rares) gardent un moment net notable.`},
{q:`Pour un câble coaxial dans le vide, $(L/\\ell)(C/\\ell)$ vaut…`,o:[r`$\varepsilon_0\mu_0=1/c^2$`,`1`,r`$\ln(b/a)$`,r`$c^2$`],a:0,e:r`$\frac{\mu_0}{2\pi}\ln\frac ba\times\frac{2\pi\varepsilon_0}{\ln(b/a)}=\varepsilon_0\mu_0$ : les ln se simplifient ! C'est l'annonce de $v=1/\sqrt{\mathcal{LC}}=c$.`},
];
C.ch3=[
{f:`Expérience d'Ørsted (1820) : 2 conséquences`,b:`Un courant agit comme un aimant (il crée un champ B) ; électricité et magnétisme sont un même phénomène.`},
{f:`Force de Lorentz et propriété clé`,b:r`$\vec F=q(\vec E+\vec v\wedge\vec B)$ ; la partie magnétique ne travaille jamais.`},
{f:`Force de Laplace`,b:r`$\mathrm d\vec F=i\,\mathrm d\vec\ell\wedge\vec B$ ; barre ⟂ B : $F=i\ell B$.`},
{f:`Rayon de Larmor`,b:r`$R=\frac{mv}{|q|B}$ ; période $2\pi m/|q|B$ indépendante de v (cyclotron, spectromètre de masse).`},
{f:`Maxwell-flux (3ᵉ équation)`,b:r`$\oiint\vec B\cdot\mathrm d\vec S=0$ ⟺ $\mathrm{div}\vec B=0$ : pas de monopôle, lignes fermées.`},
{f:`Théorème d'Ampère (4ᵉ équation, statique)`,b:r`$\oint\vec B\cdot\mathrm d\vec\ell=\mu_0 i_{enl}$ ⟺ $\overrightarrow{\mathrm{rot}}\vec B=\mu_0\vec j$ ; $\mu_0=4\pi\times10^{-7}$ H/m.`},
{f:`Symétries : E vs B`,b:`Plan de symétrie : E contenu, B ⟂. Plan d'antisymétrie : E ⟂, B contenu. (B = pseudo-vecteur.)`},
{f:`B : fil / solénoïde / coax`,b:r`Fil $\frac{\mu_0i}{2\pi r}$ orthoradial ; solénoïde $\mu_0ni$ uniforme ; coax : $\frac{\mu_0 i}{2\pi r}$ entre a et b, 0 dehors.`},
{f:`Méthode : calculer une inductance`,b:`1. Courant i, B par Ampère. 2. Flux propre $\\Phi=\\iint\\vec B\\cdot d\\vec S$. 3. L = Φ/i.`},
{f:`Inductances à connaître`,b:r`Solénoïde $\mu_0N^2S/\ell$ ; coax $\frac{L}{\ell}=\frac{\mu_0}{2\pi}\ln\frac ba$.`},
{f:`Tableau électrique ↔ magnétique`,b:`q ↔ i ; E ↔ B ; Gauss ↔ Ampère ; ε₀ ↔ μ₀ ; C ↔ L ; Q=CU ↔ Φ=Li ; ½CU² ↔ ½Li² ; ½ε₀E² ↔ B²/2μ₀.`},
{f:`Origine du magnétisme`,b:`Charges en mouvement : courants, mouvement orbital des électrons, spin. Aimant = ensemble de boucles de courant (hypothèse d'Ampère).`},
];

/* ---------------- CHAPITRE 4 ---------------- */
Q.ch4=[
{q:`Loi de Faraday :`,o:[r`$e=-\dfrac{\mathrm d\Phi}{\mathrm dt}$`,r`$e=\Phi$`,r`$e=-L\Phi$`,r`$e=\dfrac{\mathrm d\Phi}{\mathrm dt}\cdot R$`],a:0,e:`La fem induite est l'opposé de la dérivée du flux magnétique à travers le circuit.`},
{q:`Un aimant très puissant est immobile près d'une spire immobile :`,o:[`aucune fem`,`fem maximale`,`fem proportionnelle à B`,`courant continu induit`],a:0,e:`Seule la VARIATION du flux compte. Flux intense mais constant ⇒ e = 0.`},
{q:`La loi de Lenz dit que le courant induit…`,o:[`s'oppose à la cause qui lui donne naissance`,`s'oppose toujours au champ B appliqué`,`renforce la variation de flux`,`est toujours dans le sens horaire`],a:0,e:`Il s'oppose à la VARIATION (la cause), pas au champ. Si le flux diminue, le B induit est dans le MÊME sens que B pour le maintenir.`},
{q:`Rails de Laplace (B ⟂, barre de longueur ℓ à vitesse v, résistance R) : intensité du courant induit`,o:[r`$B\ell v/R$`,r`$B\ell/(vR)$`,r`$B^2\ell^2v/R$`,r`$BvR/\ell$`],a:0,e:r`$\Phi=B\ell x$ ⇒ $|e|=B\ell v$ ⇒ $i=B\ell v/R$. ($B^2\ell^2v/R$ est la force.)`},
{q:`La force de Laplace sur la barre mobile est…`,o:[`opposée à la vitesse (freinage)`,`dans le sens de la vitesse`,`perpendiculaire aux rails`,`nulle`],a:0,e:`Lenz : elle s'oppose au mouvement qui crée l'induction. Norme $B^2\\ell^2v/R$.`},
{q:`Bilan d'énergie des rails à vitesse constante :`,o:[`puissance de l'opérateur = puissance Joule`,`l'induction crée de l'énergie`,`la puissance Joule est nulle`,`l'opérateur ne fournit rien`],a:0,e:r`$Fv=\frac{B^2\ell^2v^2}{R}=Ri^2$. L'induction est un CONVERTISSEUR mécanique → électrique (alternateur, dynamo).`},
{q:`Loi de la bobine en convention récepteur :`,o:[r`$u_L=L\dfrac{\mathrm di}{\mathrm dt}$`,r`$u_L=Li$`,r`$u_L=-L\dfrac{\mathrm di}{\mathrm dt}$`,r`$u_L=\dfrac{1}{L}\int i\,\mathrm dt$`],a:0,e:`Auto-induction : $\\Phi=Li$ ⇒ $e=-L\\,di/dt$ ; en convention récepteur la tension aux bornes est $+L\\,di/dt$.`},
{q:`Un transformateur alimenté en courant continu…`,o:[`ne transmet rien au secondaire (di/dt = 0)`,`fonctionne normalement`,`transmet le double de puissance`,`grille immédiatement le secondaire`],a:0,e:`Induction mutuelle : $e_2=-M\\,di_1/dt$. Continu ⇒ 0. Piège classique.`},
{q:`Forme locale de Maxwell-Faraday (régime variable) :`,o:[r`$\overrightarrow{\mathrm{rot}}\vec E=-\dfrac{\partial\vec B}{\partial t}$`,r`$\overrightarrow{\mathrm{rot}}\vec E=\vec 0$`,r`$\mathrm{div}\vec E=-\dfrac{\partial B}{\partial t}$`,r`$\overrightarrow{\mathrm{rot}}\vec B=-\dfrac{\partial\vec E}{\partial t}$`],a:0,e:`Un B variable crée un E induit qui « tourne » (circulation non nulle). rot E = 0 n'était vrai qu'en statique.`},
{q:`La force électromotrice est…`,o:[`une énergie par unité de charge (en volts), pas une force`,`une force en newtons`,`une puissance`,`un courant`],a:0,e:`$e=W_{non\\,élec}/q$ en J/C = V. Le nom est historique.`},
{q:`Barre lâchée avec $v_0$ sur les rails (sans opérateur) :`,o:[r`v décroît exponentiellement, $\tau=mR/(B^2\ell^2)$`,`v reste constante`,`v augmente`,`la barre s'arrête instantanément`],a:0,e:r`$m\dot v=-\frac{B^2\ell^2}{R}v$ ⇒ $v=v_0e^{-t/\tau}$. L'énergie cinétique part en chaleur (freinage par induction).`},
{q:`Méthode « module + Lenz » : après avoir écrit $i=|e|/R$, le sens du courant…`,o:[`est donné à part, par Lenz`,`est celui de l'orientation choisie`,`est forcément horaire`,`n'a pas d'importance`],a:0,e:`La valeur absolue a « consommé » l'info de signe. Conclure que i suit l'orientation initiale est une erreur de raisonnement. Ne pas mélanger les deux méthodes !`},
];
C.ch4=[
{f:`Force électromotrice`,b:r`$e=W_{non\,élec}/q$ (V). Origine chimique (pile) ou magnétique (induction). Pas une force !`},
{f:`Flux magnétique & convention d'orientation`,b:r`$\Phi=\iint\vec B\cdot\vec n\,\mathrm dS$ (Wb). Doigts = sens de parcours, pouce = $\vec n$. Ce choix fixe les signes de Φ, e, i.`},
{f:`Loi de Faraday`,b:r`$e=-\frac{\mathrm d\Phi}{\mathrm dt}$ ; seule la VARIATION du flux compte.`},
{f:`Loi de Lenz`,b:`Le courant induit s'oppose à la CAUSE qui lui donne naissance (le B induit tend à maintenir le flux antérieur).`},
{f:`Deux façons de faire varier Φ`,b:`B variable (circuit fixe → E induit, rot E = −∂B/∂t, transformateur) ou circuit mobile/déformable (B statique → Lorentz sur les porteurs, rails, alternateur).`},
{f:`Circuit équivalent`,b:`Une maille : générateur de fem e + résistance totale R ⇒ i = e/R (algébrique) ou |e|/R (+ Lenz pour le sens).`},
{f:`Rails de Laplace : les 5 résultats`,b:r`$\Phi=B\ell x$ ; $e=-B\ell v$ ; $i=B\ell v/R$ ; $F=B^2\ell^2v/R$ freinante ; $P_{op}=P_{Joule}$.`},
{f:`Auto-induction`,b:r`$e=-L\frac{\mathrm di}{\mathrm dt}$, soit $u_L=L\frac{\mathrm di}{\mathrm dt}$ (convention récepteur).`},
{f:`Induction mutuelle`,b:r`$\Phi_2=Mi_1$, $e_2=-M\frac{\mathrm di_1}{\mathrm dt}$ : transformateur, recharge sans fil, NFC/RFID. Exige un courant VARIABLE.`},
{f:`Maxwell-Faraday v2`,b:r`$\oint\vec E\cdot\mathrm d\vec\ell=-\frac{\mathrm d}{\mathrm dt}\iint\vec B\cdot\mathrm d\vec S$ ⟺ $\overrightarrow{\mathrm{rot}}\vec E=-\partial_t\vec B$.`},
{f:`Oscillateur LC`,b:r`$\omega_0=1/\sqrt{LC}$ ; l'énergie oscille entre $\frac12CU^2$ (champ E) et $\frac12Li^2$ (champ B).`},
];

/* ---------------- CHAPITRE 5 ---------------- */
Q.ch5=[
{q:`Le paradoxe qui rend Ampère incomplet apparaît avec…`,o:[`un condensateur en cours de charge et deux surfaces s'appuyant sur le même contour`,`un fil infini`,`un solénoïde`,`un aimant permanent`],a:0,e:`Surface plate : i_enlacé = i. Surface en sac passant entre les armatures : i_enlacé = 0. Même contour, deux résultats : contradiction.`},
{q:`Courant de déplacement :`,o:[r`$i_D=\varepsilon_0\dfrac{\mathrm d\Phi_E}{\mathrm dt}$`,r`$i_D=\mu_0\dfrac{\mathrm d\Phi_B}{\mathrm dt}$`,r`$i_D=\dfrac{\mathrm dQ}{\mathrm dt}\varepsilon_0$`,r`$i_D=\varepsilon_0 E$`],a:0,e:r`Entre les armatures $\Phi_E=Q/\varepsilon_0$ donc $i_D=\mathrm dQ/\mathrm dt=i$ : le paradoxe est levé.`},
{q:`Forme locale de Maxwell-Ampère :`,o:[r`$\overrightarrow{\mathrm{rot}}\vec B=\mu_0\vec j+\mu_0\varepsilon_0\dfrac{\partial\vec E}{\partial t}$`,r`$\overrightarrow{\mathrm{rot}}\vec B=\mu_0\vec j$`,r`$\overrightarrow{\mathrm{rot}}\vec B=-\dfrac{\partial\vec E}{\partial t}$`,r`$\mathrm{div}\vec B=\mu_0\vec j$`],a:0,e:`Le terme ajouté par Maxwell : un E variable crée un B, exactement comme un courant.`},
{q:`Quelles équations de Maxwell contiennent des SOURCES (charges, courants) ?`,o:[`Maxwell-Gauss et Maxwell-Ampère`,`Maxwell-flux et Maxwell-Faraday`,`les quatre`,`aucune`],a:0,e:`div E = ρ/ε₀ (charges) et rot B = μ₀j + … (courants). div B = 0 et rot E = −∂B/∂t n'ont pas de source.`},
{q:`Loin des sources, $E(z,t)$ vérifie…`,o:[r`$\dfrac{\partial^2E}{\partial z^2}=\dfrac{1}{c^2}\dfrac{\partial^2E}{\partial t^2}$`,r`$\dfrac{\partial E}{\partial z}=\dfrac{1}{c}\dfrac{\partial E}{\partial t}$`,r`$\dfrac{\partial^2E}{\partial z^2}=0$`,r`$\dfrac{\partial E}{\partial t}=0$`],a:0,e:`C'est l'équation de d'Alembert, obtenue en dérivant ∂E/∂z = −∂B/∂t par z et ∂B/∂z = −ε₀μ₀∂E/∂t par t.`},
{q:`$c=$`,o:[r`$1/\sqrt{\varepsilon_0\mu_0}\approx3\times10^8$ m/s`,r`$\sqrt{\varepsilon_0\mu_0}$`,r`$\varepsilon_0/\mu_0$`,r`$1/(\varepsilon_0\mu_0)$`],a:0,e:`La vitesse de la lumière sort des constantes de l'électricité et du magnétisme : la lumière EST une onde électromagnétique.`},
{q:`Sans le courant de déplacement…`,o:[`pas de propagation d'onde EM (boucle ouverte)`,`les ondes iraient plus vite`,`rien ne change`,`les charges ne se conserveraient plus que dans le vide`],a:0,e:`Faraday : B variable ⇒ E. Il faut aussi E variable ⇒ B (Maxwell) pour que la perturbation s'auto-entretienne.`},
{q:`Vitesse de propagation sur une ligne LC (grandeurs linéiques $\\mathcal L$, $\\mathcal C$) :`,o:[r`$1/\sqrt{\mathcal{LC}}$`,r`$\sqrt{\mathcal{LC}}$`,r`$\mathcal L/\mathcal C$`,r`$1/(\mathcal{LC})$`],a:0,e:r`$[\mathcal{LC}]=\mathrm{s^2\,m^{-2}}$ donc $1/\sqrt{\mathcal{LC}}$ est bien une vitesse.`},
{q:`Onde plane avec $\\vec E=E(z,t)\\vec e_x$, $\\vec B=B(z,t)\\vec e_y$ : elle se propage selon…`,o:[`z`,`x`,`y`,`aucune direction`],a:0,e:`E ⟂ B ⟂ direction de propagation : l'onde EM est transversale.`},
{q:`Pourquoi exactement 4 équations de Maxwell ?`,o:[`2 champs (E, B) × 2 questions (flux, circulation)`,`4 chapitres`,`4 constantes`,`4 dimensions d'espace-temps`],a:0,e:`Flux de E : Gauss. Flux de B : 0. Circulation de E : Faraday. Circulation de B : Ampère-Maxwell.`},
];
C.ch5=[
{f:`Paradoxe d'Ampère`,b:`Condensateur en charge : surface plate (i_enl = i) vs surface en sac entre les armatures (i_enl = 0). Même contour, deux résultats.`},
{f:`Courant de déplacement`,b:r`$i_D=\varepsilon_0\frac{\mathrm d\Phi_E}{\mathrm dt}$ ; entre les armatures il vaut exactement i.`},
{f:`Ampère-Maxwell`,b:r`$\oint\vec B\cdot\mathrm d\vec\ell=\mu_0 i+\mu_0\varepsilon_0\frac{\mathrm d\Phi_E}{\mathrm dt}$ ; $\overrightarrow{\mathrm{rot}}\vec B=\mu_0\vec j+\mu_0\varepsilon_0\partial_t\vec E$.`},
{f:`Les 4 équations (formes locales)`,b:r`$\mathrm{div}\vec E=\rho/\varepsilon_0$ ; $\mathrm{div}\vec B=0$ ; $\overrightarrow{\mathrm{rot}}\vec E=-\partial_t\vec B$ ; $\overrightarrow{\mathrm{rot}}\vec B=\mu_0\vec j+\mu_0\varepsilon_0\partial_t\vec E$.`},
{f:`Équations de la ligne LC`,b:r`$\partial_zV=-\mathcal L\partial_tI$ (mailles) ; $\partial_zI=-\mathcal C\partial_tV$ (nœuds).`},
{f:`Équation de d'Alembert`,b:r`$\frac{\partial^2 V}{\partial z^2}=\frac{1}{v^2}\frac{\partial^2V}{\partial t^2}$, $v=1/\sqrt{\mathcal{LC}}$ (ligne) ou $c=1/\sqrt{\varepsilon_0\mu_0}$ (vide).`},
{f:`Onde plane E_x, B_y : les 2 équations couplées`,b:r`$\frac{\partial E}{\partial z}=-\frac{\partial B}{\partial t}$ (Faraday) ; $\frac{\partial B}{\partial z}=-\varepsilon_0\mu_0\frac{\partial E}{\partial t}$ (Ampère-Maxwell).`},
{f:`Boucle de couplage`,b:`E variable → (Ampère-Maxwell) → B variable → (Faraday) → E variable… sans charge ni courant : l'onde se détache et se propage.`},
];

/* ---------------- TD 1 ---------------- */
Q.td1=[
{q:`Rapport $F_e/F_G$ pour l'électron de l'atome d'hydrogène : dépend-il de $a_0$ ?`,o:[`Non : les deux forces varient en $1/r^2$, la distance se simplifie`,`Oui, il varie en $a_0^2$`,`Oui, en $1/a_0$`,`Il est nul`],a:0,e:r`$\frac{F_e}{F_G}=\frac{e^2}{4\pi\varepsilon_0Gm_em_p}\approx2{,}3\times10^{39}$ : même valeur à l'échelle de l'atome qu'à 1 m.`},
{q:`Triangle équilatéral (+q, +q, −q) : norme de la force sur une charge +q ?`,o:[r`$\frac{1}{4\pi\varepsilon_0}\frac{q^2}{\ell^2}$`,r`$\frac{2}{4\pi\varepsilon_0}\frac{q^2}{\ell^2}$`,r`$\frac{\sqrt3}{4\pi\varepsilon_0}\frac{q^2}{\ell^2}$`,`0`],a:0,e:`Deux forces de même norme F faisant 120° : $\\|\\vec F_{tot}\\|=2F\\cos(60°)=F$.`},
{q:`Pour montrer $E_\\theta=0$ (anneau, point P hors axe), on utilise…`,o:[`le plan Π contenant l'axe et P, plan de symétrie`,`le théorème de Gauss`,`l'invariance par rotation`,`le potentiel`],a:0,e:`Un plan de symétrie passant par P impose E ⊂ Π ; $\\vec e_\\theta$ est ⟂ à Π. (L'invariance par rotation fixe la dépendance en θ, pas la direction !)`},
{q:`Volume d'une coquille sphérique entre $r$ et $r+\\mathrm dr$ :`,o:[r`$4\pi r^2\,\mathrm dr$`,r`$\tfrac43\pi r^3$`,r`$2\pi r\,\mathrm dr$`,r`$4\pi r\,\mathrm dr$`],a:0,e:`Aire de la sphère × épaisseur, au 1er ordre en dr.`},
{q:`Sphère uniformément chargée : $E$ à l'intérieur ($r<R$)`,o:[r`$\dfrac{\rho r}{3\varepsilon_0}$`,r`$\dfrac{\rho R^3}{3\varepsilon_0r^2}$`,`0`,r`$\dfrac{\rho}{\varepsilon_0}$`],a:0,e:r`Gauss : $E\cdot4\pi r^2=\rho\frac43\pi r^3/\varepsilon_0$. Croît linéairement, nul au centre.`},
{q:`Dans l'exo 5, $V(\\infty)\\neq0$. Pourquoi ?`,o:[`L'origine des potentiels a été choisie en O`,`Erreur de calcul`,`La charge totale est infinie`,`E ne tend pas vers 0`],a:0,e:`Seules les différences de potentiel ont un sens physique ; changer de référence décale V d'une constante.`},
{q:`Plan infini chargé : peut-on prendre $V(\\infty)=0$ ?`,o:[`Non, la distribution est elle-même infinie (V diverge)`,`Oui, toujours`,`Oui si σ > 0`,`Seulement d'un côté`],a:0,e:`$V=-\\sigma|z|/2\\varepsilon_0$ diverge à l'infini : on prend la référence sur le plan.`},
{q:`Deux plans $+\\sigma$ et $-\\sigma$ : champ à l'extérieur ?`,o:[`0`,r`$\sigma/\varepsilon_0$`,r`$\sigma/2\varepsilon_0$`,r`$2\sigma/\varepsilon_0$`],a:0,e:`Superposition : $+\\sigma/2\\varepsilon_0-\\sigma/2\\varepsilon_0=0$ dehors, $\\sigma/\\varepsilon_0$ entre. Modèle du condensateur plan.`},
{q:`Près de l'axe de l'anneau, $E_r(r,z)=$ ?`,o:[r`$-\dfrac r2\dfrac{\mathrm dE_0}{\mathrm dz}$`,r`$\dfrac r2E_0$`,`0`,r`$-r\dfrac{\mathrm dE_0}{\mathrm dz}$`],a:0,e:r`Flux nul à travers le petit cylindre : $2\pi r\,\mathrm dz\,E_r+\pi r^2\frac{\mathrm dE_0}{\mathrm dz}\mathrm dz=0$.`},
];
Q.td2=[
{q:`On relie B à la Terre alors qu'il est sous l'influence de A (Q > 0). B prend…`,o:[`une charge nette négative`,`une charge nette positive`,`aucune charge`,`la charge Q`],a:0,e:`Les charges + (face éloignée) s'écoulent vers la Terre ; les − restent, retenues par A.`},
{q:`Capacité de deux sphères concentriques $R_1<R_2$ :`,o:[r`$\dfrac{4\pi\varepsilon_0R_1R_2}{R_2-R_1}$`,r`$4\pi\varepsilon_0(R_2-R_1)$`,r`$\dfrac{4\pi\varepsilon_0}{R_2-R_1}$`,r`$\dfrac{2\pi\varepsilon_0}{\ln(R_2/R_1)}$`],a:0,e:r`$U=\frac{Q}{4\pi\varepsilon_0}\left(\frac1{R_1}-\frac1{R_2}\right)$ ⇒ $C=Q/U$.`},
{q:`Limite $R_2\\to\\infty$ de la capacité sphérique :`,o:[r`$4\pi\varepsilon_0R_1$ (sphère isolée)`,`0`,`∞`,r`$\varepsilon_0 4\pi R_1^2/e$`],a:0,e:`C'est la capacité d'une sphère seule. Autre limite utile : $R_2-R_1=e\\ll R$ redonne le condensateur plan $\\varepsilon_0 4\\pi R^2/e$.`},
{q:`Modèle de Drude : la conductivité statique s'obtient en…`,o:[`régime permanent, dv/dt = 0`,`négligeant le frottement`,`supposant v = 0`,`prenant τ → 0`],a:0,e:`La force motrice −eE équilibre le frottement −mv/τ : vitesse limite.`},
{q:`Couronne fendue : les anneaux élémentaires de rayon r sont…`,o:[`en parallèle (même tension V₁−V₂)`,`en série`,`ni l'un ni l'autre`,`court-circuités`],a:0,e:`Chacun relie les deux faces de la fente : même tension ⇒ on additionne les CONDUCTANCES.`},
{q:`Résistance de l'isolant (rayons $R_1$, $R_2$) pour une tranche dx de coax :`,o:[r`$\dfrac{\rho\ln(R_2/R_1)}{2\pi\,\mathrm dx}$`,r`$\dfrac{\rho\,\mathrm dx}{\pi(R_2^2-R_1^2)}$`,r`$\dfrac{2\pi\rho}{\ln(R_2/R_1)}\mathrm dx$`,r`$\rho(R_2-R_1)\mathrm dx$`],a:0,e:`Courant radial : coquilles cylindriques en SÉRIE, $dR=\\rho\\,dr/(2\\pi r\\,dx)$, intégrée de R₁ à R₂.`},
{q:`Courant de fuite dans la tranche dx :`,o:[r`$\mathrm di_f=i(x)-i(x+\mathrm dx)=-\dfrac{\mathrm di}{\mathrm dx}\mathrm dx$`,r`$\mathrm di_f=i(x+\mathrm dx)-i(x)$`,r`$\mathrm di_f=i(x)\,\mathrm dx$`,`0`],a:0,e:`Loi des nœuds (conservation de la charge) : ce qui entre dans la tranche de l'âme ressort soit plus loin, soit par l'isolant.`},
{q:`Câble semi-infini avec fuite : U(x) =`,o:[r`$U_0e^{-x/\delta}$`,r`$U_0(1-x/L)$`,r`$U_0\cos(x/\delta)$`,`$U_0$`],a:0,e:`$U''=U/\\delta^2$ ; la solution en $e^{+x/\\delta}$ diverge et est rejetée.`},
];

/* Flashcards TD (méthodes) */
C.td1=[
{f:`Rapport de deux forces en 1/r²`,b:`Écrire le rapport : la distance se simplifie. Conclure physiquement (gravitation négligeable à l'échelle atomique).`},
{f:`Somme de 2 forces de même norme F faisant un angle α`,b:r`$\|\vec F_{tot}\|=2F\cos(\alpha/2)$, portée par la bissectrice.`},
{f:`Montrer qu'une composante de E est nulle`,b:`Trouver un plan de symétrie passant par le point : E y est contenu ⇒ la composante ⟂ au plan est nulle.`},
{f:`Montrer que E ne dépend que de (r, z)`,b:`Invariance par rotation autour de Oz ⇒ les composantes dans la base locale ne dépendent pas de θ.`},
{f:`ρ(r) non uniforme : charge totale`,b:r`Coquille : $\mathrm dq=\rho(r)\,4\pi r^2\mathrm dr$, puis $q(r)=\int_0^r$.`},
{f:`Potentiel par morceaux (sphère)`,b:`Intégrer E = −dV/dr dans chaque zone, fixer la constante par la référence, puis par la CONTINUITÉ de V à la frontière.`},
];
C.td2=[
{f:`Mettre un conducteur à la Terre`,b:`Son potentiel est fixé à 0 ; sa charge s'ajuste (elle n'est PAS forcément nulle s'il est sous influence).`},
{f:`Écran électrostatique`,b:`Supprime l'influence : chaque conducteur se comporte comme s'il était seul (charges réparties uniformément sur une sphère).`},
{f:`Capacité sphérique`,b:r`$C=\frac{4\pi\varepsilon_0R_1R_2}{R_2-R_1}$ ; limites : sphère seule, condensateur plan.`},
{f:`Résistance : série ou parallèle ?`,b:`Courant LE LONG de la dimension découpée ⇒ tranches en SÉRIE (on somme dR). Courant PARALLÈLE aux tranches (même tension) ⇒ PARALLÈLE (on somme dG = 1/dR).`},
{f:`Ligne avec pertes : méthode`,b:`Tranche dx : loi d'Ohm sur chaque conducteur (dV/dx = ∓ρ i) + loi des nœuds (di_f = −di) + loi d'Ohm de l'isolant ⇒ EDO du 2nd ordre.`},
];

window.EM_DATA={quiz:Q,cards:C};
})();
