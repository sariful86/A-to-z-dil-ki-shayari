// MENU
function toggleMenu(){
let menu = document.getElementById("menuBox");
menu.style.display = (menu.style.display === "block") ? "none" : "block";
}

// CLICK OUTSIDE
document.addEventListener("click", function(e){
let menu = document.getElementById("menuBox");
let icon = document.querySelector("header span");

if(menu && !menu.contains(e.target) && !icon.contains(e.target)){
menu.style.display = "none";
}
});

// SEARCH CATEGORY
document.getElementById("searchInput").addEventListener("keyup", function(){
let val = this.value.toLowerCase();
let cards = document.querySelectorAll(".card");

cards.forEach(card=>{
let text = card.innerText.toLowerCase();
card.style.display = text.includes(val) ? "block" : "none";
});
});

// RANDOM SHAYARI
let allShayari = {};
let perPage = 26;

fetch("data/shayari.json")
.then(res=>res.json())
.then(data=>{
allShayari = data;
});

function generateRandomShayari(){

if(Object.keys(allShayari).length === 0){
alert("Loading...");
return;
}

let categories = Object.keys(allShayari);
let randomCategory = categories[Math.floor(Math.random()*categories.length)];
let arr = allShayari[randomCategory];

let randomIndex = Math.floor(Math.random()*arr.length);
let text = arr[randomIndex];

document.getElementById("randomText").innerText = text;

let pageNum = Math.floor(randomIndex / perPage) + 1;

let serialIndex = randomIndex % perPage;
let serialLetter = String.fromCharCode(65 + serialIndex);

document.getElementById("randomSource").innerText =
`Source: ${randomCategory} Page ${pageNum} (${serialLetter})`;

let link = document.getElementById("randomLink");
link.href = `shayari.html?cat=${randomCategory}&page=${pageNum}`;
link.style.display = "inline-block";
}