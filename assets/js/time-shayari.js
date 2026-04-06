// ====== CONFIG ======
const defaultCity = "Kolkata"; // default city agar user location deny kare
const weatherApiKey = "381fbe9ed0c0e34b785935fcf6aaad3"; // OpenWeatherMap API

// ====== LOAD SHAYARI ======
async function loadTimeShayari() {
    const now = new Date();
    const hour = now.getHours();

    let file = "";
    let title = "";

    document.body.classList.remove("morning","night");

    if(hour >= 5 && hour < 12){        // 5:00 to 11:59 => morning
        file="data/morning.json";
        title="Good Morning Shayari";
        document.body.classList.add("morning");
    } else if(hour >= 21 || hour < 3){ // 21:00-23:59 + 0:00-2:59 => night
        file="data/night.json";
        title="Good Night Shayari";
        document.body.classList.add("night");
    } else {                           // 12:00 to 20:59 => day
        document.getElementById("shayari-title").innerText="Welcome!";
        document.getElementById("shayari-text").innerText="Have a great day!";
    }

    // Load shayari only if morning/night
    if(file){
        try{
            const res = await fetch(file);
            const data = await res.json();
            let dayIndex = now.getDate();
            if(hour < 3) dayIndex -=1;
            const index = Math.abs(dayIndex) % data.length;

            document.getElementById("shayari-title").innerText = title;
            typeWriter(data[index], document.getElementById("shayari-text"));
        } catch(e){
            console.error("Shayari load error:",e);
            document.getElementById("shayari-text").innerText="Shayari not available";
        }
    }
}

// ====== TYPEWRITER ======
function typeWriter(text, el, speed=30){
    el.innerHTML="";
    let i=0;
    function typing(){
        if(i<text.length){
            el.innerHTML+=text.charAt(i);
            i++;
            setTimeout(typing,speed);
        }
    }
    typing();
}

// ====== CURSOR EFFECT ======
function addCursorEffect(){
    const el = document.getElementById("shayari-text");
    setInterval(()=>{ el.classList.toggle("cursor"); },500);
}

// ====== WEATHER ======
async function loadWeather(){
    const box = document.getElementById("weather-box");

    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(async (position)=>{
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            await fetchWeatherByCoords(lat, lon, box);
        }, async (error)=>{
            console.warn("Location denied or error:", error);
            await fetchWeatherByCity(defaultCity, box);
        });
    } else {
        await fetchWeatherByCity(defaultCity, box);
    }
}

async function fetchWeatherByCoords(lat, lon, box){
    try{
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${weatherApiKey}`);
        const data = await res.json();
        if(data.cod===200){
            box.innerHTML=`<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" style="width:30px;vertical-align:middle;"> ${data.name}: ${Math.round(data.main.temp)}°C, ${data.weather[0].description}`;
        } else {
            box.innerText="Weather unavailable";
        }
    } catch(e){
        console.error("Weather error:",e);
        box.innerText="Weather error";
    }
}

async function fetchWeatherByCity(city, box){
    try{
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${weatherApiKey}`);
        const data = await res.json();
        if(data.cod===200){
            box.innerHTML=`<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" style="width:30px;vertical-align:middle;"> ${city}: ${Math.round(data.main.temp)}°C, ${data.weather[0].description}`;
        } else {
            box.innerText="Weather unavailable";
        }
    } catch(e){
        console.error("Weather error:",e);
        box.innerText="Weather error";
    }
}

// ====== INIT ======
document.addEventListener("DOMContentLoaded",()=>{
    addCursorEffect();
    loadTimeShayari();
    loadWeather();                     // weather hamesha show kare
    setInterval(loadTimeShayari,60000); // shayari refresh every 1 min
    setInterval(loadWeather,300000);    // weather refresh every 5 min
});