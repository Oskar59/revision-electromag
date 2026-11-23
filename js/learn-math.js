/* ============ Maths : cartes logiques, images mentales, formules décodées, prédictions, animations commentées ============ */
(function(){
const r=String.raw;
const L=window.LEARN=window.LEARN||{maps:{},inject:[],predict:[],stories:{},guided:{}};
['maps','stories','guided'].forEach(k=>L[k]=L[k]||{}); ['inject','predict'].forEach(k=>L[k]=L[k]||[]);
const img=(p,sel,title,html,w)=>L.inject.push({p,sel,w:w||'after',html:`<div class="card img"><span class="tag">🖼 Image mentale — ${title}</span>${html}</div>`});
const annot=(p,sel,title,tex,legend,sentence,w)=>L.inject.push({p,sel,w:w||'after',html:`<div class="annot" data-legend='${JSON.stringify(legend)}'><span class="tag">🎨 Formule décodée — ${title}</span>$$${tex}$$<div class="sentence"><b>En une phrase :</b> ${sentence}</div></div>`});
const pred=(p,sel,q,o,a,e)=>L.predict.push({p,sel,q,o,a,e});
const C=(s)=>r`\htmlClass{c${s}}`;
const F=s=>`figure[data-anim=${s}]`;

/* ------------------------------ CARTES LOGIQUES ------------------------------ */
L.maps.ma1={nodes:[
{t:'Inventer i (i² = −1)',s:'#def',d:'On ajoute un nombre dont le carré vaut −1 ; toutes les règles de calcul restent valables.',why:'un complexe a deux composantes a et b : on peut le dessiner'},
{t:'Un point / une flèche du plan',s:'#module',d:'z = a + ib ↔ point (a, b). Module = longueur, argument = angle.',why:'la longueur et l’angle se combinent très simplement quand on multiplie…'},
{t:'Forme exponentielle re^{iθ}',s:'#expo',d:'Multiplier = multiplier les modules et ajouter les angles : exactement la règle des exposants.',why:'en particulier cos et sin s’écrivent avec des exponentielles'},
{t:'Euler & De Moivre',s:'#expo',d:'cos = moyenne de deux flèches qui tournent en sens inverse. Sert à linéariser (pour intégrer).',why:'on peut maintenant résoudre des équations impossibles dans ℝ'},
{t:'Racines carrées, 2ᵈ degré',s:'#eq2',d:'Système a² − b², 2ab, a² + b² = |c|. Puis la formule habituelle avec δ.',why:'et plus généralement zⁿ = c'},
{t:'Racines n-ièmes',s:'#nroot',d:'n points régulièrement espacés sur un cercle (forme exponentielle).',why:'à quoi ça sert concrètement ?'},
{t:'Électronique : phaseurs',s:'#elec',d:'Une sinusoïde = la partie réelle d’une flèche qui tourne. Dériver = multiplier par iω.'}]};
L.maps.ma2={nodes:[
{t:'Primitive : F′ = f',s:'#prim',d:'L’opération inverse de la dérivation. Une famille F + c.',why:'quel rapport avec une aire ?'},
{t:'Intégrale = aire signée',s:'#integ',d:'Limite des sommes de rectangles ; sous l’axe ça compte négativement.',why:'l’aire accumulée grandit à la vitesse f(x)…'},
{t:'Théorème fondamental',s:'#integ',d:'∫ₐᵇ f = F(b) − F(a). Calculer une aire revient à trouver une primitive.',why:'mais beaucoup de primitives ne sont pas dans le tableau'},
{t:'IPP',s:'#ipp',d:'Pour un produit : on dérive ce qui se simplifie, on intègre ce qui reste simple.',why:'parfois c’est la variable elle-même qui gêne'},
{t:'Changement de variable',s:'#chgt',d:'On renomme pour faire apparaître une forme connue (u′ f(u)). Changer dt ET les bornes.',why:'reste le cas des fractions'},
{t:'Éléments simples',s:'#frac',d:'Casser la fraction en morceaux A/(x − a) qui s’intègrent en ln.'}]};
L.maps.ma3={nodes:[
{t:'L’équation relie u et u′',s:'#intro',d:'« La vitesse de variation dépend de l’état » : circuits, mécanique.',why:'commençons sans source extérieure'},
{t:'Homogène 1ᵉʳ ordre',s:'#ordre1',d:'u′ = −(b/a)u ⇒ exponentielle Ce^{−bt/a}.',why:'avec une source, la linéarité donne la structure'},
{t:'u = u_h + u_p',s:'#ordre1',d:'Tout le régime libre + UNE réponse forcée. On cherche u_p en imitant le second membre.',why:'au 2ᵈ ordre, l’homogène demande une astuce'},
{t:'Équation caractéristique',s:'#ordre2',d:'On essaie e^{rt} : ar² + br + c = 0.',why:'selon le signe de Δ, trois allures'},
{t:'3 régimes',s:'#ordre2',d:'Réelles : apériodique ; double : critique ; complexes : oscillations amorties.',why:'et la condition initiale fixe les constantes'},
{t:'Problème de Cauchy',s:'#ordre2',d:'u(0) (et u′(0)) appliquées à la solution GÉNÉRALE : solution unique.'}]};
L.maps.ma4={nodes:[
{t:'Somme de petits carreaux',s:'#double',d:'∬ f dx dy : volume sous une surface, masse d’une plaque, aire si f = 1.',why:'pour calculer, on découpe en tranches'},
{t:'Décrire le domaine',s:'#double',d:'x de a à b, puis y entre deux courbes. LE moment où on se trompe : dessine !',why:'on intègre alors une variable après l’autre'},
{t:'Fubini',s:'#double',d:'L’ordre est libre si on redécrit le domaine.',why:'certains domaines sont ronds…'},
{t:'Polaires (r dr dθ)',s:'#polaire',d:'Un disque devient un rectangle en (r, θ). Facteur r = étirement des carreaux.',why:'même idée en 3D'},
{t:'Triples, cylindriques, sphériques',s:'#triple',d:'dV = r dr dθ dz ou r² cos φ dr dθ dφ.',why:'à quoi ça sert ?'},
{t:'Masse, centre, inertie',s:'#applis',d:'Les formules de la mécanique et de l’EM sont des intégrales multiples.'}]};
L.maps.ma5={nodes:[
{t:'Matrice = machine linéaire',s:'#def',d:'Ses colonnes sont les images des vecteurs de base.',why:'enchaîner deux machines…'},
{t:'Produit = composition',s:'#def',d:'Ligne × colonne ; non commutatif.',why:'un système linéaire, c’est AX = B'},
{t:'Pivot de Gauss',s:'#gauss',d:'Échelonner puis remonter. Lire : 0, 1 ou ∞ solutions.',why:'peut-on prévoir s’il y a une solution unique ?'},
{t:'Déterminant',s:'#det',d:'Facteur d’aire. Nul ⇔ la machine écrase le plan.',why:'si det ≠ 0 on peut revenir en arrière'},
{t:'Inverse',s:'#inv',d:'X = A⁻¹B. Formule 2×2, Gauss-Jordan, comatrice.',why:'ou directement, inconnue par inconnue'},
{t:'Cramer',s:'#cramer',d:'xᵢ = det Aᵢ / det A.'}]};
L.maps.ma6={nodes:[
{t:'Signal périodique',s:'#serie',d:'Il se répète toutes les T secondes.',why:'idée de Fourier : c’est une somme de sinusoïdes de fréquences n/T'},
{t:'Série trigonométrique',s:'#serie',d:'a₀ + Σ (aₙ cos nωt + bₙ sin nωt).',why:'comment trouver chaque coefficient ?'},
{t:'Coefficients = projections',s:'#coef',d:'On multiplie par cos nωt et on moyenne : tout le reste s’annule.',why:'la somme infinie redonne-t-elle bien f ?'},
{t:'Dirichlet',s:'#dirichlet',d:'Oui là où f est continue ; la moyenne aux sauts.',why:'une écriture plus compacte'},
{t:'Forme complexe, spectre',s:'#complexe',d:'cₙ et ses raies : la « carte d’identité fréquentielle ».',why:'et l’énergie ?'},
{t:'Parseval',s:'#parseval',d:'Puissance = somme des puissances des harmoniques.'}]};
L.maps.ma7={nodes:[
{t:'Intégrer jusqu’à l’infini',s:'#gen',d:'Limite d’intégrales ; converge ou diverge.',why:'on compare à des références'},
{t:'Riemann & comparaison',s:'#gen',d:'1/t^α : α > 1 en +∞, α < 1 en 0.',why:'on peut alors intégrer un signal non périodique'},
{t:'Transformée de Fourier',s:'#tf',d:'f̂(λ) : combien de la fréquence λ dans le signal. Spectre continu.',why:'calculer à la main est long…'},
{t:'Propriétés',s:'#prop',d:'Retard, dilatation, dérivation : on transforme les opérations au lieu de recalculer.',why:'peut-on revenir en arrière ?'},
{t:'Inversion & Parseval',s:'#inv',d:'Même formule avec +. Énergie conservée. Calcule des intégrales célèbres.'}]};
L.maps.ma8={nodes:[
{t:'Fonctions causales',s:'#def',d:'Nulles avant 0 ; U(t) « allume » à t = 0.',why:'on les traduit en fonctions de p'},
{t:'F(p) = ∫₀^∞ f e^{−pt}',s:'#def',d:'Converge pour Re p assez grand (e^{−pt} écrase tout).',why:'le cœur : ce que deviennent les opérations'},
{t:'Propriétés',s:'#prop',d:'Dériver → ×p ; retarder → ×e^{−ap} ; ×e^{at} → décaler p.',why:'et pour revenir en arrière ?'},
{t:'Dictionnaire & éléments simples',s:'#inverse',d:'On casse F(p) en morceaux du dictionnaire.',why:'application majeure'},
{t:'Résoudre une EDO',s:'#edo',d:'EDO → équation algébrique en Y(p) → décomposition → y(t).'}]};

/* ------------------------------ IMAGES MENTALES ------------------------------ */
img('ma1','#module','le complexe est une flèche',`<p>Imagine une <b>aiguille de boussole</b> plantée à l'origine. Sa longueur est le module, sa direction l'argument. Ajouter deux complexes : mettre les aiguilles bout à bout. Multiplier : <b>tourner</b> la première de l'angle de la seconde et l'<b>étirer</b> de sa longueur.</p>`);
img('ma2','#integ','le compteur d’eau',`<p>f(x) est le <b>débit</b> d'un robinet à l'instant x ; F(x) est le <b>volume</b> tombé dans le seau depuis le début. Le débit dit à quelle vitesse le volume monte (F′ = f). Débit négatif = on pompe (l'aire compte négativement). Le volume entre a et b ne dépend que du compteur au début et à la fin : F(b) − F(a).</p>`);
img('ma3','#ordre1','la tasse de café',`<p>Ton café refroidit d'autant plus vite qu'il est chaud par rapport à la pièce : u′ = −k(u − T_pièce). Quelle que soit la température de départ (la constante C), toutes les courbes finissent à la température de la pièce (la solution particulière). <b>u_h</b> = le souvenir du départ qui s'efface ; <b>u_p</b> = ce que l'environnement impose.</p>`);
img('ma4','#double','le gâteau en tranches',`<p>Pour peser un gâteau de forme bizarre, on le coupe en <b>tranches</b> (x fixé) : chaque tranche va d'un bord à l'autre (les bornes en y dépendent de l'endroit où on coupe). On pèse chaque tranche puis on additionne. Couper dans l'autre sens donne le même poids : c'est Fubini.</p>`);
img('ma5','#det','la feuille de caoutchouc',`<p>Une matrice 2×2 déforme une feuille de caoutchouc quadrillée (sans la plier ni la déchirer : les droites restent droites, l'origine reste fixe). Le déterminant dit par combien les petits carrés ont grossi. S'il vaut 0, la feuille a été aplatie en un trait : impossible de la « déplier » (pas d'inverse).</p>`);
img('ma6','#coef','l’égaliseur de la chaîne hi-fi',`<p>Les curseurs d'un égaliseur (basses, médiums, aigus) sont les coefficients : chaque curseur règle « combien » d'une fréquence il y a. Un créneau, c'est un réglage précis d'une infinité de curseurs (harmoniques impaires, en 1/n). Calculer $a_n$, c'est <b>lire</b> la position du curseur n.</p>`);
img('ma7','#tf','le prisme',`<p>La lumière blanche traverse un prisme et s'étale en arc-en-ciel : chaque couleur (fréquence) avec son intensité. La transformée de Fourier est ce prisme pour un signal quelconque. Un flash très bref contient toutes les couleurs (spectre large) ; une note tenue longtemps, une seule (spectre étroit).</p>`);
img('ma8','#def','le traducteur',`<p>Dans le « pays du temps », dériver est difficile ; dans le « pays de p », c'est une simple multiplication. Laplace est le <b>dictionnaire</b> : on traduit le problème, on le résout facilement en algèbre, puis on retraduit la réponse. Les conditions initiales voyagent avec la traduction.</p>`);

/* ------------------------------ FORMULES DÉCODÉES ------------------------------ */
annot('ma1','#expo ~ .card.def','la forme exponentielle',r`z=${C(1)}{r}\,e^{i${C(2)}{\theta}}=${C(1)}{r}\left(${C(3)}{\cos\theta}+i\,${C(4)}{\sin\theta}\right)`,
 [['c1','module r','La longueur de la flèche : $r=|z|=\\sqrt{a^2+b^2}$.'],['c2','argument θ','L’angle avec l’axe réel, à 2π près.'],['c3','cos θ','La projection horizontale : $a=r\\cos\\theta$.'],['c4','sin θ','La projection verticale : $b=r\\sin\\theta$.']],
 'une longueur et une direction suffisent à décrire la flèche.');
annot('ma2','#ipp ~ .card.def','l’intégration par parties',r`\int_a^b ${C(1)}{u}\,${C(2)}{v'}=\big[${C(1)}{u}\,${C(3)}{v}\big]_a^b-\int_a^b${C(4)}{u'}\,${C(3)}{v}`,
 [['c1','u','Le facteur qu’on va DÉRIVER (il doit se simplifier).'],['c2',"v′",'Le facteur qu’on sait INTÉGRER.'],['c3','v','Une primitive de v′.'],['c4',"u′",'La dérivée de u : la nouvelle intégrale doit être plus simple.']],
 'on échange une intégrale difficile contre un crochet et une intégrale plus facile.');
annot('ma3','#ordre2 ~ .card.def','la solution pseudo-périodique',r`u(t)=${C(1)}{e^{\alpha t}}\left(\lambda\cos ${C(2)}{\beta} t+\mu\sin${C(2)}{\beta} t\right)+${C(3)}{u_p(t)}`,
 [['c1','enveloppe e^{αt}','α = partie réelle des racines : amortit si α < 0, explose si α > 0.'],['c2','β','Partie imaginaire des racines : pulsation des oscillations.'],['c3','u_p','La réponse forcée imposée par le second membre (reste après le transitoire).']],
 'des oscillations de pulsation β dans une enveloppe exponentielle, plus ce que la source impose.');
annot('ma4','#polaire ~ .card.def','le passage en polaires',r`\iint_D f(x,y)\,\mathrm dx\,\mathrm dy=\iint ${C(1)}{f(r\cos\theta,r\sin\theta)}\,${C(2)}{r}\,${C(3)}{\mathrm dr\,\mathrm d\theta}`,
 [['c1','f réécrite','On remplace x et y ; souvent x² + y² devient r².'],['c2','facteur r','Le jacobien : un carreau polaire est d’autant plus grand qu’il est loin du centre.'],['c3','dr dθ','Les nouvelles variables, avec des bornes souvent constantes (disque → rectangle).']],
 'on change de quadrillage, et le r compense la déformation des carreaux.');
annot('ma6','#coef ~ .card.def','un coefficient de Fourier',r`a_n=${C(1)}{\frac2T}\int_{${C(2)}{T}}${C(3)}{f(t)}\,${C(4)}{\cos(n\omega t)}\,\mathrm dt`,
 [['c1','2/T','Normalisation : la moyenne de cos² vaut 1/2, d’où le 2.'],['c2','sur une période','N’importe quelle période (choisis la plus pratique : symétrique pour exploiter la parité).'],['c3','f(t)','Le signal qu’on analyse.'],['c4','cos nωt','Le « détecteur » de l’harmonique n : tous les autres termes donnent une moyenne nulle.']],
 'on mesure à quel point f ressemble à cos(nωt).');
annot('ma7','#tf ~ .card.def','la transformée de Fourier',r`\hat f(${C(1)}{\lambda})=\int_{-\infty}^{+\infty}${C(2)}{f(t)}\,${C(3)}{e^{-2i\pi\lambda t}}\,\mathrm dt`,
 [['c1','λ (fréquence)','La fréquence qu’on teste, en Hz.'],['c2','f(t)','Le signal (doit être intégrable).'],['c3','e^{−2iπλt}','Une sinusoïde complexe de fréquence λ : on projette f dessus.']],
 'f̂(λ) dit combien de fréquence λ contient le signal, et avec quelle phase.');
annot('ma8','#def ~ .card.def ~ .card.def','la transformée de Laplace',r`F(${C(1)}{p})=\int_{${C(2)}{0}}^{+\infty}f(t)\,${C(3)}{e^{-pt}}\,\mathrm dt`,
 [['c1','p','Variable complexe : partie réelle = amortissement, partie imaginaire = fréquence.'],['c2','à partir de 0','Fonctions causales : ce qui se passe avant l’allumage ne compte pas.'],['c3','e^{−pt}','Le facteur qui écrase toute croissance exponentielle de f (si Re p est assez grand).']],
 'une transformée de Fourier « amortie » et commencée à t = 0, faite pour les conditions initiales.');

/* ------------------------------ PRÉDICTIONS ------------------------------ */
pred('ma1',F('cplx'),'On multiplie z par w = i. Le point z…',['tourne de 90° sans changer de longueur','est symétrisé','s’éloigne de l’origine'],0,'|i| = 1 et arg i = π/2. Choisis « produit » et place w sur (0, 1).');
pred('ma1',F('roots'),'Les racines cubiques de 8 sont…',['3 points sur un cercle de rayon 2, espacés de 120°','2 et −2','3 points alignés'],0,'Module 8^(1/3) = 2, angles 0, 2π/3, 4π/3.');
pred('ma2',F('riemann'),'Rectangles « à gauche » sous x² (croissante) : la somme est…',['plus petite que l’intégrale','plus grande','exactement égale'],0,'Sur une fonction croissante, la hauteur à gauche est la plus basse de chaque bande.');
pred('ma2',F('primitive'),'Là où f(x) = 0, la courbe de F a…',['une tangente horizontale (extremum possible)','un saut','une valeur nulle'],0,'F′ = f = 0 : l’aire arrête momentanément de varier.');
pred('ma3',F('slope'),'Avec a = 2 > 0, deux solutions de départs très différents, au bout d’un moment…',['se confondent','s’écartent','restent parallèles à distance fixe'],0,'Leur différence vaut Ce^(−2t) → 0.');
pred('ma3',F('ode2'),'On augmente l’amortissement λ au-delà de ω₀. La solution…',['ne dépasse plus zéro (apériodique)','oscille plus vite','explose'],0,'Δ > 0 : racines réelles négatives.');
pred('ma4',F('polar'),'Une case dr × dθ loin du centre a une aire…',['plus grande qu’une case près du centre','égale','plus petite'],0,'Son arc mesure r dθ.');
pred('ma5',F('linmap'),'Si les deux colonnes de A sont alignées (proportionnelles), det A vaut…',['0','1','la longueur des colonnes'],0,'Le parallélogramme est plat : aire nulle. Essaie le bouton « det = 0 ».');
pred('ma6',F('fseries'),'Créneau : avec 40 harmoniques, le dépassement près des sauts…',['reste d’environ 9 % (il se resserre mais ne diminue pas)','disparaît','devient énorme'],0,'Phénomène de Gibbs.');
pred('ma7',F('ftrans'),'On rend la porte 2 fois plus étroite. Le premier zéro du spectre…',['s’éloigne (λ = 1/a double)','se rapproche','ne bouge pas'],0,'Signal bref ⇔ spectre large.');
pred('ma7',F('improper'),'∫₁^∞ dt/t : l’aire…',['grandit sans fin (diverge)','tend vers 1','tend vers 0'],0,'ln X → ∞ : cas limite α = 1.');
pred('ma8',F('laplace'),'Un pôle complexe à partie réelle négative donne un original qui…',['oscille en s’amortissant','explose','est constant'],0,'e^{σt} avec σ < 0 et sin(ωt).');

/* ------------------------------ ANIMATIONS COMMENTÉES ------------------------------ */
L.stories.ma1=[
{sel:F('cplx'),steps:[
{c:'Le complexe z = a + ib est un point… ou mieux une flèche. a se lit sur l’axe horizontal, b sur l’axe vertical.',a:F=>F.btn('z seul'),d:5000},
{c:'Son conjugué z̄ est son reflet dans l’axe réel : même module, argument opposé. z·z̄ = |z|² est réel.',a:F=>F.btn('conjugué'),d:5500},
{c:'Additionner = mettre les flèches bout à bout (parallélogramme), comme des vecteurs.',a:F=>F.btn('somme'),d:5500},
{c:'Multiplier = TOURNER de arg w et ÉTIRER de |w|. Les angles s’ajoutent : c’est pour ça qu’on écrit re^{iθ}.',a:F=>F.btn('produit'),d:7000},
{c:'L’inverse : module inversé, angle opposé. Un z près de l’origine a un inverse très loin.',a:F=>F.btn('inverse'),d:6000}]},
{sel:F('roots'),steps:[
{c:'n = 2 : les deux racines carrées sont opposées.',a:F=>F.rng(0,2),d:4500},
{c:'n = 3 : un triangle équilatéral. Le premier sommet a pour angle arg(c)/3.',a:F=>F.rng(0,3),d:5000},
{c:'n = 6 : un hexagone. Toujours n points espacés de 2π/n sur le cercle de rayon |c|^(1/n).',a:F=>F.rng(0,6),d:5500}]}];
L.stories.ma2=[
{sel:F('riemann'),steps:[
{c:'x² entre 0 et 2 : 4 rectangles « à gauche » sous-estiment l’aire.',a:F=>{F.btn('x²');F.btn('gauche');F.rng(0,4);},d:5000},
{c:'On passe à 30 rectangles : l’écart avec 8/3 devient minuscule. L’intégrale est la LIMITE de ces sommes.',a:F=>F.rng(0,30),d:5500},
{c:'Méthode du milieu ou des trapèzes : bien plus précises avec peu de rectangles.',a:F=>{F.rng(0,4);F.btn('trapèzes');},d:5500},
{c:'sin x jusqu’à 2π : l’arche du dessous compte négativement, total 0.',a:F=>{F.btn('sin x');F.rng(1,6.28);F.rng(0,20);},d:6000}]},
{sel:F('primitive'),steps:[
{c:'f = cos x en haut. On balaie x : l’aire verte s’accumule, et sa valeur trace F en bas.',a:F=>{F.btn('cos x');F.chk(0,true);},d:7000},
{c:'Quand cos devient négatif, l’aire diminue (orange) : F redescend. On obtient sin x.',d:6000},
{c:'Avec e^(−x²), la primitive existe (on la voit !) mais n’a pas de formule avec les fonctions usuelles.',a:F=>F.btn('e^(−x²)'),d:7000}]}];
L.stories.ma3=[
{sel:F('slope'),steps:[
{c:'u′ + u = sin 2t. Chaque trait donne la pente imposée en ce point. Les courbes suivent les traits.',a:F=>{F.rng(0,1);F.btn('sin 2t');},d:6000},
{c:'Toutes les solutions se rejoignent : la différence Ce^(−t) s’éteint. Il ne reste que la réponse forcée.',d:6000},
{c:'a = 3 : elles se rejoignent encore plus vite (τ = 1/a plus petit).',a:F=>F.rng(0,3),d:5000},
{c:'a < 0 : l’exponentielle explose, les solutions divergent. Instable !',a:F=>F.rng(0,-0.5),d:6000}]},
{sel:F('ode2'),steps:[
{c:'λ = 0,3 < ω₀ : racines complexes (à gauche), la solution oscille dans une enveloppe e^(−λt).',a:F=>{F.rng(1,1.5);F.rng(0,0.3);},d:6000},
{c:'λ = ω₀ = 1,5 : les deux racines se rejoignent sur l’axe réel. Régime critique.',a:F=>F.rng(0,1.5),d:5500},
{c:'λ = 2,6 : deux racines réelles, retour lent sans oscillation (apériodique).',a:F=>F.rng(0,2.6),d:5500},
{c:'λ = 0 : racines sur l’axe imaginaire, oscillation éternelle. λ < 0 : racines à droite, ça explose.',a:F=>F.rng(0,0),d:6000}]}];
L.stories.ma4=[
{sel:F('fubini'),steps:[
{c:'Triangle, tranches verticales : pour x fixé, y va de 0 à la droite y = 1 − x.',a:F=>{F.btn('triangle');F.btn('verticales');F.chk(0,true);},d:7000},
{c:'Tranches horizontales : pour y fixé, x va de 0 à 1 − y. Même résultat.',a:F=>F.btn('horizontales'),d:6000},
{c:'Entre y = x² et y = x : en vertical y va de x² à x ; en horizontal x va de y à √y.',a:F=>{F.btn('entre');},d:7000}]}];
L.stories.ma5=[
{sel:F('linmap'),steps:[
{c:'Identité : rien ne bouge. Les colonnes (1,0) et (0,1) restent les vecteurs de base. det = 1.',a:F=>F.btn('Identité'),d:5000},
{c:'Rotation de 90° : tout tourne, les aires sont conservées : det = 1.',a:F=>F.btn('Rotation'),d:5000},
{c:'Cisaillement : le carré penche mais garde la même aire (det = 1).',a:F=>F.btn('Cisaillement'),d:5000},
{c:'Symétrie : effet miroir, l’orientation s’inverse : det = −1.',a:F=>F.btn('Symétrie'),d:5000},
{c:'Colonnes proportionnelles : le plan est écrasé sur une droite. det = 0, pas d’inverse.',a:F=>F.btn('det = 0'),d:6000}]}];
L.stories.ma6=[
{sel:F('fseries'),steps:[
{c:'Créneau, N = 1 : le fondamental seul, une simple sinusoïde de même période.',a:F=>{F.btn('créneau');F.chk(0,false);F.rng(0,1);},d:5000},
{c:'N = 3 : on ajoute l’harmonique 3 (le créneau n’a que des harmoniques impaires). Les flancs se redressent.',a:F=>{F.rng(0,3);F.chk(0,true);},d:6000},
{c:'N = 40 : très proche du créneau… sauf le dépassement de Gibbs près des sauts.',a:F=>{F.chk(0,false);F.rng(0,40);},d:6000},
{c:'t² : signal continu, coefficients en 1/n² : quelques harmoniques suffisent.',a:F=>{F.btn('t²');F.rng(0,4);},d:6000}]}];
L.stories.ma7=[
{sel:F('ftrans'),steps:[
{c:'Porte de largeur 1 : son spectre est un sinus cardinal, premier zéro en λ = 1.',a:F=>{F.btn('porte');F.rng(0,1);},d:5500},
{c:'Porte large (a = 3) : spectre étroit et haut (f̂(0) = aire = 3).',a:F=>F.rng(0,3),d:5000},
{c:'Porte étroite (a = 0,3) : spectre très étalé. Un signal bref contient beaucoup de fréquences.',a:F=>F.rng(0,0.3),d:5500},
{c:'La gaussienne est sa propre transformée (à l’échelle près).',a:F=>{F.btn('gaussienne');F.rng(0,1);},d:5500}]},
{sel:F('improper'),steps:[
{c:'α = 2 : pousse la borne, l’aire se stabilise vers 1.',a:F=>{F.btn('+∞');F.rng(0,2);F.rng(1,1);},d:5500},
{c:'α = 1 : l’aire (ln X) grandit sans fin, même si lentement.',a:F=>F.rng(0,1),d:5000},
{c:'Près de 0, c’est l’inverse : α = 0,5 converge (vers 2).',a:F=>{F.btn('∫₀¹');F.rng(0,0.5);F.rng(1,1);},d:6000}]}];
L.stories.ma8=[
{sel:F('retard'),steps:[
{c:'Une rampe t·U(t) (tirets), d’image 1/p².',a:F=>{F.btn('rampe');F.rng(0,0);},d:4500},
{c:'On la retarde de 2 : elle démarre à t = 2. Image : e^(−2p)/p².',a:F=>F.rng(0,2),d:5500},
{c:'Même chose pour un sinus : le retard multiplie toujours par e^(−ap).',a:F=>{F.btn('sin');F.rng(0,1.5);},d:5500}]}];
})();
