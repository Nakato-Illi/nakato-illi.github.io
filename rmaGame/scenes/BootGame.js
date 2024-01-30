class BootGame extends Phaser.Scene {
    constructor() {
        super("bootGame");
    }

    preload() {
        // Loading all needed assets to game
        this.load.image("title", "assets/images/title.jpg");
        this.load.image("fire", "assets/images/fire.png");
        this.load.image("wasser", "assets/images/wasser.png");
        this.load.image("background", "assets/images/forest.jpg");
        this.load.image("win", "assets/images/win.jpg");
        this.load.image("lose", "assets/images/lose.jpg");
        this.load.image("fly1", "assets/images/fly1.png");
        this.load.image("fly2", "assets/images/fly2.png");
        this.load.image("fly3", "assets/images/fly3.png");
        this.load.image("fly4", "assets/images/fly4.png");
        this.load.image("leben", "assets/images/leben.png");
        this.load.image("star", "assets/images/star.png");

        this.load.spritesheet("butterfly", "assets/spritesheets/butterfly.png",{
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet('dude', "assets/spritesheets/dude.png", {
            frameWidth: 32, 
            frameHeight: 48 
        });

        this.load.audio("game_audio", "assets/audio/game-music-loop-6.ogg");
        this.load.audio("hit_sound", "assets/audio/mixkit-boxer-getting-hit-2055.ogg");
        this.load.audio("star_sound", "assets/audio/mixkit-bonus-earned-in-video-game-2058.ogg");
        this.load.audio("jump_sound", "assets/audio/mixkit-small-hit-in-a-game-2072.ogg");
        this.load.audio("lose_sound", "assets/audio/mixkit-player-losing-or-failing-2042.ogg");

    }

    create() {
        // adding background music to all Scenes
        this.bgMusic = this.sound.add("game_audio");
        var musicConfig = {
            mute: false,
            volume: 0.1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        }
        this.bgMusic.play(musicConfig);

        // Scene Text if game do not start
        this.add.text(20, 20, "Loading Game...");
        
        // start Game with the TitleScene
        this.scene.start("titleScene");
    }
}