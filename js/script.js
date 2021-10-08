// gaming constants 
let direction = { x: 0, y: 0 };
const movesound = new Audio('music/move.mp3');
const foodsound = new Audio('music/food.mp3');
const musicsound = new Audio('music/music.mp3');
const gameoversound = new Audio('music/gameover.mp3');
const players = document.querySelector('.players');
const modal = document.getElementById("myModal");
let playArr = [{}];
let play = false;
let speed = 5;
let scr = 0;
let score = 0;
let lastpaintTime = 0;
let snakeArr = [{ x: 12, y: 15 }];
let food = { x: 3, y: 2 };
musicsound.volume = 0.5;
let reqID = undefined;

// game functions
function main(ctime) {                              // ctime = current time
    reqID = window.requestAnimationFrame(main);
    if ((ctime - lastpaintTime) / 1000 < 1 / speed) {
        // console.log(ctime);
        return;
    }
    speedControl(score);
    lastpaintTime = ctime;
    gameengine();
}

function speedControl(score) {
    if (scr === score - 5) {
        speed += 1;
        scr = score;
    }
}

function isCollide(snake) {
    // if you bump into yourself
    for (let i = 1; i < snake.length; i++) {
        if (snake[0].x == snake[i].x && snake[0].y == snake[i].y)
            return true;
    }
    if (snake[0].x >= 18 || snake[0].x <= 1 || snake[0].y >= 18 || snake[0].y <= 1)
        return true;
    return false;
}

function resetBoard() {
    direction = { x: 0, y: 0 };
    snakeArr = [{ x: 12, y: 15 }];
    speed = 5;
    scr = 0;
    scoreBox.innerHTML = "Score: 0";
    window.requestAnimationFrame(main);
}

// game engine
function gameengine() {
    // check if snake collide
    if (isCollide(snakeArr)) {
        play = false;
        musicsound.pause();
        gameoversound.play();
        modal.classList.remove('hide');
        modal.classList.add('display');
        window.cancelAnimationFrame(reqID);
        return;
    }
    // update snake and food 
    if (snakeArr[0].x == food.x && snakeArr[0].y == food.y) {
        foodsound.play();
        score += 1;
        if (score > hiscoreval) {
            hiscoreval = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
            hiscoreBox.innerHTML = "HiScore: " + hiscoreval;
        }
        scoreBox.innerHTML = "Score: " + score;
        food = { x: Math.round((2 + 14 * Math.random())), y: Math.round((2 + 14 * Math.random())) };
        snakeArr.unshift({ x: snakeArr[0].x + direction.x, y: snakeArr[0].y + direction.y });
    }
    // moving the snake 
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }
    snakeArr[0].x += direction.x;
    snakeArr[0].y += direction.y;

    // display snake
    board.innerHTML = "";
    snakeArr.forEach((e, index) => {
        snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        if (index == 0)
            snakeElement.classList.add('head');
        else
            snakeElement.classList.add('snake');
        board.appendChild(snakeElement);
    });

    // display food
    foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

// main logic starts here
let hiscore = localStorage.getItem("hiscore");
let PlayersRecord = localStorage.getItem("PlayersRecord");
if (hiscore === null) {
    hiscoreval = 0;
    localStorage.setItem("hiscore", JSON.stringify(hiscoreval))
}
else {
    hiscoreval = JSON.parse(hiscore);
    hiscoreBox.innerHTML = "HiScore: " + hiscore;
}
if (PlayersRecord === null) {
    playArr = [{ name: "NAME", score: "SCORE" }];
    localStorage.setItem("PlayersRecord", JSON.stringify(playArr))
}
else {
    playArr = JSON.parse(PlayersRecord);
    updatePlayer();
}
window.requestAnimationFrame(main);
window.addEventListener('keydown', e => {
    if (e.key === "f") {
        toggleFullScreen();
    }
    if (e.key === "0" && !play && score == 0) {
        resetBoard();
        play = true;
        direction = { x: 0, y: -1 };
        musicsound.play();
    }
    if (play)
        switch (e.key) {
            case 'ArrowUp':
                direction = { x: 0, y: -1 };
                movesound.play();
                break;
            case 'ArrowDown':
                direction = { x: 0, y: 1 };
                movesound.play();
                break;
            case 'ArrowLeft':
                direction = { x: -1, y: 0 };
                movesound.play();
                break;
            case 'ArrowRight':
                direction = { x: 1, y: 0 };
                movesound.play();
                break;
            default:
                break;
        }
});
function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}
function playerData(event) {
    event.preventDefault();
    let name = document.getElementById('player').value;
    playArr.push({ name: name, score: score })
    localStorage.setItem("PlayersRecord", JSON.stringify(playArr))
    updatePlayer();
    event.target.reset();
    modal.classList.remove('display');
    modal.classList.add('hide');
    score = 0;
}
function updatePlayer() {
    players.innerHTML = "";
    playArr.forEach(element => {
        let p1 = document.createElement('p');
        p1.innerText = element.name + " : " + element.score;
        players.appendChild(p1);
        players.appendChild(document.createElement('hr'));
    });
}


// MODAL
let span = document.getElementsByClassName("close")[0];
// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.classList.remove('display');
    modal.classList.add('hide');
    score = 0;
}

const Modal = document.getElementById("Modal");
let span2 = document.querySelector(".once");
span2.onclick = function () {
    Modal.classList.remove('display');
    Modal.classList.add('hide');
    document.body.removeChild(Modal);
}

