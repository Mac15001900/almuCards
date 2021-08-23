const PHASE =
    {
        REST: 0,
        MOVE: 1,
        CAN_REPLACE: 2,
        MUST_REPLACE: 3,
    };

let SceneBattle = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:
    function SceneBattle() {
        Phaser.Scene.call(this, { key: 'SceneBattle' });
    },

    init: function (data) {
        this.userDrone = data.userDrone;
        this.opponentDrone = data.opponentDrone;
        this.userDeck = DeckBank.getCardsFromNames(data.userDeck);
        this.opponentDeck = DeckBank.getCardsFromNames(data.opponentDeck);
        DeckBank.validateDeck(this.userDeck);
        DeckBank.validateDeck(this.opponentDeck);
    },

    preload: function () {
        console.log('Preload in battle scene');
        //Bazowe karty. Muszą być rozmiaru 1300x800 (przynajmniej dopóki nie napiszemy Card ładniej)
        this.load.image('card_fire', 'assets/card_fire.png');
        this.load.image('card_forest', 'assets/card_forest.png');
        this.load.image('card_water', 'assets/card_water.png');

        //Obrazki z kart
        let imagesToLoad = DeckBank.getImages(this.userDeck, this.opponentDeck);

        for (let image in imagesToLoad) {
            this.load.image(imagesToLoad[image], 'assets/cardImages/' + imagesToLoad[image] + '.png');
        }

        //Obrazki symboli
        this.load.image('sym_icon_forest', 'assets/forest_icon.png');
        this.load.image('sym_icon_fire', 'assets/fire_icon.png');
        this.load.image('sym_icon_water', 'assets/water_icon.png');
        this.load.image('sym_icon_plus', 'assets/plus_icon.png');
        this.load.image('sym_icon_minus', 'assets/minus_icon.png');
        this.load.image('sym_icon_replace_can', 'assets/replace_icon_can.png');
        this.load.image('sym_icon_replace_must', 'assets/replace_icon_must.png');

        //Obrazki przycisków
        this.load.image('button_cancel', 'assets/button_cancel.png');
    },

    create: function () {
        this.testBattle = new Battle(this, this.userDeck, this.opponentDeck);

        //tworzenie ikonek wskazujących zwycięstwo graczy
        this.playerWin = [110, 280];
        this.playerForestWin = [new Icon(this, this.playerWin[0], this.playerWin[1], 0.3, 'sym_icon_forest'), new Icon(this, this.playerWin[0], this.playerWin[1] - 40, 0.3, 'sym_icon_forest'), new Icon(this, this.playerWin[0], this.playerWin[1] - 80, 0.3, 'sym_icon_forest')];
        this.playerFireWin = [new Icon(this, this.playerWin[0] + 40, this.playerWin[1], 0.3, 'sym_icon_fire'), new Icon(this, this.playerWin[0] + 40, this.playerWin[1] - 40, 0.3, 'sym_icon_fire'), new Icon(this, this.playerWin[0] + 40, this.playerWin[1] - 80, 0.3, 'sym_icon_fire')];
        this.playerWaterWin = [new Icon(this, this.playerWin[0] + 80, this.playerWin[1], 0.3, 'sym_icon_water'), new Icon(this, this.playerWin[0] + 80, this.playerWin[1] - 40, 0.3, 'sym_icon_water'), new Icon(this, this.playerWin[0] + 80, this.playerWin[1] - 80, 0.3, 'sym_icon_water')];
        this.enemyWin = [110, 390];
        this.enemyForestWin = [new Icon(this, this.enemyWin[0], this.enemyWin[1], 0.3, 'sym_icon_forest'), new Icon(this, this.enemyWin[0], this.enemyWin[1] + 40, 0.3, 'sym_icon_forest'), new Icon(this, this.enemyWin[0], this.enemyWin[1] + 80, 0.3, 'sym_icon_forest')];
        this.enemyFireWin = [new Icon(this, this.enemyWin[0] + 40, this.enemyWin[1], 0.3, 'sym_icon_fire'), new Icon(this, this.enemyWin[0] + 40, this.enemyWin[1] + 40, 0.3, 'sym_icon_fire'), new Icon(this, this.enemyWin[0] + 40, this.enemyWin[1] + 80, 0.3, 'sym_icon_fire')];
        this.enemyWaterWin = [new Icon(this, this.enemyWin[0] + 80, this.enemyWin[1], 0.3, 'sym_icon_water'), new Icon(this, this.enemyWin[0] + 80, this.enemyWin[1] + 40, 0.3, 'sym_icon_water'), new Icon(this, this.enemyWin[0] + 80, this.enemyWin[1] + 80, 0.3, 'sym_icon_water')];
        this.winIcons = [this.playerForestWin, this.playerFireWin, this.playerWaterWin, this.enemyForestWin, this.enemyFireWin, this.enemyWaterWin];

        //tworzenie ikonek informujących o istniejących efektach (dotyczących kart, nie ręki)
        this.plusIcons = [new Icon(this, 1020, 180, 0.5, 'sym_icon_plus'), new Icon(this, 1020, 490, 0.5, 'sym_icon_plus')];
        this.minusIcons = [new Icon(this, 1020, 230, 0.5, 'sym_icon_minus'), new Icon(this, 1020, 440, 0.5, 'sym_icon_minus')];

        this.updateIcons([0, 0, 0, 0, 0, 0], []);
    },
    update: function (timestep, dt) {

    },

    receiveMessage: function (data, member) {
        switch (data.type) {
            case "cardPicked":
                this.testBattle.Add_card(data.content, member.id === drone.clientId);
        }
    },

    updateIcons: function (points, effects) {
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 3; j++) {
                if (points[i] > j)
                    this.winIcons[i][j].visual.visible = true;
                else
                    this.winIcons[i][j].visual.visible = false;
            }
        }
        let table = Give_effects_table(cardData.basic_fire_1, cardData.basic_fire_1, effects);  //2 pierwsze argumenty to karty bez efektów
        for (let i = 0; i < 2; i++) {
            if (table[i] > 0) {
                this.plusIcons[i].valueText.text = "+" + table[i];
                this.plusIcons[i].visual.visible = true;
            }
            else
                this.plusIcons[i].visual.visible = false;
            if (table[i] < 0) {
                this.minusIcons[i].valueText.text = table[i];
                this.minusIcons[i].visual.visible = true;
            }
            else
                this.minusIcons[i].visual.visible = false;
        }
    },

});

