let SceneVictory = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:
    function SceneTemplate() {
        Phaser.Scene.call(this, { key: 'SceneVictory' });
    },

    init: function (data) {
        console.log(data);
        this.victor = data.victor; //Gracz, który wygrał
        this.userWon = this.victor.id === drone.clientId; //Czy wygrał użytkownik
        this.element = data.element; //Element, za pomocą którego nastąpiła wygrana
    },

    preload: function () {
        console.log('Preload in victory scene');
        this.load.image('sym_icon_forest', 'assets/forest_icon.png');
        this.load.image('sym_icon_fire', 'assets/fire_icon.png');
        this.load.image('sym_icon_water', 'assets/water_icon.png');
    },

    create: function () {
        let width = this.sys.game.canvas.width;
        let height = this.sys.game.canvas.height;

        this.background = this.add.rectangle(0, 0, width, height, ELEMENT.info[this.element].color);
        this.background.setOrigin(0, 0);

        let particle = this.add.particles(ELEMENT.info[this.element].symbol);

        this.emitter = particle.createEmitter({
            speed: 500,
            scale: { start: 1, end: 0 },
            blendMode: 'ADD',
            lifespan: 2500,
            angle: { min: 270 - 60, max: 270 + 60 },
        });
        this.emitter.setPosition(width / 2, height);
        this.emitter.on = true;

        this.victoryText = this.add.text(width / 2, height / 2, this.victor.clientData.name + " wygrywa!", { font: "64px Arial", fill: "#ffffff" });
        this.victoryText.setOrigin(0.5, 0.5);
    },

    update: function (timestep, dt) {

    },

    receiveMessage: function (data) {
        console.log(data);
    },

});