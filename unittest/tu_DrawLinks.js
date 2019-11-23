function ctu_DrawLink(){

        // L'élement de gauche
        var Element1 = Graphisme.VueFocus.AjouterElement({
            IdTypeObjet: EnumTypeObjet.PetitCarre, 
            Libelle: "Element 1",
            IdObjet: 1, 
            x: 500,
            y: 200 
        });
        
        // Element(s) de droite
        var TabElement=[];
        
        for(var j=0;j < 4;j++){
            
            var Element = Graphisme.VueFocus.AjouterElement({
            IdTypeObjet: EnumTypeObjet.PetitCarre, 
            Libelle: "Element " + (j + 2),
            IdObjet: j+2, 
            x: 1000,
            y: 140 + j*50
            });
            
            TabElement.push(Element);
        
        }

        return {Element1:Element1,TabElement:TabElement}

}

function tu_DrawLink5(){

    // Contexte du test
    var context = ctu_DrawLink();
    var Element1 = context.Element1;
    var TabElement = context.TabElement;

    // Création de link entre la gauche et la droite
    TabElement.map(x => {
                        // simple répéteur
                        tween = createjs.Tween
                        .get(null)
                        .to({},1100 + Math.random()*500,createjs.Ease.linear) // hasard de la durée
                        .call(function () { // à la fin de la durée random
                        Graphisme.VueFocus.DrawLink5(Element1, x, 1, "pdf"); 
                        });
                    });

}

function tu_DrawLink4(){

    // Contexte du test
    var context = ctu_DrawLink();
    var Element1 = context.Element1;
    var TabElement = context.TabElement;

    // Création de link entre la gauche et la droite
    TabElement.map(x => {
                        // simple répéteur
                        tween = createjs.Tween
                        .get(null)
                        .to({},1100 + Math.random()*500,createjs.Ease.linear) // hasard de la durée
                        .call(function () { // à la fin de la durée random
                        Graphisme.VueFocus.DrawLink4(Element1, x); 
                        });
                    });

}

function tu_DrawLink3(){

    // Contexte du test
    var context = ctu_DrawLink();
    var Element1 = context.Element1;
    var TabElement = context.TabElement;

    // Création de link entre la gauche et la droite
    TabElement.map(x => {
                        // simple répéteur
                        tween = createjs.Tween
                        .get(null)
                        .to({},1100 + Math.random()*500,createjs.Ease.linear) // hasard de la durée
                        .call(function () { // à la fin de la durée random
                        Graphisme.VueFocus.DrawLink3(Element1, x); 
                        });
                    });


                    
}

function tu_DrawLink2(){

    // Contexte du test
    var context = ctu_DrawLink();
    var Element1 = context.Element1;
    var TabElement = context.TabElement;

    // Création de link entre la gauche et la droite
    TabElement.map(x => {
                        // simple répéteur
                        tween = createjs.Tween
                        .get(null)
                        .to({},1100 + Math.random()*500,createjs.Ease.linear) // hasard de la durée
                        .call(function () { // à la fin de la durée random
                        Graphisme.VueFocus.DrawLink2(Element1, x); 
                        });
                    });

}

function tu_DrawLink1(){

    // Contexte du test
    var context = ctu_DrawLink();
    var Element1 = context.Element1;
    var TabElement = context.TabElement;

    // Création de link entre la gauche et la droite
    TabElement.map(x => {
                        // simple répéteur
                        tween = createjs.Tween
                        .get(null)
                        .to({},1100 + Math.random()*500,createjs.Ease.linear) // hasard de la durée
                        .call(function () { // à la fin de la durée random
                        Graphisme.VueFocus.DrawLink1(Element1, x); 
                        });
                    });

}