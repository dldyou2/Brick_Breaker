import { Zombie } from "./zombie.js";
/*
Author : 윤찬규
Date : 2023-05-13
Description : 게임을 관리하는 함수입니다.

난이도에 따른 좀비의 스폰, 웨이브 등을 관리합니다.
*/
export class gameManager {
    constructor(difficulty) {
        this.difficulty = difficulty;
        this.maxWave = 5;
        this.curWave = 1;
        this.spawnTime = 200;
        this.timer = 0;

        this.spawnEntitesLinesPerWave = this.difficulty * this.curWave * 5;
        this.minimumSpawnEntitiesPerLine = this.difficulty;
        this.maximumSpawnEntitiesPerLine = Math.min(this.difficulty * 2, 5);
        this.spawnPos = [0, 0, 0, 0, 0];

        this.minimumPosOfLines = [1600, 1600, 1600, 1600, 1600];
        this.zombies = new Array(5);
        for(let i = 0; i < 5; i++) {
            this.zombies[i] = new Array();
            for(let j = 0; j < 100; j++) {
                this.zombies[i].push(new Zombie(0, 0, 0, 0, 0, 0, 0));
            }
        }
    }

    waveManage() {
        if(this.spawnEntitesLinesPerWave-- == 0) {
            // wave clear
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
    /*
    Author : 윤찬규
    Date : 2023-05-13
    Description : 좀비의 스폰과 관련된 함수들입니다.
    */
    /*******************************************************************************************************/
    generateZombie() {
        if(this.timer++ < this.spawnTime) return;
        this.setSpawnPos();
        this.waveManage();
        for(let i = 0; i < 5; i++) {
            if(this.spawnPos[i] == 1) {
                for(let j = 0; j < 100; j++) {
                    if(this.zombies[i][j].hp <= 0) {
                        this.zombies[i][j] = new Zombie(1400, i * 101 + 120, 30, 80, 1, 10, 1);
                        break;
                    }
                }
            }
            this.spawnPos[i] = 0;
        }
        this.timer = 0;
        // test call
        console.log("MIN POS: " + this.minimumPosOfLines);
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
    /*******************************************************************************************************/
    /*
    Author : 윤찬규
    Date : 2023-05-13
    Description : 좀비의 움직임과 관련된 함수들입니다. 
    */
    /*******************************************************************************************************/
    move(ctx) {
        for(let i = 0; i < 5; i++) {
            for(let j = 0; j < 100; j++) {
                if(this.zombies[i][j].hp > 0) {
                    this.zombies[i][j].move(ctx);
                    this.minimumPosOfLines[i] = Math.min(this.minimumPosOfLines[i], this.zombies[i][j].x);
                }
            }
        }
    }
    /*******************************************************************************************************/
}