let Utils = { //Obiekt z różnymi małymi funkcjami

    enlargeOnMouseover: function (thing, scaleChange = 1.05, baseScale = 1) { //Sprawia, że dany obiekt będzie się powiększał po najechaniu na niego myszką
        thing.setInteractive();
        thing.on('pointerover', () => {
            thing.setScale(baseScale * scaleChange);
        });
        thing.on('pointerout', () => {
            thing.setScale(baseScale);
        })
    },

}






let TextButton = new Phaser.Class({

    params: {
        activeColor: 0x7cfc00,
        disabledColor: 0x778899,
        width: 200,
        height: 130,
    },

    initialize:
    function TextButton(scene, x, y, text, callback, active = true) {
        this.active = active;
        this.callback = callback;
        let width = this.params.width;
        let height = this.params.height;

        this.base = scene.add.rectangle(0, 0, width, height, this.getColor());
        this.outline = scene.add.rectangle(0, 0, width + 6, height + 6, 0xffffff);
        this.outline.setDepth(-5);
        this.outline.setVisible(false);

        this.buttonText = scene.add.text(0, 0, text, { font: "32px Arial", fill: "#000000", wordWrap: { width: width }, align: 'center' });
        this.buttonText.setOrigin(0.5, 0.5);

        this.visual = scene.add.container(x, y);
        this.visual.add([this.outline, this.base, this.buttonText]);

        this.base.setInteractive().on('pointerup', function (event) {
            if (this.active) this.callback();
        }, this);

        this.base.on('pointerover', () => {
            if (this.active) {
                this.visual.setScale(1.05);
                this.outline.setVisible(true);
            }
        });
        this.base.on('pointerout', () => {
            this.visual.setScale(1);
            this.outline.setVisible(false);
        })
    },

    getColor: function () {
        if (this.active) return this.params.activeColor;
        else return this.params.disabledColor;
    },

    setActive: function (active) {
        this.active = active;
        this.base.setFillStyle(this.getColor());
    },

    setDepth: function (depth) {
        this.base.depth = depth;
        this.outline.depth = depth - 5;
    },

    setVisible: function (visible) {
        this.base.setVisible(visible);
        this.nameText.setVisible(visible);
    }
});

//Prosty przycisk, wykonujący określoną funkcję gdy się go kliknie, i powiększający się gdy się na niego najedzie
//TODO Może po prostu powienien dziedziczyć z Image
let SimpleButton = new Phaser.Class({
    initialize:
    function SimpleButton(scene, x, y, sprite, callback, scaleChange = 1.05) {
        this.icon = scene.add.image(x, y, sprite);
        this.icon.setInteractive().on('pointerup', callback, scene);
        this.icon.on('pointerover', () => this.icon.setScale(scaleChange));
        this.icon.on('pointerout', () => this.icon.setScale(1));
    }
});

let Icon = new Phaser.Class({
    initialize:
    function Icon(scene, x, y, scale, image) {
        this.scale = scale;
        this.visual = scene.add.container(x, y);

        this.image = scene.add.image(0, 0, image).setScale(scale);

        this.valueTextfont = "bold " + (50 * scale) + "px Arial";
        this.valueText = scene.add.text(0, 0, "", { font: this.valueTextfont, fill: "#000000" });
        this.valueText.setOrigin(0.5, 0.5);

        this.visual.add([this.image, this.valueText]);
    },
});

let VictoryIcons = new Phaser.Class({
    initialize:
    function VictoryIcons(scene, x, y) {
        this.scene = scene;
        this.baseY = y;
        this.icons = {};
        this.emitters = {};
        this.visual = scene.add.container(x, y);
        this.elements = scene.config.ALL_ELEMENTS;
        let spacing = scene.layout.VICTORY_ICONS_SPACING;
        let scale = scene.layout.VICTORY_ICONS_SCALE;

        for (let i = 0; i < this.elements.length; i++) {
            let element = this.elements[i];
            let symbol = ELEMENT.info[element].symbol;
            this.icons[element] = [];
            for (let j = 0; j < 3; j++) {
                let newIcon = scene.add.image(i * spacing, - j * spacing, symbol).setScale(scale);
                newIcon.alpha = 0.15;
                this.visual.add(newIcon);
                this.icons[element].push(newIcon);
            }
            this.emitters[element] = scene.add.particles(symbol).createEmitter({
                speed: { min: 100, max: 1000 },
                scale: { start: 1, end: 0 },
                blendMode: 'ADD',
                lifespan: 300,
                x: x + i * spacing,
                frequency: -1,
                quantity: 20
            });
            //this.emitters[element].setFrequency(-1, 20);
            //this.visual.add(this.emitters[element]);
        }
    },

    explosion: function (element, points) {
        let emitter = this.emitters[element];
        console.log("Points: " + points + ", y: " + (this.baseY - (points - 1) * this.scene.layout.VICTORY_ICONS_SPACING));
        emitter.setPosition(emitter.x.propertyValue, this.baseY - (points - 1) * this.scene.layout.VICTORY_ICONS_SPACING);
        emitter.explode();
        this.scene.cameras.main.shakeEffect.start(200, .003, .003);

    },

    update: function (playerPoints) {
        console.assert(playerPoints);
        for (let i = 0; i < this.elements.length; i++) {
            for (let j = 0; j < 3; j++) {
                this.icons[this.elements[i]][j].alpha = playerPoints[this.elements[i]] > j ? 1 : 0.15;
            }
        }
    },
});

let Button = new Phaser.Class({
    initialize:
    function Button(scene, type, x, y, scale, image, hand) {
        this.type = type;
        this.scale = scale;
        this.hand = hand;
        this.visual = scene.add.container(x, y);

        this.sprite = scene.add.image(0, 0, image).setScale(scale);

        this.visual.add([this.sprite]);

        this.sprite.setInteractive().on('pointerup', () => {
            switch (this.type) {
                case "cancel":
                    switch (this.hand.phase) {
                        case PHASE.CAN_REPLACE:
                            console.log("Anulowano wymienianie");
                            this.hand.replaceCards[0] = 0;
                            this.hand.changePhase(PHASE.MOVE);
                            break;
                        case PHASE.MUST_REPLACE:
                            console.log("Musisz wymienic karty!");
                            break;
                    }
                    break;
                case "galleryLeft":
                    scene.page--;
                    scene.createPage();
                    break;
                case "galleryRight":
                    scene.page++;
                    scene.createPage();
                    break;
                case "help":
                    scene.helpScreen.setVisible(!scene.helpScreen.visible);
                    break;
            }
        });

        this.sprite.on('pointerover', () => {
            this.visual.setScale(1.05);
        });
        this.sprite.on('pointerout', () => {
            this.visual.setScale(1);
        })
    },
});

let DeckChoice = new Phaser.Class({
    initialize:
    function DeckChoice(scene, x, y, text, imageOn, imageOff) {
        this.scene = scene;
        this.sprite = scene.add.image(x, y, imageOff);
        this.sprite.setDepth(0);
        this.imageOn = scene.add.image(x, y, imageOn);
        this.imageOn.setVisible(false);
        this.imageOn.setDepth(1);
        this.text = scene.add.text(x + 30, y, text, { font: "20px Arial", fill: "#FFFFFF" });
        this.text.setOrigin(0, 0.5);
        this.sprite.setInteractive().on('pointerup', () => {
            this.imageOn.setVisible(true);
            this.scene.chooseDeckByButton(this);
        });
    },

    switch: function (state) {
        this.imageOn.setVisible(state);
    },
});
