let SceneLobby = new Phaser.Class({


    Extends: Phaser.Scene,

    initialize:
    function SceneLobby() {
        Phaser.Scene.call(this, { key: 'SceneLobby' });
    },

    preload: function () {
        console.log('Preload in lobby scene');
        this.load.image('invite_icon', 'assets/invite_icon.png');
        this.load.image('cancel_circle', 'assets/cancel_circle.png');  //https://game-icons.net/1x1/sbed/cancel.html#download
        this.load.image('confirm_circle', 'assets/confirm_circle.png');//https://game-icons.net/1x1/delapouite/confirmed.html#download

    },

    layout: {
        WIDTH: null,
        HEIGHT: null,

        LIST_SPACING: 32,
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

        this.playerList = new PlayerList(this, this.layout.LIST_START_X, this.layout.LIST_START_Y);
        InviteManager.setCallbacks("TODO", this.startDuel.bind(this));
    },

    update: function (timestep, dt) {

    },

    networkConnected: function () {
        if (this.playerList) this.playerList.update();
    },

    receiveMessage: function (data, sender) {
        switch (data.type) {
            case 'welcome':
                this.playerList.update();
                break;
            case "invite":
                if (Network.isUser(data.content.invited)) this.invite = new Invite(this, sender);
                break;
        }
    },

    startDuel: function () {
        console.log("Zaczynamy pojedynek!");
        this.scene.start('ScenePreBattle');
    },

});



let PlayerList = new Phaser.Class({

    initialize:
    function PlayerList(scene, x, y) {
        this.list = [];
        this.scene = scene;
        this.x = x;
        this.y = y;
        if (Network.members) this.update();
    },

    update: function () {
        console.assert(Network.members);
        let members = Network.members.filter(u => !Network.isUser(u));
        //Usuwamy wszystko z aktualnej listy. TODO: zmieniać instniejące, zamiast usuwać wszystko i budować od nowa
        for (var i = 0; i < this.list.length; i++) {
            this.list[i].visual.removeAll(true);
        }
        this.list = [];
        for (let i = 0; i < members.length; i++) {
            this.list.push(new PlayerListElement(this.scene, this.x, this.y + this.scene.layout.LIST_SPACING * i, members[i]));
        }
    },

});

let PlayerListElement = new Phaser.Class({
    initialize:
    function PlayerListElement(scene, x, y, member) {
        let layout = scene.layout;
        this.visual = scene.add.container(x, y);
        this.text = scene.add.text(0, 0, member.clientData.name, { font: "24px Arial", fill: "#ffffff", align: 'center' }).setOrigin(0, 0.5);
        this.icon = scene.add.image(this.text.width + layout.LIST_BUTTON_DISTANCE, 0, 'invite_icon');
        this.icon.x += this.icon.width / 2; //Nie możemy użyć setOrigin, bo setScale by dziwnie wyglądało
        this.icon.setInteractive().on('pointerup', function (event) {
            InviteManager.sendInvite(member.id);
        }, scene);
        this.icon.on('pointerover', () => {
            this.icon.setScale(1.08);
        });
        this.icon.on('pointerout', () => {
            this.icon.setScale(1);
        });

        this.visual.add([this.text, this.icon]);
    }
});

let Invite = new Phaser.Class({
    initialize:
    function initialize(scene, member) {
        let layout = scene.layout;
        this.visual = scene.add.container(layout.INVITE_BOX_WIDTH / 2, layout.HEIGHT - layout.INVITE_BOX_HEIGHT / 2);

        this.base = scene.add.rectangle(0, 0, layout.INVITE_BOX_WIDTH, layout.INVITE_BOX_HEIGHT, 0x778899); //TODO: standaryzacja kolorów
        this.text = scene.add.text(0, -layout.INVITE_BOX_HEIGHT * (1 / 4), "Zaproszenie od " + member.clientData.name, { font: "24px Arial", fill: "#ffffff", wordWrap: { width: layout.INVITE_BOX_WIDTH - 32 }, align: 'center' }).setOrigin(0.5, 0.5);
        this.cancel = new SimpleButton(scene, - layout.INVITE_BOX_WIDTH * (1 / 4), layout.INVITE_BOX_HEIGHT * (1 / 6),
            'cancel_circle', InviteManager.rejectInvite.bind(InviteManager));
        this.confirm = new SimpleButton(scene, + layout.INVITE_BOX_WIDTH * (1 / 4), layout.INVITE_BOX_HEIGHT * (1 / 6),
            'confirm_circle', InviteManager.acceptInvite.bind(InviteManager));

        this.visual.add([this.base, this.text, this.cancel.icon, this.confirm.icon]);
    }
});