function initializationUserInterface(){

    // Création du contenu à fenêtres
    Main.Fenetres = new FenetresCollection(document.getElementsByTagName('body')[0]);

    // Création de la fenêtre ui-process
    ui_process();

}

function ui_process(){

  // Création de la fenêtre du choix des processus
  let f1 = Main.Fenetres.ajouter(
    {
    id:"ui-process",
    title:"Choix du processus", 
    width:'400', 
    height:'200', 
    extraprops: 
                {
                    buttons: 
                    {
                        Valider: function() {
                            let that = this;
                            ui_process_Valider_Click(that);
                        },
                        Annuler: function() {
                            $(this).dialog("close");
                        }
                    }
                }
    });
    
    // Build combobox process
    let selectprocess = dom(f1.dom, {node:"select", id:"selectprocess", class:"form-control"});

    // Combobox option : each process
    for(let i = 0; i < Main.Processus.length; i++){
        dom(selectprocess, {node:"option"}, Main.Processus[i].Nom);
    }

}

function ui_process_Valider_Click(that){

    // Récupération de la valeur sélectionnée
    let selectedValue = that.querySelector("#selectprocess").value;
    let selectedProcessus =  Main.Processus.filter(x => x.Nom==selectedValue)[0];

    // Définition d'un nouveau processus controlable
    Main.ProcessusControlable = new ProcessusDessin(Graphisme.VueFocus, selectedProcessus);

    // Fermeture de la fenêtre actuelle
    $(that).dialog("close");

}