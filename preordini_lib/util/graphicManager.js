function GraphicManager() {
    const dataManager = new Data();
 
    this.setButtonPlusMinus = function (hashmap) {
        const elencoPietanze = dataManager.getElencoPietanze();
 
        Object.keys(elencoPietanze).forEach(tipo => {
            const pietanze = elencoPietanze[tipo];
            pietanze.forEach(pietanza => {
                const plusBtn = document.getElementById("plus" + pietanza.id);
                const minusBtn = document.getElementById("minus" + pietanza.id);
                const quantitaHtml = document.getElementById("quantita" + pietanza.id);
 
                if (plusBtn && quantitaHtml) {
                    plusBtn.addEventListener("click", () => {
                        let quantita = parseInt(quantitaHtml.textContent) + 1;
                        quantitaHtml.textContent = quantita;
                        hashmap.put(pietanza.id, quantita);
                        dataManager.saveInstanceHashmap(hashmap);
                    });
                }
 
                if (minusBtn && quantitaHtml) {
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
        });
    };
 
    this.generateMenu = function (hashmap) {
        const elencoPrincipale = dataManager.getElencoPrincipale();
        const elencoPietanze = dataManager.getElencoPietanze();

        let txtLista = `
            <div>
                <input type='text' id='nomecliente' placeholder='Inserisci il tuo nome' class="ui-input-text"/>
                <input type='number' id='tavolo' placeholder='Inserisci il numero del tavolo' class="ui-input-text"/>
                <input type='number' id='coperti' placeholder='Quanti siete?' class="ui-input-text"/>
            </div>`;

        elencoPrincipale.forEach(categoria => {
            const pietanze = elencoPietanze[categoria];
            const categoriaId = `cat_${categoria.replace(/\s+/g, '_').toLowerCase()}`;

            txtLista += `
                <button class="accordion-toggle" onclick="toggleCategoria('${categoriaId}')">${categoria}</button>
                <div class="categoria-content hidden" id="${categoriaId}">
            `;

            pietanze.forEach(pietanza => {
                const quantita = hashmap.contains(pietanza.id) ? hashmap.get(pietanza.id) : 0;

                txtLista += `
                    <div class="content-pietanza-ordine">
                    <div class="left nome-pietanza">${pietanza.nome}</div>
                    <div class="center prezzo-pietanza-ordine">${pietanza.prezzo.toFixed(2)}€</div>
                    <div class="quantita-pietanza-ordine">
                        <button class="minus-btn" id="minus${pietanza.id}">−</button>
                        <span id="quantita${pietanza.id}">${quantita}</span>
                        <button class="plus-btn" id="plus${pietanza.id}">+</button>
                    </div>
                    <div class="endBlock"></div>
                    </div>
                `;
            });

            txtLista += `</div>`;
        });

        return txtLista;
    };
 
    this.generatePopup = function (msg) {
        alert(msg);
    };
 
    this.generateResoconto = function (hashmap, dict) {
        const elencoPietanze = dataManager.getElencoPietanze();
 
        function getPietanzaById(id) {
            for (const tipo in elencoPietanze) {
                const pietanze = elencoPietanze[tipo];
                const trovata = pietanze.find(p => p.id === id);
                if (trovata) return trovata;
            }
            return null;
        }
 
        let txtResoconto = `
          <div>
             <h3>Nome cliente: ${dict.nomecliente}</h3>
             <h3>Tavolo: ${dict.tavolo}</h3>
             <h3>Coperti: ${dict.coperti}</h3>
          </div>`;
 
        hashmap.keys().forEach(id => {
            const pietanza = getPietanzaById(id);
            const quantita = hashmap.get(id);
            if (pietanza) {
                txtResoconto += `
                   <div class="content-pietanza-ordine">
                      <div class="left nome-pietanza">${pietanza.nome}</div>
                      <div class="center prezzo-pietanza-ordine">${(pietanza.prezzo * quantita).toFixed(2)}€</div>
                      <div class="right">${quantita}</div>
                      <div class="endBlock"></div>
                   </div>`;
            }
        });
 
        return txtResoconto;
    };
 }
 
