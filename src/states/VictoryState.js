import State from "../../lib/State.js";
import GameStateName from "../enums/GameStateName.js";
import LevelMaker from "../services/LevelMaker.js";
import {
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	context,
	keys,
	stateMachine,
	images
} from "../globals.js";
import ImageName from "../enums/ImageName.js";
import Sprite from "../../lib/Sprite.js";

export default class VictoryState extends State {
	/**
	 * Displays a game over screen where the player
	 * can press enter to go back to the title screen.
	 */
	constructor() {
		super();
	}

	enter(parameters) {
		this.background = parameters.background;
		this.level = parameters.level;
		this.birdsUsed = parameters.birdsUsed;
	}

	update() {
		if (keys.Enter) {
			keys.Enter = false;

			stateMachine.change(GameStateName.Play, {
				background: this.background,
				level: LevelMaker.createLevel(this.level + 1),
			});
		}
	}

	render() {
		this.background.render();

		context.save();
		context.font = '300px AngryBirds';
		context.fillStyle = 'black';
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		context.fillText('Victory!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 90);
		context.fillStyle = 'limegreen';
		context.fillText('Victory!', CANVAS_WIDTH / 2 + 10, CANVAS_HEIGHT / 2 - 80);
		context.font = '100px AngryBirds';

		let starPlaceholder = images.get(ImageName.StarPlaceholder);
		let star = images.get(ImageName.Star);
		context.drawImage(starPlaceholder.image, (context.canvas.width - starPlaceholder.width) / 2, context.canvas.height / 2 + 15);

		if (this.birdsUsed <= 2) {
			context.drawImage(star.image, (context.canvas.width - starPlaceholder.width) / 2 + 25, 448, star.width - 10, star.height - 10);
			if (this.birdsUsed <= 1) {
				context.drawImage(star.image, (context.canvas.width - star.width - 20) / 2, 400, star.width + 10, star.height + 10);
				if (this.birdsUsed <= 0) {
					context.drawImage(star.image, context.canvas.width / 2 + 134, 448, star.width - 10, star.height - 10);
				}
			}
		}

		context.fillStyle = 'white';
		context.fillText('Press Enter to Continue', CANVAS_WIDTH / 2, CANVAS_HEIGHT - 80);
		context.restore();
	}
}
