import { Ball } from "./ball.js";
import { Stick } from "./stick.js";
import { Zombie } from "./zombie.js";
/*
Author : 윤찬규
Date : 2023-05-13
Description : 게임을 관리하는 함수입니다.

난이도에 따른 좀비의 스폰, 웨이브 등을 관리합니다.
식물의 설치, 재화 등을 관리합니다.
*/
export class gameManager {
    constructor(ctx, difficulty) {
        // test call
        console.log("gameManager loaded");
        this.ctx = ctx;
        
        this.difficulty = difficulty;
        this.maxWave = 5;
        this.curWave = 1;
        this.spawnTime = 200;
        this.timer = 0;
        
        this.ball = new Ball(300, 300, 15, 0, 15);
        this.stick = new Stick(220, 300, 20, 125, 20);

        this.gold = 0;

        this.spawnEntitesLinesPerWave = this.difficulty * this.curWave * 5;
        this.minimumSpawnEntitiesPerLine = this.difficulty;
        this.maximumSpawnEntitiesPerLine = Math.min(this.difficulty * 2, 5);
        this.remainZombie = 0;
        this.spawnPos = [0, 0, 0, 0, 0];

        this.minimumPosOfLinesX = [1600, 1600, 1600, 1600, 1600];
        this.minimumPosOfLinesIdx = [-1, -1, -1, -1, -1];
        this.zombies = new Array(5);
        for(let i = 0; i < 5; i++) {
            this.zombies[i] = new Array();
            for(let j = 0; j < 100; j++) {
                this.zombies[i].push(new Zombie(0, 0, 0, 0, 0, 0, 0));
            }
        }

        this.animation = null;
        this.upPressed = false;
        this.downPressed = false; // 키가 눌렸는지
        this.gameOverScreen = null;  
    }

    startGame() {
        this.addEventListeners();
        this.animate();

        // test call
        console.log("Game Start");
    }

    animate() {
        this.ctx.clearRect(0, 0, 1400, 600);
        this.animation = window.requestAnimationFrame(this.animate.bind(this));
        this.generateZombie();
        if(this.ball.isLeft()) {
            window.cancelAnimationFrame(this.animation);
            this.showGameOverScreen();
            // test call
            console.log("ball is out")
        }
        this.move();
        this.checkBallConflict();
    }

    /*
    Author : 윤찬규
    Date : 2023-05-14
    Description : 움직임과 관련된 함수입니다.
    */
    move() {
        this.ball.move(this.ctx);
        this.stick.move(this.ctx, this.upPressed - this.downPressed);
        for(let i = 0; i < 5; i++) {
            for(let j = 0; j < 100; j++) {
                if(this.zombies[i][j].hp > 0) {
                    this.zombies[i][j].move(this.ctx);
                    if(this.zombies[i][j].x < this.minimumPosOfLinesX[i]) {
                        this.minimumPosOfLinesX[i] = this.zombies[i][j].x;
                        this.minimumPosOfLinesIdx[i] = j;
                    }
                }
            }
        }
    }

    /*
    Author : 윤찬규
    Date : 2023-05-13
    Description : 좀비와 관련된 함수들입니다.
    */
    /*******************************************************************************************************/
    waveManage() {
        if(this.spawnEntitesLinesPerWave-- == 0) {
            // wave cleark
            // test call
            console.log("wave clear");
            if(this.curWave++ > this.maxWave)  {
                // difficulty clear
                // test call
                console.log("difficulty clear");
                return 99;
            }
            this.spawnEntitesLinesPerWave = this.difficulty * this.curWave * 5;
            return 1;
        }
        // test call
        console.log("remain wave: " + this.spawnEntitesLinesPerWave);
        return 0;
    }

    generateZombie() {
        if(this.timer++ < this.spawnTime) return;
        this.setSpawnPos();
        this.waveManage();
        this.spawnZombie();
        this.timer = 0;

        // test call
        console.log("MIN POS: " + this.minimumPosOfLinesX);
        console.log("MIN IDX: " + this.minimumPosOfLinesIdx);
    }

    shuffleSpawnPos() {
        this.spawnPos.sort(() => Math.random() - 0.5);
    }

    randRange(s, e) {
        return Math.floor((Math.random() * (e - s + 1)) + s);
    }

    setSpawnPos() {
        let spawnEntities = this.randRange(this.minimumSpawnEntitiesPerLine, this.maximumSpawnEntitiesPerLine);
        // test call 
        console.log("Spawn: " + spawnEntities);

        for(let i = 0; i < spawnEntities; i++) {
            this.spawnPos[i] = 1;
        }
        this.shuffleSpawnPos();

        // test call
        console.log(this.spawnPos);
    }

    spawnZombie() {
        /*
        line 0: 80-160
        line 1: 181-261
        line 2: 282-362
        line 3: 383-463
        line 4: 484-564
        */
        for(let i = 0; i < 5; i++) {
            if(this.spawnPos[i] == 1) {
                for(let j = 0; j < 100; j++) {
                    if(this.zombies[i][j].hp <= 0) {
                        this.zombies[i][j] = new Zombie(1400, i * 101 + 120, 50, 80, 1, 10, 1);
                        this.remainZombie += 1;
                        break;
                    }
                }
            }
            this.spawnPos[i] = 0;
        }
    }
    /*******************************************************************************************************/
    
