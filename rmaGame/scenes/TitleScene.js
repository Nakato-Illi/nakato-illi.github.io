class TitleScene extends Phaser.Scene {
    constructor() {
        super("titleScene");
    }
    
    creat() {

    }
    
    update() {
        this.add.image(0, 0, 'title').setOrigin(0, 0).setDisplaySize(this.scale.width, this.scale.height);

        const title = this.add.text(400, 180, 'Way back home - NakaGame', {
            font: 'bold 48px Arial',
        });
        title.setOrigin(0.5, 0.5);

        const title_des = this.add.text(400, 250, 'Can you finde your way back home bevore it gets dark?', {
            fontSize: 35,
            wordWrap: { width: 700 }
        });
        title_des.setOrigin(0.5, 0.5);

        const start = this.add.text(400, 380, 'Press Space (once) to Start!', {
            font: 'bold 48px Arial',
        });
        start.setOrigin(0.5, 0.5);

        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start("playGame");
        });
    }
}