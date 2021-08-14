let SceneTemplate = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:
    function SceneTemplate() {
        Phaser.Scene.call(this, { key: 'SceneTemplate' });
    },

    preload: function () {
        console.log('Preload in template scene');
    },

    create: function () {

    },

    update: function (timestep, dt) {

    },

    receiveMessage: function (data) {
        console.log(data);
    },

});