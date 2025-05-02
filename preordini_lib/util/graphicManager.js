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

    let html = `
        <div class="form-clienti">
            <input type="text" id="nomecliente" placeholder="Nome cliente"/>
            <input type="text" id="tavolo" placeholder="Numero tavolo"/>
            <input type="number" id="coperti" placeholder="Coperti" value="1"/>
        </div>`;

    elencoPrincipale.forEach(categoria => {
        html += `
            <div class="accordion-section">
                <button class="accordion-toggle">${categoria}</button>
                <div class="accordion-content">
        `;

        elencoPietanze[categoria].forEach(pietanza => {
            const quantita = hashmap.contains(pietanza.id) ? hashmap.get(pietanza.id) : 0;
            html += `
                <div class="pietanza-item">
                    <div class="pietanza-nome">${pietanza.nome}</div>
                    <div class="pietanza-prezzo">${pietanza.prezzo.toFixed(2)} €</div>
                    <div class="pietanza-quantita">
                        <button id="minus${pietanza.id}" class="btn btn-minus">-</button>
                        <span id="quantita${pietanza.id}">${quantita}</span>
                        <button id="plus${pietanza.id}" class="btn btn-plus">+</button>
                    </div>
                </div>`;
        });

        html += `</div></div>`;
    });

    return html;
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
 