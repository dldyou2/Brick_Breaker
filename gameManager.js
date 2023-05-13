/*
Author : 윤찬규
Date : 2023-05-13
Description : 게임을 관리하는 함수입니다.

난이도에 따른 좀비의 스폰, 웨이브 등을 관리합니다.
*/
export class gameManager {
    constructor(difficulty) {
        this.difficulty = difficulty;
        this.maxWave = 3;
        this.curWave = 1;
        this.spawnTime = 5;
    }
}