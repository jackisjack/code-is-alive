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

                // Dessinner tous les éléments
               
                Main.DessinerTousLesElement();
               
              };      
          
    },

    Processus:null,
    Elements:null,

    LoadData: async function(jsonfile){

        let response = await fetch(jsonfile);
        let data = await response.json();

        this.Processus = data.Processus;
        this.Elements = data.Elements;

    },

    DessinerTousLesElement: function(){

        // Recherche des entêtes attendues
        let colElement = this.Elements[0].findIndex(x => x=='Element');
        let colNiveau = this.Elements[0].findIndex(x => x=='Niveau');
        let colIcone = this.Elements[0].findIndex(x => x=='Icone');

        let deltax = 0
        let y_i = 300;
        let max_x = 500;
        let margin=100;

        // Lecture de tous les éléments
        for(var i = 1; i < this.Elements.length ; i++){
            
            if(this.Elements[i][colNiveau]=='0'){
                y=y_i;
                x=max_x+margin;
                deltax=0
            }
            else {
                deltax=this.Elements[i][colNiveau]*20;
                y+=40;
            }

            let Element = Graphisme.VueFocus.AjouterElement({
                Icone: (this.Elements[i][colIcone]=='' ? 'blackbox' : this.Elements[i][colIcone]), 
                Libelle: this.Elements[i][colElement],
                IdObjet: 1, 
                x: x+deltax,
                y: y 
            });

            let dimElement = Element.innerRect();
            max_x = Math.max(max_x, dimElement.w + dimElement.x);

        }

    }

}