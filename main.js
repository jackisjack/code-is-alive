var Main =
{

    WindowsUI:null,
    ProcessusControlable:null,
    ProcessusAuto:[],
    Processus:null,
    Elements:null,

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
            
            ViewCollection_js.Init();
            
            // Chargement des datas 

            await Main.LoadData("./data/CodeIsAlive.json");

            // Initialisation des ui

            initializationUserInterface();

            // Dessiner tous les éléments
            
            architectureDrawer(Main.Elements);
            
            // Affichage de la fenêtre de sélection de processus

            Main.WindowsUICollection.gerer("ui-process").afficher();
                        
        };      
          
    },

    LoadData: async function(jsonfile){

        let response = await fetch(jsonfile);
        let data = await response.json();

        this.Processus = data.Processus;
        this.Elements = data.Elements;

    }

}