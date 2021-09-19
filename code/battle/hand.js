let Hand = new Phaser.Class({
    params: {
        cardScale: 0.175,
        cardBaseWidth: 800,
        cardBaseHeight: 1000,
        cardPadding: 16,
        bottomPadding: 64,
        topPadding: 32,

        enemyCardScale: 0.175 / 2,

    },

    initialize:
    function Hand(scene, size, deckData, enemy = false) {
        this.size = size;
        this.enemy = enemy;
        this.cards = [];
        //this.deck = deckData;
        this.scene = scene;
        this.replaceCards = [0, 0];
        this.cardScale = enemy ? this.params.enemyCardScale : this.params.cardScale;

        let screenWidth = scene.sys.game.canvas.width;
        let screenHeight = scene.sys.game.canvas.height;
        if (enemy)
            this.cardY = this.params.topPadding + this.params.cardBaseHeight * this.cardScale / 2;
        else
            this.cardY = screenHeight - this.params.cardBaseHeight * this.cardScale / 2 - this.params.bottomPadding;
        this.cancelButton = new Button(this.scene, "cancel", scene.layout.CANCEL_BUTTON_X, scene.layout.CANCEL_BUTTON_Y, 0.5, "buttonCancel", this);

        this.deck = []; //nie mylić deck z this.deck (pierwsze ma tylko informacje, a drugie całe karty)
        let deckDataLength = deckData.length;   //linijka obowiązkowa, inaczej pętla nie dojdzie do końca
        for (let i = 0; i < deckDataLength; i++) //tworzenie talii kart z listy danych
            this.deck.push(new Card(this.scene, deckData.pop(), 0, this.cardY, this.cardScale, this));

        console.assert(size > 0);
        //console.assert(deckData.length >= size);
        console.assert(this.deck.length >= size);
        this.drawUntilLimit();
        //this.phase = PHASE.REST;
        this.changePhase(PHASE.REST);
    },

    addCard: function (cardData) {
        let newCard = new Card(this.scene, cardData, 0, this.cardY, this.cardScale, this);
        let index = Math.floor(Math.random() * (this.deck.length + 1));   //losowanie miejsca w talii, gdzie zostanie dodana karta
        this.deck.push(newCard);    //umieszczanie karty na końcu talii
        for (let i = this.deck.length - 1; i > index; i--)  //przsuwanie karty na odpowiednie miejsce w talii
        {
            let bufor = this.deck[i];
            this.deck[i] = this.deck[i - 1];
            this.deck[i - 1] = bufor;
        }
        this.drawUntilLimit();  //aby ręka się wypełniła, jeśli nie było z czego dobierać
        this.repositionCards(this.scene);
    },

    drawCard: function () {
        //this.cards.push(new Card(this.scene, this.deck.pop(), 0, this.cardY, this.cardScale, this));
        if (this.deck.length > 0) {
            this.cards.push(this.deck.shift());
            if (!this.enemy) {
                this.cards[this.cards.length - 1].reverseCard(true, true);
            }
        }
        this.repositionCards(this.scene);
    },

    drawUntilLimit: function () {
        while (this.cards.length < this.size && this.deck.length > 0) {
            this.drawCard();
        }
    },

    removeCard: function (card) {
        let i = this.cards.indexOf(card);
        console.assert(i >= 0);
        let removed = this.cards.splice(i, 1);
        removed[0].visual.removeAll(true); //Usuwa wszystkie obrazki i tekst należące do karty
        this.repositionCards();
    },

    repositionCards: function () {
        let cardWidth = this.params.cardBaseWidth * this.cardScale;
        let padding = this.params.cardPadding;
        let fullWidth = this.cards.length * cardWidth + (this.cards.length - 1) * padding;
        let screenWidth = this.scene.sys.game.canvas.width;
        if (fullWidth <= screenWidth) {
            for (let i = 0; i < this.deck.length; i++) {
                this.deck[i].visual.x = screenWidth / 2 - fullWidth / 2 - 1.2 * (cardWidth + padding) + cardWidth / 2;
                this.deck[i].visual.y = this.cardY + 50 * i * (this.enemy ? -1 : 1) * this.deck[i].scale;
                this.deck[i].visual.setDepth(5 - i * 0.1);
            }
            for (let i = this.cards.length - 1; i >= 0; i--) {
                this.cards[this.cards.length - i - 1].visual.x = screenWidth / 2 - fullWidth / 2 + i * (cardWidth + padding) + cardWidth / 2;
                this.cards[this.cards.length - i - 1].visual.y = this.cardY;
                this.cards[this.cards.length - i - 1].visual.setDepth(5);
            }
        }
        else {
            console.warn("Ręka nie miejści się na ekranie");
            for (let i = 0; i < this.cards.length; i++) {
                this.cards[i].visual.x = cardWidth / 2 + i * (screenWidth - cardWidth) / (this.cards.length - 1);
            }
        }


    },

    lookOnDeck: function (value) {
        for (let i = 0, reversedCards = 0; i < this.deck.length && reversedCards < value; i++) {
            if (this.deck[i].reverseImage.visible) {
                this.deck[i].reverseCard(true, false);
                reversedCards++;
            }
        }
    },

    changePhase: function (new_phase) {
        this.phase = new_phase;
        this.cancelButton.visual.visible = false;
        switch (this.phase) {
            case PHASE.MOVE:
                for (let i = 0; i < 2; i++) //ukrywanie ikonek efektów wykonywanych po turze
                    this.scene.replaceIcons[i].visual.setVisible(false);
                break;
            case PHASE.CAN_REPLACE:
                this.scene.replaceIcons[1].visual.setVisible(false);
                this.cancelButton.visual.visible = true;
                break;
        }
    },
});