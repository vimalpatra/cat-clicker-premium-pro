
/* ======= Model ======= */

var model = {
    currentCat: null,
    cats: [
        {
            clickCount : 0,
            name : 'Tabby',
            imgSrc : 'img/434164568_fea0ad4013_z.jpg',
            imgAttribution : 'https://www.flickr.com/photos/bigtallguy/434164568'
        },
        {
            clickCount : 0,
            name : 'Tiger',
            imgSrc : 'img/4154543904_6e2428c421_z.jpg',
            imgAttribution : 'https://www.flickr.com/photos/xshamx/4154543904'
        },
        {
            clickCount : 0,
            name : 'Scaredy',
            imgSrc : 'img/22252709_010df3379e_z.jpg',
            imgAttribution : 'https://www.flickr.com/photos/kpjas/22252709'
        },
        {
            clickCount : 0,
            name : 'Shadow',
            imgSrc : 'img/1413379559_412a540d29_z.jpg',
            imgAttribution : 'https://www.flickr.com/photos/malfet/1413379559'
        },
        {
            clickCount : 0,
            name : 'Sleepy',
            imgSrc : 'img/9648464288_2516b35537_z.jpg',
            imgAttribution : 'https://www.flickr.com/photos/onesharp/9648464288'
        }
    ]
};


/* ======= Octopus ======= */

var octopus = {

    init: function() {
        // set our current cat to the first one in the list
        model.currentCat = model.cats[0];

        // tell our views to initialize
        catListView.init();
        catView.init();
    },

    getCurrentCat: function() {
        return model.currentCat;
    },

    getCats: function() {
        return model.cats;
    },

    // set the currently-selected cat to the object passed in
    setCurrentCat: function(cat) {
        model.currentCat = cat;
    },

    // increments the counter for the currently-selected cat
    incrementCounter: function() {
        model.currentCat.clickCount++;
        catView.render();
    },

    changeCatValues: function(valuesProvided){

        var obj = valuesProvided;
        console.log(obj);

        if (obj.clicks) {
            model.currentCat.clickCount = obj.clicks;
        }

        if (obj.name) {
            model.currentCat.name = obj.name;
        }
        
        if (obj.image) {
            model.currentCat.imgSrc = obj.image;
        }

        if (obj.clicks || obj.name || obj.image) {
            catView.render();   
        }
    }
    
};


/* ======= View ======= */

var catView = {

    init: function() {
        // store pointers to our DOM elements for easy access later
        this.catElem = document.getElementById('cat');
        this.edit = document.getElementById('edit');
        this.panelVisibility = false;
        this.editingPanel = document.querySelector('.editingPanel');
        this.catNameElem = document.getElementById('cat-name');
        this.catImageElem = document.getElementById('cat-img');
        this.countElem = document.getElementById('cat-count');

        
        // on click, increment the current cat's counter
        this.catImageElem.addEventListener('click', function(){
            octopus.incrementCounter();
        });

        // on click, toggle the editing panel
        this.edit.addEventListener('click', function(){
            catView.panelToggle.call(catView);
        });

        // render this view (update the DOM elements with the right values)
        this.render();
        this.editCurrentCat();
    },

    render: function() {
        var hidePanelToggle = true;
        catView.panelToggle(hidePanelToggle);

        // update the DOM elements with values from the current cat
        var currentCat = octopus.getCurrentCat();
        this.countElem.textContent = currentCat.clickCount;
        this.catNameElem.textContent = currentCat.name;
        this.catImageElem.src = currentCat.imgSrc;
    },
    panelToggle: function(hide) {

        if (this.panelVisibility || hide) {
            this.panelVisibility = false;
            this.editingPanel.style.display = 'none';
        }else{
            this.panelVisibility = true;
            this.editingPanel.style.display = 'block';
        }
    },
    editCurrentCat : function() {

            var self = this;

            // store the DOM element for easy access later
            this.editCatsForm = document.getElementById('editCats');

            this.editCatName = document.getElementById('editCatName');
            this.editClicks = document.getElementById('editClicks');
            this.editCatImage = document.getElementById('editCatImage');
            this.cancelBtn = document.getElementById('cancelEditChanges');
            
            console.log(this.cancelBtn);

            this.cancelBtn.addEventListener('click',function(e){
                self.panelToggle();
            });

            this.editCatsForm.addEventListener('submit',function(e){
                e.preventDefault();
                var catNameValue = this.editCatName.value.trim(),
                    clicksValue =  this.editClicks.value.trim(),
                    catImageValue = this.editCatImage.value.trim();

                
                if ( catNameValue == '' || 'string' != typeof catNameValue) {
                    catNameValue = undefined;
                }

                if ( clicksValue == '' || 'number' != typeof Number(clicksValue)) {
                    clicksValue = undefined;
                }

                if ( catImageValue == '' || 'string' != typeof catImageValue) {
                    catImageValue = undefined;

                }

                octopus.changeCatValues({
                    name: catNameValue,
                    clicks: clicksValue,
                    image: catImageValue

                });


            });
        
    }

};

var catListView = {

    init: function() {
        // store the DOM element for easy access later
        this.catListElem = document.getElementById('cat-list');

        // render this view (update the DOM elements with the right values)
        this.render();
    },

    render: function() {
        var cat, elem, i;
        // get the cats we'll be rendering from the octopus
        var cats = octopus.getCats();


        // loop over the cats
        for (i = 0; i < cats.length; i++) {

            // this is the cat we're currently looping over
            cat = cats[i];

            // make a new cat list item and set its text
            elem = document.createElement('li');
            elem.textContent = cat.name;

            // on click, setCurrentCat and render the catView
            // (this uses our closure-in-a-loop trick to connect the value
            //  of the cat variable to the click event function)
            elem.addEventListener('click', (function(catCopy) {
                return function() {
                    octopus.setCurrentCat(catCopy);
                    catView.render();
                };
            })(cat));

            // finally, add the element to the list
            this.catListElem.appendChild(elem);
        }
    }
};



/* 

this catsStatus object is not being used, 

you can use it this way if you want to have manage all the things in view at one place

*/


var catsStatus = {
	init:function(){
		this.catView();
		this.catListView();
	},
	catListView:function(){
		var cat, elem, i;
        // get the cats we'll be rendering from the octopus
        var cats = octopus.getCats();
        console.log('------------ALL CATS------------'); 
        // loop over the cats
        for (i = 0; i < cats.length; i++) {
            // this is the cat for this iteration
            cat = cats[i];  
            console.log(cat);          
        }
	},
	catView:function(){
		// update the DOM elements with values from the current cat
        var currentCat = octopus.getCurrentCat();

        console.log('------------CURRENT CAT------------'); 
            console.log(currentCat);          
	
	}

}

// make it go!
octopus.init();
