const ELEMENT =
    {
        NONE: 0,
        FOREST: 1,
        FIRE: 2,
        WATER: 3
    };

let cardData = {
    forest_1: {
        "ID": 0,
        "name": "forest_1",
        "displayName": "Żolędź",
        "element": ELEMENT.FOREST,
        "value": 1,
        "image": "im_forest_1",
        "effect": ""
    }, forest_2: {
        "ID": 1,
        "name": "forest_2",
        "displayName": "Szyszka",
        "element": ELEMENT.FOREST,
        "value": 2,
        "image": "im_forest_2",
        "effect": ""
    }, forest_3: {
        "ID": 2,
        "name": "forest_3",
        "displayName": "Sadzonka",
        "element": ELEMENT.FOREST,
        "value": 3,
        "image": "im_forest_3",
        "effect": ""
    }, forest_4: {
        "ID": 3,
        "name": "forest_4",
        "displayName": "Krzak",
        "element": ELEMENT.FOREST,
        "value": 4,
        "image": "im_forest_4",
        "effect": ""
    }, forest_5: {
        "ID": 4,
        "name": "forest_5",
        "displayName": "Sosna karłowata",
        "element": ELEMENT.FOREST,
        "value": 5,
        "image": "im_forest_5",
        "effect": ""
    }, forest_6: {
        "ID": 5,
        "name": "forest_6",
        "displayName": "Dąb",
        "element": ELEMENT.FOREST,
        "value": 6,
        "image": "im_forest_6",
        "effect": ""
    }, forest_7: {
        "ID": 6,
        "name": "forest_7",
        "displayName": "Zagajnik",
        "element": ELEMENT.FOREST,
        "value": 7,
        "image": "im_forest_7",
        "effect": ""
    }, forest_13: {
        "ID": 12,
        "name": "forest_13",
        "displayName": "Apokalipsa baobabów",
        "element": ELEMENT.FOREST,
        "value": 13,
        "image": "im_forest_13",
        "effect": ""
    }, fire_1: {
        "ID": 13,
        "name": "fire_1",
        "displayName": "Zapałka",
        "element": ELEMENT.FIRE,
        "value": 1,
        "image": "im_fire_1",
        "effect": ""
    }, fire_2: {
        "ID": 14,
        "name": "fire_2",
        "displayName": "Świeczka",
        "element": ELEMENT.FIRE,
        "value": 2,
        "image": "im_fire_2",
        "effect": ""
    }, fire_3: {
        "ID": 15,
        "name": "fire_3",
        "displayName": "Zimne ognie",
        "element": ELEMENT.FIRE,
        "value": 3,
        "image": "im_fire_3",
        "effect": ""
    }, fire_4: {
        "ID": 16,
        "name": "fire_4",
        "displayName": "Pochodnia",
        "element": ELEMENT.FIRE,
        "value": 4,
        "image": "im_fire_4",
        "effect": ""
    }, fire_5: {
        "ID": 17,
        "name": "fire_5",
        "displayName": "Małe ognisko",
        "element": ELEMENT.FIRE,
        "value": 5,
        "image": "im_fire_5",
        "effect": ""
    }, fire_6: {
        "ID": 18,
        "name": "fire_6",
        "displayName": "Duże ognisko",
        "element": ELEMENT.FIRE,
        "value": 6,
        "image": "im_fire_6",
        "effect": ""
    }, fire_7: {
        "ID": 19,
        "name": "fire_7",
        "displayName": "Fajerwerki",
        "element": ELEMENT.FIRE,
        "value": 7,
        "image": "im_fire_7",
        "effect": ""
    }, fire_12: {
        "ID": 24,
        "name": "fire_12",
        "displayName": "Bomba atomowa",
        "flavour": "Calkiem jeszcze nowa",
        "element": ELEMENT.FIRE,
        "value": 12,
        "image": "im_fire_12",
        "effect": ""
    }, water_1: {
        "ID": 26,
        "name": "water_1",
        "displayName": "Rosa",
        "element": ELEMENT.WATER,
        "value": 1,
        "image": "im_water_1",
        "effect": ""
    }, water_2: {
        "ID": 27,
        "name": "water_2",
        "displayName": "Kropla wody",
        "element": ELEMENT.WATER,
        "value": 2,
        "image": "im_water_2",
        "effect": ""
    }, water_3: {
        "ID": 28,
        "name": "water_3",
        "displayName": "Kałuża",
        "element": ELEMENT.WATER,
        "value": 3,
        "image": "im_water_3",
        "effect": ""
    }, water_4: {
        "ID": 29,
        "name": "water_4",
        "displayName": "Szklanka wody",
        "element": ELEMENT.WATER,
        "value": 4,
        "image": "im_water_4",
        "effect": ""
    }, water_5: {
        "ID": 30,
        "name": "water_5",
        "displayName": "Deszcz",
        "element": ELEMENT.WATER,
        "value": 5,
        "image": "im_water_5",
        "effect": ""
    }, water_6: {
        "ID": 31,
        "name": "water_6",
        "displayName": "Staw",
        "element": ELEMENT.WATER,
        "value": 6,
        "image": "im_water_6",
        "effect": ""
    }, water_7: {
        "ID": 32,
        "name": "water_7",
        "displayName": "Rzeka",
        "element": ELEMENT.WATER,
        "value": 7,
        "image": "im_water_7",
        "effect": ""
    }, plus5_forest: {
        "ID": 39,
        "name": "plus5_forest",
        "displayName": "Plantacja",
        "element": ELEMENT.FOREST,
        "value": 4,
        "image": "im_plus5_forest",
        "effect": plus5
    }, minus5_fire: {
        "ID": 43,
        "name": "minus5_fire",
        "displayName": "Polano",
        "element": ELEMENT.FIRE,
        "value": 4,
        "image": "im_minus5_fire",
        "effect": minus5
    }, replace1_water: {
        "ID": 47,
        "name": "replace1_water",
        "displayName": "Starorzecze",
        "element": ELEMENT.WATER,
        "value": 4,
        "image": "im_replace1_water",
        "effect": replace1
    }, weaker_fire: {
        "ID": 49,
        "name": "weaker_fire",
        "displayName": "Grecki ogien",
        "element": ELEMENT.FIRE,
        "value": 2,
        "image": "im_weaker_fire",
        "effect": weaker_element
    }, only_values_forest: {
        "ID": 57,
        "name": "only_values_forest",
        "displayName": "Kości",
        "flavour": "Zostaly rzucone",
        "element": ELEMENT.FOREST,
        "value": 6,
        "image": "im_only_values",
        "effect": only_values
    }
};

