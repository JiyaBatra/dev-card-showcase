const gameArea = document.getElementById("gameArea");
const player = document.getElementById("player");
const scoreDisplay = document.getElementById("score");

let playerX = 125;
let score = 0;
let speed = 3;
let enemies = [];

document.addEventListener("keydown", moveCar);

function moveCar(e) {
  if (e.key === "ArrowLeft" && playerX > 0) {
    playerX -= 20;
  }
  if (e.key === "ArrowRight" && playerX < 250) {
    playerX += 20;
  }
  player.style.left = playerX + "px";
}

function createEnemy() {
  const enemy = document.createElement("div");
  enemy.classList.add("enemy");
  enemy.style.left = Math.floor(Math.random() * 5) * 60 + "px";
  gameArea.appendChild(enemy);
  enemies.push(enemy);
}

function moveEnemies() {
  enemies.forEach((enemy, index) => {
    let top = parseInt(enemy.style.top || -100);
    top += speed;
    enemy.style.top = top + "px";

    // Collision Detection
    if (
      top > 400 &&
      parseInt(enemy.style.left) === playerX
    ) {
      alert("Game Over! Score: " + score);
      window.location.reload();
    }

    if (top > 500) {
      enemy.remove();
      enemies.splice(index, 1);
      score++;
      scoreDisplay.textContent = score;
    }
  });
}

function gameLoop() {
  moveEnemies();
  requestAnimationFrame(gameLoop);
}

setInterval(createEnemy, 1500);
gameLoop();