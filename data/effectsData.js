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

