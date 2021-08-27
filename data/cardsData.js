const ELEMENT =
{
    NONE: 0,
    FIRE: 1,
    FOREST: 2,
    WATER: 3,
    ONE_EACH: 4,
    RANDOM: 5,

    info: {} //Informacje o danym żywiole, przydatne w wielu miejscach
};

ELEMENT.basic = [ELEMENT.FIRE, ELEMENT.FOREST, ELEMENT.WATER];

ELEMENT.info[ELEMENT.FIRE] = {
    name: "Ogień", //Nazwa, którą może zobaczyć użytkownik
    symbol: "sym_icon_fire", //Nazwa sprite'a symbolu
    color: 0xFF2A00, //Powiązany kolor
    real: true, //Czy to prawdziwy element, czy coś technicznego co nie ma powiązanych kart itp.
};
ELEMENT.info[ELEMENT.FOREST] = {
    name: "Las",
    symbol: "sym_icon_forest",
    color: 0x00B33C,
    real: true,
};
ELEMENT.info[ELEMENT.WATER] = {
    name: "Woda",
    symbol: "sym_icon_water",
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
ELEMENT.info[ELEMENT.RANDOM] = {
    name: "Wylosowane",
    color: 0xaaaaaa,
    real: false,
};

//TODO: Prosty sposób na dodawanie kart, które mają wersję z każdym żywiołem (np. wartość ELEMENT.ALL, i puszczać to przez jakiś konwerter)
let cardData = {
    basic1: {
        "name": "basic1",
        "differentNames": true,
        "displayName": ["Zapałka", "Żołądź", "Rosa"],
        "flavour": ["", "", ""],
        "element": ELEMENT.ONE_EACH,
        "value": 1,
        "effect": ""
    }, basic2: {
        "name": "basic2",
        "differentNames": true,
        "displayName": ["Świeczka", "Szyszka", "Kropla wody"],
        "flavour": ["", "", ""],
        "element": ELEMENT.ONE_EACH,
        "value": 2,
        "effect": ""
    }, basic3: {
        "name": "basic3",
        "differentNames": true,
        "displayName": ["Zimne ognie", "Sadzonka", "Kałuża"],
        "flavour": ["", "", ""],
        "element": ELEMENT.ONE_EACH,
        "value": 3,
        "effect": ""
    }, basic4: {
        "name": "basic4",
        "differentNames": true,
        "displayName": ["Pochodnia", "Krzak", "Szklanka wody"],
        "flavour": ["", "", ""],
        "element": ELEMENT.ONE_EACH,
        "value": 4,
        "effect": ""
    }, basic5: {
        "name": "basic5",
        "differentNames": true,
        "displayName": ["Małe ognisko", "Sosna karłowata", "Deszcz"],
        "flavour": ["", "", ""],
        "element": ELEMENT.ONE_EACH,
        "value": 5,
        "effect": ""
    }, basic6: {
        "name": "basic6",
        "differentNames": true,
        "displayName": ["Duże ognisko", "Dąb", "Staw"],
        "flavour": ["", "", ""],
        "element": ELEMENT.ONE_EACH,
        "value": 6,
        "effect": ""
    }, basic7: {
        "name": "basic7",
        "differentNames": true,
        "displayName": ["Fajerwerki", "Zagajnik", "Rzeka"],
        "flavour": ["", "", ""],
        "element": ELEMENT.ONE_EACH,
        "value": 7,
        "effect": ""
    }, basic13_forest: {
        "ID": 12,
        "name": "basic_forest_13",
        "displayName": "Apokalipsa baobabów",
        "element": ELEMENT.FOREST,
        "value": 13,
        "effect": ""
    }, basic12_fire: {
        "ID": 24,
        "name": "basic12_fire",
        "displayName": "Bomba atomowa",
        "flavour": "Calkiem jeszcze nowa",
        "element": ELEMENT.FIRE,
        "value": 12,
        "effect": ""
    }, plus5: {
        "name": "plus5",
        "differentNames": true,
        "displayName": ["Pięć świeczek", "Plantacja", "Krople deszczu"],
        "flavour": ["", "", ""],
        "element": ELEMENT.ONE_EACH,
        "value": 4,
        "effect": effectData.plus5
    }, minus5: {
        "name": "minus5",
        "differentNames": true,
        "displayName": ["Polano", "Oset", "Kostki lodu"],
        "flavour": ["", "", ""],
        "element": ELEMENT.ONE_EACH,
        "value": 4,
        "effect": effectData.minus5
    }, replace1: {
        "name": "replace1",
        "differentNames": true,
        "displayName": ["Feniks", "Torfowisko", "Starorzecze"],
        "flavour": ["", "", ""],
        "element": ELEMENT.ONE_EACH,
        "value": 4,
        "effect": effectData.replace1
    }, weaker_fire: {
        "ID": 49,
        "name": "weaker_fire",
        "displayName": "Grecki ogien",
        "element": ELEMENT.FIRE,
        "value": 2,
        "effect": effectData.weaker_element
    }, only_values_forest: {
        "ID": 57,
        "name": "only_values_forest",
        "displayName": "Kości",
        "flavour": "Zostaly rzucone",
        "element": ELEMENT.FOREST,
        "value": 6,
        "effect": effectData.only_values
    }
};

//TODO: W sumie to można by to przenieść do cardLogic.js jak go stworzymy, tu powinny być dane a nie tyle logiki
let DeckBank = {
    MIN_DECK_SIZE: 13 + 5,

    //Zwraca podstawową talię (w postaci nazw), zawierającą po jednej karcie każdego żywiołu dla każdej wartości od minValue do maxValue (włącznie)
    getBasicDeck: function (minValue = 1, maxValue = 7)
    {
        let res = [];
        for (let i = minValue; i <= maxValue; i++) 
        {
            if (i >= 1 && i <= 7)
            {
                res.push("basic" + i + "_all");
                continue;
            }
        }
        return res;
    },

    getClasicDeck: function ()
    {
        let specialCardList = ["plus5_forest", "replace1_water", "minus5_fire"];
        //let specialCardList = ["plus5_rand", "replace1_rand", "minus5_rand"];
        return this.getBasicDeck(1, 6).concat(specialCardList);
    },

    getTestDeck: function ()
    {
        return this.getClasicDeck();
    },

    assemblyDeck: function (names)
    {
        Phaser.Actions.Shuffle(names);
        let new_deck = this.getCardsFromNames(names);
        Phaser.Actions.Shuffle(new_deck);
        return new_deck;
    },

    getCardsFromNames: function (names)
    {
        let ret = [];
        //let prototype = names.map(n => cardData[n]);
        for (var i = 0; i < names.length; i++)
        {
            var specyficElement = ELEMENT.NONE;
            if (names[i].indexOf("_all") != -1)
            {
                names[i] = names[i].slice(0, names[i].indexOf("_all"));
                specyficElement = ELEMENT.ONE_EACH;
            }
            else if (names[i].indexOf("_rand") != -1)
            {
                names[i] = names[i].slice(0, names[i].indexOf("_rand"));
                specyficElement = ELEMENT.RANDOM;
            }
            else if (names[i].indexOf("_fire") != -1)    //sprawdzanie, czy nie chodzi o konkretny żywioł
            {
                names[i] = names[i].slice(0, names[i].indexOf("_fire"));
                specyficElement = ELEMENT.FIRE;
            }
            else if (names[i].indexOf("_forest") != -1)
            {
                names[i] = names[i].slice(0, names[i].indexOf("_forest"));
                specyficElement = ELEMENT.FOREST;
            }
            else if (names[i].indexOf("_water") != -1)
            {
                names[i] = names[i].slice(0, names[i].indexOf("_water"));
                specyficElement = ELEMENT.WATER;
            }
            let prototype = cardData[names[i]]; //pobieranie podstawowych danych z bazy
            if (specyficElement != ELEMENT.NONE)   //przypisanie konkretnego żywiołu, jeśli potrzeba
                prototype.element = specyficElement;
            var randomElement = Math.floor((Math.random() * 3)) + 1;    //jeżeli będzie potrzebne losowanie żywiołów, losowanie początku pętli
            switch (prototype.element)  //tworzenie kart (dodawanie nazw i flavourText)
            {
                case ELEMENT.ONE_EACH:
                    ret.push(this.createSingleCard(prototype, ELEMENT.FIRE));
                    ret.push(this.createSingleCard(prototype, ELEMENT.FOREST));
                    ret.push(this.createSingleCard(prototype, ELEMENT.WATER));
                    break;
                case ELEMENT.RANDOM:
                    if (randomElement > 3)  //pętla żywiołów 1 2 3 1
                        randomElement -= 3;
                    ret.push(this.createSingleCard(prototype, randomElement));
                    randomElement++;    //następny żywioł w pętli
                    break;
                case ELEMENT.NONE:
                    break;
                default:
                    ret.push(this.createSingleCard(prototype, prototype.element));
            }
        }
        return ret;
    },

    createSingleCard: function (prototype, element)
    {
        var new_card = Object.assign({}, prototype);    //tworzenie nowego obiektu
        new_card.element = element;
        switch (element)    //zmiana nazwy karty
        {
            case ELEMENT.FIRE: new_card.name += "_fire"; break;
            case ELEMENT.FOREST: new_card.name += "_forest"; break;
            case ELEMENT.WATER: new_card.name += "_water"; break;
            default: console.log("Blad: " + new_card.name + " " + element);
        }
        if (new_card.differentNames)
        {
            new_card.displayName = new_card.displayName[new_card.element - 1];
            new_card.flavour = new_card.flavour[new_card.element - 1];
        }
        return new_card;
    },

    //Zwraca listę obrazków na kartach w talii (lub taliach), usuwając duplikaty
    getImages: function (deck, deck2 = [])
    {
        let res = [];
        let combined = deck.concat(deck2);
        if (typeof combined[0] === "string")
            combined = this.assemblyDeck(combined);
        for (var i = 0; i < combined.length; i++)
        {
            if (combined[i].image) res.push(combined[i].image);
            else res.push(combined[i].name);
        }
        return Array.from(new Set(res)); //Konwersja do Set usuwa duplikaty
    },

    //Sprawdza, czy w talii nie ma czegoś dziwnego.
    validateDeck: function (deck, checkLength = true)
    {
        if (checkLength) console.assert(deck.length >= this.MIN_DECK_SIZE); //Talia musi zawierać minimalną ilość kart

        deck.forEach(function (card)
        {
            console.assert(card); //Karty muszą istnieć
            console.assert(typeof card === "object"); //Karty muszą być obiektami
            console.assert(card.name); //Karty muszą mieć nazwę
            console.assert(card.displayName); //Karty muszą mieć wyświetlaną nazwę
            console.assert(card.value && !isNaN(card.value)); //Karty muszą mieć wartość która jest liczbą
            let elementFound = false;
            for (let elementName in ELEMENT)
            {
                if (ELEMENT[elementName] === card.element) elementFound = true;
            }
            console.assert(elementFound); //Karty muszą mieć żywioł będący częścią ELEMENT
        }, this);
    },
}
