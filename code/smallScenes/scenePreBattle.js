let ScenePreBattle = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:
    function ScenePreBattle() {
        Phaser.Scene.call(this, { key: 'ScenePreBattle' });
    },

    preload: function () {
        console.log('Preload w pre-battle');
        console.assert(Network.roomNames[Network.Room.DUEL]); //Gdy ta scena jest wywoływana, powinien istnieć już pokój do pojedynku
        this.load.image('help_circle', 'assets/help_circle.png');
        this.load.image('dot_off', 'assets/dot_off.png');
        this.load.image('dot_on', 'assets/dot_on.png');
    },

    layout: {
        WIDTH: null,
        HEIGHT: null,


        DECKS_LIST_X: 1000,
        DECKS_LIST_Y: 300,
        DECKS_LIST_SPACING: 30,
    },

    create: function () {
        let layout = this.layout;
        layout.WIDTH = this.sys.game.canvas.width;
        layout.HEIGHT = this.sys.game.canvas.height;

        this.opponentText = this.add.text(layout.WIDTH / 2, 100, "Łączenie...", { font: "32px Arial", fill: "#ffffff", align: 'center' });
        this.opponentText.setOrigin(0.5, 0.5);
        this.protipText = this.add.text(layout.WIDTH / 2, 140, Phaser.Math.RND.pick(s.protips), { font: "18px Arial", fill: "#ffffff", align: 'center' });
        this.protipText.setOrigin(0.5, 0.5);
        this.spectator = false;
        this.playerDeck = null;
        this.deckIndex = -1;    //talia zostanie dodana później
        this.opponentDeck = null;
        this.startButton = new TextButton(this, layout.WIDTH / 2, 500, "Start", () => Network.sendMessage("startBattle", {}, Network.Room.DUEL), false);

        //this.galeryButton = new TextButton(this, layout.WIDTH / 2, 700, "Galeria", () => this.scene.start('SceneGallery'));


        this.versionText = this.add.text(0, 0, "Wersja: " + plStrings.version, { fill: "#FFFFFF" });

        //elementy okna pomocy
        this.helpButton = new Button(this, "help", layout.WIDTH - 20, 20, 0.5, "help_circle", null);
        this.helpScreen = this.add.text(layout.WIDTH / 2, 100, plStrings.help, { font: "20px Arial", backgroundColor: "#FFFFFF", fill: "#000000" });
        this.helpScreen.setOrigin(0.5, 0);
        this.helpScreen.setVisible(false);
        this.helpScreen.setDepth(10);

        //Sprawdzamy, czy uczestniczymy w tym pojedynku. TODO: Strasznie to brzdkie i zależne od systemu nazw. Powinniśmy jakoś ładniej przekazać tej scenie id pojedynkujących się
        let roomNameParts = Network.roomNames[Network.Room.DUEL].split('-');
        this.spectator = false;
        if (Network.isUser(roomNameParts[2]))
            this.opponentDrone = Network.getMember(roomNameParts[3]);
        else if (Network.isUser(roomNameParts[3]))
            this.opponentDrone = Network.getMember(roomNameParts[2]);
        else
            this.spectator = true;
        console.assert(!this.spectator); //TODO: Tymczasowe, póki nie da się być obserwującym

        this.decksChoices = [new DeckChoice(this, this.layout.DECKS_LIST_X, this.layout.DECKS_LIST_Y, "Talia klasyczna", "dot_on", "dot_off"),
        new DeckChoice(this, this.layout.DECKS_LIST_X, this.layout.DECKS_LIST_Y + this.layout.DECKS_LIST_SPACING, "Ta druga talia", "dot_on", "dot_off")];
        this.decksChoices[0].switch(true);

        this.decksList = [DeckBank.classicDeck, DeckBank.secondDeck];

        this.userDrone = Network.getUser();
        if (!this.spectator) {
            Network.confirm("preBattleLoaded", Network.Room.DUEL, (() => {
                //Network.sendMessage("opponentDeck", [this.playerDeck, 0], Network.Room.DUEL);
                this.chooseDeck(0); //domyślnie wybiera się klasyczną talię
                if (!this.opponentDeck) this.opponentText.text = this.opponentDrone.clientData.name + " wybiera talię...";
            }).bind(this));
            this.opponentText.text = "Oczkiwanie na " + this.opponentDrone.clientData.name + "...";
        }

        this.backButton = new TextButton(this, layout.WIDTH - 150, layout.HEIGHT - 100, "Opuść pojedynek ↩", () => {
            Network.sendMessage("changeState", Network.State.FREE);
            Network.disconnectFromRoom(Network.Room.DUEL);
            this.scene.start('SceneLobby');
        });


        this.createFinished = true;
    },

    update: function (timestep, dt) {

    },

    receiveMessage: function (data, sender) {
        switch (data.type) {
            case "opponentDeck":
                if (this.spectator) {
                    if (!this.spectatedDecks) this.spectatedDecks = [];
                    this.spectatedDecks = this.spectatedDecks.concat(data.content.deck);
                }
                else if (!Network.isUser(sender)) {
                    this.opponentDeck = data.content.deck;
                    this.chooseDeck(data.content.index);
                    this.opponentText.text = "Pojedynek gotowy!";
                    this.startButton.setActive(true);
                }
                if (this.waitingForDeck && !Network.isUser(sender))
                    this.startBattle();
                break;
            case "startBattle":
                if (this.spectatedDecks || this.opponentDeck)
                    this.startBattle();
                else
                    this.waitingForDeck = true; //Ta zmienna oznacza, że chcemy już zacząć pojedynek, ale nie otrzymaliśmy jeszcze talii
                break;
        }
    },

    memberLeft: function (member, room) {
        if (room === Network.Room.DUEL && Network.compareMembers(member, this.opponentDrone)) {
            alert("Przeciwnik opuszcza grę 😢");
            console.log("Przeciwnik opuścił grę, więc my też 😒");
            Network.sendMessage("changeState", Network.State.FREE);
            this.scene.start('SceneLobby');
        }
    },

    startBattle() {
        this.scene.start('SceneBattle', { userDrone: this.userDrone, opponentDrone: this.opponentDrone, userDeck: this.playerDeck, opponentDeck: this.opponentDeck });
        //this.scene.start('SceneBattle', { userDrone: this.userDrone, opponentDrone: this.opponentDrone, userDeck: this.testDeck, opponentDeck: this.testDeck });
    },

    openGallery() {
        this.scene.start('SceneGallery');
    },

    chooseDeckByButton: function (button) {
        this.chooseDeck(this.decksChoices.indexOf(button));
    },

    chooseDeck: function (index) {
        if (index === this.deckIndex)
            return;
        this.deckIndex = index;
        this.playerDeck = this.decksList[index];
        Network.sendMessage("opponentDeck", { deck: this.playerDeck, index: index }, Network.Room.DUEL);
        for (let i = 0; i < this.decksChoices.length; i++) {
            this.decksChoices[i].switch(i === index);
        }
    },

});
