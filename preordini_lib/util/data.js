// data.js

let elencoPrincipale = [];
let elencoPietanze = [];
let categorie = [];

function caricaMenuDaFile() {
  return fetch("https://raw.githubusercontent.com/lucafriso/preordini/main/dati/menu.json")
    .then(response => response.json())
    .then(menu => {
      for (const categoria in menu) {
        if (menu.hasOwnProperty(categoria)) {
          elencoPrincipale.push(categoria);
          elencoPietanze[categoria] = menu[categoria];
          categorie.push({
            id: categoria.toLowerCase().replace(/\s+/g, "_"),
            descrizione: categoria
          });
        }
      }
    })
    .catch(error => {
      console.error("Errore nel caricamento del menu:", error);
    });
}

function Data() {
  const riferimentoHashMap = "preordini_hashmap";
  const riferimentoCoperti = "preordini_coperti";

  this.getElencoPrincipale = function () {
    return elencoPrincipale;
  };

  this.getElencoPietanze = function () {
    return elencoPietanze;
  };

  this.getInstanceHashmap = function () {
    const raw = localStorage.getItem(riferimentoHashMap);
    if (raw) {
      const parsed = JSON.parse(raw);
      const hashmap = new HashMap();
      parsed.value.forEach(e => hashmap.put(e.key, e.val));
      return hashmap;
    } else {
      const newMap = new HashMap();
      this.saveInstanceHashmap(newMap);
      return newMap;
    }
  };

  this.saveInstanceHashmap = function (hashmap) {
    localStorage.setItem(riferimentoHashMap, JSON.stringify(hashmap));
  };

  this.getInstanceCoperti = function () {
    const coperti = localStorage.getItem(riferimentoCoperti);
    return coperti ? parseInt(coperti) : 1;
  };

  this.saveInstanceCoperti = function (coperti) {
    localStorage.setItem(riferimentoCoperti, coperti);
  };
}
