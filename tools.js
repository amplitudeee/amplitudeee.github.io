//--JAVASCRIPT--><!--JAVASCRIPT--><!--JAVASCRIPT--><!--JAVASCRIPT--><!--JAVASCRIPT--><!--JAVASCRIPT-->

//--DOM REFERENCING--------------------------------------------------------
const domElement = document.querySelector("p") // selects first p element
const allDomElement = document.querySelectorAll("p") // selects all "p" css elements 
const domElementById = document.getElementById("myId") // selects dom element by ID
const elementRefArray = document.getElementsByTagName('p') //returns array like object containing all the elements on the page of a given type

//--create new nodes
//grab reference to parent
const sect = document.querySelector("section");
//create new element
const para = document.createElement("p");
//add context
para.textContent = "We hope you enjoyed the ride.";
//append to new element
sect.appendChild(para);

//--add to existing nodes
//create the text
const text = document.createTextNode(" — the premier source for web development knowledge.",);
const linkPara = document.querySelector("p");//select the location to add to
linkPara.appendChild(text); //add to location

//--remove 
sect.removeChild(linkPara); //remove child not reference
linkPara.remove(); //remove based only on the reference
linkPara.parentNode.removeChild(linkPara); //old broswer remove

//--dynamically manipulate styles on document
.highlight {
  color: white;
  background-color: black;
  padding: 10px;
  width: 250px;
  text-align: center;
}
para.classList.add("highlight");

//--add button to list
const list = document.querySelector("ul")
const input = document.querySelector("input")
const button = document.querySelector("button")
button.addEventListener("click", (event) => {
  event.preventDefault();

  const myItem = input.value;
  input.value = "";

  const listItem = document.createElement("li");
  const listText = document.createTextNode("span");
  const listBtn = document.createElement("button");

  listItem.appendChild(listText);
  listItem.appendChild(listBtn);
  listText.textContent = myItem;
  listBtn.textContent = "Delete"
  list.appendChild(listItem)

  listBtn.addEventListener("click", () => {
    listItem.remove()
  })
})

//--EVENT HANDLERS----------------------------------------------------------------------------------
addEventListener()
removeEventListener()
const btn = document.querySelector("button");
btn.addEventListener("click", functionA)
btn.addEventListener("click", () => {

})
"click"   // When a mouse button is clicked on an element.
"dblclick" // When a mouse button is double-clicked on an element.
"mousedown" // When a mouse button is pressed down on an element.
"mouseup" // When a mouse button is released on an element.
"mouseover" // When the mouse pointer enters an element's area.
"mouseout" // When the mouse pointer leaves an element's area.
"mousemove" // When the mouse pointer moves while over an element.


// form validation
const form = document.querySelector("form");
const fname = document.getElementById("fname");
const lname = document.getElementById("lname");
const para = document.querySelector("p");

form.addEventListener("submit", (e) => {
  if (fname.value === "" || lname.value === "") {
    e.preventDefault();
    para.textContent = "You need to fill in both names!";
  }
});

//--CONDITIONALS------------------------------------------------------------------------------------
let shoppingDone = false;
let childAllowance;

if (shoppingDone === true) {
  childAllowance = 10;
} else {
  childAllowance = 5;
}

//--VARIABLES--------------------------------------------------------------------------------------
//--COMPARISON------------
let weightComparison = !(eleWeight > mouseWeight) // negate original comparison
let heightComparison = ostrichHeight > duckHeight // greater or less than
let pwdMatch = pwd1 === pwd2 // strict equality for strings
let pwdMatch = pwd1 !== pwd2 // inequality for strings
// ternary operator
condition ? run this code : run this code instead // ? is true : false
// with functions
select.value === "black" ? update("black", "white") : update("white", "black")

switch (expression) {
  case choice1:
    // run this code
    break;
  case choice2:
    // run this code instead
    break;
  // include as many cases as you like
  default:
    // actually, just run this code
    break;
}


//--LOOPS----------------------------------------------------------------------------------
for (const cat of cats) {
  console.log(cat);
}

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
.map(function)      // calls a function for every item in an array
.filter(function)   // calls a function for every item in an array and can return a boolean to a new array
const filtered = birds.filter(ageAbove10)  // returns an array of t/f birds above the age of 10
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

