var MainSiManager =
{
        Init: function () {

            // Fenêtre loading;

            ShowLoading();


            // Pour gérer les mouvements suivants une ligne (non utilisé pour le moment)

            createjs.MotionGuidePlugin.install();

            // Chargement en mémoire des îcones (pour leur ajout futur sur la scène)

            SetLoadingMessage("Chargement de la carte");
            ImageManager.OnComplete(handleComplete);
            ImageManager.Load();

            function handleComplete() {
                          
                HideLoading();
  
                // Initialisation de la vue
               
                Graphisme.Init();
                
               // Exécution des tests
               
               tu_Table();
               
              };      
          
    }

}