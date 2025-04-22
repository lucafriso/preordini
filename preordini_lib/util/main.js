document.addEventListener("DOMContentLoaded", async function () {
  const graphicManager = new GraphicManager();
  const dataManager = new Data();

  await dataManager.loadJsonMenu();
  navigateTo("pageprinc");

  function navigateTo(pageId) {
      if (pageId === "pageprinc") {
          const container = document.getElementById("lista");
          container.innerHTML = graphicManager.generateMenu(dataManager.getInstanceHashmap());
          graphicManager.setButtonPlusMinus(dataManager.getInstanceHashmap());

          document.getElementById("resoconto-btn").addEventListener("click", () => {
              const hashmap = dataManager.getInstanceHashmap();
              if (hashmap.isEmpty()) {
                  graphicManager.generatePopup("Ordine vuoto. Aggiungi almeno una pietanza.");
                  return;
              }
              dataManager.saveInstanceHashmap(hashmap);
              navigateTo("pageres");
          });

          document.getElementById("elimina-ordine-btn").addEventListener("click", () => {
              const hashmap = dataManager.getInstanceHashmap();
              hashmap.makeEmpty();
              dataManager.saveInstanceHashmap(hashmap);
              navigateTo("pageprinc");
          });
      }

      if (pageId === "pageres") {
          const nomecliente = document.getElementById("nomecliente").value;
          const tavolo = document.getElementById("tavolo").value;
          const coperti = document.getElementById("coperti").value;

          alert(`Ordine riepilogato:\nCliente: ${nomecliente}\nTavolo: ${tavolo}\nCoperti: ${coperti}`);
      }
  }
});
