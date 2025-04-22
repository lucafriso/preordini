$(document).on("pagecreate", function (event) {
   var graphicManager = new GraphicManager();
   var dataManager = new Data();

   // Carichiamo il menu JSON PRIMA di tutto
   loadJsonMenu(function () {
      // Ora che i dati sono pronti, possiamo agganciare gli eventi

      $(document).on("pagebeforeshow", "#pageprinc", function () {
         $("#lista").empty().append(
            graphicManager.generateMenu(
               dataManager.getInstanceHashmap()
            )
         ).collapsibleset();

         $("#lista").trigger("create");

         graphicManager.setButtonPlusMinus(
            dataManager.getInstanceHashmap()
         );

         $("#resoconto-btn").off().click(function (evt) {
            evt.stopImmediatePropagation();
            evt.preventDefault();
            var hashmap = dataManager.getInstanceHashmap();
            if (hashmap.isEmpty()) {
               graphicManager.generatePopup("#popup-ordine", { value: false });
               $("#popup-ordine").popup("open");
            } else {
               dataManager.saveInstanceHashmap(hashmap);
               $.mobile.pageContainer.pagecontainer("change", "#pageres", {});
            }
         });

         $("#elimina-ordine-btn").off().click(function (evt) {
            evt.stopImmediatePropagation();
            evt.preventDefault();
            var dataElimina = { value: true, state: 0 };

            var hashmap = dataManager.getInstanceHashmap();
            if (!hashmap.isEmpty()) {
               dataElimina.state = 1;
               hashmap.makeEmpty();
               dataManager.saveInstanceHashmap(hashmap);
               hashmap = dataManager.getInstanceHashmap();

               var elencoPrincipale = dataManager.getElencoPrincipale();
               var elencoPietanze = dataManager.getElencoPietanze();

               for (var i = 0; i < elencoPrincipale.length; i++) {
                  var pietanze = elencoPietanze[elencoPrincipale[i]];
                  for (var j = 0; j < pietanze.length; j++) {
                     var id = pietanze[j].id;
                     var quantitaHtml = $("#quantita" + id);
                     var quantita = hashmap.contains(id) ? hashmap.get(id) : 0;
                     quantitaHtml.html(quantita + "");
                  }
               }
            }

            graphicManager.generatePopup("#popup-ordine", dataElimina);
            $("#popup-ordine").popup("open");
         });
      });

      $(document).on("pagebeforeshow", "#pageres", function () {
         var hashmap = dataManager.getInstanceHashmap();
         if (hashmap.isEmpty()) {
            $.mobile.pageContainer.pagecontainer("change", "#pageprinc", {});
            return;
         }

         var dict = {
            nomecliente: $('#nomecliente').val(),
            coperti: $('#coperti').val(),
            tavolo: $('#tavolo').val()
         };

         $("#resoconto").html(
            graphicManager.generateResoconto(hashmap, dict)
         );

         $("#modifica-btn").off().click(function (evt) {
            evt.stopImmediatePropagation();
            evt.preventDefault();
            $.mobile.pageContainer.pagecontainer("change", "#pageprinc", {});
         });

         $("#conferma-btn").off().click(function (evt) {
            evt.stopImmediatePropagation();
            evt.preventDefault();
            $.mobile.pageContainer.pagecontainer("change", "#pageqrcode", {});
         });
      });

      $(document).on("pagebeforeshow", "#pageqrcode", function () {
         function generateTextQRCode(hashmap) {
            var nomecliente = $('#nomecliente').val();
            var numerotavolo = $('#tavolo').val();
            var numerocoperti = $('#coperti').val();

            var obj = {
               numeroTavolo: numerotavolo,
               cliente: nomecliente,
               coperti: numerocoperti,
               righe: []
            };

            var keys = hashmap.keys();
            for (var i = 0; i < keys.length; i++) {
               obj.righe.push({ id: parseInt(keys[i]), qta: hashmap.get(keys[i]) });
            }

            return encodeURIComponent(JSON.stringify(obj));
         }

         var hashmap = dataManager.getInstanceHashmap();

         if (hashmap.isEmpty()) {
            $.mobile.pageContainer.pagecontainer("change", "#pageprinc", {});
            return;
         }

         $("#nuovo-ordine-btn").off().click(function (evt) {
            evt.stopImmediatePropagation();
            evt.preventDefault();
            dataManager.saveInstanceHashmap(new HashMap());
            $.mobile.pageContainer.pagecontainer("change", "#pageprinc", {});
         });

         $("#qrcode").html("");
         var qrcode = new QRCode(document.getElementById("qrcode"), {
            width: 100,
            height: 100,
            useSVG: true
         });

         var qrCodeManager = new QRCodeManager(qrcode);
         qrCodeManager.clear();
         qrCodeManager.makeQRCode(generateTextQRCode(hashmap));
      });

   }); // <-- fine caricamento JSON
});
