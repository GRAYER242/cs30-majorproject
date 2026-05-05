// Traffic Flow
// Grayer Hardy
// 2/27/2026
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let cols = 20;
let rows = 20;
let cellSize = 30;

let grid = [];
let cars = [];
let houses = [];
let destinations = [];

let state = "menu";
let score = 0;

let spawnInterval = 600;
let minSpawnInterval = 240;

let globalTimer = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  initGrid();
}

function initGrid() {
  grid = [];
  cars = [];
  houses = [];
  destinations = [];
  score = 0;
  globalTimer = 0;
  spawnInterval = 600;

  for (let i = 0; i < cols; i++) {
    grid[i] = [];
    for (let j = 0; j < rows; j++) {
      grid[i][j] = {
        road: false,
        house: null,
        destination: null
      };
    }
  }
  createPairRandom();
  createPairRandom();
}

function draw() {
  background(240);

  if (state === "menu") {
    drawMenu();
  }
  else if (state === "playing") {
    updateGame();
    drawGrid();
    drawUI();
  }
  else if (state === "gameover") {
    drawGrid();
    drawGameOver();
  }
}

function updateGame() {
  globalTimer ++;

  if (globalTimer % spawnInterval === 0) {
    createPairRandom();
    spawnInterval = max(minSpawnInterval, minSpawnInterval - 10);
  }
  spawnCars();
  updateCars();
}

function drawMenu() {
  textAlign(CENTER, CENTER);
  textSize(40);
  fill(0);
  text("Traffic Flow", width / 2, height / 2 - 40);

  textSize(20);
  text("Click to Start", width / 2, height / 2 + 20);
}


