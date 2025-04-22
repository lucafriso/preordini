function GraphicManager() {

   const dataManager = new Data();

   // Aggiunge i pulsanti +/- alle pietanze
   this.setButtonPlusMinus = function(hashmap) {
      const elencoPrincipale = dataManager.getElencoPrincipale();
      const elencoPietanze = dataManager.getElencoPietanze();

      elencoPrincipale.forEach(tipo => {
         const pietanze = elencoPietanze[tipo] || [];
         pietanze.forEach(pietanza => {
            $("#plus" + pietanza.id).click(function () {
               const id = (this.id).substring("plus".length);
               const quantitaHtml = $("#quantita" + id);
               const quantita = parseInt(quantitaHtml.html()) + 1;
               quantitaHtml.html(quantita + "");
               hashmap.put(id, quantita);
               dataManager.saveInstanceHashmap(hashmap);
            });

            $("#minus" + pietanza.id).click(function () {
               const id = (this.id).substring("minus".length);
               const quantitaHtml = $("#quantita" + id);
               const quantita = Math.max(parseInt(quantitaHtml.html()) - 1, 0);
               quantitaHtml.html(quantita + "");
               if (quantita > 0) {
                  hashmap.put(id, quantita);
               } else {
                  hashmap.remove(id);
               }
               dataManager.saveInstanceHashmap(hashmap);
            });
         });
      });
   }

   // Mostra popup per ordine vuoto o eliminato
   this.generatePopup = function(id, dataElimina) {
      let info, title;
      const isElimina = dataElimina.value;

      if (isElimina) {
         title = "Elimina Ordine";
         if (dataElimina.state == 0) {
            info = "<p>Nessuna pietanza selezionata.</p><p>Per effettuare un ordine devi almeno selezionare una pietanza.</p>";
         } else {
            info = "<p>L'ordine &egrave; stato eliminato.</p><p>Le quantit&agrave; di tutte le pietanze sono state azzerate.</p>";
         }
      } else {
         title = "Ordine Vuoto";
         info = "<p>Il tuo ordine &egrave; vuoto.</p><p>Devi almeno ordinare una pietanza</p><button class=\"ui-btn green-btn\" id=\"ordine-vuoto-btn\">Ok</button>"
      }

      $("#title-popup").html(title);
      $("#info-ordine-popup").html(info);

      if (!isElimina) {
         $("#ordine-vuoto-btn").click(function () {
            $(id).popup("close");
         });
      } else {
         const timeout = setTimeout(() => $(id).popup("close"), 4500);
         $(id).on({ popupafterclose: () => clearTimeout(timeout) });
      }

      $(id).popup({ dismissible: isElimina });
   }

   // Genera resoconto ordine
   this.generateResoconto = function(hashmap, dict) {
      const elencoPrincipale = dataManager.getElencoPrincipale();
      const elencoPietanze = dataManager.getElencoPietanze();

      function getPietanza(id) {
         for (const tipo of elencoPrincipale) {
            const pietanze = elencoPietanze[tipo];
            for (const p of pietanze) {
               if (p.id == id) return { pietanza: p, tipo: tipo };
            }
         }
         return undefined;
      }

      function getTextPietanza(nome, prezzoUnitario, quantita) {
         const prezzo = prezzoUnitario * quantita;
         return `<div class="content-pietanza-riepilogo">
            <div class="left nome-pietanza">${nome}</div>
            <div class="center quantita-pietanza-riepilogo">${quantita}</div>
            <div class="right prezzo-pietanza-riepilogo">${setTextPrezzo(prezzo)}</div>
            <div class="endBlock"></div>
         </div>`;
      }

      function getTextTipo(tipo) {
         return `<div class="tipo-pietanza-riepilogo">${tipo}</div>`;
      }

      let txtResoconto = `<div class="cliente-riepilogo">
         <div class="left nome-cliente"><b>Nome Cliente:</b> ${dict['nomecliente']}</div>
         <div class="center numerotavolo"><b>Tavolo:</b> ${dict['tavolo']}</div>
         <div class="right coperti"><b>Coperti:</b> ${dict['coperti']}</div>
         <div class="endBlock"></div>
      </div>
      <div class="title-pietanze-riepilogo">
         <div class="left nome-pietanza">Nome</div>
         <div class="center quantita-pietanza-riepilogo">Quantit&agrave;</div>
         <div class="right prezzo-pietanza-riepilogo">Prezzo</div>
         <div class="endBlock"></div>
      </div>`;

      const allKeys = hashmap.keys();
      const allPietanze = allKeys.map(id => getPietanza(id)).filter(p => p !== undefined);

      allPietanze.sort((a, b) => a.pietanza.posizione - b.pietanza.posizione);

      let tipoCorrente = null;
      let totale = { prezzo: 0, quantita: 0 };

      allPietanze.forEach(item => {
         if (item.tipo !== tipoCorrente) {
            tipoCorrente = item.tipo;
            txtResoconto += getTextTipo(tipoCorrente);
         }
         const quantita = hashmap.get(item.pietanza.id);
         txtResoconto += getTextPietanza(item.pietanza.nome, item.pietanza.prezzo, quantita);
         totale.prezzo += item.pietanza.prezzo * quantita;
         totale.quantita += quantita;
      });

      txtResoconto += `<div class="content-totale-ordine-riepilogo">
         <div class="left nome-pietanza"><b>Totale: </b></div>
         <div class="center quantita-pietanza-riepilogo">${totale.quantita}</div>
         <div class="right prezzo-pietanza-riepilogo">${setTextPrezzo(totale.prezzo)}</div>
         <div class="endBlock"></div>
      </div>`;

      return txtResoconto;
   }

   // Genera il menu visivo
   this.generateMenu = function(hashmap) {
      const elencoPrincipale = dataManager.getElencoPrincipale();
      const elencoPietanze = dataManager.getElencoPietanze();

      function generatePietanza(id, nome, prezzo, quantita) {
         return `<div class="content-pietanza-ordine">
            <div class="left nome-pietanza">${nome}</div>
            <div class="center prezzo-pietanza-ordine">${setTextPrezzo(prezzo)}</div>
            <div class="right">
               <div class="left minus">
                  <button class="ui-btn brown-btn minus-btn" id="minus${id}">-</button>
               </div>
               <div class="center quantita-pietanza-ordine">
                  <span id="quantita${id}">${quantita}</span>
               </div>
               <div class="right plus">
                  <button class="ui-btn brown-btn plus-btn" id="plus${id}">+</button>
               </div>
            </div>
            <div class="endBlock"></div>
         </div>`;
      }

      let txtLista = `<div>
         <input type='text' id='nomecliente' placeholder='Inserisci il tuo nome'/>
         <input type='text' id='tavolo' placeholder='Inserisci il numero del tavolo'/>
         <input type='text' id='coperti' placeholder='Quanti siete &#63;'/>
      </div>`;

      elencoPrincipale.forEach(tipo => {
         txtLista += `<div data-role='collapsible'><h4>${tipo}</h4>`;
         const pietanze = elencoPietanze[tipo] || [];
         pietanze.forEach(pietanza => {
            const quantita = hashmap.contains(pietanza.id) ? hashmap.get(pietanza.id) : 0;
            txtLista += generatePietanza(pietanza.id, pietanza.nome, pietanza.prezzo, quantita);
         });
         txtLista += `</div>`;
      });

      return txtLista;
   }

   function setTextPrezzo(prezzo) {
      return Number.isInteger(prezzo)
         ? `${prezzo},00 Euro`
         : `${prezzo.toFixed(2).replace(".", ",")} Euro`;
   }
}
