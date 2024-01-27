import Phaser from 'phaser'

import WebFontFile from "./WebFontFile";

import { GameBackground } from "../consts/SceneKeys";
import { WinningScreen } from "../consts/SceneKeys";
import { LosingScreen } from "../consts/SceneKeys";

import Dude from "../assets/images/dude.png";
import Wasser from "../assets/images/wasser.png";

class Game extends Phaser.Scene {

    init() {
        this.scoreLable = 0
        this.paused = false
    }

    preload() {
        const fonts = new WebFontFile(this.load, 'Permanent Marker');
        this.load.addFile(fonts);
        this.load.image('water', Wasser);
        this.load.spritesheet('dude', Dude, { frameWidth: 32, frameHeight: 48 });
    }

    create() {

        // The player and its settings
        this.player = this.physics.add.sprite(100, 450, 'dude');
        const water = this.add.image(400, 200, 'water').setOrigin(0, 0);
        water.setScale(0.5);
        //  Player physics properties. Give the little guy a slight bounce.
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        // Set gravity for the player
        this.player.body.setGravityY(500);

        //  Our player animations, turning, walking left and walking right.
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        // TODO Hindernis das sich automatisch bewegt
        // Set the ball as immovable
        this.opponent1 = this.add.circle(40, 100, 10, 0xffffff, 1);
        this.physics.add.existing(this.opponent1);
        this.opponent1.body.setImmovable(true);
        this.opponent1.body.setBounce(1, 1);
        this.opponent1.body.setCollideWorldBounds(true, 1, 1);
        this.opponent1.body.setVelocityX(120, 0);

        // Set opponent2 as immovable
        this.opponent2 = this.add.circle(40, 200, 10, 0xffffff, 1);
        this.physics.add.existing(this.opponent2);
        this.opponent2.body.setImmovable(true);
        this.opponent2.body.setBounce(1, 1);
        this.opponent2.body.setCollideWorldBounds(true, 1, 1);
        this.opponent2.body.setVelocityX(120, 0);

        // Set opponent3 as immovable
        this.opponent3 = this.add.circle(260, 20, 10, 0xffffff, 1);
        this.physics.add.existing(this.opponent3);
        this.opponent3.body.setImmovable(true);
        this.opponent3.body.setBounce(1, 1);
        this.opponent3.body.setCollideWorldBounds(true, 1, 1);
        this.opponent3.body.setVelocityY(90);

        // moving Obstacle
        this.obs = this.add.rectangle(140, 240, 200, 40, 0x663300, .9).setOrigin(0.5, 0.5);
        this.physics.add.existing(this.obs);
        this.obs.body.setImmovable(true);
        this.obs.body.setBounce(1, 1);
        this.obs.body.setCollideWorldBounds(true, 1, 1);
        this.obs.body.setVelocityY(120);

        // Obstacle 1 von 7 + Ground
        this.obs1 = this.add.rectangle(200, 430, 70, 90, 0x663300, .9).setOrigin(0.5, 0.5);
        this.obs2 = this.add.rectangle(280, 400, 90, 150, 0x663300, .9).setOrigin(0.5, 0.5);
        this.obs3 = this.add.rectangle(350, 315, 50, 320, 0x663300, .9).setOrigin(0.5, 0.5);
        this.obs4 = this.add.rectangle(465, 315, 50, 320, 0x663300, .9).setOrigin(0.5, 0.5);
        this.obs6 = this.add.rectangle(575, 135, 270, 40, 0x663300, .9).setOrigin(0.5, 0.5);
        this.obs7 = this.add.rectangle(680, 235, 230, 40, 0x663300, .9).setOrigin(0.5, 0.5);
        this.obs8 = this.add.rectangle(515, 455, 50, 40, 0x663300, .9).setOrigin(0.5, 0.5);
        this.obs9 = this.add.rectangle(775, 455, 50, 40, 0x663300, .9).setOrigin(0.5, 0.5);

        this.ground = this.add.rectangle(400, 485, 800, 20, 0xffffff).setOrigin(0.5, 0.5);

        this.physics.add.existing(this.ground, true);


        this.physics.add.existing(this.obs, true);
        this.physics.add.existing(this.obs1, true);
        this.physics.add.existing(this.obs2, true);
        this.physics.add.existing(this.obs3, true);
        this.physics.add.existing(this.obs4, true);
        this.physics.add.existing(this.obs6, true);
        this.physics.add.existing(this.obs7, true);
        this.physics.add.existing(this.obs8, true);
        this.physics.add.existing(this.obs9, true);


        // Enable collisions between the player and other objects
        this.physics.add.collider(this.player, this.ground);
        this.physics.add.collider(this.player, this.obs);
        this.physics.add.collider(this.player, this.obs1);
        this.physics.add.collider(this.player, this.obs2);
        this.physics.add.collider(this.player, this.obs3);
        this.physics.add.collider(this.player, this.obs4);
        this.physics.add.collider(this.player, this.obs6); 
        this.physics.add.collider(this.player, this.obs7);
        this.physics.add.collider(this.player, this.obs8);
        this.physics.add.collider(this.player, this.obs9);
        this.physics.add.collider(this.player, this.opponent1);
        this.physics.add.collider(this.player, this.opponent2);
        this.physics.add.collider(this.player, this.opponent3);

        // TODO Score, der sich nach irgendwas richtet
        this.scoreLabel = this.add.text(400, 20, 'Time: 0', {
            fontSize: 28,
            fontFamily: '"Permanent Marker"'
        }).setOrigin(0.5, 0.5);

        this.input.keyboard.once('keydown-W', () => {
            this.scene.start(WinningScreen);
        });

        this.input.keyboard.once('keydown-L', () => {
            this.scene.start(LosingScreen);
        });

        this.scene.run(GameBackground);
    }

    update() {
        if (this.opponent1.x <= 460) {
            this.opponent1.x = 460;
            this.opponent1.body.setVelocityX(120); // Reverse the velocity
        } else if (this.opponent1.x >= 700) {
            this.opponent1.x = 700;
            this.opponent1.body.setVelocityX(-150); // Reverse the velocity
        }

        if (this.opponent2.x <= 660) {
            this.opponent2.x = 660;
            this.opponent2.body.setVelocityX(120); // Reverse the velocity
        } else if (this.opponent2.x >= 800) {
            this.opponent2.x = 800;
            this.opponent2.body.setVelocityX(-150); // Reverse the velocity
        }

        if (this.opponent3.y <= 60) {
            this.opponent3.y = 60;
            this.opponent3.body.setVelocityY(120); // Reverse the velocity
        } else if (this.opponent3.y >= 250) {
            this.opponent3.y = 250;
            this.opponent3.body.setVelocityY(-150); // Reverse the velocity
        }

        if (this.obs.y <= 100) {
            this.obs.y = 100;
            this.obs.body.setVelocityY(100); // Reverse the velocity
        } else if (this.obs.y >= 270) {
            this.obs.y = 270;
            this.obs.body.setVelocityY(-100); // Reverse the velocity
        }

        this.cursors = this.input.keyboard.createCursorKeys();
        if (this.cursors.left.isDown)
        {
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.setVelocityX(160);
            this.player.anims.play('right', true);
        }
        else
        {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }

        this.input.keyboard.once('keydown-SPACE', () => {
            this.player.setVelocityY(-330);
        });
    }

}

export default Game