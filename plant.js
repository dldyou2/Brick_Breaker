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
    }

    attack() {
        
    }
    
    damaged(dmg) {
        this.hp -= dmg;
    }

    isAlive() {
        return this.hp > 0;
    }
}

export class Peashooter extends Plant {
    constructor(x, y, hp, dmg, atk_speed) {
        super(x, y, hp, dmg, atk_speed);
    }

    draw(ctx) {
        const img = new Image();
        img.src = "./images/Plants/peashooter.gif";
        ctx.beginPath();
        ctx.drawImage(img, this.x - img.width / 2, this.y - img.height / 2);
        ctx.closePath();
    }
}

export class Snowpea extends Plant {
    constructor(x, y, hp, dmg, atk_speed) {
        super(x, y, hp, dmg, atk_speed);
    }

    draw(ctx) {
        const img = new Image();
        img.src = "./images/Plants/snowpea.gif";
        ctx.beginPath();
        ctx.drawImage(img, this.x - img.width / 2, this.y - img.height / 2);
        ctx.closePath();
    }
}

export class Wallnut extends Plant {
    constructor(x, y, hp, dmg, atk_speed) {
        super(x, y, hp, dmg, atk_speed);
    }

    draw(ctx) {
        const img = new Image();
        img.src = "./images/Plants/wallnut.gif";
        ctx.beginPath();
        ctx.drawImage(img, this.x - img.width / 2, this.y - img.height / 2);
        ctx.closePath();
    }
}