let ScenePreBattle = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:
    function ScenePreBattle() {
        Phaser.Scene.call(this, { key: 'ScenePreBattle' });
    },

    preload: function () {
        console.log('Preload in pre-battle scene');
        this.load.image('invite_icon', 'assets/invite_icon.png');
        this.load.image('cancel_circle', 'assets/cancel_circle.png');  //https://game-icons.net/1x1/sbed/cancel.html#download
        this.load.image('confirm_circle', 'assets/confirm_circle.png');//https://game-icons.net/1x1/delapouite/confirmed.html#download
    },

    layout: {
        WIDTH: null,
        HEIGHT: null,

        LIST_SPACING: 16,
        LIST_BUTTON_DISTANCE: 16,
        LIST_START_X: 32,
        LIST_START_Y: 32 + 12,

        INVITE_BOX_WIDTH: 300,
        INVITE_BOX_HEIGHT: 200,
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
        this.startButton = new TextButton(this, layout.WIDTH / 2, 500, "Start", () => Network.sendMessage("startBattle", {}), false);
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
            case "invite":
                if (Network.isUser(data.content.receiver)) this.invite = new Invite(this, sender);
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

        this.playerList = new PlayerList(this, this.layout.LIST_START_X, this.layout.LIST_START_Y, members);
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

let PlayerList = new Phaser.Class({

    initialize:
    function PlayerList(scene, x, y) {
        let members = Network.members.filter(u => !Network.isUser(u));
        this.list = [];
        for (let i = 0; i < members.length; i++) {
            this.list.push(new PlayerListElement(scene, x, y + scene.layout.LIST_SPACING * i, members[i]));
        }

    }

});

let PlayerListElement = new Phaser.Class({
    initialize:
    function PlayerListElement(scene, x, y, member) {
        let layout = scene.layout;
        this.text = scene.add.text(x, y, member.clientData.name, { font: "24px Arial", fill: "#ffffff", align: 'center' }).setOrigin(0, 0.5);
        this.icon = scene.add.image(x + this.text.width + layout.LIST_BUTTON_DISTANCE, y, 'invite_icon');
        this.icon.x += this.icon.width / 2; //Nie możemy użyć setOrigin, bo setScale by dziwnie wyglądało
        this.icon.setInteractive().on('pointerup', function (event) {
            InviteManager.sendInvite(member.id);
        }, scene);
        this.icon.on('pointerover', () => {
            this.icon.setScale(1.08);
        });
        this.icon.on('pointerout', () => {
            this.icon.setScale(1);
        })
    }
});

let Invite = new Phaser.Class({
    initialize:
    function initialize(scene, member) {
        let layout = scene.layout;
        this.visual = scene.add.container(layout.INVITE_BOX_WIDTH / 2, layout.HEIGHT - layout.INVITE_BOX_HEIGHT / 2);

        this.base = scene.add.rectangle(0, 0, layout.INVITE_BOX_WIDTH, layout.INVITE_BOX_HEIGHT, 0x778899); //TODO: standaryzacja kolorów
        this.text = scene.add.text(16, -layout.INVITE_BOX_HEIGHT * (1 / 4), "Zaproszenie od " + member.clientData.name, { font: "24px Arial", fill: "#ffffff", wordWrap: { width: layout.INVITE_BOX_WIDTH - 32 }, align: 'center' }).setOrigin(0.5, 0.5);
        this.cancel = new SimpleButton(scene, - layout.INVITE_BOX_WIDTH * (1 / 4), layout.INVITE_BOX_HEIGHT * (1 / 6),
            'cancel_circle', InviteManager.rejectInvite);
        this.confirm = new SimpleButton(scene, + layout.INVITE_BOX_WIDTH * (1 / 4), layout.INVITE_BOX_HEIGHT * (1 / 6),
            'confirm_circle', InviteManager.acceptInvite);

        this.visual.add([this.base, this.text, this.cancel.icon, this.confirm.icon]);
    }





});
