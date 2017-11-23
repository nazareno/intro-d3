/*
 * Experimente com os trechos de código abaixo no console do navegador
 * para entender mais javascript
 */
"use strict"

// =========================================
// PARTE 1 : referências para funções
// =========================================
// funções podem ter nome
function funcaoConvencional(){
    console.log("Funções são camelCase em js")
}

// mas podemos referenciar uma função anônima via variável
f1 = function(a){ console.log(a + "!!!")}
f1("olar")

// Uma função pode retornar uma função
f2 = function(a){
  return function(b){ // o retorno de f2 é uma função
    console.log(a + " " + b + "!!!");
  }
}

fi = f2("olar")
fi
fi("você")
fi("você também")

// Mais útil:
sobre = function(denominador){
  return function(numerador){
    console.log(numerador / denominador);
  }
}

sobre10 = sobre(10)
sobre10(5)


/* PERGUNTA:
 * Como seria se eu quisesse criar uma função que cria funções
 * que transformam valores que acontecem nos meus dados para
 * coordenadas nos 500 pixeis do meu eixo x?
 */

// =========================================
// PARTE 2 : funções como parâmetros
// =========================================

// Uma função também pode receber uma função
f3 = function(f, a){
  f(a);
}

f3(console.log, "uma mensagem")

// Não precisamos da variável para referenciar em alguns casos.
// Em vez de :
fe = function(b){
  console.log(b + "!!!")
}
f3(fe, "uma mensagem")

// podemos fazer
f3(function(b){ console.log(b + "!!!") }, "uma mensagem")
// ou, mais bonito:
f3(b => { console.log(b + "!!!") }, "uma mensagem")

// caso quiséssemos dois parâmetros:
f4 = function(f, a, b){
  f(a, b);
}
f4( (x,y) => { console.log(x + " " + y + "!!!") }, "outra", " mensagem")


// =========================================
// PARTE 3 : Alguns lembretes de sintaxe
// =========================================
// baseado em https://learnxinyminutes.com/docs/javascript/

// sobre igualdades
1 === 1;   // true
2 === 1;   // false
1 === "1"; // false
1 == "1";  // true
1 == 2;  // false

// comprimento é uma propriedade, e não um método
"Sem parêntese".length;

// Variables are declared with the `var` keyword. JavaScript is dynamically
// typed, so you don't need to specify type. Assignment uses a single `=`
// character.
var someVar = 5;

// If you leave the var keyword off, you won't get an error...
someOtherVar = 10;
// ...but your variable will be created in the global scope, not in the scope
// you defined it in.

// Arrays are ordered lists of values, of any type.
var myArray = ["Hello", 45, true];

// Their members can be accessed using the square-brackets subscript syntax.
// Array indices start at zero.
myArray[1]; // = 45

// Arrays are mutable and of variable length.
myArray.push("World");
myArray.length; // = 4

// Add/Modify at specific index
myArray[3] = "Hello";

// JavaScript's objects are equivalent to "dictionaries" or "maps" in other
// languages: an unordered collection of key-value pairs.
var myObj = {key1: "Hello", key2: "World"};

// Keys are strings, but quotes aren't required if they're a valid
// JavaScript identifier. Values can be any type.
var myObj = {myKey: "myValue", "my other key": 4};

// Object attributes can also be accessed using the subscript syntax,
myObj["my other key"]; // = 4

// ... or using the dot syntax, provided the key is a valid identifier.
myObj.myKey; // = "myValue"

// Objects are mutable; values can be changed and new keys added.
myObj.myThirdKey = true;

// If you try to access a value that's not yet set, you'll get undefined.
myObj.myFourthKey; // = undefined

// Array de objetos
var moodLog = [
  {
    date: "10/20/2012",
    mood: "catnipped"
  },
  {
    date: "10/21/2012",
    mood: "nonplussed"
  },
  {
    date: "10/22/2012",
    mood: "purring"
  }
]
