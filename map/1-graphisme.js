var Graphisme = {

    ListeVue: [],
    VueFocus: 0,

    Init: function () {

        // création d'une vue par défaut

        var mVue;
        mVue = this.NouvelleVueVierge();

        // La vue par défaut 

        this.SelectionnerVue(mVue);

        // Evènement de rafraichissement d'animation

        var self = this;
        createjs.Ticker.addEventListener("tick", function (e) { self.tick(e); });

    },

    tick: function (event) {
        this.VueFocus.stage.update(event);
    },

    SelectionnerVue: function (Vue) {

        that = this;

        // Sélection de la vue passée en paramètre

        this.VueFocus = Vue;

    },

    NouvelleVueVierge: function () {

        // Instantiation d'une vue

        var mVue = new VueClass({
            IdCanvas: "MainCanvas",
            mainContainerX: 0,
            mainContainerY: 0,
            NomVue: "",
            IdVue: -1
        });

        this.ListeVue.push(mVue);

        return mVue;
    },

    SauvegarderVue: function (ObjVue, NomVue) {

        // Affectation du nom de la vue

        ObjVue.NomVue = NomVue;

        // Sequentialisation && packaging de la liste des objets

        var ListeObjetSequentiel = [];

        var j = 0;
        for (var i = 0; i < ObjVue.ListeElement.length; i++)
        {

            // pour chacun des objets

            if (ObjVue.ListeElement[i] !== null) { // si il a été supprimé

                // réattribution d'un id sequentiel

                ObjVue.ListeElement[i].idObjetVue = j;
                j = j + 1;

                // Ajout de l'élément standardisé dans la liste

                ListeObjetSequentiel.push(ObjVue.ListeElement[i].ElementSauvegarde()); // enregistrement de l'objet sauvegardable

            }
            
        }

        // Création de l'objet global 'Vue'

        var Vue_POST = {
            mVueCore_POST: ObjVue.VueSauvegarde(), // Informations générales de la vue
            mElement_POST: ListeObjetSequentiel, // Tous les éléments
        };

        // Post de la vue entière avec tous ses éléments

        API_Vue_POST
            (
            Vue_POST,
            function (data) {

                ObjVue.IdVue = data; // id renvoyé par la webapi
                ObjVue.NomVue = NomVue // nom souhaité lors de l'enregistrement

                // fermeture de la fenêtre d'enregistrement
                OuvrirForm_EnregistrerVue_Fermer();

            }
            );

    },

    OuvrirVue: function (IdVue) {

        var that = this;

        // récupération des informations nécessaires à l'instantiation de la vue'

        API_Vue_Full_GET(IdVue, function (data) {
            
            // Instantiation d'une vue
            
            var mVue = new VueClass(
                {
                    IdCanvas: "MainCanvas",
                    NomVue: data.Vue.LIBELLE,
                    IdVue: data.Vue.IDVUE,
                    mainContainerX: data.Vue.MAINCONTAINERX,
                    mainContainerY: data.Vue.MAINCONTAINERY
                });

            // Création des éléments

            var tmpElement;

            for (var i = 0; i < data.ListeElement.length; i++){

                tmpElement = mVue.AjouterElement(
                                {
                                    IdTypeObjet: data.ListeElement[i].IDTYPEOBJET,
                                    IdObjet: data.ListeElement[i].IDOBJET,
                                    Libelle: data.ListeElement[i].LIBELLE,
                                    x: data.ListeElement[i].X,
                                    y: data.ListeElement[i].Y,
                                    Forme: data.ListeElement[i].FORME,
                                    x_delta: data.ListeElement[i].X_DELTA,
                                    y_delta: data.ListeElement[i].Y_DELTA
                                }
                            );

            }

            // Affectation de chaque enfant à son parent

            var IdParent;
            var IdEnfant;

            for (var i = 0; i < data.ListeElement.length; i++) {

                IdParent = data.ListeElement[i].IDELEMENTVUEPARENT;
                IdEnfant = data.ListeElement[i].IDELEMENTVUE;

                if (IdParent !== -1) {

                    mVue.ListeElement[IdParent].AffecterEnfant(mVue.ListeElement[IdEnfant]);

                }

            }

            // Visibilité pour tous

            for (var i = 0; i < mVue.ListeElement.length; i++) {

                mVue.ListeElement[i].Visible(true);

            }
            
            // Actualisation de tous les hubs racines

            mVue.ActualiserTout();

            // Collection de la vue au niveau global

            that.ListeVue.push(mVue);

            // Focus sur la vue

            that.SelectionnerVue(mVue);

            // Fermerture de la fenêtre de sélection d'une vue

            OuvrirForm_OuvrirVue_Fermer();

        });
        
    }
    
};



