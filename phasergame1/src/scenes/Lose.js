import Phaser from 'phaser'

import {Game} from "../consts/SceneKeys";

import WebFontFile from "./WebFontFile";
import LoseImage from "../assets/images/lose.jpg"

export default class WinningScreen extends Phaser.Scene {
    preload() {
        this.load.image('lose', LoseImage);
        // is font loaded
        const fonts = new WebFontFile(this.load, 'Permanent Marker');
        this.load.addFile(fonts);
    }

    create() {
        // Display title screen background
        this.add.image(0, 0, 'lose').setOrigin(0, 0).setDisplaySize(this.scale.width, this.scale.height);

        const loseText = this.add.text(400, 180, 'it is getting late to see the way!', {
            fontSize: 35,
            fontFamily: '"Permanent Marker"'
        })
        loseText.setOrigin(0.5, 0.5);

        const start = this.add.text(400, 250, 'press Space to restart', {
            fontSize: 40,
            fontFamily: '"Permanent Marker"'
        })
        start.setOrigin(0.5, 0.5);

        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start(Game)
        });

    }
}