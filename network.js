let Network = {
    ROOM_BASE: 'observable-lobby-',
    CHANNEL_ID: 'OQgQpPaAFSHuouGK',
    roomNames: {},
    members: [],
    shareable_link: null,
    setupDone: false,
    Room: {
        LOBBY: 1,
        DUEL: 2,
    },


    //Zwraca informacje o wybranym graczu. Przyjmuje id lub (niekompletne) informacje o graczu otrzymane od ScaleDrone
    getMember: function (input) {
        let id = input;
        if (typeof input === 'object') id = input.id;
        let res = this.members.find(m => m.id === id);
        if (!res) console.error('Member with id ' + id + ' not found.');
        return res;
    },

    //Zwraca informacje o użytkowniku
    getUser: function () {
        return this.getMember(this.drone.clientId);
    },

    //Sprawdza, czy dane id bądź dron należy do użytkownika
    isUser: function (input) {
        let id = input;
        if (typeof input === 'object') id = input.id;
        return this.drone.clientId === id;
    },

    //Sprawdza, czy dany dron jest debuggerem
    isDebugger: function (member) {
        return member.authData && member.authData.user_is_from_scaledrone_debugger;
    },

    //Wysyła wiadomość do wszystkich innych graczy na tym samym kanale
    sendMessage: function (type, content, room = this.Room.LOBBY) {
        if (debugConfig.disable_messages) return;
        var message = { type: type, content: content };
        if (this.members.length === 1) receiveMessage(message, members[0]); //Won't send anything over the network if we're the only player
        else this.drone.publish({ room: this.roomNames[room], message: message });
    },

    //Uzyskuje nazwę użytkownika i serwera, łączy się z lobby
    setup: function () {
        let username = this.getUsername();
        this.roomNames[this.Room.LOBBY] = this.ROOM_BASE + this.getRoomName();
        console.assert(username);
        console.assert(this.roomNames[this.Room.LOBBY]);

        this.drone = new ScaleDrone(this.CHANNEL_ID, {
            data: { // Will be sent out as clientData via events
                name: username,
            },
        });

        this.drone.on('open', error => {
            if (error) {
                return console.error(error);
            }
            console.log('Nawiązano połączenie ze Scaledrone');

            const lobbyRoom = this.drone.subscribe(this.roomNames[this.Room.LOBBY]);
            lobbyRoom.on('open', error => {
                if (error) {
                    return console.error(error);
                }
                console.log('Dołączono do lobby');
                let activeScene = getActiveScene();
                if (activeScene.networkConnected) activeScene.networkConnected();
            });

            // List of currently online members, emitted once
            lobbyRoom.on('members', m => {
                this.members = m.filter(x => !this.isDebugger(x));
                if (this.members.length === 1) {
                    //This is what happens when the player joins an empty room
                    gs.received = true;
                }
            });

            // User joined the room
            lobbyRoom.on('member_join', member => {
                if (this.isDebugger(member)) return;
                this.members.push(member);
                if (gs.received) {
                    gs.memberData = this.members;
                    this.sendMessage('welcome', gs);
                }
                let activeScene = getActiveScene();
                if (activeScene.memberJoined) activeScene.memberJoined(member);
            });

            // User left the room
            lobbyRoom.on('member_leave', ({ id }) => {
                if (!this.getMember(id)) return; //If they don't exist, it was probably the debugger
                const index = this.members.findIndex(member => member.id === id);
                this.members.splice(index, 1);
            });

            lobbyRoom.on('data', receiveMessage);

        });
        this.setupDone = true;
    },




    //Funckje do wybieranie nazwy użytkownika i serwera
    getUsername: function () {
        var name;
        if (debugConfig.random_username) name = this.getRandomName();
        else name = prompt(s.enter_username, "");

        while (!name) {
            var name = prompt(s.enter_username_non_empty, "");
        }
        return (name);
    },

    getRandomName: function () {
        const adjs = ["autumn", "hidden", "bitter", "misty", "silent", "empty", "dry", "dark", "summer", "icy", "delicate", "quiet", "white", "cool", "spring", "winter", "patient"];
        const nouns = ["waterfall", "river", "breeze", "moon", "rain", "wind", "sea", "morning", "snow", "lake", "sunset", "pine", "shadow", "leaf", "dawn", "glitter", "forest", "hill"];
        const name = adjs[Math.floor(Math.random() * adjs.length)] + "_" + nouns[Math.floor(Math.random() * nouns.length)];
        return (name);
    },

    getRoomName: function () {
        //Check if set by debug options
        if (debugConfig.dev_server) return "dev";
        if (debugConfig.random_server) return (Math.random() * 1000) + "";
        if (debugConfig.custom_server) return debugConfig.custom_server_name;

        //Try to get it from the URL
        var roomFromURL = (new URLSearchParams(window.location.search)).get('server');
        if (roomFromURL) return roomFromURL;

        //If that fails, ask the user for it. 
        var chosenName = prompt(s.enter_room_name);
        while (!chosenName) chosenName = prompt(s.enter_room_name);
        var shareableLink = encodeURI(window.location.origin + window.location.pathname + "?room=" + chosenName);
        //addMessageToListDOM(s.shareable_link + " " + shareableLink);
        return chosenName;
    },

};
