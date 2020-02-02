var Main =
{
    Fenetres:null,
    ProcessusControlable:null,
    
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

            await Main.LoadData("./data/codeisalive.json");

            // Initialisation des ui

            initializationUserInterface();

            // Dessiner tous les éléments
            
            Main.DessinerTousLesElement();
            
            // Affichage fenêtre data
            let fAction = Main.Fenetres.ajouter({id:"ui-actions", title:'Actions', width:'auto', height:'auto'});
            fAction.afficher();
            
            // Dessin du premier processus
            Main.ProcessusControlable = new ProcessusDessin(Graphisme.VueFocus, Main.Processus[0], fAction);
            
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
        let layer_id=-1;

        // Lecture de tous les éléments
        for(var i = 1; i < this.Elements.length ; i++){
            
            // Si le niveau 0, alors qu'il s'agit d'une couche = une nouvelle colonne d'éléments
            if(this.Elements[i][colNiveau]=='0'){
                y=y_i;
                x=max_x+margin;
                deltax=0
                layer_id+=1;
            } // sinon on complète la colonne, en tenant compte de l'indentation
            else {
                deltax=this.Elements[i][colNiveau]*20;
                y+=40;
            }

            let Element = Graphisme.VueFocus.AjouterElement({
                Icone: (this.Elements[i][colIcone]=='' ? 'blackbox' : this.Elements[i][colIcone]), 
                Libelle: this.Elements[i][colElement],
                IdObjet: 1, 
                x: x+deltax,
                y: y,
                customProperties:{layer_id:layer_id}
            });
            
            let dimElement = Element.innerRect();
            max_x = Math.max(max_x, dimElement.w + dimElement.x);

        }

    }

}