// Our game scene
var scene = new Phaser.Scene("game");

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: 0x234232,
    scene : scene
};

// Create the game with our config values
// this will also inject our canvas element into the HTML source
// for us
var game = new Phaser.Game(config);