    /*
    Author : 윤찬규
    Date : 2023-05-12
    Description : 공이 특정 오브젝트와 충돌 되었을 때의 행동을 정하는 함수

    매 프레임마다 충돌 되었는지 확인 -> 충돌 되었다면 필요한 행동 진행
    */
    /*******************************************************************************************************/
    checkBallConflict() {
        this.BallAndStick();
        this.BallAndZombie();
    }
    // 공과 막대의 충돌이 있었는가?
    BallAndStick() {
        if((this.ball.x - this.ball.r <= this.stick.x + this.stick.width / 2 && 
        !(this.ball.x + this.ball.r <= this.stick.x + this.stick.width / 2))
        && (this.ball.y + this.ball.r >= this.stick.y - this.stick.height / 2 && 
        this.ball.y - this.ball.r <= this.stick.y + this.stick.height / 2)) {
            this.ball.conflictStick((this.ball.y - this.stick.y) / this.stick.height * 2);

            // test call
            console.log("ball conflict [Stick]");
        } 
    }
    // 공과 좀비의 충돌이 있었는가?
    BallAndZombie() {
        const range_s = [80, 181, 282, 383, 484];
        const range_e = [160, 261, 362, 463, 564];
        let zombiePos;

        for(let i = 0; i < 5; i++) {
            if(this.ball.y + this.ball.r >= range_s[i] && this.ball.y - this.ball.r <= range_e[i]) {
                // 해당 줄의 좀비들과 충돌 검사
                for(let j = 0; j < 100; j++) {
                    if(this.zombies[i][j].hp <= 0) continue;
                    zombiePos = {
                        x: this.zombies[i][j].x,
                        y: this.zombies[i][j].y,
                        top: this.zombies[i][j].y - this.zombies[i][j].height / 2,
                        right: this.zombies[i][j].x + this.zombies[i][j].width / 2,
                        bottom: this.zombies[i][j].y + this.zombies[i][j].height / 2,
                        left: this.zombies[i][j].x - this.zombies[i][j].width / 2
                    }
                    if((zombiePos.top <= this.ball.y && this.ball.y <= zombiePos.bottom)) {
                        if((this.ball.x < zombiePos.x && this.ball.x + this.ball.r >= zombiePos.left) ||
                        (this.ball.x > zombiePos.x && this.ball.x - this.ball.r <= zombiePos.right)) {
                            this.ball.conflictLeftRight();
                        }
                    }
                    else if((zombiePos.left <= this.ball.x && this.ball.x <= zombiePos.right)) {
                        if((this.ball.y < zombiePos.y && this.ball.y + this.ball.r >= zombiePos.top) ||
                        (this.ball.y > zombiePos.y && this.ball.y - this.ball.r <= zombiePos.bottom)) {
                            this.ball.conflictTopBottom();
                        }
                    }
                }
            }
        }
    }
    /*
    Author : 윤찬규
    Date : 2023-05-12
    Description : 키 이벤트
    */
    /*******************************************************************************************************/
    keyDownHandler(e) {
        if(e.key === "Up" || e.key === "ArrowUp") {
            this.upPressed = true;

            // test call
            // console.log("Keydown: [UP]");
        }
        else if(e.key === "Down" || e.key === "ArrowDown") {
            this.downPressed = true;

            // test call
            // console.log("Keydown: [DOWN]");
        }
    }
    keyUpHandler(e) {
        if(e.key === "Up" || e.key === "ArrowUp") {
            this.upPressed = false;

            // test call
            // console.log("Keyup: [UP]");
        }
        else if(e.key === "Down" || e.key === "ArrowDown") {
            this.downPressed = false;

            // test call
            // console.log("Keyup: [DOWN]");
        }
    }
    /*
    Author : 윤찬규
    Date : 2023-05-12
    Description : 이벤트 리스너를 추가하는 함수
    */
    addEventListeners() {
        document.addEventListener("keydown", this.keyDownHandler.bind(this), false);
        document.addEventListener("keyup", this.keyUpHandler.bind(this), false);
    }
    /*******************************************************************************************************/

    /*
    Author : 이건
    Date : 2023-05-14
    Description : 게임 실패시 게임 실패 화면을 출력하는 함수
    */
    showGameOverScreen() {
        this.initGameOverScreen();
        $("#game-display").append(this.gameOverScreen);
        // 출력 애니메이션
        $(this.gameOverScreen).hide().fadeIn(2000);
    };

    /*
    Author : 이건
    Date : 2023-05-14
    Description : 게임 실패 화면을 초기화하는 함수
    */
    initGameOverScreen() {
        this.gameOverScreen = document.createElement("div");
        $(this.gameOverScreen).addClass("gameOverScreen");

        let gameOverImage = document.createElement("img");
        $(gameOverImage).attr("id", "gameOverImage");

        let buttonDiv = document.createElement("div");
        $(buttonDiv).attr("id", "buttonDiv");

        let retry = document.createElement("img");
        $(retry).attr("id", "retry-button");
        $(retry).on("click", function () {
            $("#game-display .gameOverScreen").remove();
            // 게임 재실행
            
        });
        $(retry).css("margin-right", "20px");

        let exit = document.createElement("img");
        $(exit).attr("id", "exit-button");
        $(exit).on("click", function () {
            $("#game-display .gameOverScreen").remove();
            // 메인 화면
             
        });

        $(this.gameOverScreen).append(gameOverImage);
        $(this.gameOverScreen).append(buttonDiv);
        $(buttonDiv).append(retry);
        $(buttonDiv).append(exit);
    }
}