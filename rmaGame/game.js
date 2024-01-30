var config = {
    width: 800,
    height: 600,
    backgroundColor: 0x345345,
    scene: [BootGame, TitleScene, Level1, Level2, Lose, Win],
    pixeArt: true,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 },
        }
    }

}

var game = new Phaser.Game(config);
