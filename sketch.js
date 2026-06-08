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
// - used sound which I hadnt done in previous assignments
// - made it so roads rotate depending on what they are attatched to


//----------------------GLOBAL VARIABLES----------------------//

// Grid setup
let cols;
let rows;
let cellSize;

// Game objects
let grid = [];
let cars = [];
let houses = [];
let destinations = [];

// State and score
let state = "menu";
let score = 0;
let highScore = 0;

// Pause
let paused = false;

// Audio toggle
let soundEnabled = true;

// Car spawning difficulty
let spawnInterval = 600;
let minSpawnInterval = 300;

// Timer
let globalTimer = 0;

// Sounds / audio
let carSound;
let pingSound;
let isCarSoundPlaying = false;

// Images / textures
let grassImg;
let roadImg;

// Menu timer
let gameStartFrame = 0;

//----------------------PRELOAD----------------------//

// Load media files before game starts
function preload() {
  grassImg = loadImage('grass.jpg');
  roadImg = loadImage('road.webp');
}

//----------------------SETUP----------------------//

function setup() {
  createCanvas(windowWidth, windowHeight);
  updateGridSize();
  initGrid();

  // Sound setup
  carSound = new Audio('car-running.mp3');
  pingSound = new Audio('destination-ping.mp3');

  carSound.loop = true;
  // Increasing volume
  carSound.volume = 1.0;
}

// Calculate rows / cols based on screen size
function updateGridSize() {
  cellSize = 30;
  cols = floor(windowWidth / cellSize);
  rows = floor(windowHeight / cellSize);
}

// Handle screen resizing
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateGridSize();
  initGrid();
}

//----------------------INIT----------------------//

// Reset all in game data to baseline values
function initGrid() {
  grid = [];
  cars = [];
  houses = [];
  destinations = [];
  score = 0;
  globalTimer = 0;
  spawnInterval = 600;
  paused = false;
  score = 0;
  gameStartFrame = frameCount;

  stopEngineAudio();

  // Create empty 2D grid tracking roads, houses, and goals
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
  // Spawn pair (house and destination) in grid
  createPairRandom();
}

//----------------------DRAW----------------------//

function draw() {
  image(grassImg, 0, 0, width, height);

  // Screen routing based on game state
  if (state === "menu") {
    drawMenu();
  }
  else if (state === "instructions") {
    drawInstructions();
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

// Physics, timers, and car mechanics updates
function updateGame() {

  if (paused) {
    return;
  }

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

// Render start screen
function drawMenu() {
  textAlign(CENTER, CENTER);
  textSize(40);
  fill(0);
  text("Traffic Flow", width / 2, height / 2 - 40);

  textSize(20);
  text("Click to Start", width / 2, height / 2 + 20);

  textSize(16);
  text("Press I for Instructions", width / 2, height / 2 + 40);
}

// Instructions / controls
function drawInstructions() {
  fill(0);
  textAlign(CENTER, CENTER);

  textSize(32);
  text("Instructions", width / 2, 120);

  textSize(18);

  text(
    "OBJECTIVE\n" +
    "Build roads connecting coloured houses\n" +
    "to their matching coloured destinations.\n\n" +

    "CONTROLS\n" +
    "Left Click: Place Road\n" +
    "Right Click: Remove Road\n" +
    "Click + Drag: Draw Continuously\n" +
    "Press P to Pause Throughout the Game\n" +
    "Press M to Mute Sounds\n\n" +

    "Cars deliver automatically when a path exists.\n" +
    "Keep house queues below 7 cars.\n\n" +

    "Press ESC to return to menu.",
    width / 2,
    height / 2
  );
}

// Render game over overlay
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

// Draw all visual layers (roads, buildings, targets, cars)
function drawGrid() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[i][j].road) {
        push();

        let centerX = i * cellSize + cellSize / 2;
        let centerY = j * cellSize + cellSize / 2;
        translate(centerX, centerY);

        if (isHorizontalRoad(i, j)) {
          rotate(HALF_PI);
        }

        imageMode(CENTER);
        image(roadImg, 0, 0, cellSize, cellSize);

        pop();
        imageMode(CORNER);
      }

      // Draw houses
      if (grid[i][j].house) {

        let houseData = houses.find(h => h.x === i && h.y === j);

        if (houseData && houseData.queue >= 5) {
          stroke(255, 0, 0);
          strokeWeight(3);
        }
        else {
          stroke(0);
          strokeWeight(1);
        }

        fill(grid[i][j].house);

        rect(i * cellSize + 6, j * cellSize + 6, 15, 15);

        noStroke();

        if (houseData) {
          fill(255);
          textSize(12);
          textAlign(CENTER, CENTER);
          text(houseData.queue, i * cellSize + 14, j * cellSize + 14);
        }
      }

      if (grid[i][j].destination) {
        fill(grid[i][j].destination);
        rect(i * cellSize + 5, j * cellSize + 5, 20, 20);
      }
    }
  }

  // Draw moving cars
  for (let car of cars) {
    fill(car.col);
    ellipse(car.drawX, car.drawY, 10);
  }
}

