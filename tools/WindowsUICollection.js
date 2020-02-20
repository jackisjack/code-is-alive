 // Classe du contenu à Fenêtres
 let WindowsUICollection = function(domParent){
    this.items=[];
  	this.domParent = domParent;
    this.gerer = function(id){
      for(let i =0; i < this.items.length; i++){
        if (this.items[i].dom.id==id){
          return this.items[i];
        }
      }
    	return null;
    };
    this.ajouter = function({id, title, width, height, extraprops}){
    	let domParent = this.domParent;
      let tmpFenetre = new WindowUI({id, domParent, title, width, height, extraprops});
      this.items.push(tmpFenetre);
      return tmpFenetre;
    };
  }

