// Traffic Flow
// Grayer Hardy
// 4/16/2026
//
// Extra for Experts:
// - used continue
// - used null
// - used lerp
// - used filter
// - used BFS
// - removed default right click function
// - used manhattan principle

let cols, rows, cellSize;

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
  globalTimer++;

  if (globalTimer % spawnInterval === 0) {
    createPairRandom();
    spawnInterval = max(minSpawnInterval, spawnInterval - 30);
    globalTimer = 0;
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
  text("Score " + score, width / 2, height / 2 + 20);
  text("Click to Restart", width / 2, height / 2 + 60);
}

//----------------------GRID----------------------//

function drawGrid() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      stroke(200);
      fill(255);
      rect(i * cellSize, j * cellSize, cellSize, cellSize);

      if (grid[i][j].road) {
        fill(80);
        rect(i * cellSize, j * cellSize, cellSize, cellSize);
      }

      if (grid[i][j].house) {
        fill(grid[i][j].house);
        rect(i * cellSize + 6, j * cellSize + 6, 15, 15);
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

function drawUI() {
  fill(0);
  textSize(16);
  textAlign(LEFT, TOP);
  text("Score: " + score, 10, 10);
}


//----------------------INPUT----------------------//

function mousePressed() {
  if (state === "menu") {
    state = "playing";
    return;
  }

  if (state === "gameover") {
    initGrid();
    state = "playing";
    return;
  }

  if (mouseButton === LEFT) {
    placeRoad();
  }
  else if (mouseButton === RIGHT) {
    removeRoad();
  }
}

function mouseDragged() {
  if (state !== "playing") {
    return;
  }

  if (mouseButton === LEFT) {
    placeRoad();
  }
  else if (mouseButton === RIGHT) {
    removeRoad();
  }
}

function placeRoad() {
  let i = floor(mouseX / cellSize);
  let j = floor(mouseY / cellSize);

  if (i >= 0 && j >= 0 && i < cols && j < rows) {
    if (!grid[i][j].house && !grid[i][j].destination) {
      grid[i][j].road = true;
    }
  }
}

function removeRoad() {
  let i = floor(mouseX / cellSize);
  let j = floor(mouseY / cellSize);

  if (i >= 0 && j >= 0 && i < cols && j < rows) {
    if (!grid[i][j].house && !grid[i][j].destination) {
      grid[i][j].road = false;
    }
  }
}

document.oncontextmenu = () => false;

//----------------------HOUSES----------------------//

function createPairRandom() {
  let colors = [
    color(255, 0, 0),
    color(0, 0, 255),
    color(0, 200, 0),
    color(255, 150, 0),
  ];

  let col = random(colors);
  let attempts = 0;

  while (attempts < 250) {
    let hx = floor(random(cols));
    let hy = floor(random(rows));
    let dx = floor(random(cols));
    let dy = floor(random(rows));

    let houseCell = grid[hx][hy];
    let destCell = grid[dx][dy];

    let manhattan = abs(hx - dx) + abs(hy - dy);
    let tooClose = manhattan < 5;

    let valid = !tooClose && !houseCell.house && !houseCell.destination && !houseCell.road && !destCell.house && !destCell.destination && !destCell.road;

    if (!valid) {
      attempts++;
      continue;
    }

    if (!isReachable(hx, hy, dx, dy)) {
      attempts++;
      continue;
    }

    houseCell.house = col;
    houses.push({ x: hx, y: hy, col, timer: 0, queue: 0 });

    destCell.destination = col;
    destinations.push({ x: dx, y: dy, col });

    return;
  }
}

//----------------------REACHABILITY----------------------//

function isReachable(sx, sy, dx, dy) {
  let queue = [];
  let visited = {};

  queue.push({ x: sx, y: sy });

  while (queue.length > 0) {
    let current = queue.shift();
    let key = current.x + "," + current.y;
    
    if (visited[key]) {
      continue;
    }
    visited[key] = true;

    if (current.x === dx && current.y === dy) {
      return true;
    }
    
    let dirs = [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 }
    ];

    for (let d of dirs) {
      let nx = current.x + d.x;
      let ny = current.y + d.y;

      if (nx >= 0 && ny >= 0 && nx < cols && ny < rows) {
        let next = grid[nx][ny];
        if (!next.house && !next.destination) {
          queue.push({ x: nx, y: ny });
        }
      }
    }
  }
  return false;
}

//----------------------CARS----------------------//

function spawnCars() {
  for (let h of houses) {
    h.timer++;

    if (h.timer > 180) {
      h.timer = 0;
      h.queue++;

      if (h.queue > 6) {
        state = "gameover";
      }

      let path = findPath(h.x, h.y, h.col);
      if (path) {
        cars.push({
          path,
          step: 0,
          speed: 0.05,
          col: h.col,
          drawX: h.x * cellSize + 15,
          drawY: h.y * cellSize + 15
        });
        h.queue--;
      }
    }
  }
}

function updateCars() {
  for (let car of cars) {
    if (car.step >= car.path.length) {
      continue;
    }

    let target = car.path[car.step];

    let tx = target.x * cellSize + 15;
    let ty = target.y * cellSize + 15;

    car.drawX = lerp(car.drawX, tx, car.speed);
    car.drawY = lerp(car.drawY, ty, car.speed);

    if (dist(car.drawX, car.drawY, tx, ty) < 1) {
      car.step++;
    }
  }

  cars = cars.filter(car => {
    if (car.step >= car.path.length) {
      score++;
      return false;
    }
    return true;
  });
}

//----------------------PATHFINDING----------------------//

function findPath(sx, sy, col) {
  let queue = [];
  let visited = {};

  queue.push({ x: sx, y: sy, path: [] });

  while (queue.length > 0) {
    let current = queue.shift();
    let key = current.x + "," + current.y;

    if (visited[key]) {
      continue;
    }
    visited[key] = true;


    let cell = grid[current.x][current.y];

    if (cell.destination && cell.destination.toString() === col.toString()) {
      return current.path;
    }

    let dirs = [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 }
    ];

    for (let d of dirs) {
      let nx = current.x + d.x;
      let ny = current.y + d.y;

      if (nx >= 0 && ny >= 0 && nx < cols && ny < rows) {
        let next = grid[nx][ny];

        if (next.road || next.destination) {
          queue.push({
            x: nx,
            y: ny,
            path: [...current.path, { x: nx, y: ny }]
          });
        }
      }
    }
  }
}
