var MainSiManager =
{
        Init: function () {

            // Fenêtre loading;

            ShowLoading();


            // Pour gérer les mouvements suivants une ligne (non utilisé pour le moment)

            createjs.MotionGuidePlugin.install();

            // Chargement en mémoire des îcones (pour leur ajout futur sur la scène)

            SetLoadingMessage("Chargement de la carte");
            
          // Liste des images à charger
            var data = [
              {IDTYPEOBJET:EnumTypeObjet.PetitCarre, LIBELLE:"Petit carré bleu",ICONE: "https://cdn.glitch.com/1f9a81fa-715f-4b6a-abac-840468608b33%2Fhub.png?v=1574020275932"}
            ];
            
          var queue = new createjs.LoadQueue(true);
          queue.addEventListener("fileload",onFileLoaded.bind(this));
          var manifest = getManifest();
          queue.loadManifest(manifest);

          onFileLoaded = function(evt)
          {
           var item = evt.item;
           var type = evt.type;
          }

          getManifest = function()
          {
           var manifest = [
           {src:"/images/yourimage.png", id:"myimage"}    
           ];

           return manifest;
          }

          var myimage = new createjs.Bitmap(images.myimage);
          
            for (var i = 0; i < data.length; i++) {

                var image_temp = new Image();
                image_temp.src = data[i].ICONE;
                VariablesGlobales.ImagesArray.push({ idtypeobjet: data[i].IDTYPEOBJET, libelle: data[i].LIBELLE, image: new createjs.Bitmap(image_temp) });

            }
            
            // Initialisation de la vue

            Graphisme.Init();

            var ElementSansParent = Graphisme.VueFocus.AjouterElement({
              IdTypeObjet: EnumTypeObjet.PetitCarre, 
              IdVue:-1,
              Libelle: "Sujet",
              IdObjet: 1, 
              x: 200,
              y: 200,
              Forme: EnumPositionImage.EnLigneVertical,
              x_delta: 0,
              y_delta: 0
          });

          ElementSansParent.Visible(true);
          
            // Fin du loading;

            HideLoading();
          
        },


        
}