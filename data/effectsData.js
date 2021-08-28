let effectData =
{
    plus5: {
        "type": "value_change",
        "value": 5,
        "target": "player_card",
        "activation": "next_turn",
        "start_condition": "",
        "end_condition": "one_use"
    }, minus5: {
        "type": "value_change",
        "value": -5,
        "target": "enemy_card",
        "activation": "next_turn",
        "start_condition": "",
        "end_condition": "one_use"
    }, replace1: {
        "type": "card_replace",
        "value": 1,
        "target": "player",
        "activation": "after_turn",
        "start_condition": "",
        "end_condition": "one_use"
    }, remove1: {
        "type": "card_remove",
        "value": 1,
        "target": "enemy",
        "activation": "after_turn",
        "start_condition": "",
        "end_condition": "one_use"
    }, weaker_element: {
        "type": "weaker_element",
        "value": 0,
        "target": "",
        "activation": "next_turn",
        "start_condition": "",
        "end_condition": "one_use"
    }, lower_value: {
        "type": "lower_value",
        "value": 0,
        "target": "",
        "activation": "next_turn",
        "start_condition": "",
        "end_condition": "one_use"
    }, only_elements: {
        "type": "only_elements",
        "value": 0,
        "target": "",
        "activation": "next_turn",
        "start_condition": "",
        "end_condition": "one_use"
    }, only_values: {
        "type": "only_values",
        "value": 0,
        "target": "",
        "activation": "next_turn",
        "start_condition": "",
        "end_condition": "one_use"
    }, cancel_enemy_effect: {
        "type": "cancel_effect",
        "value": 0,
        "target": "enemy_card",
        "activation": "this_turn",
        "start_condition": "",
        "end_condition": "one_use"
    }, deck_look1: {
        "type": "deck_look",
        "value": 1,
        "target": "player",
        "activation": "after_turn",
        "start_condition": "",
        "end_condition": "one_use"
    }, add_duck2: {
        "type": "add_cards",
        "value": 2,
        "target": "player",
        "activation": "after_turn",
        "start_condition": "",
        "end_condition": "one_use",
        "cards": ["gumowa_kaczuszka"]
    },
};

