function GraphicManager() {
   const dataManager = new Data();

   this.setButtonPlusMinus = function (hashmap) {
       const elencoPietanze = dataManager.getElencoPietanze();

       Object.values(elencoPietanze).flat().forEach(pietanza => {
           const plusBtn = document.getElementById("plus" + pietanza.id);
           const minusBtn = document.getElementById("minus" + pietanza.id);
           const quantitaHtml = document.getElementById("quantita" + pietanza.id);

           if (plusBtn) {
               plusBtn.addEventListener("click", () => {
                   let quantita = parseInt(quantitaHtml.textContent) + 1;
                   quantitaHtml.textContent = quantita;
                   hashmap.put(pietanza.id, quantita);
                   dataManager.saveInstanceHashmap(hashmap);
               });
           }

           if (minusBtn) {
               minusBtn.addEventListener("click", () => {
                   let quantita = Math.max(parseInt(quantitaHtml.textContent) - 1, 0);
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
   };

   this.generateMenu = function (hashmap) {
       const elencoPrincipale = dataManager.getElencoPrincipale();
       const elencoPietanze = dataManager.getElencoPietanze();

       let txtLista = `<div>
           <input type='text' id='nomecliente' placeholder='Inserisci il tuo nome'/>
           <input type='text' id='tavolo' placeholder='Inserisci il numero del tavolo'/>
           <input type='number' id='coperti' placeholder='Quanti siete?'/>
       </div>`;

       elencoPrincipale.forEach(tipo => {
           txtLista += `<div data-role='collapsible'><h4>${tipo}</h4>`;
           const pietanze = elencoPietanze[tipo];

           pietanze.forEach(pietanza => {
               const quantita = hashmap.contains(pietanza.id) ? hashmap.get(pietanza.id) : 0;

               txtLista += `
               <div class="content-pietanza-ordine">
                   <div class="left nome-pietanza">${pietanza.nome}</div>
                   <div class="center prezzo-pietanza-ordine">${pietanza.prezzo.toFixed(2).replace('.', ',')}€</div>
                   <div class="right">
                       <button class="ui-btn brown-btn minus-btn" id="minus${pietanza.id}">-</button>
                       <span class="quantita-pietanza-ordine" id="quantita${pietanza.id}">${quantita}</span>
                       <button class="ui-btn brown-btn plus-btn" id="plus${pietanza.id}">+</button>
                   </div>
                   <div class="endBlock"></div>
               </div>`;
           });

           txtLista += `</div>`;
       });

       return txtLista;
   };
}
