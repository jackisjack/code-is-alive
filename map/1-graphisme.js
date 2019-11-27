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
    }
    
};



