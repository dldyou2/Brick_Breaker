import { Ball } from "./ball.js";
import { gameManager } from "./gameManager.js";
import { Stick } from "./stick.js"
var canvas, ctx; // 캔버스와 컨텍스트
let ball, stick; // 공과 막대
let upPressed = false, downPressed = false; // 키가 눌렸는지  
let animation;
let gm; // 게임 매니저
/*
Author : 윤찬규
Date : 2023-05-12
Description: 초기화 함수

맨 처음 한 번 실행시키는 함수입니다.
*/
function init() {
    canvasInit();
    addEventListeners();

    // test call
    console.log("initialize complete");
}

/*
Author : 윤찬규
Date : 2023-05-12
Description: 캔버스 초기화 함수

canvas와 ctx를 초기화 후 ctx에서 그리기를 시작합니다.
*/
function canvasInit() {
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");

    // test call
    console.log("canvas initialize complete");
}

/*
Author : 윤찬규
Date : 2023-05-12
Description : 인게임 함수

게임 플레이의 전제를 관장합니다.
*/
function inGame(difficulty) {
    inGameInit(difficulty);
    gamePlay();

    // test call
    console.log("ingame complete")
}

/*
Author : 윤찬규
Date : 2023-05-12
Description : 인게임 초기화 함수

게임 시작에 필요한 것들을 초기화하는 함수입니다.
*/
function inGameInit(difficulty) {
    gm = new gameManager(difficulty);

    // test call
    console.log("game difficulty is " + difficulty);
}
/*
Author : 윤찬규
Date : 2023-05-12
Description : 실제 게임이 작동되는 함수
*/
function gamePlay() {
    ball = new Ball(300, 300, 15, 0, 15);
    stick = new Stick(220, 300, 10, 125, 20);
    moveEntities();
    // test call
    console.log("game is playing now");
}
function moveEntities() {
    animation = window.requestAnimationFrame(moveEntities);
    ctx.clearRect(0, 0, 1400, 600);
    gm.generateZombie();

    if(ball.isLeft()) {
        window.cancelAnimationFrame(animation);
        // test call
        console.log("ball is out")
    }
    ball.move(ctx);
    stick.move(ctx, upPressed - downPressed);
    gm.move(ctx);
    checkBallConflict();

}

/*
Author : 윤찬규
Date : 2023-05-12
Description : 공이 특정 오브젝트와 충돌 되었을 때의 행동을 정하는 함수

매 프레임마다 충돌 되었는지 확인 -> 충돌 되었다면 필요한 행동 진행
*/
function checkBallConflict() {
    BallAndStick();
}
// 공과 막대의 충돌이 있었는가?
function BallAndStick() {
    if((ball.x - ball.r <= stick.x + stick.width / 2 && !(ball.x + ball.r <= stick.x + stick.width / 2))
    && (ball.y >= stick.y - stick.height / 2 && ball.y <= stick.y + stick.height / 2)) {
        ball.conflictStick((ball.y - stick.y) / stick.height * 2);

        // test call
        console.log("ball conflict [Stick]");
    } 
}

/*
Author : 윤찬규
Date : 2023-05-12
Description : 키가 눌리고 땔 때 무엇을 할지 정하는 함수
*/
function keyDownHandler(e) {
    if(e.key === "Up" || e.key === "ArrowUp") {
        // stick 에 Stick이 할당되었다면
        if(stick instanceof Stick) {
            upPressed = true;
        }

        // test call
        // console.log("Keydown: [UP]");
    }
    else if(e.key === "Down" || e.key === "ArrowDown") {
        if(stick instanceof Stick) {
            downPressed = true;
        }

        // test call
        // console.log("Keydown: [DOWN]");
    }
}
function keyUpHandler(e) {
    if(e.key === "Up" || e.key === "ArrowUp") {
        // stick 에 Stick이 할당되었다면
        if(stick instanceof Stick) {
            upPressed = false;
        }

        // test call
        // console.log("Keyup: [UP]");
    }
    else if(e.key === "Down" || e.key === "ArrowDown") {
        if(stick instanceof Stick) {
            downPressed = false;
        }

        // test call
        // console.log("Keyup: [DOWN]");
    }
}

window.onload = () => {
    init();
    // 난이도를 선택하면 아래 함수를 실행합니다.
    inGame(1); 
}

/*
Author : 윤찬규
Date : 2023-05-12
Description : 이벤트 리스너를 추가하는 함수
*/
function addEventListeners() {
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
}