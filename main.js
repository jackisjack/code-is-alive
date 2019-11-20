var MainSiManager =
{
        Init: function () {

            // Fenêtre loading;

            ShowLoading();


            // Pour gérer les mouvements suivants une ligne (non utilisé pour le moment)

            createjs.MotionGuidePlugin.install();

            // Chargement en mémoire des îcones (pour leur ajout futur sur la scène)

            SetLoadingMessage("Chargement de la carte");
           
           VariablesGlobales.ImagesArray = new createjs.LoadQueue();
           VariablesGlobales.ImagesArray .on("complete", handleComplete, this);
           VariablesGlobales.ImagesArray .loadManifest([
               {id: "petitcarrebleu", src:"https://cdn.glitch.com/1f9a81fa-715f-4b6a-abac-840468608b33%2Fhub.png?v=1574020275932"}
           ]);
          
           // Quand le chargement des images est terminé
          
           function handleComplete() {
                          
              HideLoading();

              // Initialisation de la vue
             
              Graphisme.Init();
              
             for (var j = 1; j < 200 ; j++){
               
                var ElementSansParent = Graphisme.VueFocus.AjouterElement({
                  IdTypeObjet: EnumTypeObjet.PetitCarre, 
                  IdVue:-1,
                  Libelle: "Ceci est un exemple de truc",
                  IdObjet: 1, 
                  x: 200,
                  y: 200 + j*50,
                  Forme: EnumPositionImage.EnLigneVertical,
                  x_delta: 0,
                  y_delta: 0
                  
                });
                
               ElementSansParent.Visible(true);
               
              }
             
              // Fin du loading;

             }
          
        },


        
}