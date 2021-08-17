let SceneBattle = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:
    function SceneBattle() {
        Phaser.Scene.call(this, { key: 'SceneBattle' });
    },

    preload: function () {
        console.log('Preload in battle scene');
        //Bazowe karty. Muszą być rozmiaru 1300x800 (przynajmniej dopóki nie napiszemy Card ładniej)
        this.load.image('card_fire', 'assets/card_fire.png');
        this.load.image('card_forest', 'assets/card_forest.png');
        this.load.image('card_water', 'assets/card_water.png');

        //Obrazki kart
        this.load.image('im_fire_1', 'assets/fire_1.png');
        this.load.image('im_fire_12', 'assets/fire_12.png');
        this.load.image('im_forest_1', 'assets/forest_1.png');
        this.load.image('im_forest_13', 'assets/forest_13.png');
        this.load.image('im_water_1', 'assets/water_1.png');
        this.load.image('im_plus5_forest', 'assets/plus5_forest.png');
        this.load.image('im_minus5_fire', 'assets/minus5_fire.png');
        this.load.image('im_replace1_water', 'assets/replace1_water.png');
        this.load.image('im_weaker_fire', 'assets/weaker_fire.png');
        this.load.image('im_only_values', 'assets/only_values.png');
    },

    create: function () {
        /*this.fire_1 = new Card(this, fire_1, 200, 200, 0.2);
        this.forest_1 = new Card(this, forest_1, 400, 200, 0.2);
        this.water_1 = new Card(this, water_1, 600, 200, 0.2);
        this.forest_13 = new Card(this, forest_13, 800, 200, 0.2);
        this.fire_12 = new Card(this, fire_12, 1000, 200, 0.2);
        this.plus5_forest = new Card(this, plus5_forest, 200, 500, 0.2);
        this.minus5_fire = new Card(this, minus5_fire, 400, 500, 0.2);
        this.replace1_water = new Card(this, replace1_water, 600, 500, 0.2);
        this.weaker_fire = new Card(this, weaker_fire, 800, 500, 0.2);
        this.only_values_forest = new Card(this, only_values_forest, 1000, 500, 0.2);*/

        this.testDeck = [fire_1, forest_1, water_1, forest_13, fire_12, plus5_forest, minus5_fire, replace1_water, weaker_fire, only_values_forest, fire_1, forest_1, water_1, forest_13, fire_12, plus5_forest, minus5_fire, replace1_water, weaker_fire, only_values_forest];
        Phaser.Actions.Shuffle(this.testDeck);
        this.testHand = new Hand(this, 5, this.testDeck);
    },
    update: function (timestep, dt) {

    },

    receiveMessage: function (data) {
        console.log(data);
    },

});

