async function tu_DataUi_LoadData(){

    try {

        // Ajout d'une fenêtre
        let f1 = Main.Fenetres.ajouter({title:"Exemple", width:'auto', height:'auto'});
        f1.afficher();
        
        await Main.LoadData("./data/codeisalive.json");

        generate_table(f1.dom, toto[0]);

    }
    catch(err){
        console.log(err);
    }

}