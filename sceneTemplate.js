let SceneTemplate = new Phaser.Class({
    //TODO: Dodaj ten plik do index.html
    //TODO: Dodaj nazwę sceny w main.js, w definicji 'game'
    Extends: Phaser.Scene,

    initialize:
    function SceneTemplate() {
        Phaser.Scene.call(this, { key: 'SceneTemplate' }); //Tu zazwyczaj nic więcej nie trzeba
    },

    init: function (data) {
        //Inicjalizacja wstępna, głównie do zapisania argumentów, z jakimi ta scena została wywołana, dostępnych w 'data'.
        //Jeśli nie używasz 'data' możesz tą funkcję spokojnie usunąć
    },

    preload: function () {
        console.log('Preload in template scene');
        //Miejsce na ładowanie obrazków
    },

    create: function () {
        //Miejsce na tworzenie elementów sceny. Wywoływane, kiedy wszystkie obrazki się załadują
    },

    update: function (timestep, dt) {
        //Funkcja wywoływana w każdej klatce
    },

    receiveMessage: function (data) {
        //Funkcja wywoływana, gdy otrzymamy nową wiadomość ze ScaleDrone'a
    },

});