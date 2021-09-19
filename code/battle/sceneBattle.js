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
        this.userDeck = DeckUtils.assembleDeck(data.userDeck);
        this.opponentDeck = DeckUtils.assembleDeck(data.opponentDeck);
        DeckUtils.validateDeck(this.userDeck);
        DeckUtils.validateDeck(this.opponentDeck);
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
        let imagesToLoad = DeckUtils.getImages(this.userDeck, this.opponentDeck);

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

        let inturnTable = EffectUtils.getInturnEffectsTable(cardData.basic1, cardData.basic1, effects);  //2 pierwsze argumenty to karty bez efektów
        let afterturnTable = EffectUtils.getAfterturnEffectsTable(effects);
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

