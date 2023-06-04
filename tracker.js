(function () {
    //Store page_category and page_type dataLayer variables in local variable to make it easier to follow this code. Will be using them a lot.
    let pageCategory = window.google_tag_manager["GTM-NP6BDWP"].dataLayer.get('page_category');
    let pageType =  window.google_tag_manager["GTM-NP6BDWP"].dataLayer.get('page_type');

    //Menu items clicks event handler function - applicable to all pages
    let clickEventHandler = function(param){
        //Handling clicks on nav menu items
        if(param.target.tagName === 'A' && param.target.closest('div').id === 'primary-menu'){

            dataLayer.push({
                item_clicked:param.target.innerText.toLowerCase(),
                event:'ev/top_menu'
            });
        }
        //Handling clicks on code copy button clicks 
        else if (param.target['type'] === 'button'){
            let buttonArray = Array.from(document.querySelectorAll("[type='button']"));    
            for(var i = 0; i < buttonArray.length; i++){
                if(param.target === buttonArray[i]){
                    j = i+1;
                    window.dataLayer.push({
                        code_block_position:j,
                        event:'ev/copy_button_clicked'
                    });
                    break;
                }
            }
        }
    };
    //Add click event listener to DOM and leveraging previous click event handler
    window.document.addEventListener('click',clickEventHandler,true);

    //Define function that will push view_item_list and select_item events to dataLayer 
    function viewItemList(){

        //Generating array from all exposed items
        let itemsArray = Array.from(document.querySelectorAll('.uael-post-wrapper'));
        //Initializing empty viewItemListObject that will be pushed into dataLayer
        let viewItemListObject = {
            event:'view_item_list',
            ecommerce:{
                items:[]
            }
        };
        
        itemsArray.forEach(
            function(item){
                //Storing item index in variable
                let itemNumber = itemsArray.indexOf(item);
                
                //Setting key-value pairs in the items array - view_item_list dataLayer
                viewItemListObject.ecommerce.items[itemNumber] = {
                    item_name: item.querySelector('h4').innerText.toLocaleLowerCase(),
                    //Dummy item item. Concatenating '000' and h4.innerText
                    item_id:'000'+item.querySelector('h4').innerText.toLocaleLowerCase(),
                    //Dummy price
                    price:10,
                    //Dynamically generate the value of the item_category key with the main path of post url
                    item_category:item.querySelector('a').href.split('/')[3].replace(/-/gm,' '),
                    //Cocatenate the value of the dataLayer page_type variable and the string 'list'
                    item_list_name: pageType + ' list',
                    index: itemNumber + 1,
                    quantity:1             
                };
                
                //Adding click event listener to each element in array
                item.addEventListener('click', function(event){
                    //Set clicked item's index in sessionStorage so that it can be retrieved on the view_item event if applicable 
                    sessionStorage.setItem('itemIndex',itemNumber+1);
                    window.dataLayer.push({
                        //select_item dataLayer
                            event:'select_item',
                            ecommerce:{
                                items:[
                                    {
                                    item_name:item.querySelector('h4').innerText.toLocaleLowerCase(),
                                    //Dummy item item. Concatenating '000' and h4.innerText
                                    item_id:'000'+item.querySelector('h4').innerText.toLocaleLowerCase(),
                                    //Dummy price
                                    price:10,
                                    //Dynamically generate the value of the item_category key with the main path of post url
                                    item_category:item.querySelector('a').href.split('/')[3].replace(/-/gm,' '),
                                    //Cocatenate the value of the dataLayer page_type variable and the string 'list'
                                    item_list_name: pageType + ' list',
                                    index:itemNumber + 1,
                                    quantity: 1
                                    }
                                ]
                                }

                    });
                    
                },true)
                
            }
        )
        window.dataLayer.push(viewItemListObject);
        console.log('viewItemList() executed!');
    };

    //Function that will push add_to_cart and purchase events to dataLayer
    function postDataLayer(){

        //In preparation for view_item event - Ternary operator that uses the document.referrer API to see if previousPage was homepage or category section
        var rutaAnterior = document.referrer.split('/').length > 4 ? 'seccion list' : 'home list';
        var hostString = 'https://analyticsimplementations.com';
            
        //Following is code to generate add_to_cart event when user scrolls to 50% of screen height
        //Storing 50% of screen height in a local varianle
        let halfScreenHeight = document.body.scrollHeight/2;
        //Storing 85% of screen height in a local variable
        let fullScreenHeight = document.body.scrollHeight * 0.8;
        //Storing 50% scroll handler in a variable...
        let halfScreenScrollHandler = function(param){
            //50% scroll
            if(window.scrollY >= halfScreenHeight){
                console.log('50% value pushed');
                //If document referrer includes analyticsimplementations.com dataLayer.push() includes item_list_name and index
                if(document.referrer.includes(hostString)){
                    window.dataLayer.push({
                        event:'add_to_cart',
                        ecommerce:{
                            items:[{
                                item_name: document.querySelector('h1').innerText.toLocaleLowerCase(),
                                item_category: pageCategory,
                                item_id: '000' + document.querySelector('h1').innerText.toLocaleLowerCase(),
                                item_list_name: rutaAnterior,
                                price: 10,
                                //Retrieve index from sessionStorage as it was here where it was set on the previous select_item event
                                index: sessionStorage.getItem('itemIndex'), 
                                quantity: 1 
                            }]
                        }
                    });
                } 
                //If document referrer doesn't include analyticsimplementations.com, dataLayer.push() doesn't include item_list_name nor index as these keys are related with the view_item_list event
                else{
                    window.dataLayer.push({
                        event:'add_to_cart',
                        ecommerce:{
                            items:[{
                                item_name: document.querySelector('h1').innerText.toLocaleLowerCase(),
                                item_category: pageCategory,
                                item_id: '000' + document.querySelector('h1').innerText.toLocaleLowerCase(),                         
                                price: 10,
                                quantity: 1 
                            }]
                        }
                    });

                }
                //Remove event listener so that dataLayer.push() isn't executed again and again
                window.document.removeEventListener('scroll',halfScreenScrollHandler,true);
            }        
        };
        //...and full screen scroll handler in another variable
        let fullScreenScrollHandler = function(param){
            if(window.scrollY >= fullScreenHeight){
                console.log('100% scrolled');
                //If document referrer includes analyticsimplementations.com dataLayer.push() includes item_list_name and index
                if(document.referrer.includes(hostString)){
                    window.dataLayer.push({
                        event:'purchase',
                        ecommerce:{
                            transaction_id: 'dummy id',
                            //Dummy affiliation
                            affiliation: "Dummy affiliation",
                            //Dummy value
                            value: "13.8",
                            //Dummy tax value
                            tax: "1.90",
                            //Dummy shipping value
                            shipping: "1.90",
                            currency: "EUR",
                            coupon: "NO_COUPON",
                            items:[{
                                item_name:document.querySelector('h1').innerText.toLocaleLowerCase(),
                                item_category:pageCategory,
                                item_id: '000' + document.querySelector('h1').innerText.toLocaleLowerCase(),
                                item_list_name: rutaAnterior,
                                price: 10,
                                //Retrieve index from sessionStorage as it was here where it was set on the previous select_item event
                                index: sessionStorage.getItem('itemIndex'), 
                                quantity: 1 
                            }]
                        }
                    });
                }
                //If document referrer doesn't include analyticsimplementations.com, dataLayer.push() doesn't include item_list_name nor index as these keys are related with the view_item_list event
                else{
                    window.dataLayer.push({
                        event:'purchase',
                        ecommerce:{
                            transaction_id: 'dummy id',
                            //Dummy affiliation
                            affiliation: "Dummy affiliation",
                            //Dummy value
                            value: "13.8",
                            //Dummy tax value
                            tax: "1.90",
                            //Dummy shipping value
                            shipping: "1.90",
                            currency: "EUR",
                            coupon: "NO_COUPON",
                            items:[{
                                item_name:document.querySelector('h1').innerText.toLocaleLowerCase(),
                                item_category:pageCategory,
                                item_id: '000' + document.querySelector('h1').innerText.toLocaleLowerCase(),
                                price: 10,
                                quantity: 1 
                            }]
                        }
                    });
                }

                //Remove event listener so that dataLayer.push() isn't executed again and again
                window.document.removeEventListener('scroll',fullScreenScrollHandler,true);
            }
        }
        //Add scroll event listener and eventHandlers to document object
        window.document.addEventListener('scroll',halfScreenScrollHandler,true);
        window.document.addEventListener('scroll',fullScreenScrollHandler,true);
   
        //view_item event dataLayer.push()
        //If document referrer includes analyticsimplementations.com dataLayer.push() includes item_list_name and index
        if(document.referrer.includes(hostString)){
            window.dataLayer.push({
                event:'view_item',
                ecommerce:{
                    items:[{
                        item_name: document.querySelector('h1').innerText.toLocaleLowerCase(),
                        item_category: pageCategory,
                        item_id: '000' + document.querySelector('h1').innerText.toLocaleLowerCase(),
                        item_list_name: rutaAnterior,
                        price: 10,
                        //Retrieve index from sessionStorage as it was here where it was set on the previous select_item event
                        index: sessionStorage.getItem('itemIndex'), 
                        quantity: 1 
                    }]
                }        
            })
        }
        //If document referrer doesn't include analyticsimplementations.com, dataLayer.push() doesn't include item_list_name nor index as these keys are related with the view_item_list event
        else {
            window.dataLayer.push({
                event:'view_item',
                ecommerce:{
                    items:[{
                        item_name: document.querySelector('h1').innerText.toLocaleLowerCase(),
                        item_category: pageCategory,
                        item_id: '000' + document.querySelector('h1').innerText.toLocaleLowerCase(),
                        price: 10,
                        quantity: 1 
                    }]
                }    
        })

        }
        console.log('postDalayer() executed!'); 
        
    }
    //Logic to determined where viewItemList() and postDataLayer() functions should be exectued
    let listPagesArray = ['home','tealium iq','google tag manager','google analytics 4','bigquery'];

    //If viewing home page or ant section pages
    if(listPagesArray.includes(pageCategory) && (pageType === 'seccion' || pageType === 'home')){
        viewItemList();
    }
    //If viewing post page
    else if(pageType === 'post'){
        postDataLayer();
    }

})();

