if (!debugConfig) window.debugConfig = {}; //If debug config is not present, assume all options are false

var gs = { received: false, }; //GameState, this is shared with any player that joins the game
/*class Effect_data  //Because I think in C
{
    constructor(type, value, target, start_condition, end_condition)
    {
        this.type = type;
        this.value = value;
        this.target = target;
        this.start_condition = start_condition;
        this.end_condition = end_condition;
    }
}

class Card_data
{
    constructor(ID, name, element, value, effect, flavour_text, image)
    {
        this.ID = ID;
        this.name = name;
        this.element = element;
        this.value = value;
        this.effect = effect;
        this.flavour_text = flavour_text;
        this.image = image;
    }
}

class Deck_data
{
    constructor(cards_array)
    {
        this.cards_array = cards_array;
    }
}*/

//Name and room selection
function getUsername() {
    var name;
    if (debugConfig.random_username) name = getRandomName();
    else name = prompt(s.enter_username, "");

    while (!name) {
        var name = prompt(s.enter_username_non_empty, "");
    }
    myName = name;
    return (name);
}

function getRandomName() {
    const adjs = ["autumn", "hidden", "bitter", "misty", "silent", "empty", "dry", "dark", "summer", "icy", "delicate", "quiet", "white", "cool", "spring", "winter", "patient"];
    const nouns = ["waterfall", "river", "breeze", "moon", "rain", "wind", "sea", "morning", "snow", "lake", "sunset", "pine", "shadow", "leaf", "dawn", "glitter", "forest", "hill"];
    const name = adjs[Math.floor(Math.random() * adjs.length)] + "_" + nouns[Math.floor(Math.random() * nouns.length)];
    return (name);
}

function getRoomName() {
    //Check if set by debug options
    if (debugConfig.dev_server) return "dev";
    if (debugConfig.random_server) return (Math.random() * 1000) + "";
    if (debugConfig.custom_server) return debugConfig.custom_server_name;

    //Try to get it from the URL
    var roomFromURL = (new URLSearchParams(window.location.search)).get('room');
    if (roomFromURL) return roomFromURL;

    //If that fails, ask the user for it. 
    var chosenName = prompt(s.enter_room_name);
    while (!chosenName) chosenName = prompt(s.enter_room_name);
    var shareableLink = encodeURI(window.location.origin + window.location.pathname + "?room=" + chosenName);
    //addMessageToListDOM(s.shareable_link + " " + shareableLink);
    return chosenName;
}


//Translation

let lang = 'pl'; //Specify default language here (will be used if requested language is not supported)
const languages = { 'en': enStrings, 'pl': plStrings };
let s = languages[lang];

function initLanguage() {
    var browsers = navigator.language; //Gets browser's language.
    if (languages[browsers]) lang = languages[browsers]; //If not supported, we just keep the default
    translate();
}

function changeLanguage(newLanguage) { //Call this to change current language
    if (!languages[newLanguage]) return;
    lang = newLanguage;
    s = languages[newLanguage];
    translate();
}

function translate() {
    var allDom = document.getElementsByTagName("*");
    for (var i = 0; i < allDom.length; i++) {
        var elem = allDom[i];
        var data = elem.dataset;
        //Note: only 'innerHTML', 'value' and 'placeholder' will be translated. Support for more must be added here first
        if (data.s) elem.innerHTML = s[data.s];
        if (data.sInnerHTML) elem.innerHTML = s[data.sInnerHTML];
        if (data.sValue) elem.value = s[data.sValue];
        if (data.sPlaceholder) elem.placeholder = s[data.sPlaceholder];
    }
}

initLanguage(); //Must be called before any user interaction

//Phaser stuff

let game = new Phaser.Game({
    type: Phaser.AUTO,
    width: 1200,
    height: 900,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: [ScenePreBattle, SceneBattle, SceneVictory],
});

function getActiveScene() {
    for (var i = 0; i < game.scene.scenes.length; i++) {
        if (game.scene.scenes[i].scene.settings.active) {
            return (game.scene.scenes[i]);
        }
    }
    console.error('No active scene found');
}


//Networking
const ROOM_BASE = 'observable-main-'
const CHANNEL_ID = 'OQgQpPaAFSHuouGK';
let roomName = ROOM_BASE + getRoomName();
let members = [];

function getMember(input) {
    let id = input;
    if (typeof input === 'object') id = input.id;
    let res = members.find(m => m.id === id);
    if (!res) console.error('Member with id ' + id + ' not found.');
    return res;
}

function isDebugger(member) {
    return member.authData && member.authData.user_is_from_scaledrone_debugger;
}

