/*
Author : 윤찬규
Date : 2023-05-13
Description : 좀비 클래스

기본 좀비 모델입니다. 이후 이 클래스를 상속하여 특수 좀비들을 만듭니다. 
*/
export class stdZombie {
    constructor(x, y, width, height, speed, hp, dmg) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.hp = hp;
        this.fullhp = hp;
        this.dmg = dmg;
        this.color = "white";

        this.slow = 1;
        this.timer_HP = 0;

        this.img = new Array();
        for (let i = 0; i < 7; i++) {
            this.img.push(new Image());
        }
        this.frame = 0;
    }
    /*
    Author : 윤찬규
    Date : 2023-05-13
    Description : 좀비(벽돌)를 움직이는 함수입니다.

    식물이 있다면 움직이지 않고 move()가 아닌 attack()을 실행합니다.
    */
    move(ctx) {
        this.x -= this.speed * this.slow;
        this.draw(ctx);
    }

    /*
    Author : 윤찬규 
    Date : 2023-05-13
    Description : 좀비(벽돌)를 그리는 함수입니다.

    context를 인자로 받아와서 해당 context에 그립니다.
    */
    draw(ctx) {
        ctx.beginPath();
        const fixW = Math.floor(this.img[this.frame].width * 0.8);
        const fixH = Math.floor(this.img[this.frame].height * 0.8);
        ctx.drawImage(this.img[this.frame], this.x - fixW / 2, this.y - fixH / 2, fixW, fixH);
        ctx.closePath();
    }

    /*
    Author : 윤찬규
    Date : 2023-05-21
    Description : 좀비(벽돌)이 피격 시 잠시동안 체력을 보여줍니다.
    */
    drawHP(ctx) {
        if(this.timer_HP <= 0) return;
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = "black";
        ctx.strokeRect(this.x - this.width / 2, this.y - this.height / 2 - 15, this.width, 10);
        ctx.fillStyle = "red";
        ctx.rect(this.x - this.width / 2, this.y - this.height / 2 - 15, this.width *  (this.hp / this.fullhp), 10);
        ctx.fill();
        ctx.closePath();
        this.timer_HP--;
    }

    /*
    Author : 윤찬규
    Date : 2023-05-13
    Description : 좀비가 죽었는지 확인하는 함수입니다. 죽었다면 리스트에서 제거를 해주고, 해당 canvas를 지워줍시다.
    */
    isAlive() {
        return this.hp > 0;
    }

    /*
    Author : 윤찬규
    Date : 2023-05-13
    Description : 좀비가 맵의 왼쪽 끝에 도달했는지 확인하는 함수입니다. 
    */
    isEnd() {
        return this.x <= 125;
    }
    /*
    Author : 윤찬규
    Date : 2023-05-23
    Description : gif 프레임을 넘깁니다.
    */
    nextFrame() {
        this.frame = (this.frame + 1) % 7;
    }
}

export class Zombie extends stdZombie {
    constructor(x, y, width, height, speed, hp, dmg) {
        super(x, y, width, height, speed, hp, dmg);
        this.#setImage();
    }

    #setImage() {
        for (let i = 0; i < 7; i++) {
            this.img[i].src = "./images/Zombie/Zombie/Zombie_" + i + ".png";
        }
    }
}

export class ConeheadZombie extends stdZombie {
    constructor(x, y, width, height, speed, hp, dmg) {
        super(x, y, width, height, speed, hp, dmg);
        this.#setImage();
    }

    #setImage() {
        for (let i = 0; i < 7; i++) {
            this.img[i].src = "./images/Zombie/ConeheadZombie/ConeheadZombie_" + i + ".png";
        }
    }
}


export class BucketheadZombie extends stdZombie {
    constructor(x, y, width, height, speed, hp, dmg) {
        super(x, y, width, height, speed, hp, dmg);
        this.#setImage();
    }

    #setImage() {
        for (let i = 0; i < 7; i++) {
            this.img[i].src = "./images/Zombie/BucketheadZombie/BucketheadZombie_" + i + ".png";
        }
    }
}

