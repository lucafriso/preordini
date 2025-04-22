function GraphicManager() {
   const dataManager = new Data();

   this.setButtonPlusMinus = function (hashmap) {
      document.querySelectorAll(".plus-btn").forEach(button => {
         button.addEventListener("click", () => {
            const id = button.dataset.id;
            const quantitaElem = document.getElementById("quantita" + id);
            let quantita = parseInt(quantitaElem.textContent) + 1;
            quantitaElem.textContent = quantita;
            hashmap.put(id, quantita);
            dataManager.saveInstanceHashmap(hashmap);
         });
      });

      document.querySelectorAll(".minus-btn").forEach(button => {
         button.addEventListener("click", () => {
            const id = button.dataset.id;
            const quantitaElem = document.getElementById("quantita" + id);
            let quantita = Math.max(parseInt(quantitaElem.textContent) - 1, 0);
            quantitaElem.textContent = quantita;
            if (quantita > 0) {
               hashmap.put(id, quantita);
            } else {
               hashmap.remove(id);
            }
            dataManager.saveInstanceHashmap(hashmap);
         });
      });
   };

   this.generateMenu = function (hashmap) {
      const elencoPietanze = dataManager.getElencoPietanze();
      let txt = `
         <div>
            <input type='text' id='nomecliente' placeholder='Inserisci il tuo nome'/>
            <input type='text' id='tavolo' placeholder='Inserisci il numero del tavolo'/>
            <input type='number' id='coperti' placeholder='Quanti siete?'/>
         </div>`;

      for (const categoria in elencoPietanze) {
         txt += `<div><h4>${categoria}</h4>`;
         const pietanze = elencoPietanze[categoria];
         pietanze.forEach(p => {
            const id = p.id;
            const nome = p.nome;
            const prezzo = p.prezzo;
            const quantita = hashmap.contains(id) ? hashmap.get(id) : 0;

            txt += `
               <div class="content-pietanza-ordine">
                  <div class="left nome-pietanza">${nome}</div>
                  <div class="center prezzo-pietanza-ordine">${setTextPrezzo(prezzo)}</div>
                  <div class="right">
                     <div class="left minus">
                        <button class="brown-btn minus-btn" data-id="${id}" id="minus${id}">-</button>
                     </div>
                     <div class="center quantita-pietanza-ordine">
                        <span id="quantita${id}">${quantita}</span>
                     </div>
                     <div class="right plus">
                        <button class="brown-btn plus-btn" data-id="${id}" id="plus${id}">+</button>
                     </div>
                  </div>
                  <div class="endBlock"></div>
               </div>`;
         });
         txt += `</div>`;
      }

      return txt;
   };

   this.generateResoconto = function (hashmap, dict) {
      const elencoPietanze = dataManager.getElencoPietanze();
      const ordine = [];

      for (const categoria in elencoPietanze) {
         elencoPietanze[categoria].forEach(p => {
            const quantita = hashmap.get(p.id);
            if (quantita) {
               ordine.push({ categoria, ...p, quantita });
            }
         });
      }

      let totalePrezzo = 0;
      let totaleQuantita = 0;
      let resocontoHtml = `
         <div class="cliente-riepilogo">
            <div class="left nome-cliente"><b>Nome Cliente:</b> ${dict.nomecliente}</div>
            <div class="center numerotavolo"><b>Tavolo:</b> ${dict.tavolo}</div>
            <div class="right coperti"><b>Coperti:</b> ${dict.coperti}</div>
            <div class="endBlock"></div>
         </div>
         <div class="title-pietanze-riepilogo">
            <div class="left nome-pietanza">Nome</div>
            <div class="center quantita-pietanza-riepilogo">Quantità</div>
            <div class="right prezzo-pietanza-riepilogo">Prezzo</div>
            <div class="endBlock"></div>
         </div>`;

      let categoriaCorrente = null;
      ordine.forEach(p => {
         if (categoriaCorrente !== p.categoria) {
            categoriaCorrente = p.categoria;
            resocontoHtml += `<div class="tipo-pietanza-riepilogo">${categoriaCorrente}</div>`;
         }

         const prezzoTotale = p.prezzo * p.quantita;
         totalePrezzo += prezzoTotale;
         totaleQuantita += p.quantita;

         resocontoHtml += `
            <div class="content-pietanza-riepilogo">
               <div class="left nome-pietanza">${p.nome}</div>
               <div class="center quantita-pietanza-riepilogo">${p.quantita}</div>
               <div class="right prezzo-pietanza-riepilogo">${setTextPrezzo(prezzoTotale)}</div>
               <div class="endBlock"></div>
            </div>`;
      });

      resocontoHtml += `
         <div class="content-totale-ordine-riepilogo">
            <div class="left nome-pietanza"><b>Totale:</b></div>
            <div class="center quantita-pietanza-riepilogo">${totaleQuantita}</div>
            <div class="right prezzo-pietanza-riepilogo">${setTextPrezzo(totalePrezzo)}</div>
            <div class="endBlock"></div>
         </div>`;

      return resocontoHtml;
   };

   function setTextPrezzo(prezzo) {
      return Number.isInteger(prezzo)
         ? `${prezzo},00 Euro`
         : `${prezzo.toFixed(2).replace(".", ",")} Euro`;
   }
}
