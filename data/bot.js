// bot.js
require('dotenv').config();

const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');

// 🔹 Read token from .env
const token = process.env.BOT_TOKEN;

if (!token) {
    console.error("❌ BOT_TOKEN missing in .env file");
    process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

// 🔹 Path to data folder
const dataFolder = __dirname;

// Load JSON
const dataFile = path.join(dataFolder, 'shayari.json');

if (!fs.existsSync(dataFile)) {
    console.error("❌ shayari.json file not found");
    process.exit(1);
}

const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));

// User states
let userState = {};
let lastShayari = {};
let favorites = {};

// Random function
function getRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
}

// 🔘 START command
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;

    const categories = Object.keys(data);
    const buttons = [];

    for (let i = 0; i < categories.length; i += 2) {
        let row = [];
        row.push(categories[i]);
        if (categories[i + 1]) row.push(categories[i + 1]);
        buttons.push(row);
    }

    buttons.push(["❤️ Favorites"]);

    bot.sendMessage(chatId, "❤️ Welcome to A To Z Dil Ki Shayari ❤️\nSelect a category:", {
        reply_markup: {
            keyboard: buttons,
            resize_keyboard: true
        }
    });
});

// 📩 MESSAGE handling
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (!text || text === "/start") return;

    // Favorites
    if (text.includes("Favorites")) {
        let fav = favorites[chatId] || [];
        if (fav.length === 0) {
            bot.sendMessage(chatId, "❌ No favorites yet");
        } else {
            for (let i = 0; i < fav.length; i += 5) {
                bot.sendMessage(chatId, fav.slice(i, i + 5).join("\n\n"));
            }
        }
        return;
    }

    // Category select
    if (data[text]) {
        userState[chatId] = text;
    }

    const category = userState[chatId];

    if (category && data[category] && data[category].length > 0) {
        let shayari = getRandom(data[category]);

        bot.sendMessage(chatId, shayari, {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "🔁 Next", callback_data: "next" },
                        { text: "❤️ Save", callback_data: "save" }
                    ]
                ]
            }
        });

        lastShayari[chatId] = shayari;
    }
});

// 🔘 BUTTON ACTION
bot.on("callback_query", (query) => {
    const chatId = query.message.chat.id;
    const action = query.data;
    const category = userState[chatId];

    if (action === "next" && category) {
        let shayari = getRandom(data[category]);

        bot.sendMessage(chatId, shayari, {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "🔁 Next", callback_data: "next" },
                        { text: "❤️ Save", callback_data: "save" }
                    ]
                ]
            }
        });

        lastShayari[chatId] = shayari;
    }

    if (action === "save") {
        let shayariToSave = lastShayari[chatId];

        if (!favorites[chatId]) favorites[chatId] = [];

        if (shayariToSave && !favorites[chatId].includes(shayariToSave)) {
            favorites[chatId].push(shayariToSave);
            bot.sendMessage(chatId, "❤️ Saved to Favorites");
        } else {
            bot.sendMessage(chatId, "❌ Already saved or nothing to save");
        }
    }

    bot.answerCallbackQuery(query.id);
});

// 🌅 Daily auto motivational shayari at 8 AM
cron.schedule('0 8 * * *', () => {
    console.log("⏰ Sending daily shayari...");

    Object.keys(userState).forEach(chatId => {
        if (data["Motivational Shayari"]) {
            let shayari = getRandom(data["Motivational Shayari"]);
            bot.sendMessage(chatId, "🌅 Good Morning:\n\n" + shayari);
        }
    });
});

console.log("✅ Bot is running...");