let ScenePreBattle = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:
    function ScenePreBattle() {
        Phaser.Scene.call(this, { key: 'ScenePreBattle' });
    },

    preload: function () {
        console.log('Preload in pre-battle scene');
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
        this.enemyDeck = DeckBank.getClasicDeck();
        this.startButton = new TextButton(this, layout.WIDTH / 2, 500, "Start", () => Network.sendMessage("startBattle", {}, Network.Room.DUEL), false);
        this.galeryButton = new TextButton(this, layout.WIDTH / 2, 700, "Galeria", () => this.openGallery());

        this.createFinished = true;
        if (Network.drone.clientId) {
            this.userDrone = Network.getUser();
            this.networkConnected();
        }

    },

    update: function (timestep, dt) {

    },

    receiveMessage: function (data, sender) {
        switch (data.type) {
            case "startBattle":
                this.startBattle();
                break;
        }
    },

    networkConnected() {
        if (!this.createFinished) return;
        let members = Network.members;
        if (!this.userDrone) this.userDrone = Network.getUser();
        if (members.length > 2) {
            this.opponentText.text = "Pojedynek już trwa pomiędzy " + members[0].clientData.name + " a " + members[1].clientData.name;
            this.spectator = true;
        } else if (members.length === 2) {
            if (members[0].id === this.userDrone.id) this.opponentDrone = members[1];
            else this.opponentDrone = members[0];
            this.opponentText.text = "Przeciwnik dołączył: " + this.opponentDrone.clientData.name;
            this.startButton.setActive(true);
        } else {
            this.opponentText.text = "Oczekiwanie na przeciwnika...";
        }
    },

    memberJoined(newMember) {
        if (Network.members.length === 2) {
            this.opponentDrone = newMember;
            this.opponentText.text = "Przeciwnik dołączył: " + this.opponentDrone.clientData.name;
            this.startButton.setActive(true);
        }
    },

    startBattle() {
        this.scene.start('SceneBattle', { userDrone: this.userDrone, opponentDrone: this.opponentDrone, userDeck: this.playerDeck, opponentDeck: this.enemyDeck });
        //this.scene.start('SceneBattle', { userDrone: this.userDrone, opponentDrone: this.opponentDrone, userDeck: this.testDeck, opponentDeck: this.testDeck });
    },

    openGallery() {
        this.scene.start('SceneGallery');
    },

});
