var debugConfig = {
	"allow_debug": false, //Ustawienie tego na 'false' wyłączy wszystkie inne opcje debugowe
	"dev_server": false, //Zamiast pytać o nazwę serwera łączy od razu z 'dev'.
	"random_server": false, //Zamiast pytać o nazwę serwera wybiera losową
	"custom_server": true, //Zamiast pytać o nazwę serwera używa tej ustawionej w 'custom_server_name'
	"custom_server_name": "Change me", //Nazwa serwera do powyższej opcji.
	"random_username": true, //Zamiast pytać o nazwę użytkownika używa losowej
	"disable_messages": false, //Wyłącza wszystkie wiadomości sieciowe
	"log_messages": true, //Wypisuje wszystkie wiadomości sieciowe w konsoli
}

//Handle complete debug disabling
if (!debugConfig.allow_debug) {
	Object.entries(debugConfig).forEach(entry => debugConfig[entry[0]] = false);
}

