var VueClass = Class.extend({

    initialize: function (ParametresVue) {

        // Stockage au niveau de la vue de la liste de toutes les références de ses objets enfants (pour faciliter la recherche d'un objet par exemple) = linéarisation des données.

        this.ListeElement = [];
        this.ListeSelection = [];
        this.ListeLien = [];

        // Variable pseudo-globale pour les composants essentiels de la scène
        
        this.canvas = document.getElementById(ParametresVue.IdCanvas);
        
        this.stage = new createjs.Stage(this.canvas);
        this.mainContainer = null;

        // Récupération de la taille de la fenêtre

        var w = document.body.clientWidth;
        var h = document.body.clientHeight;

        // Nom de la vue (vide car pas encore enregistré)

        this.NomVue = ParametresVue.NomVue;
        this.IdVue = ParametresVue.IdVue;

        // Création de la scène

        this.stage.enableDOMEvents(false); // nécessaire pour reset
        this.stage.canvas = document.getElementById("MainCanvas");
        this.stage.enableDOMEvents(true);
        this.stage.snapToPixelsEnabled = true;
        this.stage.autoClear = true;
        this.stage.canvas.width = w; // essentiel pour le fullscreen : le overflow en css
        this.stage.canvas.height = h;
        document.body.style.cursor = "url(https://cdn.glitch.com/1f9a81fa-715f-4b6a-abac-840468608b33%2Fgrab.cur?v=1574021115660), auto";
        this.stage.enableMouseOver();
        createjs.Touch.enable(this.stage);

        // Création du container principal dans lequel seront ajoutés tous les objets.

        this.mainContainer = new createjs.Container();
        this.mainContainer.snapToPixel = true;
        this.mainContainer.x = ParametresVue.mainContainerX;
        this.mainContainer.y = ParametresVue.mainContainerY;
        this.stage.addChild(this.mainContainer);

        /*************************************************/
        // Evènements

        var self = this; // va savoir pourquoi j'écris ça... (maintenant je sais, mais c'est pas mieux)

        // Evènements pour glisser-déplacer la scène

        this.stage.addEventListener("stagemouseup", function (e) { self.handleMouseUp(e); });
        this.stage.addEventListener("stagemousedown", function (e) { self.handleMouseDown(e); });
        this.stage.addEventListener("stagemousemove", function (e) { self.handleMouseMove(e); });

        // Evènement pour dézoom

        if (window.addEventListener)
            /** DOMMouseScroll is for mozilla. */
            window.addEventListener('DOMMouseScroll', function (e) { self.wheel(e); }, false);
        /** IE/Opera. */
        window.onmousewheel = document.onmousewheel = function (e) { self.wheel(e); };

        // Evènement pour ajustement du ratio si redimensionnement de la fenêtre

        window.addEventListener("resize", function (e) { self.handleResize(e); });

        // Dessin de la grille

        this.DessinerGrille();

    },

    // Carte resize auto

    lastX: -1, // coordonnées de la souris entre mouse down et mouse up
    lastY: -1,
    firstlastX: -1, // coordonnées du premier mouse down
    firstlastY: -1,
    ZoomInProgress: false,
    ActualRatio: 1,

    handleResize: function () {

        // scale du canvas

        var w = document.body.clientWidth;
        var h = document.body.clientHeight * 0.99;  // sorry for 0.99 : asp.net forced me

        this.stage.canvas.width = w;
        this.stage.canvas.height = h;

    },

    // Carte zoommable

    wheel: function (event) {
        
        var delta = 0;
        if (!event) /* For IE. */
            event = window.event;
        if (event.wheelDelta) { /* IE/Opera. */
            delta = event.wheelDelta / 120;
        } else if (event.detail) { /** Mozilla case. */
            /** In Mozilla, sign of delta is different than in IE.
             * Also, delta is multiple of 3.
             */
            delta = -event.detail / 3;
        }
        /** If delta is nonzero, handle it.
         * Basically, delta is now positive if wheel was scrolled up,
         * and negative, if wheel was scrolled down.
         */
        if (delta) {
            // Si aucun zoom en cours
            if (!this.ZoomInProgress) {

                // Si Wheel down
                if (delta < 0) {
                    this.Zoom(0.5);

                    // Diffusion de l'évènement
                    //MacroEventsManager.SomethingHappened("Dezoom", null);

                }

                // Si Wheel up (et impossibilité de zoomer davantage que le ratio initial) 
                if (delta > 0 && this.ActualRatio < 8) {
                    this.Zoom(1 / 0.5);

                    // Diffusion de l'évènement
                    //MacroEventsManager.SomethingHappened("Zoom", null);

                }

            }

        }

    },

    Zoom: function (ratiozoom) {

        this.ZoomInProgress = true;
        this.ActualRatio = this.ActualRatio * ratiozoom;
        
        // zoom qui garantie que le centre reste au centre

        var pos_x_centre = this.stage.canvas.width / 2;
        var pos_y_centre = this.stage.canvas.height / 2;

        var ecart_x_container_centre = this.mainContainer.x - pos_x_centre;
        var ecart_y_container_centre = this.mainContainer.y - pos_y_centre;

        var that = this;

        var tween = createjs.Tween
            .get(this.mainContainer)
            .to({
                scaleX: this.mainContainer.scaleX * ratiozoom,
                scaleY: this.mainContainer.scaleY * ratiozoom,
                x: this.mainContainer.x - ecart_x_container_centre * (1 - ratiozoom),
                y: this.mainContainer.y - ecart_y_container_centre * (1 - ratiozoom)
            },
            300,
            createjs.Ease.linear)
            .call(function () { // A la fin du zoom
                // il faut dire que c'est terminé
                that.ZoomInProgress = false;
                // affichage du zoom
                var zoom='1'; 
                if (that.mainContainer.scaleX < 1)
                {
                  zoom = '1/' + (1 / that.mainContainer.scaleX)
                } else
                {
                  zoom = that.mainContainer.scaleX
                }  
                $("#zoomratio").text('zoom: ' + zoom); // affichage sous forme de fraction
            });

        //MacroEventsManager.SomethingHappened("ZoomRatio", { Ratio: that.mainContainer.scaleX * ratiozoom });

    },

    // Carte déplaçable

    /* Les coordonnées de la souris en référentiel graphique */
    MousePosX: 0,
    MousePosY: 0,

    handleMouseDown: function (evt) {
        
        this.lastX = evt.stageX;
        this.lastY = evt.stageY;
        this.firstlastX = evt.stageX;
        this.firstlastY = evt.stageY;

        document.body.style.cursor = "url(https://cdn.glitch.com/1f9a81fa-715f-4b6a-abac-840468608b33%2Fgrabbing.cur?v=1574021115756), auto";

    },

    handleMouseMove: function (evt) {
      
        /* coordonnées de la souris sur la map */

        this.MousePosX = Math.round((evt.stageX - this.mainContainer.x) / this.mainContainer.scaleX);
        this.MousePosY = Math.round((evt.stageY - this.mainContainer.y) / this.mainContainer.scaleY);

        // affichage des coordonnées

        $("#x_mouse").text('x: ' + this.MousePosX + ',');
        $("#y_mouse").text('y: ' + this.MousePosY + ',');
        
        /* déclenché en cas de drag drop du main container ou d'un objet/hub */

        if (this.lastX !== -1 && this.lastY !== -1) {

            var stageX = evt.stageX;
            var stageY = evt.stageY;

            var diffX = stageX - this.lastX;
            var diffY = stageY - this.lastY;

            this.lastX = stageX;
            this.lastY = stageY;

            this.mainContainer.x += diffX;
            this.mainContainer.y += diffY;
           
        }

    },

    handleMouseUp: function (evt) {

        this.lastX = -1;
        this.lastY = -1;

        document.body.style.cursor = "url(https://cdn.glitch.com/1f9a81fa-715f-4b6a-abac-840468608b33%2Fgrab.cur?v=1574021115660), auto";
    },
    
    SupprimerToutesLesFormes: function () {

        this.mainContainer.removeAllChildren();

    },

    // Fonctions d'affichage d'élément basiques au sein de la scène

    QuelqueChoseAuMilieu: function () {

        var circle = new createjs.Shape();
        var diametre = 500;
        circle.graphics.setStrokeStyle(20);
        circle.graphics.beginFill(getRandomColor());
        //circle.graphics.drawRect((stage.canvas.width / stage.scaleX) / 2, (stage.canvas.height / stage.scaleY) / 2, 20, 20);
        var x = (this.stage.canvas.width / this.stage.scaleX) / 2;
        var y = (this.stage.canvas.height / this.stage.scaleY) / 2;
        x = ArrondirAu(x, 50);
        y = ArrondirAu(y, 50);
        circle.alpha = 1;
        circle.graphics.drawCircle(0, 0, 22);
        circle.x = x;
        circle.y = y;
        circle.scaleX = 0;
        circle.scaleY = 0;

        this.mainContainer.addChild(circle);

        this.ObjetEnCoursDeCreation = circle;

    },

    DessinerGrille: function () {

        var taille_carreau = 25;
        this.taille_carreau = 25;

        var longeur_trait = 1000 * taille_carreau;
        var NbLigne = 1000;

        var x1 = (-(taille_carreau * NbLigne) / 2);
        var y1 = (-(taille_carreau * NbLigne) / 2);

        for (var i = 0; i < NbLigne; i++) {
            this.DrawLine(x1 + i * taille_carreau, y1, x1 + i * taille_carreau, y1 + longeur_trait);
        }

        for (var j = 0; j < NbLigne; j++) {
            this.DrawLine(x1, y1 + j * taille_carreau, x1 + longeur_trait, y1 + j * taille_carreau);
        }

    },

    DrawLine: function (startX, startY, endX, endY) {

        var line = new createjs.Shape();
        line.graphics.setStrokeStyle(1);
        line.graphics.beginStroke("#DFE9F0");
        line.graphics.moveTo(startX, startY);
        line.graphics.lineTo(endX, endY);
        line.graphics.endStroke;

        this.mainContainer.addChild(line);

    },
 
    DrawRect: function (ObjetCoordRect, color) {

        var rect = new createjs.Shape();

        rect.graphics
            .beginStroke(color)
            .drawRect(0, 0, ObjetCoordRect.w, ObjetCoordRect.h);

        rect.x = ObjetCoordRect.x;
        rect.y = ObjetCoordRect.y;

        this.mainContainer.addChild(rect);

        return rect;

    },

    AjouterTexte: function (X, Y, contenu) {

        // Le texte
        var text = new createjs.Text();
        text.set({
            text: contenu,
            textAlign: 'left',
            font: '12px Arial',
            color: 'black'
        });
        text.x = X;
        text.y = Y;
        text.lineWidth = 600;
        text.lineHeight = 20;

        this.mainContainer.addChild(text);
    },

    // Gestion des éléments de la vue

    AjouterElement: function (Args) {

        var that = this;

        // instantiation du nouvel objet
        var nouvelElement = new ElementClass(
                                            {
                                                Vue:that,
                                                Icone: Args.Icone,
                                                IdObjet: Args.IdObjet,
                                                Libelle: Args.Libelle,
                                                x: Args.x,
                                                y: Args.y
                                            }
                                        );                                 

        this.ListeElement.push(nouvelElement);

        return nouvelElement;

    },

    // Gestion des objets de la vue

    AjouterLien: function (Args) {

        var that = this;

        // instantiation du nouvel objet
        var nouveauLien = new LienClass(
                                            {
                                                Vue:that,
                                                ElementDepart:Args.ElementDepart,
                                                ElementArrivee:Args.ElementArrivee,
                                                Style: Args.Style,
                                                ParamStyle: Args.ParamStyle
                                            }
                                        );                                 

        this.ListeLien.push(nouveauLien);

        return nouveauLien;

    },

    ClicObjet: function (Element) {
        
        // centralisation de la gestion de l'évènement clic au niveau de la vue, 
        // de façon à gérer simplement ses impacts sur les enfants
        switch (VariablesGlobales.TypeSelection)
        {
            case EnumModeAction.Explorer:
                // sélectionner l'objet
                this.Selectionner(Element);
                break;
        }
       
    },

    Selectionner: function (Element) {

        switch (VariablesGlobales.TypeSelection) {

            case EnumModeAction.Explorer:

                // Désélection de l'ensemble
                
                for (i = 0; i < this.ListeSelection.length; i++) {
                    this.DeSelectionner(this.ListeSelection[i]);
                }

                this.ListeSelection = [];

                // Visuel de la sélection
                
                var InnectRect = Element.innerRect();
                var AngleSize = 10;
                var RightMargin = 10;

                // Encadrement
                var line = new createjs.Shape();
                line.graphics.setStrokeStyle(1);
                line.graphics.beginStroke("rgba(0,0,0, 0.5)");

                line.graphics.moveTo(0,0);
                line.graphics.lineTo(AngleSize, 0);
                line.graphics.moveTo(InnectRect.w + RightMargin - AngleSize,0);
                line.graphics.lineTo(InnectRect.w + RightMargin, 0);
                line.graphics.lineTo(InnectRect.w + RightMargin, AngleSize);
                line.graphics.moveTo(InnectRect.w + RightMargin, InnectRect.h  - AngleSize);
                line.graphics.lineTo(InnectRect.w + RightMargin, InnectRect.h);
                line.graphics.lineTo(InnectRect.w + RightMargin - AngleSize, InnectRect.h);
                line.graphics.moveTo(AngleSize, InnectRect.h);
                line.graphics.lineTo(0, InnectRect.h);
                line.graphics.lineTo(0, InnectRect.h - AngleSize);
                line.graphics.moveTo(0, AngleSize);
                line.graphics.lineTo(0, 0);

                line.graphics.endStroke;

                line.ThisShapeIsCreatedBySelection = 1; // useful to delete that shape later (unselect method)

                Element.Container.addChild(line);

                // Ajout de la sélection en mémoire

                this.ListeSelection.push(Element);

                break;
                
            default:
                console('abruti de développeur !');
                break;
        }

    },

    DeSelectionner: function (Objet) {

        for (var i = 0  ; i < Objet.Container.children.length ; i++) {
            if (Objet.Container.children[i].ThisShapeIsCreatedBySelection !== undefined){
                Objet.Container.removeChild(Objet.Container.children[i]);
            }
        }
        
    },

    Focus: function (x, y) {

        // Verrouilage des autres zoom pendant que celui ci fonctionne

        this.ZoomInProgress = true;

        var w = document.body.clientWidth;
        var h = document.body.clientHeight;

        // zoom qui garantie que le centre reste au centre
        var pos_x_final = ((w / 2) - x * this.mainContainer.scaleX) ;
        var pos_y_final = ((h / 2) - y * this.mainContainer.scaleY) ;
        
        var that = this;

        var tween = createjs.Tween
            .get(this.mainContainer)
            .to({
                x: pos_x_final,
                y: pos_y_final
            },
            1000,
            createjs.Ease.cubicOut)
            .call(function () { that.ZoomInProgress = false; });

    }
    
});