let Card = new Phaser.Class({
    params: {
        outlineColor: 0xffffff,
        outlineDiscardColor: 0xff0000,
    },

    initialize:
    function Card(scene, data, x, y, scale, hand) {
        this.scale = scale;
        this.hand = hand;
        this.data = data; //Informacje o karcie (żywioł, wartość itp.)
        this.visual = scene.add.container(x, y); //Wizualne elementy karty

        switch (data.element) {
            case ELEMENT.FIRE: this.sprite = scene.add.image(0, 0, 'card_fire').setScale(scale); break;
            case ELEMENT.FOREST: this.sprite = scene.add.image(0, 0, 'card_forest').setScale(scale); break;
            case ELEMENT.WATER: this.sprite = scene.add.image(0, 0, 'card_water').setScale(scale); break;
        }

        this.outline = scene.add.rectangle(0, 0, this.sprite.width * scale + 4, this.sprite.height * scale + 4, 0xffffff);
        this.outline.setDepth(-5);
        this.outline.setVisible(false);

        this.image = scene.add.image(0, - 200 * scale, data.image || data.name).setScale(scale);
        //this.image.setScale(64 / this.image.height); //Skalujemy obrazek, żeby jego wysokość wynosiła 64

        //this.nameTextfont = (100 * scale).toString() + "px Arial";
        this.nameTextfont = ((100 * 12 / (Math.max(data.name.length - 12, 0) + 12)) * scale) + "px Arial";
        this.nameText = scene.add.text(0, 0, data.displayName, { font: this.nameTextfont, fill: "#000000" });
        this.nameText.setOrigin(0.5, 0.5);
        //this.nameText.x = x;
        this.nameText.y = - 525 * scale;

        this.valueTextfont = "bold " + (140 * scale) + "px Arial";
        this.valueText = scene.add.text(0, 0, data.value, { font: this.valueTextfont, fill: "#000000" });
        this.valueText.setOrigin(0.5, 0.5);
        //this.valueText.x = x;
        this.valueText.y = 585 * scale;

        this.effectTextfont = (60 * scale) + "px Arial";
        this.effectText = scene.add.text(0, 0, Get_effect_string(data.effect), { font: this.effectTextfont, fill: "#000000", wordWrap: { width: 700 * scale }, align: 'left' });
        this.effectText.setOrigin(0, 0);
        this.effectText.x = - 325 * scale;
        this.effectText.y = + 75 * scale;

        this.flavourTextfont = "italic " + (60 * scale) + "px Arial";
        this.flavourText = scene.add.text(0, 0, data.flavour, { font: this.flavourTextfont, fill: "#000000", wordWrap: { width: 700 * scale }, align: 'left' });
        this.flavourText.setOrigin(0, 0);
        this.flavourText.x = - 325 * scale;
        this.flavourText.y = + 400 * scale;

        this.discardFilter = scene.add.rectangle(0, 0, this.sprite.width * scale, this.sprite.height * scale, 0xff0000, 0.4);
        this.discardFilter.setDepth(5);
        this.discardFilter.setVisible(false);

        this.visual.add([this.outline, this.sprite, this.image, this.nameText, this.valueText, this.effectText, this.flavourText, this.discardFilter]);

        this.sprite.setInteractive().on('pointerup', () => {
            switch (this.hand.phase) {
                case PHASE.MOVE:
                    console.log("Kilknieto " + this.nameText.text);
                    this.hand.changePhase(PHASE.REST);
                    //scene.testBattle.Add_card(this, this.hand.index);
                    sendMessage("cardPicked", this.data);
                    this.hand.removeCard(this);
                    this.hand.drawCard();
                    break;
                case PHASE.CAN_REPLACE:
                    console.log("Wymieniono " + this.nameText.text);
                    this.hand.removeCard(this);
                    this.hand.drawCard();
                    this.hand.replace_cards[0]--;
                    this.hand.replaceIcons[0].valueText = this.hand.replace_cards[0];
                    if (hand.replace_cards[0] <= 0)
                        this.hand.changePhase(PHASE.MOVE);
                    break;
                case PHASE.MUST_REPLACE:
                    console.log("Wymieniono " + this.nameText.text);
                    this.hand.removeCard(this);
                    this.hand.drawCard();
                    this.hand.replace_cards[1]--;
                    this.hand.replaceIcons[1].valueText = this.hand.replace_cards[1];
                    if (hand.replace_cards[1] <= 0) {
                        if (replace_cards[0] > 0)
                            this.hand.changePhase(PHASE.CAN_REPLACE);
                        else
                            this.hand.changePhase(PHASE.MOVE);
                    }
                    break;
                case PHASE.REST:
                    console.log("Juz wybrales swoja karte.");
                    break;
            }
        });

        this.sprite.on('pointerover', () => {
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
            //TODO Zmiana 'depth', przy ręce z wieloma kartami
        });
        this.sprite.on('pointerout', () => {
            this.visual.setScale(1);
            this.visual.y += 10;
            this.outline.setVisible(false);
            this.discardFilter.setVisible(false);
        })

        // this.name
    },

});

