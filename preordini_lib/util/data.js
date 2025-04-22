//1234
var elencoPrincipale = [];
var categorie = [];
var elencoPietanze = [];

// Nuova funzione che carica i dati direttamente da menu.json
function caricaMenuDaFile(callback) {
    fetch("https://raw.githubusercontent.com/lucafriso/preordini/main/dati/menu.json")
        .then(response => response.json())
        .then(menu => {
            for (var categoria in menu) {
                if (menu.hasOwnProperty(categoria)) {
                    elencoPrincipale.push(categoria);
                    elencoPietanze[categoria] = menu[categoria];
                    categorie.push({ id: categoria.toLowerCase().replace(/\s+/g, "_"), descrizione: categoria });
                }
            }
            if (callback) callback();
        });
}



// Carica il menu locale al posto delle chiamate REST
caricaMenuDaFile();

// Gestione cookie con Vanilla JS
function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (let i = 0; i < cookies.length; i++) {
        const [cookieName, cookieVal] = cookies[i].split("=");
        if (cookieName === name) {
            return decodeURIComponent(cookieVal);
        }
    }
    return null;
}

function setCookie(name, value, days = 365) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = name + "=" + encodeURIComponent(value) + "; expires=" + expires + "; path=/";
}

function Data(){
    var riferimentoHashMap = "_hashmap"; 
    var riferimentoCoperti = "_coperti";

    this.getInstanceHashmap = function(){
        function recreateHashmap(value){
            var hashmap = new HashMap();
            for(var i = 0; i < value.length; i++){
                hashmap.put(value[i].key, value[i].val);
            }
            return hashmap;
        }

        var hashmap = getCookie(riferimentoHashMap);
        if(typeof hashmap !== 'undefined' && hashmap !== null){  //esiste
            return recreateHashmap(JSON.parse(hashmap).value);
        } else {
            hashmap = new HashMap();
            this.saveInstanceHashmap(hashmap);
            return hashmap;
        }
    }

    this.saveInstanceHashmap = function(hashmap){
        setCookie(
            riferimentoHashMap,
            JSON.stringify(hashmap)
        );
    }

    this.getInstanceCoperti = function(){
        var coperti = getCookie(riferimentoCoperti);
        if(typeof coperti !== 'undefined' && coperti !== null){
            return parseInt(coperti);
        } else {
            return 1;
        }
    }

    this.saveInstanceCoperti = function(coperti){
        setCookie(
            riferimentoCoperti,
            coperti
        );
    }

    this.getElencoPrincipale = function() {
        return elencoPrincipale;
    }

    this.getElencoPietanze = function() {
        return elencoPietanze;
    }
}
