//Do tworzenia opisów efektów na kartach
let DescriptionGenerator = {
    getEffectDescription: function (effect) {
        if (!effect) return "";
        let ret = "";
        let value = effect.value;
        switch (effect.startCondition) {
            case "ifWin": ret += "jeśli ta karta wygra, "; break;
            case "ifLose": ret += "jeśli ta karta przegra, "; break;
            case "ifDraw": ret += "jeśli ta karta zremisuje, "; break;
        }
        switch (effect.activation) {
            case "thisTurn": ret += "podczas tej tury "; break;
            case "nextTurn": ret += "w następnej turze "; break;
            case "afterTurn": ret += "pod koniec tej tury "; break;
        }
        switch (effect.target) {
            case "playerCard": ret += "karta gracza "; break;
            case "enemyCard": ret += "karta przeciwnika "; break;
            case "player": ret += "gracz "; break;
            case "enemy": ret += "przeciwnik "; break;
        }
        switch (effect.type) {
            case "valueChange": ret += "otrzymuje " + (effect.value > 0 ? "+" : "") + value; break;
            case "cardReplace": ret += "może odrzucić " + this.amount(value, "kartę", "karty"); break;
            case "cardRemove": ret += "musi odrzucić " + this.amount(value, "kartę", "karty"); break;
            case "deckLook": ret += "może podglądnąć " + this.amount(value, "kartę", "kart") + " ze swojej talii"; break;
            case "addCards": ret += "otrzumuje do swojej talii "; break;
            case "weakerElement": ret += "wygrywa słabszy żywioł"; break;
            case "lowerValue": ret += "przy tych samych żywiołach wygrywa niższa wartość"; break;
            case "onlyElements": ret += "nie liczą się wartości"; break;
            case "onlyValues": ret += "nie liczą się żywioły"; break;
            case "cancelEffect": ret += "traci swój efekt"; break;
        }

        ret = ret.charAt(0).toUpperCase() + ret.slice(1);   //Powiększamy pierwszą literę
        if (effect.type === "addCards") {
            switch (effect.cards[0]) {
                case "gumowa_kaczuszka": ret += " razy kartę \"Gumowa kaczuszka\""; break;
            }
        }
        return ret;
    },

    amount: function (amount, singular, plural) {
        console.assert(!isNaN(amount));
        return amount + " " + (amount === 1 ? singular : plural);
    }

};