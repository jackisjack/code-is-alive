let ProcessusDessin= function(vue, processusData, fAction){

    this.etape_id = -1;
    this.etape_id_max = processusData.Etapes.length - 1;
    this.lien_actuel = null;

    this.dessinerEtape=function(etape_id){

        // Masquage du précédant lien (s'il y en avait un)
        if (this.lien_actuel!==null){
            this.lien_actuel.Visible(false);
        }

        // Récupération des informations de l'étape
        let etape = processusData.Etapes[etape_id];
        // Récupération de l'élément graphique associé
        let element = vue.ListeElement[etape.Element];

        // Sélection et focus sur l'élément
        element.Selectionner();
        element.Focus();
        
        let element2;
        // S'il y a un élément2, c'est qu'il y a un lien à afficher
        if(etape.Element2!==''){

            element2 = vue.ListeElement[etape.Element2];

            // La forme du lien dépend de la couche des 2 éléments
            let Position;
            if(element.customProperties.layer_id == element2.customProperties.layer_id){
                Position = EnumPositionLien.GaucheGauche
            } else {
                Position = EnumPositionLien.DroiteGauche
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

        // Suppression du contenu de la fenêtre des actions
        while (fAction.dom.firstChild) {
            fAction.dom.removeChild(fAction.dom.firstChild);
        }

        //***************************************************
        // Création de l'entête'

        // Element1
        let ui_actions__element1 = dom(fAction.dom, "div", {class:"ui-actions--element"});
        ui_actions__element1.appendChild(element.bitmap.image);
        dom(ui_actions__element1, null, {}, element.Libelle)

        // Badge (type d'action) : calcul du type, puis affichage
        let typeAction;
        if (element2==undefined){
            typeAction = "ETAT_DE_MEMOIRE";
        } else {
            typeAction = "COMMUNICATION";
        }
        if (etape.Data!==undefined){
            if(etape.Data.length==1){
                if (etape.Data[0][0][1].toUpperCase()=="ACTION"){ // 0 0 1 = 1er tableau de data, 1ère ligne, 2ème colonne (=l'intitulé de l'information)
                    typeAction = "ACTION";
                }
            } 
        }

        // Affichage du badge correspondant au type
        switch(typeAction){
            case 'COMMUNICATION':
                dom(fAction.dom, "span", {class:"badge badge-primary"}, "communique avec");
            break;
            case 'ETAT_DE_MEMOIRE':
                dom(fAction.dom, "span", {class:"badge badge-secondary"}, "Etat de mémoire");
            break;
            case 'ACTION':
                dom(fAction.dom, "span", {class:"badge badge-success"}, etape.Data[0][0][2]); // on écrit le nom de l'action
            break;
        }
        
        // éventuel Element2
        if(element2!==undefined){
            let ui_actions__element2 = dom(fAction.dom, "div", {class:"ui-actions--element"});
            ui_actions__element2.appendChild(element2.bitmap.image);
            dom(ui_actions__element2, null, {}, element2.Libelle)
        }

        //***************************************************
        // Affichage des informations tabulaires s'il y en a

        if (typeAction!=='ACTION') { // on n'affiche pas l'action, elle est déjà présente dans le badge.
            if (etape.Data!==undefined){
                for(let i=0; i < etape.Data.length; i++){
                    generate_table(fAction.dom, etape.Data[i]);
                }
            }
        }

        //***************************************************
        // Affichage de l'éventuelle illustration
        
        if (etape.Data!==undefined){
            let last1 = etape.Data.length-1;
            let last2 = etape.Data[last1].length-1;
            if (etape.Data[last1][last2][1] == 'Illustration'){
                
                let imageName = etape.Data[last1][last2][2];
                dom(fAction.dom, "img", {src:"./data/pict/" + imageName});

            }
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