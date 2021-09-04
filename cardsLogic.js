let cardsLogic = {
    getWinner: function (cardPlayer, cardEnemy, currentEffects)
    {
        effectsTable = EffectBank.getInturnEffectsTable(cardPlayer, cardEnemy, currentEffects);    //translate effects to simple table
        //elements check
        if (!effectsTable[6])
        {
            if (cardPlayer.element === ELEMENT.WATER && cardEnemy.element === ELEMENT.FIRE || cardPlayer.element === ELEMENT.FIRE && cardEnemy.element === ELEMENT.FOREST || cardPlayer.element === ELEMENT.FOREST && cardEnemy.element === ELEMENT.WATER)
                return 1 * effectsTable[4];
            if (cardPlayer.element === ELEMENT.WATER && cardEnemy.element === ELEMENT.FOREST || cardPlayer.element === ELEMENT.FIRE && cardEnemy.element === ELEMENT.WATER || cardPlayer.element === ELEMENT.FOREST && cardEnemy.element === ELEMENT.FIRE)
                return -1 * effectsTable[4];
        }
        //value check
        if (!effectsTable[7])
        {
            if ((cardPlayer.value + effectsTable[0]) * effectsTable[2] > (cardEnemy.value + effectsTable[1]) * effectsTable[3])
                return 1 * effectsTable[5];
            if ((cardPlayer.value + effectsTable[0]) * effectsTable[2] < (cardEnemy.value + effectsTable[1]) * effectsTable[3])
                return -1 * effectsTable[5];
        }
        return 0;
    },
};