let EffectBank = {

    //Do tworzenia opisów efektów na kartach
    getEffectDescription: function (effect)
    {
        if (effect === "")
            return "";
        var ret = "";
        switch (effect.start_condition)
        {
            case "if_win": ret += "jeśli ta karta wygra, "; break;
            case "if_lose": ret += "jeśli ta karta przegra, "; break;
            case "if_draw": ret += "jeśli ta karta zremisuje, "; break;
        }
        switch (effect.activation)
        {
            case "this_turn": ret += "podczas tej tury "; break;
            case "next_turn": ret += "w następnej turze "; break;
            case "after_turn": ret += "pod koniec tej tury "; break;
        }
        switch (effect.target)
        {
            case "player_card": ret += "karta gracza "; break;
            case "enemy_card": ret += "karta przeciwnika "; break;
            case "player": ret += "gracz "; break;
            case "enemy": ret += "przeciwnik "; break;
        }
        switch (effect.type)
        {
            case "value_change": ret += "otrzymuje ";
                if (effect.value > 0)
                    ret += "+";
                break;
            case "card_replace": ret += "może odrzucic karty i dobrać nowe w ilości: "; break;
            case "card_remove": ret += "musi odrzucic karty i dobrać nowe w ilości: "; break;
            case "deck_look": ret += "może podglądnąć karty ze swojej talii w ilości: "; break;
            case "add_cards": ret += "otrzumuje do swojej talii "; break;
            case "weaker_element": ret += "wygrywa słabszy żywioł "; break;
            case "weaker_value": ret += "przy tych samych żywiołach wygrywa niższa wartość "; break;
            case "only_elements": ret += "liczą się tylko żywioły "; break;
            case "only_values": ret += "liczą się tylko wartości "; break;
            case "cancel_effect": ret += "traci swój efekt "; break;
        }
        if (effect.value != 0)
            ret += effect.value;
        ret = ret.charAt(0).toUpperCase() + ret.slice(1);   //making first letter big
        if (effect.type === "add_cards")
        {
            switch (effect.cards[0])
            {
                case "gumowa_kaczuszka": ret += " razy kartę \"Gumowa kaczuszka\""; break;
            }
        }
        return ret;
    },

    getInturnEffectsTable: function (cardA, cardB, currentEffects)
    {
        var ret = [0, 0, 1, 1, 1, 1, 0, 0]; //legenda pól tabelki znajduje się w pliku "table of effects"
        if (cardA.effect != "")
            ret = this.translateInturnEffect(cardA.effect, ret);
        if (cardB.effect != "")
            ret = this.translateInturnEffect(cardB.effect, ret);
        for (var i = 0; i < currentEffects.length; i++)
            ret = this.translateInturnEffect(currentEffects[i], ret);
        return ret;
    },

    getAfterturnEffectsTable: function (currentEffects)
    {
        var ret = [0, 0, 0, 0];
        for (var i = 0; i < currentEffects.length; i++)
            ret = this.translateAfrerturnEffect(currentEffects[i], ret);
        return ret;
    },

    translateInturnEffect: function (effect, table)
    {
        if (effect.activation === "this_turn")
        {
            switch (effect.type)
            {
                case "value_change":
                    if (effect.target === "player_card")
                        table[0] += effect.value;
                    else
                        table[1] += effect.value;
                    break;
                case "weaker_element": table[4] = -1; break;
                case "lower_value": table[5] = -1; break;
                case "only_elements": table[6] = 1; break;
                case "only_values": table[7] = 1; break;
            }
        }
        return table;
    },

    translateAfrerturnEffect: function (effect, table)
    {
        if (effect.activation === "after_turn")
        {
            switch (effect.type)
            {
                case "card_replace":
                    if (effect.target === "player")
                        table[0] += effect.value;
                    else
                        table[1] += effect.value;
                    break;
                case "card_remove":
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
        var updatedEffects = [];
        for (var i = 0; i < currentEffects.length; i++)    //checking if any current effects tranfer to next rund
        {
            switch (currentEffects[i].end_condition)
            {
                case "two_use":
                    updatedEffects.push(currentEffects[i]);
                    updatedEffects[updatedEffects.length - 1].end_condition = "one_use";
                    break;
                case "until_win":
                    if (score != 1)
                        updatedEffects.push(currentEffects[i]);
                    break;
                case "until_lose":
                    if (score != -1)
                        updatedEffects.push(currentEffects[i]);
                    break;
            }
        }
        if (cardA.effect != "")    //adding effects from current cards
        {
            if (cardA.effect.start_condition === "" || (cardA.effect.start_condition === "if_win" && score === 1) ||
                (cardA.effect.start_condition === "if_lose" && score === -1) || (cardA.effect.start_condition === "if_draw" && score === 0))
            {
                var newEffect = Object.assign({}, cardA.effect);
                updatedEffects.push(newEffect);
                if (updatedEffects[updatedEffects.length - 1].activation === "next_turn")
                    updatedEffects[updatedEffects.length - 1].activation = "this_turn";
            }
        }
        if (cardB.effect != "")
        {
            if (cardB.effect.start_condition === "" || (cardB.effect.start_condition === "if_win" && score === 1) ||
                (cardB.effect.start_condition === "if_lose" && score === -1) || (cardB.effect.start_condition === "if_draw" && score === 0))
            {
                var newEffect = Object.assign({}, cardB.effect);
                updatedEffects.push(newEffect);
                if (updatedEffects[updatedEffects.length - 1].activation === "next_turn")
                    updatedEffects[updatedEffects.length - 1].activation = "this_turn";
                //nawet sobie nie wyobrażasz ile problemów sprawił mi ten fragment (głupie referencje)
                if (updatedEffects[updatedEffects.length - 1].target === "player_card")   //przeciwnikowi trzeba odwrócić target, aby sam w siebie nie strzelał
                    updatedEffects[updatedEffects.length - 1].target = "enemy_card";
                else if (updatedEffects[updatedEffects.length - 1].target === "enemy_card")
                    updatedEffects[updatedEffects.length - 1].target = "player_card";
                if (updatedEffects[updatedEffects.length - 1].target === "player")
                    updatedEffects[updatedEffects.length - 1].target = "enemy";
                else if (updatedEffects[updatedEffects.length - 1].target === "enemy")
                    updatedEffects[updatedEffects.length - 1].target = "player";
            }
        }
        return updatedEffects;
    }
};
