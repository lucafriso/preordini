document.addEventListener("DOMContentLoaded", () => {
   const graphicManager = new GraphicManager();
   const dataManager = new Data();
 
   // Caricamento iniziale del menu
   loadJsonMenu(() => {
     initPagePrinc();
     initPageRes();
     initPageQrCode();
 
     // Mostra la pagina iniziale
     navigateTo("pageprinc");
   });
 
   function initPagePrinc() {
     const page = document.getElementById("pageprinc");
 
     page.addEventListener("showpage", () => {
       const lista = document.getElementById("lista");
       lista.innerHTML = graphicManager.generateMenu(dataManager.getInstanceHashmap());
       enableCollapse(lista);
       graphicManager.setButtonPlusMinus(dataManager.getInstanceHashmap());
 
       document.getElementById("resoconto-btn").onclick = (evt) => {
         evt.preventDefault();
         const hashmap = dataManager.getInstanceHashmap();
 
         if (hashmap.isEmpty()) {
           graphicManager.generatePopup("#popup-ordine", { value: false });
           document.getElementById("popup-ordine").classList.remove("hidden");
         } else {
           dataManager.saveInstanceHashmap(hashmap);
           navigateTo("pageres");
         }
       };
 
       document.getElementById("elimina-ordine-btn").onclick = (evt) => {
         evt.preventDefault();
         const dataElimina = { value: true, state: 0 };
         let hashmap = dataManager.getInstanceHashmap();
 
         if (!hashmap.isEmpty()) {
           dataElimina.state = 1;
           hashmap.makeEmpty();
           dataManager.saveInstanceHashmap(hashmap);
           hashmap = dataManager.getInstanceHashmap();
 
           const elencoPrincipale = dataManager.getElencoPrincipale();
           const elencoPietanze = dataManager.getElencoPietanze();
 
           elencoPrincipale.forEach(tipo => {
             elencoPietanze[tipo].forEach(pietanza => {
               const quantitaHtml = document.getElementById("quantita" + pietanza.id);
               const quantita = hashmap.contains(pietanza.id) ? hashmap.get(pietanza.id) : 0;
               quantitaHtml.innerHTML = quantita;
             });
           });
         }
 
         graphicManager.generatePopup("#popup-ordine", dataElimina);
         document.getElementById("popup-ordine").classList.remove("hidden");
       };
     });
   }
 
   function initPageRes() {
     const page = document.getElementById("pageres");
 
     page.addEventListener("showpage", () => {
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
 
       document.getElementById("resoconto").innerHTML =
         graphicManager.generateResoconto(hashmap, dict);
 
       document.getElementById("modifica-btn").onclick = (evt) => {
         evt.preventDefault();
         navigateTo("pageprinc");
       };
 
       document.getElementById("conferma-btn").onclick = (evt) => {
         evt.preventDefault();
         navigateTo("pageqrcode");
       };
     });
   }
 
   function initPageQrCode() {
     const page = document.getElementById("pageqrcode");
 
     page.addEventListener("showpage", () => {
       const hashmap = dataManager.getInstanceHashmap();
 
       if (hashmap.isEmpty()) {
         navigateTo("pageprinc");
         return;
       }
 
       function generateTextQRCode(hashmap) {
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
 
         return encodeURIComponent(JSON.stringify(obj));
       }
 
       document.getElementById("nuovo-ordine-btn").onclick = (evt) => {
         evt.preventDefault();
         dataManager.saveInstanceHashmap(new HashMap());
         navigateTo("pageprinc");
       };
 
       const qrcodeContainer = document.getElementById("qrcode");
       qrcodeContainer.innerHTML = "";
 
       const qrcode = new QRCode(qrcodeContainer, {
         width: 100,
         height: 100,
         useSVG: true
       });
 
       const qrCodeManager = new QRCodeManager(qrcode);
       qrCodeManager.clear();
       qrCodeManager.makeQRCode(generateTextQRCode(hashmap));
     });
   }
 
   function navigateTo(pageId) {
     const pages = document.querySelectorAll(".page");
     pages.forEach(page => page.classList.add("hidden"));
 
     const target = document.getElementById(pageId);
     if (target) {
       target.classList.remove("hidden");
       target.dispatchEvent(new Event("showpage"));
     }
   }
 
   function enableCollapse(container) {
     const collapsibles = container.querySelectorAll("[data-role='collapsible']");
     collapsibles.forEach(section => {
       const header = section.querySelector("h4");
       if (header) {
         header.style.cursor = "pointer";
         header.onclick = () => {
           section.classList.toggle("collapsed");
         };
       }
     });
   }
 });
 