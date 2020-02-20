function dom(parent, { ...nodeName_and_attributes} = {}, text = null){
  // Création du noeud
  let node = document.createElement(nodeName_and_attributes.node);
	// Définition des attributs
  for (let [key, value] of Object.entries(nodeName_and_attributes)) {
  	if (key!=='node'){
    	node.setAttribute(key, value);
    }
  }
  // Ajout d'un éventuel texte
  if (text!== null){
  	let textnode = document.createTextNode(text);
    if(nodeName_and_attributes.node!==undefined)
    {
    	node.appendChild(textnode);
    }
    else{
    	parent.appendChild(textnode);
    }
  }
  // Ajout au parent
  if(nodeName_and_attributes.node!==undefined){
  	parent.appendChild(node);
  }
  return node;
}

// let div1 = dom(document.body, {node:"div", id:1, class:"toto"});
// dom(div1, {}, "Bonjour tout le monde ");
// dom(div1, {node:"span", class:"badge badge-primary"}, "new");
// dom(div1, {}, " !");

// https://jsfiddle.net/JackIsJack/63x7ne5r/30/
