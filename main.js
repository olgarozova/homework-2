function Slider(idSlider,autoMove=false,isPaginator=false,sliderStep=1) {
    this.slider = document.querySelector(`#${idSlider}`);
    this.sliderElements = this.slider.querySelectorAll(".slider-slide");

    this.sliderWrapper = this.slider.querySelector(".slider-wrapper");    
    this.slideWidth = this.sliderElements[0].offsetWidth/this.sliderWrapper.clientWidth * 100; 

    this.arrowLeft = this.slider.querySelector(".slider__arrow-left");
    this.arrowRight = this.slider.querySelector(".slider__arrow-right");
    
    this.step = sliderStep; 
    this.leftPosition = 0;
    this.sliderTransform = 0;
    this.numbSlidesPerPage = this.sliderWrapper.clientWidth/this.sliderElements[0].offsetWidth;    
    

    this.getDirection = function(arrow) {          
        return arrow.classList.contains('slider__arrow-right') ? 'right' : 'left';
    };

    this.isMax = function(){       
        return (this.numbSlidesPerPage + this.leftPosition) >= this.sliderElements.length ? true : false;
    };
    this.isMin = function(){
        return this.leftPosition  === 0 ? true : false;
    };
    this.disableArrow = function(arrow){
        arrow.classList.add('no-active');
    };
    this.activateArrow = function(arrow){
        arrow.classList.remove('no-active');
    };
    this.calculateNextStep = function (direction) { 
        if(direction === 'right'){
                var nextStep = (this.sliderElements.length - this.numbSlidesPerPage) - this.leftPosition;
                return this.leftPosition + this.step  <= this.sliderElements.length - this.numbSlidesPerPage ? this.step : nextStep;                 
        }
        if(direction === 'left'){            
            var nextStep = this.leftPosition - this.step;           
            return (nextStep < 0) ? this.leftPosition : this.step;                 
    }
    }
    this.move = function (event) {     
        var direction = this.getDirection(event.target);               
        this.transformSlide(direction,this.calculateNextStep(direction));        
    };

    this.transformSlide = function (direction,step) {            

        if(direction === 'right'){
            if(this.isMax()) return;

            this.leftPosition+=step;   
            this.sliderTransform -= step * this.slideWidth;            
            this.sliderWrapper.style.transform = `translateX(${this.sliderTransform}%)`;

            if(this.isMax()) this.disableArrow(this.arrowRight);
            if(!this.isMin()) this.activateArrow(this.arrowLeft);           
        }
        if(direction === 'left'){ 
            if(this.isMin()) return;            
            this.leftPosition-=step;
            this.sliderTransform += step * this.slideWidth;
            this.sliderWrapper.style.transform = `translateX(${this.sliderTransform}%)`;           
    
            if(this.isMin())   this.disableArrow(this.arrowLeft);
            if(!this.isMax()) this.activateArrow(this.arrowRight);          
        }
        if(isPaginator){ // set active page
            var activePage = this.slider.querySelector("#slider__paginator-item-"+this.leftPosition);
            this.setPageActive(activePage);
        }        
    };
    this.autoMove = function () {     
       var _self = this;
       var timerId = setInterval( function(){ 

          _self.transformSlide('right',_self.calculateNextStep('right'));            
          if(_self.isMax()) clearInterval(timerId);

       },3000);                
    };
    this.addPaginator = function(){
        var paginator = document.createElement('div');
        paginator.className = 'slider__paginator';        

        this.slider.appendChild(paginator); 
        var _self = this;
        this.sliderElements.forEach( function(elem,i){

            var item = document.createElement('span');
            item.className = 'slider__paginator-item';
            item.id = 'slider__paginator-item-'+i;            
            item.onclick = _self.paginatorMove.bind(_self);
            paginator.appendChild(item);
           
        }

        );
        this.setPageActive(this.slider.querySelector('#slider__paginator-item-'+this.leftPosition));
    };
    this.getPageNumber = function(page){        
        return page.id.replace("slider__paginator-item-", "");     
    };
    this.setPageActive = function(pageActive){ 
        var pages = this.slider.querySelectorAll(".slider__paginator-item");
        pages.forEach(function(page){
            page.classList.remove('active');
            }
        );    
        pageActive.classList.add('active');
    };
    this.paginatorMove = function(event){        
        var pageId = this.getPageNumber(event.target);    
        var step = this.leftPosition - pageId;        

        if(step > 0){
            this.transformSlide('left',step);
        }
        if(step < 0){
            this.transformSlide('right',Math.abs(step));
        }       

    };

    if(isPaginator) this.addPaginator();
    if(autoMove) this.autoMove();
    this.arrowLeft.onclick = this.move.bind(this);
    this.arrowRight.onclick = this.move.bind(this);
}
new Slider('slider-main',false,true,1);
new Slider('slider-clients',false,false,2);
