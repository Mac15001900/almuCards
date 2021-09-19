let cardsLogic = {
    getWinner: function (cardPlayer, cardEnemy, currentEffects) {
        effectsTable = EffectUtils.getInturnEffectsTable(cardPlayer, cardEnemy, currentEffects);    //translate effects to simple table
        //elements check
        if (!effectsTable.onlyValues) {
            if (cardPlayer.element === ELEMENT.WATER && cardEnemy.element === ELEMENT.FIRE || cardPlayer.element === ELEMENT.FIRE && cardEnemy.element === ELEMENT.FOREST || cardPlayer.element === ELEMENT.FOREST && cardEnemy.element === ELEMENT.WATER)
                return 1 * effectsTable.reverseElements;
            if (cardPlayer.element === ELEMENT.WATER && cardEnemy.element === ELEMENT.FOREST || cardPlayer.element === ELEMENT.FIRE && cardEnemy.element === ELEMENT.WATER || cardPlayer.element === ELEMENT.FOREST && cardEnemy.element === ELEMENT.FIRE)
                return -1 * effectsTable.reverseElements;
        }
        //value check
        if (!effectsTable.onlyElements) {
            if ((cardPlayer.value + effectsTable.playerAdd) * effectsTable.playerProduct > (cardEnemy.value + effectsTable.enemyAdd) * effectsTable.enemyProduct)
                return 1 * effectsTable.reverseValues;
            if ((cardPlayer.value + effectsTable.playerAdd) * effectsTable.playerProduct < (cardEnemy.value + effectsTable.enemyAdd) * effectsTable.enemyProduct)
                return -1 * effectsTable.reverseValues;
        }
        return 0;
    },
};

let EffectUtils = {

    getInturnEffectsTable: function (cardA, cardB, currentEffects) {
        let ret = {//legenda pól struktury znajduje się w pliku "table of effects"
            'playerAdd': 0,
            'enemyAdd': 0,
            'playerProduct': 1,
            'enemyProduct': 1,
            'reverseElements': 1,
            'reverseValues': 1,
            'onlyElements': false,
            'onlyValues': false,
        };
        if (this.checkIfEffectApplies(cardA, cardB, null, currentEffects)) ret = this.translateInturnEffect(cardA.effect, ret);
        if (this.checkIfEffectApplies(cardB, cardA, null, currentEffects)) ret = this.translateInturnEffect(cardB.effect, ret);
        for (let i = 0; i < currentEffects.length; i++)
            ret = this.translateInturnEffect(currentEffects[i], ret);
        return ret;
    },

    getAfterturnEffectsTable: function (currentEffects) {
        let ret = {
            'playerReplace': 0,
            'enemyReplace': 0,
            'playerRemove': 0,
            'enemyRemove': 0,
            'playerLook': 0,
            'enemyLook': 0,
        };
        for (let i = 0; i < currentEffects.length; i++)
            ret = this.translateAfrerturnEffect(currentEffects[i], ret);
        return ret;
    },

    addCardsToHands: function (currentEffects, handPlayer, handEnemy) {
        for (let i = 0; i < currentEffects.length; i++) {
            if (currentEffects[i].type === "addCards") {
                if (currentEffects[i].target === "player")
                    this.addCardToHand(currentEffects[i], handPlayer);
                //else
                //    this.addCardToHand(currentEffects[i], handEnemy);
            }
        }
    },

    addCardToHand: function (effect, hand) {
        if (effect.type === "addCards") {
            for (let i = 0; i < effect.value; i++)
                hand.addCard(cardData[effect.cards[i % effect.cards.length]]);
        }
    },

    translateInturnEffect: function (effect, table) {
        if (effect.activation === "thisTurn") {
            switch (effect.type) {
                case "valueChange":
                    if (effect.target === "playerCard")
                        table.playerAdd += effect.value;
                    else
                        table.enemyAdd += effect.value;
                    break;
                case "weakerElement": table.reverseElements = -1; break;
                case "lowerValue": table.reverseValues = -1; break;
                case "onlyElements": table.onlyElements = 1; break;
                case "onlyValues": table.onlyValues = 1; break;
            }
        }
        return table;
    },

    translateAfrerturnEffect: function (effect, table) {
        if (effect.activation === "afterTurn") {
            switch (effect.type) {
                case "cardReplace":
                    if (effect.target === "player")
                        table.playerReplace += effect.value;
                    else
                        table.enemyReplace += effect.value;
                    break;
                case "cardRemove":
                    if (effect.target === "player")
                        table.playerRemove += effect.value;
                    else
                        table.enemyRemove += effect.value;
                    break;
                case "deckLook":
                    if (effect.target === "player")
                        table.playerLook += effect.value;
                    else
                        table.enemyLook += effect.value;
                    break;
            }
        }
        return table;
    },

    updateEffects: function (cardA, cardB, score, currentEffects) {
        let updatedEffects = [];
        for (let i = 0; i < currentEffects.length; i++)    //checking if any current effects tranfer to next rund
        {
            switch (currentEffects[i].endCondition) {
                case "twoUse":
                    updatedEffects.push(currentEffects[i]);
                    updatedEffects[updatedEffects.length - 1].endCondition = "oneUse";
                    break;
                case "untilWin":
                    if (score !== 1)
                        updatedEffects.push(currentEffects[i]);
                    break;
                case "untilLose":
                    if (score !== -1)
                        updatedEffects.push(currentEffects[i]);
                    break;
            }
        }
        if (this.checkIfEffectApplies(cardA, cardB, score, currentEffects)) {
            let newEffect = Object.assign({}, cardA.effect);
            if (newEffect.activation === "nextTurn") newEffect.activation = "thisTurn";
            updatedEffects.push(newEffect);
        }
        if (this.checkIfEffectApplies(cardB, cardA, -score, currentEffects)) {
            let newEffect = Object.assign({}, cardB.effect);

            if (newEffect.activation === "nextTurn") newEffect.activation = "thisTurn";
            if (newEffect.target === "playerCard") newEffect.target = "enemyCard"; //Ponieważ efekt pochodzi od karty przeciwnika, odwracamy cel
            else if (newEffect.target === "enemyCard") newEffect.target = "playerCard";
            if (newEffect.target === "player") newEffect.target = "enemy";
            else if (newEffect.target === "enemy") newEffect.target = "player";

            updatedEffects.push(newEffect);
        }
        return updatedEffects;
    },

    //Sprawdza, czy efekt danej karty działa. TODO: ta funkcja będzie potrzebowała więcej informacji o stanie gry dla niektórych przyszłych efektów
    checkIfEffectApplies: function (card, otherCard, score, currentEffects) {
        if (!card.effect) return false; //Sprawdzamy czy efekt istnieje
        if (otherCard.effect && otherCard.effect.type === "cancelEffect") return false; //Sprawdzamy, czy druga karta nie anuluje efektu
        if (!card.effect.startCondition) return true; //Sprawdzamy, czy efekt wymaga jakiegoś warunku

        switch (card.effect.startCondition) {
            case "ifWin": return score === 1;
            case "ifDraw": return score === 0;
            case "ifLose": return score === -1;
        }
    },
};


