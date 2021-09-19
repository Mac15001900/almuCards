const ELEMENT =
    {
        NONE: 0,
        FIRE: 1,
        FOREST: 2,
        WATER: 3,
        ONE_EACH: 4,

        info: {} //Informacje o danym żywiole, przydatne w wielu miejscach
    };

ELEMENT.basic = [ELEMENT.FIRE, ELEMENT.FOREST, ELEMENT.WATER];

ELEMENT.info[ELEMENT.FIRE] = {
    name: "Ogień", //Nazwa, którą może zobaczyć użytkownik
    symbol: "symIconFire", //Nazwa sprite'a symbolu
    color: 0xFF2A00, //Powiązany kolor
    real: true, //Czy to prawdziwy żywioł, czy coś technicznego co nie ma powiązanych kart itp.
};
ELEMENT.info[ELEMENT.FOREST] = {
    name: "Las",
    symbol: "symIconForest",
    color: 0x00B33C,
    real: true,
};
ELEMENT.info[ELEMENT.WATER] = {
    name: "Woda",
    symbol: "symIconWater",
    color: 0x0055FF,
    real: true,
};
ELEMENT.info[ELEMENT.NONE] = {
    name: "Brak",
    color: 0xaaaaaa,
    real: false,
};
ELEMENT.info[ELEMENT.ONE_EACH] = {
    name: "Po jednym",
    color: 0xaaaaaa,
    real: false,
};

