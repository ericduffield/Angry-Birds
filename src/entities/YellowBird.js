import BodyType from "../enums/BodyType.js";
import GameEntity from "./GameEntity.js";
import Bird from "./Bird.js";
import {
	keys,
} from "../globals.js";
import { matter } from "../globals.js";

export default class YellowBird extends Bird {
	static SPRITE_MEASUREMENTS = [{ x: 668, y: 879, width: 58, height: 54 }];
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
		super(x, y, YellowBird.RADIUS, {
			label: BodyType.Bird,
			density: 0.008,
			restitution: 0.8,
			collisionFilter: {
				group: -1,
			},
		});

		this.sprites = GameEntity.generateSprites(YellowBird.SPRITE_MEASUREMENTS);
		this.renderOffset = { x: -30, y: -32 };

		this.boosted = false;
	}

	update(dt) {
		super.update(dt);


		if (this.launched && keys[" "] && !this.boosted) {
			this.boosted = true;
			matter.Body.applyForce(this.body, this.body.position, { x: 0.5, y: 0.0 });
		}
	}
}