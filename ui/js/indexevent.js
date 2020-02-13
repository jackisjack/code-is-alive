// Events de la page index.html

function fn_bt_IndexOpen_Click(){

    Main.Fenetres.gerer("ui-process").afficher();

}

function fn_bt_IndexPrevious_Click(){

    Main.ProcessusControlable.dessinerEtapePrecedante();

}

function fn_bt_IndexNext_Click(){

    Main.ProcessusControlable.dessinerEtapeSuivante();

}
