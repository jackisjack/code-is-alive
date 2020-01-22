var ElementClass = Class.extend({

    initialize: function (ParametresElement) {

        // Contrôle des paramètres
        if (ParametresElement.Vue === null || ParametresElement.Vue === undefined) { console.log('PostCompilation erreur : ParametresElement.Vue'); };
        if (ParametresElement.Icone === undefined || ParametresElement.Icone === undefined) { console.log('PostCompilation erreur : ParametresElement.Icone'); };
        if (ParametresElement.Libelle === null || ParametresElement.Libelle === undefined) { console.log('PostCompilation erreur : ParametresElement.Libelle'); };
        if (ParametresElement.x === null || ParametresElement.x === undefined) { console.log('PostCompilation erreur : ParametresElement.x'); };
        if (ParametresElement.y === null || ParametresElement.y === undefined) { console.log('PostCompilation erreur : ParametresElement.y'); };
        if (ParametresElement.IdObjet === null || ParametresElement.IdObjet === undefined) { console.log('PostCompilation erreur : ParametresElement.IdObjet'); };
        if (ParametresElement.Visible === null || ParametresElement.Visible === undefined) {ParametresElement.Visible=true};
        
        // Privatisation du this
        var that = this;

        // La vue - une référence à la vue est stockée dans tous les objets de la vue
        this.Vue = ParametresElement.Vue; // cela permet l'appel de méthode de la vue parente depuis l'enfant

        this.IdObjet = ParametresElement.IdObjet; 

        // L'id du type objet et le nom
        this.Icone = ParametresElement.Icone;
        this.Libelle = ParametresElement.Libelle;

        // Dimension extérieure / intérieure
        this.P_innerRect = null;
        this.P_outerRect = null;

        // Icone d'état
        this.Etatbitmap = null;

        // Container principal de l'objet
        this.Container = new createjs.Container();
        this.Container.ChildType = EnumChildType.Element;
  
        // L'image
        let icone = ImageManager.IconeElement.getResult(this.Icone);
        if(icone===null){
            throw('L\'icone '+ this.Icone + ' est introuvable');
        }
        this.bitmap =  new createjs.Bitmap(ImageManager.IconeElement.getResult(this.Icone));
        this.bitmap.ChildType = EnumChildType.Bitmap; // typage du child pour bien faire sa mesure
        this.bitmap.ReferenceToObjet = this; // nécessaire pour récupérer la référence du bitmap au clic

        var text = new createjs.Text();
        text.set({
            text: that.Libelle,
            textAlign: 'left',
            font: '12px Arial',
            color: 'black'
        });
        
        text.lineHeight = 10;
        text.x = this.bitmap.image.width + 5;
        text.y = (this.bitmap.image.height / 2.0) - (text.lineHeight / 2.0);
        text.ChildType = EnumChildType.Text; // typage du child pour bien faire sa mesure
        this.text = text;

        // Ajout au container des éléments principaux
        this.Container.addChild(this.bitmap);
        this.Container.addChild(this.text);

        // Position du texte et de l'image
        this.x(ParametresElement.x);
        this.y(ParametresElement.y);

          // Calcul du rectangle contenant tous les éléments
        var minnerRect = this.innerRect();

        // Création de la surface cliquable
        this.hit = new createjs.Shape();
        this.hit.graphics.beginFill("rgba(128, 128, 128, 0.01)").rect(0, 0, minnerRect.w, minnerRect.h); // ...transparente
        this.hit.cursor = "pointer";
        this.hit.ChildType = EnumChildType.SurfaceCliquable;
        this.hit.ReferenceToBitmap = this.bitmap;
        this.Container.addChild(this.hit);

        // Ce qui touche la surface cliquable, touche le bitmap
        this.bitmap.hitArea = this.hit;
        
        // L'évènement clic sur la surface cliquable
        this.hit.addEventListener("click", function (e) { that.Vue.ClicObjet(that); });
        
        // Visible ou pas
        this.Visible(ParametresElement.Visible); 

        // Ajout des propriétés custom
        this.customProperties= ParametresElement.customProperties;
        
    },

    x: function (_x, _EnumTypeCoord) {

        if (_x !== undefined) {

            _x = parseInt(_x);

            this.Container.x = _x;
  
            this.P_x = this.Container.x;

        } else {

            return this.Container.x;
        }

    },

    y: function (_y, _EnumTypeCoord) {

        if (_y !== undefined) {

            _y = parseInt(_y);
            
            this.Container.y = _y;
            
            this.P_y = this.Container.y;

        } else {
            
            return this.P_y;

        }

    },

    innerRect: function (Reset) { // renvoi un objet rectangle {x,y,w,h} en coordonnées réels.

        if (Reset !== undefined) {
            console.log('Objet : ' + this.Libelle + ' | Reset inner/outer');
            this.P_innerRect = null;
            this.outerRect(null); // outer n'a plus de sens si inner est null'
            return null;
        }

        // si les dimensions n'ont jamais été calculées ou ont été remises à null

        if (this.P_innerRect === this.P_innerRect) { //=== this.P_innerRect) {

            // alors on les calcul 

            var TableauDeRectangles = [];

            for (var i = 0 ; i < this.Container.children.length ; i++) {

                switch (this.Container.children[i].ChildType) {

                    case EnumChildType.Bitmap:

                        TableauDeRectangles.push(
                            {
                                x: this.x() + this.Container.children[i].x,
                                y: this.y() + this.Container.children[i].y,
                                w: this.Container.children[i].image.width,
                                h: this.Container.children[i].image.height
                            }
                        );
                        break;

                    case EnumChildType.Text:

                        TableauDeRectangles.push(
                            {
                                x: this.x() + this.Container.children[i].x,
                                y: this.y() + this.Container.children[i].y,
                                w: this.Container.children[i].getMeasuredWidth(),
                                h: this.Container.children[i].getMeasuredHeight()
                            }
                        );
                        break;
                    case EnumChildType.Element:
                        break;
                    case EnumChildType.SurfaceCliquable:
                        break;
                  case undefined:
                        break;
                    default:
                        console.log('tu as raté un truc mon loulou : ' + this.Container.children[i].ChildType);
                        break;
                }

            }

            this.P_innerRect = UnionRect(TableauDeRectangles);
            
            //console.log('Objet : ' + this.Libelle + ' | Fin du calcul innerRect. résultat :' + JSON.stringify(this.P_innerRect));

        } else {

            //console.log('Objet : ' + this.Libelle + ' | Simple renvoi du innerRect précalculé. résultat :' + JSON.stringify(this.P_innerRect));

        }

        return this.P_innerRect;

    },

    outerRect: function (Reset) {

        // renvoi le rectangle des limites max du hub incluant 
        // ses éléments enfants directs

        if (Reset !== undefined) {
            
            this.P_outerRect = null;
            return null;
        }

        if (this.ListeEnfants.length === 0) {
            console.log('Objet : ' + this.Libelle + ' | Aucun enfant donc outerRect = innerRect');
            return this.innerRect();
        }

        if (this.P_outerRect === this.P_outerRect) { //=== this.P_outerRect) {

            var TableauDeRectangles = [];

            // Ajout des dimensions de l'élément courant
            console.log('Objet : ' + this.Libelle + ' | Pour le calcul du outerrect, il faut connnaitre son propre innerRect');
            var MeInnerRect = this.innerRect();

            TableauDeRectangles.push(MeInnerRect);

            // Pour chacun des enfants
            for (var i = 0; i < this.ListeEnfants.length; i++) {

                // Récupération de la dimension des enfants

                console.log('Objet : ' + this.Libelle + ' | Pour le calcul du outerrect, il faut connnaitre le outerRect de son enfant');
                var EnfantOuterRect = this.ListeEnfants[i][0].outerRect();

                // Traduction des coordonnées de l'enfant dans l'élément courant
                EnfantOuterRect.x = EnfantOuterRect.x + MeInnerRect.x;
                EnfantOuterRect.y = EnfantOuterRect.y + MeInnerRect.y;

                // Ajout dans le tableau
                TableauDeRectangles.push(EnfantOuterRect);

            }
            
            // Récupération d'un unique tableau englobant tous les autres
            this.P_outerRect = UnionRect(TableauDeRectangles);

            
            console.log('Objet : ' + this.Libelle + ' | Fin du calcul OuterRect. résultat :' + JSON.stringify(this.P_outerRect));

        } else {

            console.log('Objet : ' + this.Libelle + ' | Simple renvoi du OuterRect précalculé. résultat :' + JSON.stringify(this.P_outerRect));

        }

        return this.P_outerRect;

    },

    DeplacerParTween: function (_x_cible, _y_cible) {

        var x_cible_rect = ArrondirAu(_x_cible, 1);
        var y_cible_rect = ArrondirAu(_y_cible, 1);

        // c'est comme si on y était...
        this.P_x = x_cible_rect;
        this.P_y = y_cible_rect;

        this.innerRect(null);
        this.outerRect(null);

        var that = this;

        // tween du container
        var tween = createjs.Tween
            .get(this.Container)
            .to({
                x: x_cible_rect,
                y: y_cible_rect
            },
            500,
            createjs.Ease.sineOut);

    },

    Selectionner: function () {
        this.Vue.Selectionner(this);
    },

    Focus: function(){
        let innerRect = this.innerRect();
        this.Vue.Focus(innerRect.x+innerRect.w/2, innerRect.y+innerRect.h/2, 1000);
    },

    Visible: function (_visible) {

        if (_visible === true) {

            this.Vue.mainContainer.addChild(this.Container);

            this.P_Visible = true;
        }

        if (_visible === false) {

            this.Vue.mainContainer.removeChild(this.Container);
            
            this.P_Visible = false;
        }

        return this.P_Visible;

    },

    IconeEtat: function(IconeEtat){
        
        // Définir la valeur
        if (IconeEtat!==undefined){

            // Si c'est null, c'est qu'on supprime
            if (IconeEtat === null){
                this.Container.removeChild(this.Etatbitmap);
            } 
            else  // sinon on ajoute
            {
                let bitmap =  new createjs.Bitmap(ImageManager.IconeEtat.getResult(IconeEtat));
                bitmap.x -= (bitmap.image.width + 10)
                bitmap.ChildType = EnumChildType.Lien;

                let tween = createjs.Tween
                    .get(bitmap, {loop:true})
                    .to({
                        y: bitmap.y - 10
                    },
                    500,
                    createjs.Ease.backIn)
                    .to({
                        y: bitmap.y
                    },
                    150,
                    createjs.Ease.linear)
                    ;

                this.Container.addChild(bitmap);

                this.Etatbitmap = bitmap;
                this.Etatbitmap.NomIcone = IconeEtat;

            }
            
        } else {

            return this.Etatbitmap.NomIcone;

        }


    }

});
