/*
Author: 윤찬규
Date: 2023-05-12
Description: 공 클래스

공의 위치 / 크기 / 이동 방향 / 속도 등을 저장 가능합니다.
*/
export class Ball {
    constructor(x, y, r, angle, speed, dmg) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.angle = angle;
        this.speed = speed;
        this.dmg = dmg;
        this.color = "red";
    }

    /*
    Author : 윤찬규
    Date : 2023-05-12
    Description : 도 -> 라디안 변환 함수

    private 함수입니다. 멤버에서만 접근 가능
    */
    #d2r(angle) {
        return Math.PI * angle / 180;
    }

    /*
    Author : 윤찬규
    Date : 2023-05-12
    Description : 공을 움직이는 함수입니다.

    왼쪽 벽을 제외한 나머지 벽들에 대한 반사와 각 / 속도에 따른 좌표 변화를 적용합니다.
    */
    move(ctx) {
        if(this.x + this.r >= 1400) {
            this.conflictLeftRight();
        } 
        else if(this.y - this.r <= 0 || 
            this.y + this.r >= 600) {
            this.angle = 360 - this.angle;
        } 
        this.nextPos();
        this.draw(ctx);
    }

    nextPos() {
        let radian = this.#d2r(this.angle);
        this.x += Math.cos(radian) * this.speed;
        this.y += Math.sin(radian) * this.speed; 
    }

    /*
    Author : 윤찬규 
    Date : 2023-05-12
    Description : 공을 그리는 함수입니다.

    context를 인자로 받아와서 해당 context에 그립니다.
    */
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(Math.floor(this.x), Math.floor(this.y), Math.floor(this.r), 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
    /*
    Author : 윤찬규
    Date : 2023-05-12
    Description : 공이 왼쪽 벽에 닿았는지 확인하는 함수입니다.

    닿으면 1 아니면 0을 리턴합니다. 벽의 기준은 해당 좌표값 왼쪽입니다.
    */
    isLeft() {
        return this.x <= 125;
    }

    /*
    Author : 윤찬규
    Date : 2023-05-12
    Description : 공이 막대와 충돌한 경우 공을 막대의 충돌 위치에 따라 반사시키는 함수입니다.

    ratio에 따라 각의 크기를 적용해주었다.
    */
    conflictStick(ratio) {
        this.angle = Math.floor((80 * ratio + 360)) % 360;
    }
    /*
    Author : 윤찬규
    Date : 2023-05-14
    Description : 공과 벽돌의 충돌 함수입니다.
    */
    conflictLeftRight() {
        this.angle = (540 - this.angle) % 360; 
        console.log("ball conflict [LEFT RIGHT]");
    }
    conflictTopBottom() {
        this.angle = 360 - this.angle;
        console.log("ball conflict [TOP BOTTOM]");
    }
}