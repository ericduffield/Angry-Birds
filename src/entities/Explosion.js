import GameEntity from "./GameEntity.js";
import Animation from "../../lib/Animation.js";

export default class Explosion {
    static SPRITE_MEASUREMENTS = [
        { x: 169, y: 513, width: 115, height: 111 },
        { x: 169, y: 400, width: 113, height: 110 },
        { x: 169, y: 277, width: 126, height: 122 },
        { x: 169, y: 155, width: 126, height: 122 },
    ];

    constructor(x, y) {
        this.x = x; this.y = y;
        this.sprites = GameEntity.generateSprites(Explosion.SPRITE_MEASUREMENTS);

        this.currentAnimation = new Animation([0, 1, 2], 0.15, 1);
    }

    update(dt) {
        this.currentAnimation.update(dt);
    }

    render() {
        this.sprites[this.currentAnimation.currentFrame].render(this.x - Explosion.SPRITE_MEASUREMENTS[this.currentAnimation.currentFrame].width / 2, this.y - Explosion.SPRITE_MEASUREMENTS[this.currentAnimation.currentFrame].height / 2);
    }
}