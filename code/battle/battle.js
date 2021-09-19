let Battle = new Phaser.Class({

    initialize:
    function Battle(scene, userDeck, opponentDeck) {
        this.scene = scene;
        this.cards = [null, null];
        this.cardsObjects = [null, null];
        this.effects = [];
        this.playerDeck = userDeck;
        this.enemyDeck = opponentDeck;
        this.playerHand = new Hand(scene, 5, this.playerDeck, 0);
        this.enemyHand = new Hand(scene, 5, this.enemyDeck, 1);
        this.points = { user: this.getEmptyPoints(), enemy: this.getEmptyPoints() };
    },

    getEmptyPoints: function () { //Tworzy pusty obiekt do trzymania punktów, w którym każdemu żywiołowi odpowiada '0'
        let res = {};
        for (let i = 0; i < ELEMENT.basic.length; i++) {
            res[ELEMENT.basic[i]] = 0;
        }
        return res;
    },

    addCard: function (new_card, user) { //User=true oznacza użytkownika, false przeciwnika
        this.cards[user ? 0 : 1] = new_card;
        let layout = this.scene.layout;
        this.cardsObjects[user ? 0 : 1] = new Card(this.scene, new_card, layout.WIDTH / 2 + (user ? -0.5 : 0.5) * layout.CHOSEN_CARDS_SPACING, layout.CHOSEN_CARDS_Y, layout.CHOSEN_CARDS_SCALE, null);
        if (this.cards[0] !== null && this.cards[1] !== null) {
            for (let i = 0; i < 2; i++)
                this.cardsObjects[i].reverseCard(true, false);
            setTimeout(() => { this.endTurn(); }, 1750);
        }
    },


    endTurn: function () {

        for (let i = 0; i < 2; i++)
            this.cardsObjects[i].visual.removeAll(true);
        let score = cardsLogic.getWinner(this.cards[0], this.cards[1], this.effects);
        this.effects = EffectUtils.updateEffects(this.cards[0], this.cards[1], score, this.effects);
        switch (score) {
            case 1:
                console.log(this.cards[0].displayName + " wins!");
                this.points.user[this.cards[0].element]++;
                this.scene.userWon.explosion(this.cards[0].element, this.points.user[this.cards[0].element]);
                break;
            case -1: console.log(this.cards[1].displayName + " wins!");
                this.points.enemy[this.cards[1].element]++;
                this.scene.enemyWon.explosion(this.cards[1].element, this.points.enemy[this.cards[1].element]);
                break;
            case 0: console.log("It's a draw"); break;
        }
        this.scene.updateIcons(this.points, this.effects);
        this.checkIfAnyoneWins();
        EffectUtils.addCardsToHands(this.effects, this.playerHand, this.enemyHand);
        this.cards = [null, null];    //czyszczenie tablicy

        let afterturnTable = EffectUtils.getAfterturnEffectsTable(this.effects);   //efekty po turze (głównie modyfikujące rękę)     
        if (afterturnTable.playerRemove > 0) //gracz musi wymienić karty
        {
            this.playerHand.replaceCards[1] += afterturnTable.playerRemove;
            this.playerHand.changePhase(PHASE.MUST_REPLACE);
            if (afterturnTable.playerReplace > 0)  //będzie mógł jeszcze dodatkowo wymienić karty
                this.playerHand.replaceCards[0] += afterturnTable.playerReplace; //zapisanie, ile kart będzie mógł wymienić
        }
        else if (afterturnTable.playerReplace > 0) //gracz może wymienić karty
        {
            this.playerHand.replaceCards[0] += afterturnTable.playerReplace; //zapisanie, ile kart może wymienić
            this.playerHand.changePhase(PHASE.CAN_REPLACE);  //ustawienie odpowiedniego trybu
        }
        else
            this.playerHand.changePhase(PHASE.MOVE);
        if (afterturnTable.playerLook > 0)  //look on player's deck
        {
            this.playerHand.lookOnDeck(afterturnTable.playerLook);
        }
    },

    checkIfAnyoneWins: function () {
        let userVictory = this.checkForVictory(this.points.user);
        let enemyVictory = this.checkForVictory(this.points.enemy);
        if (userVictory && enemyVictory) console.error("Remis 🤔"); //Póki co nie powinno to być możliwe
        else if (userVictory) this.scene.scene.start('SceneVictory', { victor: this.scene.userDrone, element: userVictory });
        else if (enemyVictory) this.scene.scene.start('SceneVictory', { victor: this.scene.opponentDrone, element: enemyVictory });
    },

    checkForVictory: function (playerPoints) { //Sprawdza, czy dany gracz wygrał. Jeśli tak, zwraca jakim elementem, jeśli nie, zwraca null
        let target = this.scene.config.VICTORY_AMOUNT;
        let allElements = this.scene.config.ALL_ELEMENTS;
        for (let i = 0; i < allElements.length; i++) {
            if (playerPoints[allElements[i]] >= target) return allElements[i];
        }
        return null;
    }
});
