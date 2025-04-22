document.addEventListener("DOMContentLoaded", async () => {
  const graphicManager = new GraphicManager();
  const dataManager = new Data();

  try {
     await dataManager.loadJsonMenu();
     navigateTo("pageprinc");
  } catch (error) {
     console.error("Errore nel caricamento del menu:", error);
  }

  function navigateTo(pageId) {
     if (pageId === "pageprinc") {
        const lista = document.getElementById("lista");
        lista.innerHTML = graphicManager.generateMenu(dataManager.getInstanceHashmap());
        graphicManager.setButtonPlusMinus(dataManager.getInstanceHashmap());
     }

     if (pageId === "pageresoconto") {
        const hashmap = dataManager.getInstanceHashmap();

        if (hashmap.isEmpty()) {
           graphicManager.generatePopup("popup-ordine", { value: false });
           return;
        }

        const dict = {
           nomecliente: document.getElementById("nomecliente").value,
           coperti: document.getElementById("coperti").value,
           tavolo: document.getElementById("tavolo").value
        };

        const resocontoHtml = graphicManager.generateResoconto(hashmap, dict);
        document.getElementById("contenuto-resoconto").innerHTML = resocontoHtml;

        document.getElementById("modifica-btn").onclick = () => navigateTo("pageprinc");
        document.getElementById("conferma-btn").onclick = () => navigateTo("pageqrcode");
     }

     if (pageId === "pageqrcode") {
        const hashmap = dataManager.getInstanceHashmap();

        if (hashmap.isEmpty()) {
           navigateTo("pageprinc");
           return;
        }

        const obj = {
           numeroTavolo: document.getElementById("tavolo").value,
           cliente: document.getElementById("nomecliente").value,
           coperti: document.getElementById("coperti").value,
           righe: hashmap.keys().map(id => ({
              id: parseInt(id),
              qta: hashmap.get(id)
           }))
        };

        const qrcodeElement = document.getElementById("qrcode");
        qrcodeElement.innerHTML = "";
        const qrcode = new QRCode(qrcodeElement, {
           width: 100,
           height: 100,
           useSVG: true
        });

        const qrCodeManager = new QRCodeManager(qrcode);
        qrCodeManager.clear();
        qrCodeManager.makeQRCode(encodeURIComponent(JSON.stringify(obj)));

        document.getElementById("nuovo-ordine-btn").onclick = () => {
           dataManager.saveInstanceHashmap(new HashMap());
           navigateTo("pageprinc");
        };
     }

     $(`.ui-page-active`).removeClass("ui-page-active");
     $(`#${pageId}`).addClass("ui-page-active").show();
  }

  // Bottone Vedi Resoconto
  document.addEventListener("click", event => {
     if (event.target && event.target.id === "resoconto-btn") {
        navigateTo("pageresoconto");
     }
  });

  // Bottone Elimina Ordine
  document.addEventListener("click", event => {
     if (event.target && event.target.id === "elimina-ordine-btn") {
        const hashmap = dataManager.getInstanceHashmap();
        if (!hashmap.isEmpty()) {
           hashmap.makeEmpty();
           dataManager.saveInstanceHashmap(hashmap);

           const elencoPrincipale = dataManager.getElencoPrincipale();
           const elencoPietanze = dataManager.getElencoPietanze();

           for (const tipo of elencoPrincipale) {
              const pietanze = elencoPietanze[tipo];
              for (const p of pietanze) {
                 const quantitaEl = document.getElementById("quantita" + p.id);
                 if (quantitaEl) quantitaEl.textContent = "0";
              }
           }
        }

        graphicManager.generatePopup("popup-ordine", { value: true, state: 1 });
        document.getElementById("popup-ordine").style.display = "block";
     }
  });
});
