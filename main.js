function Slider(idSlider,isPaginator,sliderStep) {
    this.slider = document.querySelector(`#${idSlider}`);
    this.sliderElements = this.slider.querySelectorAll(".slider-slide");

    this.sliderWrapper = this.slider.querySelector(".slider-wrapper");
    this.slideWidth = 100; //width of slide in %    TODO: make computable

    this.arrowLeft = this.slider.querySelector(".slider__arrow-left");
    this.arrowRight = this.slider.querySelector(".slider__arrow-right");
    
    this.step = sliderStep; 
    this.leftPosition = 0;
    this.sliderTransform = 0;    
    

    this.getDirection = function(arrow) {          
        return arrow.classList.contains('slider__arrow-right') ? 'right' : 'left';
    };

    this.isMax = function(){       
        return (this.step + this.leftPosition) >= this.sliderElements.length ? true : false;
    };
    this.isMin = function(){                 
        return (this.leftPosition - this.step) < 0 ? true : false;
    };
    this.disableArrow = function(arrow){
        arrow.classList.add('no-active');
    };
    this.activateArrow = function(arrow){
        arrow.classList.remove('no-active');
    };

    this.move = function (event) {     
        var direction = this.getDirection(event.target);               
        this.transformSlide(direction,this.step);        
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
    this.addPaginator = function(){
        var paginator = document.createElement('div');
        paginator.className = 'slider__paginator';        

        this.slider.appendChild(paginator); 
        _self = this;
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
    this.arrowLeft.onclick = this.move.bind(this);
    this.arrowRight.onclick = this.move.bind(this);
}

var mainSlider = new Slider('slider-main',true,1);
