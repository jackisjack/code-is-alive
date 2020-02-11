
function fn_DomToJS(node){

    for(let i = 0; i < node.children.length; i++){

        let childNode = node.children[i]
        console.log('balise : ' + childNode.nodeName);

        console.log('texte : ' + childNode.innerText);

        for(let j=0; j < childNode.attributes.length; j++){

            let nodeAttribute = childNode.attributes[j];
            console.log('attribut : ' + nodeAttribute.name)
            console.log('valeur : ' + nodeAttribute.value)

        }

        fn_DomToJS(childNode);

    }
};


// TEST DE FETCH

// const toto = async function(){

//     //userDetails = await fetch("https://api.github.com/users/toto");
//     console.log("c'était rapide einh ?");

// };

// const woup = await toto();

// TEST DE CLASSE


// var classE = Class.extend({
//     prop1:1,
//     mL:null,
//     ajouterL:function(oL){
//         this.mL=oL;
//     },
//     modifierL:function(oL){
//         this.mL.propL=4;
//     }
// });

// var classL = Class.extend({
//     propL:2
// });

// var objE1 = new classE();
// var objE2 = new classE();

// var objL = new classL();

// objE1.ajouterL(objL);
// objE2.ajouterL(objL);

// console.log(objE1.mL.propL);
// console.log(objE2.mL.propL);

// objL.propL = 3;

// console.log(objE1.mL.propL);
// console.log(objE2.mL.propL);

// objE1.modifierL();

// console.log(objE1.mL.propL);
// console.log(objE2.mL.propL);
