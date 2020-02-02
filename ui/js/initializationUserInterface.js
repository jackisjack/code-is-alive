function initializationUserInterface(){

    // Création du contenu à fenêtres
    Main.Fenetres = new FenetresCollection(document.getElementsByTagName('body')[0]);

    // Création de la fenêtre du choix des processus
    let f1 = Main.Fenetres.ajouter(
    {
    id:"ui-process",
    title:"Choix du processus", 
    width:'400', 
    height:'250', 
    extraprops: 
                {
                    buttons: 
                    {
                        Valider: function() {
                        $( this ).dialog("close");
                        },
                        Annuler: function() {
                        $( this ).dialog("close");
                        }
                    }
                }
    });
    
    // Build combobox process
    let cb_selectprocess =  document.createElement('select');
    cb_selectprocess.setAttribute('class', 'form-control');
    cb_selectprocess.id = 'selectprocess';
    f1.dom.appendChild(cb_selectprocess);

    // Combobox option : each process
    for(let i = 0; i < Main.Processus.length; i++){
        let option =  document.createElement('option');
        option.innerHTML = Main.Processus[i].Nom;
        document.getElementById("selectprocess").appendChild(option);
    }

}