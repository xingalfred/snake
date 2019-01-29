// config
const CANVAS_COLOUR = "white";
const CANVAS_BORDER = "black";

const SNAKE_COLOUR = "lightgreen";
const SNAKE_BORDER = "green";

const FOOD_COLOUR = "red";
const FOOD_BORDER = "darkred";

var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
var w = canvas.width;
var h = canvas.height;

var cl = 10; // cell length

var dx = 10;
var dy = 0;

var score = 0;
var snakeLength = 5;
var snake;

initSnake();

createFood();
main();
document.addEventListener("keydown", changeDirection);

function main() {
  if (didGameEnd()) return;
  setTimeout(function onTick() {
    changingDirection = false;

    clearCanvas();
    drawFood();
    drawSnake();

    main();
  }, 50);
}

function initSnake() {
  snake = [];

  for (var i = snakeLength; i >= 0; i--) {
    snake.push({ x: i * cl, y: 0 });
  }
}

function advanceSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };

  snake.unshift(head);

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

  const LEFT_KEY = 37;
  const RIGHT_KEY = 39;
  const UP_KEY = 38;
  const DOWN_KEY = 40;

  const keyPressed = event.keyCode;

  const goingUp = dy === -10;
  const goingDown = dy === 10;
  const goingRight = dx === 10;
  const goingLeft = dx === -10;

  if (keyPressed === LEFT_KEY && !goingRight) {
    dx = -10;
    dy = 0;
  }
  if (keyPressed === UP_KEY && !goingDown) {
    dx = 0;
    dy = -10;
  }
  if (keyPressed === RIGHT_KEY && !goingLeft) {
    dx = 10;
    dy = 0;
  }
  if (keyPressed === DOWN_KEY && !goingUp) {
    dx = 0;
    dy = 10;
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
