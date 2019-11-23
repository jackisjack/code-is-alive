
var EnumModeAction = {
    Explorer: 0,
    Deplacer: 1
};

function MenuGauche(e, ModeAction) {

    // couleur grise pour tout le monde !

    var AllButtons = document.getElementsByClassName('glyphicon');
    for (var i = 0, len = AllButtons.length; i < len; i++) {
        AllButtons[i].style["color"] = "lightgrey";
    }

    // couleur rouge pour celui sélectionné

    e.style.color = "#5b8bba";

    // en fonction de ce qui est cliqué

    VariablesGlobales.TypeSelection = ModeAction;

    // Comportements spécifiques de l'IHM en fonction du mode

    switch (VariablesGlobales.TypeSelection) {
        case EnumModeAction.Deplacer:
            // cache le menu et déplace les coordonnées en bas
            //$('#MenuDuBas').toggle();
            //$('.menu-bas-droite').css('bottom', '20px');
            break;
        default:
            // affiche le menu et déplace les coordonnées au dessus du menu
            //$('#MenuDuBas').show();
            //$('.menu-bas-droite').css('bottom', '180px');
            break;
        
    }

}