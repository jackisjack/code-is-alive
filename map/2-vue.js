var VueClass = Class.extend({

    initialize: function (ParametresVue) {

        // Stockage au niveau de la vue de la liste de toutes les références de ses objets enfants (pour faciliter la recherche d'un objet par exemple) = linéarisation des données.

        this.ListeElement = [];
        this.ListeSelection = [];

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

        // Initialisation de variable nécessaire au mode 'ModeMouseOnly'

        this.ModeMouseMoveOnly_InitialiserVariables();

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
    ObjetToMove: null,

    handleMouseDown: function (evt) {
        
        this.lastX = evt.stageX;
        this.lastY = evt.stageY;
        this.firstlastX = evt.stageX;
        this.firstlastY = evt.stageY;

        if (VariablesGlobales.TypeSelection === EnumModeAction.Deplacer) {

            // On récupère la surface cliquable ci-dessous (si clic sur un élément, ou null si le clic s'effectue sur le MainContainer)
            this.ObjetToMove = this.stage.getObjectUnderPoint(evt.stageX, evt.stageY, 2);

            if (this.ObjetToMove !== null) {
                // On utilise la référence vers le bitmap
                this.ObjetToMove = this.ObjetToMove.ReferenceToBitmap;

            }
        }

        document.body.style.cursor = "url(https://cdn.glitch.com/1f9a81fa-715f-4b6a-abac-840468608b33%2Fgrabbing.cur?v=1574021115756), auto";

    },

    ModeMouseMoveOnly_InitialiserVariables: function () {
        this.ModeMouseMoveOnly = false; 
        this.MouvementEnCours_Droite = -1;
        this.MouvementEnCours_Gauche = -1;
        this.MouvementEnCours_Haute = -1;
        this.MouvementEnCours_Basse= -1;
        this.MouvementDelta = 50;
        this.MouvementFrequence =100;
    },

    handleMouseMove: function (evt) {
      
        /* coordonnées de la souris sur la map */

        this.MousePosX = Math.round((evt.stageX - this.mainContainer.x) / this.mainContainer.scaleX);
        this.MousePosY = Math.round((evt.stageY - this.mainContainer.y) / this.mainContainer.scaleY);

        // affichage des coordonnées

        $("#x_mouse").text('x: ' + this.MousePosX + ',');
        $("#y_mouse").text('y: ' + this.MousePosY + ',');
        
        /* déclenché en cas de drag drop du main container ou d'un objet/hub */

        if (this.lastX !== -1 && this.lastY !== -1 && this.ModeMouseMoveOnly === false) {

            var stageX = evt.stageX;
            var stageY = evt.stageY;

            var diffX = stageX - this.lastX;
            var diffY = stageY - this.lastY;

            this.lastX = stageX;
            this.lastY = stageY;

            if (this.ObjetToMove===null)
            {
                this.mainContainer.x += diffX;
                this.mainContainer.y += diffY;
            }
            else
            {   

                var posX = this.MousePosX - this.ObjetToMove.image.width / 2;
                var posY = this.MousePosY - this.ObjetToMove.image.height / 2;

                // Déplacement de l'objet/hub

                this.ObjetToMove.ReferenceToObjet.x(posX, EnumTypeCoord.Global); // 'ObjetToMove' n'est que le bitmap... ReferenceToObjet permet de remonter à l'objet/hub surjacent
                this.ObjetToMove.ReferenceToObjet.y(posY, EnumTypeCoord.Global); 

            }
        }

        /* déclenché en cas de MouseMoveOnly */

        if (this.ModeMouseMoveOnly === true) {

            var bordure_gauche = 0.25 * this.stage.canvas.width;
            var bordure_droite = 0.75 * this.stage.canvas.width;
            var bordure_haute = 0.25 * this.stage.canvas.height;
            var bordure_basse = 0.75 * this.stage.canvas.height;

            // si la souris est dans la zone gauche

            var that = this;

            if (evt.stageX < bordure_gauche && this.MouvementEnCours_Gauche === -1) {
                this.MouvementEnCours_Gauche = setInterval(function () { that.mainContainer.x += that.MouvementDelta; }, this.MouvementFrequence);
            }
            else if (this.MouvementEnCours_Gauche !== -1 && evt.stageX > bordure_gauche) {
                clearInterval(this.MouvementEnCours_Gauche);
                this.MouvementEnCours_Gauche = -1;
            }

            // si la souris est dans la zone droite

            if (evt.stageX > bordure_droite && this.MouvementEnCours_Droite === -1) {
                this.MouvementEnCours_Droite = setInterval(function () { that.mainContainer.x -= that.MouvementDelta; }, this.MouvementFrequence);
            }
            else if (this.MouvementEnCours_Droite !== -1 && evt.stageX < bordure_droite) {
                clearInterval(this.MouvementEnCours_Droite);
                this.MouvementEnCours_Droite = -1;
            }

            // si la souris est dans la zone haute

            if (evt.stageY < bordure_haute && this.MouvementEnCours_Haute === -1) {
                this.MouvementEnCours_Haute = setInterval(function () { that.mainContainer.y += that.MouvementDelta; }, this.MouvementFrequence);
            }
            else if (this.MouvementEnCours_Haute !== -1 && evt.stageY > bordure_haute) {
                clearInterval(this.MouvementEnCours_Haute);
                this.MouvementEnCours_Haute = -1;
            }

            // si la souris est dans la zone basse

            if (evt.stageY > bordure_basse && this.MouvementEnCours_Basse === -1) {
                this.MouvementEnCours_Basse = setInterval(function () { that.mainContainer.y -= that.MouvementDelta; }, this.MouvementFrequence);
            }
            else if (this.MouvementEnCours_Basse !== -1 && evt.stageY < bordure_basse) {
                clearInterval(this.MouvementEnCours_Basse);
                this.MouvementEnCours_Basse = -1;
            }

        }

    },

    handleMouseUp: function (evt) {

        var that = this;

        this.lastX = -1;
        this.lastY = -1;
        this.ObjetToMove = null;

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
    
    // rayon entre les deux éléments, longueur max dès le début
    DrawLink1: function (element1, element2) {

        var el1 = element1.innerRect();
        var el2 = element2.innerRect();
      
        var line = new createjs.Shape();
        line.graphics.setStrokeStyle(1);
        line.graphics.beginStroke("#18ad2c");
        line.graphics.moveTo(el1.x+el1.w+20, el1.y+el1.h/2);
        line.graphics.lineTo(el2.x, el2.y+el2.h/2);
        line.graphics.endStroke;
        line.alpha=0;
        line.shadow = new createjs.Shadow("#18ad2c", 0, 0, 10);

        this.mainContainer.addChild(line);

        var tween = createjs.Tween
            .get(line, {loop:true})
            .to({
                alpha: 1 // s'affiche progressivement
            },
            500,
            createjs.Ease.linear)
            .to({
                alpha: 0, // se masque progressivement
            },
            500,
            createjs.Ease.linear);
        
        // return them so we can delete them later
        var bunchofshapes = []
        bunchofshapes.push(line);
        return bunchofshapes

    },
    
    // flux continu de pointillé qui bouge
    DrawLink2: function (element1, element2) {

        var el1 = element1.innerRect();
        var el2 = element2.innerRect();
       
        var line = new createjs.Shape();
        line.graphics.setStrokeStyle(2);
        var cmd = line.graphics.setStrokeDash([10,10],0).command;
        line.graphics.beginStroke("#18ad2c");
        line.graphics.moveTo(el1.x+el1.w+20, el1.y+el1.h/2);
        line.graphics.lineTo(el2.x, el2.y+el2.h/2);
        line.graphics.endStroke;
        this.mainContainer.addChild(line);
       
        var tween = createjs.Tween
        .get(cmd, {loop:true})
        .to({offset:-20},500, createjs.Ease.linear);
        
        // return them so we can delete them later
        var bunchofshapes = []
        bunchofshapes.push(line);
        return bunchofshapes
    },
  
    // Envoi d'un trait
    DrawLink3: function (element1, element2) {

        var el1 = element1.innerRect();
        var el2 = element2.innerRect();
        
        var x1 = el1.x+el1.w+20;
        var x2 = el2.x;
        var y1 = el1.y+el1.h/2;
        var y2 = el2.y+el2.h/2;
             
        var d = Math.pow(Math.pow(x2-x1,2) + Math.pow(y2-y1,2),0.5);
        var size = 0.2*d; // la taille du trait sera 20% de la distance qui sépare les deux points
      
        var line = new createjs.Shape();
        line.graphics.setStrokeStyle(5,"round");
        var cmd = line.graphics.setStrokeDash([size,d],size).command;
        line.graphics.beginStroke("#18ad2c");
        line.graphics.moveTo(x1, y1);
        line.graphics.lineTo(x2, y2);
        line.graphics.endStroke;
        line.shadow = new createjs.Shadow("#18ad2c", 0, 0, 10);
        this.mainContainer.addChild(line);
        
        var tween = createjs.Tween
        .get(cmd, {loop:true})
        .to({offset:-1*d},1500, createjs.Ease.cubicOut);
         
    },
    
    // Envoi d'un flux de point et dessin d'un trait
    DrawLink4: function (element1, element2) {

        var el1 = element1.innerRect();
        var el2 = element2.innerRect();
        
        var x1 = el1.x+el1.w+20;
        var x2 = el2.x;
        var y1 = el1.y+el1.h/2;
        var y2 = el2.y+el2.h/2;
        
        // Création de la ligne continue
        var line2 = new createjs.Shape();
        line2.graphics.setStrokeStyle(1);
        line2.graphics.beginStroke("#18ad2c");
        line2.graphics.moveTo(x1, y1);
        line2.graphics.lineTo(x2, y2);
        line2.graphics.endStroke;
        line2.alpha = 0.5;
        this.mainContainer.addChild(line2);
        
        // Création du flux de point
        var d = Math.pow(Math.pow(x2-x1,2) + Math.pow(y2-y1,2),0.5);
      
        var line = new createjs.Shape();
        line.graphics.setStrokeStyle(5,"round");
        var cmd = line.graphics.setStrokeDash([2,10,2,10,2,10,2,10,2,10,2,d],56).command;
        line.graphics.beginStroke("#18ad2c");
        line.graphics.moveTo(x1, y1);
        line.graphics.lineTo(x2, y2);
        line.graphics.endStroke;
        line.shadow = new createjs.Shadow("#18ad2c", 0, 0, 10);
        this.mainContainer.addChild(line);
        
        var tween = createjs.Tween
        .get(cmd, {loop:true})
        .to({offset:-1*d},1500, createjs.Ease.cubicOut);
         
    },
    
    // Envoi d'un flux d'image
    DrawLink5: function (element1, element2, nbIcone, iconname) {
      
      var el1 = element1.innerRect();
      var el2 = element2.innerRect();
      var x1 = el1.x+el1.w+20;
      var y1 = el1.y+el1.h/2;
      var x2 = el2.x-20;
      var y2 = el2.y+el2.h/2;
     
      // Création d'une ligne
      var line2 = new createjs.Shape();
      line2.graphics.setStrokeStyle(1);
      line2.graphics.beginStroke("black");
      line2.graphics.moveTo(x1, y1);
      line2.graphics.lineTo(x2, y2);
      line2.graphics.endStroke;
      line2.alpha = 0.3;
      this.mainContainer.addChild(line2);
      
      // Création de i icones
      for(var i = 0; i < nbIcone; i++){
        
        var bitmap =  new createjs.Bitmap(VariablesGlobales.ImagesArray.getResult(iconname));
        bitmap.x = x1 - (bitmap.image.height/2);
        bitmap.y = y1 - (bitmap.image.height/2);
        this.mainContainer.addChild(bitmap); 

        // Mise en mouvement des icones
        var tween = createjs.Tween
        .get(bitmap, {loop:true})
        .wait(100*i)
        .to({x:x2, y:y2 -(bitmap.image.height/2)},1500, createjs.Ease.cubicOut);
    
      }

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

    // Gestion des objets de la vue

    AjouterElement: function (Args) {

        var that = this;

        // instantiation du nouvel objet
        var nouvelElement = new ElementClass(
                                            {
                                                Vue:that,
                                                IdTypeObjet: Args.IdTypeObjet,
                                                idObjetVue: this.ListeElement.length,
                                                IdObjet: Args.IdObjet,
                                                Libelle: Args.Libelle,
                                                x: Args.x,
                                                y: Args.y,
                                                Forme: Args.Forme,
                                                x_delta: Args.x_delta,
                                                y_delta: Args.y_delta
                                            }
                                        );                                 

        this.ListeElement.push(nouvelElement);

        return nouvelElement;

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

                //*****************************************************
                //********************** DEBUG ************************

                // debug : visibilité de l'objet sauvegardé
                
                //console.log(JSON.stringify(Element.ElementSauvegarde()));
                
                // debug : visibilité des limites
                //console.log('INNER rect : ' + JSON.stringify());
                //console.log('OUTER rect : ' + JSON.stringify(Element.outerRect()));
                
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

    },

    ActualiserTout: function () {

        // pour chacun des éléments sans parent..

        for (var k = 0; k < this.ListeElement.length; k++) {

            if (this.ListeElement[k].Parent === null) {

                this.ActualisationDescendante(this.ListeElement[k]);

            }

        }

    },

    VueSauvegarde: function () {
        return {
            IDVUE: this.IdVue,
            LIBELLE: this.NomVue,
            MAINCONTAINERX: parseInt(this.mainContainer.x),
            MAINCONTAINERY: parseInt(this.mainContainer.y)
        };
    },
    
    SupprimerListeShapes:function (bunchofshapes){
        for(var i = 0; i < bunchofshapes.length; i++){
            this.mainContainer.removeChild(bunchofshapes[i]);
        }
    }
    
});
