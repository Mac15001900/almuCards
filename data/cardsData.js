const ELEMENT =
    {
        NONE: 0,
        FIRE: 1,
        WATER: 2,
        FOREST: 3,

        info: {} //Informacje o danym żywiole, przydatne w wielu miejscach
    };

ELEMENT.basic = [ELEMENT.FIRE, ELEMENT.WATER, ELEMENT.FOREST];

ELEMENT.info[ELEMENT.FIRE] = {
    name: "Ogień", //Nazwa, którą może zobaczyć użytkownik
    symbol: "sym_icon_fire", //Nazwa sprite'a symbolu
    color: 0xFF2A00, //Powiązany kolor
    real: true, //Czy to prawdziwy element, czy coś technicznego co nie ma powiązanych kart itp.
};
ELEMENT.info[ELEMENT.WATER] = {
    name: "Woda",
    symbol: "sym_icon_water",
    color: 0x0055FF,
    real: true,
};
ELEMENT.info[ELEMENT.FOREST] = {
    name: "Las",
    symbol: "sym_icon_forest",
    color: 0x00B33C,
    real: true,
};
ELEMENT.info[ELEMENT.NONE] = {
    name: "Brak",
    color: 0xaaaaaa,
    real: false,
};

//TODO: Prosty sposób na dodawanie kart, które mają wersję z każdym żywiołem (np. wartość ELEMENT.ALL, i puszczać to przez jakiś konwerter)
let cardData = {
    basic_forest_1: {
        "ID": 0,
        "name": "basic_forest_1",
        "displayName": "Żołądź",
        "element": ELEMENT.FOREST,
        "value": 1,
        "effect": ""
    }, basic_forest_2: {
        "ID": 1,
        "name": "basic_forest_2",
        "displayName": "Szyszka",
        "element": ELEMENT.FOREST,
        "value": 2,
        "effect": ""
    }, basic_forest_3: {
        "ID": 2,
        "name": "basic_forest_3",
        "displayName": "Sadzonka",
        "element": ELEMENT.FOREST,
        "value": 3,
        "effect": ""
    }, basic_forest_4: {
        "ID": 3,
        "name": "basic_forest_4",
        "displayName": "Krzak",
        "element": ELEMENT.FOREST,
        "value": 4,
        "effect": ""
    }, basic_forest_5: {
        "ID": 4,
        "name": "basic_forest_5",
        "displayName": "Sosna karłowata",
        "element": ELEMENT.FOREST,
        "value": 5,
        "effect": ""
    }, basic_forest_6: {
        "ID": 5,
        "name": "basic_forest_6",
        "displayName": "Dąb",
        "element": ELEMENT.FOREST,
        "value": 6,
        "effect": ""
    }, basic_forest_7: {
        "ID": 6,
        "name": "basic_forest_7",
        "displayName": "Zagajnik",
        "element": ELEMENT.FOREST,
        "value": 7,
        "effect": ""
    }, basic_forest_13: {
        "ID": 12,
        "name": "basic_forest_13",
        "displayName": "Apokalipsa baobabów",
        "element": ELEMENT.FOREST,
        "value": 13,
        "effect": ""
    }, basic_fire_1: {
        "ID": 13,
        "name": "basic_fire_1",
        "displayName": "Zapałka",
        "element": ELEMENT.FIRE,
        "value": 1,
        "effect": ""
    }, basic_fire_2: {
        "ID": 14,
        "name": "basic_fire_2",
        "displayName": "Świeczka",
        "element": ELEMENT.FIRE,
        "value": 2,
        "effect": ""
    }, basic_fire_3: {
        "ID": 15,
        "name": "basic_fire_3",
        "displayName": "Zimne ognie",
        "element": ELEMENT.FIRE,
        "value": 3,
        "effect": ""
    }, basic_fire_4: {
        "ID": 16,
        "name": "basic_fire_4",
        "displayName": "Pochodnia",
        "element": ELEMENT.FIRE,
        "value": 4,
        "effect": ""
    }, basic_fire_5: {
        "ID": 17,
        "name": "basic_fire_5",
        "displayName": "Małe ognisko",
        "element": ELEMENT.FIRE,
        "value": 5,
        "effect": ""
    }, basic_fire_6: {
        "ID": 18,
        "name": "basic_fire_6",
        "displayName": "Duże ognisko",
        "element": ELEMENT.FIRE,
        "value": 6,
        "effect": ""
    }, basic_fire_7: {
        "ID": 19,
        "name": "basic_fire_7",
        "displayName": "Fajerwerki",
        "element": ELEMENT.FIRE,
        "value": 7,
        "effect": ""
    }, basic_fire_12: {
        "ID": 24,
        "name": "basic_fire_12",
        "displayName": "Bomba atomowa",
        "flavour": "Calkiem jeszcze nowa",
        "element": ELEMENT.FIRE,
        "value": 12,
        "effect": ""
    }, basic_water_1: {
        "ID": 26,
        "name": "basic_water_1",
        "displayName": "Rosa",
        "element": ELEMENT.WATER,
        "value": 1,
        "effect": ""
    }, basic_water_2: {
        "ID": 27,
        "name": "basic_water_2",
        "displayName": "Kropla wody",
        "element": ELEMENT.WATER,
        "value": 2,
        "effect": ""
    }, basic_water_3: {
        "ID": 28,
        "name": "basic_water_3",
        "displayName": "Kałuża",
        "element": ELEMENT.WATER,
        "value": 3,
        "effect": ""
    }, basic_water_4: {
        "ID": 29,
        "name": "basic_water_4",
        "displayName": "Szklanka wody",
        "element": ELEMENT.WATER,
        "value": 4,
        "effect": ""
    }, basic_water_5: {
        "ID": 30,
        "name": "basic_water_5",
        "displayName": "Deszcz",
        "element": ELEMENT.WATER,
        "value": 5,
        "effect": ""
    }, basic_water_6: {
        "ID": 31,
        "name": "basic_water_6",
        "displayName": "Staw",
        "element": ELEMENT.WATER,
        "value": 6,
        "effect": ""
    }, basic_water_7: {
        "ID": 32,
        "name": "basic_water_7",
        "displayName": "Rzeka",
        "element": ELEMENT.WATER,
        "value": 7,
        "effect": ""
    }, plus5_forest: {
        "ID": 39,
        "name": "plus5_forest",
        "displayName": "Plantacja",
        "element": ELEMENT.FOREST,
        "value": 4,
        "effect": plus5
    }, minus5_fire: {
        "ID": 43,
        "name": "minus5_fire",
        "displayName": "Polano",
        "element": ELEMENT.FIRE,
        "value": 4,
        "effect": minus5
    }, replace1_water: {
        "ID": 47,
        "name": "replace1_water",
        "displayName": "Starorzecze",
        "element": ELEMENT.WATER,
        "value": 4,
        "effect": replace1
    }, weaker_fire: {
        "ID": 49,
        "name": "weaker_fire",
        "displayName": "Grecki ogien",
        "element": ELEMENT.FIRE,
        "value": 2,
        "effect": weaker_element
    }, only_values_forest: {
        "ID": 57,
        "name": "only_values_forest",
        "displayName": "Kości",
        "flavour": "Zostaly rzucone",
        "element": ELEMENT.FOREST,
        "value": 6,
        "effect": only_values
    }
};

