let DeckUtils = {
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

    assembleDeck: function (names) {
        let newDeck = this.getCardsFromNames(this.transformRandToElements(names));
        Phaser.Actions.Shuffle(newDeck);
        return newDeck;
    },

    transformRandToElements: function (names) {
        let namesCopy = [...names];
        Phaser.Actions.Shuffle(namesCopy);
        let ret = [];
        let randomElement = Math.floor((Math.random() * 3)) + 1;    //jeżeli będzie potrzebne losowanie żywiołów, losowanie początku pętli
        for (let i = 0; i < namesCopy.length; i++) {
            if (namesCopy[i].indexOf("_rand") !== -1) {
                randomElement++;
                if (randomElement > 3)
                    randomElement -= 3;
                namesCopy[i] = namesCopy[i].slice(0, namesCopy[i].indexOf("_rand"));
                switch (randomElement) {
                    case ELEMENT.FIRE: namesCopy[i] += "_fire"; break;
                    case ELEMENT.FOREST: namesCopy[i] += "_forest"; break;
                    case ELEMENT.WATER: namesCopy[i] += "_water"; break;
                }
            }
            ret.push(namesCopy[i]);
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
        if (Array.isArray(newCard.displayName) || Array.isArray(newCard.flavour) || Array.isArray(newCard.value) || newCard.multipleImages) {
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
            if (Array.isArray(newCard.value)) newCard.value = newCard.value[newCard.element - 1];
        }
        return newCard;
    },

    //Zwraca listę obrazków na kartach w talii (lub taliach), usuwając duplikaty
    getImages: function (deck, deck2 = []) {
        let res = [];
        let combined = deck.concat(deck2);
        if (typeof combined[0] === "string")
            combined = this.assembleDeck(combined);
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
};

//Przechowuje istniejące w grze talie. Wersje tych pól bez '_' są generowane dynamicznie; to ich powinno się używać by te talie otrzymać. 
//Aby potem otrzymać z tych talii listę kart, użyj DeckUtils.getCardsFromNames
let DeckBank = {
    _classicDeck: DeckUtils.getBasicDeck(1, 6).concat(["plus5_rand", "replace1_rand", "minus5_rand"]),
    _secondDeck: ["synta_all", "lower_rand", "weaker_rand", "remove1_rand", "empty_set_all", "kontrola_czystosci", "goraca_woda", "divB_fire",
        "basic3_fire", "basic3_forest", "basic8_fire", "basic8_water", "basic1_forest", "basic1_water", "basic7_all"],
    _testDeck: DeckUtils.getBasicDeck(1, 2).concat(["gumowa_kaczuszka"]), //["weaker_all", "lower_all", "only_elements_all", "only_values_all"];

};

for (let i in DeckBank) Object.defineProperty(DeckBank, i.slice(1), { get: function () { return DeckUtils.transformRandToElements(DeckBank[i]) } });