function sendMessage(type, content) {
    if (debugConfig.disable_messages) return;
    var message = { type: type, content: content };
    if (members.length === 1) receiveMessage(message, members[0]); //Won't send anything over the network if we're the only player
    else drone.publish({ room: roomName, message: message });
}

const drone = new ScaleDrone(CHANNEL_ID, {
    data: { // Will be sent out as clientData via events
        name: getUsername(),
    },
});

drone.on('open', error => {
    if (error) {
        return console.error(error);
    }
    console.log('Successfully connected to Scaledrone');

    const room = drone.subscribe(roomName);
    room.on('open', error => {
        if (error) {
            return console.error(error);
        }
        console.log('Successfully joined room');
        let activeScene = getActiveScene();
        if (activeScene.networkConnected) activeScene.networkConnected();
    });

    // List of currently online members, emitted once
    room.on('members', m => {
        members = m.filter(x => !isDebugger(x));
        if (members.length === 1) {
            //This is what happens when the player joins an empty room
            gs.received = true;
        }
    });

    // User joined the room
    room.on('member_join', member => {
        if (isDebugger(member)) return;
        members.push(member);
        if (gs.received) {
            gs.memberData = members;
            sendMessage('welcome', gs);
        }
        let activeScene = getActiveScene();
        if (activeScene.memberJoined) activeScene.memberJoined(member);
    });

    // User left the room
    room.on('member_leave', ({ id }) => {
        if (!getMember(id)) return; //If they don't exist, it was probably the debugger
        const index = members.findIndex(member => member.id === id);
        members.splice(index, 1);
    });

    room.on('data', receiveMessage);

});

function receiveMessage(data, serverMember) {
    if (debugConfig.log_messages) console.log(data);
    if (serverMember) {
        let member = getMember(serverMember);
        //console.log(member);
        switch (data.type) {
            case 'debug': //Messages used for debugging
                console.log(data.content);
                break;
            case 'welcome': //Sent whenever a new player joins the game, informing them of the game state
                if (!gs.received) {
                    //This is what happens after the player joins a non-empty room
                    gs = data.content;
                    //'gs' will now contain 'memberData' with all extra info about members; you might want to copy it to 'members'
                    //updateAllUI();
                }
                break;
            //default: console.error('Unkown message type received: ' + data.type);
        }

        getActiveScene().receiveMessage(data, member);
    } else {
        addMessageToListDOM('Server: ' + data.content);
    }
}


//Card logic
function Check_who_wins(card_a, card_b, current_effects) {
    effects_table = Give_effects_table(card_a, card_b, current_effects);    //translate effects to simple table
    //elements check
    if (!effects_table[7]) {
        if (card_a.element === ELEMENT.WATER && card_b.element === ELEMENT.FIRE || card_a.element === ELEMENT.FIRE && card_b.element === ELEMENT.FOREST || card_a.element === ELEMENT.FOREST && card_b.element === ELEMENT.WATER)
            return 1 * effects_table[4];
        if (card_a.element === ELEMENT.WATER && card_b.element === ELEMENT.FOREST || card_a.element === ELEMENT.FIRE && card_b.element === ELEMENT.WATER || card_a.element === ELEMENT.FOREST && card_b.element === ELEMENT.FIRE)
            return -1 * effects_table[4];
    }
    //value check
    if (!effects_table[8]) {
        if ((card_a.value + effects_table[0]) * effects_table[2] > (card_b.value + effects_table[1]) * effects_table[3])
            return 1 * effects_table[5];
        if ((card_a.value + effects_table[0]) * effects_table[2] < (card_b.value + effects_table[1]) * effects_table[3])
            return -1 * effects_table[5];
    }
    return 0;
}

