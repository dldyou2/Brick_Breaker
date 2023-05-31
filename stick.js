/*
Author : 윤찬규 
Date : 2023-05-12
Description : 공을 튀기게 하는 막대입니다.
*/
export class Stick {
    constructor(x, y, width, height, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.color = "black";
    }

    /*
    Author : 윤찬규
    Date : 2023-05-12
    Description : flag가 1이면 위로 / -1이면 아래로 막대를 움직입니다.
    */
    move(ctx, flag) {
        if(flag == 1) {
            if(this.y > 0) {
                this.y -= this.speed;
            } 
        }
        else if(flag == -1){
            if(this.y < 600) {
                this.y += this.speed;
            }
        }
        this.draw(ctx);
    }

    mouseMove(ctx, y) {
        if(this.y < 0) this.y = 0;
        if(this.y > 600) this.y = 600;
        this.draw(ctx);
        this.y = y;
    }

    /*
    Author : 윤찬규 
    Date : 2023-05-12
    Description : 막대를 그리는 함수입니다.

    context를 인자로 받아와서 해당 context에 그립니다.
    */
    draw(ctx) {
        ctx.beginPath();
        ctx.rect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}