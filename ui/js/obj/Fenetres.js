 // Classe du contenu à Fenêtres
 let FenetresCollection = function(domParent){
    this.items=[];
  	this.domParent = domParent;
    this.gerer = function(title){
      for(let i =0; i < this.items.length; i++){
        if (this.items[i].title==title){
          return this.items[i];
        }
      }
    	return null;
    };
    this.ajouter = function({id, title, width, height, extraprops}){
    	let domParent = this.domParent;
      let tmpFenetre = new Fenetre({id, domParent, title, width, height, extraprops});
      this.items.push(tmpFenetre);
      return tmpFenetre;
    };
  }

