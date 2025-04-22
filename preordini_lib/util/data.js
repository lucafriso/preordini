var elencoPrincipale = [];
var categorie = [];
var elencoPietanze = {};

function caricaMenuDaFile() {
    return fetch("https://raw.githubusercontent.com/lucafriso/preordini/main/dati/menu.json")
        .then(response => response.json())
        .then(menu => {
            elencoPrincipale = [];
            categorie = [];
            elencoPietanze = {};

            menu.forEach(item => {
                if (!elencoPietanze[item.categoria]) {
                    elencoPietanze[item.categoria] = [];
                    elencoPrincipale.push(item.categoria);
                    categorie.push({
                        id: item.categoria.toLowerCase().replace(/\s+/g, "_"),
                        descrizione: item.categoria
                    });
                }

                const id = `${item.categoria}_${item.piatto}`.replace(/\s+/g, "_");
                elencoPietanze[item.categoria].push({
                    id: id,
                    nome: item.piatto,
                    prezzo: item.prezzo
                });
            });
        })
        .catch(error => console.error("Errore nel caricamento del menu:", error));
}

function Data() {
    var riferimentoHashMap = "_hashmap";
    var riferimentoCoperti = "_coperti";

    this.getElencoPrincipale = () => elencoPrincipale;
    this.getElencoPietanze = () => elencoPietanze;

    this.getInstanceHashmap = function () {
        function recreateHashmap(value) {
            const hashmap = new HashMap();
            for (let i = 0; i < value.length; i++) {
               const key = value[i].key;
               const val = value[i].val;
               if (key != null && val != null) {
                  hashmap.put(key, val);
               }
            }
            return hashmap;
         }
         

        var hashmap = localStorage.getItem(riferimentoHashMap);
        if (hashmap) {
            return recreateHashmap(JSON.parse(hashmap).value);
        } else {
            hashmap = new HashMap();
            this.saveInstanceHashmap(hashmap);
            return hashmap;
        }
    };

    this.saveInstanceHashmap = function (hashmap) {
        localStorage.setItem(
            riferimentoHashMap,
            JSON.stringify(hashmap)
        );
    };

    this.getInstanceCoperti = function () {
        var coperti = localStorage.getItem(riferimentoCoperti);
        return coperti ? parseInt(coperti) : 1;
    };

    this.saveInstanceCoperti = function (coperti) {
        localStorage.setItem(riferimentoCoperti, coperti);
    };
}
