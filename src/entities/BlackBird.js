import BodyType from "../enums/BodyType.js";
import GameEntity from "./GameEntity.js";
import {
	keys,
} from "../globals.js";
import Bird from "./Bird.js";
import { matter } from "../globals.js";
import Animation from "../../lib/Animation.js";
import Circle from "./Circle.js";
import Explosion from "./Explosion.js";

export default class BlackBird extends Bird {
	static SPRITE_MEASUREMENTS = [
		{ x: 410, y: 725, width: 62, height: 82 },
		{ x: 778, y: 446, width: 62, height: 82 },
		{ x: 715, y: 446, width: 62, height: 82 },
		{ x: 588, y: 446, width: 62, height: 82 },
		{ x: 651, y: 446, width: 62, height: 82 },
		{ x: 673, y: 353, width: 90, height: 90 },
	];
	static RADIUS = 30;

	/**
	 * A bird that will be launched at the pig fortress. The bird is a
	 * dynamic (i.e. non-static) Matter body meaning it is affected by
	 * the world's physics. We've given the bird a high restitution value
	 * so that it is bouncy. The label will help us manage this body later.
	 * The collision filter ensures that birds cannot collide with eachother.
	 * We've set the density to a value higher than the block's default density
	 * of 0.001 so that the bird can actually knock blocks over.
	 *
	 * @see https://brm.io/matter-js/docs/classes/Body.html#property_restitution
	 * @see https://brm.io/matter-js/docs/classes/Body.html#property_label
	 * @see https://brm.io/matter-js/docs/classes/Body.html#property_collisionFilter
	 * @see https://brm.io/matter-js/docs/classes/Body.html#property_density
	 *
	 * @param {number} x
	 * @param {number} y
	 */
	constructor(x, y) {
		super(x, y, BlackBird.RADIUS, {
			label: BodyType.Bird,
			density: 0.008,
			restitution: 0.8,
			collisionFilter: {
				group: -1,
			},
		});

		this.sprites = GameEntity.generateSprites(BlackBird.SPRITE_MEASUREMENTS);
		this.renderOffset = { x: -30, y: -50 };
		this.explode = false;
		this.charging = false;
		this.circles = [];
	}

	update(dt) {
		super.update(dt);

		if (!this.charging && super.didStop() && this.launched) {
			this.charging = true;
			this.currentAnimation = new Animation([1, 2, 3, 4, 5], 0.15, 1);
		}

		if (this.charging && !this.explode) {
			this.currentAnimation.update(dt);
			this.currentFrame = this.currentAnimation.currentFrame;

			if (this.doneCharging()) {
				this.explode = true;

				this.explosionAnimation = new Explosion(this.body.position.x, this.body.position.y);

				for (let index = 0; index < 6; index++) {
					this.circles.push(new Circle(this.body.position.x, this.body.position.y, BlackBird.RADIUS, {
						label: BodyType.Bird,
						density: 0.008,
						restitution: 0.8,
						collisionFilter: {
							group: -1,
						},
					}));

				}

				matter.Body.applyForce(this.circles[0].body, this.circles[0].body.position, { x: 0.0, y: 0.0 });
				matter.Body.applyForce(this.circles[1].body, this.circles[1].body.position, { x: 0.0, y: -0.6 });
				matter.Body.applyForce(this.circles[2].body, this.circles[2].body.position, { x: 0.3, y: 0.0 });
				matter.Body.applyForce(this.circles[3].body, this.circles[3].body.position, { x: -0.3, y: 0.0 });
				matter.Body.applyForce(this.circles[4].body, this.circles[4].body.position, { x: 0.2, y: -0.6 });
				matter.Body.applyForce(this.circles[5].body, this.circles[5].body.position, { x: -0.2, y: -0.6 });
			}
		}

		[...this.circles].forEach((entity) => entity.update(dt));

		if (this.explode) {
			this.explosionAnimation.update(dt);
		}
	}

	render() {
		[...this.circles].forEach((entity) => entity.render(true));

		if (this.explode) {
			this.explosionAnimation.render();
		}
		else {
			super.render();
		}
	}

	doneCharging() {
		return super.didStop() && this.currentAnimation.isDone();
	}


	didStop() {
		if (super.didStop() && this.currentAnimation.isDone() && this.explosionAnimation.currentAnimation.isDone()) {
			this.circles.forEach((circle) => circle.body.entity.shouldCleanUp = true);
			return true;
		}

		return false;
	}
}