//TODO: Prosty sposób na dodawanie kart, które mają wersję z każdym żywiołem (np. wartość ELEMENT.ALL, i puszczać to przez jakiś konwerter)
let cardData = {
    basic1: {
        "name": "basic1",
        "multipleImages": true,
        "displayName": ["Zapałka", "Żołądź", "Rosa"],
        "element": ELEMENT.ONE_EACH,
        "value": 1,
        "effect": ""
    }, basic2: {
        "name": "basic2",
        "multipleImages": true,
        "displayName": ["Świeczka", "Szyszka", "Kropla wody"],
        "element": ELEMENT.ONE_EACH,
        "value": 2,
        "effect": ""
    }, basic3: {
        "name": "basic3",
        "multipleImages": true,
        "displayName": ["Zimne ognie", "Sadzonka", "Kałuża"],
        "element": ELEMENT.ONE_EACH,
        "value": 3,
        "effect": ""
    }, basic4: {
        "name": "basic4",
        "multipleImages": true,
        "displayName": ["Pochodnia", "Krzak", "Szklanka wody"],
        "element": ELEMENT.ONE_EACH,
        "value": 4,
        "effect": ""
    }, basic5: {
        "name": "basic5",
        "multipleImages": true,
        "displayName": ["Małe ognisko", "Sosna karłowata", "Deszcz"],
        "element": ELEMENT.ONE_EACH,
        "value": 5,
        "effect": ""
    }, basic6: {
        "name": "basic6",
        "multipleImages": true,
        "displayName": ["Duże ognisko", "Dąb", "Staw"],
        "element": ELEMENT.ONE_EACH,
        "value": 6,
        "effect": ""
    }, basic7: {
        "name": "basic7",
        "multipleImages": true,
        "displayName": ["Fajerwerki", "Zagajnik", "Rzeka"],
        "element": ELEMENT.ONE_EACH,
        "value": 7,
        "effect": ""
    }, basic8: {
        "name": "basic8",
        "multipleImages": true,
        "displayName": ["Ogniste tronado", "Las", "Jezioro"],
        "element": ELEMENT.ONE_EACH,
        "value": 8,
        "effect": ""
    }, basic9: {
        "name": "basic9",
        "multipleImages": true,
        "displayName": ["Pożar domu", "Gęsty las", "Powódź"],
        "element": ELEMENT.ONE_EACH,
        "value": 9,
        "effect": ""
    }, basic10: {
        "name": "basic10",
        "multipleImages": true,
        "displayName": ["Pożar lasu", "Baobab", "Śniardwy"],
        "element": ELEMENT.ONE_EACH,
        "value": 10,
        "effect": ""
    }, basic11: {
        "name": "basic11",
        "multipleImages": true,
        "displayName": ["Wulkan", "Sekwoja olbrzymia", "Morze"],
        "element": ELEMENT.ONE_EACH,
        "value": 11,
        "effect": ""
    }, basic12: {
        "name": "basic12",
        "multipleImages": true,
        "displayName": ["Bomba atomowa", "Puszcza", "Ocean"],
        "flavour": ["Całkiem jeszcze nowa", "", ""],
        "element": ELEMENT.ONE_EACH,
        "value": 12,
        "effect": ""
    }, basic13: {
        "name": "basic13",
        "multipleImages": true,
        "displayName": ["Słońce", "Apokalipsa baobabów", "Wodna planeta"],
        "element": ELEMENT.ONE_EACH,
        "value": 13,
        "effect": ""
    }, plus5: {
        "name": "plus5",
        "multipleImages": true,
        "displayName": ["Pięć świeczek", "Plantacja", "Krople deszczu"],
        "element": ELEMENT.ONE_EACH,
        "value": 4,
        "effect": effectData.plus(5)
    }, minus5: {
        "name": "minus5",
        "multipleImages": true,
        "displayName": ["Polano", "Oset", "Kostki lodu"],
        "element": ELEMENT.ONE_EACH,
        "value": 4,
        "effect": effectData.minus(5)
    }, replace1: {
        "name": "replace1",
        "multipleImages": true,
        "displayName": ["Feniks", "Torfowisko", "Starorzecze"],
        "element": ELEMENT.ONE_EACH,
        "value": 4,
        "effect": effectData.replace(1)
    }, remove1: {
        "name": "remove1",
        "multipleImages": true,
        "displayName": ["Miotacz ognia", "Ent", "Gradobicie"],
        "element": ELEMENT.ONE_EACH,
        "value": 5,
        "effect": effectData.remove(1)
    }, weaker: {
        "name": "weaker",
        "multipleImages": true,
        "displayName": ["Grecki ogień", "Kaktus", "Powódź lasu"],
        "element": ELEMENT.ONE_EACH,
        "value": 2,
        "effect": effectData.weakerElement
    }, lower: {
        "name": "lower",
        "multipleImages": true,
        "displayName": ["Słaby płomień", "Mech", "Wir wodny"],
        "element": ELEMENT.ONE_EACH,
        "value": 2,
        "effect": effectData.lowerValue
    }, only_values: {
        "name": "only_values",
        "displayName": "Kości",
        "flavour": "Zostaly rzucone",
        "element": ELEMENT.ONE_EACH,
        "value": 6,
        "effect": effectData.onlyValues
    }, only_elements: {
        "name": "only_elements",
        "displayName": "Potęga żywiołów",
        "flavour": ["Test ognia", "Test lasu", "Test wody"],
        "element": ELEMENT.ONE_EACH,
        "value": 1,
        "effect": effectData.onlyElements
    }, divB: {
        "name": "divB",
        "displayName": "Dywergencja pola magnetycznego",
        "flavour": "Jesteś zerem!",
        "element": ELEMENT.ONE_EACH,
        "value": 0,
        "effect": ""
    }, kontrola_czystosci: {
        "name": "kontrola_czystosci",
        "displayName": "Kontrola czystości",
        "flavour": "Zbiórka przed namiotami!",
        "element": ELEMENT.FOREST,
        "value": 8,
        "effect": ""
    }, goraca_woda: {
        "name": "goraca_woda",
        "displayName": "Gorąca woda",
        "flavour": "Uwaga! Może wybuchnąć",
        "element": ELEMENT.WATER,
        "value": 3,
        "effect": ""
    }, empty_set: {
        "name": "empty_set",
        "displayName": "Zbiór pusty",
        "flavour": "Jest podzbiorem Twoich myśli",
        "element": ELEMENT.ONE_EACH,
        "value": 4,
        "effect": effectData.cancelEnemyEffect
    }, synta: {
        "name": "synta",
        "displayName": "Synta supernowa",
        "flavour": "Niebo żyleta, obsy do rana!",
        "element": ELEMENT.ONE_EACH,
        "value": 2.54,
        "effect": effectData.deckLook(1)
    }, gumowa_kaczuszka: {
        "name": "gumowa_kaczuszka",
        "displayName": "Gumowa kaczuszka",
        "flavour": "Kwa kwa",
        "element": ELEMENT.WATER,
        "value": 3,
        "effect": effectData.addDuck2
    },
};

