//1234
var elencoPrincipale = [];
var categorie = [];
var elencoPietanze = [];

// Nuova funzione che carica i dati direttamente da menu.json
function caricaMenuDaFile() {
    $.getJSON("https://raw.githubusercontent.com/lucafriso/preordini/main/dati/menu.json", function(menu) {
        for (var categoria in menu) {
            if (menu.hasOwnProperty(categoria)) {
                elencoPrincipale.push(categoria);
                elencoPietanze[categoria] = menu[categoria];
                categorie.push({ id: categoria.toLowerCase().replace(/\s+/g, "_"), descrizione: categoria });
            }
        }
    });
}

// Carica il menu locale al posto delle chiamate REST
caricaMenuDaFile();

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

        var hashmap = $.cookie(riferimentoHashMap);
        if(typeof hashmap !== 'undefined' && hashmap !== null){  //esiste
            return recreateHashmap(JSON.parse(hashmap).value);
        } else {
            hashmap = new HashMap();
            this.saveInstanceHashmap(hashmap);
            return hashmap;
        }
    }

    this.saveInstanceHashmap = function(hashmap){
        $.cookie(
            riferimentoHashMap,
            JSON.stringify(hashmap)
        );
    }

    this.getInstanceCoperti = function(){
        var coperti = $.cookie(riferimentoCoperti);
        if(typeof coperti !== 'undefined' && coperti !== null){
            return parseInt(coperti);
        } else {
            return 1;
        }
    }

    this.saveInstanceCoperti = function(coperti){
        $.cookie(
            riferimentoCoperti,
            coperti
        );
    }

    // rootURL rimosso: non serve più
}
