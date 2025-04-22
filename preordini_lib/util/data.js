var elencoPrincipale = [];
var elencoPietanze = {};

function Data() {
    const riferimentoHashMap = "_hashmap";
    const riferimentoCoperti = "_coperti";

    this.getElencoPrincipale = () => elencoPrincipale;
    this.getElencoPietanze = () => elencoPietanze;

    this.loadJsonMenu = async function () {
        try {
            const response = await fetch("https://lucafriso.github.io/preordini/dati/menu.json");
            const menu = await response.json();

            menu.forEach((item, index) => {
                const categoria = item.categoria;
                if (!elencoPrincipale.includes(categoria)) {
                    elencoPrincipale.push(categoria);
                    elencoPietanze[categoria] = [];
                }
                elencoPietanze[categoria].push({
                    id: index,
                    nome: item.piatto,
                    prezzo: item.prezzo,
                    posizione: index
                });
            });
        } catch (error) {
            console.error("Errore nel caricamento del menu:", error);
        }
    };

    function recreateHashmap(value) {
        const hashmap = new HashMap();
        value.forEach(entry => {
            if (entry.key != null && entry.val != null) {
                hashmap.put(entry.key, entry.val);
            }
        });
        return hashmap;
    }

    this.getInstanceHashmap = function () {
        const hashmap = localStorage.getItem(riferimentoHashMap);
        if (hashmap) {
            return recreateHashmap(JSON.parse(hashmap).value);
        } else {
            const h = new HashMap();
            this.saveInstanceHashmap(h);
            return h;
        }
    };

    this.saveInstanceHashmap = function (hashmap) {
        localStorage.setItem(riferimentoHashMap, JSON.stringify(hashmap));
    };

    this.getInstanceCoperti = function () {
        return parseInt(localStorage.getItem(riferimentoCoperti)) || 1;
    };

    this.saveInstanceCoperti = function (coperti) {
        localStorage.setItem(riferimentoCoperti, coperti);
    };
}
