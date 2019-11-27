var classE = Class.extend({
    prop1:1,
    mL:null,
    ajouterL:function(oL){
        this.mL=oL;
    },
    modifierL:function(oL){
        this.mL.propL=4;
    }
});

var classL = Class.extend({
    propL:2
});

var objE1 = new classE();
var objE2 = new classE();

var objL = new classL();

objE1.ajouterL(objL);
objE2.ajouterL(objL);

console.log(objE1.mL.propL);
console.log(objE2.mL.propL);

objL.propL = 3;

console.log(objE1.mL.propL);
console.log(objE2.mL.propL);

objE1.modifierL();

console.log(objE1.mL.propL);
console.log(objE2.mL.propL);
