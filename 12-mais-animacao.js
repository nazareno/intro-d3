
var scales = {};
var year = 2007;

// Left join dos dois jsons
joinTaxasDisciplinas = function(dadosTaxas, dadosDisciplinas){
  dadosTaxas.forEach(function(taxa){
    var resultado = dadosDisciplinas.filter(d => taxa.codigo_disciplina == d.codigo_disciplina);
    taxa.nome = (resultado[0] !== undefined) ? resultado[0].disciplina : null;
    taxa.semestre = (resultado[0] !== undefined) ? resultado[0].semestre : null;
    taxa.codigo_departamento = (resultado[0] !== undefined) ? resultado[0].codigo_departamento : null;
    taxa.pre_requisitos = (resultado[0] !== undefined) ? resultado[0].pre_requisitos.length : null;
    taxa.pos_requisitos = (resultado[0] !== undefined) ? resultado[0].pos_requisitos.length : null;
  })
}

// Agrega as informações por ano em vez de período
agregaPorAno = function(taxas_sucessos){
  return d3.nest()
    .key(d => d.codigo_disciplina)
    .key(d => Math.floor(d.periodo))
    .rollup(function(v){
      return {
        matriculados: d3.sum(v, w => w.total),
        aprovados: d3.sum(v, w => w.aprovados),
        codigo_disciplina: v[0].codigo_disciplina,
        nome: v[0].nome,
        codigo_departamento: v[0].codigo_departamento,
        pos_requisitos: v[0].pos_requisitos,
        pre_requisitos: v[0].pre_requisitos,
        periodo: Math.floor(v[0].periodo),
        taxa: (d3.sum(v, w => w.aprovados) / d3.sum(v, w => w.total))
      }
    })
    .object(taxas_sucessos.filter(x => x.codigo_disciplina !== 1109053))
}

// Dado um ano, retorna um array flat com as infos todas
var filtraUmAno = function(input, ano) {
  return d3.keys(input).map(d => input[d][ano])
};

// Para fazer o extent aninhado (num objeto depois do nest)
var getMinMax = function(input, attr) {
  var max = d3.max(d3.values(input), x => d3.max(d3.values(x), y => y[attr]));
  var min = d3.min(d3.values(input), x => d3.min(d3.values(x), y => y[attr]));
  return [min, max];
};

// Atualiza o desenho
var update = function(data, svg, scales, year) {
  var newData = filtraUmAno(data, year);

  // circulos
  var circulos = svg.selectAll("circle")
    .data(newData);

  circulos.enter()
      .append("circle")
    .merge(circulos)
      .transition().duration(500).delay((d,i) => i * 30)
      .attr("cx", d => scales.xSca(d.matriculados))
      .attr("cy", d => scales.ySca(d.taxa))
      .attr("r", d => scales.rSca(d.matriculados))
      .attr("id", d => d.codigo_disciplina)
      .attr("nome", d => d.nome)
      .attr("fill", d => scales.cSca(d.codigo_departamento))
      .attr("class", "circle");

  circulos.exit().remove();

  // ano
  d3.select(".year").text(year);

  // tooltips
  var textos = svg.selectAll(".tooltip_circulo")
    .data(newData, d => d.codigo_disciplina);
  textos.enter()
      .append("text")
    .merge(textos)
      .transition().duration(500).delay((d,i) => i * 25)
      .attr("x", d => scales.xSca(d.matriculados))
      .attr("y", d => scales.ySca(d.taxa))
      .attr("id", d => d.codigo_disciplina)
      .text(d => d.nome)
      .attr("class", "tooltip_circulo");
};

