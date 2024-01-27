import Phaser from 'phaser'
import gameBackground from '../assets/images/game-bg.jpg'
export default class GameBackground extends Phaser.Scene {

    preload() {
        // bg image
        this.load.image('gameb', gameBackground);
    }

    create() {
        // Display title screen background
        this.add.image(0, 0, 'gameb').setOrigin(0, 0).setDisplaySize(this.scale.width, this.scale.height);
        // this.obs1 = this.add.rectangle(200, 430, 70, 90, 0x663300, .9).setOrigin(0.5, 0.5);
        // this.obs2 = this.add.rectangle(280, 400, 90, 150, 0x663300, .9).setOrigin(0.5, 0.5);
        // this.obs3 = this.add.rectangle(350, 315, 50, 320, 0x663300, .9).setOrigin(0.5, 0.5);
        // this.obs4 = this.add.rectangle(465, 315, 50, 320, 0x663300, .9).setOrigin(0.5, 0.5);
        //
        // this.obs5 = this.add.rectangle(140, 240, 200, 40, 0x663300, .9).setOrigin(0.5, 0.5);
        // this.obs6 = this.add.rectangle(575, 135, 270, 40, 0x663300, .9).setOrigin(0.5, 0.5);
        // this.obs7 = this.add.rectangle(680, 235, 230, 40, 0x663300, .9).setOrigin(0.5, 0.5);
        //
        // this.obs8 = this.add.rectangle(515, 455, 50, 40, 0x663300, .9).setOrigin(0.5, 0.5);
        // this.obs9 = this.add.rectangle(655, 455, 50, 40, 0x663300, .9).setOrigin(0.5, 0.5);
        // this.obs10 = this.add.rectangle(775, 455, 50, 40, 0x663300, .9).setOrigin(0.5, 0.5);

    }
}