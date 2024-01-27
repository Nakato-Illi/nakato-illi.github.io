import Phaser from 'phaser'

import {Game} from "../consts/SceneKeys";

import WebFontFile from "./WebFontFile";
import WinImage from "../assets/images/win.jpg"

export default class WinningScreen extends Phaser.Scene {
    preload() {
        this.load.image('win', WinImage);
        // is font loaded
        const fonts = new WebFontFile(this.load, 'Permanent Marker');
        this.load.addFile(fonts);
    }

    create() {
        // Display title screen background
        this.add.image(0, 0, 'win').setOrigin(0, 0).setDisplaySize(this.scale.width, this.scale.height);

        const winText = this.add.text(400, 180, 'Congratulation on your way back home!', {
            fontSize: 35,
            fontFamily: '"Permanent Marker"'
        })
        winText.setOrigin(0.5, 0.5);

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