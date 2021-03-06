let effectData =
    {
        plus: (value) => ({
            "type": "valueChange",
            "value": value,
            "target": "playerCard",
            "activation": "nextTurn",
            "startCondition": "",
            "endCondition": "oneUse"
        }), minus: (value) => ({
            "type": "valueChange",
            "value": -value,
            "target": "enemyCard",
            "activation": "nextTurn",
            "startCondition": "",
            "endCondition": "oneUse"
        }), replace: (value) => ({
            "type": "cardReplace",
            "value": value,
            "target": "player",
            "activation": "afterTurn",
            "startCondition": "",
            "endCondition": "oneUse"
        }), remove: (value) => ({
            "type": "cardRemove",
            "value": value,
            "target": "enemy",
            "activation": "afterTurn",
            "startCondition": "",
            "endCondition": "oneUse"
        }), weakerElement: {
            "type": "weakerElement",
            "value": 0,
            "target": "",
            "activation": "nextTurn",
            "startCondition": "",
            "endCondition": "oneUse"
        }, lowerValue: {
            "type": "lowerValue",
            "value": 0,
            "target": "",
            "activation": "nextTurn",
            "startCondition": "",
            "endCondition": "oneUse"
        }, onlyValues: {
            "type": "onlyValues",
            "value": 0,
            "target": "",
            "activation": "nextTurn",
            "startCondition": "",
            "endCondition": "oneUse"
        }, onlyElements: {
            "type": "onlyElements",
            "value": 0,
            "target": "",
            "activation": "nextTurn",
            "startCondition": "",
            "endCondition": "oneUse"
        }, cancelEnemyEffect: {
            "type": "cancelEffect",
            "value": 0,
            "target": "enemyCard",
            "activation": "thisTurn",
            "startCondition": "",
            "endCondition": "oneUse"
        }, deckLook: (value) => ({
            "type": "deckLook",
            "value": value,
            "target": "player",
            "activation": "afterTurn",
            "startCondition": "",
            "endCondition": "oneUse"
        }), addDuck2: {
            "type": "addCards",
            "value": 2,
            "target": "player",
            "activation": "afterTurn",
            "startCondition": "",
            "endCondition": "oneUse",
            "cards": ["gumowa_kaczuszka"]
        },
    };

let EffectBank = {

    //Do tworzenia opis??w efekt??w na kartach
    getEffectDescription: function (effect) {
        if (effect === "")
            return "";
        let ret = "";
        switch (effect.startCondition) {
            case "ifWin": ret += "je??li ta karta wygra, "; break;
            case "ifLose": ret += "je??li ta karta przegra, "; break;
            case "ifDraw": ret += "je??li ta karta zremisuje, "; break;
        }
        switch (effect.activation) {
            case "thisTurn": ret += "podczas tej tury "; break;
            case "nextTurn": ret += "w nast??pnej turze "; break;
            case "afterTurn": ret += "pod koniec tej tury "; break;
        }
        switch (effect.target) {
            case "playerCard": ret += "karta gracza "; break;
            case "enemyCard": ret += "karta przeciwnika "; break;
            case "player": ret += "gracz "; break;
            case "enemy": ret += "przeciwnik "; break;
        }
        switch (effect.type) {
            case "valueChange": ret += "otrzymuje ";
                if (effect.value > 0)
                    ret += "+";
                break;
            case "cardReplace": ret += "mo??e odrzucic karty i dobra?? nowe w ilo??ci: "; break;
            case "cardRemove": ret += "musi odrzucic karty i dobra?? nowe w ilo??ci: "; break;
            case "deckLook": ret += "mo??e podgl??dn???? karty ze swojej talii w ilo??ci: "; break;
            case "addCards": ret += "otrzumuje do swojej talii "; break;
            case "weakerElement": ret += "wygrywa s??abszy ??ywio?? "; break;
            case "lowerValue": ret += "przy tych samych ??ywio??ach wygrywa ni??sza warto???? "; break;
            case "onlyElements": ret += "nie licz?? si?? warto??ci "; break;
            case "onlyValues": ret += "nie licz?? si?? ??ywio??y "; break;
            case "cancelEffect": ret += "traci sw??j efekt "; break;
        }
        if (effect.value != 0)
            ret += effect.value;
        ret = ret.charAt(0).toUpperCase() + ret.slice(1);   //making first letter big
        if (effect.type === "addCards") {
            switch (effect.cards[0]) {
                case "gumowa_kaczuszka": ret += " razy kart?? \"Gumowa kaczuszka\""; break;
            }
        }
        return ret;
    },

    getInturnEffectsTable: function (cardA, cardB, currentEffects) {
        let ret = {//legenda p??l struktury znajduje si?? w pliku "table of effects"
            'playerAdd': 0,
            'enemyAdd': 0,
            'playerProduct': 1,
            'enemyProduct': 1,
            'reverseElements': 1,
            'reverseValues': 1,
            'onlyElements': false,
            'onlyValues': false,
        };
        if (cardA.effect != "" && !(cardB.effect !== "" && cardB.effect.type === "cancelEffect"))
            ret = this.translateInturnEffect(cardA.effect, ret);
        if (cardB.effect != "" && !(cardA.effect !== "" && cardA.effect.type === "cancelEffect"))
            ret = this.translateInturnEffect(cardB.effect, ret);
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
        if (cardA.effect !== "" && !(cardB.effect !== "" && cardB.effect.type === "cancelEffect"))    //adding effects from current cards
        {
            if (cardA.effect.startCondition === "" || (cardA.effect.startCondition === "ifWin" && score === 1) ||
                (cardA.effect.startCondition === "ifLose" && score === -1) || (cardA.effect.startCondition === "ifDraw" && score === 0)) {
                let newEffect = Object.assign({}, cardA.effect);
                updatedEffects.push(newEffect);
                if (updatedEffects[updatedEffects.length - 1].activation === "nextTurn")
                    updatedEffects[updatedEffects.length - 1].activation = "thisTurn";
            }
        }
        if (cardB.effect !== "" && !(cardA.effect !== "" && cardA.effect.type === "cancelEffect")) {
            if (cardB.effect.startCondition === "" || (cardB.effect.startCondition === "ifWin" && score === 1) ||
                (cardB.effect.startCondition === "ifLose" && score === -1) || (cardB.effect.startCondition === "ifDraw" && score === 0)) {
                let newEffect = Object.assign({}, cardB.effect);
                updatedEffects.push(newEffect);
                if (updatedEffects[updatedEffects.length - 1].activation === "nextTurn")
                    updatedEffects[updatedEffects.length - 1].activation = "thisTurn";
                //nawet sobie nie wyobra??asz ile problem??w sprawi?? mi ten fragment (g??upie referencje)
                if (updatedEffects[updatedEffects.length - 1].target === "playerCard")   //przeciwnikowi trzeba odwr??ci?? target, aby sam w siebie nie strzela??
                    updatedEffects[updatedEffects.length - 1].target = "enemyCard";
                else if (updatedEffects[updatedEffects.length - 1].target === "enemyCard")
                    updatedEffects[updatedEffects.length - 1].target = "playerCard";
                if (updatedEffects[updatedEffects.length - 1].target === "player")
                    updatedEffects[updatedEffects.length - 1].target = "enemy";
                else if (updatedEffects[updatedEffects.length - 1].target === "enemy")
                    updatedEffects[updatedEffects.length - 1].target = "player";
            }
        }
        return updatedEffects;
    }
};
