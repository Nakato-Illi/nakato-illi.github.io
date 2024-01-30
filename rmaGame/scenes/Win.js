class Win extends Phaser.Scene {
    constructor() {
        super("winGame");
    }

    create() {
        // Background image
        this.add.image(0, 0, "win").setOrigin(0, 0).setDisplaySize(this.scale.width, this.scale.height);

        // Scene Text
        this.add.text(20, 20, "You Win", {
            font: "25px Arial", 
            fill: "yellow"
        });

        const winDescription = this.add.text(400, 250, "There is the way back Home! You made it", {
            fontSize: 35,
            wordWrap: { width: 700 }
        });
        winDescription.setOrigin(0.5, 0.5);

        const startText = this.add.text(400, 380, "Press Space to go back to TitleScene!", {
            font: "bold 38px Arial",
        });
        startText.setOrigin(0.5, 0.5);
    }

    update() {
        // Check for space key press to transition to TitleScene
        this.input.keyboard.once("keydown-SPACE", () => {
            this.scene.start("titleScene");
        });
    }
}
