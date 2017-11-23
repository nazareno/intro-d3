"use strict"
// Para carregar um script js no console do browser
var _loadScript = function(path){
  var script= document.createElement('script');
  script.type= 'text/javascript';
  script.src= path;
  document.head.appendChild(script);
}

//_loadScript('js/d3.v4.min.js');
_loadScript('https://d3js.org/d3.v4.min.js');


// Antes de começar a parte d3, algumas coisas úteis de js:
var dados = [
  {"quem" : "eu", "i" : 1, "valor" : 20},
  {"quem" : "eu", "i" : 2, "valor" : 30},
  {"quem" : "eu", "i" : 3, "valor" : 15},
  {"quem" : "adversário", "i" : 1, "valor" : 5},
  {"quem" : "adversário", "i" : 2, "valor" : 25},
  {"quem" : "adversário", "i" : 3, "valor" : 45}
]

dados.map((dado, indice) => dado.quem)


// Atalhos baseados em map() do d3
d3.max(dados, (d, i) => d.valor)
d3.min(dados, (d, i) => d.valor)
d3.mean(dados, (d, i) => d.valor)
d3.median(dados, (d, i) => d.valor)

d3.extent(dados, (d, i) => d.valor)

// filter também é util
dados.filter((d) => d.quem === "eu")
// junto:
d3.median(dados.filter((d) => d.quem === "eu"), d => d.valor)

// =============================
// ESCALAS
// =============================

// “Scales are functions that map from an input domain to an output range.”
// -Mike Bostocks

var escala_x = d3.scaleLinear()  // crie uma função de escala linear
                .domain([1, 5])  // de um domínio de 1 a 5
                .rangeRound([0, 100]); // para uma imagem de 0 a 100
                // rangeRound retorna sempre valores inteiros
                // isso e util porque nao existe o pixel 224.3
escala_x(1)
escala_x(2)
escala_x(5)

escala_x(-1)

var escala_x2 = escala_x.clamp(true)
escala_x2(-1) // limitamos a escala
escala_x2(10) // embaixo e em cima



// A escala tambem pode ser de cores
// por exemplo, uma escala continua:
var escala_x = d3.scaleLinear()  // crie uma função de escala linear
                .domain([0, 100])  // de um domínio de 1 a 5
                .range([, 100]); // para uma imagem de 0 a 100



