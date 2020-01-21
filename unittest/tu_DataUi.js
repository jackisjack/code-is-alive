function tu_DataUi(){
    
    // Création d'un conteneur à fenêtre
    let Fenetres = new FenetresCollection(document.getElementsByTagName('body')[0]);

    // Ajout d'une fenêtre
    let f1 = Fenetres.ajouter({title:"Exemple", width:'auto', height:'auto'});
    f1.Afficher();

    let dataTableH = 
    [
    [">","E-mail","HashedPassword"],
    ["","Titi[r]","4#z567,,"],
    ["","Toto[d]","[c]7z4#!7541"],
    ["r","toto@yahoo.fr","45aeaze"],
    ["c","toto@yahoo.fr","45aeaze"]
    ];

    let dataTableV = 
    [
    ["r","username","WonderWall"],
    ["c","HashedPassword","1zz)°234"],
    ["u","Trucmuche","00000"]
    ];
  
    generate_table(f1.dom, dataTableH);
    generate_table(f1.dom, dataTableV);

}