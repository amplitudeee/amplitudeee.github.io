//--JAVASCRIPT--><!--JAVASCRIPT--><!--JAVASCRIPT--><!--JAVASCRIPT--><!--JAVASCRIPT--><!--JAVASCRIPT-->

//--VARIABLES-----------------------------------------------------------------------------
//--COMPARISON
let weightComparison = !(eleWeight > mouseWeight) // negate original comparison
let heightComparison = ostrichHeight > duckHeight // greater or less than
let pwdMatch = pwd1 === pwd2 // strict equality for strings
let pwdMatch = pwd1 !== pwd2 // inequality for strings

// Convert string to number
const Number = Number(string); 

// Multiline string
const newline = `One day you finally knew // Multi Line String using \`
what you had to do, and began,`;
console.log(newline);

// String formatting(template literals), variables
const song = "Fight the Youth";
const score = 9;
const highestScore = 10;
const output = `I like the song ${song}. I gave it a score of ${
  (score / highestScore) * 100}%.`;

//--METHODS------------------------------------------------------------------------------------

// Variable Methods
const varname =  "mozilla";
varname.length()    // puts length in var
.toUpperCase()      // forces to upper
.toLowerCase()      // forces to lower
.includes("zilla")  // boolean result
.slice(1,4)         // ozi
.slice(2)           // zilla
.replace("moz", "van") // mozilla to vanilla
.replaceAll("moz", "van")
window.print()      // Can be used in a button to call windows print

// Document Methods
const listItem = document.createElement("li");
listItem.textContent = itemText;
list.appendChild(listItem);
document.getElementById("elementid").innerHTML //write into an HTML element
document.getElementById("elementid").innerHTML
document.getElementById("elementid").style.display='none'   // hides element id
document.getElementById("elementid").style.display='block'  // shows element id
document.getElementById('myImage').src='pic_bulboff.gif'    // changes image source
**document.write(5+6). // write into the HTML output, **this clears the entire file first**
window.alert(5 + 6).     // write into an alert box
console.log(5 + 6)       // write into the browser console

//--FUNCTIONS-------------------------------------------------------------------------------------
let errorParagraph = document.getElementById("error")
function purchase() {
    console.log("error");
    errorParagraph.textContent = "Something went wrong, please try again"}

//--ARRAYS----------------------------------------------------------------------------------------
// index of array element array.indexOf("Element")
const birds = ["Parrot", "Falcon", "Owl"];
console.log(birds.indexOf("Owl")); //  2

birds.push("Blue-Jay");             // Adding items with .push
birds.shift();                      // Removing the first item using .shift
birds.splice(index#, 1)             // Removing with splice: first arg is where to start and second is how many should be removed
arrayLength = cities.push("Blue-Jay"); // Finding length put using an assignment operator attached to a method call
console.log(arrayLength); // 3
doubled = numbers.map(doubleNumbers); // applies doubleNumbers function to every number in numbers array and assigns to new array
itemPrice = data.split(",");  // split array values/indexes at defined character with data.split("character") || e.g.(":")

for (const bird of birds) { // Accessing every item
    console.log(bird);
}

//--OBJECTS----------------------------------------------------------------------
const person = {
  name: ["Bob", "Smith"],
  age: 32,
  bio: function () {
    console.log(`${this.name[0]} ${this.name[1]} is ${this.age} years old.`);
  },
  bio() {                         // Same result as above different syntax
    console.log(`${this.name[0]} ${this.name[1]} is ${this.age} years old.`);
  },
  introduceSelf: function () {
    console.log(`Hi! I'm ${this.name[0]}.`);
  },
  introduceSelf() {               // Same result as above different syntax
    console.log(`Hi! I'm ${this.name[0]}.`);
  },
};

const person = {                  // Object in an Object
  name: {
    first: "Bob",                 // person.name.first; or person["name"]["first"]
    last: "Smith",                // person.name.last; or  person["name"]["last"]
  },
  dob: {
    month: "July",          
    day: "08",
    year: "1991",
  },
  status: "single",
};
