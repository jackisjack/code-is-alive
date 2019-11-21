var MainSiManager =
{
        Init: function () {

            // Fenêtre loading;

            ShowLoading();


            // Pour gérer les mouvements suivants une ligne (non utilisé pour le moment)

            createjs.MotionGuidePlugin.install();

            // Chargement en mémoire des îcones (pour leur ajout futur sur la scène)

            SetLoadingMessage("Chargement de la carte");
           
           VariablesGlobales.ImagesArray = new createjs.LoadQueue();
           VariablesGlobales.ImagesArray .on("complete", handleComplete, this);
           VariablesGlobales.ImagesArray .loadManifest([
               {id: "petitcarrebleu", src:"https://cdn.glitch.com/1f9a81fa-715f-4b6a-abac-840468608b33%2Fhub.png?v=1574020275932"}
           ]);
          
           // Quand le chargement des images est terminé
          
           function handleComplete() {
                          
              HideLoading();

              // Initialisation de la vue
             
              Graphisme.Init();
              
             // Création des éléments
             
              var Element1 = Graphisme.VueFocus.AjouterElement({
                IdTypeObjet: EnumTypeObjet.PetitCarre, 
                Libelle: "Element 1",
                IdObjet: 1, 
                x: -200,
                y: 200 
              });
                
              var Element2 = Graphisme.VueFocus.AjouterElement({
                IdTypeObjet: EnumTypeObjet.PetitCarre, 
                Libelle: "Element 2",
                IdObjet: 2, 
                x: -200+400,
                y: 0
              });
              
              var Element3 = Graphisme.VueFocus.AjouterElement({
                IdTypeObjet: EnumTypeObjet.PetitCarre, 
                Libelle: "Element 3",
                IdObjet: 3, 
                x: -200+400,
                y: 200
              });
             
              var Element4 = Graphisme.VueFocus.AjouterElement({
                IdTypeObjet: EnumTypeObjet.PetitCarre, 
                Libelle: "Element 4",
                IdObjet: 4, 
                x: -200+400,
                y: 400
              });
             
              // Tests des links
             
              var tween = createjs.Tween
              .get(null, {loop:true})
              .to({},1100,createjs.Ease.linear)
              .call(function () { 
                Graphisme.VueFocus.DrawLink(Element1, Element2);
              });
             
              var tween = createjs.Tween
              .get(null, {loop:true})
              .to({},1200,createjs.Ease.linear)
              .call(function () { 
                Graphisme.VueFocus.DrawLink(Element1, Element3);
              });
             
              var tween = createjs.Tween
              .get(null, {loop:true})
              .to({},1300,createjs.Ease.linear)
              .call(function () { 
                Graphisme.VueFocus.DrawLink(Element1, Element4);
              });
             
              // Fin du loading;

             }
          
        },


        
}