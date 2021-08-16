let SceneBattle = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:
        function SceneBattle()
        {
            Phaser.Scene.call(this, { key: 'SceneBattle' });
        },

    preload: function ()
    {
        console.log('Preload in battle scene');
        this.load.image('card_fire', 'assets/card_fire.png');
        this.load.image('card_forest', 'assets/card_forest.png');
        this.load.image('card_water', 'assets/card_water.png');
        this.load.image('im_fire_1', 'assets/fire_1.png');
        this.load.image('im_fire_12', 'assets/fire_12.png');
        this.load.image('im_forest_1', 'assets/forest_1.png');
        this.load.image('im_forest_13', 'assets/forest_13.png');
        this.load.image('im_water_1', 'assets/water_1.png');
        this.load.image('im_plus5_forest', 'assets/plus5_forest.png');
        this.load.image('im_minus5_fire', 'assets/minus5_fire.png');
        this.load.image('im_replace1_water', 'assets/replace1_water.png');
    },

    create: function ()
    {
        this.fire_1 = new Card(this, fire_1, 200, 200);
        this.forest_1 = new Card(this, forest_1, 400, 200);
        this.water_1 = new Card(this, water_1, 600, 200);
        this.forest_13 = new Card(this, forest_13, 800, 200);
        this.fire_12 = new Card(this, fire_12, 1000, 200);
        this.plus5_forest = new Card(this, plus5_forest, 200, 500);
        this.minus5_fire = new Card(this, minus5_fire, 400, 500);
        this.replace1_water = new Card(this, replace1_water, 600, 500);
    },

    update: function (timestep, dt)
    {

    },

    receiveMessage: function (data)
    {
        console.log(data);
    },

});

let Card = new Phaser.Class({

    initialize:
        function Card(scene, data, x, y)
        {
            this.scale = 0.2;
            this.data = data;
            switch (data.element)
            {
                case 'fire': this.sprite = scene.add.image(x, y, 'card_fire').setScale(this.scale); break;
                case 'forest': this.sprite = scene.add.image(x, y, 'card_forest').setScale(this.scale); break;
                case 'water': this.sprite = scene.add.image(x, y, 'card_water').setScale(this.scale); break;
            }

            this.image = scene.add.image(x, y - 200 * this.scale, data.image).setScale(this.scale);
            //this.image.setScale(64 / this.image.height); //Skalujemy obrazek, żeby jego wysokość wynosiła 64

            //this.nameTextfont = (100 * this.scale).toString() + "px Arial";
            this.nameTextfont = ((100 * 12 / (Math.max(data.name.length - 12, 0) + 12)) * this.scale).toString() + "px Arial";
            this.nameText = scene.add.text(0, 0, data.name, { font: this.nameTextfont, fill: "#000000"});
            this.nameText.setOrigin(0.5, 0.5);
            this.nameText.x = x;
            this.nameText.y = y - 525 * this.scale;

            this.valueTextfont = "bold " + (140 * this.scale).toString() + "px Arial";
            this.valueText = scene.add.text(0, 0, data.value, { font: this.valueTextfont, fill: "#000000"});
            this.valueText.setOrigin(0.5, 0.5);
            this.valueText.x = x;
            this.valueText.y = y + 585 * this.scale;

            this.effectTextfont = (60 * this.scale).toString() + "px Arial";
            this.effectText = scene.add.text(0, 0, Get_effect_string(data.effect), { font: this.effectTextfont, fill: "#000000", wordWrap: { width: 700 * this.scale }, align: 'left'});
            this.effectText.setOrigin(0, 0);
            this.effectText.x = x - 325 * this.scale;
            this.effectText.y = y + 75 * this.scale;

            this.flavourTextfont = "italic " + (60 * this.scale).toString() + "px Arial";
            this.flavourText = scene.add.text(0, 0, data.flavour, { font: this.flavourTextfont, fill: "#000000", wordWrap: { width: 700 * this.scale }, align: 'left'});
            this.flavourText.setOrigin(0, 0);
            this.flavourText.x = x - 325 * this.scale;
            this.flavourText.y = y + 400 * this.scale;

            // this.name
        },

});
