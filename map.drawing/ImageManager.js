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
            {id: "blackbox", src:"./images/blackbox.png"},
            {id: "csharp_class", src:"./images/csharp_class.png"},
            {id: "csharp_method", src:"./images/csharp_method.png"},
            {id: "csharp_staticclass", src:"./images/csharp_staticclass.png"},
            {id: "dotnetmvc_view", src:"./images/dotnetmvc_view.png"},
            {id: "excel_file", src:"./images/excel_file.png"},
            {id: "excel_sheet", src:"./images/excel_sheet.png"},
            {id: "excel_table", src:"./images/excel_table.png"},
            {id: "html_dom", src:"./images/html_dom.png"},
            {id: "html_page", src:"./images/html_page.png"},
            {id: "js_file", src:"./images/js_file.png"},
            {id: "js_function", src:"./images/js_function.png"},
            {id: "js_object", src:"./images/js_object.png"},
            {id: "json_file", src:"./images/json_file.png"},
            {id: "life_user", src:"./images/life_user.png"},
            {id: "mssql_db", src:"./images/mssql_db.png"},
            {id: "mssql_table", src:"./images/mssql_table.png"},
            {id: "system_folder", src:"./images/system_folder.png"},
            {id: "vba_function", src:"./images/vba_function.png"},
            {id: "vba_module", src:"./images/vba_module.png"},
            {id: "vba_sheet", src:"./images/vba_sheet.png"},
            {id: "application_browser", src:"./images/application_browser.png"},   
            {id: "abstract_folder", src:"./images/abstract_folder.png"}   
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