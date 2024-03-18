var config = { //Налаштовуємо сцену
    type: Phaser.AUTO,
    worldWidth: 9600,
    height: 1080,
    pixelArt: true,
    debug: true,
    physics: { //Налаштовуємо фізику
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config)
var life = 5
var player
var platform
var score = 0
var scoreText
var worldWidth = config.worldWidth * 2
var star
var bombs
var alien
var spaceship
var record = 0

function preload() //Завантажуємо графіку для гри
{
    this.load.image('ground', 'assets/platform.png');
    this.load.image('kiwi', 'assets/kiwi.png');
    this.load.image('spaceship', 'assets/spaceship.png');
    this.load.image('alien', 'assets/alien.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('ground', 'assets/ground.png');
    this.load.image('fon+', 'assets/fon+.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude',
        'assets/dude.png',
        { frameWidth: 32, frameHeight: 32 }
    );
    this.load.spritesheet('dudeleft',
        'assets/dudeleft.png',
        { frameWidth: 32, frameHeight: 32 }
    );
}

function create() {


    //Додаемо небо
    this.add.tileSprite(0, 0, worldWidth, 1080, "fon+")
        .setOrigin(0, 0)
        .setScale(3)
        .setDepth(0);

    //Створюемо текст з рахунком
    //scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });

    //Ініціалізуємо курсор Phaser
    cursors = this.input.keyboard.createCursorKeys();

    //Створюемо фізичну групу
    platforms = this.physics.add.staticGroup();
    kiwi = this.physics.add.staticGroup();
    star = this.physics.add.group();
    alien = this.physics.add.group();
    spaceship = this.physics.add.group();

    //Створюемо платформи
    for (var x = 0; x < worldWidth; x = x + 400) {
        //console.log(x);
        platforms.create(x, 1080, 'ground').setOrigin(0, 0).refreshBody().setDepth(1);
    }

    for (let i = 0; i < 5; i++) {
        platforms.create(960 + i * 1920, 900, 'ground').refreshBody().setScale(1).setDepth(1);
    }
    //Створюємо об'єкти декорації
    for (let x = 0; x < worldWidth; x += Phaser.Math.FloatBetween(400, 750)) {
        star.create(x, 180, 'star')
            .setOrigin(0.5, 0.5)
            .setScale(Phaser.Math.FloatBetween(0.05, 0.1))
            .setDepth(Phaser.Math.Between(1, 10));
    }

    for (let x = 0; x < worldWidth; x += Phaser.Math.FloatBetween(1500, 2000)) {
        alien.create(x, 180, 'alien')
            .setOrigin(0.5, 0.5)
            .setScale(Phaser.Math.FloatBetween(0.3, 0.3))
            .setDepth(Phaser.Math.Between(1, 10));
    }

    for (let x = 0; x < worldWidth; x += Phaser.Math.FloatBetween(1000, 1250)) {
        spaceship.create(x, 180, 'spaceship')
            .setOrigin(0.5, 0.5)
            .setScale(Phaser.Math.FloatBetween(0.5, 1))
            .setDepth(Phaser.Math.Between(1, 10));
    }

    //Створюємо та налаштовуємо спрайт гравця
    player = this.physics.add.sprite(960, 1, 'dude').setScale(2).setDepth(4);
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    //Налаштування камери
    this.cameras.main.setBounds(0, 0, worldWidth, window.innerHeight);
    this.physics.world.setBounds(0, 0, worldWidth, window.innerHeight);

    //Слідкування камери за гравцем
    this.cameras.main.startFollow(player)

    //ківіси
    kiwi = this.physics.add.group({
        key: 'kiwi',
        repeat: 100,
        setXY: { x: 0, y: 0, stepX: 120 }

    });

    kiwi.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    //Створюемо та налаштовуємо фізичний об'єкт бомби
    bombs = this.physics.add.group(); 
 
    var bomb = bombs.create(x, 16, 'bomb'); 
    bomb.setBounce(1); 
    bomb.setCollideWorldBounds(true); 
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20); 
    bomb.allowGravity = false;

    //Змінено гравітацію гравця
    player.body.setGravityY(0)

    //Створюємо та налаштовуємо анімації
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dudeleft', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [{ key: 'dude', frame: 4 }],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    //рахунок
    scoreText = this.add.text(100, 100, 'Score: 0', { fontSize: '20px', fill: "#FFF" })
        .setOrigin(0, 0)
        .setScrollFactor(0)
        .setDepth(5)

    //кнопка перезапуску

    //Додано колізії
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(bomb, platforms);
    this.physics.add.collider(kiwi, platforms);
    this.physics.add.collider(star, platforms);
    this.physics.add.collider(alien, platforms);
    this.physics.add.collider(spaceship, platforms);
    this.physics.add.overlap(player, kiwi, collectKiwi, null, this);
    this.physics.add.collider(player, bombs, hitBomb, null, this);

}


function update() {
    //Керування персонажем
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('left', true);
    }
    else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('right', true);
    }
    else {
        player.setVelocityX(0);
        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
    }
}

function collectKiwi(player, kiwi) {
    kiwi.disableBody(true, true);
    score += 10;
    scoreText.setText('Score: ' + score);

    var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400); 
 
    var bomb = bombs.create(x, 16, 'bomb'); 
    bomb.setBounce(1); 
    bomb.setCollideWorldBounds(true); 
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20); 
    bomb.allowGravity = false; 

} 

function hitBomb(player, bomb) { 
this.physics.pause(); 

player.setTint(0xff0000); 

player.anims.play('turn'); 

gameOver = true; 
}
   