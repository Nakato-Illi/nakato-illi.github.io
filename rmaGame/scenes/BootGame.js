class BootGame extends Phaser.Scene {
    constructor() {
        super("bootGame");
    }

    preload() {
        this.load.image("title", "assets/images/title.jpg");
        this.load.image("fire", "assets/images/fire.png");
        this.load.image("background", "assets/images/forest.jpg");
        this.load.image("fly1", "assets/images/fly1.png");
        this.load.image("fly2", "assets/images/fly2.png");
        this.load.image("fly3", "assets/images/fly3.png");
        this.load.image("fly4", "assets/images/fly4.png");
        this.load.image("leben", "assets/images/leben.png");

        this.load.spritesheet("butterfly", "assets/spritesheets/butterfly.png",{
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet('dude', "assets/spritesheets/dude.png", {
            frameWidth: 32, 
            frameHeight: 48 
        });
        
    }

    create() {
        this.add.text(20, 20, "Loading Game...");
        this.scene.start("playGame");
    }
}