let DeckBank = {
    MIN_DECK_SIZE: 13 + 5,

    //Zwraca podstawową talię (w postaci nazw), zawierającą po jednej karcie każdego żywiołu dla każdej wartości od minValue do maxValue (włącznie)
    getBasicDeck: function (minValue = 1, maxValue = 7) {
        let res = [];
        for (let i = minValue; i <= maxValue; i++) {
            if (i >= 1 && i <= 7) {
                res.push("basic" + i + "_all");
                continue;
            }
        }
        return res;
    },

    getClasicDeck: function () {
        //let specialCardList = ["plus5_forest", "replace1_water", "minus5_fire"];
        let specialCardList = ["plus5_rand", "replace1_rand", "minus5_rand"];
        let clasicDeck = this.getBasicDeck(1, 6).concat(specialCardList);
        this.transformRandToElements(clasicDeck);
        return clasicDeck;
    },

    getTheSecondDeck: function () {
        let theSecondDeck = ["synta_all", "lower_rand", "weaker_rand", "remove1_rand", "empty_set_all", "kontrola_czystosci", "goraca_woda", "divB_fire",
            "basic3_fire", "basic3_forest", "basic8_fire", "basic8_water", "basic1_forest", "basic1_water", "basic7_all"];
        this.transformRandToElements(theSecondDeck);
        return theSecondDeck;
    },

    getTestDeck: function () {
        //let specialCardList = ["weaker_all", "lower_all", "only_elements_all", "only_values_all"];
        let specialCardList = ["gumowa_kaczuszka"];
        let testDeck = this.getBasicDeck(1, 2).concat(specialCardList);
        return testDeck;
    },

    assemblyDeck: function (names) {
        let newDeck = this.getCardsFromNames(names);
        //console.log(new_deck);
        Phaser.Actions.Shuffle(newDeck);
        return newDeck;
    },

    transformRandToElements: function (names) {
        Phaser.Actions.Shuffle(names);
        let ret = [];
        let randomElement = Math.floor((Math.random() * 3)) + 1;    //jeżeli będzie potrzebne losowanie żywiołów, losowanie początku pętli
        for (let i = 0; i < names.length; i++) {
            if (names[i].indexOf("_rand") !== -1) {
                randomElement++;
                if (randomElement > 3)
                    randomElement -= 3;
                names[i] = names[i].slice(0, names[i].indexOf("_rand"));
                switch (randomElement) {
                    case ELEMENT.FIRE: names[i] += "_fire"; break;
                    case ELEMENT.FOREST: names[i] += "_forest"; break;
                    case ELEMENT.WATER: names[i] += "_water"; break;
                }
            }
            ret.push(names[i]);
        }
        return ret;
    },

    getCardsFromNames: function (names) {
        let ret = [];
        //let prototype = names.map(n => cardData[n]);
        for (let i = 0; i < names.length; i++) {
            let specyficElement = ELEMENT.NONE;
            if (names[i].indexOf("_all") !== -1) {
                names[i] = names[i].slice(0, names[i].indexOf("_all"));
                specyficElement = ELEMENT.ONE_EACH;
            }
            else if (names[i].indexOf("_fire") !== -1)    //sprawdzanie, czy nie chodzi o konkretny żywioł
            {
                names[i] = names[i].slice(0, names[i].indexOf("_fire"));
                specyficElement = ELEMENT.FIRE;
            }
            else if (names[i].indexOf("_forest") !== -1) {
                names[i] = names[i].slice(0, names[i].indexOf("_forest"));
                specyficElement = ELEMENT.FOREST;
            }
            else if (names[i].indexOf("_water") !== -1) {
                names[i] = names[i].slice(0, names[i].indexOf("_water"));
                specyficElement = ELEMENT.WATER;
            }
            let prototype = Object.assign({}, cardData[names[i]]); //pobieranie podstawowych danych z bazy
            if (specyficElement != ELEMENT.NONE)   //przypisanie konkretnego żywiołu, jeśli potrzeba
                prototype.element = specyficElement;
            ret = ret.concat(this.createCardsFromPrototype(prototype));
        }
        return ret;
    },

    createCardsFromPrototype: function (prototype) {
        let ret = [];
        switch (prototype.element)  //tworzenie kart (dodawanie nazw i flavourText)
        {
            case ELEMENT.ONE_EACH:
                ret.push(this.createSingleCard(prototype, ELEMENT.FIRE));
                ret.push(this.createSingleCard(prototype, ELEMENT.FOREST));
                ret.push(this.createSingleCard(prototype, ELEMENT.WATER));
                break;
            case ELEMENT.NONE:
                break;
            default:
                ret.push(this.createSingleCard(prototype, prototype.element));
        }
        return ret;
    },

    createSingleCard: function (prototype, element) {
        let newCard = Object.assign({}, prototype);    //tworzenie nowego obiektu
        newCard.element = element;
        if (Array.isArray(newCard.displayName) || Array.isArray(newCard.flavour) || newCard.multipleImages) {
            if (!newCard.multipleImages) newCard.image = newCard.name;
            switch (element)    //zmiana nazwy karty
            {
                case ELEMENT.FIRE: newCard.name += "_fire"; break;
                case ELEMENT.FOREST: newCard.name += "_forest"; break;
                case ELEMENT.WATER: newCard.name += "_water"; break;
                default: console.error("Niepoprawny żywioł: " + newCard.name + " " + element);
            }
            if (Array.isArray(newCard.displayName)) newCard.displayName = newCard.displayName[newCard.element - 1];
            if (Array.isArray(newCard.flavour)) newCard.flavour = newCard.flavour[newCard.element - 1];


        }
        return newCard;
    },

    //Zwraca listę obrazków na kartach w talii (lub taliach), usuwając duplikaty
    getImages: function (deck, deck2 = []) {
        let res = [];
        let combined = deck.concat(deck2);
        if (typeof combined[0] === "string")
            combined = this.assemblyDeck(combined);
        //console.log(combined);
        for (let i = 0; i < combined.length; i++) {
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
            console.assert(typeof card === 'object'); //Karty muszą być obiektami
            console.assert(card.name && typeof card.name === 'string'); //Karty muszą mieć nazwę, będącą stringiem
            console.assert(card.displayName); //Karty muszą mieć wyświetlaną nazwę...
            console.assert(typeof card.displayName === 'string' || Array.isArray(card.displayName)); //...która jest albo stringiem, albo listą
            if (Array.isArray(card.displayName)) {
                console.assert(card.displayName.length > 0); //Jeśli jest listą, to musi zawierać elementy
                card.displayName.forEach(name => console.assert(typeof name === 'string')); //Elementy tej listy muszą być stringami
            }
            console.assert((card.value && !isNaN(card.value)) || card.value === 0); //Karty muszą mieć wartość która jest liczbą
            let elementFound = false;
            for (let elementName in ELEMENT) {
                if (ELEMENT[elementName] === card.element) elementFound = true;
            }
            console.assert(elementFound); //Karty muszą mieć żywioł będący częścią ELEMENT
        }, this);
    },
}
