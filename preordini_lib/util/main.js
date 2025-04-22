document.addEventListener("DOMContentLoaded", () => {
  const dataManager = new Data();
  const graphicManager = new GraphicManager();

  // Navigazione semplice tra pagine
  function navigateTo(pageId) {
     document.querySelectorAll("[data-role='page']").forEach(p => p.style.display = 'none');
     document.getElementById(pageId).style.display = 'block';
  }

  // Mostra popup semplice
  function showPopup(message) {
     const title = document.getElementById("title-popup");
     const content = document.getElementById("info-ordine-popup");
     title.textContent = "Attenzione";
     content.innerHTML = `<p>${message}</p>`;
     document.getElementById("popup-ordine").style.display = 'block';
     setTimeout(() => {
        document.getElementById("popup-ordine").style.display = 'none';
     }, 3000);
  }

  // Caricamento iniziale
  dataManager.loadJsonMenu().then(() => {
     navigateTo("pageprinc");
     renderMenuPage();
  }).catch(error => {
     console.error("Errore nel caricamento del menu:", error);
  });

  // Gestione pagina menu
  function renderMenuPage() {
     const lista = document.getElementById("lista");
     lista.innerHTML = graphicManager.generateMenu(dataManager.getInstanceHashmap());
     graphicManager.setButtonPlusMinus(dataManager.getInstanceHashmap());

     document.getElementById("resoconto-btn").addEventListener("click", () => {
        const hashmap = dataManager.getInstanceHashmap();
        if (hashmap.isEmpty()) {
           showPopup("Il tuo ordine è vuoto. Seleziona almeno una pietanza.");
        } else {
           dataManager.saveInstanceHashmap(hashmap);
           renderResocontoPage();
           navigateTo("pageres");
        }
     });

     document.getElementById("elimina-ordine-btn").addEventListener("click", () => {
        const hashmap = dataManager.getInstanceHashmap();
        if (!hashmap.isEmpty()) {
           hashmap.makeEmpty();
           dataManager.saveInstanceHashmap(hashmap);
           renderMenuPage();
        }
        showPopup("Ordine eliminato.");
     });
  }

  // Gestione pagina resoconto
  function renderResocontoPage() {
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

     document.getElementById("modifica-btn").addEventListener("click", () => {
        navigateTo("pageprinc");
     });

     document.getElementById("conferma-btn").addEventListener("click", () => {
        renderQRCodePage();
        navigateTo("pageqrcode");
     });
  }

  // Gestione pagina QRCode
  function renderQRCodePage() {
     const hashmap = dataManager.getInstanceHashmap();
     const nomecliente = document.getElementById("nomecliente").value;
     const numerotavolo = document.getElementById("tavolo").value;
     const numerocoperti = document.getElementById("coperti").value;

     const obj = {
        numeroTavolo: numerotavolo,
        cliente: nomecliente,
        coperti: numerocoperti,
        righe: hashmap.keys().map(id => ({
           id: parseInt(id),
           qta: hashmap.get(id)
        }))
     };

     const encoded = encodeURIComponent(JSON.stringify(obj));
     const qrContainer = document.getElementById("qrcode");
     qrContainer.innerHTML = "";
     const qrcode = new QRCode(qrContainer, {
        width: 100,
        height: 100,
        useSVG: true
     });

     const qrCodeManager = new QRCodeManager(qrcode);
     qrCodeManager.clear();
     qrCodeManager.makeQRCode(encoded);

     document.getElementById("nuovo-ordine-btn").addEventListener("click", () => {
        dataManager.saveInstanceHashmap(new HashMap());
        renderMenuPage();
        navigateTo("pageprinc");
     });
  }
});
