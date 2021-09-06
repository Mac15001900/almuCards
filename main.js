
if (!debugConfig) window.debugConfig = {}; //If debug config is not present, assume all options are false

let gs = { received: false, }; //GameState, this is shared with any player that joins the game




//Translation

let lang = 'pl'; //Specify default language here (will be used if requested language is not supported)
const languages = { 'en': enStrings, 'pl': plStrings };
let s = languages[lang];

function initLanguage()
{
    let browsers = navigator.language; //Gets browser's language.
    if (languages[browsers]) lang = languages[browsers]; //If not supported, we just keep the default
    translate();
}

function changeLanguage(newLanguage)
{ //Call this to change current language
    if (!languages[newLanguage]) return;
    lang = newLanguage;
    s = languages[newLanguage];
    translate();
}

function translate()
{
    let allDom = document.getElementsByTagName("*");
    for (let i = 0; i < allDom.length; i++)
    {
        let elem = allDom[i];
        let data = elem.dataset;
        //Note: only 'innerHTML', 'value' and 'placeholder' will be translated. Support for more must be added here first
        if (data.s) elem.innerHTML = s[data.s];
        if (data.sInnerHTML) elem.innerHTML = s[data.sInnerHTML];
        if (data.sValue) elem.value = s[data.sValue];
        if (data.sPlaceholder) elem.placeholder = s[data.sPlaceholder];
    }
}

initLanguage(); //Must be called before any user interaction
Network.setup();

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
    scene: [SceneLobby, ScenePreBattle, SceneBattle, SceneVictory, SceneGallery],
});

function getActiveScene()
{
    for (let i = 0; i < game.scene.scenes.length; i++)
    {
        if (game.scene.scenes[i].scene.settings.active)
        {
            return (game.scene.scenes[i]);
        }
    }
    console.error('No active scene found');
}


//Networking logic

function receiveMessage(data, serverMember) {
    if (debugConfig.log_messages) console.log(data);
    if (serverMember) {
        let member = Network.getMember(serverMember);
        let content = data.content;
        switch (data.type) {
            case 'debug': //Wiadomości do debugowania
                console.log(data.content);
                break;
            case 'welcome': //Informacje o stanie serwera dla nowych graczy
                if (!gs.received) {
                    //Dołączyliśmy do niepustego serwera
                    gs = content;
                    let memberData = gs.memberData;
                    for (var i = 0; i < memberData.length; i++) {
                        Network.getMember(memberData[i]).state = memberData[i].state;
                    }
                }
                break;
            case 'invite':
                if (Network.isUser(content.invited)) InviteManager.addInvite(member);
                break;
            case 'inviteReply':
                InviteManager.processResponse(content, member);
                break;
            case 'requestDuelConfirmation':
                InviteManager.processConfirmationRequests(content, member);
                break;
            case 'duelConfirmation':
                InviteManager.processConfirmation(content, member);
                break;
            case 'cancelInvite':
                InviteManager.processCancelation(content, member);
                break;
        }

        getActiveScene().receiveMessage(data, member);
    } else {
        addMessageToListDOM('Server: ' + data.content);
    }
}
