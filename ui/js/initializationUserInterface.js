function initializationUserInterface(){

    // Création du contenu à fenêtres
    Main.Fenetres = new FenetresCollection(document.getElementsByTagName('body')[0]);

    // Création de la fenêtre ui-process
    ui_process_Load();

}

function ui_process_Load(){

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

    // Combobox
    dom(selectprocess, {node:"option"}, "Voir tous les processus");

    // Combobox option : each process
    for(let i = 0; i < Main.Processus.length; i++){
        dom(selectprocess, {node:"option"}, Main.Processus[i].Nom);
    }

}

function ui_process_Valider_Click(that){

    // Récupération de la valeur sélectionnée
    let selectedValue = that.querySelector("#selectprocess").value;
    
    // Si l'utilisateur souhaite voir tous les processus
    if (selectedValue == "Voir tous les processus"){
        // Définition des couleurs
        let arrColor = ["#18ad2c","#e752d3"]
        // Affichage des processus
        for(let i = 0; i < Main.Processus.length; i++){
        new ProcessusDessin(Graphisme.VueFocus, Main.Processus[i], true, arrColor[i]);
        }

    } else { // Si l'utilisateur a sélectionné un processus

        let selectedProcessus =  Main.Processus.filter(x => x.Nom==selectedValue)[0];
        // Définition d'un nouveau processus controlable
        Main.ProcessusControlable = new ProcessusDessin(Graphisme.VueFocus, selectedProcessus, false, "#18ad2c");
        
    }

    // Fermeture de la fenêtre actuelle
    $(that).dialog("close");

}

