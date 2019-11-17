var MainSiManager =
{
        Init: function () {

            // Fenêtre loading;

            ShowLoading();


            // Pour gérer les mouvements suivants une ligne (non utilisé pour le moment)

            createjs.MotionGuidePlugin.install();

            // Chargement en mémoire des îcones (pour leur ajout futur sur la scène)

            SetLoadingMessage("Chargement de la carte");
            
            var data = [
              {IDTYPEOBJET:EnumTypeObjet.PetitCarre, LIBELLE:"Petit carré bleu",ICONE: "https://cdn.glitch.com/1f9a81fa-715f-4b6a-abac-840468608b33%2Fhub.png?v=1574020275932"}
            ];
          
            for (var i = 0; i < data.length; i++) {

                var image_temp = new Image();
                image_temp.src = data[i].ICONE;
                VariablesGlobales.ImagesArray.push({ idtypeobjet: data[i].IDTYPEOBJET, libelle: data[i].LIBELLE, image: image_temp });

            }

            // Initialisation de la vue

            Graphisme.Init();

            // Fin du loading;

            HideLoading();
          
        },


        
}