//TODO: W sumie to można by to przenieść do cardLogic.js jak go stworzymy, tu powinny być dane a nie tyle logiki
let DeckBank = {
    MIN_DECK_SIZE: 13 + 5,

    //Zwraca podstawową talię (w postaci nazw), zawierającą po jednej karcie każdego żywiołu dla każdej wartości od minValue do maxValue (włącznie)
    getBasicDeck: function (minValue = 1, maxValue = 7) {
        let res = [];
        for (let i = minValue; i <= maxValue; i++) {
            res.push("basic_fire_" + i);
            res.push("basic_water_" + i);
            res.push("basic_forest_" + i);
        }
        return res;
    },

    getTestDeck: function () {
        let specialCardList = ["plus5_forest", "replace1_water", "minus5_fire"];
        return this.getBasicDeck(1, 6).concat(specialCardList);
        //let specialCardList = ["plus5_forest", "replace1_water", "weaker_fire", "basic_fire_12"];
        //return this.getBasicDeck(1, 7).concat(specialCardList);
    },

    getCardsFromNames: function (names) {
        return names.map(n => cardData[n]);
    },

    //Zwraca listę obrazków na kartach w talii (lub taliach), usuwając duplikaty
    getImages: function (deck, deck2 = []) {
        let res = [];
        let combined = deck.concat(deck2);
        if (typeof combined[0] === "string") combined = this.getCardsFromNames(combined);
        for (var i = 0; i < combined.length; i++) {
            if (combined[i].image) res.push(combined[i].image);
            else res.push(combined[i].name);
        }
        return Array.from(new Set(res)); //Konwersja do Set usuwa duplikaty
    },

    //Sprawdza, czy w talii nie ma czegoś dziwnego.
    validateDeck: function (deck, checkLength = true) {
        if (checkLength) console.assert(deck.length >= this.MIN_DECK_SIZE); //Talia musi zawierać minimalną ilość kart

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
