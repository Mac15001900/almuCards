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
        this.userDeck = DeckBank.assemblyDeck(data.userDeck);
        this.opponentDeck = DeckBank.assemblyDeck(data.opponentDeck);
        DeckBank.validateDeck(this.userDeck);
        DeckBank.validateDeck(this.opponentDeck);
    },

    config: {
        VICTORY_AMOUNT: 3, //Ilość wygranych kart potrzebna do wygrania gry
        ALL_ELEMENTS: ELEMENT.basic, //Istniejące żywioły
    },

    preload: function () {
        console.log('Preload in battle scene');
        //Bazowe karty. Muszą być rozmiaru 800x1300 (przynajmniej dopóki nie napiszemy Card ładniej)
        this.load.image('card_fire', 'assets/card_fire.png');
        this.load.image('card_forest', 'assets/card_forest.png');
        this.load.image('card_water', 'assets/card_water.png');

        //Obrazki z kart
        let imagesToLoad = DeckBank.getImages(this.userDeck, this.opponentDeck);

        for (let image in imagesToLoad) {
            this.load.image(imagesToLoad[image], 'assets/cardImages/' + imagesToLoad[image] + '.png');
        }
        this.load.image('card_reverse', 'assets/card_reverse.png');

        //Obrazki symboli
        this.load.image('sym_icon_forest', 'assets/forest_icon.png'); //Symbole żywiołów muszą być 100x100
        this.load.image('sym_icon_fire', 'assets/fire_icon.png');
        this.load.image('sym_icon_water', 'assets/water_icon.png');
        this.load.image('sym_icon_plus', 'assets/plus_icon.png');
        this.load.image('sym_icon_minus', 'assets/minus_icon.png');
        this.load.image('sym_icon_replace_can', 'assets/replace_icon_can.png');
        this.load.image('sym_icon_replace_must', 'assets/replace_icon_must.png');

        //Obrazki przycisków
        this.load.image('button_cancel', 'assets/button_cancel.png');
    },

    layout: {
        WIDTH: null, //Będzie znane dopiero przy tworzeniu instancji
        HEIGHT: null,

        NAMES_Y: 10,
        NAMES_H_PADDING: 10,

        VICTORY_ICONS_HEIGHT: 200,
        VICTORY_ICONS_HORIZONTAL_PADDING: 50,
        VICTORY_ICONS_SPACING: 50,
        VICTORY_ICONS_SCALE: 0.45,

        EFFET_ICON_HEIGHT: 300,
        EFFET_ICON_SPACING: 50,
        EFFET_ICON_HORIZONTAL_PADDING: 100,
        EFFET_ICON_SCALE: 0.5,

        CANCEL_BUTTON_X: 150,
        CANCEL_BUTTON_Y: 350,

        CHOSEN_CARDS_X: 500,
        CHOSEN_CARDS_Y: 375,
        CHOSEN_CARDS_SPACING: 300,
        CHOSEN_CARDS_SCALE: 0.275,
    },

    create: function () {
        let layout = this.layout; //Będziemy tego tu dużo używać
        layout.WIDTH = this.sys.game.canvas.width;
        layout.HEIGHT = this.sys.game.canvas.height;

        this.playerName = this.add.text(layout.NAMES_H_PADDING, layout.NAMES_Y, " " + this.userDrone.clientData.name + " ", { font: "30px Arial", fill: "#000000", align: 'left', backgroundColor: "#DDDDDD" });
        this.opponentName = this.add.text(layout.WIDTH - layout.NAMES_H_PADDING, layout.NAMES_Y, " " + this.opponentDrone.clientData.name + " ", { font: "30px Arial", fill: "#000000", align: 'right', backgroundColor: "#DDDDDD", boundsAlignH: 'right' });
        this.opponentName.setOrigin(1, 0);

        //tworzenie ikonek wskazujących zwycięstwo graczy
        this.userWon = new VictoryIcons(this, layout.VICTORY_ICONS_HORIZONTAL_PADDING, layout.VICTORY_ICONS_HEIGHT);
        let enemyWonX = layout.WIDTH - layout.VICTORY_ICONS_HORIZONTAL_PADDING - layout.VICTORY_ICONS_SPACING - layout.VICTORY_ICONS_SCALE * 100;
        this.enemyWon = new VictoryIcons(this, enemyWonX, layout.VICTORY_ICONS_HEIGHT);

        //tworzenie ikonek informujących o istniejących efektach (dotyczących kart, nie ręki)
        this.plusIcons = [
            new Icon(this, layout.EFFET_ICON_HORIZONTAL_PADDING, layout.EFFET_ICON_HEIGHT, layout.EFFET_ICON_SCALE, 'sym_icon_plus'),
            new Icon(this, layout.WIDTH - layout.EFFET_ICON_HORIZONTAL_PADDING, layout.EFFET_ICON_HEIGHT, layout.EFFET_ICON_SCALE, 'sym_icon_plus')
        ];
        this.minusIcons = [
            new Icon(this, layout.EFFET_ICON_HORIZONTAL_PADDING, layout.EFFET_ICON_HEIGHT, layout.EFFET_ICON_SCALE, 'sym_icon_minus'),
            new Icon(this, layout.WIDTH - layout.EFFET_ICON_HORIZONTAL_PADDING, layout.EFFET_ICON_HEIGHT, layout.EFFET_ICON_SCALE, 'sym_icon_minus')
        ];
        this.replaceIcons = [   //pierwsza na CanReplace, druga na MustReplace, nie ma po co pokazywać ikonek przeciwnika
            new Icon(this, layout.EFFET_ICON_HORIZONTAL_PADDING + layout.EFFET_ICON_SPACING, layout.EFFET_ICON_HEIGHT, layout.EFFET_ICON_SCALE, 'sym_icon_replace_can'),
            new Icon(this, layout.EFFET_ICON_HORIZONTAL_PADDING + layout.EFFET_ICON_SPACING, layout.EFFET_ICON_HEIGHT, layout.EFFET_ICON_SCALE, 'sym_icon_replace_must'),
        ];

        this.testBattle = new Battle(this, this.userDeck, this.opponentDeck);
        this.updateIcons(this.testBattle.points, []);
    },
    update: function (timestep, dt) {

    },

    receiveMessage: function (data, member) {
        switch (data.type) {
            case "cardPicked":
                this.testBattle.addCard(data.content, member.id === Network.drone.clientId);
                break;
        }
    },

    updateIcons: function (points, effects) {
        console.log(points)
        this.userWon.update(points.user);
        this.enemyWon.update(points.enemy);

        let inturnTable = EffectBank.getInturnEffectsTable(cardData.basic1, cardData.basic1, effects);  //2 pierwsze argumenty to karty bez efektów
        let afterturnTable = EffectBank.getAfterturnEffectsTable(effects);
        for (let i = 0; i < 2; i++) {
            if (inturnTable[i] > 0) {
                this.plusIcons[i].valueText.text = "+" + inturnTable[i];
                this.plusIcons[i].visual.visible = true;
            }
            else
                this.plusIcons[i].visual.visible = false;
            if (inturnTable[i] < 0) {
                this.minusIcons[i].valueText.text = inturnTable[i];
                this.minusIcons[i].visual.visible = true;
            }
            else
                this.minusIcons[i].visual.visible = false;
        }
        if (afterturnTable[0] != 0) {
            this.replaceIcons[0].valueText.text = afterturnTable[0];
            this.replaceIcons[0].visual.visible = true;
        }
        else
            this.replaceIcons[0].visual.visible = false;
        if (afterturnTable[2] != 0) {
            this.replaceIcons[0].visual.visible = false;
            this.replaceIcons[1].valueText.text = afterturnTable[2];
            this.replaceIcons[1].visual.visible = true;
        }
        else
            this.replaceIcons[1].visual.visible = false;

    },

});

