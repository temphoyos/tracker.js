try{ 
	
    
    var trackedBody = window.document.body;
    trackedBody.addEventListener('click', eventHandler, true);
    function eventHandler(e){

    if(e.target['type'] === 'button'){

        const buttonArray = Array.from(document.querySelectorAll("[type='button']"));

        for(var i = 0; i < buttonArray.length; i++){

            if(e.target === buttonArray[i]){

                j = i+1;

                dataLayer.push({

                    code_block_position:j,
                    event:'ev/copy_button_clicked'
        
                });

                break;
            }
        }
    }
    else if(e.target.tagName === 'A' && e.target.closest('div').id === 'primary-menu'){

        dataLayer.push({

            item_clicked:e.target.innerText.toLowerCase(),
            event:'ev/top_menu'
        });
    }
    }
    console.log("I'm here!");

}catch(e){}
