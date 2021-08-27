let SceneGallery = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:
        function SceneGallery()
        {
            Phaser.Scene.call(this, { key: 'SceneGallery' });
        },

    preload: function ()
    {
        console.log("Preload in gallery");  //�adowanie obrazk�w t�a
        this.load.image('card_fire', 'assets/card_fire.png');
        this.load.image('card_forest', 'assets/card_forest.png');
        this.load.image('card_water', 'assets/card_water.png');
        this.cards = [];    //tworzenie listy wszystkich kart w grze
        for (let card in cardData)
            this.cards = this.cards.concat(DeckBank.createCardsFromPrototype(cardData[card]));
        let imagesToLoad = DeckBank.getImages(this.cards);
        for (let image in imagesToLoad) //�adowanie obrazk�w kart
        {
            this.load.image(imagesToLoad[image], 'assets/cardImages/' + imagesToLoad[image] + '.png');
        }
        this.load.image('card_reverse', 'assets/card_reverse.png');

        this.load.image('button_left', 'assets/button_left.png'); //obrazki przycisk�w
        this.load.image('button_right', 'assets/button_right.png');

        this.page = 0;
    },

    layout: {
        FIRST_CARD_X: 175,
        FIRST_CARD_Y: 120,
        CARD_SCALE: 0.15,
        CARDS_H_SPACING: 120,
        CARDS_V_SPACING: 200,

        CARDS_PER_PAGE: 32,

        BUTTON_LEFT_X: 50,
        BUTTOR_LEFT_Y: 430,
        BUTTON_RIGHT_X: 1125,
        BUTTOR_RIGHT_Y: 430,
    },

    create: function ()
    {
        console.log('Gallery open');
        this.buttonLeft = new Button(this, "galleryLeft", this.layout.BUTTON_LEFT_X, this.layout.BUTTOR_LEFT_Y, 0.8, "button_left", null);
        this.buttonRight = new Button(this, "galleryRight", this.layout.BUTTON_RIGHT_X, this.layout.BUTTOR_RIGHT_Y, 0.8, "button_right", null);
        this.createPage();
    },

    createPage: function ()
    {
        for (let card in this.currentCards)
            this.currentCards[card].visual.removeAll(true);
        this.currentCards = [];
        for (let i = this.page * this.layout.CARDS_PER_PAGE; i < Math.min(this.cards.length, (this.page + 1) * this.layout.CARDS_PER_PAGE); i++)
        {
            let j = i - this.page * this.layout.CARDS_PER_PAGE;
            let newCard = new Card(this, this.cards[i], this.layout.FIRST_CARD_X + (j % 8) * this.layout.CARDS_H_SPACING, this.layout.FIRST_CARD_Y + Math.floor(j / 8) * this.layout.CARDS_V_SPACING, this.layout.CARD_SCALE, null);
            newCard.Reverse_card(false);
            this.currentCards.push(newCard);
        }
        if (this.page === 0)
            this.buttonLeft.visual.setVisible(false);
        else
            this.buttonLeft.visual.setVisible(true);
        if ((this.page + 1) * this.layout.CARDS_PER_PAGE >= this.cards.length)
            this.buttonRight.visual.setVisible(false);
        else
            this.buttonRight.visual.setVisible(true);
    }
});
