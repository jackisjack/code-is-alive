var ViewCollection_js = {

    ViewList: [],
    FocusedView: 0,

    Init: function () {

        // création d'une vue par défaut

        var mVue;
        mVue = this.NewView();

        // La vue par défaut 

        this.SelectView(mVue);

        // Evènement de rafraichissement d'animation

        var self = this;
        createjs.Ticker.addEventListener("tick", function (e) { self.tick(e); });

    },

    tick: function (event) {
        this.FocusedView.stage.update(event);
    },

    SelectView: function (Vue) {

        that = this;

        // Sélection de la vue passée en paramètre

        this.FocusedView = Vue;

    },

    NewView: function () {

        // Instantiation d'une vue

        var mVue = new View({
            IdCanvas: "canvas-main",
            mainContainerX: 0,
            mainContainerY: 0,
            NomVue: "",
            IdVue: -1
        });

        this.ViewList.push(mVue);

        return mVue;
    }
    
};



