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
               {id: "petitcarrebleu", src:"https://cdn.glitch.com/1f9a81fa-715f-4b6a-abac-840468608b33%2Fhub.png?v=1574020275932"},
               {id: "pdf", src:"https://cdn.glitch.com/1f9a81fa-715f-4b6a-abac-840468608b33%2Fpdficon.png?v=1574505654088"},
               {id: "file", src:"https://cdn.glitch.com/1f9a81fa-715f-4b6a-abac-840468608b33%2Ffileicon.png?v=1574506930028"}
           ]);
          
           // Quand le chargement des images est terminé
          
           function handleComplete() {
                          
              HideLoading();

              // Initialisation de la vue
             
              Graphisme.Init();
              
             // Exécution des tests
             
             tu_DrawLink2();
             
        }
          
    }

}