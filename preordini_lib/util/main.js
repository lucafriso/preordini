document.addEventListener("DOMContentLoaded", () => {
  const graphicManager = new GraphicManager();
  const dataManager = new Data();

  caricaMenuDaFile()
     .then(() => {
        navigateTo("pageprinc");

        document.getElementById("resoconto-btn").addEventListener("click", (e) => {
           e.preventDefault();
           const hashmap = dataManager.getInstanceHashmap();
           if (hashmap.isEmpty()) {
              graphicManager.generatePopup("popup-ordine", { value: false });
              openPopup("popup-ordine");
           } else {
              dataManager.saveInstanceHashmap(hashmap);
              navigateTo("pageres");
           }
        });

        document.getElementById("elimina-ordine-btn").addEventListener("click", (e) => {
           e.preventDefault();
           const dataElimina = { value: true, state: 0 };
           let hashmap = dataManager.getInstanceHashmap();

           if (!hashmap.isEmpty()) {
              dataElimina.state = 1;
              hashmap.makeEmpty();
              dataManager.saveInstanceHashmap(hashmap);
              hashmap = dataManager.getInstanceHashmap();

              const elencoPrincipale = dataManager.getElencoPrincipale();
              const elencoPietanze = dataManager.getElencoPietanze();

              elencoPrincipale.forEach(categoria => {
                 const pietanze = elencoPietanze[categoria] || [];
                 pietanze.forEach(pietanza => {
                    const id = pietanza.id;
                    const quantita = hashmap.contains(id) ? hashmap.get(id) : 0;
                    const quantitaHtml = document.getElementById("quantita" + id);
                    if (quantitaHtml) quantitaHtml.textContent = quantita;
                 });
              });
           }

           graphicManager.generatePopup("popup-ordine", dataElimina);
           openPopup("popup-ordine");
        });

        document.getElementById("modifica-btn").addEventListener("click", (e) => {
           e.preventDefault();
           navigateTo("pageprinc");
        });

        document.getElementById("conferma-btn").addEventListener("click", (e) => {
           e.preventDefault();
           navigateTo("pageqrcode");
        });

        document.getElementById("nuovo-ordine-btn").addEventListener("click", (e) => {
           e.preventDefault();
           dataManager.saveInstanceHashmap(new HashMap());
           navigateTo("pageprinc");
        });

     })
     .catch(error => {
        console.error("Errore nel caricamento del menu:", error);
     });
});

// Funzione per gestire la visualizzazione delle pagine
function navigateTo(id) {
  const pages = document.querySelectorAll("[data-role='page']");
  pages.forEach(page => page.style.display = "none");
  document.getElementById(id).style.display = "block";

  const graphicManager = new GraphicManager();
  const dataManager = new Data();

  if (id === "pageprinc") {
     const lista = document.getElementById("lista");
     lista.innerHTML = graphicManager.generateMenu(dataManager.getInstanceHashmap());
     graphicManager.setButtonPlusMinus(dataManager.getInstanceHashmap());
  }

  if (id === "pageres") {
     const hashmap = dataManager.getInstanceHashmap();
     if (hashmap.isEmpty()) {
        navigateTo("pageprinc");
        return;
     }

     const dict = {
        nomecliente: document.getElementById("nomecliente").value,
        coperti: document.getElementById("coperti").value,
        tavolo: document.getElementById("tavolo").value
     };

     document.getElementById("resoconto").innerHTML = graphicManager.generateResoconto(hashmap, dict);
  }

  if (id === "pageqrcode") {
     const hashmap = dataManager.getInstanceHashmap();
     if (hashmap.isEmpty()) {
        navigateTo("pageprinc");
        return;
     }

     const nomecliente = document.getElementById("nomecliente").value;
     const numerotavolo = document.getElementById("tavolo").value;
     const numerocoperti = document.getElementById("coperti").value;

     const obj = {
        numeroTavolo: numerotavolo,
        cliente: nomecliente,
        coperti: numerocoperti,
        righe: hashmap.keys().map(id => ({ id: parseInt(id), qta: hashmap.get(id) }))
     };

     const encoded = encodeURIComponent(JSON.stringify(obj));

     const qrcode = new QRCode(document.getElementById("qrcode"), {
        width: 100,
        height: 100,
        useSVG: true
     });

     const qrCodeManager = new QRCodeManager(qrcode);
     qrCodeManager.clear();
     qrCodeManager.makeQRCode(encoded);
  }
}

// Per gestire la visualizzazione dei popup in modo compatibile
function openPopup(id) {
  const el = document.getElementById(id);
  if (el) {
     el.style.display = "block";
     setTimeout(() => {
        el.style.display = "none";
     }, 3000);
  }
}
