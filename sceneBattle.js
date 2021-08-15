let SceneBattle = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:
    function SceneBattle() {
        Phaser.Scene.call(this, { key: 'SceneBattle' });
    },

    preload: function () {
        console.log('Preload in battle scene');
        this.load.image('testCard', 'assets/testCard.png');
        this.load.image('testCardFire', 'assets/testCardFire.png');
        this.load.image('atomBomb', 'assets/atomBomb.png');
    },

    create: function () {
        this.testCard = new Card(this, testCardData, 200, 200);
        this.forest_Card = new Card(this, testCardData, 400, 200);
    },

    update: function (timestep, dt) {

    },

    receiveMessage: function (data) {
        console.log(data);
    },

});


let Card = new Phaser.Class({

    initialize:
    function Card(scene, data, x, y) {
        this.sprite = scene.add.image(x, y, 'testCardFire').setScale(0.5);
        this.data = data;

        this.image = scene.add.image(x, y - this.sprite.height / 4 + 32 + 32, data.image);
        this.image.setScale(64 / this.image.height); //Skalujemy obrazek, żeby jego wysokość wynosiła 64

        this.nameText = scene.add.text(0, 0, data.name, { font: "16px Arial", fill: "#ff0000", wordWrap: { width: this.sprite.width - 20 } });
        this.nameText.setOrigin(0.5, 0.5);
        this.nameText.x = x;
        this.nameText.y = y - this.sprite.height / 4 + 16;

        this.valueText = scene.add.text(0, 0, data.value, { font: "32px Arial", fill: "#000000", wordWrap: { width: this.sprite.width - 20 } });
        this.valueText.setOrigin(0.5, 0.5);
        this.valueText.x = x + this.sprite.width / 4 - 28;
        this.valueText.y = y + this.sprite.height / 4 - 28;

        // this.name
    },

});
