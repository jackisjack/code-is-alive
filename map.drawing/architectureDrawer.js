function architectureDrawer(Elements){

    // Recherche des entêtes attendues
    let colElement = Elements[0].findIndex(x => x=='Element');
    let colNiveau = Elements[0].findIndex(x => x=='Niveau');
    let colIcone = Elements[0].findIndex(x => x=='Icone');

    let deltax = 0
    let y_i = 300;
    let max_x = 500;
    let margin=100;
    let layer_id=-1;

    // Lecture de tous les éléments
    for(var i = 1; i < Elements.length ; i++){
        
        // Si le niveau 0, alors qu'il s'agit d'une couche = une nouvelle colonne d'éléments
        if(Elements[i][colNiveau]=='0'){
            y=y_i;
            x=max_x+margin;
            deltax=0
            layer_id+=1;
        } // sinon on complète la colonne, en tenant compte de l'indentation
        else {
            deltax=Elements[i][colNiveau]*20;
            y+=30;
        }

        let Element = ViewCollection_js.FocusedView.AjouterElement({
            Icone: (Elements[i][colIcone]=='' ? 'blackbox' : Elements[i][colIcone]), 
            Libelle: Elements[i][colElement],
            IdObjet: 1, 
            x: x+deltax,
            y: y,
            customProperties:{layer_id:layer_id}
        });
        
        let dimElement = Element.innerRect();
        max_x = Math.max(max_x, dimElement.w + dimElement.x);

    }

}