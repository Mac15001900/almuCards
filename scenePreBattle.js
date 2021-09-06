let ScenePreBattle = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:
    function ScenePreBattle() {
        Phaser.Scene.call(this, { key: 'ScenePreBattle' });
    },

    preload: function () {
        console.log('Preload w pre-battle');
        console.assert(Network.roomNames[Network.Room.DUEL]); //Gdy ta scena jest wywoływana, powinien istnieć już pokój do pojedynku
    },

    layout: {
        WIDTH: null,
        HEIGHT: null,

    },

    create: function () {
        let layout = this.layout;
        layout.WIDTH = this.sys.game.canvas.width;
        layout.HEIGHT = this.sys.game.canvas.height;

        this.opponentText = this.add.text(layout.WIDTH / 2, 100, "Łączenie...", { font: "32px Arial", fill: "#ffffff", align: 'center' });
        this.opponentText.setOrigin(0.5, 0.5);
        this.spectator = false;
        this.playerDeck = DeckBank.getClasicDeck();
        this.opponentDeck = null;
        this.startButton = new TextButton(this, layout.WIDTH / 2, 500, "Start", () => Network.sendMessage("startBattle", {}, Network.Room.DUEL), false);
        this.galeryButton = new TextButton(this, layout.WIDTH / 2, 700, "Galeria", () => this.scene.start('SceneGallery'));

        //Sprawdzamy, czy uczestniczymy w tym pojedynku. TODO: Strasznie to brzdkie i zależne od systemu nazw. Powinniśmy jakoś ładniej przekazać tej scenie id pojedynkujących się
        let roomNameParts = Network.roomNames[Network.Room.DUEL].split('-');
        this.spectator = false;
        if (Network.isUser(roomNameParts[2])) this.opponentDrone = Network.getMember(roomNameParts[3]);
        else if (Network.isUser(roomNameParts[3])) this.opponentDrone = Network.getMember(roomNameParts[2]);
        else this.spectator = true;
        console.assert(!this.spectator); //TODO: Tymczasowe, póki nie da się być obserwującym

        this.userDrone = Network.getUser();
        if (!this.spectator) {
            Network.confirm("preBattleLoaded", Network.Room.DUEL, (() => {
                Network.sendMessage("opponentDeck", this.playerDeck, Network.Room.DUEL);
                if (!this.opponentDeck) this.opponentText.text = this.opponentDrone.clientData.name + " wybiera talię...";
            }).bind(this));
            this.opponentText.text = "Oczkiwanie na " + this.opponentDrone.clientData.name + "...";
        }
        this.createFinished = true;
    },

    update: function (timestep, dt) {

    },

    receiveMessage: function (data, sender) {
        switch (data.type) {
            case "opponentDeck":
                if (this.spectator) {
                    if (!this.spectatedDecks) this.spectatedDecks = [];
                    this.spectatedDecks = this.spectatedDecks.concat(data.content);
                } else if (!Network.isUser(sender)) {
                    this.opponentDeck = data.content;
                    this.opponentText.text = "Pojedynek gotowy!";
                    this.startButton.setActive(true);
                }
                if (this.waitingForDeck && !Network.isUser(sender)) this.startBattle();
                break;
            case "startBattle":
                if (this.spectatedDecks || this.opponentDeck) this.startBattle();
                else this.waitingForDeck = true; //Ta zmienna oznacza, że chcemy już zacząć pojedynek, ale nie otrzymaliśmy jeszcze talii
                break;
        }
    },

    startBattle() {
        this.scene.start('SceneBattle', { userDrone: this.userDrone, opponentDrone: this.opponentDrone, userDeck: this.playerDeck, opponentDeck: this.opponentDeck });
        //this.scene.start('SceneBattle', { userDrone: this.userDrone, opponentDrone: this.opponentDrone, userDeck: this.testDeck, opponentDeck: this.testDeck });
    },

    openGallery() {
        this.scene.start('SceneGallery');
    },

});
