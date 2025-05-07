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
      // Nasconde tutte le pagine
      document.querySelectorAll(".ui-page").forEach(p => {
         p.classList.remove("ui-page-active");
         p.style.display = "none";
      });

      // Mostra solo quella selezionata
      const targetPage = document.getElementById(pageId);
      targetPage.classList.add("ui-page-active");
      targetPage.style.display = "block";

      if (pageId === "pageprinc") {
         const lista = document.getElementById("lista");
         lista.innerHTML = graphicManager.generateMenu(dataManager.getInstanceHashmap());
         graphicManager.setButtonPlusMinus(dataManager.getInstanceHashmap());
      }

      if (pageId === "pageresoconto") {
         const hashmap = dataManager.getInstanceHashmap();
         if (hashmap.isEmpty()) {
            graphicManager.generatePopup("Nessuna pietanza selezionata");
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
           // Pulisce i residui del resoconto
           document.getElementById("contenuto-resoconto").innerHTML = "";

           document.getElementById("modifica-btn").style.display = "none";
           document.getElementById("conferma-btn").style.display = "none";


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

   }

   // Bottone Vedi Resoconto
   document.getElementById("resoconto-btn").addEventListener("click", () => {
      navigateTo("pageresoconto");
   });

   // Bottone Elimina Ordine
   document.getElementById("elimina-ordine-btn").addEventListener("click", () => {
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

      graphicManager.generatePopup("Ordine eliminato");
   });

   // Gestione apertura/chiusura accordion
   document.addEventListener("click", function (e) {
      if (e.target.classList.contains("accordion-toggle")) {
         const content = e.target.nextElementSibling;
         content.style.display = content.style.display === "block" ? "none" : "block";
      }
   });
});
