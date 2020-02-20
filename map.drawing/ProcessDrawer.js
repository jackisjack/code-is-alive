// si fAction est non-null 
let ProcessDrawer= function({...vue}, {...processusData}, autoRun=false, color='#03991E'){

    this.etape_id = -1;
    this.etape_id_max = processusData.Etapes.length - 1;
    this.liensVisible = [];
    this.autoRun = autoRun;
    this.color = color;
    this.timerAuto = null;

    this.dessinerEtape=function(etape_id, processusData, fAction){

        // Masquage du/des précédant lien 
        if(this.autoRun==false){
            // en mode manuel, on efface le précédant lien (s'il y en avait un)
            if (this.liensVisible.length > 0){
                let lien = this.liensVisible.shift();
                lien.Visible(false);
            }
        } else {
            // en mode auto, on garde plusieurs liens affichés
            if (this.liensVisible.length > 2){
                let lien = this.liensVisible.shift();
                lien.Visible(false);
            }
        }

        // Récupération des informations de l'étape
        let etape = processusData.Etapes[etape_id];
        // Récupération de l'élément graphique associé
        let element = vue.ListeElement[etape.Element];

        // Sélection et focus sur l'élément
        if(this.autoRun==false){
            element.Selectionner();
            element.Focus();
        }

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
            let lien = ViewCollection_js.FocusedView.AjouterLien(
                {
                    ElementDepart:element,
                    ElementArrivee:element2,
                    Style: EnumStyleLien.Style2,
                    Position: Position,
                    Color:this.color
                });

            this.liensVisible.push(lien);

        }

        // Si une fenêtre doit être alimenté
        if(this.autoRun==false){
            
            // Suppression du contenu de la fenêtre des actions
            while (fAction.dom.firstChild) {
                fAction.dom.removeChild(fAction.dom.firstChild);
            }

            //***************************************************
            // Création de l'entête'

            // Element1
            let ui_actions__element1 = dom(fAction.dom, {node:"div", class:"ui-actions--element"});
            ui_actions__element1.appendChild(element.bitmap.image);
            dom(ui_actions__element1, {}, element.Libelle)

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
                    dom(fAction.dom, {node:"span", class:"badge badge-primary"}, "communique avec");
                break;
                case 'ETAT_DE_MEMOIRE':
                    dom(fAction.dom, {node:"span", class:"badge badge-secondary"}, "Etat de mémoire");
                break;
                case 'ACTION':
                    dom(fAction.dom, {node:"span", class:"badge badge-success"}, etape.Data[0][0][2]); // on écrit le nom de l'action
                break;
            }
            
            // éventuel Element2
            if(element2!==undefined){
                let ui_actions__element2 = dom(fAction.dom, {node:"div",class:"ui-actions--element"});
                ui_actions__element2.appendChild(element2.bitmap.image);
                dom(ui_actions__element2, {}, element2.Libelle)
            }

            //***************************************************
            // Affichage des informations tabulaires s'il y en a

            if (typeAction!=='ACTION') { // on n'affiche pas l'action, elle est déjà présente dans le badge.
                if (etape.Data!==undefined){
                    for(let i=0; i < etape.Data.length; i++){
                        generateTable(fAction.dom, etape.Data[i]);
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
                    dom(fAction.dom, {node:"img", src:"./data/pict/" + imageName});

                }
            }
        }

    }

    this.dessinerEtapeSuivante=function(){
        if(this.etape_id+1 > this.etape_id_max){ // si mode auto, alors retour au début automatique si on dépasse la fin
            if(this.autoRun==true){
                this.etape_id = 0;
                this.dessinerEtape(this.etape_id, processusData, that.fAction); 
            }
        } else {
            this.etape_id+=1;
            this.dessinerEtape(this.etape_id, processusData, that.fAction); 
        }
    }

    this.dessinerEtapePrecedante=function(){
        this.etape_id=Math.max(0, this.etape_id-1);
        let that = this;
        this.dessinerEtape(this.etape_id, processusData, that.fAction);
    }

    this.startAuto=function(){
        // Lancement d'un timer qui boucle, avec 200ms entre chaque action
        let delayBetweenAction = 100;
        this.timerAuto = new repeatFunction(
            this.dessinerEtapeSuivante.bind(this), 
            {count: this.etape_id_max+1, durationsFunction:function(i){return delayBetweenAction*(i+1)}, loop:true}
        );
        this.timerAuto.start();
    }

    this.stopAuto=function(){
        this.timerAuto.stop();
        for(let i = 0; i < this.liensVisible.length; i ++){
            let lien = this.liensVisible[i];
            lien.Visible(false);
        }
    }

    //*************************************************
    // Instructions / Constructeurs

    let that = this;

    // Si le mode n'est pas automatique
    if (autoRun!==true){
        // Affichage de la fenêtre d'actions
        this.fAction = Main.WindowsUICollection.ajouter({id:"ui-actions", title:'Actions', width:'auto', height:'auto'});
        this.fAction.afficher();
        this.dessinerEtapeSuivante();
    } else {
        // Sinon pas de fenêtre d'action
        this.fAction = null;
        this.startAuto();
    }

}