let Card = new Phaser.Class({

    initialize:
    function Card(scene, data, x, y, scale) {
        this.scale = scale;
        this.data = data; //Informacje o karcie (żywioł, wartość itp.)
        this.visual = scene.add.container(x, y); //Wizualne elementy karty

        switch (data.element) {
            case 'fire': this.sprite = scene.add.image(0, 0, 'card_fire').setScale(scale); break;
            case 'forest': this.sprite = scene.add.image(0, 0, 'card_forest').setScale(scale); break;
            case 'water': this.sprite = scene.add.image(0, 0, 'card_water').setScale(scale); break;
        }

        this.outline = scene.add.rectangle(0, 0, this.sprite.width * scale + 4, this.sprite.height * scale + 4, 0xffffff);
        this.outline.setDepth(-5);
        this.outline.setVisible(false);

        this.image = scene.add.image(0, - 200 * scale, data.image).setScale(scale);
        //this.image.setScale(64 / this.image.height); //Skalujemy obrazek, żeby jego wysokość wynosiła 64

        //this.nameTextfont = (100 * scale).toString() + "px Arial";
        this.nameTextfont = ((100 * 12 / (Math.max(data.name.length - 12, 0) + 12)) * scale).toString() + "px Arial";
        this.nameText = scene.add.text(0, 0, data.name, { font: this.nameTextfont, fill: "#000000" });
        this.nameText.setOrigin(0.5, 0.5);
        //this.nameText.x = x;
        this.nameText.y = - 525 * scale;

        this.valueTextfont = "bold " + (140 * scale).toString() + "px Arial";
        this.valueText = scene.add.text(0, 0, data.value, { font: this.valueTextfont, fill: "#000000" });
        this.valueText.setOrigin(0.5, 0.5);
        //this.valueText.x = x;
        this.valueText.y = 585 * scale;

        this.effectTextfont = (60 * scale).toString() + "px Arial";
        this.effectText = scene.add.text(0, 0, Get_effect_string(data.effect), { font: this.effectTextfont, fill: "#000000", wordWrap: { width: 700 * scale }, align: 'left' });
        this.effectText.setOrigin(0, 0);
        this.effectText.x = - 325 * scale;
        this.effectText.y = + 75 * scale;

        this.flavourTextfont = "italic " + (60 * scale).toString() + "px Arial";
        this.flavourText = scene.add.text(0, 0, data.flavour, { font: this.flavourTextfont, fill: "#000000", wordWrap: { width: 700 * scale }, align: 'left' });
        this.flavourText.setOrigin(0, 0);
        this.flavourText.x = - 325 * scale;
        this.flavourText.y = + 400 * scale;

        this.visual.add([this.outline, this.sprite, this.image, this.nameText, this.valueText, this.effectText, this.flavourText]);

        this.sprite.setInteractive().on('pointerup', () => {
            console.log("Kilknięto " + this.nameText.text);
        });

        this.sprite.on('pointerover', () => {
            this.visual.setScale(1.05);
            this.visual.y -= 10;
            this.outline.setVisible(true);
            //TODO Zmiana 'depth', przy ręce z wieloma kartami
        });
        this.sprite.on('pointerout', () => {
            this.visual.setScale(1);
            this.visual.y += 10;
            this.outline.setVisible(false);
        })

        // this.name
    },

});

let Hand = new Phaser.Class({
    params: {
        cardScale: 0.2,
        cardBaseWidth: 800,
        cardBaseHeight: 1300,
        cardPadding: 16,
        bottomPadding: 32,
    },

    initialize:
    function Hand(scene, size, deck) {
        this.size = size;
        this.cards = [];
        this.deck = deck;
        this.cardY = scene.sys.game.canvas.height - this.params.cardBaseHeight * this.params.cardScale / 2 - this.params.bottomPadding;
        console.assert(size > 0);
        console.assert(deck.length >= size);
        while (this.cards.length < this.size) {
            this.drawCard(scene);
        }
    },

    drawCard: function (scene) {
        this.cards.push(new Card(scene, this.deck.pop(), 0, this.cardY, this.params.cardScale));
        this.repositionCards(scene);
    },

    removeCard: function (scene, card) {
        let i = this.cards.indexOf(card);
        console.assert(i >= 0);
        let removed = this.cards.splice(i, 1);
        removed[0].visual.removeAll(true); //Usuwa wszystkie obrazki i tekst należące do karty
        this.repositionCards(scene);
    },

    repositionCards: function (scene) {
        let cardWidth = this.params.cardBaseWidth * this.params.cardScale;
        let padding = this.params.cardPadding;
        let fullWidth = this.cards.length * cardWidth + (this.cards.length - 1) * padding;
        let screenWidth = scene.sys.game.canvas.width;
        if (fullWidth <= screenWidth) {
            for (let i = 0; i < this.cards.length; i++) {
                this.cards[i].visual.x = screenWidth / 2 - fullWidth / 2 + i * (cardWidth + padding) + cardWidth / 2;
            }
        } else {
            console.warn("Ręka nie miejści się na ekranie");
            for (let i = 0; i < this.cards.length; i++) {
                this.cards[i].visual.x = cardWidth / 2 + i * (screenWidth - cardWidth) / (this.cards.length - 1);
            }
        }


    },
});