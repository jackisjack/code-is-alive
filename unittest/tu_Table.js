function tu_Table(){

    $('td').bind('mouseenter', function(){
        var $this = $(this);
    
        if(this.offsetWidth < this.scrollWidth && !$this.attr('title')){
            $this.attr('title', $this.text());
        }
    });

}