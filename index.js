const snakeBoard = document.getElementById('gameCanvas');
const snakeBoardCtx = snakeBoard.getContext('2d');
let snake = [{ x: 200, y: 200 }, { x: 190, y: 200 }, { x: 180, y: 200 }, { x: 170, y: 200 }, { x: 160, y: 200 }];
let dx = 10; // initial velocity for x direction -> currently moving right 10px per interval
let dy = 0; // initial velocity for y direction -> currently no up or down movement
let foodCoordinates;
let directionIsChanging; // boolean
let gameHasEnded = undefined;

function drawSnakePart(snakePart) { //draw one square 10x10 px
  snakeBoardCtx.fillStyle = 'lightblue';
  snakeBoardCtx.strokeStyle = 'darkblue';
  snakeBoardCtx.fillRect(snakePart.x, snakePart.y, 10, 10);
  snakeBoardCtx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

const food = {
  generateFoodCoordinates() { // random coordinates that are inside the board and not under the snake
    do {
      const fx = Math.round((Math.random() * (snakeBoard.width - 10)) / 10) * 10;
      const fy = Math.round((Math.random() * (snakeBoard.width - 10)) / 10) * 10;
      this.coordinates = { x: fx, y: fy };
    } while (snake.find((element) => JSON.stringify(element) === JSON.stringify(this.coordinates))); // if one snakepart has the same coordinates as foodcoordinates, do will run again, # JSON.stringify so we can compare two objects
    return this.coordinates;
  },
  placeFood(c) { // food is only one snakepart
    drawSnakePart(c);
  },
  hasSnakeEaten() { // if head of snake is over food, snake has heaten and we need new foodcoordinates to place food
    if (foodCoordinates.x === snake[0].x && foodCoordinates.y === snake[0].y) {
      foodCoordinates = this.generateFoodCoordinates();
      snake.unshift({ x: snake[0].x + dx, y: snake[0].y + dy }); // snake grows
    }
  },
};

function hasGameEnded() { // has snake collidet with itself? has snake hit a wall?
  for (let i = 4; i < snake.length; i += 1) { // i < 4 not neccessary because snake with 4 parts cannot hit itself
    const hasCollided = snake[i].x === snake[0].x && snake[i].y === snake[0].y;
    if (hasCollided) {
      return gameHasEnded = true;
    }
  }
  const hitLeftWall = snake[0].x < 0;
  const hitRightWall = snake[0].x > snakeBoard.width - 10;
  const hitTopWall = snake[0].y < 0;
  const hitBottomWall = snake[0].y > snakeBoard.height - 10;

  gameHasEnded = hitLeftWall || hitRightWall || hitBottomWall || hitTopWall;
}

function clearCanvas() {
  snakeBoardCtx.fillStyle = 'white';
  snakeBoardCtx.strokestyle = 'black';
  snakeBoardCtx.fillRect(0, 0, snakeBoard.width, snakeBoard.height);
  snakeBoardCtx.strokeRect(0, 0, snakeBoard.width, snakeBoard.height);
}

function drawSnake() {
  snake.forEach(drawSnakePart);
}

function moveSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head); // place head at beginning of snake array
  snake.pop(); // remove the last snakepart
}

foodCoordinates = food.generateFoodCoordinates();

function main() {
  hasGameEnded();
  if (gameHasEnded) return;
  directionIsChanging = false;
  setTimeout(() => {
    clearCanvas();
    moveSnake();
    food.placeFood(foodCoordinates);
    food.hasSnakeEaten();
    drawSnake();
    main();
  }, 100);
}

function changeDirection(event) {
  const leftKey = 37;
  const rightKey = 39;
  const upKey = 38;
  const downKey = 40;
  const keyPressed = event.keyCode;
  const goingUp = dy === -10;
  const goingDown = dy === 10;
  const goingRight = dx === 10;
  const goingLeft = dx === -10;

  if (directionIsChanging === true) { // very important, otherwise changeDirection could be run again before the last directionChange has finished, and the game would break.
    return;
  }
  directionIsChanging = true; // will be reset in main -> after this movement ends and before next movement begins

  if (keyPressed === leftKey && !goingRight) {
    dx = -10;
    dy = 0;
  }

  if (keyPressed === upKey && !goingDown) {
    dx = 0;
    dy = -10;
  }

  if (keyPressed === rightKey && !goingLeft) {
    dx = 10;
    dy = 0;
  }

  if (keyPressed === downKey && !goingUp) {
    dx = 0;
    dy = 10;
  }
}

(() => { //setup canvas and snake before game statrts
  clearCanvas();
  drawSnake();
})();

document.addEventListener('keydown', changeDirection);
document.addEventListener('keyup', (event) => { //start the game by pressing enter
  if (event.key === 'Enter') {
    if (gameHasEnded === undefined) { // for starting the game the first time
      gameHasEnded = false;
      main();
    } else if (gameHasEnded) { // for starting the game after gameover
      snake = [{ x: 200, y: 200 }, { x: 190, y: 200 }, { x: 180, y: 200 }, { x: 170, y: 200 }, { x: 160, y: 200 }];
      gameHasEnded = false;
      dx = 10;
      dy = 0;
      main();
    }
  };
})
