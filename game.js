var config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FULLSCREEN,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

function preload() {
    this.load.image('background', 'assets/background.png');
}

function create() {
    this.add.image(0, 0, 'background').setOrigin(0);
}

function update() {
    // ваша логіка оновлення
}
