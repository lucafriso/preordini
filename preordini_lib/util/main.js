document.addEventListener("DOMContentLoaded", () => {
  const graphicManager = new GraphicManager();
  const dataManager = new Data();

  caricaMenuDaFile().then(() => {
    navigateTo("pageprinc");

    document.getElementById("resoconto-btn").addEventListener("click", () => {
      const hashmap = dataManager.getInstanceHashmap();
      if (hashmap.isEmpty()) {
        alert("Il tuo ordine è vuoto!");
      } else {
        dataManager.saveInstanceHashmap(hashmap);
        navigateTo("pageres");
      }
    });

    document.getElementById("elimina-ordine-btn").addEventListener("click", () => {
      const hashmap = dataManager.getInstanceHashmap();
      hashmap.makeEmpty();
      dataManager.saveInstanceHashmap(hashmap);
      navigateTo("pageprinc");
    });

    document.getElementById("modifica-btn").addEventListener("click", () => {
      navigateTo("pageprinc");
    });

    document.getElementById("conferma-btn").addEventListener("click", () => {
      navigateTo("pageqrcode");
    });

    document.getElementById("nuovo-ordine-btn").addEventListener("click", () => {
      dataManager.saveInstanceHashmap(new HashMap());
      navigateTo("pageprinc");
    });
  });

  function navigateTo(pageId) {
    const hashmap = dataManager.getInstanceHashmap();
    if (pageId === "pageprinc") {
      const lista = document.getElementById("lista");
      lista.innerHTML = graphicManager.generateMenu(hashmap);
      graphicManager.setButtonPlusMinus(hashmap);
    } else if (pageId === "pageres") {
      const nomecliente = document.getElementById("nomecliente").value;
      const coperti = document.getElementById("coperti").value;
      const tavolo = document.getElementById("tavolo").value;

      const dict = { nomecliente, coperti, tavolo };
      document.getElementById("resoconto").innerHTML = graphicManager.generateResoconto(hashmap, dict);
    } else if (pageId === "pageqrcode") {
      const nomecliente = document.getElementById("nomecliente").value;
      const tavolo = document.getElementById("tavolo").value;
      const coperti = document.getElementById("coperti").value;

      const obj = {
        numeroTavolo: tavolo,
        cliente: nomecliente,
        coperti: coperti,
        righe: hashmap.keys().map(k => ({ id: parseInt(k), qta: hashmap.get(k) }))
      };

      const qrcodeText = encodeURIComponent(JSON.stringify(obj));
      const qrcode = new QRCode(document.getElementById("qrcode"), {
        width: 100,
        height: 100,
        useSVG: true
      });

      const qrCodeManager = new QRCodeManager(qrcode);
      qrCodeManager.clear();
      qrCodeManager.makeQRCode(qrcodeText);
    }

    document.querySelectorAll("[data-role='page']").forEach(p => p.style.display = "none");
    document.getElementById(pageId).style.display = "block";
  }
});
