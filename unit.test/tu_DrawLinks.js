// Build test contexte
function ctu_DrawLink(){

        // L'élement de gauche
        var Element1 = ViewCollection_js.FocusedView.AjouterElement({
            Icone: "petitcarrebleu", 
            Libelle: "Element 1",
            IdObjet: 1, 
            x: 500,
            y: 200 
        });
        
        // Element(s) de droite
        var TabElement=[];
        
        for(var j=0;j < 40;j++){
            
            var Element = ViewCollection_js.FocusedView.AjouterElement({
            Icone: "petitcarrebleu", 
            Libelle: "Element " + (j + 2),
            IdObjet: j+2, 
            x: 1000,
            y: 140 + j*50
            });
            
            TabElement.push(Element);
        
        }
        
        // Focus au bon endroit
        ViewCollection_js.FocusedView.Focus(800,222,0);

        return {Element1:Element1,TabElement:TabElement}

}

function tu_DrawLinkLeftLeft(){

    // Contexte du test
    var context = ctu_DrawLink();
    var Element1 = context.Element1;
    var TabElement = context.TabElement;


    ViewCollection_js.FocusedView.AjouterLien(
                    {
                        ElementDepart:TabElement[0],
                        ElementArrivee:TabElement[30],
                        Style: EnumStyleLien.Style5,
                        Position: EnumPositionLien.GaucheGauche,
                        ParamStyle: {nbIcone:3, Icone:"file"},
                        Color:"#18ad2c"
                    });
           
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
                    ViewCollection_js.FocusedView.AjouterLien(
                                        {
                                            ElementDepart:Element1,
                                            ElementArrivee:TabElement[i],
                                            Style: EnumStyleLien.Style5,
                                            Position: EnumPositionLien.DroiteGauche,
                                            ParamStyle: {nbIcone:3, Icone:"file"}
                                        })
                        );
            
    }

    // Suppression de tous les liens
    for (let i = 0 ; i < TableauLien.length ; i++)
    {
        setTimeout(() => ViewCollection_js.FocusedView.SupprimerLien(TableauLien[i]), 30000)
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
            ViewCollection_js.FocusedView.AjouterLien(
                                        {
                                            ElementDepart:Element1,
                                            ElementArrivee:TabElement[i],
                                            Style: EnumStyleLien.Style4,
                                            Position: EnumPositionLien.DroiteGauche,
                                            Color:"#18ad2c"
                                        })
                        );
            
    }

    // Suppression de tous les liens
    for (let i = 0 ; i < TableauLien.length ; i++)
    {
        setTimeout(() => ViewCollection_js.FocusedView.SupprimerLien(TableauLien[i]), 3000)
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
            ViewCollection_js.FocusedView.AjouterLien(
                                        {
                                            ElementDepart:Element1,
                                            ElementArrivee:TabElement[i],
                                            Style: EnumStyleLien.Style3,
                                            Position: EnumPositionLien.DroiteGauche,
                                            Color:"#18ad2c"
                                        })
                        );
            
    }

    // Suppression de tous les liens
    for (let i = 0 ; i < TableauLien.length ; i++)
    {
        setTimeout(() => ViewCollection_js.FocusedView.SupprimerLien(TableauLien[i]), 3000)
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
            ViewCollection_js.FocusedView.AjouterLien(
                                        {
                                            ElementDepart:Element1,
                                            ElementArrivee:TabElement[i],
                                            Style: EnumStyleLien.Style2,
                                            Position: EnumPositionLien.DroiteGauche,
                                            Color:"#18ad2c"
                                        })
                        );
            
    }

    // Suppression de tous les liens
    for (let i = 0 ; i < TableauLien.length ; i++)
    {
        setTimeout(() => ViewCollection_js.FocusedView.SupprimerLien(TableauLien[i]), 100000)
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
            ViewCollection_js.FocusedView.AjouterLien(
                                        {
                                            ElementDepart:Element1,
                                            ElementArrivee:TabElement[i],
                                            Style: EnumStyleLien.Style1,
                                            Position: EnumPositionLien.DroiteGauche,
                                            Color:"#18ad2c"
                                        })
                        );
            
    }

    // Suppression de tous les liens
    for (let i = 0 ; i < TableauLien.length ; i++)
    {
        setTimeout(() => ViewCollection_js.FocusedView.SupprimerLien(TableauLien[i]), 3000)
    }

}