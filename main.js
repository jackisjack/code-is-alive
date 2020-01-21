var Main =
{
        Fenetres:null,
        Init: function () {

            // Fenêtre loading;

            ShowLoading();


            // Pour gérer les mouvements suivants une ligne (non utilisé pour le moment)

            createjs.MotionGuidePlugin.install();

            // Chargement en mémoire des îcones (pour leur ajout futur sur la scène)

            SetLoadingMessage("Chargement de la carte");
            ImageManager.OnComplete(handleComplete);
            ImageManager.Load();

            async function handleComplete() {
                          
                HideLoading();
  
                // Initialisation de la vue
               
                Graphisme.Init();
                
                // Chargement des datas 

                await Main.LoadData("./unittest/json/codeisalive.json");

                // Initialisation des ui

                initializationUserInterface();

               // Exécution des tests
               
               //tu_DataUi_LoadData();
               
              };      
          
    },

    Processus:null,
    Elements:null,

    LoadData: async function(jsonfile){

        let response = await fetch(jsonfile);
        let data = await response.json();

        this.Processus = data.Processus;
        this.Elements = data.Elements;

    }

}