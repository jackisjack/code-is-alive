var LienClass = Class.extend({

    initialize: function (ParametresLien) {

        // Contrôle des paramètres
        if (ParametresLien.Vue === null || ParametresLien.Vue === undefined) { console.log('PostCompilation erreur : ParametresLien.Vue'); };
        if (ParametresLien.ElementDepart === null || ParametresLien.ElementDepart === undefined) { console.log('PostCompilation erreur : ParametresLien.ElementDepart'); };
        if (ParametresLien.ElementArrivee === null || ParametresLien.ElementArrivee === undefined) { console.log('PostCompilation erreur : ParametresLien.ElementArrivee'); };
        if (ParametresLien.Style === null || ParametresLien.Style === undefined) { console.log('PostCompilation erreur : ParametresLien.Style'); };
        if (ParametresLien.Position === null || ParametresLien.Position === undefined) { console.log('PostCompilation erreur : ParametresLien.Position'); };
        if (ParametresLien.Visible === null || ParametresLien.Visible === undefined) { ParametresLien.Visible = true };

        // Privatisation du this
        var that = this;

        // La vue - une référence à la vue est stockée dans tous les objets de la vue
        this.Vue = ParametresLien.Vue; // cela permet l'appel de méthode de la vue parente depuis l'enfant

        // Identifiant unique du lien attribué par la vue
        this.IdLien = ParametresLien.IdLien;

        // Container principal du lien
        this.Container = new createjs.Container();
        this.Container.ChildType = EnumChildType.Lien;
        this.Container.x = 0; // Contrairement à l'élément, le container est fixé à 0,0
        this.Container.y = 0;
        
        // Construction du lien
        switch (ParametresLien.Style) {
            case EnumStyleLien.Style1:
                this.DessinerLienStyle1(ParametresLien.ElementDepart, ParametresLien.ElementArrivee, ParametresLien.Position);
            break;
            case EnumStyleLien.Style2:
                this.DessinerLienStyle2(ParametresLien.ElementDepart, ParametresLien.ElementArrivee, ParametresLien.Position);
            break;
            case EnumStyleLien.Style3:
                this.DessinerLienStyle3(ParametresLien.ElementDepart, ParametresLien.ElementArrivee, ParametresLien.Position);
            break;
            case EnumStyleLien.Style4:
                this.DessinerLienStyle4(ParametresLien.ElementDepart, ParametresLien.ElementArrivee, ParametresLien.Position);
            break;
            case EnumStyleLien.Style5:
                this.DessinerLienStyle5(ParametresLien.ElementDepart, ParametresLien.ElementArrivee, ParametresLien.Position, ParametresLien.ParamStyle.nbIcone, ParametresLien.ParamStyle.Icone);
            break;
        }
        
        // Visible ou pas
        this.Visible(ParametresLien.Visible); 

    },

    // rayon entre les deux éléments, longueur max dès le début
    DessinerLienStyle1: function(ElementDepart, ElementArrivee, Position){

        var el1 = ElementDepart.innerRect();
        var el2 = ElementArrivee.innerRect();
      
        var line = new createjs.Shape();
        line.graphics.setStrokeStyle(1);
        line.graphics.beginStroke("#18ad2c");

        // Dessin du lien en fonction de la position
        this.DessinerLien(line, el1, el2, Position);

        line.graphics.endStroke;
        line.alpha=0;
        line.shadow = new createjs.Shadow("#18ad2c", 0, 0, 10);

        this.Container.addChild(line);

        this.tween = createjs.Tween
            .get(line, {loop:true})
            .to({
                alpha: 1 // s'affiche progressivement
            },
            1500,
            createjs.Ease.linear)
            .to({
                alpha: 0, // se masque progressivement
            },
            1000,
            createjs.Ease.linear);

    },

    // flux continu de pointillé qui bouge
    DessinerLienStyle2: function(ElementDepart, ElementArrivee, Position){
        
        let el1 = ElementDepart.innerRect();
        let el2 = ElementArrivee.innerRect();

        let line = new createjs.Shape();
        line.graphics.setStrokeStyle(2);
        let cmd = line.graphics.setStrokeDash([10,10],0).command;
        line.graphics.beginStroke("#18ad2c");
        
        // Dessin du lien en fonction de la position
        this.DessinerLien(line, el1, el2, Position);

        line.graphics.endStroke;

        this.Container.addChild(line);

        this.tween = createjs.Tween
        .get(cmd, {loop:true})
        .to({offset:-20},500, createjs.Ease.linear);

    },

    // Envoi d'un trait
    DessinerLienStyle3: function(ElementDepart, ElementArrivee, Position){

        var el1 = ElementDepart.innerRect();
        var el2 = ElementArrivee.innerRect();
        
        var x1 = el1.x+el1.w+20;
        var x2 = el2.x;
        var y1 = el1.y+el1.h/2;
        var y2 = el2.y+el2.h/2;
             
        let d1 = 100;
        let d2 = y2-y1;
        let d3 = 100;
        let d = d1+d2+d3;
        var size = 0.2*d; // la taille du trait sera 20% de la distance qui sépare les deux points
      
        var line = new createjs.Shape();
        line.graphics.setStrokeStyle(5,"round");
        var cmd = line.graphics.setStrokeDash([size,d],size).command;
        line.graphics.beginStroke("#18ad2c");

        // Dessin du lien en fonction de la position
        this.DessinerLien(line, el1, el2, Position);

        line.graphics.endStroke;
        line.shadow = new createjs.Shadow("#18ad2c", 0, 0, 10);
        this.Container.addChild(line);

        this.tween = createjs.Tween
        .get(cmd, {loop:true})
        .to({offset:-1*d},1500, createjs.Ease.cubicOut);
  
    },

    // Envoi d'un flux de point et dessin d'un trait
    DessinerLienStyle4: function(ElementDepart, ElementArrivee, Position){

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

        // Dessin du lien en fonction de la position
        this.DessinerLien(line2, el1, el2, Position);

        line2.graphics.endStroke;
        line2.alpha = 0.5;
        this.Container.addChild(line2);
        
        // Création du flux de point
        let d1 = 100;
        let d2 = y2-y1;
        let d3 = 100;
        let d = d1+d2+d3;
      
        var line = new createjs.Shape();
        line.graphics.setStrokeStyle(5,"round");
        var cmd = line.graphics.setStrokeDash([2,10,2,10,2,10,2,10,2,10,2,d],56).command;
        line.graphics.beginStroke("#18ad2c");

        // Dessin du lien en fonction de la position
        this.DessinerLien(line, el1, el2, Position);
        
        line.graphics.endStroke;
        line.shadow = new createjs.Shadow("#18ad2c", 0, 0, 10);
        this.Container.addChild(line);
        
        this.tween = createjs.Tween
        .get(cmd, {loop:true})
        .to({offset:-1*d},1500, createjs.Ease.cubicOut);
  
    },

    // Envoi d'un flux d'image
    DessinerLienStyle5: function(ElementDepart, ElementArrivee, Position, nbIcone, Icone){

        let el1 = ElementDepart.innerRect();
        let el2 = ElementArrivee.innerRect();

        let x1 = el1.x+el1.w+20;
        let y1 = el1.y+el1.h/2;
        let x2 = el2.x-20;
        let y2 = el2.y+el2.h/2;
        
        // Création d'une ligne
        var line = new createjs.Shape();
        line.graphics.setStrokeStyle(1);
        line.graphics.beginStroke("black");
        switch (Position) { // courbe ou ligne droite
            case EnumPositionLien.GaucheGauche:

                line.graphics.moveTo(el1.x, el1.y+el1.h/2);
                line.graphics.lineTo(el1.x-100, el1.y+el1.h/2);
                line.graphics.lineTo(el1.x-100, el2.y+el2.h/2);
                line.graphics.lineTo(el2.x, el2.y+el2.h/2);
    
                break;
            case EnumPositionLien.DroiteGauche:

                line.graphics.moveTo(x1, y1);
                line.graphics.lineTo(x2, y2);

                break;
        } 
        line.graphics.endStroke;
        line.alpha = 0.3;
        this.Container.addChild(line);
        
        // Création de i icones
        for(let i = 0; i < nbIcone; i++){
          
            let bitmap =  new createjs.Bitmap(ImageManager.IconeLien.getResult(Icone));

            switch (Position) { // courbe ou ligne droite
            case EnumPositionLien.GaucheGauche:

                let x1 = el1.x - bitmap.image.width/2;
                let y1 = el1.y+el1.h/2 - bitmap.image.height/2;
                let x2 = x1-100;
                let y2 = y1;
                let x3 = x2;
                let y3 = el2.y+el2.h/2 - bitmap.image.height/2;;
                let x4 = el2.x - bitmap.image.width/2;
                let y4 = y3;

                bitmap.x = x1;
                bitmap.y = y1;
                this.Container.addChild(bitmap); 

                this.tween = createjs.Tween
                .get(bitmap, {loop:true})
                .wait(100 + i*200) // attention, il faut aussi changer l'espacement à la ligne du dessous
                .to({guide:{ path:[x1,y1, x1,y1,x2,y2, x2,y2,x3,y3, x3,y3, x4,y4] }}, 3000 - i*200, createjs.Ease.quadInOut)


                break
            case EnumPositionLien.DroiteGauche:

                bitmap.x = x1 - (bitmap.image.height/2);
                bitmap.y = y1 - (bitmap.image.height/2);
                this.Container.addChild(bitmap); 

                // Mise en mouvement des icones
                this.tween = createjs.Tween
                .get(bitmap, {loop:true})
                .wait(100 + i*200) // attention, il faut aussi changer l'espacement à la ligne du dessous
                .to({x:x2, y:y2 -(bitmap.image.height/2)},1500 - i*200, createjs.Ease.cubicOut);

                break
            }

        }

    },

    DessinerLien: function(line, el1, el2, Position){

        switch (Position) { 
            case EnumPositionLien.GaucheGauche:

                if (el1.x < el2.x) {
                    line.graphics.moveTo(el1.x, el1.y+el1.h/2);
                    line.graphics.lineTo(el1.x-50, el1.y+el1.h/2);
                    line.graphics.lineTo(el1.x-50, el2.y+el2.h/2);
                    line.graphics.lineTo(el2.x, el2.y+el2.h/2);
                } 
                else 
                {
                    line.graphics.moveTo(el1.x+el1.w+20, el1.y+el1.h/2);
                    line.graphics.lineTo(el1.x+el1.w+50, el1.y+el1.h/2);
                    line.graphics.lineTo(el1.x+el1.w+50, el2.y+el2.h/2);
                    line.graphics.lineTo(el2.x+el2.w+20, el2.y+el2.h/2);
                }

                break;
            case EnumPositionLien.DroiteGauche:
                if (el1.x < el2.x) {
                    line.graphics.moveTo(el1.x+el1.w+20, el1.y+el1.h/2);
                    line.graphics.lineTo(el2.x, el2.y+el2.h/2);
                }
                else
                {
                    line.graphics.moveTo(el1.x-20, el1.y+el1.h/2);
                    line.graphics.lineTo(el2.x+el2.w+20, el2.y+el2.h/2);
                }
                break;
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
