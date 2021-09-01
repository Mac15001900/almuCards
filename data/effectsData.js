let effectData =
{
    plus5: {
        "type": "valueChange",
        "value": 5,
        "target": "playerCard",
        "activation": "nextTurn",
        "startCondition": "",
        "endCondition": "oneUse"
    }, minus5: {
        "type": "valueChange",
        "value": -5,
        "target": "enemyCard",
        "activation": "nextTurn",
        "startCondition": "",
        "endCondition": "oneUse"
    }, replace1: {
        "type": "cardReplace",
        "value": 1,
        "target": "player",
        "activation": "afterTurn",
        "startCondition": "",
        "endCondition": "oneUse"
    }, remove1: {
        "type": "cardRemove",
        "value": 1,
        "target": "enemy",
        "activation": "afterTurn",
        "startCondition": "",
        "endCondition": "oneUse"
    }, weakerElement: {
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
    }, deckLook1: {
        "type": "deckLook",
        "value": 1,
        "target": "player",
        "activation": "afterTurn",
        "startCondition": "",
        "endCondition": "oneUse"
    }, addDuck2: {
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

    //Do tworzenia opisów efektów na kartach
    getEffectDescription: function (effect)
    {
        if (effect === "")
            return "";
        let ret = "";
        switch (effect.startCondition)
        {
            case "ifWin": ret += "jeśli ta karta wygra, "; break;
            case "ifLose": ret += "jeśli ta karta przegra, "; break;
            case "ifDraw": ret += "jeśli ta karta zremisuje, "; break;
        }
        switch (effect.activation)
        {
            case "thisTurn": ret += "podczas tej tury "; break;
            case "nextTurn": ret += "w następnej turze "; break;
            case "afterTurn": ret += "pod koniec tej tury "; break;
        }
        switch (effect.target)
        {
            case "playerCard": ret += "karta gracza "; break;
            case "enemyCard": ret += "karta przeciwnika "; break;
            case "player": ret += "gracz "; break;
            case "enemy": ret += "przeciwnik "; break;
        }
        switch (effect.type)
        {
            case "valueChange": ret += "otrzymuje ";
                if (effect.value > 0)
                    ret += "+";
                break;
            case "cardReplace": ret += "może odrzucic karty i dobrać nowe w ilości: "; break;
            case "cardRemove": ret += "musi odrzucic karty i dobrać nowe w ilości: "; break;
            case "deckLook": ret += "może podglądnąć karty ze swojej talii w ilości: "; break;
            case "addCards": ret += "otrzumuje do swojej talii "; break;
            case "weakerElement": ret += "wygrywa słabszy żywioł "; break;
            case "weakerValue": ret += "przy tych samych żywiołach wygrywa niższa wartość "; break;
            case "onlyElements": ret += "liczą się tylko żywioły "; break;
            case "onlyValues": ret += "liczą się tylko wartości "; break;
            case "cancelEffect": ret += "traci swój efekt "; break;
        }
        if (effect.value != 0)
            ret += effect.value;
        ret = ret.charAt(0).toUpperCase() + ret.slice(1);   //making first letter big
        if (effect.type === "addCards")
        {
            switch (effect.cards[0])
            {
                case "gumowaKaczuszka": ret += " razy kartę \"Gumowa kaczuszka\""; break;
            }
        }
        return ret;
    },

    getInturnEffectsTable: function (cardA, cardB, currentEffects)
    {
        let ret = [0, 0, 1, 1, 1, 1, 0, 0]; //legenda pól tabelki znajduje się w pliku "table of effects"
        if (cardA.effect != "")
            ret = this.translateInturnEffect(cardA.effect, ret);
        if (cardB.effect != "")
            ret = this.translateInturnEffect(cardB.effect, ret);
        for (let i = 0; i < currentEffects.length; i++)
            ret = this.translateInturnEffect(currentEffects[i], ret);
        return ret;
    },

    getAfterturnEffectsTable: function (currentEffects)
    {
        let ret = [0, 0, 0, 0];
        for (let i = 0; i < currentEffects.length; i++)
            ret = this.translateAfrerturnEffect(currentEffects[i], ret);
        return ret;
    },

    translateInturnEffect: function (effect, table)
    {
        if (effect.activation === "thisTurn")
        {
            switch (effect.type)
            {
                case "valueChange":
                    if (effect.target === "playerCard")
                        table[0] += effect.value;
                    else
                        table[1] += effect.value;
                    break;
                case "weakerElement": table[4] = -1; break;
                case "lowerValue": table[5] = -1; break;
                case "onlyElements": table[6] = 1; break;
                case "onlyValues": table[7] = 1; break;
            }
        }
        return table;
    },

    translateAfrerturnEffect: function (effect, table)
    {
        if (effect.activation === "afterTurn")
        {
            switch (effect.type)
            {
                case "cardReplace":
                    if (effect.target === "player")
                        table[0] += effect.value;
                    else
                        table[1] += effect.value;
                    break;
                case "cardRemove":
                    if (effect.target === "player")
                        table[2] += effect.value;
                    else
                        table[3] += effect.value;
                    break;
            }
        }
        return table;
    },

    updateEffects: function (cardA, cardB, score, currentEffects)
    {
        let updatedEffects = [];
        for (let i = 0; i < currentEffects.length; i++)    //checking if any current effects tranfer to next rund
        {
            switch (currentEffects[i].endCondition)
            {
                case "twoUse":
                    updatedEffects.push(currentEffects[i]);
                    updatedEffects[updatedEffects.length - 1].endCondition = "oneUse";
                    break;
                case "untilWin":
                    if (score != 1)
                        updatedEffects.push(currentEffects[i]);
                    break;
                case "untilLose":
                    if (score != -1)
                        updatedEffects.push(currentEffects[i]);
                    break;
            }
        }
        if (cardA.effect != "")    //adding effects from current cards
        {
            if (cardA.effect.startCondition === "" || (cardA.effect.startCondition === "ifWin" && score === 1) ||
                (cardA.effect.startCondition === "ifLose" && score === -1) || (cardA.effect.startCondition === "ifDraw" && score === 0))
            {
                let newEffect = Object.assign({}, cardA.effect);
                updatedEffects.push(newEffect);
                if (updatedEffects[updatedEffects.length - 1].activation === "nextTurn")
                    updatedEffects[updatedEffects.length - 1].activation = "thisTurn";
            }
        }
        if (cardB.effect != "")
        {
            if (cardB.effect.startCondition === "" || (cardB.effect.startCondition === "ifWin" && score === 1) ||
                (cardB.effect.startCondition === "ifLose" && score === -1) || (cardB.effect.startCondition === "ifDraw" && score === 0))
            {
                let newEffect = Object.assign({}, cardB.effect);
                updatedEffects.push(newEffect);
                if (updatedEffects[updatedEffects.length - 1].activation === "nextTurn")
                    updatedEffects[updatedEffects.length - 1].activation = "thisTurn";
                //nawet sobie nie wyobrażasz ile problemów sprawił mi ten fragment (głupie referencje)
                if (updatedEffects[updatedEffects.length - 1].target === "playerCard")   //przeciwnikowi trzeba odwrócić target, aby sam w siebie nie strzelał
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
