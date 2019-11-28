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
        
        // Focus au bon endroit
        Graphisme.VueFocus.Focus(800,222,0);

        return {Element1:Element1,TabElement:TabElement}

}

function tu_DrawLink5(){

    // Contexte du test
    var context = ctu_DrawLink();
    var Element1 = context.Element1;
    var TabElement = context.TabElement;
    var TableauLien = []

    // Affichage de tous les liens
    for (let i = 0 ; i < TabElement.length ; i++)
    {

        TableauLien.push(
                        Graphisme.VueFocus.AjouterLien(
                                        {
                                            ElementDepart:Element1,
                                            ElementArrivee:TabElement[i],
                                            Style: EnumStyleLien.Style5,
                                            ParamStyle: {nbIcone:3, Icone:"file"}
                                        })
                        );
            
    }

    // Suppression de tous les liens
    for (let i = 0 ; i < TableauLien.length ; i++)
    {
        setTimeout(() => Graphisme.VueFocus.SupprimerLien(TableauLien[i]), 30000)
    }

}

function tu_DrawLink4(){

    // Contexte du test
    var context = ctu_DrawLink();
    var Element1 = context.Element1;
    var TabElement = context.TabElement;
    var TableauLien = []

    // Affichage de tous les liens
    for (let i = 0 ; i < TabElement.length ; i++)
    {

        TableauLien.push(
                        Graphisme.VueFocus.AjouterLien(
                                        {
                                            ElementDepart:Element1,
                                            ElementArrivee:TabElement[i],
                                            Style: EnumStyleLien.Style4
                                        })
                        );
            
    }

    // Suppression de tous les liens
    for (let i = 0 ; i < TableauLien.length ; i++)
    {
        setTimeout(() => Graphisme.VueFocus.SupprimerLien(TableauLien[i]), 3000)
    }

}

function tu_DrawLink3(){

    // Contexte du test
    var context = ctu_DrawLink();
    var Element1 = context.Element1;
    var TabElement = context.TabElement;
    var TableauLien = []

    // Affichage de tous les liens
    for (let i = 0 ; i < TabElement.length ; i++)
    {

        TableauLien.push(
                        Graphisme.VueFocus.AjouterLien(
                                        {
                                            ElementDepart:Element1,
                                            ElementArrivee:TabElement[i],
                                            Style: EnumStyleLien.Style3
                                        })
                        );
            
    }

    // Suppression de tous les liens
    for (let i = 0 ; i < TableauLien.length ; i++)
    {
        setTimeout(() => Graphisme.VueFocus.SupprimerLien(TableauLien[i]), 3000)
    }
       
}

function tu_DrawLink2(){

    // Contexte du test
    var context = ctu_DrawLink();
    var Element1 = context.Element1;
    var TabElement = context.TabElement;
    var TableauLien = []

    // Affichage de tous les liens
    for (let i = 0 ; i < TabElement.length ; i++)
    {

        TableauLien.push(
                        Graphisme.VueFocus.AjouterLien(
                                        {
                                            ElementDepart:Element1,
                                            ElementArrivee:TabElement[i],
                                            Style: EnumStyleLien.Style2
                                        })
                        );
            
    }

    // Suppression de tous les liens
    for (let i = 0 ; i < TableauLien.length ; i++)
    {
        setTimeout(() => Graphisme.VueFocus.SupprimerLien(TableauLien[i]), 100000)
    }

    Element1.IconeEtat("webservice");

    // Disparition de l'état
    setTimeout(() => Element1.IconeEtat(null), 300000)

}

function tu_DrawLink1(){

    // Contexte du test
    var context = ctu_DrawLink();
    var Element1 = context.Element1;
    var TabElement = context.TabElement;
    var TableauLien = []

    // Affichage de tous les liens
    for (let i = 0 ; i < TabElement.length ; i++)
    {

        TableauLien.push(
                        Graphisme.VueFocus.AjouterLien(
                                        {
                                            ElementDepart:Element1,
                                            ElementArrivee:TabElement[i],
                                            Style: EnumStyleLien.Style1
                                        })
                        );
            
    }

    // Suppression de tous les liens
    for (let i = 0 ; i < TableauLien.length ; i++)
    {
        setTimeout(() => Graphisme.VueFocus.SupprimerLien(TableauLien[i]), 3000)
    }

}