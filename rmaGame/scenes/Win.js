class Win extends Phaser.Scene {
    constructor() {
        super("winGame");
    }

    create() {
        this.add.image(0, 0, 'win').setOrigin(0, 0).setDisplaySize(this.scale.width, this.scale.height);

        const lose_des = this.add.text(400, 250, 'There is the way back Home! You made it', {
            fontSize: 35,
            wordWrap: { width: 700 }
        })
        lose_des.setOrigin(0.5, 0.5);

        const start = this.add.text(400, 380, 'Press Space to go back to TitleScene!', {
            font: 'bold 38px Arial',
        })
        start.setOrigin(0.5, 0.5);

        this.add.text(20, 20, "You Win", {font: "25px Arial", fill: "yellow"});
    }
    update() {
        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start("titleScene");
        });
    }
}