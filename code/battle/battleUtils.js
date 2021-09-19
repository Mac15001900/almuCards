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