function Update_current_effects(card_a, card_b, score, current_effects) {
    var updated_effects = [];
    for (var i = 0; i < current_effects.length; i++)    //checking if any current effects tranfer to next rund
    {
        switch (current_effects[i].end_condition) {
            case "two_use":
                updated_effects.push(current_effects[i]);
                updated_effects[updated_effects.length - 1].end_condition = "one_use";
                break;
            case "until_win":
                if (score != 1)
                    updated_effects.push(current_effects[i]);
                break;
            case "until_lose":
                if (score != -1)
                    updated_effects.push(current_effects[i]);
                break;
        }
    }
    if (card_a.effect != "")    //adding effects from current cards
    {
        if (card_a.effect.start_condition === "" || (card_a.effect.start_condition === "if_win" && score === 1) ||
            (card_a.effect.start_condition === "if_lose" && score === -1) || (card_a.effect.start_condition === "if_draw" && score === 0)) {
            var new_effect = Object.assign({}, card_a.effect);
            updated_effects.push(new_effect);
            if (updated_effects[updated_effects.length - 1].activation === "next_turn")
                updated_effects[updated_effects.length - 1].activation = "this_turn";
        }
    }
    if (card_b.effect != "") {
        if (card_b.effect.start_condition === "" || (card_b.effect.start_condition === "if_win" && score === 1) ||
            (card_b.effect.start_condition === "if_lose" && score === -1) || (card_b.effect.start_condition === "if_draw" && score === 0)) {
            var new_effect = Object.assign({}, card_b.effect);
            updated_effects.push(new_effect);
            if (updated_effects[updated_effects.length - 1].activation === "next_turn")
                updated_effects[updated_effects.length - 1].activation = "this_turn";
            //nawet sobie nie wyobrażasz ile problemów sprawił mi ten fragment (głupie referencje)
            if (updated_effects[updated_effects.length - 1].target === "player_card")   //przeciwnikowi trzeba odwrócić target, aby sam w siebie nie strzelał
                updated_effects[updated_effects.length - 1].target = "enemy_card";
            else if (updated_effects[updated_effects.length - 1].target === "enemy_card")
                updated_effects[updated_effects.length - 1].target = "player_card";
            if (updated_effects[updated_effects.length - 1].target === "player")
                updated_effects[updated_effects.length - 1].target = "enemy";
            else if (updated_effects[updated_effects.length - 1].target === "enemy")
                updated_effects[updated_effects.length - 1].target = "player";
        }
    }
    return updated_effects;
}

function Give_effects_table(card_a, card_b, current_effects) {
    var ret = [0, 0, 1, 1, 1, 1, 0, 0];
    if (card_a.effect != "")
        ret = Translate_effect(card_a.effect, ret);
    if (card_b.effect != "")
        ret = Translate_effect(card_b.effect, ret);
    for (var i = 0; i < current_effects.length; i++)
        ret = Translate_effect(current_effects[i], ret);
    return ret;
}

function Give_afterturn_effects_table(current_effects) {
    var ret = [0, 0, 0, 0];
    for (var i = 0; i < current_effects.length; i++)
        ret = Translate_afterturn_effect(current_effects[i], ret);
    return ret;
}

function Translate_effect(effect, table) {
    if (effect.activation === "this_turn") {
        switch (effect.type) {
            case "value_change":
                if (effect.target === "player_card")
                    table[0] += effect.value;
                else
                    table[1] += effect.value;
                break;
            case "weaker_element": table[4] = -1; break;
            case "lower_value": table[5] = -1; break;
            case "only_elements": table[6] = 1; break;
            case "only_values": table[7] = 1; break;
        }
    }
    return table;
}

function Translate_afterturn_effect(effect, table) {
    if (effect.activation === "after_turn") {
        switch (effect.type) {
            case "card_replace":
                if (effect.target === "player")
                    table[0] += effect.value;
                else
                    table[1] += effect.value;
                break;
        }
    }
    return table;
}

function Get_effect_string(effect) {
    if (effect === "")
        return "";
    var ret = "";
    switch (effect.start_condition) {
        case "if_win": ret += "jesli ta karta wygra "; break;
        case "if_lose": ret += "jesli ta karta przegra "; break;
        case "if_draw": ret += "jesli ta karta zremisuje "; break;
    }
    switch (effect.activation) {
        case "this_turn": ret += "podczas tej tury "; break;
        case "next_turn": ret += "w nastepnej turze "; break;
        case "after_turn": ret += "pod koniec tej tury "; break;
    }
    switch (effect.target) {
        case "player_card": ret += "twoja karta "; break;
        case "enemy_card": ret += "karta przeciwnika "; break;
        case "player": ret += "mozesz "; break;
    }
    switch (effect.type) {
        case "value_change": ret += "otrzymuje ";
            if (effect.value > 0)
                ret += "+";
            break;
        case "card_replace": ret += "odrzucic karty i dobrac nowe w ilosci: "; break;
        case "weaker_element": ret += "wygrywa slabszy zywiol "; break;
        case "weaker_value": ret += "przy tych samych zywiolach wygrywa nizsza wartosc "; break;
        case "only_elements": ret += "licza sie tylko zywioly "; break;
        case "only_values": ret += "licza sie tylko wartosci "; break;
    }
    if (effect.value != 0)
        ret += effect.value;
    ret = ret.charAt(0).toUpperCase() + ret.slice(1);   //making first letter big
    return ret;
}
