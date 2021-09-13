let cardsLogic = {
    getWinner: function (cardPlayer, cardEnemy, currentEffects)
    {
        effectsTable = EffectBank.getInturnEffectsTable(cardPlayer, cardEnemy, currentEffects);    //translate effects to simple table
        //elements check
        if (!effectsTable.onlyValues)
        {
            if (cardPlayer.element === ELEMENT.WATER && cardEnemy.element === ELEMENT.FIRE || cardPlayer.element === ELEMENT.FIRE && cardEnemy.element === ELEMENT.FOREST || cardPlayer.element === ELEMENT.FOREST && cardEnemy.element === ELEMENT.WATER)
                return 1 * effectsTable.reverseElements;
            if (cardPlayer.element === ELEMENT.WATER && cardEnemy.element === ELEMENT.FOREST || cardPlayer.element === ELEMENT.FIRE && cardEnemy.element === ELEMENT.WATER || cardPlayer.element === ELEMENT.FOREST && cardEnemy.element === ELEMENT.FIRE)
                return -1 * effectsTable.reverseElements;
        }
        //value check
        if (!effectsTable.onlyElements)
        {
            if ((cardPlayer.value + effectsTable.playerAdd) * effectsTable.playerProduct > (cardEnemy.value + effectsTable.enemyAdd) * effectsTable.enemyProduct)
                return 1 * effectsTable.reverseValues;
            if ((cardPlayer.value + effectsTable.playerAdd) * effectsTable.playerProduct < (cardEnemy.value + effectsTable.enemyAdd) * effectsTable.enemyProduct)
                return -1 * effectsTable.reverseValues;
        }
        return 0;
    },
};
