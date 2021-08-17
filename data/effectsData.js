let plus5 =
{
    "type": "value_change",
    "value": 5,
    "target": "player_card",
    "activation": "next_turn",
    "start_condition": "",
    "end_condition": "one_use"
};

let minus5 =
{
    "type": "value_change",
    "value": -5,
    "target": "enemy_card",
    "activation": "next_turn",
    "start_condition": "",
    "end_condition": "one_use"
};

let replace1 =
{
    "type": "card_replace",
    "value": 1,
    "target": "player",
    "activation": "after_turn",
    "start_condition": "",
    "end_condition": "one_use"
};

let weaker_element =
{
    "type": "weaker_element",
    "value": 0,
    "target": "",
    "activation": "next_turn",
    "start_condition": "",
    "end_condition": "one_use"
};

let lower_value =
{
    "type": "lower_value",
    "value": 0,
    "target": "",
    "activation": "next_turn",
    "start_condition": "",
    "end_condition": "one_use"
};

let only_elements =
{
    "type": "only_elements",
    "value": 0,
    "target": "",
    "activation": "next_turn",
    "start_condition": "",
    "end_condition": "one_use"
};

let only_values =
{
    "type": "only_values",
    "value": 0,
    "target": "",
    "activation": "next_turn",
    "start_condition": "",
    "end_condition": "one_use"
};
