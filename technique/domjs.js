function dom(parent, nodeName = null,  { ...attributes } = {}, text = null){
    // Création du noeud
    let node = document.createElement(nodeName);
      // Définition des attributs
    for (let [key, value] of Object.entries(attributes)) {
      node.setAttribute(key, value);
    }
    // Ajout d'un éventuel texte
    if (text!== null){
        let textnode = document.createTextNode(text);
      if(nodeName!==null)
      {
          node.appendChild(textnode);
      }
      else{
          parent.appendChild(textnode);
      }
    }
    // Ajout au parent
    if(nodeName!==null){
        parent.appendChild(node);
    }
    return node;
  }
  
//   let div1 = dom(document.body, "div", {id:1, class:"toto"});
//   dom(div1, null, {}, "Bonjour tout le monde ");
//   dom(div1, "span", {class:"badge badge-primary"}, "new");
//   dom(div1, null, {}, " !");
  
// https://jsfiddle.net/JackIsJack/63x7ne5r/21/  