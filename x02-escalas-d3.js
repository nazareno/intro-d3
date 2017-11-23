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


// -- Domínio CONTÍNUO -> Imagem numérica CONTÍNUA --

var escala_x = d3.scaleLinear()  // crie uma função de escala linear
                .domain([1, 5])  // de um domínio de 1 a 5
                .rangeRound([0, 100]); // para uma imagem de 0 a 100
                // rangeRound retorna sempre valores inteiros
                // isso e util porque nao existe o pixel 224.3
escala_x(1)
escala_x(2)
escala_x(5)

escala_x(-1) // ops

var escala_x2 = escala_x.clamp(true)
escala_x2(-1) // limitamos a escala
escala_x2(10) // embaixo e em cima

// escalas lineares para numeros sao inversiveis
escala_x.invert(100)

// e a escala pode funcionar de cabeça para baixo
var escala_x3 = d3.scaleLinear()
                .domain([1, 10])
                .rangeRound([1000, 0])

[1, 5, 10].map(d => escala_x3(d))


// -- Domínio CONTÍNUO -> Escala de cores CONTÍNUO --

// A escala tambem pode ser de cores
// por exemplo, uma escala continua:
var escala_cor = d3.scaleLinear()
                .domain([0, 10])
                .range(["white", "orange"])
                .clamp(true);

escala_cor(0)
escala_cor(5)
escala_cor(10)


// -- Domínio CATEGÓRICO -> Imagem numérica DISCRETA --

// E a escala pode ser de um domínio categórico para
// um numérico
var escala_posicao = d3.scaleBand()
                .domain(["A", "B", "C"])
                .range([0, 100]);

["A", "B", "C"].map(d => escala_posicao(d))

