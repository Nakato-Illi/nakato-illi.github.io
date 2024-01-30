class Level1 extends Phaser.Scene {
    constructor() {
        super("playGame");
        this.resetCount = 0;
        this.canJump = true;
    }

    create() {
        this.background = this.add.tileSprite(0, 0, 1600, 1200, "background");

        // Check if other animations already exist and create them if not
        if (!this.anims.exists('left')) {
            this.anims.create({
                key: 'left',
                frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
                frameRate: 10,
                repeat: -1
            });
        }

        if (!this.anims.exists('turn')) {
            this.anims.create({
                key: 'turn',
                frames: [{ key: 'dude', frame: 4 }],
                frameRate: 20
            });
        }

        if (!this.anims.exists('right')) {
            this.anims.create({
                key: 'right',
                frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
                frameRate: 10,
                repeat: -1
            });
        }

        this.fly1 = this.physics.add.image(100, 100, "fly1");
        this.fly2 = this.physics.add.image(400, 100, "fly2");
        this.fly3 = this.physics.add.image(500, 100, "fly3");
        this.fly4 = this.physics.add.image(600, 100, "fly4");
        this.star = this.physics.add.image(770, 490, "star");

        this.live1 = this.add.image(720, 30, "leben");
        this.live2 = this.add.image(750, 30, "leben");
        this.live3 = this.add.image(690, 30, "leben");

        this.fire = this.add.image(400, 575, "fire");
        this.fire.setScale(2, 1);

        this.plate1 = this.add.rectangle(50, 564, 100, 90, 0x000000, .8).setOrigin(0.5, 0.5);
        this.plate2 = this.add.rectangle(750, 564, 100, 90, 0x000000, .8).setOrigin(0.5, 0.5);
        this.plate3 = this.add.rectangle(150, 444, 100, 50, 0x000000, .8).setOrigin(0.5, 0.5);
        this.plate4 = this.add.rectangle(250, 334, 40, 50, 0x000000, .8).setOrigin(0.5, 0.5);
        this.plate5 = this.add.rectangle(450, 334, 40, 50, 0x000000, .8).setOrigin(0.5, 0.5);
        this.plate6 = this.add.rectangle(550, 234, 40, 50, 0x000000, .8).setOrigin(0.5, 0.5);
        this.plate7 = this.add.rectangle(770, 450, 70, 10, 0x000000, .8).setOrigin(0.5, 0.5);

        this.physics.add.existing(this.plate1, true);
        this.physics.add.existing(this.plate2, true);
        this.physics.add.existing(this.plate3, true);
        this.physics.add.existing(this.plate4, true);
        this.physics.add.existing(this.plate5, true);
        this.physics.add.existing(this.plate6, true);
        this.physics.add.existing(this.plate7, true);
        this.physics.add.existing(this.fire, true);
        this.physics.add.existing(this.fly1, true);
        this.physics.add.existing(this.fly2, true);
        this.physics.add.existing(this.fly3, true);
        this.physics.add.existing(this.fly4, true);

        this.player = this.physics.add.sprite(20, 490, 'dude');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.player.body.setGravityY(500);
        this.physics.add.existing(this.player, true);

        this.physics.add.collider(this.player, [this.plate1, this.plate2, this.plate3, this.plate4, this.plate5, this.plate6, this.plate7]);

        this.physics.add.overlap(this.player, this.fire, this.resetGame, null, this);
        this.physics.add.overlap(this.player, this.fly1, this.resetGame, null, this);
        this.physics.add.overlap(this.player, this.fly2, this.resetGame, null, this);
        this.physics.add.overlap(this.player, this.fly3, this.resetGame, null, this);
        this.physics.add.overlap(this.player, this.fly4, this.resetGame, null, this);
        this.physics.add.overlap(this.player, this.star, this.nextLevel, null, this);


        this.add.text(20, 20, "Level 1", {font: "25px Arial", fill: "yellow"});
    }

    nextLevel() {
        this.scene.start("playGame2");
    }

    resetGame() {
        this.resetCount++;

        if (this.live1 && this.resetCount === 1) {
            this.live3.destroy();
        } else if (this.live2 && this.resetCount === 2) {
            this.live1.destroy();
        } else if (this.live3 && this.resetCount === 3) {
            this.live2.destroy();
        }

        if (this.resetCount >= 3) {
            this.resetCount = 0;
            // If reset count reaches 4, transition to the title scene
            this.scene.start("loseGame");
        } else {
            // Otherwise, restart the current scene
            this.player.setPosition(20, 490);
            this.fly1.setPosition(100, 100);
            this.fly2.setPosition(400, 100);
            this.fly3.setPosition(500, 100);
            this.fly4.setPosition(600, 100);
        }
    }

    moveFly(fly, speed) {
        fly.y += speed;
        if (fly.y >= config.height) {
            this.resetFlyPosition(fly)
        }
    }

    resetFlyPosition(fly) {
        fly.y = 0;
        var ranX = Phaser.Math.Between(0, config.width - 100);
        fly.x = ranX;
    }
    update() {
        // rufe methode moveShip auf, übergebe die ships und bewege sie unterschiedlich schnell
        this.moveFly(this.fly1, 5);
        this.moveFly(this.fly2, 3);
        this.moveFly(this.fly3, 4);
        this.moveFly(this.fly4, 6);

        this.background.tilePositionX += 0.3;

        this.cursors = this.input.keyboard.createCursorKeys();
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play('right', true);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }

        if (this.cursors.space.isDown && this.canJump) {
            this.player.setVelocityY(-330);
            this.canJump = false; // Nach dem Sprung die Variable auf false setzen
        }

        // Überprüfen Sie, ob der Spieler auf einer Plattform steht
        if (this.player.body.blocked.down) {
            this.canJump = true; // Erlaube dem Spieler zu springen, wenn er auf dem Boden ist
        }
    }
}