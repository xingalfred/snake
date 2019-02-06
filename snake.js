// config
const CANVAS_COLOUR = "white";
const CANVAS_BORDER = "black";

const SNAKE_COLOUR = "lightgreen";
const SNAKE_BORDER = "green";

const FOOD_COLOUR = "red";
const FOOD_BORDER = "darkred";

const LEFT_KEY = 37;
const UP_KEY = 38;
const RIGHT_KEY = 39;
const DOWN_KEY = 40;

var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
var w = canvas.width;
var h = canvas.height;

var cl = 10; // cell length

var dx = 10;
var dy = 0;

var direction;
var score;
var speed;

var snakeLength = 3;
var snake;

init();
document.addEventListener("keydown", changeDirection);

function main() {
  if (didGameEnd()) return;
  changingDirection = false;
  clearCanvas();
  drawFood();

  advanceSnake();
  drawSnake();
}

function init() {
  direction = "r";
  score = 0;
  speed = 100;

  initSnake();
  createFood();

  if (typeof loop != "undefined") clearInterval(loop);
  loop = setInterval(main, speed);
}

function initSnake() {
  snake = [];

  for (var i = snakeLength; i >= 0; i--) {
    snake.push({ x: i * cl, y: 0 });
  }
}

function advanceSnake() {
  var nx = snake[0].x;
  var ny = snake[0].y;

  if (direction == "l") {
    nx -= cl;
  } else if (direction == "u") {
    ny -= cl;
  } else if (direction == "r") {
    nx += cl;
  } else if (direction == "d") {
    ny += cl;
  }

  snake.unshift({ x: nx, y: ny });

  const didEatFood = snake[0].x === foodX && snake[0].y === foodY;
  if (didEatFood) {
    score += 10;
    document.getElementById("score").innerHTML = score;
    createFood();
  } else {
    snake.pop();
  }
}

function randomTen(min, max) {
  return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

function createFood() {
  foodX = randomTen(0, w - cl);
  foodY = randomTen(0, h - cl);

  snake.forEach(function isFoodOnSnake(part) {
    const foodIsOnSnake = part.x == foodX && part.y == foodY;
    if (foodIsOnSnake) createFood();
  });
}

function didGameEnd() {
  for (let i = 4; i < snake.length; i++) {
    const didCollide = snake[i].x === snake[0].x && snake[i].y === snake[0].y;

    if (didCollide) return true;
  }

  const hitLeftWall = snake[0].x < 0;
  const hitRightWall = snake[0].x > w - 10;
  const hitTopWall = snake[0].y < 0;
  const hitBottomWall = snake[0].y > h - 10;

  return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}

// keyboard controls
function changeDirection(event) {
  if (changingDirection) return;
  changingDirection = true;

  const keyPressed = event.keyCode;

  switch (keyPressed) {
    case LEFT_KEY:
      if (direction != "r") direction = "l";
      break;
    case UP_KEY:
      if (direction != "d") direction = "u";
      break;
    case RIGHT_KEY:
      if (direction != "l") direction = "r";
      break;
    case DOWN_KEY:
      if (direction != "u") direction = "d";
      break;
  }
}

// draw functions
function clearCanvas() {
  setRectStyle(CANVAS_COLOUR, CANVAS_BORDER);
  drawRect(0, 0, w, h);
}

function drawSnakePart(snakePart) {
  setRectStyle(SNAKE_COLOUR, SNAKE_BORDER);
  drawRect(snakePart.x, snakePart.y, cl, cl);
}

function drawSnake() {
  snake.forEach(drawSnakePart);
}

function drawFood() {
  setRectStyle(FOOD_COLOUR, FOOD_BORDER);
  drawRect(foodX, foodY, cl, cl);
}

// utiliy functions
function setRectStyle(fill, stroke) {
  ctx.fillStyle = fill;
  ctx.strokeStyle = stroke;
}

function drawRect(x, y, w, h) {
  ctx.fillRect(x, y, w, h);
  ctx.strokeRect(x, y, w, h);
}
