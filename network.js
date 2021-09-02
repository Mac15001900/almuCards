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
    State: {
        FREE: 1, //Gracz nie toczy w tym momencie pojedynku
        ENTERING_DUEL: 2, //Gracz zaczyna pojedynek
        IN_DUEL: 3, //Gracz jest w pojedynku
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
                member.state = Network.State.FREE;
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

    connectToRoom: function (roomName, conntecCallback, joinCallback, leaveCallback) {
        let newRoom = this.drone.subscribe(roomName);
        newRoom.on('open', error => {
            if (error) console.error(error);
        });
        newRoom.on('members', conntecCallback);
        newRoom.on('member_join', joinCallback);
        newRoom.on('member_leave', leaveCallback);
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





let InviteManager = {
    sentInvites: [],
    receivedInvites: [],
    state: Network.State.FREE,
    chosenOpponent: null,
    inviteListUpdateCallback: null,
    duelConfirmedCallback: null,

    //Zaproszenia, które dostaliśmy
    addInvite: function (member) { //Dodaje zaproszenie do kolejki (jeśli jeszcze go tam nie ma)
        if (this.receivedInvites.filter(i => i.id === member.id).length === 0) this.receivedInvites.push(member);
    },

    removeInvite: function (member) { //Usuwa zaproszenie od danego gracza
        if (this.chosenOpponent && member.id === this.chosenOpponent.id) { //To był nasz wybrany przeciwnik
            this.chosenOpponent = null;
            this.state = Network.State.FREE;
            Network.sendMessage("changeState", this.state);
        }
        this.receivedInvites = this.receivedInvites.filter(i => i.id !== member.id);
    },

    getFirstInvite: function () { //Zwraca pierwsze zaproszenie z kolejki
        return this.receivedInvites[0];
    },

    rejectInvite: function () { //Usuwa pierwsze zaproszenie z kolejki. Zwraca kolejne, jeśli istnieje
        let rejected = this.receivedInvites.shift();
        Network.sendMessage('inviteReply', { inviter: rejected, reply: false });
        if (this.receivedInvites.length > 0) return this.receivedInvites[0];
    },

    acceptInvite: function () { //Akceptuje pierwsze zaproszenie z kolejki
        if (this.state !== Network.State.FREE) return; //Można zaakceptować tylko jedno zaproszenie
        console.assert(this.receivedInvites.length > 0);
        Network.sendMessage('inviteReply', { inviter: this.receivedInvites[0], reply: true });
        this.state = Network.State.ENTERING_DUEL;
        this.receivedInvites.shift();
    },

    sendInvite: function (member) { //Wysyłanie zaproszenia
        if (this.sentInvites.filter(i => i.id === member.id).length > 0) return; //TODO Przypomnieć użytkownikowi, że nie da się kilkukrotnie zaprosić tego samego gracza 
        if (member.state !== Network.state.FREE) return; //Nie możemy wysłać zaproszenia dla zajętego gracza
        Network.sendMessage("invite", { receiver: member.id });
        this.sentInvites.push(member);
    },

    //Reagowanie na wiadomości
    processResponse: function (content, member) { //Przetwarzanie reakcji na zaproszenia
        if (Network.isUser(content.inviter)) { //Zaproszenie było od nas
            if (content.reply) { //Zaakceptowane
                if (this.state === Network.State.FREE) { //Jesteśmy wolni
                    this.state = Network.State.ENTERING_DUEL;
                    Network.sendMessage("requestDuelConfirmation", { inviter: Network.getUser().id, invited: member.id });
                    this.chosenOpponent = member;
                    //Anulujemy pozostałe wysłane zaproszenia
                    for (let i = 0; i < this.sentInvites.length; i++) {
                        let invite = this.sentInvites[i];
                        if (invite.id !== member.id) Network.sendMessage("cancelInvite", { invited: invite.id });
                    }
                    this.sentInvites = [];
                } else { //Nie jesteśmy wolni
                    console.warn("Zaakceptowano nasze zaproszenie, ale już jesteśmy w pojedynku. Czasami może się tak zdażyć, kiedy dwóch użytkowników zaakceptuje naraz.");
                }
            } else { //Odrzucone
                this.sentInvites = this.sentInvites.filter(i => i.id !== member.id);
            }
        } else if (content.reply) { //Nie od nas, ale zaakceptowane
            member.state = Network.State.ENTERING_DUEL;
        }
    },

    processCancelation: function (content, member) {
        if (Network.isUser(content.invited)) this.removeInvite(member);
    },

    processConfirmationRequests: function (content, member) {
        if (!Network.isUser(content.invited.id)) return; //To nie do nas

        let accept = this.chosenOpponent && this.chosenOpponent.id === member.id;
        Network.sendMessage("duelConfirmation", { inviter: member.id, invited: Network.getUser().id, reply: accept });
        this.state = Network.state.IN_DUEL;
    },

    processConfirmation: function (content, member) {
        let firstPlayer = content.inviter;
        let secondPlayer = content.invited;

        Network.getUser(firstPlayer).state = Network.state.IN_DUEL;
        Network.getUser(secondPlayer).state = Network.state.IN_DUEL;

        if (Network.isUser(firstPlayer) || Network.isUser(secondPlayer)) this.duelConfirmedCallback(firstPlayer + "-" + secondPlayer);
    },




};
