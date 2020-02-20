async function tu_DataUi_LoadData(){

    try {

        // Ajout d'une fenêtre
        let f1 = Main.WindowsUICollection.ajouter({id:1, title:"Exemple", width:'auto', height:'auto'});
        f1.afficher();
        
        await Main.LoadData("./data/codeisalive.json");

        generateTable(f1.dom, toto[0]);

    }
    catch(err){
        console.log(err);
    }

}