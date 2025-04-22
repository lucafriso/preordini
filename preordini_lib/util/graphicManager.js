// graphicManager.js
function GraphicManager() {
   const dataManager = new Data();
 
   this.setButtonPlusMinus = function (hashmap) {
     const elencoPrincipale = dataManager.getElencoPrincipale();
     const elencoPietanze = dataManager.getElencoPietanze();
 
     elencoPrincipale.forEach(tipo => {
       const pietanze = elencoPietanze[tipo] || [];
       pietanze.forEach(pietanza => {
         const plusBtn = document.getElementById("plus" + pietanza.id);
         const minusBtn = document.getElementById("minus" + pietanza.id);
         const quantitaHtml = document.getElementById("quantita" + pietanza.id);
 
         if (plusBtn && quantitaHtml) {
           plusBtn.addEventListener("click", () => {
             const quantita = parseInt(quantitaHtml.textContent) + 1;
             quantitaHtml.textContent = quantita;
             hashmap.put(pietanza.id, quantita);
             dataManager.saveInstanceHashmap(hashmap);
           });
         }
 
         if (minusBtn && quantitaHtml) {
           minusBtn.addEventListener("click", () => {
             let quantita = parseInt(quantitaHtml.textContent) - 1;
             quantita = Math.max(0, quantita);
             quantitaHtml.textContent = quantita;
             if (quantita > 0) {
               hashmap.put(pietanza.id, quantita);
             } else {
               hashmap.remove(pietanza.id);
             }
             dataManager.saveInstanceHashmap(hashmap);
           });
         }
       });
     });
   };
 
   this.generateMenu = function (hashmap) {
     const elencoPrincipale = dataManager.getElencoPrincipale();
     const elencoPietanze = dataManager.getElencoPietanze();
 
     let html = `
       <input type='text' id='nomecliente' placeholder='Inserisci il tuo nome'/>
       <input type='text' id='tavolo' placeholder='Inserisci il numero del tavolo'/>
       <input type='text' id='coperti' placeholder='Quanti siete?' />
     `;
 
     elencoPrincipale.forEach(tipo => {
       html += `<h3>${tipo}</h3>`;
       const pietanze = elencoPietanze[tipo] || [];
       pietanze.forEach(p => {
         const quantita = hashmap.contains(p.id) ? hashmap.get(p.id) : 0;
         html += `
           <div class="content-pietanza-ordine">
             <div class="left nome-pietanza">${p.nome}</div>
             <div class="center prezzo-pietanza-ordine">${setTextPrezzo(p.prezzo)}</div>
             <div class="right">
               <button class="ui-btn brown-btn minus-btn" id="minus${p.id}">-</button>
               <span id="quantita${p.id}">${quantita}</span>
               <button class="ui-btn brown-btn plus-btn" id="plus${p.id}">+</button>
             </div>
             <div class="endBlock"></div>
           </div>
         `;
       });
     });
 
     return html;
   };
 
   function setTextPrezzo(prezzo) {
     return Number.isInteger(prezzo)
       ? `${prezzo},00 Euro`
       : `${prezzo.toFixed(2).replace(".", ",")} Euro`;
   }
 }