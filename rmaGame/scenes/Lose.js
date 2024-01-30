class Lose extends Phaser.Scene {
    constructor() {
        super("loseGame");
    }

    create() {
        this.add.image(0, 0, 'lose').setOrigin(0, 0).setDisplaySize(this.scale.width, this.scale.height);

        const lose_des = this.add.text(400, 250, 'No Way out and its getting dark...', {
            fontSize: 35,
            wordWrap: { width: 700 }
        })
        lose_des.setOrigin(0.5, 0.5);

        const start = this.add.text(400, 380, 'Press Space to go back to TitleScene!', {
            font: 'bold 38px Arial',
        })
        start.setOrigin(0.5, 0.5);

        this.add.text(20, 20, "You Lose", {
            font: "25px Arial", 
            fill: "yellow"
        });
    }
    update() {
        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start("titleScene");
        });
    }
}