let Hand = new Phaser.Class({
    params: {
        cardScale: 0.175,
        cardBaseWidth: 800,
        cardBaseHeight: 1300,
        cardPadding: 16,
        bottomPadding: 32,
    },

    initialize:
    function Hand(scene, size, deck, index) {
        this.size = size;
        this.index = index;
        this.cards = [];
        this.deck = deck;
        this.scene = scene;
        this.replace_cards = [0, 0];

        let screenWidth = scene.sys.game.canvas.width;
        let screenHeight = scene.sys.game.canvas.height;
        this.cardY = screenHeight - this.params.cardBaseHeight * this.params.cardScale / 2 - this.params.bottomPadding;
        this.cancelButton = new Button(this.scene, "cancel", screenWidth / 2, screenHeight / 2, 0.5, "button_cancel", this);
        this.replaceIcons = [
            new Icon(this.scene, this.cancelButton.visual.x, this.cancelButton.visual.y - 50, 0.5, 'sym_icon_replace_can'),
            new Icon(this.scene, this.cancelButton.visual.x, this.cancelButton.visual.y - 50, 0.5, 'sym_icon_replace_must')
        ];

        console.assert(size > 0);
        console.assert(deck.length >= size);
        this.drawUntilLimit();
        this.phase = PHASE.REST;
        this.changePhase(PHASE.MOVE);
    },

    drawCard: function () {
        this.cards.push(new Card(this.scene, this.deck.pop(), 0, this.cardY, this.params.cardScale, this));
        this.repositionCards(this.scene);
    },

    drawUntilLimit: function () {
        while (this.cards.length < this.size) {
            this.drawCard();
        }
    },

    removeCard: function (card) {
        let i = this.cards.indexOf(card);
        console.assert(i >= 0);
        let removed = this.cards.splice(i, 1);
        removed[0].visual.removeAll(true); //Usuwa wszystkie obrazki i tekst należące do karty
        this.repositionCards();
    },

    repositionCards: function () {
        let cardWidth = this.params.cardBaseWidth * this.params.cardScale;
        let padding = this.params.cardPadding;
        let fullWidth = this.cards.length * cardWidth + (this.cards.length - 1) * padding;
        let screenWidth = this.scene.sys.game.canvas.width;
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

    changePhase: function (new_phase) {
        this.phase = new_phase;
        this.replaceIcons[0].visual.visible = false;
        this.replaceIcons[1].visual.visible = false;
        this.cancelButton.visual.visible = false;
        switch (this.phase) {
            case PHASE.CAN_REPLACE:
                this.replaceIcons[0].visual.visible = true;
                this.replaceIcons[0].valueText.text = this.replace_cards[0];
                this.cancelButton.visual.visible = true;
                break;
            case PHASE.MUST_REPLACE:
                this.replaceIcons[1].visual.visible = true;
                this.replaceIcons[1].valueText.text = this.replace_cards[1];
                break;
        }
    },
});

let Battle = new Phaser.Class({

    initialize:
    function Battle(scene, userDeck, opponentDeck) {
        this.scene = scene;
        this.cards = [null, null];
        this.effects = [];
        this.playerDeck = userDeck;
        this.enemyDeck = opponentDeck;
        Phaser.Actions.Shuffle(this.playerDeck);
        Phaser.Actions.Shuffle(this.enemyDeck);
        this.playerHand = new Hand(scene, 5, this.playerDeck, 600, 0);
        //this.enemyHand = new Hand(scene, 5, this.enemyDeck, 300, 1);
        this.points = [0, 0, 0, 0, 0, 0];   //pierwsze trzy dla gracza, drugie trzy dla przeciwnika
    },

    Add_card: function (new_card, user) { //User=true oznacza użytkownika, false przeciwnika
        this.cards[user ? 0 : 1] = new_card;
        if (this.cards[0] != null && this.cards[1] != null) {
            console.log(this.effects);
            let score = Check_who_wins(this.cards[0], this.cards[1], this.effects);
            this.effects = Update_current_effects(this.cards[0], this.cards[1], score, this.effects);
            switch (score) {
                case 1:
                    console.log(this.cards[0].displayName + " wins!");
                    this.points[this.cards[0].element - 1]++;
                    break;
                case -1: console.log(this.cards[1].displayName + " wins!");
                    this.points[this.cards[1].element + 2]++;
                    break;
                case 0: console.log("It's a draw"); break;
            }
            this.scene.updateIcons(this.points, this.effects);
            this.Check_if_anyone_wins();
            this.cards = [null, null];    //czyszczenie tablicy

            let afterturn_table = Give_afterturn_effects_table(this.effects);   //efekty po turze (głównie modyfikujące rękę)
            if (afterturn_table[0] > 0) //gracz może wymienić karty
            {
                this.playerHand.replace_cards[0] += afterturn_table[0]; //zapisanie, ile kart może wymienić
                this.playerHand.changePhase(PHASE.CAN_REPLACE);  //ustawienie odpowiedniego trybu
            }
            else
                this.playerHand.changePhase(PHASE.MOVE);
            if (afterturn_table[2] > 0) //gracz musi wymienić karty
            {
                this.playerHand.replace_cards[1] += afterturn_table[1];
                this.playerHand.changePhase(PHASE.MUST_REPLACE);
            }
            /*if (afterturn_table[1] > 0) {
                this.enemyHand.replace_cards[0] += afterturn_table[1];
                this.enemyHand.changePhase(PHASE.CAN_REPLACE);
            }
            else
                this.enemyHand.changePhase(PHASE.MOVE);
            if (afterturn_table[3] > 0) {
                this.enemyHand.replace_cards[1] += afterturn_table[3];
                this.enemyHand.changePhase(PHASE.MUST_REPLACE);
            }*/
        }
    },

    Check_if_anyone_wins: function () {
        for (let i = 0; i < 3; i++) {
            if (this.points[i] >= 3)
                console.log("Wygrał gracz pierwszy (player)!");
        }
        for (let i = 3; i < 6; i++) {
            if (this.points[i] >= 3)
                console.log("Wygrał gracz drugi (enemy)!");
        }
    },
});

let Icon = new Phaser.Class({
    initialize:
    function Icon(scene, x, y, scale, image) {
        this.scale = scale;
        this.visual = scene.add.container(x, y); //Wizualne elementy karty

        this.image = scene.add.image(0, 0, image).setScale(scale);

        this.valueTextfont = "bold " + (50 * scale) + "px Arial";
        this.valueText = scene.add.text(0, 0, "", { font: this.valueTextfont, fill: "#000000" });
        this.valueText.setOrigin(0.5, 0.5);

        this.visual.add([this.image, this.valueText]);
    },
});

let Button = new Phaser.Class({
    initialize:
    function Button(scene, type, x, y, scale, image, hand) {
        this.type = type;
        this.scale = scale;
        this.hand = hand;
        this.visual = scene.add.container(x, y); //Wizualne elementy karty

        this.sprite = scene.add.image(0, 0, image).setScale(scale);

        this.visual.add([this.sprite]);

        this.sprite.setInteractive().on('pointerup', () => {
            switch (this.type) {
                case "cancel":
                    switch (this.hand.phase) {
                        case PHASE.CAN_REPLACE:
                            console.log("Anulowano wymienianie");
                            this.hand.replace_cards[0] = 0;
                            this.hand.changePhase(PHASE.MOVE);
                            break;
                        case PHASE.MUST_REPLACE:
                            console.log("Musisz wymienic karty!");
                            break;
                    }
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
