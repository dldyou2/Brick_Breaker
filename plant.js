/*
    Author : 윤찬규
    Date : 2023-05-19
    Description : 식물 클래스

    기본 식물 모델입니다. 상속하여 여러 식물에 사용합니다.
*/
export class Plant {
    constructor(x, y, hp, dmg) {
        this.x = x;
        this.y = y;
        this.hp = hp;
        this.fullhp = hp;
        this.dmg = dmg;

        this.img = new Array();
        for (let i = 0; i < 7; i++) {
            this.img.push(new Image());
        }
        this.shadow = new Image();
        this.shadow.src = "./images/Plants/plantshadow.png";
        this.frame = 0;

        this.timer_HP = 0;

        this.ball = new Array();
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.drawImage(this.shadow, this.x - this.shadow.width / 2, this.y + 15);
        ctx.drawImage(this.img[this.frame], this.x - this.img[this.frame].width / 2, this.y - this.img[this.frame].height / 2);
        ctx.closePath();
    }

    drawHP(ctx) {
        if(this.timer_HP <= 0) return;
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = "black";
        ctx.strokeRect(this.x - this.img[this.frame].width / 2, this.y - this.img[this.frame].height / 2 - 15, this.img[this.frame].width, 10);
        ctx.fillStyle = "red";
        ctx.rect(this.x - this.img[this.frame].width / 2, this.y - this.img[this.frame].height / 2 - 15, this.img[this.frame].width *  (this.hp / this.fullhp), 10);
        ctx.fill();
        ctx.closePath();
        this.timer_HP--;
    }

    damaged(dmg) {
        this.hp -= dmg;
    }

    isAlive() {
        return this.hp > 0;
    }

    attack() {
        
    }
    /*
    Author : 윤찬규
    Date : 2023-05-23
    Description : gif 프레임을 넘깁니다.
    */
    nextFrame() {
        this.frame = (this.frame + 1) % 7;
        if(this.frame == 6) {
            this.attack();
        }
    }
}

export class Peashooter extends Plant {
    constructor(x, y, hp, dmg) {
        super(x, y, hp, dmg);
        this.#setImage();
    }

    #setImage() {
        for (let i = 0; i < 7; i++) {
            this.img[i].src = "./images/Plants/peashooter/peashooter_" + i + ".png";
        }
    }
    
    attack() {
        this.ball.push(new PlantBall(this.x - 35, this.y - 35, 5, "peashooter"));
    }
}

export class Snowpea extends Plant {
    constructor(x, y, hp, dmg) {
        super(x, y, hp, dmg);
        this.#setImage();
    }

    #setImage() {
        for (let i = 0; i < 7; i++) {
            this.img[i].src = "./images/Plants/snowpea/snowpea_" + i + ".png";
        }
    }

    attack() {
        this.ball.push(new PlantBall(this.x - 35, this.y - 35, 5, "snowpea"));
    }
}

export class Wallnut extends Plant {
    constructor(x, y, hp, dmg) {
        super(x, y, hp, dmg);
        this.#setImage();
    }

    #setImage() {
        for (let i = 0; i < 7; i++) {
            this.img[i].src = "./images/Plants/wallnut/wallnut_" + i + ".png";
        }
    }
}


class PlantBall {
    constructor(x, y, speed, src) {
        this.x = x;
        this.y = y;
        this.speed = speed;

        this.img = new Image();
        this.img.src = "./images/Plants/" + src + ".gif";
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.drawImage(this.img, this.x, this.y);
        ctx.closePath();
    }
}