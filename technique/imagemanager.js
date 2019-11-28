var ImageManager = {

    IconeElement:[],
    IconeLien:[],
    IconeEtat:[],
    HandleComplete:null,

    OnComplete: function(handle){
        this.HandleComplete = handle;
    },

    Load: function(){
        var that = this;
        this.IconeElement = new createjs.LoadQueue();
        this.IconeElement.on("complete", this.Load2, that);
        this.IconeElement.loadManifest([
            {id: "petitcarrebleu", src:"https://cdn.glitch.com/1f9a81fa-715f-4b6a-abac-840468608b33%2Fhub.png?v=1574020275932"}
        ]);

    },
    
    Load2: function(){
        var that = this;
        this.IconeLien = new createjs.LoadQueue();
        this.IconeLien.on("complete", this.Load3, that);
        this.IconeLien.loadManifest([
            {id: "pdf", src:"https://cdn.glitch.com/1f9a81fa-715f-4b6a-abac-840468608b33%2Fpdficon.png?v=1574505654088"},
            {id: "file", src:"https://cdn.glitch.com/1f9a81fa-715f-4b6a-abac-840468608b33%2Ffileicon.png?v=1574506930028"}
        ]);

    },
    
    Load3: function(){
        var that = this;
        this.IconeEtat = new createjs.LoadQueue();
        this.IconeEtat.on("complete", that.LastCall, that);
        this.IconeEtat.loadManifest([
            {id: "send", src:"https://cdn.glitch.com/1f9a81fa-715f-4b6a-abac-840468608b33%2Fsend.png?v=1574891982654"},
            {id: "arrow1", src:"https://cdn.glitch.com/1f9a81fa-715f-4b6a-abac-840468608b33%2Farrow1.png?v=1574892293325"},
            {id: "webservice", src:"https://cdn.glitch.com/1f9a81fa-715f-4b6a-abac-840468608b33%2Fwebservice.png?v=1574892579201"}
        ]);

    },

    LastCall: function(){
        this.HandleComplete();
    }

};