let DeckBank = {
    MIN_DECK_SIZE: 13 + 5,

    //Zwraca listę nazw kart tworzących podstawową talię, zawierającą po jednej karcie każdego żywiołu dla każdej wartości od minValue do maxValue (włącznie)
    getBasicDeck: function (minValue = 1, maxValue = 7) {
        let res = [];
        for (let i = minValue; i <= maxValue; i++) {
            res.push("fire_" + i);
            res.push("water_" + i);
            res.push("forest_" + i);
        }
        return res;
    },

    getTestDeck: function () {
        let specialCardList = ["plus5_forest", "replace1_water", "weaker_fire", "fire_12"];
        return this.getBasicDeck(1, 7).concat(specialCardList);
    },

    getCardsFromNames: function (names) {
        return names.map(n => cardData[n]);
    },

    //Sprawdza, czy w talii nie ma czegoś dziwnego
    validateDeck: function (deck) {
        console.assert(deck.length >= this.MIN_DECK_SIZE); //Talia musi zawierać minimalną ilość kart

        deck.forEach(function (card) {
            console.assert(card); //Karty muszą istnieć
            console.assert(typeof card === "object"); //Karty muszą być obiektami
            console.assert(card.name); //Karty muszą mieć nazwę
            console.assert(card.displayName); //Karty muszą mieć wyświetlaną nazwę
            console.assert(card.value && !isNaN(card.value)); //Karty muszą mieć wartość która jest liczbą
            let elementFound = false;
            for (let elementName in ELEMENT) {
                if (ELEMENT[elementName] === card.element) elementFound = true;
            }
            console.assert(elementFound); //Karty muszą mieć żywioł będący częścią ELEMENT
        }, this);
    },


}