let Card = new Phaser.Class({
    params: {
        outlineColor: 0xffffff,
        outlineDiscardColor: 0xff0000,
    },

    initialize:
    function Card(scene, data, x, y, scale, hand) {
        this.interactive = false;
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

        //this.image = scene.add.image(0, - 200 * scale, data.image || data.name).setScale(scale);
        this.image = scene.add.image(0, - 200 * scale, data.image || data.name).setScale(scale / .3);
        //this.image.setScale(64 / this.image.height); //Skalujemy obrazek, żeby jego wysokość wynosiła 64

        //this.nameTextfont = (100 * scale).toString() + "px Arial";
        this.nameTextfont = ((100 * 12 / (Math.max(data.displayName.length - 12, 0) + 12)) * scale) + "px Arial";
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
        this.effectText = scene.add.text(0, 0, EffectBank.getEffectDescription(data.effect), { font: this.effectTextfont, fill: "#000000", wordWrap: { width: 700 * scale }, align: 'left' });
        this.effectText.setOrigin(0, 0);
        this.effectText.x = - 325 * scale;
        this.effectText.y = + 75 * scale;

        this.flavourTextfont = "italic " + (60 * scale) + "px Arial";
        this.flavourText = scene.add.text(0, 0, data.flavour, { font: this.flavourTextfont, fill: "#000000", wordWrap: { width: 700 * scale }, align: 'left' });
        this.flavourText.setOrigin(0, 1);
        this.flavourText.x = - 325 * scale;
        this.flavourText.y = + 500 * scale;

        this.discardFilter = scene.add.rectangle(0, 0, this.sprite.width * scale, this.sprite.height * scale, 0xff0000, 0.4);
        this.discardFilter.setDepth(5);
        this.discardFilter.setVisible(false);

        this.reverseImage = scene.add.image(0, 0, 'card_reverse').setScale(scale);
        this.reverseImage.setDepth(4);

        this.visual.add([this.outline, this.sprite, this.image, this.nameText, this.valueText, this.effectText, this.flavourText, this.discardFilter, this.reverseImage]);

        this.sprite.setInteractive().on('pointerup', () => {
            if (this.interactive) {
                switch (this.hand.phase) {
                    case PHASE.MOVE:
                        console.log("Kilknieto " + this.nameText.text);
                        this.hand.changePhase(PHASE.REST);
                        //scene.testBattle.addCard(this, this.hand.index);
                        Network.sendMessage("cardPicked", this.data);
                        this.hand.removeCard(this);
                        this.hand.drawCard();
                        break;
                    case PHASE.CAN_REPLACE:
                        console.log("Wymieniono " + this.nameText.text);
                        this.hand.removeCard(this);
                        this.hand.drawCard();
                        this.hand.replace_cards[0]--;
                        scene.replaceIcons[0].valueText.text = this.hand.replace_cards[0];
                        if (hand.replace_cards[0] <= 0)
                            this.hand.changePhase(PHASE.MOVE);
                        break;
                    case PHASE.MUST_REPLACE:
                        console.log("Wymieniono " + this.nameText.text);
                        this.hand.removeCard(this);
                        this.hand.drawCard();
                        this.hand.replace_cards[1]--;
                        scene.replaceIcons[1].valueText.text = this.hand.replace_cards[1];
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
            }
        });

        this.sprite.on('pointerover', () => {
            if (this.interactive) {
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
            if (this.interactive) {
                this.visual.setScale(1);
                this.visual.y += 10;
                this.outline.setVisible(false);
                this.discardFilter.setVisible(false);
            }
        })

        // this.name
    },

    Reverse_card: function (is_interactive) {
        this.interactive = is_interactive;
        this.reverseImage.setVisible(!this.reverseImage.visible);
    },

});

let Hand = new Phaser.Class({
    params: {
        cardScale: 0.175,
        cardBaseWidth: 800,
        cardBaseHeight: 1000,
        cardPadding: 16,
        bottomPadding: 64,
        topPadding: 32,

        enemyCardScale: 0.175 / 2,

    },

    initialize:
    function Hand(scene, size, deck, enemy = false) {
        this.size = size;
        this.enemy = enemy;
        this.cards = [];
        this.deck = deck;
        this.scene = scene;
        this.replace_cards = [0, 0];
        this.cardScale = enemy ? this.params.enemyCardScale : this.params.cardScale;

        let screenWidth = scene.sys.game.canvas.width;
        let screenHeight = scene.sys.game.canvas.height;
        if (enemy)
            this.cardY = this.params.topPadding + this.params.cardBaseHeight * this.cardScale / 2;
        else this.cardY = screenHeight - this.params.cardBaseHeight * this.cardScale / 2 - this.params.bottomPadding;
        this.cancelButton = new Button(this.scene, "cancel", scene.layout.CANCEL_BUTTON_X, scene.layout.CANCEL_BUTTON_Y, 0.5, "button_cancel", this);

        console.assert(size > 0);
        console.assert(deck.length >= size);
        this.drawUntilLimit();
        this.phase = PHASE.REST;
        this.changePhase(PHASE.MOVE);
    },

    drawCard: function () {
        this.cards.push(new Card(this.scene, this.deck.pop(), 0, this.cardY, this.cardScale, this));
        this.repositionCards(this.scene);
        if (!this.enemy) {
            this.cards[this.cards.length - 1].Reverse_card(true);
        }
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
        let cardWidth = this.params.cardBaseWidth * this.cardScale;
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
        this.cancelButton.visual.visible = false;
        switch (this.phase) {
            case PHASE.MOVE:
                for (var i = 0; i < 2; i++) //ukrywanie ikonek efektów wykonywanych po turze
                    this.scene.replaceIcons[i].visual.setVisible(false);
                break;
            case PHASE.CAN_REPLACE:
                this.scene.replaceIcons[1].visual.setVisible(false);
                this.cancelButton.visual.visible = true;
                break;
        }
    },
});

let Battle = new Phaser.Class({

    initialize:
    function Battle(scene, userDeck, opponentDeck) {
        this.scene = scene;
        this.cards = [null, null];
        this.cardsObjects = [null, null];
        this.effects = [];
        this.playerDeck = userDeck;
        this.enemyDeck = opponentDeck;
        this.playerHand = new Hand(scene, 5, this.playerDeck, 0);
        this.enemyHand = new Hand(scene, 5, this.enemyDeck, 1);
        this.points = { user: this.getEmptyPoints(), enemy: this.getEmptyPoints() };
    },

    getEmptyPoints: function () { //Tworzy pusty obiekt do trzymania punktów, w którym każdemu żywiołowi odpowiada '0'
        let res = {};
        for (var i = 0; i < ELEMENT.basic.length; i++) {
            res[ELEMENT.basic[i]] = 0;
        }
        return res;
    },

    addCard: function (new_card, user) { //User=true oznacza użytkownika, false przeciwnika
        this.cards[user ? 0 : 1] = new_card;
        let layout = this.scene.layout;
        this.cardsObjects[user ? 0 : 1] = new Card(this.scene, new_card, layout.WIDTH / 2 + (user ? -0.5 : 0.5) * layout.CHOSEN_CARDS_SPACING, layout.CHOSEN_CARDS_Y, layout.CHOSEN_CARDS_SCALE, null);
        if (this.cards[0] != null && this.cards[1] != null) {
            for (var i = 0; i < 2; i++)
                this.cardsObjects[i].Reverse_card(false);
            setTimeout(() => { this.endTurn(); }, 1750);
        }
    },

    endTurn: function () {
        //console.log(this.effects);
        for (var i = 0; i < 2; i++)
            this.cardsObjects[i].visual.removeAll(true);
        let score = cardsLogic.getWinner(this.cards[0], this.cards[1], this.effects);
        this.effects = EffectBank.updateEffects(this.cards[0], this.cards[1], score, this.effects);
        switch (score) {
            case 1:
                console.log(this.cards[0].displayName + " wins!");
                this.points.user[this.cards[0].element]++;
                break;
            case -1: console.log(this.cards[1].displayName + " wins!");
                this.points.enemy[this.cards[1].element]++;
                break;
            case 0: console.log("It's a draw"); break;
        }
        this.scene.updateIcons(this.points, this.effects);
        this.Check_if_anyone_wins();
        this.cards = [null, null];    //czyszczenie tablicy

        let afterturn_table = EffectBank.getAfterturnEffectsTable(this.effects);   //efekty po turze (głównie modyfikujące rękę)
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
    },

    Check_if_anyone_wins: function () {
        let userVictory = this.checkForVictory(this.points.user);
        let enemyVictory = this.checkForVictory(this.points.enemy);
        if (userVictory && enemyVictory) console.error("Remis 🤔"); //Póki co nie powinno to być możliwe
        else if (userVictory) this.scene.scene.start('SceneVictory', { victor: this.scene.userDrone, element: userVictory });
        else if (enemyVictory) this.scene.scene.start('SceneVictory', { victor: this.scene.opponentDrone, element: enemyVictory });
    },

    checkForVictory: function (playerPoints) { //Sprawdza, czy dany gracz wygrał. Jeśli tak, zwraca jakim elementem, jeśli nie, zwraca null
        let target = this.scene.config.VICTORY_AMOUNT;
        let allElements = this.scene.config.ALL_ELEMENTS;
        for (var i = 0; i < allElements.length; i++) {
            if (playerPoints[allElements[i]] >= target) return allElements[i];
        }
        return null;
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
        this.icons = {};
        this.visual = scene.add.container(x, y);
        this.elements = scene.config.ALL_ELEMENTS;

        let spacing = scene.layout.VICTORY_ICONS_SPACING;
        let scale = scene.layout.VICTORY_ICONS_SCALE;

        for (let i = 0; i < this.elements.length; i++) {
            this.icons[this.elements[i]] = [];
            for (let j = 0; j < 3; j++) {
                let newIcon = scene.add.image(i * spacing, - j * spacing, ELEMENT.info[this.elements[i]].symbol).setScale(scale);
                newIcon.alpha = 0.15;
                this.visual.add(newIcon);
                this.icons[this.elements[i]].push(newIcon);
            }
        }
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
