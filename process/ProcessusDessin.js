let ProcessusDessin= function(vue, processusData){

    this.etape_id = -1;
    this.etape_id_max = processusData.Etapes.length - 1;
    this.lien_actuel = null;

    this.dessinerEtape=function(etape_id){

        // Récupération des informations de l'étape
        let etape = processusData.Etapes[etape_id];
        // Récupération de l'élément graphique associé
        let element = vue.ListeElement[etape.Element];

        // Sélection et focus sur l'élément
        element.Selectionner();
        element.Focus();
        
        // S'il y a un élément2, c'est qu'il y a un lien à afficher
        if(etape.Element2!==''){

            let element2 = vue.ListeElement[etape.Element2];

            // La forme du lien dépend de la couche des 2 éléments
            let Position;
            if(element.customProperties.layer_id == element2.customProperties.layer_id){
                Position = EnumPositionLien.GaucheGauche
            } else {
                Position = EnumPositionLien.DroiteGauche
            }
            
            // Masquage du précédant lien

            if (this.lien_actuel!==null){
                this.lien_actuel.Visible(false);
            }

            // Création d'un lien
            this.lien_actuel = Graphisme.VueFocus.AjouterLien(
                {
                    ElementDepart:element,
                    ElementArrivee:element2,
                    Style: EnumStyleLien.Style2,
                    Position: Position
                });

        }
    }

    this.dessinerEtapeSuivante=function(){
        this.etape_id=Math.min(this.etape_id_max, this.etape_id+1);
        this.dessinerEtape(this.etape_id);
    }

    this.dessinerEtapePrecedante=function(){
        this.etape_id=Math.max(0, this.etape_id-1);
        this.dessinerEtape(this.etape_id);
    }

    // Instructions à construction :
    this.dessinerEtapeSuivante();

}