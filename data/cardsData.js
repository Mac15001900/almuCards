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

