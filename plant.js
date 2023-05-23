/*
    Author : 윤찬규
    Date : 2023-05-19
    Description : 식물 클래스

    기본 식물 모델입니다. 상속하여 여러 식물에 사용합니다.
*/
export class Plant {
    constructor(x, y, hp, dmg, atk_speed) {
        this.x = x;
        this.y = y;
        this.hp = hp;
        this.dmg = dmg;
        this.atk_speed = atk_speed;

        this.img = new Array();
        for (let i = 0; i < 7; i++) {
            this.img.push(new Image());
        }
        this.frame = 0;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.drawImage(this.img[this.frame], this.x - this.img[this.frame].width / 2, this.y - this.img[this.frame].height / 2);
        ctx.closePath();
    }

    attack() {
        
    }
    
    damaged(dmg) {
        this.hp -= dmg;
    }

    isAlive() {
        return this.hp > 0;
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

export class Peashooter extends Plant {
    constructor(x, y, hp, dmg, atk_speed) {
        super(x, y, hp, dmg, atk_speed);
        this.#setImage();
    }

    #setImage() {
        for (let i = 0; i < 7; i++) {
            this.img[i].src = "./images/Plants/peashooter/peashooter_" + i + ".png";
        }
    }
}

export class Snowpea extends Plant {
    constructor(x, y, hp, dmg, atk_speed) {
        super(x, y, hp, dmg, atk_speed);
        this.#setImage();
    }

    #setImage() {
        for (let i = 0; i < 7; i++) {
            this.img[i].src = "./images/Plants/snowpea/snowpea_" + i + ".png";
        }
    }
}

export class Wallnut extends Plant {
    constructor(x, y, hp, dmg, atk_speed) {
        super(x, y, hp, dmg, atk_speed);
        this.#setImage();
    }

    #setImage() {
        for (let i = 0; i < 7; i++) {
            this.img[i].src = "./images/Plants/wallnut/wallnut_" + i + ".png";
        }
    }
}