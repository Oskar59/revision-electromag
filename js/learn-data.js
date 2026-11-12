/* ============ Contenu des composants d'apprentissage ============ */
(function(){
const r=String.raw;
const L=window.LEARN={maps:{},inject:[],predict:[],stories:{},guided:{}};
const img=(p,sel,title,html,w)=>L.inject.push({p,sel,w:w||'after',html:`<div class="card img"><span class="tag">🖼 Image mentale — ${title}</span>${html}</div>`});
const fig=(p,sel,anim,cap,w,cls)=>L.inject.push({p,sel,w:w||'after',html:`<figure class="anim ${cls||''}" data-anim="${anim}" data-badge><figcaption>${cap}</figcaption></figure>`});
const annot=(p,sel,title,tex,legend,sentence,w)=>L.inject.push({p,sel,w:w||'after',html:`<div class="annot" data-legend='${JSON.stringify(legend)}'><span class="tag">🎨 Formule décodée — ${title}</span>$$${tex}$$<div class="sentence"><b>En une phrase :</b> ${sentence}</div></div>`});
const pred=(p,sel,q,o,a,e)=>L.predict.push({p,sel,q,o,a,e});
const C=(s)=>r`\htmlClass{c${s}}`;

/* =================================================================== */
/*                         CARTES LOGIQUES                             */
/* =================================================================== */
L.maps.ch0={nodes:[
{t:'Dimensions',s:'#dims',d:'Avant tout calcul : chaque formule doit être homogène. C’est ton détecteur d’erreurs gratuit.',why:'pour décrire des grandeurs qui ont une direction, il faut plus qu’un nombre…'},
{t:'Vecteurs & produit scalaire',s:'#vec',d:'Le produit scalaire mesure « combien de A va dans la direction de B » (projection).',why:'…et parfois on a besoin d’une direction PERPENDICULAIRE à deux autres'},
{t:'Produit vectoriel',s:'#cross',d:'Donne la direction perpendiculaire (main droite). Il servira à la force magnétique.',why:'en EM, ces vecteurs existent en CHAQUE point de l’espace'},
{t:'Champs',s:'#champs',d:'Une valeur (scalaire) ou une flèche (vectoriel) en chaque point : carte des températures, carte des vents.',why:'pour décrire un champ simplement, on choisit des coordonnées qui collent à sa forme'},
{t:'Coordonnées adaptées',s:'#coords',d:'Plan → cartésiennes, axe → cylindriques, point → sphériques. dℓ, dS, dV changent avec.',why:'les lois s’écrivent sur de petits morceaux : il faut savoir comment une grandeur varie sur dx'},
{t:'Dérivées & 1ᵉʳ ordre',s:'#deriv',d:'f(x+dx) − f(x) ≈ f′(x)dx : l’outil de toutes les démonstrations « petit morceau ».',why:'la dérivée dans toutes les directions à la fois, c’est le gradient'},
{t:'Gradient',s:'#grad',d:'La pente d’un champ scalaire : direction de la montée la plus raide, ⟂ aux lignes de niveau.',why:'pour un champ vectoriel, deux questions restent : ce qui traverse et ce qui tourne'},
{t:'Flux & circulation',s:'#fluxcirc',d:'Flux = ce qui TRAVERSE une surface. Circulation = ce qui SUIT un chemin. Les 4 équations de Maxwell sont exactement ça.'}]};
L.maps.ch1={nodes:[
{t:'La charge',s:'#charge',d:'Deux signes, quantifiée, conservée. Trop nombreuses pour être comptées → densités λ, σ, ρ.',why:'deux charges s’attirent ou se repoussent : avec quelle force ?'},
{t:'Loi de Coulomb',s:'#coulomb',d:'F ∝ q₁q₂/r² : le signe décide attraction/répulsion, la distance dilue en 1/r².',why:'mais « action à distance » est gênant : on introduit un intermédiaire'},
{t:'Le champ E',s:'#champ',d:'La charge déforme l’espace (champ), l’autre charge réagit au champ là où elle est : F = q′E.',why:'avec plusieurs charges, les champs s’additionnent… mais les intégrales deviennent lourdes'},
{t:'Symétries',s:'#sym',d:'Avant tout calcul : invariances → variables ; plans de symétrie → direction. Il ne reste qu’UNE fonction E(r).',why:'un vecteur = 3 composantes ; un nombre serait plus simple'},
{t:'Le potentiel V',s:'#potentiel',d:'Un scalaire (une altitude) dont E est la pente descendante : E = −grad V. Tension = différence d’altitude.',why:'quand la symétrie est forte, il existe un raccourci énorme pour trouver E'},
{t:'Théorème de Gauss',s:'#gauss',d:'Le flux sortant d’une surface fermée = charges dedans / ε₀. Avec la symétrie : E en deux lignes.',why:'Gauss est global (une surface) ; pour décrire la propagation il faut une loi en chaque point'},
{t:'Divergence → Maxwell-Gauss',s:'#div',d:'div E = ρ/ε₀ : les charges sont les sources des lignes de champ.',why:'on a le flux ; reste la circulation'},
{t:'Rotationnel → Maxwell-Faraday statique',s:'#rot',d:'rot E = 0 : en statique, faire un tour ramène à la même altitude.',why:'et où est l’énergie ?'},
{t:'Énergie dans le champ',s:'#energie',d:'u = ½ε₀E² : l’énergie est stockée dans l’espace lui-même.'}]};
L.maps.ch2={nodes:[
{t:'Le métal : charges libres',s:'#equilibre',d:'Des électrons qui peuvent bouger. Si un champ existait dedans, ils bougeraient.',why:'donc à l’équilibre…'},
{t:'E = 0 dans le conducteur',s:'#equilibre',d:'Les électrons se placent jusqu’à annuler le champ intérieur. Conséquence : charges en surface, V uniforme.',why:'que vaut alors le champ juste à côté de la surface ?'},
{t:'Théorème de Coulomb',s:'#thcoulomb',d:'E = σ/ε₀, perpendiculaire à la surface (un seul côté laisse sortir le flux).',why:'deux conducteurs face à face avec +Q et −Q…'},
{t:'Condensateur : Q = CU',s:'#condensateur',d:'C ne dépend que de la géométrie. Méthode : Gauss → U = ∫E·dℓ → C = Q/U.',why:'si on MAINTIENT une tension, les charges ne s’arrêtent plus'},
{t:'Courant : i et j',s:'#courant',d:'j = nqv (une flèche en chaque point), i = flux de j. Les électrons dérivent à 0,07 mm/s !',why:'pourquoi la vitesse de dérive est-elle proportionnelle au champ ?'},
{t:'Drude : vitesse limite',s:'#ohm',d:'Force électrique + frottement des collisions = vitesse limite ⇒ j = σE.',why:'en intégrant sur un fil'},
{t:'U = Ri',s:'#ohm',d:'R = ρL/S : comme C, une propriété géométrique.'}]};
L.maps.ch3={nodes:[
{t:'Ørsted',s:'#oersted',d:'Un courant dévie une boussole : les charges EN MOUVEMENT créent un champ B.',why:'comment B agit-il sur une charge ?'},
{t:'Force de Lorentz',s:'#lorentz',d:'F = q(E + v∧B). La partie magnétique est ⟂ à v : elle courbe sans accélérer.',why:'sur un fil, on somme sur tous les électrons'},
{t:'Force de Laplace',s:'#laplace',d:'dF = i dℓ∧B : le moteur électrique.',why:'comme pour E, deux questions : le flux et la circulation de B'},
{t:'div B = 0',s:'#divb',d:'Pas de « charge magnétique » : les lignes de B se referment toujours.',why:'B ne jaillit pas… il TOURNE autour des courants'},
{t:'Théorème d’Ampère',s:'#ampere',d:'∮B·dℓ = μ₀ i_enlacé. Avec la symétrie (règles inversées !) : B en deux lignes.',why:'un circuit crée B, donc un flux à travers lui-même'},
{t:'Inductance',s:'#inductance',d:'Φ = Li : le pendant magnétique de Q = CU. Coax : (L/ℓ)(C/ℓ) = 1/c².'}]};
L.maps.ch4={nodes:[
{t:'Flux magnétique Φ',s:'#flux',d:'Nombre de lignes de B qui traversent le circuit (orientation par la main droite).',why:'si ce nombre CHANGE…'},
{t:'Fem induite (Faraday)',s:'#faraday',d:'e = −dΦ/dt : le circuit devient un générateur. Seule la variation compte.',why:'le signe − dit dans quel sens'},
{t:'Lenz',s:'#faraday',d:'Le courant induit s’oppose à la cause (la variation). La nature résiste au changement.',why:'un courant dans un champ B subit une force…'},
{t:'Force de Laplace qui freine',s:'#rails',d:'La force s’oppose au mouvement : il faut fournir un travail, converti en chaleur (P_méca = P_Joule).',why:'d’où vient physiquement la fem ?'},
{t:'Deux origines → rot E = −∂B/∂t',s:'#maxfar',d:'Circuit mobile : Lorentz. B variable : un E qui tourne apparaît. 2ᵉ équation de Maxwell complète.',why:'un circuit subit aussi son propre flux'},
{t:'Auto-induction & mutuelle',s:'#auto',d:'u_L = L di/dt (la bobine) ; e₂ = −M di₁/dt (transformateur).',why:'bobine + condensateur ensemble…'},
{t:'Oscillateur LC',s:'#lc',d:'L’énergie passe du champ E au champ B et revient : ω₀ = 1/√(LC).'}]};
L.maps.ch5={nodes:[
{t:'Le paradoxe',s:'#paradoxe',d:'Condensateur en charge : deux surfaces sur le même contour donnent deux courants enlacés différents.',why:'il manque quelque chose entre les armatures…'},
{t:'Courant de déplacement',s:'#deplacement',d:'Un E qui varie agit comme un courant : i_D = ε₀ dΦ_E/dt = i.',why:'on complète Ampère'},
{t:'Les 4 équations',s:'#ampmax',d:'2 champs × (flux, circulation). Tout l’EM tient là-dedans.',why:'loin de toute charge, que reste-t-il ?'},
{t:'Couplage E ↔ B',s:'#onde',d:'E variable → B variable → E variable… sans source. La perturbation se détache.',why:'en écrivant ça sur une onde plane'},
{t:'d’Alembert, c = 1/√(ε₀μ₀)',s:'#onde',d:'∂²E/∂z² = (1/c²)∂²E/∂t² : une onde à 3×10⁸ m/s. La lumière est électromagnétique.'}]};
L.maps.el1={nodes:[
{t:'Courant & tension',s:'#dipole',d:'Courant = débit de charges ; tension = différence de « pression » électrique. On les oriente AVANT de calculer.',why:'chaque composant relie u et i à sa façon'},
{t:'Les composants',s:'#composants',d:'Les sources IMPOSENT (u ou i), la résistance obéit à U = RI.',why:'en les branchant, deux principes de conservation s’appliquent'},
{t:'Kirchhoff',s:'#kirchhoff',d:'Nœuds : rien ne s’accumule (charge). Mailles : on revient à la même altitude (énergie). Avec Ohm : tout circuit est résoluble.',why:'mais résoudre un système à chaque fois, c’est long : des raccourcis'},
{t:'Diviseurs',s:'#diviseurs',d:'Série → la tension se partage ; parallèle → le courant se partage.',why:'pour un gros morceau de circuit, on peut tout résumer en 2 nombres'},
{t:'Thévenin / Norton',s:'#thevenin',d:'Vu de deux bornes, tout circuit = source + résistance. E_th à vide, R_th sources éteintes.',why:'plusieurs sources ? la linéarité permet de les traiter une par une'},
{t:'Superposition',s:'#superposition',d:'Somme des effets de chaque source seule.',why:'et pour la tension d’un nœud, une formule directe'},
{t:'Millman',s:'#millman',d:'U = Σ(E/R) / Σ(1/R) : la loi des nœuds déjà résolue.'}]};
L.maps.el2={nodes:[
{t:'C stocke de la charge, L stocke du courant',s:'#composants',d:'Ballon élastique (C) et roue lourde (L) : ils accumulent de l’énergie ½Cu², ½Li².',why:'une énergie ne peut pas changer instantanément…'},
{t:'Continuité',s:'#composants',d:'u_C et i_L ne sautent jamais. C’est ta condition initiale.',why:'on écrit les lois avec i = C du/dt ou u = L di/dt'},
{t:'Équation différentielle',s:'#methode',d:'Mailles + Ohm + loi du composant ⇒ τ y′ + y = y∞.',why:'sa solution est toujours la même forme'},
{t:'Exponentielle & τ',s:'#rc',d:'y = y∞ + (y₀ − y∞)e^(−t/τ). τ = RC ou L/R : 63 % à τ, 99 % à 5τ.',why:'avec un ballon ET une roue, l’énergie peut faire des allers-retours'},
{t:'RLC : 2ᵈ ordre',s:'#rlc',d:'r² + 2λr + ω₀² = 0 : selon Q, retour lent, critique ou oscillations amorties.'}]};
L.maps.el3={nodes:[
{t:'Sinusoïde = vecteur qui tourne',s:'#signal',d:'Amplitude = longueur, phase = angle. Déphasage = angle entre deux vecteurs.',why:'les vecteurs tournants se manipulent avec les complexes'},
{t:'Complexes : dériver = × jω',s:'#complexes',d:'L’équation différentielle devient une équation algébrique.',why:'du coup chaque composant a une « résistance complexe »'},
{t:'Impédances',s:'#complexes',d:'Z_R = R, Z_L = jLω, Z_C = 1/(jCω) — qui dépendent de la fréquence !',why:'et toutes les lois du chapitre 1 marchent avec Z'},
{t:'Fonction de transfert H(jω)',s:'#filtrage',d:'Sortie/entrée : |H| = gain, arg H = déphasage, pour chaque fréquence.',why:'comme Z dépend de ω, certaines fréquences passent et d’autres non'},
{t:'Filtres',s:'#filtrage',d:'BF : L = fil, C = ouvert ; HF : l’inverse. Passe-bas, haut, bande, coupe-bande.',why:'pour voir le comportement sur 6 décades, échelles log'},
{t:'Bode',s:'#bode',d:'G_dB = 20 log G vs log ω : des droites (asymptotes), coupure à −3 dB.'}]};

/* =================================================================== */
/*                IMAGES MENTALES + ANIMATIONS D'ANALOGIE              */
/* =================================================================== */
img('ch0','#cross','le tire-bouchon',r`<p>Tourne un tire-bouchon (ou une vis) du 1ᵉʳ vecteur vers le 2ᵉ : il <b>avance</b> dans la direction de $\vec u\wedge\vec v$. Inverse l'ordre, il recule. C'est toute la règle de la main droite.</p>`);
img('ch0','#fluxcirc','la pluie et la rivière',r`<p><b>Flux</b> : la pluie qui passe par une fenêtre. Fenêtre face à la pluie → beaucoup ; fenêtre de profil → rien ($\cos90°=0$). <b>Circulation</b> : tu marches le long d'un chemin dans une rivière ; elle mesure à quel point le courant te pousse <i>dans ton sens de marche</i>. Un tourbillon pousse tout le long d'un chemin circulaire.</p>`);
img('ch1','#champ','la carte des vents',`<p>Une charge ne « touche » pas l'autre. Elle crée une <b>météo invisible</b> autour d'elle (le champ). Une autre charge posée quelque part ressent le vent <i>de l'endroit où elle est</i>. Charge + = une source d'où souffle le vent ; charge − = un puits où il s'engouffre.</p>`);
img('ch1','#sym','le miroir',`<p>Pose un miroir sur un plan de symétrie : la distribution de charges est identique dans le miroir, donc le champ aussi. Or le miroir retourne toute flèche qui le traverse. Une flèche identique à son reflet ne peut pas traverser le miroir : elle est <b>couchée dedans</b>.</p>`);
img('ch1','#potentiel','le paysage',`<p><b>Le potentiel est une altitude.</b> Une charge + crée une colline, une charge − une cuvette. Le champ E est la <b>pente</b> (vers le bas) : une charge + lâchée dévale comme une bille, un électron « remonte » (pour lui le paysage est à l'envers). Les équipotentielles sont les lignes de niveau d'une carte de randonnée : la pente leur est toujours perpendiculaire.</p>`);
fig('ch1','#potentiel + .card.img','bille','<b>Manipule :</b> clique pour lâcher des billes sur le paysage. Elles suivent la ligne de plus grande pente = une ligne de champ. Passe en « électron » : elles remontent.','after','tall');
img('ch1','#gauss','l’ampoule dans l’abat-jour',`<p>Une ampoule dans un abat-jour fermé : la lumière totale qui sort ne dépend que des ampoules <b>à l'intérieur</b>, pas de la forme de l'abat-jour ni des lampes dehors (leur lumière entre d'un côté et ressort de l'autre). Plus l'abat-jour est grand, plus la lumière est diluée : c'est le $1/r^2$.</p>`);
img('ch1','#div','robinet et bonde',`<p>Mets un petit filet autour d'un point d'une rivière. S'il sort plus d'eau qu'il n'en entre, il y a un <b>robinet</b> (div > 0 : charge +). S'il en entre plus, une <b>bonde</b> (div &lt; 0 : charge −). Sinon l'eau ne fait que passer (div = 0 : vide).</p>`);
img('ch2','#equilibre','la foule qui s’écarte',`<p>Les électrons libres sont une foule. Tant que quelque chose les pousse (un champ), ils se déplacent. Ils s'arrêtent quand leur propre répartition crée une poussée exactement opposée : plus de champ à l'intérieur. Comme ils se repoussent entre eux, ils finissent tous <b>sur les bords</b>.</p>`);
img('ch2','#condensateur','le réservoir entre deux murs',r`<p>Deux plaques face à face, une chargée +, l'autre −, qui s'attirent à travers l'isolant. Plus la surface est grande, plus on peut entasser de charges ; plus les plaques sont proches, plus elles « se retiennent » mutuellement, donc il faut moins de tension pour en stocker autant : $C=\varepsilon_0S/e$.</p>`);
img('ch2','#courant','le tuyau déjà plein',`<p>Ouvre un robinet au bout d'un tuyau de 50 m déjà plein d'eau : l'eau sort <b>tout de suite</b>, alors qu'une molécule donnée met des minutes à parcourir le tuyau. C'est la pression (le champ) qui se propage vite, pas l'eau (les électrons).</p>`);
img('ch2','#ohm','la bille dans le miel',`<p>Lâche une bille dans un pot de miel : elle accélère un instant puis tombe à <b>vitesse constante</b> (poids = frottement). Un électron dans un métal fait pareil : la force électrique est compensée par les chocs, d'où une vitesse proportionnelle au champ : la loi d'Ohm.</p>`);
img('ch3','#lorentz','le volant',`<p>La force magnétique est comme quelqu'un qui tient le volant mais ne touche jamais à l'accélérateur : elle fait <b>tourner</b> la trajectoire, sans jamais changer la vitesse (travail nul).</p>`);
img('ch3','#ampere','le tourbillon',`<p>Le champ B d'un courant est un <b>tourbillon</b> autour du fil, comme l'eau autour d'un siphon. Le théorème d'Ampère dit : en faisant le tour, la « poussée cumulée » ne dépend que du courant qui passe <b>au milieu</b> du tour.</p>`);
img('ch3','#inductance','l’inertie',`<p>Une bobine est une <b>roue lourde</b> sur le circuit : difficile à lancer, difficile à arrêter. L'inductance L, c'est sa masse.</p>`);
img('ch4','#faraday','la nature est conservatrice',`<p>Lenz : quoi que tu fasses au flux, le circuit réagit pour <b>s'y opposer</b> — comme l'inertie s'oppose à un changement de vitesse. Approche un aimant : la spire le repousse. Éloigne-le : elle le retient. C'est le principe des <b>freins magnétiques</b> (camions, montagnes russes).</p>`);
img('ch5','#onde','les deux danseurs',`<p>E et B sont deux danseurs qui se relancent : quand l'un change, il fait naître l'autre (Faraday : B → E ; Ampère-Maxwell : E → B). Ils n'ont plus besoin de personne (ni charge ni courant) : le couple danse tout seul à travers le vide, à la vitesse c.</p>`);
img('el1','#dipole','l’eau dans les tuyaux',`<p>Garde cette image pour tout le cours : <b>tension = pression</b> (différence de hauteur d'eau), <b>courant = débit</b>, <b>résistance = tuyau étroit</b>, générateur = pompe, fil = gros tuyau. Un nœud est un carrefour de tuyaux : ce qui entre ressort.</p>`);
fig('el1','#dipole + .card.img','hydro','<b>Manipule :</b> mode « Résistance seule », allume la pompe. Rétrécis le tuyau (R) : le débit baisse immédiatement. C’est U = RI.');
img('el1','#kirchhoff','la randonnée en boucle',`<p><b>Mailles</b> : tu fais une randonnée en boucle ; les montées et les descentes s'annulent forcément puisque tu reviens à ton point de départ. <b>Nœuds</b> : à un carrefour de tuyaux, l'eau ne disparaît pas.</p>`);
img('el1','#diviseurs','deux étranglements',`<p>Deux tuyaux étroits l'un après l'autre se <b>partagent la chute de pression</b> : le plus étroit en prend le plus. Deux tuyaux côte à côte se <b>partagent le débit</b> : le plus large en prend le plus.</p>`);
img('el1','#thevenin','la pile qui fatigue',`<p>Toute source réelle est une pompe parfaite cachée derrière un tuyau étroit (sa résistance interne). Plus tu tires de débit, plus tu perds de pression dans ce tuyau : la tension baisse. Thévenin dit que <b>n'importe quel circuit</b>, vu de deux bornes, se comporte comme ça.</p>`);
img('el2','#composants','le ballon et la roue',`<p><b>Condensateur = ballon élastique</b> dans le tuyau : l'eau ne le traverse pas, elle le gonfle ; plus il est gonflé, plus il repousse. Gonflement = charge, repoussée = tension. Il ne peut pas se gonfler instantanément ⇒ $u_C$ continue.<br><b>Bobine = roue à aubes très lourde</b> dans le tuyau : longue à lancer, longue à arrêter ⇒ $i_L$ continu.</p>`);
fig('el2','#composants + .card.img','hydro','<b>Manipule :</b> essaie les 3 modes. Ballon : le débit démarre fort puis s’éteint (charge RC). Roue : le débit monte lentement, et continue quand on coupe la pompe (RL). LC : relâche le ballon gonflé et regarde l’eau osciller.','after','tall');
img('el2','#rlc','la balançoire',`<p>Un RLC est une balançoire : le condensateur est le « ressort » qui ramène vers l'équilibre, la bobine l'« inertie » qui fait dépasser l'équilibre, la résistance le <b>frottement</b>. Peu de frottement : ça oscille longtemps (Q grand). Beaucoup : ça revient doucement sans osciller.</p>`);
img('el3','#signal','la grande roue',`<p>Regarde une nacelle de grande roue de profil : sa hauteur monte et descend en sinusoïde. La sinusoïde est l'<b>ombre d'un mouvement circulaire</b>. Deux nacelles décalées sur la roue = deux sinusoïdes déphasées.</p>`);
img('el3','#complexes','j = un quart de tour',r`<p>Multiplier par $j$, c'est <b>tourner d'un quart de tour</b> (90°). Dériver une sinusoïde la décale d'un quart de période : c'est pour ça que dériver = multiplier par $j\omega$. Une bobine décale le courant de −90° par rapport à la tension, un condensateur de +90°.</p>`);
img('el3','#bode','l’égaliseur audio',`<p>Un filtre est un <b>égaliseur</b> : il règle le volume de chaque fréquence séparément. Le diagramme de Bode est la courbe de l'égaliseur : graves à gauche, aigus à droite, volume en dB vertical.</p>`);

/* =================================================================== */
/*                          FORMULES DÉCODÉES                          */
/* =================================================================== */
annot('ch1','#coulomb ~ .card.def','Coulomb',r`\vec F_{1\to2}=${C(1)}{\frac{1}{4\pi\varepsilon_0}}\,${C(2)}{q_1q_2}\,${C(3)}{\frac{1}{r^2}}\,${C(4)}{\vec u_{1\to2}}`,
[["c1","constante","Fixe l’intensité de l’interaction électrique dans le vide (≈ 9×10⁹). Le 4π est la surface de la sphère unité."],["c2","les sources","Plus les charges sont grandes, plus la force est forte. Le SIGNE du produit dit attraction (−) ou répulsion (+)."],["c3","la dilution","L’influence se répartit sur une sphère d’aire 4πr² : doubler la distance divise par 4."],["c4","la direction","Vecteur unitaire de 1 vers 2 : la force est portée par la droite qui joint les charges."]],
'« Deux charges s’influencent proportionnellement à leur produit, et cette influence se dilue comme la surface d’une sphère. »');
annot('ch1','#potentiel ~ .card.def','E et V',r`${C(1)}{\vec E}=${C(2)}{-}${C(3)}{\vec\nabla V}`,
[["c1","le champ","La force par unité de charge : la pente que ressent une charge +."],["c2","le signe moins","Le champ DESCEND le potentiel, comme une bille descend une pente."],["c3","le gradient","La pente MONTANTE de l’altitude V (direction et raideur)."]],'« Le champ électrique, c’est la pente descendante du paysage des potentiels. »','after');
annot('ch1','#gauss ~ .card.def','Gauss',r`${C(1)}{\oiint_S}\,${C(2)}{\vec E\cdot\mathrm d\vec S}=\frac{${C(3)}{Q_{int}}}{${C(4)}{\varepsilon_0}}`,
[["c1","surface fermée","On fait le bilan sur TOUTE une surface fermée (abat-jour)."],["c2","ce qui traverse","Sur chaque petit morceau : la part du champ qui sort (produit scalaire avec la normale extérieure)."],["c3","charges dedans","Uniquement les charges À L’INTÉRIEUR. Les autres entrent et ressortent."],["c4","constante","Convertit des coulombs en « quantité de champ »."]],'« Tout le champ qui sort d’une boîte fermée vient des charges qu’elle contient. »');
annot('ch2','#ohm ~ .card.def','Drude',r`\sigma=\frac{${C(1)}{n}\,${C(2)}{e^2}\,${C(3)}{\tau}}{${C(4)}{m}}`,
[["c1","nombre de porteurs","Plus il y a d’électrons libres par m³, plus le courant est grand."],["c2","charge au carré","Un e parce que la force est eE, un autre parce que chaque électron transporte e."],["c3","temps libre","Plus longtemps entre deux chocs, plus l’électron prend de vitesse."],["c4","inertie","Plus l’électron est lourd, moins il accélère."]],'« Un métal conduit bien s’il a beaucoup d’électrons libres, qui roulent longtemps entre deux chocs. »','after');
annot('ch3','#ampere ~ .card.def','Ampère',r`${C(1)}{\oint_\Gamma}\,${C(2)}{\vec B\cdot\mathrm d\vec\ell}=${C(3)}{\mu_0}\,${C(4)}{i_{enlacé}}`,
[["c1","contour fermé","On fait un tour complet."],["c2","ce qui pousse le long","La part de B dans le sens de marche, cumulée sur le tour."],["c3","constante","Perméabilité du vide (4π×10⁻⁷) : l’équivalent magnétique de 1/ε₀."],["c4","courant au milieu","Seuls les courants qui TRAVERSENT le tour comptent (avec leur signe)."]],'« Le tourbillon de B autour d’un chemin fermé mesure le courant qui passe au milieu. »');
annot('ch3','#lorentz ~ .card.def','Lorentz',r`\vec F=q\big(${C(1)}{\vec E}+${C(2)}{\vec v}\wedge${C(3)}{\vec B}\big)`,
[["c1","partie électrique","Existe même si la charge est immobile ; elle peut accélérer."],["c2","la vitesse","Pas de mouvement, pas de force magnétique."],["c3","le champ B","Le produit vectoriel rend la force ⟂ à v ET à B : elle courbe sans accélérer."]],'« Une charge est poussée par E, et déviée de côté par B si elle bouge. »');
annot('ch4','#faraday ~ .card.def','Faraday',r`${C(1)}{e}=${C(2)}{-}${C(3)}{\frac{\mathrm d\Phi}{\mathrm dt}}`,
[["c1","fem","Le « générateur » qui apparaît dans le circuit (en volts)."],["c2","Lenz","Le signe moins : la réaction s’oppose à la variation."],["c3","variation du flux","Seule la VITESSE de changement du nombre de lignes de B compte, pas sa valeur."]],'« Faire varier le flux à travers un circuit y crée une tension qui s’oppose à cette variation. »');
annot('ch5','#ampmax ~ .card.def','Ampère-Maxwell',r`\overrightarrow{\mathrm{rot}}\,\vec B=${C(1)}{\mu_0\vec j}+${C(2)}{\mu_0\varepsilon_0\frac{\partial\vec E}{\partial t}}`,
[["c1","les courants","Des charges qui bougent font tourner B (Ampère, Ch. 3)."],["c2","E qui varie","L’ajout de Maxwell : un champ électrique qui change fait AUSSI tourner B. Sans lui, pas de lumière."]],'« Le champ magnétique tourne autour des courants ET autour des champs électriques qui changent. »');
annot('ch5','#onde ~ p','d’Alembert',r`${C(1)}{\frac{\partial^2E}{\partial z^2}}=${C(2)}{\frac{1}{c^2}}\,${C(3)}{\frac{\partial^2E}{\partial t^2}}`,
[["c1","courbure dans l’espace","À quel point la forme de l’onde est « pliée » en un point."],["c2","vitesse au carré","Relie l’espace et le temps : c = 1/√(ε₀μ₀)."],["c3","accélération dans le temps","À quelle vitesse la valeur en ce point change de rythme."]],'« Là où l’onde est pliée, elle se met à bouger : la forme glisse à la vitesse c. »');
annot('el1','#diviseurs ~ .card.def','diviseur de tension',r`U_2=${C(1)}{E}\cdot\frac{${C(2)}{R_2}}{${C(3)}{R_1+R_2}}`,
[["c1","la chute totale","Toute la pression fournie par la pompe."],["c2","ma part","La résistance dont on veut la tension."],["c3","le total","La somme de toutes les résistances traversées par le MÊME courant."]],'« Chaque résistance prend une part de la tension proportionnelle à sa valeur. »');
annot('el1','#millman ~ .card.key','Millman',r`U=\frac{${C(1)}{\sum\frac{E_k}{R_k}}}{${C(2)}{\sum\frac{1}{R_k}}}`,
[["c1","ce que chaque branche « veut »","Chaque branche pousse le nœud vers sa tension E_k, avec une force 1/R_k."],["c2","le poids total","La somme des « forces de rappel » 1/R_k : c’est une moyenne pondérée."]],'« La tension du nœud est la moyenne des tensions des branches, pondérée par leur facilité à faire passer le courant. »');
annot('el2','#rc ~ p','équation du RC',r`${C(1)}{E}=${C(2)}{RC\frac{\mathrm du_C}{\mathrm dt}}+${C(3)}{u_C}`,
[["c1","la pompe","La tension imposée par le générateur."],["c2","la chute dans R","R×i, avec i = C du/dt : grande quand le condensateur se remplit vite."],["c3","ce qui est stocké","La tension du ballon déjà gonflé ; elle « repousse » la pompe."]],'« Ce que la pompe fournit se partage entre ce qui coule à travers R et ce qui est déjà stocké ; plus c’est stocké, moins ça coule. »','after');
annot('el2','#rlc ~ p','équation du RLC',r`${C(1)}{LC\frac{\mathrm d^2u_C}{\mathrm dt^2}}+${C(2)}{RC\frac{\mathrm du_C}{\mathrm dt}}+${C(3)}{u_C}=0`,
[["c1","inertie (L)","La roue lourde : elle refuse les changements brusques de courant."],["c2","frottement (R)","Dissipe l’énergie en chaleur à chaque passage."],["c3","rappel (C)","Le ballon gonflé repousse vers l’équilibre."]],'« Inertie + frottement + ressort : exactement l’équation d’une balançoire. »','after');
annot('el3','figure[data-anim=zfreq]','impédance du condensateur',r`Z_C=\frac{1}{${C(1)}{j}\,${C(2)}{C}\,${C(3)}{\omega}}`,
[["c1","quart de tour","Le courant est en avance de 90° sur la tension (on se divise par j)."],["c2","capacité","Gros condensateur = ballon très souple = passe facilement."],["c3","fréquence","Plus ça va vite, moins le ballon a le temps de se remplir : il laisse passer. ω → ∞ : fil."]],'« Un condensateur bloque le continu et laisse passer les hautes fréquences, avec un quart de tour de décalage. »','before');
annot('el3','#bode ~ .card.ex','passe-bas',r`\underline H=\frac{1}{1+${C(1)}{j}\,${C(2)}{x}},\quad x=\frac{\omega}{${C(3)}{\omega_c}}`,
[["c1","déphasage","Le j fait tourner : retard jusqu’à −90°."],["c2","fréquence réduite","Compare la fréquence du signal à celle du filtre."],["c3","coupure","1/RC : la fréquence où le condensateur commence à court-circuiter la sortie."]],'« Tant que x ≪ 1 tout passe ; quand x ≫ 1 le signal est divisé par x : −20 dB par décade. »','after');

/* =================================================================== */
/*                       PRÉDIS AVANT DE VOIR                          */
/* =================================================================== */
const F=s=>`figure[data-anim=${s}]`;
pred('ch0',F('dot'),'Si u est perpendiculaire à v, que vaut u·v ?',['0','‖u‖‖v‖','négatif'],0,'La projection de u sur v est nulle : rien de u « ne va » dans la direction de v.');
pred('ch0',F('gradient'),'Par rapport aux lignes de niveau, le gradient est…',['perpendiculaire','parallèle','à 45°'],0,'Le long d’une ligne de niveau f ne change pas : la pente est entièrement dans la direction perpendiculaire.');
pred('ch1',F('coulomb'),'On double la distance entre les deux charges. La force…',['est divisée par 4','est divisée par 2','ne change pas'],0,'Loi en 1/r² : (2r)² = 4r².');
pred('ch1',F('field'),'Les lignes de champ et les équipotentielles se croisent…',['à angle droit','en parallèle','au hasard'],0,'E est la pente : toujours ⟂ aux lignes de niveau.');
pred('ch1',F('ring'),'Que vaut le champ exactement au centre de l’anneau ?',['0','maximal','infini'],0,'Chaque morceau d’anneau est compensé par le morceau opposé.');
pred('ch1',F('gauss'),'Plan infini chargé : on s’éloigne deux fois plus. Le champ…',['ne change pas','est divisé par 2','est divisé par 4'],0,'L’aire utile de la boîte de Gauss ne grandit pas avec la distance.');
pred('ch1',F('divrot'),'Champ « Vortex 1/r » (comme B autour d’un fil) : hors du cœur, la roue tourne-t-elle sur elle-même ?',['Non','Oui, dans le sens du champ','Oui, à l’envers'],0,'Le champ est plus fort près du centre, ce qui compense exactement la courbure : rot = 0 hors du cœur.');
pred('ch2',F('conductor'),'On applique un champ extérieur à un métal. À l’équilibre, le champ à l’intérieur vaut…',['0','E_ext','2 E_ext'],0,'Les électrons se déplacent jusqu’à annuler le champ intérieur.');
pred('ch2',F('capacitor'),'À tension U fixée, on rapproche les plaques (e diminue). La charge stockée…',['augmente','diminue','ne change pas'],0,'C = ε₀S/e augmente, et Q = CU.');
pred('ch2',F('drude'),'On double τ (moins de collisions). La vitesse de dérive…',['double','est divisée par 2','ne change pas'],0,'v = eτE/m.');
pred('ch3',F('oersted'),'Très loin du fil, l’aiguille de la boussole indique…',['le champ terrestre','toujours le fil','rien'],0,'B du fil décroît en 1/r : loin, le champ terrestre domine.');
pred('ch3',F('larmor'),'On double la vitesse de la particule. La durée d’un tour…',['ne change pas','double','est divisée par 2'],0,'R double mais la vitesse aussi : T = 2πm/(|q|B).');
pred('ch3',F('ampere'),'On sort un fil du contour. La circulation de B…',['ne compte plus ce fil','ne change pas du tout','devient nulle'],0,'Seuls les courants enlacés comptent, même si B sur le contour dépend de tous les fils.');
pred('ch4',F('lenz'),'L’aimant (pôle N vers la spire) s’ÉLOIGNE. Le champ induit dans la spire pointe…',['dans le même sens que celui de l’aimant (il retient le flux)','contre le champ de l’aimant','nulle part'],0,'Le flux diminue : la spire le « retient » en créant un B dans le même sens.');
pred('ch4',F('rails'),'On double B. La force de freinage…',['est multipliée par 4','double','ne change pas'],0,'F = B²ℓ²v/R : un B pour la fem, un B pour la force de Laplace.');
pred('ch4',F('lc'),'Quand le condensateur est complètement déchargé, le courant est…',['maximal','nul','négatif et nul'],0,'Toute l’énergie est alors dans la bobine.');
pred('ch5',F('displacement'),'Entre les armatures d’un condensateur qui se charge, y a-t-il un champ B autour ?',['Oui','Non, aucune charge ne passe','Seulement à la fin'],0,'Le E qui croît crée B, comme un courant (courant de déplacement).');
pred('ch5',F('line'),'On augmente 𝓛 (l’inductance par mètre). L’impulsion va…',['moins vite','plus vite','aussi vite'],0,'v = 1/√(𝓛𝒞).');
pred('el1',F('divider'),'On branche une charge R_L sur la sortie du diviseur. U₂…',['diminue','augmente','ne change pas'],0,'R₂ devient R₂∥R_L, plus petite : sa part de tension baisse.');
pred('el1',F('thevenin'),'Si la charge vaut R_L = R_th, la tension à ses bornes vaut…',['E_th/2','E_th','0'],0,'Diviseur entre deux résistances égales.');
pred('el2','#composants + .card.img + figure','Pompe allumée, ballon vide : à l’instant même, le débit est…',['maximal','nul','moyen'],0,'Le ballon vide ne repousse pas encore : toute la pression sert à faire couler l’eau (i = E/R).');
pred('el2',F('rcrl'),'Charge RC : à t = τ, u_C a atteint…',['63 % de E','50 %','100 %'],0,'1 − e⁻¹ ≈ 0,63.');
pred('el2',F('rlc'),'On diminue R dans un RLC. Le circuit…',['oscille davantage','revient plus lentement sans osciller','ne change pas'],0,'Moins de frottement ⇒ Q augmente ⇒ oscillations.');
pred('el3',F('zfreq'),'Un condensateur en très haute fréquence se comporte comme…',['un fil','un circuit ouvert','une résistance fixe'],0,'|Z_C| = 1/(Cω) → 0.');
pred('el3',F('bode'),'Passe-bas du 1ᵉʳ ordre : bien au-delà de la coupure, chaque décade fait perdre…',['20 dB','3 dB','40 dB'],0,'H ≈ 1/(jx) : amplitude divisée par 10 par décade.');
pred('el3',F('square'),'Créneau 10× plus rapide que la coupure d’un passe-bas. La sortie ressemble à…',['un triangle','un créneau','des pics'],0,'Le filtre intègre : une constante intégrée donne une rampe.');

/* =================================================================== */
/*                     ANIMATIONS COMMENTÉES                           */
/* =================================================================== */
L.stories.el2=[
{sel:F('hydro'),steps:[
{c:'Mode « condensateur » : le ballon (membrane rose) est vide, la pompe est arrêtée. Rien ne coule.',a:F=>{F.btn('Condensateur');},d:4500},
{c:'On ferme l’interrupteur = on allume la pompe. Le ballon vide ne repousse pas : le débit démarre au MAXIMUM (i = E/R).',a:F=>{F.btn('Pompe');},d:5000},
{c:'Le ballon se gonfle (charge q ↑) et repousse de plus en plus : le débit s’effondre. C’est l’exponentielle de la charge RC.',d:6000},
{c:'Ballon plein : plus aucun débit. En continu, un condensateur chargé = circuit OUVERT.',d:5000},
{c:'Mode « bobine » : une roue lourde dans le tuyau. Pompe allumée : la roue démarre doucement — le courant monte progressivement (RL).',a:F=>{F.btn('Bobine');F.btn('Pompe');},d:6000},
{c:'On coupe la pompe : la roue continue sur sa lancée et pousse l’eau. Le courant d’une bobine ne peut pas s’arrêter net.',a:F=>{F.btn('Pompe');},d:6000},
{c:'Mode LC : on gonfle le ballon puis on le relâche. Il lance la roue, qui regonfle le ballon de l’autre côté… L’énergie oscille.',a:F=>{F.btn('LC');F.rng(0,0.1);},d:7000},
{c:'Ajoute de l’étranglement (R) : les oscillations s’amortissent. Voilà tout le RLC.',a:F=>{F.rng(0,0.5);F.btn('Gonfler');},d:7000}]},
{sel:F('rcrl'),steps:[
{c:'Charge d’un condensateur : à t = 0, $u_C$ part de 0 (il ne peut pas sauter).',a:F=>{F.btn('Circuit RC');F.btn('Charge');F.rng(0,100);F.rng(1,100);F.btn('Rejouer');},d:3500},
{c:'Le courant, lui, SAUTE à E/R : toute la tension est aux bornes de R puisque le condensateur est vide.',d:4500},
{c:'À t = τ = RC, 63 % de la charge. La tangente à l’origine (tirets) arrive à E exactement en τ.',d:5000},
{c:'On double R : τ double, la courbe garde la même forme, étirée dans le temps.',a:F=>{F.rng(0,200);F.btn('Rejouer');},d:5000},
{c:'Décharge : même exponentielle, à l’envers. Le courant change de signe : le condensateur rend l’énergie.',a:F=>{F.btn('Décharge');},d:5500},
{c:'Circuit RL : c’est le COURANT qui est continu et la tension de la bobine qui saute. Et τ = L/R : plus R est grand, plus c’est RAPIDE.',a:F=>{F.btn('Circuit RL');F.btn('Charge');},d:6500}]},
{sel:F('rlc'),steps:[
{c:'R = 20 Ω : très peu de frottement (Q ≈ 8). Le condensateur se décharge… et dépasse : oscillations dans l’enveloppe e^(−λt).',a:F=>F.rng(0,20),d:6000},
{c:'Les racines du polynôme (à droite) sont complexes : −λ ± jω. La partie réelle −λ amortit, la partie imaginaire ω fait osciller.',d:6000},
{c:'R = 316 Ω : régime critique. Racine double. Retour le plus rapide sans jamais dépasser.',a:F=>F.rng(0,316),d:6000},
{c:'R = 400 Ω : apériodique. Deux racines réelles, retour plus lent. Trop de frottement pour osciller.',a:F=>F.rng(0,400),d:6000}]}];
L.stories.el1=[{sel:F('thevenin'),steps:[
{c:'La droite violette est la « carte d’identité » de la source : à vide (I = 0) on lit E_th, en court-circuit (U = 0) on lit I_N.',a:F=>{F.rng(0,10);F.rng(1,20);F.rng(2,40);},d:5500},
{c:'La droite orange est la charge (U = R_L·I). Le point vert (intersection) est ce qui se passe réellement.',d:5000},
{c:'On augmente R_th (source « fatiguée ») : la pente devient raide, la tension chute dès qu’on tire du courant.',a:F=>F.rng(1,70),d:5500},
{c:'R_L = R_th : la charge reçoit la puissance maximale, et U = E_th/2.',a:F=>{F.rng(1,40);F.rng(2,40);},d:6000}]}];
L.stories.el3=[
{sel:F('bode'),steps:[
{c:'Passe-bas du 1ᵉʳ ordre, x ≪ 1 : la sortie (violet) est identique à l’entrée. Gain 0 dB, pas de déphasage.',a:F=>{F.btn('Passe-bas 1');F.rng(1,-1.5);},d:5000},
{c:'x = 1 (coupure) : amplitude divisée par √2 (−3 dB), retard de 45°. La vraie courbe passe 3 dB sous les asymptotes.',a:F=>F.rng(1,0),d:6000},
{c:'x = 10 : amplitude divisée par 10 (−20 dB), retard proche de 90°. Pente −20 dB/décade.',a:F=>F.rng(1,1),d:6000},
{c:'Passe-bande avec Q = 8 : seul un petit voisinage de x = 1 passe. Plus Q est grand, plus le filtre est sélectif.',a:F=>{F.btn('Passe-bande');F.rng(0,8);F.rng(1,0.05);},d:6500},
{c:'Pont de Wien : passe-bande très peu sélectif (Q = 1/3), gain max 1/3 ≈ −9,5 dB.',a:F=>{F.btn('Pont de Wien');F.rng(1,0);},d:6000}]},
{sel:F('square'),steps:[
{c:'Un créneau est une somme de sinusoïdes : le fondamental + harmoniques 3, 5, 7… de plus en plus petites.',a:F=>{F.btn('Passe-bas');F.rng(0,-1.4);},d:5000},
{c:'Créneau lent devant la coupure : toutes les harmoniques importantes passent, la sortie ressemble à l’entrée.',d:4500},
{c:'Créneau rapide (f ≈ 15 f₀) : le passe-bas intègre, la sortie devient un petit triangle.',a:F=>F.rng(0,1.2),d:6000},
{c:'Passe-haut avec un créneau lent : il dérive, on ne garde que les fronts : des pics.',a:F=>{F.btn('Passe-haut');F.rng(0,-1.3);},d:6000},
{c:'Passe-bande sélectif réglé sur le créneau : il ne garde que le fondamental, la sortie est une SINUSOÏDE.',a:F=>{F.btn('Passe-bande');F.rng(0,0);},d:6000}]}];
L.stories.ch1=[
{sel:F('gauss'),steps:[
{c:'Charge ponctuelle : quelle que soit la taille de la sphère, ce sont les MÊMES 16 lignes qui la traversent. Le flux est constant.',a:F=>{F.btn('Charge ponctuelle');F.rng(0,0.8);},d:5500},
{c:'On agrandit la sphère : son aire croît en r², les lignes sont plus espacées : E ∝ 1/r².',a:F=>F.rng(0,2.4),d:5500},
{c:'Fil infini : surface de Gauss = cylindre, aire latérale 2πrh, qui croît seulement en r : E ∝ 1/r.',a:F=>{F.btn('Fil infini');F.rng(0,1.2);},d:5500},
{c:'Plan infini : la boîte garde la même aire utile quelle que soit sa hauteur : E constant !',a:F=>{F.btn('Plan infini');F.rng(0,2);},d:6000}]},
{sel:F('field'),steps:[
{c:'Dipôle : les lignes (orange) partent du + et finissent sur le −. Les couleurs sont l’altitude V.',a:F=>{F.btn('Dipôle');F.chk(0,true);F.chk(1,true);},d:5500},
{c:'Les liserés sont les équipotentielles : regarde, les lignes de champ les coupent toujours à angle droit.',d:5500},
{c:'Deux charges + : elles se repoussent, et entre elles il y a un point où le champ s’annule (col entre deux collines).',a:F=>F.btn('Deux +'),d:6000},
{c:'Condensateur : entre les plaques, lignes parallèles et équipotentielles régulières → champ UNIFORME. Dehors, presque rien.',a:F=>F.btn('Condensateur'),d:6000}]},
{sel:F('ring'),steps:[
{c:'Chaque petit morceau dq crée un dE (orange) dirigé de lui vers M.',a:F=>F.rng(0,1.2),d:5000},
{c:'Le morceau diamétralement opposé crée un dE symétrique : leurs composantes perpendiculaires à l’axe s’annulent.',d:5500},
{c:'Il ne reste que la composante le long de l’axe (vert). C’est pour ça que E est axial.',d:5000},
{c:'Au centre (z = 0), même les composantes axiales s’annulent : E = 0.',a:F=>F.rng(0,0),d:5000},
{c:'Loin (z = 3R), l’anneau ressemble à un point : on retrouve Q/(4πε₀z²).',a:F=>F.rng(0,3),d:5000}]}];
L.stories.ch3=[{sel:F('ampere'),steps:[
{c:'Le contour violet entoure les fils A (+2) et B (−1). Les flèches montrent B sur le contour : il dépend de TOUS les fils.',a:F=>F.rng(0,110),d:5500},
{c:'Pourtant la circulation calculée vaut μ₀ × (2 − 1) : seuls les fils dedans comptent.',d:5500},
{c:'On inverse A : la circulation change de signe en conséquence.',a:F=>F.btn('Inverser A'),d:5000},
{c:'On agrandit le contour pour englober C : il compte maintenant aussi.',a:F=>{F.btn('Inverser A');F.rng(0,200);},d:5500}]}];
L.stories.ch4=[
{sel:F('lenz'),steps:[
{c:'L’aimant approche : le flux à travers la spire augmente.',a:F=>{F.btn('Va-et-vient');F.btn('pôle N');},d:4500},
{c:'Réaction : un courant induit crée un B (vert) OPPOSÉ à celui de l’aimant. La spire présente un pôle N à l’aimant : elle le repousse.',d:6000},
{c:'Quand l’aimant repart, le flux diminue : le B induit change de sens pour le retenir.',d:6000},
{c:'Courbes : e(t) = −dΦ/dt est maximale quand Φ varie le plus vite, nulle quand l’aimant s’arrête.',d:6000}]},
{sel:F('rails'),steps:[
{c:'Vitesse imposée : la barre balaie de la surface, le flux Bℓx augmente, une fem e = −Bℓv apparaît.',a:F=>{F.btn('Vitesse imposée');F.rng(0,1);},d:5500},
{c:'Le courant induit tourne dans le sens qui crée un B ⊙ (contre l’augmentation du flux ⊗).',d:5000},
{c:'Dans la barre, ce courant subit une force de Laplace OPPOSÉE à v : il faut pousser. Ce travail devient de la chaleur dans R.',d:6000},
{c:'Barre lancée puis libre : rien ne pousse plus, la force de Laplace la freine exponentiellement. C’est un frein magnétique.',a:F=>{F.btn('Barre lancée');F.btn('Lancer');},d:6500},
{c:'Double B : le freinage est 4 fois plus fort (B² dans la force).',a:F=>{F.rng(0,1.5);F.btn('Lancer');},d:6000}]}];
L.stories.ch5=[{sel:F('displacement'),steps:[
{c:'On charge le condensateur : un courant i circule dans le fil, B tourne autour.',a:F=>F.btn('Surface plate'),d:5000},
{c:'Surface plate S₁ : le fil la traverse, i_enlacé = i. Ampère (Ch. 3) fonctionne.',d:5000},
{c:'Surface « sac » S₂, sur le même contour : elle passe ENTRE les armatures. Aucune charge ne la traverse : i_enlacé = 0 ?!',a:F=>F.btn('sac'),d:6000},
{c:'Mais entre les armatures, E grandit. Maxwell : ε₀ dΦ_E/dt joue le rôle d’un courant, et il vaut exactement i. Paradoxe levé.',d:6500}]}];

/* =================================================================== */
/*                          TD GUIDÉS                                  */
/* =================================================================== */
const G=L.guided;
// ---- Physique TD1
G['td1#exo1']=[{q:'Deux forces en 1/r² entre les mêmes particules : par quoi commencer ?',o:['Écrire le rapport littéral F_e/F_G','Faire l’A.N. de chaque force','Chercher un angle'],a:0,e:'Le rapport élimine a₀ : il suffit d’une A.N.'},{q:'Après l’A.N., que faut-il ajouter ?',o:['Une phrase d’interprétation physique','Rien','Un schéma'],a:0,e:'« La gravitation est négligeable à l’échelle atomique » rapporte des points.'}];
G['td1#exo2']=[{q:'Première action ?',o:['Dessiner les deux forces sur la charge étudiée','Ajouter les normes','Utiliser Gauss'],a:0,e:'Le sens de chaque force (répulsive/attractive) décide de l’angle entre elles.'},{q:'Angle entre F_B→A (répulsive) et F_C→A (attractive) ?',o:['120°','60°','180°'],a:0,e:'Une s’éloigne de B, l’autre va vers C : 180° − 60°.'},{q:'Norme de la somme de deux forces F faisant 120° ?',o:['F','2F','F√3'],a:0,e:'2F cos(60°) = F.'}];
G['td1#exo3']=[{q:'Q1 : montrer E_θ = 0. Quel outil ?',o:['Un plan de symétrie passant par P','L’invariance par rotation','Gauss'],a:0,e:'Seul un plan de symétrie fixe une direction.'},{q:'Q3 : flux conservatif près de l’axe ?',o:['Pas de charge ⇒ div E = 0','E est uniforme','rot E = 0'],a:0,e:'Maxwell-Gauss avec ρ = 0.'},{q:'Q4 : bilan de flux sur le petit cylindre. Faces à considérer ?',o:['Latérale + les deux bases','Seulement la latérale','Seulement les bases'],a:0,e:'La différence entre les bases (E_z varie avec z) doit ressortir par le côté.'}];
G['td1#exo4']=[{q:'Symétrie sphérique : quelle méthode ?',o:['Gauss avec une sphère de rayon r','Superposition de coquilles','Coulomb direct'],a:0,e:'E = E(r) e_r, uniforme sur la sphère.'},{q:'Combien de zones ?',o:['Deux : r < R et r > R','Une seule','Trois'],a:0,e:'Q_int change de formule selon qu’on est dedans ou dehors.'},{q:'Pour V, que fixe la constante d’intégration ?',o:['La référence V(∞) = 0 puis la continuité en R','Rien, on la laisse','E(0) = 0'],a:0,e:'Référence pour la zone extérieure, continuité pour raccorder l’intérieure.'}];
G['td1#exo5']=[{q:'ρ dépend de r. Comment obtenir la charge ?',o:['Coquilles dq = ρ(r)4πr²dr puis intégrer','Q = ρ × 4/3 πR³','Gauss'],a:0,e:'On découpe là où ρ est uniforme.'},{q:'Référence imposée pour V ?',o:['V(O) = 0','V(∞) = 0','V(R) = 0'],a:0,e:'L’énoncé l’impose : V(∞) ne sera pas nul.'}];
G['td1#exo6']=[{q:'Un plan infini : surface de Gauss ?',o:['Une boîte qui traverse le plan','Une sphère','Un cylindre coaxial au plan'],a:0,e:'Deux faces parallèles au plan, flux 2ES.'},{q:'Deux plans ±σ ?',o:['Superposer les champs de chaque plan zone par zone','Refaire Gauss avec les deux plans dedans','Utiliser le potentiel'],a:0,e:'σ/2ε₀ chacun : ils s’ajoutent entre, s’annulent dehors.'}];
// ---- Physique TD2
G['td2#exo1']=[{q:'B relié à la Terre sous influence de A (+) : sa charge devient…',o:['négative','nulle','positive'],a:0,e:'La Terre fixe V = 0 ; les charges + s’en vont, les − restent retenues par A.'},{q:'Quand on remet l’écran et qu’on relie A à la Terre ?',o:['A se décharge, B garde sa charge, répartie uniformément','Les deux se déchargent','Rien ne change'],a:0,e:'Plus d’influence : A à la Terre ⇒ Q_A = 0 ; B isolé conserve sa charge.'}];
G['td2#exo2']=[{q:'Sphères concentriques : champ entre les armatures ?',o:['Gauss avec une sphère R₁ < r < R₂','Plan infini','Coulomb entre deux points'],a:0,e:'Seule l’armature intérieure est enfermée.'},{q:'Ensuite ?',o:['U = ∫E dr de R₁ à R₂, puis C = Q/U','C = ε₀S/e directement','Dériver E'],a:0,e:'Puis vérifier les cas limites.'}];
G['td2#exo3']=[{q:'Point de départ du modèle de Drude ?',o:['PFD sur UN électron (force électrique + frottement)','Loi d’Ohm U = RI','Gauss'],a:0,e:'m dv/dt = −eE − mv/τ.'},{q:'« Conductivité statique » signifie…',o:['régime permanent : dv/dt = 0','v = 0','τ → 0'],a:0,e:'Vitesse limite, puis j = n(−e)v.'}];
G['td2#exo4']=[{q:'Forme des lignes de courant dans la couronne ?',o:['Des cercles (on fait le tour)','Des rayons','Des droites horizontales'],a:0,e:'Le courant va d’une face de la fente à l’autre.'},{q:'Les anneaux élémentaires sont…',o:['en parallèle (même tension)','en série','ni l’un ni l’autre'],a:0,e:'On additionne les conductances.'}];
G['td2#exo5']=[{q:'Q1 : le courant de fuite traverse l’isolant…',o:['radialement : coquilles en SÉRIE','le long de x','en parallèle'],a:0,e:'dR = ρ dr/(2πr dx).'},{q:'Q2 : relation entre i(x), i(x+dx) et di_f ?',o:['Loi des nœuds : di_f = i(x) − i(x+dx)','di_f = 0','Ohm'],a:0,e:'Conservation de la charge sur la tranche.'},{q:'Q3 : combiner les 3 équations pour…',o:['une EDO du 2ᵈ ordre en U = V₁ − V₂','trois solutions indépendantes','une constante'],a:0,e:'U″ = U/δ², solution exponentielle bornée.'}];
// ---- Physique TD3
G['td3#exo1']=[{q:'Direction de B autour du fil ?',o:['Orthoradiale (⟂ au plan contenant le fil)','Radiale','Le long du fil'],a:0,e:'Règle inversée du pseudo-vecteur.'}];
G['td3#exo2']=[{q:'r < a : courant enlacé ?',o:['I r²/a² (fraction de l’aire)','I','0'],a:0,e:'j uniforme ⇒ proportionnel à l’aire enlacée.'},{q:'r > c avec la gaine ?',o:['0 (I − I)','I','2I'],a:0,e:'Le champ est confiné.'}];
G['td3#exo3']=[{q:'Contour d’Ampère pour le tore ?',o:['Un cercle d’axe Oz à l’intérieur du tore','Un rectangle à cheval','Une sphère'],a:0,e:'Il est traversé N fois par I.'},{q:'Flux à travers une spire : B est-il uniforme sur la section ?',o:['Non (1/r) : intégrer par bandes a dr','Oui','Il est nul'],a:0,e:'D’où le ln.'}];
G['td3#exo4']=[{q:'B à l’extérieur d’un solénoïde infini ?',o:['0','μ₀nI','μ₀I/2πr'],a:0,e:'Uniforme dehors et nul à l’infini ⇒ nul.'}];
G['td3#exo5']=[{q:'Équation de q(t) ?',o:['Maille : q/C + L d²q/dt² = 0','q = CU','Gauss'],a:0,e:'ω₀ = 1/√(LC).'},{q:'Pourquoi le courant continue quand C est vide ?',o:['La bobine s’oppose à la variation de i (inertie)','Il ne continue pas','Le condensateur recharge'],a:0,e:'Lenz / auto-induction.'}];
// ---- Électronique TD1
G['eltd1#exo1']=[{q:'Schéma 1 : I_A inconnu sur un nœud. Loi ?',o:['Loi des nœuds','Loi des mailles','Ohm'],a:0,e:'Entrants = sortants, d’après les flèches.'},{q:'Schéma 2 : U₆ inconnu dans une boucle. Loi ?',o:['Loi des mailles (ou marche des potentiels)','Loi des nœuds','Millman'],a:0,e:'Respecter le sens de chaque flèche.'}];
G['eltd1#exo2']=[{q:'Circuit 2 : avant de diviser…',o:['Regrouper R₅ ∥ R₆','Diviser directement entre R₄ et R₆','Utiliser Millman'],a:0,e:'Le diviseur n’est valable qu’entre résistances traversées par le même courant.'}];
G['eltd1#exo3']=[{q:'Tout est en parallèle entre deux rails. Stratégie ?',o:['Tout convertir en Norton et sommer les courants','Loi des mailles partout','Superposition'],a:0,e:'Les sources de courant en parallèle s’additionnent.'},{q:'La grande boucle de gauche, c’est…',o:['une seule branche : sommer fem et résistances','trois branches','un court-circuit'],a:0,e:'E = 80 V, R = 80 Ω.'}];
G['eltd1#exo4']=[{q:'C–D : un fil relie les deux points milieux. Conséquence ?',o:['Ils sont au même potentiel : on les fusionne','Rien','Le fil ne porte aucun courant'],a:0,e:'(10∥30) + (50∥30).'}];
G['eltd1#exo5']=[{q:'On cherche la tension d’un nœud relié à 4 branches. Outil ?',o:['Millman','Diviseur de tension','Thévenin'],a:0,e:'Une seule ligne.'}];
G['eltd1#exo6']=[{q:'Pour la contribution de I, la source E devient…',o:['un fil','un circuit ouvert','une résistance'],a:0,e:'Source de tension éteinte.'},{q:'Pour la contribution de E, la source I devient…',o:['un circuit ouvert','un fil','une source de tension'],a:0,e:'Source de courant éteinte.'},{q:'Avec E seule, le plus rapide ?',o:['Thévenin vu de P (E/2, R) puis une maille','Millman','Superposition encore'],a:0,e:'Puis U = R·i.'}];
G['eltd1#exo7']=[{q:'U_RT en fonction de E, R, R_T ?',o:['Diviseur de tension','Diviseur de courant','Millman'],a:0,e:'R et R_T en série.'}];
G['eltd1#exo8']=[{q:'Le voltmètre idéal impose…',o:['aucun courant entre les points milieux','une tension nulle','un court-circuit'],a:0,e:'Donc deux diviseurs indépendants.'},{q:'Pont équilibré ?',o:['R₁R₃ = R₂R₄','R₁ = R₂','R₁R₂ = R₃R₄'],a:0,e:'Produits en croix.'}];
// ---- Électronique TD2
G['eltd2#exo1']=[{q:'Condition initiale ?',o:['u_C(0⁺) = 0 (continuité)','i(0⁺) = 0','u_C(0⁺) = E'],a:0,e:'Le condensateur était déchargé.'},{q:'Courant maximal ?',o:['À t = 0⁺ : E/R','À t = τ','À l’infini'],a:0,e:'Toute la tension est sur R.'}];
G['eltd2#exo2']=[{q:'Grandeur continue ici ?',o:['Le courant dans L','La tension de L','Les deux'],a:0,e:'i(0⁺) = 0.'},{q:'Tension max aux bornes de L ?',o:['E, à t = 0⁺','0','E/2'],a:0,e:'La bobine bloque le courant au départ.'}];
G['eltd2#exo3']=[{q:'« Fermé depuis très longtemps » : la bobine est…',o:['un fil','un circuit ouvert','une source'],a:0,e:'Régime permanent continu ⇒ u = 0 et i = E/r.'},{q:'Après l’ouverture, quelle grandeur garde sa valeur ?',o:['i dans L','u','i dans r'],a:0,e:'Puis décharge dans la maille L–R, τ = L/R.'},{q:'Énergie dissipée dans R comparée à ½Li₀² ?',o:['Égale','Moitié','Double'],a:0,e:'Toute l’énergie magnétique part en chaleur.'}];
G['eltd2#exo4']=[{q:'Avant l’ouverture, le condensateur est…',o:['un circuit ouvert : u = E R/(R+r)','un fil : u = 0','chargé à E'],a:0,e:'Diviseur entre r et R.'},{q:'Après l’ouverture ?',o:['C se décharge dans R, τ = RC','C reste chargé','C se décharge dans r'],a:0,e:'r n’est plus dans le circuit.'}];
G['eltd2#exo5']=[{q:'Position 2 : quel circuit ?',o:['RLC série libre (r, L, C)','RC','RL'],a:0,e:'λ = r/2L, ω₀ = 1/√(LC).'},{q:'Q ≈ 82 : régime ?',o:['Pseudo-périodique très peu amorti','Apériodique','Critique'],a:0,e:'Q ≫ 1/2.'},{q:'Amplitude divisée par 10 ?',o:['e^(−λt) = 1/10','t = 10τ','t = 10T'],a:0,e:'t = ln10/λ.'}];
G['eltd2#exo6']=[{q:'Loi à écrire ?',o:['Loi des mailles avec i = C du_C/dt','Loi des nœuds','Millman'],a:0,e:'LCü + RCu̇ + u = u(t).'}];
G['eltd2#exo7']=[{q:'R, L, C en PARALLÈLE : loi à écrire ?',o:['Loi des nœuds, puis dériver','Loi des mailles','Diviseur'],a:0,e:'Même tension pour tous.'},{q:'Q d’un RLC parallèle ?',o:['R√(C/L)','(1/R)√(L/C)','RC'],a:0,e:'L’inverse du série : grande R = peu d’amortissement.'}];
G['eltd2#exo8']=[{q:'Circuit compliqué autour de C : stratégie ?',o:['Thévenin vu par C','Superposition dans le temps','Millman sur C'],a:0,e:'Puis τ = R_th C.'},{q:'Pour R_th, la source I₁ en série avec R₁ devient…',o:['ouverte : R₁ disparaît','un fil','R₁ seule'],a:0,e:'Source de courant éteinte.'}];
// ---- Électronique TD3
G['eltd3#exo1']=[{q:'La période se lit…',o:['entre deux maxima du MÊME signal','entre les maxima des deux signaux','sur l’axe vertical'],a:0,e:'20 ms ici.'},{q:'v₂ atteint son maximum après v₁ : v₂ est…',o:['en retard','en avance','en phase'],a:0,e:'Δφ = −2π t₁/T.'}];
G['eltd3#exo2']=[{q:'Associer des impédances…',o:['comme des résistances (série : somme ; parallèle : inverses)','toujours en somme','en multipliant'],a:0,e:'Puis simplifier les fractions.'}];
G['eltd3#exo3']=[{q:'u(t) aux bornes de C : outil ?',o:['Diviseur de tension en complexe','EDO','Millman'],a:0,e:'Puis module et argument.'}];
G['eltd3#exo4']=[{q:'Première simplification ?',o:['R ∥ R_u','C + R','Rien'],a:0,e:'Puis diviseur avec C.'}];
G['eltd3#exo5']=[{q:'Deux sources à ω et 2ω : méthode ?',o:['Superposition, une fréquence à la fois','Millman avec les deux','Additionner les complexes'],a:0,e:'Somme en temporel à la fin.'}];
G['eltd3#exo6']=[{q:'Nature du filtre (sortie sur R₀) ?',o:['Passe-bas : en HF, L est ouvert','Passe-haut','Passe-bande'],a:0,e:'H₀ = 1/2, ω_c = (R+R₀)/L.'},{q:'Créneau à 10 kHz (≫ f_c) : sortie ?',o:['Triangle (intégration)','Créneau','Pics'],a:0,e:'H ≈ H₀ω_c/(jω).'}];
G['eltd3#exo7']=[{q:'BF et HF pour R + (L ∥ C) ?',o:['BF : L court-circuite ; HF : C court-circuite ⇒ passe-bande','Passe-bas','Passe-haut'],a:0,e:'Forme 1/(1 + jQ(x − 1/x)).'},{q:'Créneau à f₀ dans un filtre de Q = 14 ?',o:['Sinusoïde (fondamental seul)','Triangle','Créneau'],a:0,e:'Amplitude 4u_em/π.'}];
G['eltd3#exo8']=[{q:'Sortie sur L, BF ?',o:['L = fil ⇒ u_s = 0 : passe-haut','passe-bas','passe-bande'],a:0,e:'H = jx/(1+jx).'},{q:'Charge R_L en sortie ?',o:['H change : gain HF R_L/(R+R_L), coupure déplacée','Rien','Le filtre devient passe-bas'],a:0,e:'On calcule toujours en sortie ouverte.'}];
G['eltd3#exo9']=[{q:'Forme visée pour H ?',o:['H₀/(1 + jQ(x − 1/x))','1/(1+jx)','jx/(1+jx)'],a:0,e:'Diviser haut et bas par 3jx : H₀ = Q = 1/3.'},{q:'Coupures ?',o:['|x − 1/x| = 3','x = 1/3 et 3','x = 1'],a:0,e:'x = (±3 + √13)/2.'}];
})();
