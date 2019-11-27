var LienClass = Class.extend({

    initialize: function (ParametresLien) {

        // Contrôle des paramètres
        if (ParametresLien.Vue === null || ParametresLien.Vue === undefined) { console.log('PostCompilation erreur : ParametresLien.Vue'); };
        if (ParametresLien.ElementDepart === null || ParametresLien.ElementDepart === undefined) { console.log('PostCompilation erreur : ParametresLien.ElementDepart'); };
        if (ParametresLien.ElementArrivee === null || ParametresLien.ElementArrivee === undefined) { console.log('PostCompilation erreur : ParametresLien.ElementArrivee'); };
        if (ParametresLien.Style === null || ParametresLien.Style === undefined) { console.log('PostCompilation erreur : ParametresLien.Style'); };
        if (ParametresLien.Visible === null || ParametresLien.Visible === undefined) { ParametresLien.Visible = true };

        // Privatisation du this
        var that = this;

        // La vue - une référence à la vue est stockée dans tous les objets de la vue
        this.Vue = ParametresLien.Vue; // cela permet l'appel de méthode de la vue parente depuis l'enfant

        // Container principal du lien
        this.Container = new createjs.Container();
        this.Container.ChildType = EnumChildType.Lien;
        this.Container.x = 0; // Contrairement à l'élément, le container est fixé à 0,0
        this.Container.y = 0;
        
        // Construction du lien
        switch (ParametresLien.Style) {
            case EnumStyleLien.Style1:
                this.DessinerLienStyle1(ParametresLien.ElementDepart, ParametresLien.ElementArrivee);
            break;
            case EnumStyleLien.Style2:
                this.DessinerLienStyle2(ParametresLien.ElementDepart, ParametresLien.ElementArrivee);
            break;
            case EnumStyleLien.Style3:
                this.DessinerLienStyle3(ParametresLien.ElementDepart, ParametresLien.ElementArrivee);
            break;
            case EnumStyleLien.Style4:
                this.DessinerLienStyle4(ParametresLien.ElementDepart, ParametresLien.ElementArrivee);
            break;
            case EnumStyleLien.Style5:
                this.DessinerLienStyle5(ParametresLien.ElementDepart, ParametresLien.ElementArrivee, ParametresLien.ParamStyle.nbIcone, ParametresLien.ParamStyle.Icone);
            break;
        }
        
        // Visible ou pas
        this.Visible(ParametresLien.Visible); 

    },

    // rayon entre les deux éléments, longueur max dès le début
    DessinerLienStyle1: function(ElementDepart, ElementArrivee){

        var el1 = ElementDepart.innerRect();
        var el2 = ElementArrivee.innerRect();
      
        var line = new createjs.Shape();
        line.graphics.setStrokeStyle(1);
        line.graphics.beginStroke("#18ad2c");
        line.graphics.moveTo(el1.x+el1.w+20, el1.y+el1.h/2);
        line.graphics.lineTo(el2.x, el2.y+el2.h/2);
        line.graphics.endStroke;
        line.alpha=0;
        line.shadow = new createjs.Shadow("#18ad2c", 0, 0, 10);

        this.Container.addChild(line);

        this.tween = createjs.Tween
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

    },

    // flux continu de pointillé qui bouge
    DessinerLienStyle2: function(ElementDepart, ElementArrivee){
        
        var el1 = ElementDepart.innerRect();
        var el2 = ElementArrivee.innerRect();

        var line = new createjs.Shape();
        line.graphics.setStrokeStyle(2);
        var cmd = line.graphics.setStrokeDash([10,10],0).command;
        line.graphics.beginStroke("#18ad2c");
        line.graphics.moveTo(el1.x+el1.w+20, el1.y+el1.h/2);
        line.graphics.lineTo(el2.x, el2.y+el2.h/2);
        line.graphics.endStroke;
        this.Container.addChild(line);

        this.tween = createjs.Tween
        .get(cmd, {loop:true})
        .to({offset:-20},500, createjs.Ease.linear);

    },

    // Envoi d'un trait
    DessinerLienStyle3: function(ElementDepart, ElementArrivee){

        var el1 = ElementDepart.innerRect();
        var el2 = ElementArrivee.innerRect();
        
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
        this.Container.addChild(line);

        this.tween = createjs.Tween
        .get(cmd, {loop:true})
        .to({offset:-1*d},1500, createjs.Ease.cubicOut);
  
    },

    // Envoi d'un flux de point et dessin d'un trait
    DessinerLienStyle4: function(ElementDepart, ElementArrivee){

        var el1 = ElementDepart.innerRect();
        var el2 = ElementArrivee.innerRect();
        
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
        this.Container.addChild(line2);
        
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
        this.Container.addChild(line);
        
        this.tween = createjs.Tween
        .get(cmd, {loop:true})
        .to({offset:-1*d},1500, createjs.Ease.cubicOut);
  
    },

    // Envoi d'un flux d'image
    DessinerLienStyle5: function(ElementDepart, ElementArrivee, nbIcone, Icone){

        var el1 = ElementDepart.innerRect();
        var el2 = ElementArrivee.innerRect();
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
        this.Container.addChild(line2);
        
        // Création de i icones
        for(var i = 0; i < nbIcone; i++){
          
          var bitmap =  new createjs.Bitmap(VariablesGlobales.ImagesArray.getResult(Icone));
          bitmap.x = x1 - (bitmap.image.height/2);
          bitmap.y = y1 - (bitmap.image.height/2);
          this.Container.addChild(bitmap); 
  
          // Mise en mouvement des icones
          this.tween = createjs.Tween
          .get(bitmap, {loop:true})
          .wait(100*i)
          .to({x:x2, y:y2 -(bitmap.image.height/2)},1500, createjs.Ease.cubicOut);
      
        }

    },

    Selectionner: function () {
        this.Vue.Selectionner(this);
    },

    Visible: function (_visible) {

        if (_visible !== undefined) {

            if (_visible === true) {

                this.Vue.mainContainer.addChild(this.Container);

                this.P_Visible = true;
            }

            if (_visible === false) {

                this.Vue.mainContainer.removeChild(this.Container);

                this.P_Visible = false;
            }

        }

        return this.P_Visible;

    }
    
});
