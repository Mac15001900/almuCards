const PHASE = {
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
        this.load.image('cardFire', 'assets/card_fire.png');
        this.load.image('cardForest', 'assets/card_forest.png');
        this.load.image('cardWater', 'assets/card_water.png');

        //Obrazki z kart
        let imagesToLoad = DeckBank.getImages(this.userDeck, this.opponentDeck);

        for (let image in imagesToLoad) {
            this.load.image(imagesToLoad[image], 'assets/cardImages/' + imagesToLoad[image] + '.png');
        }
        this.load.image('cardReverse', 'assets/card_reverse.png');

        //Obrazki symboli
        this.load.image('symIconForest', 'assets/forest_icon.png'); //Symbole żywiołów muszą być 100x100
        this.load.image('symIconFire', 'assets/fire_icon.png');
        this.load.image('symIconWater', 'assets/water_icon.png');
        this.load.image('symIconPlus', 'assets/plus_icon.png');
        this.load.image('symIconMinus', 'assets/minus_icon.png');
        this.load.image('symIconReplaceCan', 'assets/replace_icon_can.png');
        this.load.image('symIconReplaceMust', 'assets/replace_icon_must.png');
        this.load.image('symIconWeakerElement', 'assets/weaker_element_icon.png');
        this.load.image('symIconLowerValue', 'assets/lower_value_icon.png');
        this.load.image('symIconOnlyElements', 'assets/only_elements_icon.png');
        this.load.image('symIconOnlyValues', 'assets/only_values_icon.png');

        //Obrazki przycisków
        this.load.image('buttonCancel', 'assets/button_cancel.png');
        this.load.image('help_circle', 'assets/help_circle.png');
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

        BIG_CARD_X: 600,
        BIG_CARD_Y: 400,
    },

    create: function () {
        let layout = this.layout; //Będziemy tego tu dużo używać
        layout.WIDTH = this.sys.game.canvas.width;
        layout.HEIGHT = this.sys.game.canvas.height;

        this.playerName = this.add.text(layout.NAMES_H_PADDING, layout.NAMES_Y, " " + this.userDrone.clientData.name + " (" + this.userDrone.clientData.points + ") ", { font: "30px Arial", fill: "#000000", align: 'left', backgroundColor: "#DDDDDD" });
        this.opponentName = this.add.text(layout.WIDTH - layout.NAMES_H_PADDING, layout.NAMES_Y, " (" + this.opponentDrone.clientData.points + ") " + this.opponentDrone.clientData.name + " ", { font: "30px Arial", fill: "#000000", align: 'right', backgroundColor: "#DDDDDD", boundsAlignH: 'right' });
        this.opponentName.setOrigin(1, 0);

        //tworzenie ikonek wskazujących zwycięstwo graczy
        this.userWon = new VictoryIcons(this, layout.VICTORY_ICONS_HORIZONTAL_PADDING, layout.VICTORY_ICONS_HEIGHT);
        let enemyWonX = layout.WIDTH - layout.VICTORY_ICONS_HORIZONTAL_PADDING - layout.VICTORY_ICONS_SPACING - layout.VICTORY_ICONS_SCALE * 100;
        this.enemyWon = new VictoryIcons(this, enemyWonX, layout.VICTORY_ICONS_HEIGHT);

        //tworzenie ikonek informujących o istniejących efektach (dotyczących kart, nie ręki)
        this.plusIcons = [
            new Icon(this, layout.EFFET_ICON_HORIZONTAL_PADDING, layout.EFFET_ICON_HEIGHT, layout.EFFET_ICON_SCALE, 'symIconPlus'),
            new Icon(this, layout.WIDTH - layout.EFFET_ICON_HORIZONTAL_PADDING, layout.EFFET_ICON_HEIGHT, layout.EFFET_ICON_SCALE, 'symIconPlus')
        ];
        this.minusIcons = [
            new Icon(this, layout.EFFET_ICON_HORIZONTAL_PADDING, layout.EFFET_ICON_HEIGHT, layout.EFFET_ICON_SCALE, 'symIconMinus'),
            new Icon(this, layout.WIDTH - layout.EFFET_ICON_HORIZONTAL_PADDING, layout.EFFET_ICON_HEIGHT, layout.EFFET_ICON_SCALE, 'symIconMinus')
        ];
        this.replaceIcons = [   //pierwsza na CanReplace, druga na MustReplace, nie ma po co pokazywać ikonek przeciwnika
            new Icon(this, layout.EFFET_ICON_HORIZONTAL_PADDING + layout.EFFET_ICON_SPACING, layout.EFFET_ICON_HEIGHT, layout.EFFET_ICON_SCALE, 'symIconReplaceCan'),
            new Icon(this, layout.EFFET_ICON_HORIZONTAL_PADDING + layout.EFFET_ICON_SPACING, layout.EFFET_ICON_HEIGHT, layout.EFFET_ICON_SCALE, 'symIconReplaceMust'),
        ];
        this.conditionIcons = [  //po jednej kopii, nie ma sensu pokazywać ich po obu stronach ekranu
            new Icon(this, layout.WIDTH - layout.EFFET_ICON_HORIZONTAL_PADDING + layout.EFFET_ICON_SPACING, layout.EFFET_ICON_HEIGHT + layout.EFFET_ICON_SPACING, layout.EFFET_ICON_SCALE, 'symIconWeakerElement'),
            new Icon(this, layout.WIDTH - layout.EFFET_ICON_HORIZONTAL_PADDING, layout.EFFET_ICON_HEIGHT + layout.EFFET_ICON_SPACING, layout.EFFET_ICON_SCALE, 'symIconLowerValue'),
            new Icon(this, layout.WIDTH - layout.EFFET_ICON_HORIZONTAL_PADDING - layout.EFFET_ICON_SPACING, layout.EFFET_ICON_HEIGHT + layout.EFFET_ICON_SPACING, layout.EFFET_ICON_SCALE, 'symIconOnlyElements'),
            new Icon(this, layout.WIDTH - layout.EFFET_ICON_HORIZONTAL_PADDING - 2 * layout.EFFET_ICON_SPACING, layout.EFFET_ICON_HEIGHT + layout.EFFET_ICON_SPACING, layout.EFFET_ICON_SCALE, 'symIconOnlyValues'),
        ];

        this.cardBattle = new Battle(this, this.userDeck, this.opponentDeck);
        this.updateIcons(this.cardBattle.points, []);

        //Oczekiwanie na przeciwnika
        Network.confirm("battleLoaded", Network.Room.DUEL, () => this.cardBattle.playerHand.changePhase(PHASE.MOVE));
        this.cardBattle.enemyHand.changePhase(PHASE.MOVE);

        this.helpButton = new Button(this, "help", layout.WIDTH - 20, layout.HEIGHT - 20, 0.5, "help_circle", null);
        this.helpScreen = this.add.text(layout.WIDTH / 2, 100, s.help, { font: "20px Arial", backgroundColor: "#FFFFFF", fill: "#000000" });
        this.helpScreen.setOrigin(0.5, 0);
        this.helpScreen.setVisible(false);
        this.helpScreen.setDepth(20);
    },

    update: function (timestep, dt) {

    },

    receiveMessage: function (data, member) {
        switch (data.type) {
            case "cardPicked":
                this.cardBattle.addCard(data.content, member.id === Network.drone.clientId);
                break;
        }
    },


    memberLeft: function (member, room) { //TODO: kod jest duplikatem ze scenePreBattle
        if (room === Network.Room.DUEL && Network.compareMembers(member, this.opponentDrone)) {
            alert("Przeciwnik opuszcza grę 😢");
            console.log("Przeciwnik opuścił grę, więc my też 😒");
            Network.sendMessage("changeState", Network.State.FREE);
            this.scene.start('SceneLobby');
        }
    },

    updateIcons: function (points, effects) {

        this.userWon.update(points.user);
        this.enemyWon.update(points.enemy);

        let inturnTable = EffectBank.getInturnEffectsTable(cardData.basic1, cardData.basic1, effects);  //2 pierwsze argumenty to karty bez efektów
        let afterturnTable = EffectBank.getAfterturnEffectsTable(effects);
        let addTable = [inturnTable.playerAdd, inturnTable.enemyAdd];
        for (let i = 0; i < 2; i++) {
            if (addTable[i] > 0) {
                this.plusIcons[i].valueText.text = "+" + addTable[i];
                this.plusIcons[i].visual.visible = true;
            }
            else
                this.plusIcons[i].visual.visible = false;
            if (addTable[i] < 0) {
                this.minusIcons[i].valueText.text = addTable[i];
                this.minusIcons[i].visual.visible = true;
            }
            else
                this.minusIcons[i].visual.visible = false;
        }
        this.conditionIcons[0].visual.visible = inturnTable.reverseElements === -1;
        this.conditionIcons[1].visual.visible = inturnTable.reverseValues === -1;
        this.conditionIcons[2].visual.visible = inturnTable.onlyElements === 1;
        this.conditionIcons[3].visual.visible = inturnTable.onlyValues === 1;
        if (afterturnTable.playerReplace !== 0) {
            this.replaceIcons[0].valueText.text = afterturnTable.playerReplace;
            this.replaceIcons[0].visual.visible = true;
        }
        else
            this.replaceIcons[0].visual.visible = false;
        if (afterturnTable.playerRemove !== 0) {
            this.replaceIcons[0].visual.visible = false;
            this.replaceIcons[1].valueText.text = afterturnTable.playerRemove;
            this.replaceIcons[1].visual.visible = true;
            //console.log("REMOVE1");
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
        this.effectTextfont = ((60 * 70 / (Math.max(EffectBank.getEffectDescription(data.effect).length - 70, 0) + 70)) * scale) + "px Arial";
        this.effectText = scene.add.text(0, 0, EffectBank.getEffectDescription(data.effect), { font: this.effectTextfont, fill: "#000000", wordWrap: { width: 700 * scale }, align: 'left' });
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
    function Hand(scene, size, deckData, enemy = false) {
        this.size = size;
        this.enemy = enemy;
        this.cards = [];
        //this.deck = deckData;
        this.scene = scene;
        this.replaceCards = [0, 0];
        this.cardScale = enemy ? this.params.enemyCardScale : this.params.cardScale;

        let screenWidth = scene.sys.game.canvas.width;
        let screenHeight = scene.sys.game.canvas.height;
        if (enemy)
            this.cardY = this.params.topPadding + this.params.cardBaseHeight * this.cardScale / 2;
        else
            this.cardY = screenHeight - this.params.cardBaseHeight * this.cardScale / 2 - this.params.bottomPadding;
        this.cancelButton = new Button(this.scene, "cancel", scene.layout.CANCEL_BUTTON_X, scene.layout.CANCEL_BUTTON_Y, 0.5, "buttonCancel", this);

        this.deck = []; //nie mylić deck z this.deck (pierwsze ma tylko informacje, a drugie całe karty)
        let deckDataLength = deckData.length;   //linijka obowiązkowa, inaczej pętla nie dojdzie do końca
        for (let i = 0; i < deckDataLength; i++) //tworzenie talii kart z listy danych
            this.deck.push(new Card(this.scene, deckData.pop(), 0, this.cardY, this.cardScale, this));

        console.assert(size > 0);
        //console.assert(deckData.length >= size);
        console.assert(this.deck.length >= size);
        this.drawUntilLimit();
        //this.phase = PHASE.REST;
        this.changePhase(PHASE.REST);
    },

    addCard: function (cardData) {
        let newCard = new Card(this.scene, cardData, 0, this.cardY, this.cardScale, this);
        let index = Math.floor(Math.random() * (this.deck.length + 1));   //losowanie miejsca w talii, gdzie zostanie dodana karta
        this.deck.push(newCard);    //umieszczanie karty na końcu talii
        for (let i = this.deck.length - 1; i > index; i--)  //przsuwanie karty na odpowiednie miejsce w talii
        {
            let bufor = this.deck[i];
            this.deck[i] = this.deck[i - 1];
            this.deck[i - 1] = bufor;
        }
        this.drawUntilLimit();  //aby ręka się wypełniła, jeśli nie było z czego dobierać
        this.repositionCards(this.scene);
    },

    drawCard: function () {
        //this.cards.push(new Card(this.scene, this.deck.pop(), 0, this.cardY, this.cardScale, this));
        if (this.deck.length > 0) {
            this.cards.push(this.deck.shift());
            if (!this.enemy) {
                this.cards[this.cards.length - 1].reverseCard(true, true);
            }
        }
        this.repositionCards(this.scene);
    },

    drawUntilLimit: function () {
        while (this.cards.length < this.size && this.deck.length > 0) {
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
            for (let i = 0; i < this.deck.length; i++) {
                this.deck[i].visual.x = screenWidth / 2 - fullWidth / 2 - 1.2 * (cardWidth + padding) + cardWidth / 2;
                this.deck[i].visual.y = this.cardY + 50 * i * (this.enemy ? -1 : 1) * this.deck[i].scale;
                this.deck[i].visual.setDepth(5 - i * 0.1);
            }
            for (let i = this.cards.length - 1; i >= 0; i--) {
                this.cards[this.cards.length - i - 1].visual.x = screenWidth / 2 - fullWidth / 2 + i * (cardWidth + padding) + cardWidth / 2;
                this.cards[this.cards.length - i - 1].visual.y = this.cardY;
                this.cards[this.cards.length - i - 1].visual.setDepth(5);
            }
        }
        else {
            console.warn("Ręka nie miejści się na ekranie");
            for (let i = 0; i < this.cards.length; i++) {
                this.cards[i].visual.x = cardWidth / 2 + i * (screenWidth - cardWidth) / (this.cards.length - 1);
            }
        }


    },

    lookOnDeck: function (value) {
        for (let i = 0, reversedCards = 0; i < this.deck.length && reversedCards < value; i++) {
            if (this.deck[i].reverseImage.visible) {
                this.deck[i].reverseCard(true, false);
                reversedCards++;
            }
        }
    },

    changePhase: function (new_phase) {
        this.phase = new_phase;
        this.cancelButton.visual.visible = false;
        switch (this.phase) {
            case PHASE.MOVE:
                for (let i = 0; i < 2; i++) //ukrywanie ikonek efektów wykonywanych po turze
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
        for (let i = 0; i < ELEMENT.basic.length; i++) {
            res[ELEMENT.basic[i]] = 0;
        }
        return res;
    },

    addCard: function (new_card, user) { //User=true oznacza użytkownika, false przeciwnika
        this.cards[user ? 0 : 1] = new_card;
        let layout = this.scene.layout;
        this.cardsObjects[user ? 0 : 1] = new Card(this.scene, new_card, layout.WIDTH / 2 + (user ? -0.5 : 0.5) * layout.CHOSEN_CARDS_SPACING, layout.CHOSEN_CARDS_Y, layout.CHOSEN_CARDS_SCALE, null);
        if (this.cards[0] !== null && this.cards[1] !== null) {
            for (let i = 0; i < 2; i++)
                this.cardsObjects[i].reverseCard(true, false);
            setTimeout(() => { this.endTurn(); }, 1750);
        }
    },


    endTurn: function () {

        for (let i = 0; i < 2; i++)
            this.cardsObjects[i].visual.removeAll(true);
        let score = cardsLogic.getWinner(this.cards[0], this.cards[1], this.effects);
        this.effects = EffectBank.updateEffects(this.cards[0], this.cards[1], score, this.effects);
        switch (score) {
            case 1:
                console.log(this.cards[0].displayName + " wins!");
                this.points.user[this.cards[0].element]++;
                this.scene.userWon.explosion(this.cards[0].element, this.points.user[this.cards[0].element]);
                break;
            case -1: console.log(this.cards[1].displayName + " wins!");
                this.points.enemy[this.cards[1].element]++;
                this.scene.enemyWon.explosion(this.cards[1].element, this.points.enemy[this.cards[1].element]);
                break;
            case 0: console.log("It's a draw"); break;
        }
        this.scene.updateIcons(this.points, this.effects);
        this.CheckIfAnyoneWins();
        EffectBank.addCardsToHands(this.effects, this.playerHand, this.enemyHand);
        this.cards = [null, null];    //czyszczenie tablicy

        let afterturnTable = EffectBank.getAfterturnEffectsTable(this.effects);   //efekty po turze (głównie modyfikujące rękę)     
        if (afterturnTable.playerRemove > 0) //gracz musi wymienić karty
        {
            this.playerHand.replaceCards[1] += afterturnTable.playerRemove;
            this.playerHand.changePhase(PHASE.MUST_REPLACE);
            if (afterturnTable.playerReplace > 0)  //będzie mógł jeszcze dodatkowo wymienić karty
                this.playerHand.replaceCards[0] += afterturnTable.playerReplace; //zapisanie, ile kart będzie mógł wymienić
        }
        else if (afterturnTable.playerReplace > 0) //gracz może wymienić karty
        {
            this.playerHand.replaceCards[0] += afterturnTable.playerReplace; //zapisanie, ile kart może wymienić
            this.playerHand.changePhase(PHASE.CAN_REPLACE);  //ustawienie odpowiedniego trybu
        }
        else
            this.playerHand.changePhase(PHASE.MOVE);
        if (afterturnTable.playerLook > 0)  //look on player's deck
        {
            this.playerHand.lookOnDeck(afterturnTable.playerLook);
        }
    },

    CheckIfAnyoneWins: function () {
        let userVictory = this.checkForVictory(this.points.user);
        let enemyVictory = this.checkForVictory(this.points.enemy);
        if (userVictory && enemyVictory) console.error("Remis 🤔"); //Póki co nie powinno to być możliwe
        else if (userVictory) this.scene.scene.start('SceneVictory', { victor: this.scene.userDrone, element: userVictory });
        else if (enemyVictory) this.scene.scene.start('SceneVictory', { victor: this.scene.opponentDrone, element: enemyVictory });
    },

    checkForVictory: function (playerPoints) { //Sprawdza, czy dany gracz wygrał. Jeśli tak, zwraca jakim elementem, jeśli nie, zwraca null
        let target = this.scene.config.VICTORY_AMOUNT;
        let allElements = this.scene.config.ALL_ELEMENTS;
        for (let i = 0; i < allElements.length; i++) {
            if (playerPoints[allElements[i]] >= target) return allElements[i];
        }
        return null;
    }
});
