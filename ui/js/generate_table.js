
function generate_table(parent, data){
        
      let table = document.createElement("table");
         
      table.classList.add("table","table-sm","w-auto","table-bordered");
      
       // Préparation de la liste des icônes
      let iconlist = [
      {regex1:/c/,regex2:/\[c\]/,iconClass:"fa-plus",colorClass:'createcolor'},
      {regex1:/r/,regex2:/\[r\]/,iconClass:"fa-eye", colorClass:'readcolor'},
      {regex1:/u/,regex2:/\[u\]/,iconClass:"fa-pencil", colorClass:'updatecolor'},
      {regex1:/d/,regex2:/\[d\]/,iconClass:"fa-times", colorClass:'deletecolor'}
      ];
      
      // Cas du tableau à entête horizontal
      if (data[0][0].match(/>/)){
          
          // Construction du header
          let thead = document.createElement("thead");
          let tr = document.createElement("tr");
          
          // Construction des entêtes
          for(let col=0; col<data[0].length; col++){
              
            let th = document.createElement("th");
            
            // Tous les cas sauf la 1ère colonne
            if (col!==0){
              let thtext = document.createTextNode(data[0][col]);
              th.appendChild(thtext);
              th.setAttribute("scope", "col");
            } else { // 1ère colonne à blanc uniquement pour d'éventuelles icônes
                th.classList.add('thblank');
            }
            
            tr.appendChild(th);
            
                }
          
                thead.appendChild(tr);
          
          // Construction du corps des données 
          let tbody = document.createElement("tbody");
          
          // Pour chaque ligne
          for(let lig=1; lig<data.length; lig++){
              
            let tr = document.createElement("tr");
            
            // Colonne vide de marge à gauche pour y insérer d'éventuelles icônes
            let td = document.createElement("td");
            td.classList.add('tdblank');
            
            // gestion des éventuelles icônes
            for(let k=0;k<iconlist.length;k++){
              if(data[lig][0].match(iconlist[k].regex1)){
                  let ico = document.createElement("i");
                  ico.classList.add("fa",iconlist[k].iconClass,"bounce");
                  td.appendChild(ico);
              }
            }
            
            tr.appendChild(td);
            
            // Pour chaque colonne de la ligne
            for(let col=1; col<data[0].length; col++){
              
              let td = document.createElement("td");
              
              // gestion d'éventuelles icônes
              for(let k=0;k<iconlist.length;k++){
                  // Si la cellule contient une icône [x]
                if (data[lig][col].match(iconlist[k].regex2)){
                    let ico = document.createElement("i");
                    ico.classList.add("fa",iconlist[k].iconClass,"bounce");
                    td.appendChild(ico);
                    td.classList.add(iconlist[k].colorClass);
                    data[lig][col]=data[lig][col].replace(iconlist[k].regex2,''); // suppression du texte de l'icône
                }
                  }
              
              // Si une icone se situe sur la ligne, toute la ligne est en surbrillance
              for(let k=0;k<iconlist.length;k++){
                  // Si la cellule contient une icône
                if(data[lig][0].match(iconlist[k].regex1)){
                  td.classList.add(iconlist[k].colorClass);
                }
              }
              
              // Cas standard : ajout du texte à la cellule
              let tdtext = document.createTextNode(data[lig][col]);
              td.appendChild(tdtext);
              
              // Ajout de la cellule à la ligne
                        tr.appendChild(td);
              
            }
            
            // Ajout de la ligne au corps du tableau
            tbody.appendChild(tr);
            
                }
         
          table.appendChild(thead);
          table.appendChild(tbody);
      
      // Cas du tableau à entête vertical
      } else {
      
          let tbody = document.createElement("tbody");
          
        // Pour chaque ligne
        for(let lig=0; lig<data.length; lig++){
    
          let tr = document.createElement("tr");
    
          let th = document.createElement("th");
          th.setAttribute("scope","row");
          let thtext = document.createTextNode(data[lig][1]);
          th.appendChild(thtext);
    
          let td = document.createElement("td");
                
          // gestion d'éventuelles icônes
          for(let k=0;k<iconlist.length;k++){
            if (data[lig][0].match(iconlist[k].regex1)){
              let ico = document.createElement("i");
              ico.classList.add("fa",iconlist[k].iconClass,"bounce");
              td.appendChild(ico);
              td.classList.add(iconlist[k].colorClass);
            }
          }
          
          let tdtext = document.createTextNode(data[lig][2]);
          td.appendChild(tdtext);
          
          tr.appendChild(th);
          tr.appendChild(td);
    
          tbody.appendChild(tr);
          
        }
        
        table.appendChild(tbody);
          
      }

      parent.appendChild(table);

}
