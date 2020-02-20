
function repeatFunction(repeatedFunction, props){

       //************************************************
      // Properties
    
      // from inputs
      this.repeatedFunction =repeatedFunction;
      this.count = props.count;
      this.durationsFunction = props.durationsFunction;
      this.loop = props.loop;
      
      // others
      this.currentTime = null;
      this.setTimeoutResults = []; // all results from setTimeout
      let that = this;
      
      //************************************************
      // Methods
      
        this.start = function(){
          this.tTimer = []; // void the queue
          for(let i = 0; i < this.count; i++){
            let r = setTimeout(this.repeater.bind(this, i), this.durationsFunction(i));
                this.setTimeoutResults.push(r);
        }
      }
      
      this.stop = function(){
           for(let j = 0; j < this.setTimeoutResults.length; j++){
             let r = this.setTimeoutResults[j];
             clearTimeout(r);
          } 
      }
      
      this.repeater = function(currentTime){
          // execute main function
          this.repeatedFunction(currentTime);
        // refresh current time
        this.currentTime = currentTime;
        // when finished
        if(this.currentTime==this.count-1 && this.loop==true){
            this.start(); // start all over again
        }
      }
      
      //************************************************
      // Constructor
      
      
    }
    
    // Test
    
    // let timer = new repeatFunction(
    //   function(text){console.log('hello world')}, 
    //   {count: 5, durationsFunction:function(i){return 1000*(i+1)}, loop:true}
    // );
    
    // document.getElementById("bt_start").onclick = function(){ timer.start();};
    // document.getElementById("bt_stop").onclick = function(){ timer.stop();};
    
    
    
    
    
    
    
    
    