if (!debugConfig) window.debugConfig = {}; //If debug config is not present, assume all options are false

var gs = { received: false, }; //GameState, this is shared with any player that joins the game




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


