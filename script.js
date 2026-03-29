function copyShayari(id){

let text = document.getElementById(id).innerText;

navigator.clipboard.writeText(text);

alert("Shayari Copied!");

}

function shareWhatsApp(id){

let text = document.getElementById(id).innerText;

let message = text + " \n\nRead more 👉 https://atozdilkishayari.com";

let url = "https://api.whatsapp.com/send?text=" + encodeURIComponent(message);

window.open(url, "_blank");

}


function searchShayari(){

let input = document.getElementById("searchInput").value.toLowerCase();

let cards = document.querySelectorAll(".card");

cards.forEach(function(card){

let text = card.innerText.toLowerCase();

if(text.includes(input)){
card.style.display="";
}else{
card.style.display="none";
}

});

}