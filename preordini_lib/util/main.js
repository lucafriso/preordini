document.addEventListener("DOMContentLoaded", function () {
  const graphicManager = new GraphicManager();
  const dataManager = new Data();

  caricaMenuDaFile(function () {
     navigateTo("pageprinc");

     document.getElementById("resoconto-btn").addEventListener("click", function (evt) {
        evt.preventDefault();
        const hashmap = dataManager.getInstanceHashmap();
        if (hashmap.isEmpty()) {
           graphicManager.generatePopup("popup-ordine", { value: false });
           document.getElementById("popup-ordine").style.display = "block";
        } else {
           dataManager.saveInstanceHashmap(hashmap);
           navigateTo("pageres");
        }
     });

     document.getElementById("elimina-ordine-btn").addEventListener("click", function (evt) {
        evt.preventDefault();
        const hashmap = dataManager.getInstanceHashmap();
        const dataElimina = { value: true, state: 0 };

        if (!hashmap.isEmpty()) {
           dataElimina.state = 1;
           hashmap.makeEmpty();
           dataManager.saveInstanceHashmap(hashmap);
           const elencoPrincipale = dataManager.getElencoPrincipale();
           const elencoPietanze = dataManager.getElencoPietanze();
           elencoPrincipale.forEach(tipo => {
              const pietanze = elencoPietanze[tipo];
              if (Array.isArray(pietanze)) {
                 pietanze.forEach(pietanza => {
                    const span = document.getElementById("quantita" + pietanza.id);
                    if (span) span.textContent = "0";
                 });
              }
           });
        }

        graphicManager.generatePopup("popup-ordine", dataElimina);
        document.getElementById("popup-ordine").style.display = "block";
     });
  });

  function navigateTo(pageId) {
     document.querySelectorAll("[data-role='page']").forEach(page => {
        page.style.display = "none";
     });
     document.getElementById(pageId).style.display = "block";

     if (pageId === "pageprinc") {
        const listaDiv = document.getElementById("lista");
        listaDiv.innerHTML = graphicManager.generateMenu(dataManager.getInstanceHashmap());
        graphicManager.setButtonPlusMinus(dataManager.getInstanceHashmap());
     }

     if (pageId === "pageres") {
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

        document.getElementById("modifica-btn").addEventListener("click", function () {
           navigateTo("pageprinc");
        });

        document.getElementById("conferma-btn").addEventListener("click", function () {
           navigateTo("pageqrcode");
        });
     }

     if (pageId === "pageqrcode") {
        const hashmap = dataManager.getInstanceHashmap();
        if (hashmap.isEmpty()) {
           navigateTo("pageprinc");
           return;
        }

        const qrCodeText = generateTextQRCode(hashmap);
        const qrcode = new QRCode(document.getElementById("qrcode"), {
           width: 100,
           height: 100,
           useSVG: true
        });

        const qrCodeManager = new QRCodeManager(qrcode);
        qrCodeManager.clear();
        qrCodeManager.makeQRCode(qrCodeText);

        document.getElementById("nuovo-ordine-btn").addEventListener("click", function () {
           dataManager.saveInstanceHashmap(new HashMap());
           navigateTo("pageprinc");
        });
     }
  }

  function generateTextQRCode(hashmap) {
     const nomecliente = document.getElementById("nomecliente").value;
     const numerotavolo = document.getElementById("tavolo").value;
     const numerocoperti = document.getElementById("coperti").value;

     const obj = {
        numeroTavolo: numerotavolo,
        cliente: nomecliente,
        coperti: numerocoperti,
        righe: []
     };

     const keys = hashmap.keys();
     keys.forEach(id => {
        obj.righe.push({ id: parseInt(id), qta: hashmap.get(id) });
     });

     return encodeURIComponent(JSON.stringify(obj));
  }
});
