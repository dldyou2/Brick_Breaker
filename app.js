import { gameManager } from "./gameManager.js";
class App {
    constructor() {
        // test call
        console.log("App Loaded");
        this.canvas = document.getElementById("myCanvas");
        this.ctx = this.canvas.getContext("2d");
        
        this.init();
        this.gm = null;
        this.inGame(1);
    }
    /*
    Author : 윤찬규
    Date : 2023-05-12
    Description: 초기화 함수

    맨 처음 한 번 실행시키는 함수입니다.
    */
    init() {
        // test call
        console.log("initialize complete");
    }

    /*
    Author : 윤찬규
    Date : 2023-05-12
    Description : 인게임 함수

    게임 플레이의 전제를 관장합니다.
    */
    inGame(difficulty) {
        this.gm = new gameManager(this.ctx, difficulty);
        this.gm.startGame();
        
        // test call
        console.log("inGame complete")
    }
}

window.onload = () => {
    new App();
}