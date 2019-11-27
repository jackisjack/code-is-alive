var ElementClass = Class.extend({

    initialize: function (ParametresElement) {

        // Contrôle des paramètres
        if (ParametresElement.Vue === null || ParametresElement.Vue === undefined) { console.log('PostCompilation erreur : ParametresElement.Vue'); };
        if (ParametresElement.IdTypeObjet === undefined || ParametresElement.IdTypeObjet === undefined) { console.log('PostCompilation erreur : ParametresElement.IdTypeObjet '); };
        if (ParametresElement.Libelle === null || ParametresElement.Libelle === undefined) { console.log('PostCompilation erreur : ParametresElement.Libelle'); };
        if (ParametresElement.x === null || ParametresElement.x === undefined) { console.log('PostCompilation erreur : ParametresElement.x'); };
        if (ParametresElement.y === null || ParametresElement.y === undefined) { console.log('PostCompilation erreur : ParametresElement.y'); };
        if (ParametresElement.idObjetVue === null || ParametresElement.idObjetVue === undefined) { console.log('PostCompilation erreur : ParametresElement.idObjetVue'); };
        if (ParametresElement.IdObjet === null || ParametresElement.IdObjet === undefined) { console.log('PostCompilation erreur : ParametresElement.IdObjet'); };
        if (ParametresElement.x_delta === null || ParametresElement.x_delta === undefined) { ParametresElement.x_delta=0 };
        if (ParametresElement.y_delta === null || ParametresElement.y_delta === undefined) { ParametresElement.y_delta=0 };
        if (ParametresElement.Forme === null || ParametresElement.Forme === undefined) { console.log('PostCompilation erreur : ParametresElement.Forme'); };
        if (ParametresElement.Visible === null || ParametresElement.Visible === undefined) {ParametresElement.Visible=true};
        
        // Privatisation du this
        var that = this;

        // La vue - une référence à la vue est stockée dans tous les objets de la vue
        this.Vue = ParametresElement.Vue; // cela permet l'appel de méthode de la vue parente depuis l'enfant

        this.idObjetVue = ParametresElement.idObjetVue; // attribué par la vue
        this.IdObjet = ParametresElement.IdObjet; // attribué par la webapi (0 = objet inexistant en base)

        // L'id du type objet et le nom
        this.IdTypeObjet = parseInt(ParametresElement.IdTypeObjet);
        this.Libelle = ParametresElement.Libelle;

        this.Parent = null; // le parent doit être affecté par la méthode 'ajouterEnfant' du parent
 
        // Dimension extérieure / intérieure
        this.P_innerRect = null;
        this.P_outerRect = null;

        // Le delta se calculera au premier besoin, au départ : c'est null
        this.P_DeltaFromFirstElement = null;

        // Container principal de l'objet
        this.Container = new createjs.Container();
        this.Container.ChildType = EnumChildType.Element;

        // tableau de tableau : contient les objets et ses coordonnées
        this.ListeEnfants = []; 

        // Propriétés graphiques
        this.x_delta = ParametresElement.x_delta;
        this.y_delta = ParametresElement.y_delta;
        this.Forme = ParametresElement.Forme;

        // L'image
        this.bitmap =  new createjs.Bitmap(VariablesGlobales.ImagesArray.getResult("petitcarrebleu"));
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
        this.x(ParametresElement.x, EnumTypeCoord.Local);
        this.y(ParametresElement.y, EnumTypeCoord.Local);

        // Visibilité des inner et outer Rect
        this.innerRectShape = new createjs.Shape();
        this.outerRectShape = new createjs.Shape(); // avec les enfants
        this.Container.addChild(this.innerRectShape);
        this.Container.addChild(this.outerRectShape);

        // Calcul du rectangle contenant tous les éléments
        console.log('Objet : ' + this.Libelle + ' | Besoin du innerRect pour la surface cliquable')
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

    },
    
    Draw_innerouterRectShape: function (ObjCoord) {

        if (this.P_innerRect !== null) {

            var x = this.x();
            var y = this.y();
            this.innerRectShape.graphics.clear().setStrokeStyle(1).beginStroke("rgba(0,62,232,1)").drawRect(this.P_innerRect.x - x, this.P_innerRect.y - y, this.P_innerRect.w, this.P_innerRect.h);

        } else {

            this.innerRectShape.graphics.clear();

        }

        if (this.P_outerRect !== null) {
            
            var x = this.x();
            var y = this.y();
            this.outerRectShape.graphics.clear().setStrokeStyle(1).beginStroke("rgba(49,205,27,1)").drawRect(this.P_outerRect.x - x - 1, this.P_outerRect.y - y - 1, this.P_outerRect.w + 2, this.P_outerRect.h + 2);

        } else {

            this.outerRectShape.graphics.clear();

        }
    },

    ElementSauvegarde: function () {

        var IdParent;
        if (this.Parent === null) {
            IdParent = -1
        } else {
            IdParent = this.Parent.idObjetVue;
        }

        return {
            IDELEMENTVUE: this.idObjetVue,
            IDELEMENTVUEPARENT: IdParent,
            IDOBJET: this.IdObjet,
            IDTYPEOBJETVUE: this.IdTypeObjet,
            LIBELLE: this.Libelle,
            X: this.x(),
            Y: this.y(),
            X_DELTA: this.x_delta,
            Y_DELTA: this.y_delta,
            FORME: this.Forme
        }

    },

    x: function (_x, _EnumTypeCoord) {

        if (_x !== undefined) {

            _x = parseInt(_x);

            if (_EnumTypeCoord === EnumTypeCoord.Global) {
                var Delta = this.DeltaFromFirstElement()
                this.Container.x = _x - Delta.x;
            } else {
                this.Container.x = _x;
            }
            //this.P_x = _x;
            this.P_x = this.Container.x;
        } else {

            if (_EnumTypeCoord === EnumTypeCoord.Global) {
                //var Delta = this.DeltaFromFirstElement()
                //return this.P_x + Delta.x;
            } else {
                //return this.P_x;
            }
            return this.Container.x;
        }

    },

    y: function (_y, _EnumTypeCoord) {

        if (_y !== undefined) {

            _y = parseInt(_y);

            if (_EnumTypeCoord === EnumTypeCoord.Global) {
                var Delta = this.DeltaFromFirstElement();
                this.Container.y = _y - Delta.y;
            } else {
                this.Container.y = _y;
            }
            //this.P_y = _y;
            this.P_y = this.Container.y;
        } else {

            if (_EnumTypeCoord === EnumTypeCoord.Global) {
                var Delta = this.DeltaFromFirstElement();
                return this.P_y + Delta.y;
            } else {
                return this.P_y;
            }

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

        this.Draw_innerouterRectShape();

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

        this.Draw_innerouterRectShape();
        
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

    Visible: function (_visible) {

        if (_visible !== undefined) {

            if (_visible === true) {

                if (this.Parent !== null) {
                    this.Parent.Container.addChild(this.Container);
                }
                else {
                    this.Vue.mainContainer.addChild(this.Container);
                }
                this.P_Visible = true;
            }

            if (_visible === false) {

                if (this.Parent !== null) { // si on n'est pas le cas exceptionnel où l'objet n'est pas encore attaché à un hub

                    this.Parent.Container.removeChild(this.Container);
                }

                this.P_Visible = false;
            }

        }

        return this.P_Visible;

    },

    DeltaFromFirstElement: function (Reset) {

        if (Reset === undefined) { // si aucun arguement n'est passé c'est que l'on souhaite connaitre le delta existant

            // ...calcul du delta

            var Element = this;
            var x = 0;
            var y = 0;
            while (Element.Parent !== null) {

                x = x + Element.Parent.Container.x;
                y = y + Element.Parent.Container.y;

                Element = Element.Parent;

            }

            this.P_DeltaFromFirstElement = { x: x, y: y };

            return this.P_DeltaFromFirstElement;

        } else { // si un argument est passé, cela signifie que l'on reset

            this.P_DeltaFromFirstHub = null; // reset du delta

        }
    },

    TU_AfficherReference: function () {
        alert('Objet cliqué est :' + this.TypeObjet + ' - ' + this.Libelle);
    },

    Actualiser: function () {

        // si c'est un hub sans objet, rien à faire

        if (this.ListeEnfants.length === 0) {
            return;
        }

        // Affichage des objets non encore ajoutés (on parcours chacun des objets)

        for (i = 0; i < this.ListeEnfants.length; i++) {

            if (this.ListeEnfants[i][0].Visible() === false) {

                this.ListeEnfants[i][0].Visible(true);

            }

        }

        // Calcul des coordonnées des objets selon les règles du hub

        this.CalculerCoordonnees();

        // Déplacement des objets vers les coordonnées calculés.

        for (i = 0; i < this.ListeEnfants.length; i++) {

            this.ListeEnfants[i][0].DeplacerParTween(
                this.ListeEnfants[i][1][0], // ième item, objet, coordonnées, x
                this.ListeEnfants[i][1][1] // ième item, objet, coordonnées, y
            );
        }

    },

    CalculerCoordonnees: function () {

        switch (this.Forme) {

            case EnumPositionImage.EnLigneVertical:

                // Définition des marges
                var MarginH = 5;
                var MarginW = 20;

                // Calcul du nombre d'enfant de l'élément en cours d'actualisation
                var NbEnfants = this.ListeEnfants.length;

                // Dimension interne de l'élément en cours d'actualisation
                var wParent;
                var hParent;

                console.log('Objet : ' + this.Libelle + ' | Calcul des futures coordonnées des enfants. On commence par soi-même');

                var Dimension = this.innerRect(); // c'est sa dimension qui servira de marge gauche minimal
                wParent = Dimension.w; // récupération de la largeur du parent
                hParent = Dimension.h; // permet l'alignement vertical'

                var HauteurTotal = 0;

                for (i = 0; i < NbEnfants; i++) {

                    // récupération des dimensions complètes uniquement pour la hauteur

                    console.log('Objet : ' + this.Libelle + ' | Calcul des futures coordonnées des enfants. InnerRect de lenfant');

                    var InnerObjet = this.ListeEnfants[i][0].innerRect();

                    console.log('Objet : ' + this.Libelle + ' | Calcul des futures coordonnées des enfants. OuterRect de lenfant');

                    var OuterObjet = this.ListeEnfants[i][0].outerRect();

                    // coordonnée x

                    var x = this.x_delta
                            + wParent
                            + (InnerObjet.x - OuterObjet.x)
                            + MarginW;

                    // coordonnée y

                    var y = HauteurTotal // incrémenté ci-après
                            + (InnerObjet.y - OuterObjet.y) // voir schéma slide 42
                            + this.y_delta; // delta personnalisable par le mouvement

                    // incrémentation de la hauteur

                    HauteurTotal = HauteurTotal // 0 au début
                                 + OuterObjet.h; // taille de l'objet que l'on vient de placer

                    // affectation des coordonnées

                    this.ListeEnfants[i][1] = [x, y];

                }

                // alignement vertical des objets (car la longueur totale est connnue à présent)

                for (i = 0; i < NbEnfants; i++) {

                    this.ListeEnfants[i][1][1] = this.ListeEnfants[i][1][1] - HauteurTotal / 2 + hParent / 2

                }

                console.log('Objet : ' + this.Libelle + ' | Fin du calcul des coordonnées des enfants');

                break;


        }
    },
    
    AffecterEnfant: function (Element) {

        var that = this;

        // Le parent fait rentrer dans la tête de l'enfant : 
        // 'le parent c'est moi'
        Element.Parent = that;

        // Ajout de l'objet dans la mémoire du hub
        this.ListeEnfants.push([
            Element,
            [0, 0] // coordonnées affectés par le hub
        ]);

        this.Vue.ResetRemontant(Element.Parent);
    }

});
