import { Ball } from "./ball.js";
var canvas, ctx; // 캔버스와 컨텍스트
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
    if(difficulty == 1) {

    }
    else if(difficulty == 2) {

    }
    else if(difficulty == 3) {

    }

    // test call
    console.log("game difficulty is " + difficulty);
}
/*
Author : 윤찬규
Date : 2023-05-12
Description : 실제 게임이 작동되는 함수
*/
function gamePlay() {
    let ball = new Ball(150, 300, 15, 30, 5);
    let interval;
    function move() {
        ball.move(ctx);
        if(ball.isLeft()) {
            clearInterval(interval);

            // test call
            console.log("ball is out")
        }
        // test call
        // console.log("Ball pos [" + ball.x + "," + ball.y + "] ang: " + ball.angle + " size: " + ball.r);
    }
    
    interval = setInterval(move, 10);
    
    // test call
    console.log("game is playing now");
}

window.onload = () => {
    init();
    // 난이도를 선택하면 아래 함수를 실행합니다.
    inGame(1); 
}

function addEventListeners() {
    document.addEventListener("keydown", keyPressed, false);
}