class TitleScene extends Phaser.Scene {
    constructor() {
        super("titleScene");
    }

    create() {
        // Background image
        this.add.image(0, 0, "title").setOrigin(0, 0).setDisplaySize(this.scale.width, this.scale.height);

        // Scene text
        const title = this.add.text(400, 180, "Way back home - NakaGame", {
            font: "bold 48px Arial",
        });
        title.setOrigin(0.5, 0.5);
        
        const titleDescription = this.add.text(400, 250, "Can you find your way back home before it gets dark?", {
            fontSize: 35,
            wordWrap: { width: 700 }
        });
        titleDescription.setOrigin(0.5, 0.5);
        
        const startText = this.add.text(400, 380, "Press Space to Start!", {
            font: "bold 48px Arial",
        });
        startText.setOrigin(0.5, 0.5);

        // Event listener for space key press to start the game
        this.input.keyboard.once("keydown-SPACE", () => {
            this.scene.start("playGame");
        });
    }
}