d3.queue()
    .defer(d3.json, "http://analytics.ufcg.edu.br/pre/ciencia_da_computacao_d_cg/taxa-sucesso")
    .defer(d3.json, "http://analytics.ufcg.edu.br/pre/ciencia_da_computacao_d_cg/disciplinas")
    .await(function(error, taxas, disciplinas){
  if (error) throw error;
  // console.log(taxas); // original data

  d3.select("#status").remove();

  // altera o array taxas
  joinTaxasDisciplinas(taxas, disciplinas)
  // console.log(taxas)

  var year = 2007;
  var agregada = agregaPorAno(taxas);
  newData = filtraUmAno(agregada, year);
  console.log(newData); // filtered data
  // vars -----------------------------------------------------------
  var margin = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 30
  };
  var width = 960 - margin.left - margin.right;
  var height = 500 - margin.top - margin.bottom;

  // min-max
  var xExtent = getMinMax(agregada, "matriculados");
  var yExtent = getMinMax(agregada, "taxa");
  var rExtent = getMinMax(agregada, "matriculados");
  var colorDomain = disciplinas.map(d => d.codigo_departamento);

  // scales
  var xScale = d3.scaleLinear()
    .domain(xExtent)
    .range([0, width]);
  var yScale = d3.scaleLinear()
    .domain([0, yExtent[1]])
    .range([height, 0]);
  var rScale = d3.scaleSqrt()
    .domain(rExtent)
    .range([0, 40]);
  var colorScale = d3.scaleOrdinal()
    .domain(colorDomain)
    .range(["Pink", "LightCyan", "Gainsboro", "Thistle", "MintCream", "LemonChiffon"]);

  scales = {
    xSca: xScale,
    ySca: yScale,
    rSca: rScale,
    cSca: colorScale
  };

  // axes
  var x = d3.axisBottom()
    .scale(xScale)
    .ticks(10, ".0f");
  var y = d3.axisLeft()
    .scale(yScale);

  // graph ----------------------------------------------------------
  // svg
  var svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

  // eixos
  var xAxis = svg.append("g")
    .call(x)
    .attr("transform", "translate(0, " + height + ")");
  var yAxis = svg.append("g")
    .call(y);

  // labels
  var xLabel = xAxis.append("text")
    .text("matriculados")
    .attr("class", "axis")
    .attr("transform", "translate(" + (width) + ", " + 0.5 * -margin.bottom + ")")
    .attr("text-anchor", "end");
  var yLabel = yAxis.append("text")
    .text("taxa de sucesso")
    .attr("class", "axis")
    .attr("transform", "translate(" + (margin.left * 0.75) + ", 0) rotate(-90)");
  var yrLabel = svg.append("text")
    .text(year)
    .attr("class", "year")
    .attr("transform", "translate(" + (width - 215) + ", " + (height - margin.bottom * 2.5) + ")")
  update(agregada, svg, scales, year);
  window.svg = svg;

  // para inspecionar elementos, debugar, etc., comente a próxima linha
  var interval = window.setInterval(function() {
    if (year > 2016) {
      year = 2006;
    }
    update(agregada, svg, scales, year);
    year++;
  }, 1500);
});


// var ccc = null;
// d3.json("http://analytics.ufcg.edu.br/pre/ciencia_da_computacao_d_cg/taxa-sucesso",
//         d => ccc = d);
//
// var disciplinas = null;
//
// d3.json("http://analytics.ufcg.edu.br/pre/ciencia_da_computacao_d_cg/disciplinas",
//         d => disciplinas = d.filter(x => x.semestre !== null));
//
// ccc.forEach(function(taxa){
//   var resultado = disciplinas.filter(d => taxa.codigo_disciplina == d.codigo_disciplina);
//   taxa.nome = (resultado[0] !== undefined) ? resultado[0].disciplina : null;
//   taxa.semestre = (resultado[0] !== undefined) ? resultado[0].semestre : null;
//   taxa.codigo_departamento = (resultado[0] !== undefined) ? resultado[0].codigo_departamento : null;
//   taxa.pre_requisitos = (resultado[0] !== undefined) ? resultado[0].pre_requisitos.length : null;
//   taxa.pos_requisitos = (resultado[0] !== undefined) ? resultado[0].pos_requisitos.length : null;
// })