// Check adjacent tiles to orient road sprites correctly
function isHorizontalRoad(i, j) {
  if (i > 0 && grid[i - 1][j].road) {
    return true;
  }
  if (i < cols - 1 && grid[i + 1][j].road) {
    return true;
  }
  return false;
}

// Render the scores and timer overlay
function drawUI() {

  fill(0);

  textSize(25);
  textAlign(LEFT, TOP);

  text("Score: " + score, 10, 10);
  text("High Score: " + highScore, 10, 40);

  let survivalSeconds =
    floor((frameCount - gameStartFrame) / 60);

  text("Time: " + survivalSeconds + "s", 10, 70);

  if (paused) {
    fill(255, 0, 0);

    textSize(40);
    textAlign(CENTER, CENTER);

    text("PAUSED", width / 2, height / 2);
  }
}


//----------------------INPUT----------------------//

// Click detection for menus and drawing
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

// Click certain keys to access instructions, pause, and mute sounds
function keyPressed() {

  if (state === "menu" && (key === "i" || key === "I")) {
    state = "instructions";
  }

  if (state === "instructions" && keyCode === ESCAPE) {
    state = "menu";
  }

  if (state === "playing") {

    if (key === "p" || key === "P") {
      paused = !paused;
    }

    if (key === "m" || key === "M") {

      soundEnabled = !soundEnabled;

      if (!soundEnabled) {
        stopEngineAudio();
      }
    }
  }
}

// Continuous road editing when holding down mouse
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

// Place a road tile under the cursor
function placeRoad() {
  let i = floor(mouseX / cellSize);
  let j = floor(mouseY / cellSize);

  if (i >= 0 && j >= 0 && i < cols && j < rows) {
    if (!grid[i][j].house && !grid[i][j].destination) {
      grid[i][j].road = true;
    }
  }
}

// Erase a road tile under the cursor
function removeRoad() {
  let i = floor(mouseX / cellSize);
  let j = floor(mouseY / cellSize);

  if (i >= 0 && j >= 0 && i < cols && j < rows) {
    if (!grid[i][j].house && !grid[i][j].destination) {
      grid[i][j].road = false;
    }
  }
}

// Block the default browser context menu on right-click
document.oncontextmenu = () => false;

//----------------------HOUSES----------------------//

// Select and position a new matching pair on clear grid space
function createPairRandom() {
  let colors = [
    color(255, 0, 0),
    color(0, 0, 255),
    color(180, 0, 255),
    color(255, 150, 0),
  ];

  let col = random(colors);
  let attempts = 0;

  // Attempt loops to secure a valid, unblocked placement zone
  while (attempts < 250) {
    let hx = floor(random(cols));
    let hy = floor(random(rows));
    let dx = floor(random(cols));
    let dy = floor(random(rows));

    let houseCell = grid[hx][hy];
    let destCell = grid[dx][dy];

    let manhattan = abs(hx - dx) + abs(hy - dy);
    let tooClose = manhattan < 5;

    // Check if space is completely empty
    let valid = !tooClose && !houseCell.house && !houseCell.destination && !houseCell.road && !destCell.house && !destCell.destination && !destCell.road;

    if (!valid) {
      attempts++;
      continue;
    }

    // Verify a route is actually possible before placing
    if (!isReachable(hx, hy, dx, dy)) {
      attempts++;
      continue;
    }

    // Save pair data
    houseCell.house = col;
    houses.push({ x: hx, y: hy, col, timer: 0, queue: 0 });

    destCell.destination = col;
    destinations.push({ x: dx, y: dy, col });

    return;
  }
}

//----------------------REACHABILITY----------------------//

// Breadth-First Search (BFS) routing algorithm to verify path feasibility
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

// Manage house spawners and trigger loss if backlog is too high
function spawnCars() {
  for (let h of houses) {
    h.timer++;

    if (h.timer > 180) {
      h.timer = 0;
      h.queue++;

      // Lose condition (more than 6 cars waiting)
      if (h.queue > 6) {

        highScore = max(highScore, score);

        state = "gameover";
        stopEngineAudio();
      }

      // Try to find a player-built path to deploy car
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

// Update runtime loops and engine sound settings
function updateCars() {
  if (soundEnabled && cars.length > 0 && !isCarSoundPlaying) {
    carSound.play().catch(e => console.log("User interaction required first"));
    isCarSoundPlaying = true;
  }
  else if (cars.length === 0 && isCarSoundPlaying) {
    stopEngineAudio();
  }
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

  // Filter out cars that successfully arrived at their destinations
  cars = cars.filter(car => {
    if (car.step >= car.path.length) {
      score++;

      if (soundEnabled) {
        let instance = pingSound.cloneNode();
        instance.play();
      }

      return false;
    }
    return true;
  });
}

// Halts motor sound streams safely and resets state trackers
function stopEngineAudio() {
  if (carSound) {
    carSound.pause();
    carSound.currentTime = 0;
    carSound.src = "";
    carSound.load();
  }
  isCarSoundPlaying = false;
}

//----------------------PATHFINDING----------------------//

// Breadth-First Search (BFS) pathfinding engine to route cars over placed roads
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
