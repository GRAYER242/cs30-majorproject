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

//----------------------SETUP----------------------//

function setup() {
  createCanvas(windowWidth, windowHeight);
  updateGridSize();
  initGrid();
}

function updateGridSize() {
  cellSize = 30;
  cols = floor(windowWidth / cellSize);
  rows = floor(windowHeight / cellSize);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateGridSize();
  initGrid();
}

//----------------------INIT----------------------//

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
}

//----------------------DRAW----------------------//

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

//----------------------GAMELOOP----------------------//

function updateGame() {
  globalTimer ++;

  if (globalTimer % spawnInterval === 0) {
    createPairRandom();
    spawnInterval = max(minSpawnInterval, minSpawnInterval - 10);
  }
  spawnCars();
  updateCars();
}

//----------------------MENU----------------------//

function drawMenu() {
  textAlign(CENTER, CENTER);
  textSize(40);
  fill(0);
  text("Traffic Flow", width / 2, height / 2 - 40);

  textSize(20);
  text("Click to Start", width / 2, height / 2 + 20);
}

function drawGameOver() {
  fill(0, 150);
  rect(0, 0, width, height);

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(40);
  text("GAME OVER", width / 2, height / 2 - 20);

  textSize(20);
  text("Score" + score, width / 2, height / 2 + 20);
  text("Click to Restart", width / 2, height / 2 + 60);
}

//----------------------GRID----------------------//

function drawGrid() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j ++) {
      stroke(200);
      fill(255);
      rect(i * cellSize, j * cellSize, cellSize, cellSize);

      if (grid[i][j].road) {
        fill(80);
        rect(i * cellSize, j * cellSize, cellSize, cellSize);
      }

      if (grid[i][j].house) {
        fill(grid[i][j].house);
        rect(i * cellSize + 15, j * cellSize + 15, 18);
      }

      if (grid[i][j].destination) {
        fill(grid[i][j].destination);
        rect(i * cellSize + 5, j * cellSize + 5, 20, 20);
      }
    }
  }

  for (let car of cars) {
    fill(car.col);
    ellipse(car.drawX, car.drawY, 10);
  }
}

//----------------------INPUT----------------------//