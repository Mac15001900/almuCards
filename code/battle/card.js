let Card = new Phaser.Class({
    params: {
        outlineColor: 0xffffff,
        outlineDiscardColor: 0xff0000,
    },

    initialize:
    function Card(scene, data, x, y, scale, hand) {
        this.firstClickTime = 0;
        this.doubleClickDuration = 250;
        this.interactive = false;
        this.onlyToShow = false;
        this.scene = scene;
        this.scale = scale;
        this.hand = hand;
        this.data = data; //Informacje o karcie (żywioł, wartość itp.)
        this.visual = scene.add.container(x, y); //Wizualne elementy karty

        switch (data.element) {
            case ELEMENT.FIRE: this.sprite = scene.add.image(0, 0, 'cardFire').setScale(scale); break;
            case ELEMENT.FOREST: this.sprite = scene.add.image(0, 0, 'cardForest').setScale(scale); break;
            case ELEMENT.WATER: this.sprite = scene.add.image(0, 0, 'cardWater').setScale(scale); break;
        }

        this.outline = scene.add.rectangle(0, 0, this.sprite.width * scale + 4, this.sprite.height * scale + 4, 0xffffff);
        this.outline.setDepth(-5);
        this.outline.setVisible(false);

        //this.image = scene.add.image(0, - 200 * scale, data.image || data.name).setScale(scale);
        this.image = scene.add.image(0, - 200 * scale, data.image || data.name).setScale(scale / .3);
        //this.image.setScale(64 / this.image.height); //Skalujemy obrazek, żeby jego wysokość wynosiła 64

        //this.nameTextfont = (100 * scale).toString() + "px Arial";
        //this.nameTextfont = ((100 * 12 / (Math.max(data.displayName.length - 12, 0) + 12)) * scale) + "px Arial";
        this.nameTextfont = (90 * 12 / Math.max(data.displayName.length, 12) * scale) + "px Arial";
        this.nameText = scene.add.text(0, 0, data.displayName, { font: this.nameTextfont, fill: "#000000" });
        this.nameText.setOrigin(0.5, 0.5);
        //this.nameText.x = x;
        this.nameText.y = - 525 * scale;

        //this.valueTextfont = "bold " + (140 * scale) + "px Arial";
        this.valueTextfont = "bold " + ((140 * 2 / (Math.max(data.value.toString().length - 2, 0) + 2)) * scale) + "px Arial";
        this.valueText = scene.add.text(0, 0, data.value, { font: this.valueTextfont, fill: "#000000" });
        this.valueText.setOrigin(0.5, 0.5);
        //this.valueText.x = x;
        this.valueText.y = 585 * scale;

        //this.effectTextfont = (60 * scale) + "px Arial";
        this.effectTextfont = ((60 * 70 / (Math.max(DescriptionGenerator.getEffectDescription(data.effect).length - 70, 0) + 70)) * scale) + "px Arial";
        this.effectText = scene.add.text(0, 0, DescriptionGenerator.getEffectDescription(data.effect), { font: this.effectTextfont, fill: "#000000", wordWrap: { width: 700 * scale }, align: 'left' });
        this.effectText.setOrigin(0, 0);
        this.effectText.x = - 325 * scale;
        this.effectText.y = + 75 * scale;

        this.flavourTextfont = "italic " + (60 * scale) + "px Arial";
        this.flavourText = scene.add.text(0, 0, data.flavour || "", { font: this.flavourTextfont, fill: "#000000", wordWrap: { width: 700 * scale }, align: 'left' });
        this.flavourText.setOrigin(0, 1);
        this.flavourText.x = - 325 * scale;
        this.flavourText.y = + 500 * scale;

        this.discardFilter = scene.add.rectangle(0, 0, this.sprite.width * scale, this.sprite.height * scale, 0xff0000, 0.4);
        this.discardFilter.setDepth(5);
        this.discardFilter.setVisible(false);

        this.reverseImage = scene.add.image(0, 0, 'cardReverse').setScale(scale);
        this.reverseImage.setDepth(4);

        this.visual.add([this.outline, this.sprite, this.image, this.nameText, this.valueText, this.effectText, this.flavourText, this.discardFilter, this.reverseImage]);
        this.visual.setDepth(10);  //aby powiększenia kart były zawsze na wierzchu

        this.sprite.setInteractive().on('pointerup', () => {
            if (this.onlyToShow) {
                this.visual.removeAll(true);
            } else {
                if (this.firstClickTime === 0) {
                    this.firstClickTime = this.getTime();
                    setTimeout(() => { this.updateClick(); }, this.doubleClickDuration);    //jeśli nie nastąpi podwójne kliknięcie, to będzie pojedyncze
                } else {
                    this.firstClickTime = 0;
                    this.doubleClick();
                }
            }
        });

        this.sprite.on('pointerover', () => {
            this.visual.setDepth(this.visual.depth + 5);
            if (this.interactive && !(this.hand !== null && this.hand.phase === PHASE.REST)) {
                this.visual.setScale(1.05);
                this.visual.y -= 10;
                let phase = this.hand.phase;
                if (phase === PHASE.CAN_REPLACE || phase === PHASE.MUST_REPLACE) {
                    this.outline.setFillStyle(this.params.outlineDiscardColor);
                    this.discardFilter.setVisible(true);
                }
                else {
                    this.outline.setFillStyle(this.params.outlineColor);
                    this.discardFilter.setVisible(false);
                }

                this.outline.setVisible(true);
                //TODO Zmiana 'depth', przy ręce ze zbyt wieloma kartami
            }
        });
        this.sprite.on('pointerout', () => {
            this.visual.setDepth(this.visual.depth - 5);
            if (this.interactive && !(this.hand !== null && this.hand.phase === PHASE.REST)) {
                this.visual.setScale(1);
                this.visual.y += 10;
                this.outline.setVisible(false);
                this.discardFilter.setVisible(false);
            }
        })

        // this.name
    },

    updateClick: function () {
        if (this.firstClickTime !== 0)  //do obsługi kliknięć
        {
            this.firstClickTime = 0;
            this.singleClick();
        }
    },

    singleClick: function () {
        if (this.interactive) {
            switch (this.hand.phase) {
                case PHASE.MOVE:
                    console.log("Kilknieto " + this.nameText.text);
                    this.hand.changePhase(PHASE.REST);
                    //scene.cardBattle.addCard(this, this.hand.index);
                    Network.sendMessage("cardPicked", this.data, Network.Room.DUEL);
                    this.hand.removeCard(this);
                    this.hand.drawCard();
                    break;
                case PHASE.CAN_REPLACE:
                    console.log("Wymieniono " + this.nameText.text);
                    this.hand.removeCard(this);
                    this.hand.drawCard();
                    this.hand.replaceCards[0]--;
                    this.scene.replaceIcons[0].valueText.text = this.hand.replaceCards[0];
                    if (this.hand.replaceCards[0] <= 0)
                        this.hand.changePhase(PHASE.MOVE);
                    break;
                case PHASE.MUST_REPLACE:
                    console.log("Wymieniono " + this.nameText.text);
                    this.hand.removeCard(this);
                    this.hand.drawCard();
                    this.hand.replaceCards[1]--;
                    this.scene.replaceIcons[1].valueText.text = this.hand.replaceCards[1];
                    if (this.hand.replaceCards[1] <= 0) {
                        if (this.hand.replaceCards[0] > 0) {
                            this.hand.changePhase(PHASE.CAN_REPLACE);
                            this.scene.replaceIcons[0].visual.setVisible(true);
                        }
                        else
                            this.hand.changePhase(PHASE.MOVE);
                    }
                    break;
                case PHASE.REST:
                    console.log("Juz wybrales swoja karte.");
                    break;
            }
        }
    },

    doubleClick: function () {
        console.log("Double click");
        let bigCard = new Card(this.scene, this.data, this.scene.layout.BIG_CARD_X, this.scene.layout.BIG_CARD_Y, 0.4, null);
        bigCard.onlyToShow = true;
        if (!this.reverseImage.visible)
            bigCard.reverseCard(true, false);
    },

    reverseCard: function (reverseVisible, isInteractive) {
        this.interactive = isInteractive;
        this.reverseImage.setVisible(!reverseVisible);
    },

    getTime: function () {
        let d = new Date();
        return d.getTime();
    },

});