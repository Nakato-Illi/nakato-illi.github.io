class Level2 extends Phaser.Scene {
    constructor() {
        super("playGame2");
        this.resetCount = 0;
        this.canJump = true;
    }

    create() {
        this.background = this.add.tileSprite(0, 0, 1600, 1200, "background");

        this.player = this.physics.add.sprite(20, 490, 'dude');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.player.body.setGravityY(500);
        this.physics.add.existing(this.player, true);

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

        this.butter1 = this.physics.add.sprite(140, 400, "butterfly");
        this.butter1.setScale(2, 2);
        this.butter1.setFlipY(true);
        this.butter1.speed = 3;
        if (!this.anims.exists('fly1Animation')) {
            this.anims.create({
                key: 'fly1Animation',
                frames: this.anims.generateFrameNumbers('butterfly', { start: 0, end: 2 }),
                frameRate: 10,
                repeat: -1
            });
        }
        this.butter1.anims.play('fly1Animation');

        this.butter2 = this.physics.add.sprite(410, 170, "butterfly");
        this.butter2.setScale(2, 2);
        this.butter2.speed = 2;
        if (!this.anims.exists('fly2Animation')) {
            this.anims.create({
                key: 'fly2Animation',
                frames: this.anims.generateFrameNumbers('butterfly', { start: 6, end: 8 }),
                frameRate: 10,
                repeat: -1
            });
        }
        this.butter2.anims.play('fly2Animation');

        this.butter3 = this.physics.add.sprite(530, 270, "butterfly");
        this.butter3.setScale(2, 2);
        this.butter3.speed = 2;
        if (!this.anims.exists('fly3Animation')) {
            this.anims.create({
                key: 'fly3Animation',
                frames: this.anims.generateFrameNumbers('butterfly', { start: 6, end: 8 }),
                frameRate: 10,
                repeat: -1
            });
        }
        this.butter3.anims.play('fly3Animation');

        this.live1 = this.add.image(720, 30, "leben");
        this.live2 = this.add.image(750, 30, "leben");
        this.live3 = this.add.image(690, 30, "leben");

        this.plate1 = this.add.rectangle(50, 564, 150, 90, 0x000000, .8).setOrigin(0.5, 0.5);
        this.plate2 = this.add.rectangle(750, 564, 100, 90, 0x000000, .8).setOrigin(0.5, 0.5);
        this.plate3 = this.add.rectangle(175, 525, 100, 150, 0x000000, .8).setOrigin(0.5, 0.5);
        this.plate4 = this.add.rectangle(210, 325, 30, 250, 0x000000, .8).setOrigin(0.5, 0.5);
        this.plate5 = this.add.rectangle(60, 380, 120, 40, 0x000000, .8).setOrigin(0.5, 0.5);
        this.plate6 = this.add.rectangle(370, 375, 30, 450, 0x000000, .8).setOrigin(0.5, 0.5);
        this.plate7 = this.add.rectangle(545, 200, 320, 30, 0x000000, .8).setOrigin(0.5, 0.5);
        this.plate8 = this.add.rectangle(625, 300, 350, 30, 0x000000, .8).setOrigin(0.5, 0.5);
        this.plate9 = this.add.rectangle(410, 400, 50, 30, 0x000000, .8).setOrigin(0.5, 0.5);
        this.plate10 = this.add.rectangle(520, 500, 50, 30, 0x000000, .8).setOrigin(0.5, 0.5);
        this.plate11 = this.add.rectangle(620, 400, 50, 30, 0x000000, .8).setOrigin(0.5, 0.5);
        this.plate12 = this.add.rectangle(95, 280, 50, 30, 0x000000, .8).setOrigin(0.5, 0.5);
        this.plate13 = this.add.rectangle(770, 450, 70, 10, 0x000000, .8).setOrigin(0.5, 0.5);
        this.star = this.physics.add.image(770, 490, "star");
        this.water1 = this.physics.add.image(543, 575, "wasser");
        this.water2 = this.physics.add.image(290, 575, "wasser");
        this.water2.setScale(0.4, 1);

        this.physics.add.existing(this.plate1, true);
        this.physics.add.existing(this.plate2, true);
        this.physics.add.existing(this.plate3, true);
        this.physics.add.existing(this.plate4, true);
        this.physics.add.existing(this.plate5, true);
        this.physics.add.existing(this.plate6, true);
        this.physics.add.existing(this.plate7, true);
        this.physics.add.existing(this.plate8, true);
        this.physics.add.existing(this.plate9, true);
        this.physics.add.existing(this.plate10, true);
        this.physics.add.existing(this.plate11, true);
        this.physics.add.existing(this.plate12, true);
        this.physics.add.existing(this.plate13, true);
        this.physics.add.existing(this.water1, true);
        this.physics.add.existing(this.water2, true);

        this.physics.add.collider(this.player, [this.plate1, this.plate2, this.plate3, this.plate4, this.plate5, this.plate6, this.plate7, this.plate8, this.plate9, this.plate10, this.plate11, this.plate12, this.plate13]);

        this.physics.add.overlap(this.player, this.butter1, this.resetGame, null, this);
        this.physics.add.overlap(this.player, this.butter2, this.resetGame, null, this);
        this.physics.add.overlap(this.player, this.butter3, this.resetGame, null, this);
        this.physics.add.overlap(this.player, this.water1, this.resetGame, null, this);
        this.physics.add.overlap(this.player, this.water2, this.resetGame, null, this);
        this.physics.add.overlap(this.player, this.star, this.winGame, null, this);

        this.add.text(20, 20, "Level 2", {font: "25px Arial", fill: "yellow"});
    }

    winGame(){
        this.scene.start("winGame");
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
            this.butter1.setPosition(140, 400);
            this.butter2.setPosition(410, 170);
            this.butter3.setPosition(530, 270);
        }
    }


    update() {
        this.background.tilePositionX += 0.3;

        // Move the butterfly vertically between 100 and 400
        this.butter1.y += this.butter1.speed;

        // Reverse direction when reaching the top or bottom
        if (this.butter1.y >= 400) {
            this.butter1.setFlipY(false);
            this.butter1.speed = -3;
        }
        if (this.butter1.y <= 100) {
            this.butter1.setFlipY(true);
            this.butter1.speed = +3;
        }

        this.butter2.x += this.butter2.speed;
        if (this.butter2.x <= 410) {
            this.butter2.setFlipX(false);
            this.butter2.speed = +2;
        }
        if (this.butter2.x >= 710) {
            this.butter2.setFlipX(true);
            this.butter2.speed = -2;
        }

        this.butter3.x += this.butter3.speed;
        if (this.butter3.x <= 530) {
            this.butter3.setFlipX(false);
            this.butter3.speed = +2;
        }
        if (this.butter3.x >= 790) {
            this.butter3.setFlipX(true);
            this.butter3.speed = -2;
        }


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