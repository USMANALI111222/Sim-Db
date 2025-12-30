#!/usr/bin/env node
// PRO X USMAN - FULL FEATURED SIM DATA TOOL
// Educational Purpose Only

const readline = require("readline");
const https = require("https");

const red = "\x1b[31m";
const green = "\x1b[32m";
const yellow = "\x1b[33m";
const cyan = "\x1b[36m";
const magenta = "\x1b[35m";
const reset = "\x1b[0m";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// ---------- CONFIG ----------
const PASSWORD = "1234"; // Change your password here
const API_URL = "https://professor-api-hub.xo.je/sim-data.php?num=";

// ---------- UTILS ----------
function clear() {
  process.stdout.write("\x1B[2J\x1B[0f");
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function spinner(text, duration = 1000) {
  return new Promise(async (resolve) => {
    const chars = ['|', '/', '-', '\\'];
    const start = Date.now();
    let i = 0;
    while (Date.now() - start < duration) {
      process.stdout.write(`\r${text} ${chars[i % chars.length]}`);
      i++;
      await sleep(100);
    }
    process.stdout.write("\r" + " ".repeat(text.length + 2) + "\r");
    resolve();
  });
}

// ---------- BANNER ----------
function banner() {
  console.log(red + `
===================================
          PRO X USMAN
           SIM DATA TOOL
===================================
` + reset);
}

// ---------- API FETCH ----------
function fetchData(num) {
  return new Promise((resolve, reject) => {
    https.get(API_URL + num, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          reject("Invalid API response");
        }
      });
    }).on("error", () => {
      reject("API request failed");
    });
  });
}

// ---------- LOGIN ----------
function login() {
  clear();
  banner();
  rl.question(yellow + "Enter Tool Password: " + cyan, async (pass) => {
    if (pass === PASSWORD) {
      console.log(green + "\nPassword correct!\n" + reset);
      await spinner("Loading", 1500);
      search();
    } else {
      console.log(red + "\nWrong password. Exiting..." + reset);
      rl.close();
    }
  });
}

// ---------- SEARCH ----------
async function search() {
  clear();
  banner();

  rl.question(yellow + "Enter Number / CNIC: " + cyan, async (num) => {
    console.log(green + "\nFetching data...\n" + reset);
    await spinner("Contacting API", 2000);

    try {
      const result = await fetchData(num);
      console.log(green + "========== RESULT ==========\n" + reset);
      for (const key in result) {
        console.log(`${cyan}${key}${reset} : ${green}${result[key]}${reset}`);
      }
      console.log(green + "\n============================\n" + reset);
    } catch (err) {
      console.log(red + "Error: " + err + reset);
    }

    menu();
  });
}

// ---------- MENU ----------
function menu() {
  console.log(yellow + "1) Search Another");
  console.log("0) Exit" + reset);

  rl.question(cyan + "Choose option: " + reset, (opt) => {
    if (opt === "1") {
      search();
    } else if (opt === "0") {
      console.log(red + "\nExiting...\n" + reset);
      rl.close();
    } else {
      menu();
    }
  });
}

// ---------- START ----------
login();