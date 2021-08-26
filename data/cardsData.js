const ELEMENT =
    {
        NONE: 0,
        FIRE: 1,
        WATER: 2,
        FOREST: 3,
        ONE_EACH: 4,

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
ELEMENT.info[ELEMENT.ONE_EACH] = {
    name: "Po jednym",
    color: 0xaaaaaa,
    real: false,
};

//TODO: Prosty sposób na dodawanie kart, które mają wersję z każdym żywiołem (np. wartość ELEMENT.ALL, i puszczać to przez jakiś konwerter)
let cardData = {
    basic1: {
        "name": "basic1",
        "element": ELEMENT.ONE_EACH,
        "value": 1,
        "effect": ""
    }, basic2: {
        "name": "basic2",
        "element": ELEMENT.ONE_EACH,
        "value": 2,
        "effect": ""
    }, basic3: {
        "name": "basic3",
        "element": ELEMENT.ONE_EACH,
        "value": 3,
        "effect": ""
    }, basic4: {
        "name": "basic4",
        "element": ELEMENT.ONE_EACH,
        "value": 4,
        "effect": ""
    }, basic5: {
        "name": "basic5",
        "element": ELEMENT.ONE_EACH,
        "value": 5,
        "effect": ""
    }, basic6: {
        "name": "basic6",
        "element": ELEMENT.ONE_EACH,
        "value": 6,
        "effect": ""
    }, basic7: {
        "name": "basic7",
        "element": ELEMENT.ONE_EACH,
        "value": 7,
        "effect": ""
    }, basic_forest_13: {
        "ID": 12,
        "name": "basic_forest_13",
        "displayName": "Apokalipsa baobabów",
        "element": ELEMENT.FOREST,
        "value": 13,
        "effect": ""
    }, basic_fire_12: {
        "ID": 24,
        "name": "basic_fire_12",
        "displayName": "Bomba atomowa",
        "flavour": "Calkiem jeszcze nowa",
        "element": ELEMENT.FIRE,
        "value": 12,
        "effect": ""
    }, plus5: {
        "name": "plus5",
        "element": ELEMENT.ONE_EACH,
        "value": 4,
        "effect": plus5_effect
    }, minus5: {
        "name": "minus5",
        "element": ELEMENT.ONE_EACH,
        "value": 4,
        "effect": minus5_effect
    }, replace1: {
        "name": "replace1",
        "element": ELEMENT.ONE_EACH,
        "value": 4,
        "effect": replace1_effect
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
        for (let i = minValue; i <= maxValue; i++) 
        {
            if (i >= 1 && i <= 7)
            {
                res.push("basic" + i);
                continue;
            }
            res.push("basic" + i + "_fire");
            res.push("basic" + i + "_forest");
            res.push("basic" + i + "_water");
        }
        return res;
    },

    getClasicDeck: function ()
    {
        let specialCardList = ["plus5_forest", "replace1_water", "minus5_fire"];
        return this.getBasicDeck(1, 6).concat(specialCardList);
        //let specialCardList = ["plus5_forest", "replace1_water", "weaker_fire", "basic_fire_12"];
        //return this.getBasicDeck(1, 7).concat(specialCardList);
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
            var specific_element = ELEMENT.NONE;
            if (names[i].indexOf("_fire") != -1)    //sprawdzanie, czy nie chodzi o konkretny żywioł
            {
                names[i] = names[i].slice(0, names[i].indexOf("_fire"));
                specific_element = ELEMENT.FIRE;
            }
            else if (names[i].indexOf("_forest") != -1)
            {
                names[i] = names[i].slice(0, names[i].indexOf("_forest"));
                specific_element = ELEMENT.FOREST;
            }
            else if (names[i].indexOf("_water") != -1)
            {
                names[i] = names[i].slice(0, names[i].indexOf("_water"));
                specific_element = ELEMENT.WATER;
            }
            let prototype = cardData[names[i]]; //pobieranie podstawowych danych z bazy
            if (specific_element != ELEMENT.NONE)   //przypisanie konkretnego żywiołu, jeśli potrzeba
                prototype.element = specific_element;
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
        }
        new_card.displayName = this.getDisplayName(new_card.name);  //dodawanie wyświetlanej nazwy
        new_card.flavourText = this.getFlavourText(new_card.name);  //dodawanie flavour text
        return new_card;
    },

    //Zwraca listę obrazków na kartach w talii (lub taliach), usuwając duplikaty
    getImages: function (deck, deck2 = []) {
        let res = [];
        let combined = deck.concat(deck2);
        if (typeof combined[0] === "string") 
            combined = this.assemblyDeck(combined);
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

    getDisplayName: function (name)
    {
        switch (name)
        {
            case 'basic1_fire': return "Zapałka";
            case 'basic1_forest': return "Żołądź";
            case 'basic1_water': return "Rosa";
            case 'basic2_fire': return "Świeczka";
            case 'basic2_forest': return "Szyszka";
            case 'basic2_water': return "Kropla wody";
            case 'basic3_fire': return "Zimne ognie";
            case 'basic3_forest': return "Sadzonka";
            case 'basic3_water': return "Kałuża";
            case 'basic4_fire': return "Pochodnia";
            case 'basic4_forest': return "Krzak";
            case 'basic4_water': return "Szklanka wody";
            case 'basic5_fire': return "Małe ognisko";
            case 'basic5_forest': return "Sosna karłowata";
            case 'basic5_water': return "Deszcz";
            case 'basic6_fire': return "Duże ognisko";
            case 'basic6_forest': return "Dąb";
            case 'basic6_water': return "Staw";
            case 'basic7_fire': return "Fajerwerki";
            case 'basic7_forest': return "Zagajnik";
            case 'basic7_water': return "Rzeka";
            case 'plus5_fire': return "Pięć świeczek";
            case 'plus5_forest': return "Plantacja";
            case 'plus5_water': return "Krople deszczu";
            case 'minus5_fire': return "Polano";
            case 'minus5_forest': return "Oset";
            case 'minus5_water': return "Kostki lodu";
            case 'replace1_fire': return "Feniks";
            case 'replace1_forest': return "Torfowisko";
            case 'replace1_water': return "Starorzecze";
            default: return " ";
        }
    },

    getFlavourText: function (name)
    {
        switch (name)
        {
            default: return " ";
        }
    },
}
