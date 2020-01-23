 // Classe Fenêtre
 let Fenetre = function({newid, domParent, title, width, height, extraprops}){
		
    // Sauvegarde des propriétés
  	this.domParent=domParent;
  	this.title=title;
    this.width=width;
    this.height=height;
    
    // Création du DOM
    this.dom =  document.createElement('div');
    this.dom.setAttribute('title', title);
    this.dom.id = newid;
    
    domParent.appendChild(this.dom);
    
    // Création de la fenêtre
    $( "#" + this.dom.id).dialog(
       Object.assign( // fusion de deux objets
                      {
                      resizable: true,
                      height: this.height,
                      width: this.width,
                      modal: false,
                      autoOpen: false,
                      position:{
                                my: 'left top',
                                at: 'left+30 top+80'
                                }
                      },
                      extraprops
        )
      );
      
    this.afficher = function(){

			$("#" + this.dom.id).dialog("open");
      
    };
    
  }