import { Ball } from "./ball.js";
import { Peashooter, Plant, Snowpea, Wallnut } from "./plant.js";
import { Stick } from "./stick.js";
import { stdZombie, Zombie, ConeheadZombie, BucketheadZombie } from "./zombie.js";
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
        console.log("difficulty[" + difficulty + "] gameManager loaded");
        this.ctx = ctx;
        
        this.difficulty = difficulty;
        this.maxWave = 3;
        this.curWave = 1;
        this.spawnTime = 350 - 50 * difficulty;
        this.timer = 200;
        
        this.ball = new Ball(300, 300, 15, 0, 10, 3);
        this.stick = new Stick(220, 300, 20, 125, 10);

        this.gold = 500;
        // zombie
        this.spawnEntitesLinesPerWave = this.difficulty * this.curWave;
        this.minimumSpawnEntitiesPerLine = this.difficulty;
        this.maximumSpawnEntitiesPerLine = Math.min(this.difficulty * 2, 5);
        this.spawnPos = [0, 0, 0, 0, 0];

        this.zombies = new Array(5);
        for(let i = 0; i < 5; i++) {
            this.zombies[i] = new Array();
        }
        this.zombiePos;

        // plant
        this.plantPrice = {
            peashooter:100,
            snowpea:175,
            wallnut:50
        }
        this.plants = new Array(5);
        for(let i = 0; i < 5; i++) {
            this.plants[i] = new Array();
            for(let j = 0; j < 9; j++) {
                this.plants[i].push(new Plant(0, 0, 0, 0));
            }
        }
        this.buyStatus = 0;
        this.buyEvent = null;
        this.addPlantX = 0, this.addPlantY = 0;

        this.animation = null;
        this.upPressed = false;
        this.downPressed = false; // 키가 눌렸는지
        this.gameOverScreen = null;
        this.gamestate = 0; // 0: normal / 1: wave clear / 99: difficulty clear

        this.event_keydown = this.keyDownHandler.bind(this);
        this.event_keyup = this.keyUpHandler.bind(this);
        this.event_click = this.mouseClicked.bind(this);
        this.frame = 0;

    }

    bgmPlay(fileName) {
        const audio = document.getElementById("bgm");
        audio.src = "./sounds/BGM/" + fileName;
        audio.muted = true;
        audio.load();
        audio.muted = false;
    }

    init(difficulty) {
        if(difficulty > 3) return;
        this.difficulty = difficulty;
        this.maxWave = 3;
        this.curWave = 1;
        this.spawnTime = 350 - 50 * difficulty;
        this.timer = 200;
        
        this.ball = new Ball(300, 300, 15, 0, 10, 3);
        this.stick = new Stick(220, 300, 20, 125, 10);

        this.gold = 500;
        // zombie
        this.spawnEntitesLinesPerWave = this.difficulty * this.curWave;
        this.minimumSpawnEntitiesPerLine = this.difficulty;
        this.maximumSpawnEntitiesPerLine = Math.min(this.difficulty * 2, 5);
        this.spawnPos = [0, 0, 0, 0, 0];

        this.zombies = new Array(5);
        for(let i = 0; i < 5; i++) {
            this.zombies[i] = new Array();
        }
        this.zombiePos;

        // plant
        this.plantPrice = {
            peashooter:100,
            snowpea:175,
            wallnut:50
        }
        this.plants = new Array(5);
        for(let i = 0; i < 5; i++) {
            this.plants[i] = new Array();
            for(let j = 0; j < 9; j++) {
                this.plants[i].push(new Plant(0, 0, 0, 0));
            }
        }
        this.buyStatus = 0;
        this.buyEvent = null;
        this.addPlantX = 0, this.addPlantY = 0;

        this.animation = null;
        this.upPressed = false;
        this.downPressed = false; // 키가 눌렸는지
        this.gameOverScreen = null;
        this.gamestate = 0; // 0: normal / 1: wave clear / 99: difficulty clear

        this.frame = 0;
        this.startGame();
    }

    startGame() {
        this.addEventListeners();
        this.initGameOverScreen();
        this.initGameClearScreen();
        this.checkPlantBar();
        this.animate();

        // test call
        console.log("Game Start");
    }

    animate() {
        this.ctx.clearRect(0, 0, 1400, 600);
        this.animation = window.requestAnimationFrame(this.animate.bind(this));
        this.generateZombie();
        if (this.ball.isLeft()) {
            // test call
            console.log("ball is out")
            this.ball.respawn();
            this.stick.y = 300;
        }
        this.updatePlantBar();
        let gameEnd = this.move();
        if(gameEnd) {
            window.cancelAnimationFrame(this.animation);
            this.showGameOverScreen();
        }
        this.checkBallConflict();
        
        if(++this.frame == 10) {
            this.frame = 0;
            for(let i = 0; i < 5; i++) {
                for(let j = 0; j < 9; j++) {
                    if(this.plants[i][j].hp > 0) {
                        this.plants[i][j].nextFrame();
                    }
                }
            }
            for (let i = 0; i < 5; i++) {
                for (let j = 0; j < this.zombies[i].length; j++) {
                    this.zombies[i][j].nextFrame();
                }
            }
        }
    }

    /*
    Author : 윤찬규
    Date : 2023-05-14
    Description : 움직임과 관련된 함수입니다.
    */
    move() {
        const interval = [330, 405, 495, 575, 660, 735, 815, 885, 980];
        for(let i = 0; i < 5; i++) {
            for(let j = 0; j < 9; j++) {
                if(this.plants[i][j].hp > 0) {
                    this.plants[i][j].draw(this.ctx);
                    this.plants[i][j].drawHP(this.ctx);
                    if(this.plants[i][j].ball.length == 0) continue;

                    let removeIdx = new Array();
                    let removeZIdx = new Array();
                    for(let k in this.plants[i][j].ball) {
                        let flag = 0;
                        this.plants[i][j].ball[k].x += this.plants[i][j].ball[k].speed;
                        this.plants[i][j].ball[k].draw(this.ctx);
                        if(this.plants[i][j].ball[k].x >= 1700) {
                            flag = 1;
                        }
                        
                        for(let l = 0; l < this.zombies[i].length; l++) {
                            const atkPosS = this.plants[i][j].ball[k].x - this.plants[i][j].ball[k].img.width / 2;
                            const atkPosE = this.plants[i][j].ball[k].x + this.plants[i][j].ball[k].img.width / 2;
                            const zPosS = this.zombies[i][l].x - this.zombies[i][l].width / 2;
                            const zPosE = this.zombies[i][l].x + this.zombies[i][l].width / 2;

                            if(atkPosE >= zPosS && atkPosS <= zPosE) {
                                if(this.plants[i][j].dmg > 0) {
                                    this.zombies[i][l].hp -= this.plants[i][j].dmg;
                                    this.zombies[i][l].timer_HP = 100; // 충돌 시 체력 바
                                    if(this.zombies[i][l].hp <= 0) {
                                        removeZIdx.push(l);
                                        if(this.zombies[i][l] instanceof Zombie) {
                                            this.gold += 15;
                                        }
                                        else if(this.zombies[i][l] instanceof ConeheadZombie) {
                                            this.gold += 30;
                                        }
                                        else if(this.zombies[i][l] instanceof BucketheadZombie) {
                                            this.gold += 50;
                                        }
                                    }
                                }
                                if(this.plants[i][j] instanceof Peashooter) {
                                    this.zombies[i][l].knockback();
                                }
                                else if(this.plants[i][j] instanceof Snowpea) {
                                    this.zombies[i][l].slowON();
                                }
                                flag = 1;
                            }
                        }
                        if(flag == 1) {
                            removeIdx.push(k);
                        }
                        for(let l = removeZIdx.length - 1; l >= 0; l--) {
                            this.zombies[i].splice(l, 1);
                        }
                    }
                    for(let k = removeIdx.length - 1; k >= 0; k--) {
                        this.plants[i][j].ball.splice(removeIdx[k], 1);
                    }
                }
            }
        }
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < this.zombies[i].length; j++) {
                const zPosS = this.zombies[i][j].x - this.zombies[i][j].width / 2;
                const zPosE = this.zombies[i][j].x + this.zombies[i][j].width / 2;

                let idx = -1;
                for (let k = 0; k < interval.length; k++) {
                    if(this.plants[i][k].hp > 0 && zPosS <= interval[k] && zPosE >= interval[k]) {
                        idx = k;
                        break;
                    }
                }

                if(idx == -1) {
                    this.zombies[i][j].move(this.ctx);
                }
                else {
                    if(this.zombies[i][j].attack(this.ctx)) {
                        this.plants[i][idx].hp -= this.zombies[i][j].dmg;
                        this.plants[i][idx].timer_HP = 100;
                    }
                }
                this.zombies[i][j].drawHP(this.ctx);
                this.zombies[i][j].slowOFF();

                if(this.zombies[i][j].isEnd()) {
                    return 1;
                }
            }
        }
        this.ball.move(this.ctx);
        this.stick.move(this.ctx, this.upPressed - this.downPressed);
        return 0;
    }
    draw() {
        this.ctx.clearRect(0, 0, 1400, 600);
        this.ball.draw(this.ctx);
        this.stick.draw(this.ctx);
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < this.zombies[i].length; j++) {
                if(this.zombies[i][j].hp > 0) {
                    this.zombies[i][j].draw(this.ctx);
                }
            }
        }
        for(let i = 0; i < 5; i++) {
            for(let j = 0; j < 9; j++) {
                if(this.plants[i][j].hp > 0) {
                    this.plants[i][j].draw(this.ctx);
                }
            }
        }
    }
    /*
    Author : 윤찬규
    Date : 2023-05-19
    Description : 식물과 관련된 함수들입니다.
    */
    /*******************************************************************************************************/
    checkPlantBar() {
        const plantsName = ["peashooter", "snowpea", "wallnut"];
        $(".plants").each(function(idx, item) {
            $(item).on("click", function() {
                if(this.buyStatus == 0) 
                    this.addPlant(plantsName[idx]);
            }.bind(this));
        }.bind(this));
    }
    addPlant(plantName) {
        const src = "./images/In-Game/bar/" + plantName + "-card.png";
        // test call
        console.log(plantName + " clicked");
        if (this.gold >= this.plantPrice[plantName]) {
            this.gold -= this.plantPrice[plantName];
            
            // clear 후 프레임 넘겨서 구매 후 화면으로 갱신 후 다시 clear
            window.cancelAnimationFrame(this.animation);
            this.animate();
            window.cancelAnimationFrame(this.animation);

            this.buyStatus = plantName;
            this.buyEvent = this.mouseMoved.bind(this);
            document.addEventListener("mousemove", this.buyEvent);
            console.log("pause game: buy plant");
        }
    }
    addingPlant(x, y) {
        const img = new Image();
        img.src = "./images/Plants/" + this.buyStatus + "/" + this.buyStatus + "_0.png";
        this.draw();
        this.ctx.beginPath();
        this.ctx.globalAlpha = 0.5;
        if(x >= 250 && x <= 1000 && y >= 75 && y <= 575) {
            let tx = Math.floor((x - 251) / 83);
            let ty = Math.floor((y - 76) / 100);
            this.addPlantX = tx;
            this.addPlantY = ty;

            this.ctx.drawImage(img, tx * 83 + 291.5 - img.width / 2, ty * 100 + 107.5 - img.height / 2);
        }
        else {
            this.ctx.drawImage(img, x - img.width / 2, y - img.height / 2);
        }
        this.ctx.globalAlpha = 1;
        this.ctx.closePath();
    }
    updatePlantBar() {
        const plantsName = ["peashooter", "snowpea", "wallnut"];
        const offSrc = "-dis";
        const src = {
            peashooter:"./images/In-Game/bar/peashooter-card",
            snowpea:"./images/In-Game/bar/snowpea-card",
            wallnut:"./images/In-Game/bar/wallnut-card"
        }
        const png = ".png";

        // 식물을 설치 할 수 있는지 없는지
        for (let i in plantsName) {
            let plantName = plantsName[i];
            let selector = "#" + plantName + "-card";
            if (this.gold >= this.plantPrice[plantName]) {
                $(selector).attr("src", src[plantName] + png);
            }
            else {
                $(selector).attr("src", src[plantName] + offSrc + png);
            }
        }
        // 골드 관리
        $("#gold").text(this.gold.toString().padStart(5, '0'));
    }
    /*******************************************************************************************************/
    /*
    Author : 윤찬규
    Date : 2023-05-13
    Description : 좀비와 관련된 함수들입니다.
    */
    /*******************************************************************************************************/
    remainZombie() {
        let ret = 0;
        for (let i = 0; i < 5; i++) {
            ret += this.zombies[i].length;
        }
        return ret;
    }
    waveManage() {
        if(this.spawnEntitesLinesPerWave == 0) {
            if(this.remainZombie() != 0) return 0;
            // wave clear
            if(++this.curWave > this.maxWave)  {
                // difficulty clear
                window.cancelAnimationFrame(this.animation);
                this.showGameClearScreen();
                // test call
                console.log("difficulty clear");
                return 99;
            }
            // test call
            console.log("wave clear");
            this.spawnEntitesLinesPerWave = this.difficulty * this.curWave;
            return 1;
        }
        this.spawnEntitesLinesPerWave--;
        // test call
        console.log("remain " + this.spawnEntitesLinesPerWave + " lines at [" + this.curWave + "/" + this.maxWave + "]");
        return 0;
    }

    generateZombie() {
        if(this.timer++ < this.spawnTime) return;
        
        if(this.spawnEntitesLinesPerWave > 0) {
            this.setSpawnPos();
            this.spawnZombie();
        }
        this.gamestate = this.waveManage();
        this.timer = 0;

        // test call
        // console.log("MIN POS: " + this.minimumPosOfLinesX);
        // console.log("MIN IDX: " + this.minimumPosOfLinesIdx);
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
        // console.log("Spawn: " + spawnEntities);

        for(let i = 0; i < spawnEntities; i++) {
            this.spawnPos[i] = 1;
        }
        this.shuffleSpawnPos();

        // test call
        // console.log(this.spawnPos);
    }

    randZombie(i) {
        let r = this.randRange(1, 100);
        if(r < 70) {
            return new Zombie(1350, i * 101 + 120, 50, 80, 0.5 + 0.05 * (this.difficulty - 1), 3 + (this.difficulty - 1), 1);
        }
        else if(r < 90) {
            return new ConeheadZombie(1350, i * 101 + 120, 50, 80, 0.3 + 0.03 * (this.difficulty - 1), 15 + 2 * (this.difficulty - 1), 1.5);
        }
        else {
            return new BucketheadZombie(1350, i * 101 + 120, 50, 80, 0.15 + 0.02 * (this.difficulty - 1), 30 + 3 * (this.difficulty - 1), 1);
        }
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
                this.zombies[i].push(this.randZombie(i));
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
            // console.log("ball conflict [Stick]");
        } 
    }
    isConflictLeftRight() {
        if((this.zombiePos.top <= this.ball.y && this.ball.y <= this.zombiePos.bottom)) {
            if((this.ball.x < this.zombiePos.x && this.ball.x + this.ball.r >= this.zombiePos.left) ||
            (this.ball.x > this.zombiePos.x && this.ball.x - this.ball.r <= this.zombiePos.right)) {
                return 1;
            }
        }
        return 0;
    }

    isConflictTopBottom() {
        if((this.zombiePos.left <= this.ball.x && this.ball.x <= this.zombiePos.right)) {
            if((this.ball.y < this.zombiePos.y && this.ball.y + this.ball.r >= this.zombiePos.top) ||
            (this.ball.y > this.zombiePos.y && this.ball.y - this.ball.r <= this.zombiePos.bottom)) {
                return 1;
            }
        }
        return 0;
    }
    // 공과 좀비의 충돌이 있었는가?
    BallAndZombie() {
        const range_s = [80, 181, 282, 383, 484];
        const range_e = [160, 261, 362, 463, 564];

        
        for(let i = 0; i < 5; i++) {
            if(this.ball.y + this.ball.r >= range_s[i] && this.ball.y - this.ball.r <= range_e[i]) {
                // 해당 줄의 좀비들과 충돌 검사
                let isConflict = false;
                let removeIdx = new Array();
                for(let j = 0; j < this.zombies[i].length; j++) {
                    this.zombiePos = {
                        x: this.zombies[i][j].x,
                        y: this.zombies[i][j].y,
                        top: this.zombies[i][j].y - this.zombies[i][j].height / 2,
                        right: this.zombies[i][j].x + this.zombies[i][j].width / 2,
                        bottom: this.zombies[i][j].y + this.zombies[i][j].height / 2,
                        left: this.zombies[i][j].x - this.zombies[i][j].width / 2
                    }

                    
                    if(this.isConflictLeftRight()) 
                        this.ball.conflictLeftRight(), isConflict = true;
                    else if(this.isConflictTopBottom()) 
                        this.ball.conflictTopBottom(), isConflict = true;

                    // 충돌 시 데미지
                    if(isConflict) {
                        this.zombies[i][j].hp -= this.ball.dmg;
                        this.zombies[i][j].timer_HP = 100; // 충돌 시 체력 바
                        if(this.zombies[i][j].hp <= 0) {
                            removeIdx.push(j);
                            if(this.zombies[i][j] instanceof Zombie) {
                                this.gold += 15;
                            }
                            else if(this.zombies[i][j] instanceof ConeheadZombie) {
                                this.gold += 30;
                            }
                            else if(this.zombies[i][j] instanceof BucketheadZombie) {
                                this.gold += 50;
                            }
                        }
                        break;
                    }
                }
                if(isConflict) {
                    for(let j = removeIdx.length - 1; j >= 0; j--) {
                        this.zombies[i].splice(j, 1);
                    }
                    break;
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
        else if(e.key == "g") { // 골드 증가
            this.gold += 15;

            // test call
            console.log("GOLD + 15");
        }
        else if(e.key == "z") { // 좀비 제거
            for (let i = 0; i < 5; i++) 
                this.zombies[i].length = 0;

            // test call
            console.log("KILL ALL ZOMBIES");
        }
        else if(e.key == "r") { // 공 강제 리스폰
            this.ball.x = -100;
            this.ball.timer = 0;
            this.ball.respawn();

            // test call
            console.log("STRONG RESPAWN");
        }
        else if(e.key == "f") {
            for (let i = 0; i < 5; i++) {
                for (let j = 0; j < this.zombies[i].length; j++) {
                    if(this.zombies[i][j].hp > 0) {
                        if(this.zombies[i][j] instanceof Zombie) {
                            this.zombies[i][j].speed = 5;
                        }
                        else if(this.zombies[i][j] instanceof ConeheadZombie) {
                            this.zombies[i][j].speed = 3;
                        }
                        else if(this.zombies[i][j] instanceof BucketheadZombie) {
                            this.zombies[i][j].speed = 1;
                        }
                    }
                }
            }

            // test call
            console.log("ZOMBIE SPEED UP");
        }
        else if(e.key == "c") {
            for (let i = 0; i < 5; i++) {
                for (let j = 0;  j < this.zombies[i].length; j++) {
                    console.log(i + " : " + j + " - " + this.zombies[i][j].x)
                }
            }
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
        else if(e.key == "f") {
            for (let i = 0; i < 5; i++) {
                for (let j = 0; j < this.zombies[i].length; j++) {
                    if(this.zombies[i][j].hp > 0) {
                        if(this.zombies[i][j] instanceof Zombie) {
                            this.zombies[i][j].speed = 0.5;
                        }
                        else if(this.zombies[i][j] instanceof ConeheadZombie) {
                            this.zombies[i][j].speed = 0.3;
                        }
                        else if(this.zombies[i][j] instanceof BucketheadZombie) {
                            this.zombies[i][j].speed = 0.1;
                        }
                    }
                }
            }
        }
    }
    /* 
    Author : 윤찬규
    Date : 2023-05-19
    Description : 마우스 이벤트
    */
    mouseClicked(e) {
        const plantsName = ["peashooter", "snowpea", "wallnut"];
        let x = e.pageX - $("#myCanvas").offset().left;
        let y = e.pageY - $("#myCanvas").offset().top;
        console.log("x: " + x + " y: " + y);
        if(this.buyStatus != 0 && x >= 250 && x <= 1000 && y >= 75 && y <= 575) {
            console.log(this.addPlantX + " " + this.addPlantY);
            if(this.plants[this.addPlantY][this.addPlantX].hp > 0) return;
            if(this.buyStatus == plantsName[0]) {
                this.plants[this.addPlantY][this.addPlantX] = new Peashooter(this.addPlantX * 83 + 291.5, this.addPlantY * 100 + 107.5, 20, 0.05);
            }
            else if(this.buyStatus == plantsName[1]) {
                this.plants[this.addPlantY][this.addPlantX] = new Snowpea(this.addPlantX * 83 + 291.5, this.addPlantY * 100 + 107.5, 30, 0.1);
            }
            else if(this.buyStatus == plantsName[2]) {
                this.plants[this.addPlantY][this.addPlantX] = new Wallnut(this.addPlantX * 83 + 291.5, this.addPlantY * 100 + 107.5, 100, 0);
            }
            this.buyStatus = 0;
            document.removeEventListener("mousemove", this.buyEvent);
            this.animate();
            console.log("add Plant");
        }
    }
    mouseMoved(e) {
        let x = e.pageX - $("#myCanvas").offset().left;
        let y = e.pageY - $("#myCanvas").offset().top;
        
        this.addingPlant(x, y);
    }
    /*
    Author : 윤찬규
    Date : 2023-05-12
    Description : 이벤트 리스너
    */
    addEventListeners() {
        document.addEventListener("keydown", this.event_keydown, false);
        document.addEventListener("keyup", this.event_keyup, false);
        document.addEventListener("click", this.event_click, false);
    }
    removeEventListeners() {
        document.removeEventListener("keydown", this.event_keydown);
        document.removeEventListener("keyup", this.event_keyup);
        document.removeEventListener("click", this.event_click);
    }
    /*******************************************************************************************************/

    /*
    Author : 이건
    Date : 2023-05-14
    Description : 게임 실패시 게임 실패 화면을 출력하는 함수
    */
    showGameOverScreen() {
        $("#game-display").append(this.gameOverScreen);
        // 출력 애니메이션
        $(this.gameOverScreen).animate({top : "180px", opacity : "0.5"}, 2000);
        $(this.gameOverScreen).animate({top : "150px", opacity : "1.0"}, 400);
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
            this.removeEventListeners();
            this.init(this.difficulty);
        }.bind(this));

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

    /*
    Author : 이건
    Date : 2023-05-20
    Description : 게임 클리어시 게임 클리어 화면을 출력하는 함수
    */
    showGameClearScreen() {
        $("#game-display").append(this.gameClearScreen);
        // 출력 애니메이션
        $(this.gameClearScreen).hide().fadeIn(2000);
    };

    /*
    Author : 이건
    Date : 2023-05-20
    Description : 게임 클리어 화면을 초기화하는 함수
    */
    initGameClearScreen() {
        this.gameClearScreen = document.createElement("div");
        $(this.gameClearScreen).addClass("gameClearScreen");

        let gameClearImage = document.createElement("img");
        $(gameClearImage).attr("id", "gameClearImage");

        let buttonDiv = document.createElement("div");
        $(buttonDiv).attr("id", "buttonDiv");

        let next = document.createElement("img");
        $(next).attr("id", "next-button");
        $(next).on("click", function () {
            $("#game-display .gameClearScreen").remove();
            // 다음 스테이지 진행
            this.removeEventListeners();
            this.init(++this.difficulty);
        }.bind(this));

        let exit = document.createElement("img");
        $(exit).attr("id", "exit-button");
        $(exit).on("click", function () {
            $("#game-display .gameClearScreen").remove();
            // 메인 화면
             
        });

        $(this.gameClearScreen).append(gameClearImage);
        $(this.gameClearScreen).append(buttonDiv);
        $(buttonDiv).append(next);
        $(buttonDiv).append(exit);
    }
}