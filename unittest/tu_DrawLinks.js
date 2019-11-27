// Build test contexte
function ctu_DrawLink(){

        // L'élement de gauche
        var Element1 = Graphisme.VueFocus.AjouterElement({
            Icone: "petitcarrebleu", 
            Libelle: "Element 1",
            IdObjet: 1, 
            x: 500,
            y: 200 
        });
        
        // Element(s) de droite
        var TabElement=[];
        
        for(var j=0;j < 4;j++){
            
            var Element = Graphisme.VueFocus.AjouterElement({
            Icone: "petitcarrebleu", 
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

    for (var i = 0 ; i < TabElement.length ; i++)
    {

        Graphisme.VueFocus.AjouterLien(
                                        {
                                            ElementDepart:Element1,
                                            ElementArrivee:TabElement[i],
                                            Style: EnumStyleLien.Style5,
                                            ParamStyle: {nbIcone:3, Icone:"file"}                                            
                                        });
            
    }

}

function tu_DrawLink4(){

    // Contexte du test
    var context = ctu_DrawLink();
    var Element1 = context.Element1;
    var TabElement = context.TabElement;

    for (var i = 0 ; i < TabElement.length ; i++)
    {

        Graphisme.VueFocus.AjouterLien(
                                        {
                                            ElementDepart:Element1,
                                            ElementArrivee:TabElement[i],
                                            Style: EnumStyleLien.Style4
                                        });
            
    }

}

function tu_DrawLink3(){

    // Contexte du test
    var context = ctu_DrawLink();
    var Element1 = context.Element1;
    var TabElement = context.TabElement;

    for (var i = 0 ; i < TabElement.length ; i++)
    {

        Graphisme.VueFocus.AjouterLien(
                                        {
                                            ElementDepart:Element1,
                                            ElementArrivee:TabElement[i],
                                            Style: EnumStyleLien.Style3
                                        });
            
    }
       
}

function tu_DrawLink2(){

    // Contexte du test
    var context = ctu_DrawLink();
    var Element1 = context.Element1;
    var TabElement = context.TabElement;

    for (var i = 0 ; i < TabElement.length ; i++)
    {

        Graphisme.VueFocus.AjouterLien(
                                        {
                                            ElementDepart:Element1,
                                            ElementArrivee:TabElement[i],
                                            Style: EnumStyleLien.Style2
                                        });
            
    }

}

function tu_DrawLink1(){

    // Contexte du test
    var context = ctu_DrawLink();
    var Element1 = context.Element1;
    var TabElement = context.TabElement;

    for (var i = 0 ; i < TabElement.length ; i++)
    {

        Graphisme.VueFocus.AjouterLien(
                                        {
                                            ElementDepart:Element1,
                                            ElementArrivee:TabElement[i],
                                            Style: EnumStyleLien.Style1
                                        });
            
    }

}