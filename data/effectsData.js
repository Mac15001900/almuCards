let plus5 =
{
    "type": "value_change",
    "value": 5,
    "target": "player_card",
    "start_condition": "next_turn",
    "end_condition": "one_use"
};

let minus5 =
{
    "type": "value_change",
    "value": -5,
    "target": "enemy_card",
    "start_condition": "next_turn",
    "end_condition": "one_use"
};

let replace1 =
{
    "type": "card_replace",
    "value": 1,
    "target": "player",
    "start_condition": "after_turn",
    "end_condition": "one_use"
};
