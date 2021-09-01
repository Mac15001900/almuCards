let ScenePreBattle = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:
        function ScenePreBattle()
        {
            Phaser.Scene.call(this, { key: 'ScenePreBattle' });
        },

    preload: function ()
    {
        console.log('Preload in pre-battle scene');
    },

    create: function ()
    {

        this.opponentText = this.add.text(this.sys.game.canvas.width / 2, 100, "Łączenie...", { font: "32px Arial", fill: "#ffffff", align: 'center' });
        this.opponentText.setOrigin(0.5, 0.5);
        this.spectator = false;
        this.playerDeck = DeckBank.getClasicDeck();
        this.enemyDeck = null;
        this.startButton = new TextButton(this, this.sys.game.canvas.width / 2, 500, "Start", () => Network.sendMessage("startBattle", {}), false);
        this.galeryButton = new TextButton(this, this.sys.game.canvas.width / 2, 700, "Galeria", () => this.openGallery());

        if (Network.drone.clientId)
        {
            this.userDrone = Network.getUser();
            this.networkConnected();
        }

    },

    update: function (timestep, dt)
    {

    },

    receiveMessage: function (data, member)
    {
        switch (data.type)
        {
            case "enemyDeck":
                if (this.enemyDeck === null && member != Network.getUser())
                {
                    this.enemyDeck = data.content;
                    Network.sendMessage("enemyDeck", this.playerDeck);  //odpowiedź do przeciwnika z informacjami o własnej talii
                }
                break;
            case "startBattle":
                this.startBattle();
        }
    },

    networkConnected()
    {
        let members = Network.members;
        if (!this.userDrone) this.userDrone = Network.getUser();
        if (members.length > 2)
        {
            this.opponentText.text = "Pojedynek już trwa pomiędzy " + members[0].clientData.name + " a " + members[1].clientData.name;
            this.spectator = true;
        } else if (members.length === 2)
        {
            if (members[0].id === this.userDrone.id) this.opponentDrone = members[1];
            else this.opponentDrone = members[0];
            this.opponentText.text = "Przeciwnik dołączył: " + this.opponentDrone.clientData.name;
            Network.sendMessage("enemyDeck", this.playerDeck);  //przekazanie informacji o swojej talii przeciwnikowi (do wczytywania obrazków)
            this.startButton.setActive(true);
        } else
        {
            this.opponentText.text = "Oczekiwanie na przeciwnika...";
        }
    },

    memberJoined(newMember)
    {
        if (Network.members.length === 2)
        {
            this.opponentDrone = newMember;
            this.opponentText.text = "Przeciwnik dołączył: " + this.opponentDrone.clientData.name;
            this.startButton.setActive(true);
        }
    },

    startBattle()
    {
        this.scene.start('SceneBattle', { userDrone: this.userDrone, opponentDrone: this.opponentDrone, userDeck: this.playerDeck, opponentDeck: this.enemyDeck });
        //this.scene.start('SceneBattle', { userDrone: this.userDrone, opponentDrone: this.opponentDrone, userDeck: this.testDeck, opponentDeck: this.testDeck });
    },

    openGallery()
    {
        this.scene.start('SceneGallery');
    },

});
