/* ============ Électronique ch. 4 (AOP) : carte logique, prédictions, animations commentées ============ */
(function(){
const L=window.LEARN=window.LEARN||{maps:{},inject:[],predict:[],stories:{},guided:{}};
const F=s=>`figure[data-anim=${s}]`;
const pred=(p,sel,q,o,a,e)=>L.predict.push({p,sel,q,o,a,e});
L.maps.el4={nodes:[
{t:'Besoin d’amplifier',s:'#intro',d:'Les composants passifs ne peuvent qu’atténuer. Il faut un composant actif, alimenté : l’AOP.',why:'que fait-il exactement ?'},
{t:'vs = A·ε (A énorme)',s:'#ideal',d:'Amplificateur de différence ; i₊ = i₋ = 0 ; sortie bornée par ±Vsat.',why:'avec un gain aussi énorme, il sature au moindre microvolt…'},
{t:'Contre-réaction',s:'#reaction',d:'Sortie ramenée sur v₋ : le montage se stabilise avec ε ≈ 0, donc v₊ = v₋.',why:'cette égalité donne une méthode universelle'},
{t:'Méthode : v₊ = v₋, i = 0',s:'#methode',d:'Diviseur / Millman au nœud v₋, puis isoler vs.',why:'on l’applique à chaque montage'},
{t:'Montages linéaires',s:'#lineaires',d:'Inverseur −R₂/R₁, non-inverseur 1 + R₂/R₁, sommateur, soustracteur, intégrateur, dérivateur.',why:'et SANS contre-réaction ?'},
{t:'Comparateurs',s:'#comparateurs',d:'La sortie bascule entre ±Vcc. Avec réaction positive : deux seuils (hystérésis) anti-bruit.',why:'mais un vrai AOP n’est pas parfait'},
{t:'Limites réelles',s:'#reel',d:'Saturation, déchet, courant max, offset, gain × bande = constante, slew rate.'}]};
pred('el4',F('aopmodel'),'A = 10⁵ et Vsat = 13 V. Pour quelle valeur de ε l’AOP sature-t-il déjà ?',['130 µV','13 mV','1,3 V'],0,'13 / 10⁵ = 1,3·10⁻⁴ V : une centaine de microvolts suffit.');
pred('el4',F('aopmontage'),'Inverseur avec R₂ = 2R₁ et Ve = 2 V crête. Vs vaut…',['−4 V crête (inversé)','+4 V crête','+6 V crête'],0,'Vs = −(R₂/R₁)Ve.');
pred('el4',F('comparator'),'Un signal bruité traverse lentement le seuil d’un comparateur simple. La sortie…',['bascule plusieurs fois de suite','bascule une seule fois','reste à 0'],0,'Chaque petite oscillation du bruit autour du seuil fait rebasculer : d’où l’hystérésis.');
pred('el4',F('gbw'),'On multiplie le gain du montage par 10. Sa bande passante…',['est divisée par 10','ne change pas','est multipliée par 10'],0,'G × BW = GBW constante.');
L.stories.el4=[{sel:F('aopmontage'),steps:[
{c:'Inverseur, R₂/R₁ = 2 : la sortie est deux fois plus grande et inversée (en opposition de phase).',a:F=>{F.btn('Inverseur');F.rng(0,10);F.rng(1,20);F.rng(2,2);},d:5500},
{c:'Non-inverseur : même rapport, mais gain 1 + 2 = 3 et pas d’inversion.',a:F=>F.btn('Non-inverseur'),d:5500},
{c:'On pousse le gain : la formule demande plus que 12 V… la sortie est ÉCRÊTÉE. C’est la saturation.',a:F=>F.rng(1,80),d:6000},
{c:'Suiveur : gain 1. Il ne sert pas à amplifier mais à ISOLER deux étages (il ne prend aucun courant à l’entrée).',a:F=>F.btn('Suiveur'),d:6000},
{c:'Sommateur : deux signaux s’additionnent (inversés). C’est une table de mixage.',a:F=>{F.btn('Sommateur');F.rng(1,10);},d:6000}]},
{sel:F('comparator'),steps:[
{c:'Comparateur simple avec du bruit : à chaque passage du seuil, la sortie bégaye.',a:F=>{F.btn('Comparateur simple');F.rng(0,0.8);},d:6000},
{c:'Hystérésis : deux seuils (vert pour monter, rouge pour descendre). Le bruit ne suffit plus.',a:F=>F.btn('Hystérésis'),d:6000},
{c:'Augmente R₁/R₂ : les seuils s’écartent (largeur 2·(R₁/R₂)·Vcc).',a:F=>F.rng(2,0.5),d:6000}]}];
})();
