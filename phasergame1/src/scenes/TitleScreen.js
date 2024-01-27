import Phaser from 'phaser'

import {Game} from "../consts/SceneKeys";

import WebFontFile from "./WebFontFile";
import TitleImage from "../assets/images/title.jpg"

export default class TitleScreen extends Phaser.Scene {
    preload() {
        this.load.image('title', TitleImage);
        // is font loaded
        const fonts = new WebFontFile(this.load, 'Permanent Marker');
        this.load.addFile(fonts);
    }

    create() {
        // Display title screen background
        this.add.image(0, 0, 'title').setOrigin(0, 0).setDisplaySize(this.scale.width, this.scale.height);

        const title = this.add.text(400, 180, 'Way back home - NakaGames', {
            fontSize: 48,
            fontFamily: '"Permanent Marker"'
        })
        title.setOrigin(0.5, 0.5);

        const start = this.add.text(400, 250, 'bla press Space to start', {
            fontSize: 40,
            fontFamily: '"Permanent Marker"'
        })
        start.setOrigin(0.5, 0.5);

        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start(Game)
        });

    }
}