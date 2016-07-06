//mobile sniffer
var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPod|iPad/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

var app = {

    //app settings
    closestRetailersData: appUrl+"form/closestRetailer?postCode=",
    closestRetailersNumber: "3",
    postcodeLookup: appUrl+"form/getAddress?postCode=",
    
    //main form
    form : $("#login-form"),
    
    //models selected containers
    modelSelectedContainer : $("#model-selected-container"),
    //add model block
    addModelContainer : $("#add-model"),
    addModelBtn : $("#add-model-btn a"),
    addModelLabel : $("#add-model-asterisk-info span"),
    //choose other models panel
    chooseModelPanel : $(".choose-model-panel"),
    chooseModelDropdown : $(".choose-model-dropdown"),
    
    numberOFCars:isAMG?"2":"3",
    oneCar : $(".one-car"),
    closeChooseBtn : $("#close-choose-btn a"),
    groupChosen : $(".this-selected"),
    changeTypeBlock: $("#change-type"),
    selectDecoration: $("#select-btn-decoration"),
    selectBtn: $("#change-type-container a"),
    selectAMG: $("#select-amg"),
    selectPC: $("#select-passenger-cars"),
    
    
    //manual address panel
    openManualAddressBtn : $("#open-manual-address-btn"),
    manualAddressPanel : $("#manual-address-panel"),
    //address form fields
    addressToPost : $(".address-line-1"),
    addressToPost2 : $(".address-line-2"),
    addressToPost3 : $(".address-line-3"),
    townToPost : $(".address-town"),
    countyToPost: $(".address-county"),
    retailerRODCode : $(".retailer-RODCode"),
    manualRetailerSelection : $(".retailer-address-list"),
    //submit button
    submitFormBtn: $("#submit-form-btn"),
    //address lookup results
    lookUpPostcode : $("#look-up-postcode"),
    addressLookupResultsPanel : $("#address-lookup-results-panel"),
    addressLookupResults : $("#address-lookup-results"),
    closestRetailersResults : $("#closest-retailers-results"),
    customRetailerSelect : $("#custom-retailer-option"),
    customRetailerOptionBlock : $(".retailer-option"),
    customRetailerOption : $("#retailer-address-4"),
    
    //controls text on add button
    addModelButtonManager: function(){
        var addButtonText;

        if($(".model-selected").length == 0){
            addButtonText = "Choose a model";
        }else{
            addButtonText = "Add a model";
        }

        $("#add-model-btn a").html(addButtonText);
        
    },

    selectTypeButtomsManager: function(){

        function decorationPosition(){
            var containingBlock = $("#change-type-container"),
                theWidth = $(".type-selected").width() + 20,
                thePosition = $(".type-selected").position();

            app.selectDecoration.animate({
                "left": thePosition.left,
                "top": -1,
                "width":theWidth 
            }, 500);

        };

        //control the buttons state
        function buttonsStatus(){
            if($("#available-amg-models").hasClass("this-selected")){
                app.selectBtn.removeClass("type-selected");
                app.selectAMG.addClass("type-selected");
    
            }else if($("#available-models").hasClass("this-selected")){
                app.selectBtn.removeClass("type-selected");
                app.selectPC.addClass("type-selected");
            }
        };

        buttonsStatus();
        decorationPosition();

        app.selectBtn.on("click", function(e){
            
            e.preventDefault();
            
            var $this = $(this);

            if($this.attr("id") == "select-amg"){
                if(!isMobile.any()){
                    $("#available-models").fadeOut(500).removeClass("this-selected");
                    $("#available-amg-models").fadeIn(700).addClass("this-selected");
                }else{
                    $("#available-models").removeClass("this-selected").hide();
                    $("#available-amg-models").addClass("this-selected").show();
                };
                

            }else if($this.attr("id") == "select-passenger-cars"){
                if(!isMobile.any()){
                    $("#available-models").fadeIn(700).addClass("this-selected");
                    $("#available-amg-models").fadeOut(500).removeClass("this-selected");
                }else{
                    $("#available-models").addClass("this-selected").show();
                    $("#available-amg-models").removeClass("this-selected").hide();
                }
            };
            
            buttonsStatus();
            decorationPosition();
        });
    },

    //add more models
    addModel: function(){
        
        app.chooseModelPanel.hide();
        app.addModelLabel.show();
        app.addModelButtonManager();
   
        //Close model chooser button
        app.closeChooseBtn.on("click", function(e){
            e.preventDefault();
            app.chooseModelPanel.slideUp("slow", function(){
                app.addModelLabel.fadeIn("fast");
            });
        });

        //Choose model - desktop
        app.oneCar.on("click", function(e){
            
            e.preventDefault();
            
            //remove model not selected message
            $(".select-model-error").remove();
            
            var selectedModel = $(this);
                relatedTo = selectedModel.attr("data-car-index"),
                text = $.trim(selectedModel.find("figcaption").html()),
                code = selectedModel.attr("data-car-interest-tracking-code"),
                checkbox = selectedModel.attr("data-checkbox"),
                textEscaped = text.replace(/\s/g, "-");

            addCartoSelection(selectedModel, text, code, relatedTo, checkbox);
            
            if($(".model-selected").length >= app.numberOFCars){
                app.chooseModelPanel.slideUp("slow", function(){
                    app.addModelContainer.fadeIn("fast");
                    $("#add-model-btn a").hide();
                    app.addModelLabel.show();
                });
            }else{
                $("#add-model-btn a").show();
                app.addModelLabel.hide();
            }; 
        });

        //Choose model - mobile
        app.chooseModelDropdown.find(".mfs-option a").on("click",function(){

            //reset the button's text
            app.addModelButtonManager();
            var theMaskLink = $(this),
                sel = theMaskLink.parents("ul").siblings("select"),
                selectedModel = sel.find("option:selected"),
                text = selectedModel.text(),
                relatedTo = selectedModel.attr("data-car-index"),
                code = selectedModel.attr("data-car-interest-tracking-code");
                checkbox = selectedModel.attr("data-checkbox"),

            addCartoSelection(selectedModel, text, code, relatedTo, checkbox);

            //add disabled selection to related mask <a> tag
            if(selectedModel.hasClass("disabled-selection")){
                theMaskLink.addClass("disabled-selection");
            }else{
                theMaskLink.removeClass("disabled-selection");
            }

            if($(".model-selected").length >= app.numberOFCars){
                app.chooseModelPanel.slideUp("slow", function(){
                    app.addModelLabel.hide();
                });
            }else{
                app.addModelLabel.show();
            };        

        });

        //remove error message when checkbox is selected
        function errorMessageHandler(el){
            var checkboxes = el.find("input"),
                theModel = el.find(".request-model").html();
            checkboxes.each(function(){
                $(this).on("click", function(){
                    if($(".select-this-model-error").prop("id") == "no-selection-for-"+theModel){
                        $(".add-model-error").empty();
                    }   
                });
            });
            
        };

        //set checkboxes to correct state
        function getPreviousCheckStatus(thisSelection){
            var prevBlock = thisSelection.prevAll(".model-selected:first"),
                prevBrochureStatus = prevBlock.find(".brochure-car"),
                prevTestDriveStatus = prevBlock.find(".drive-car"),
                thisBrochureStatus = thisSelection.find(".brochure-car"),
                thisTestDriveStatus = thisSelection.find(".drive-car");

                //does the check and set job
                function checkAndSetCheckbox(toCheck, toSet){

                    if(toCheck.is(':checked')){
                        toSet.attr('checked','checked');
                    }else{
                        toSet.removeAttr('checked');
                    };

                };

                //run the function as many times as needed
                if(prevBlock.length > 0){
                    checkAndSetCheckbox(prevBrochureStatus, thisBrochureStatus);
                    checkAndSetCheckbox(prevTestDriveStatus, thisTestDriveStatus);
                }else{
                    //if no previos selection set the checkbox to a default state
                    //here are both checked - remove to have them un-checked
                    //thisBrochureStatus.attr('checked','checked'),
                    //thisTestDriveStatus.attr('checked','checked');
                    
                    if(preSelected){


                    var preSelectSorted = preSelected.sort(),
                        preSelectLength = preSelected.length;

                        if( preSelectLength > 0){

                            switch(preSelectLength)
                            {
                                case 1:
                                    if(preSelected[0] === "rb"){
                                        thisBrochureStatus.attr('checked','checked');
                                    }else if(preSelected[0] === "rtd"){
                                        thisTestDriveStatus.attr('checked','checked');
                                    }
                                    
                                    break;
                                case 2:
                                    thisBrochureStatus.attr('checked','checked');
                                    thisTestDriveStatus.attr('checked','checked');
                                    break;
                            }
                            
                        }else{
                            //do nothing
                        }
                    }
                }

                //remove error message
                errorMessageHandler( thisSelection );

        };
        

        //manage cars selected
        function addCartoSelection(car, name, code, related, checkbox){

            var nameEscaped = name.replace(/\s/g, "-"),
                checkboxDisabled;

            if($(".model-selected").length >= app.numberOFCars || $(".model-selected").hasClass("model-selected-"+related)){
                //do nothing  
            }else if($(".model-selected").length < app.numberOFCars){
                
                car.addClass("disabled-selection");

                checkboxDisabled = (checkbox == "true")?"disabled":"";

                app.modelSelectedContainer.append("<div data-car-related='"+related+"' class='model-selected model-selected-"+related+" grid_10 push_1'>"+
                                                        "<div class='grid_4 alpha request-model'>"+ name +"</div>"+
                                                        "<div class='grid_5 request-option request-test-option'>"+
                                                            "<label for='drive-car-"+nameEscaped+"'>Latest Offers and Finance</label>"+
                                                            "<input name='test-drive-request[]' class='drive-car' id='drive-car-"+nameEscaped+"' type='checkbox' value='"+code
                                                            +"'/>"+
                                                        "</div>"+
                                                        "<div class='grid_4 request-option request-test-option'>"+
                                                            "<label for='drive-car-"+nameEscaped+"'>General Enquiry</label>"+
                                                            "<input "+checkboxDisabled+" name='test-drive-request2[]' class='drive-car' id='drive-car-"+nameEscaped+"' type='checkbox' value='"+code+"'/>"+
                                                        "</div>"+
                                                        "<div class='remove-model grid_1 omega'>"+
                                                            "<a href='#'><span class='visuallyhidden'>Remove</span></a>"+
                                                        "</div>"+
                                                    "</div>"+
                                                "<div class='clear'></div>"
                                                );

                //set checkboxes to correct state
                getPreviousCheckStatus($(".model-selected-"+related));
                
                //re-check the numbers to disable links
                if($(".model-selected").length >= app.numberOFCars){
                    app.oneCar.addClass("disabled-selection");
                };
            };

            //reset the button's text
            app.addModelButtonManager(); 

        };
        
    },                
    
    //manage models selected
    manageModels: function(){
        
        //only show the type selected
        app.groupChosen.show();

        //control the change type button
        //app.selectTypeButtomsManager();

        //run choose more models method 
        app.addModel();
        
        //Show model chooser
        app.addModelBtn.on("click", function(e){
            e.preventDefault();
            app.addModelLabel.hide();
           
            //added this line to stop the jumping on showing dropdown menu
            $(app.chooseModelPanel.selector).css('overflow','hidden');
            //show panel
            app.chooseModelPanel.slideDown("slow", function(){
                 //added the overflow back so the dropdown menu show the whole list
                $(app.chooseModelPanel.selector).css('overflow','visible');
            });
        });
        
        //attach click to remove model - this way because it doesn't exist on page load
        $(document).on("click", ".remove-model a", function(e){            
                
                e.preventDefault();
                
                var modelSelectedBlock = $(this).parents(".model-selected"),
                    modelSelectedRef = modelSelectedBlock.find(".request-model").html();
                
                modelSelectedBlock.remove();
                if($(".select-this-model-error").prop("id") == "no-selection-for-"+modelSelectedRef){
                    $(".add-model-error").empty();
                } 
                
                app.oneCar.removeClass("disabled-selection");
                
                $(".model-selected").each(function(){
                    var thisSelection =  $(this).attr("data-car-related");
                    app.chooseModelPanel.find(".one-car[data-car-index='"+thisSelection+"']").addClass("disabled-selection");
                });

                if($(".model-selected").length < app.numberOFCars){
                    $("#add-model-btn a").show();
                }

                //reset the button's text
                app.addModelButtonManager();
       });
          
    },
    
    //address selection manager       
    addressSelection: function(){
        //app default interface
        app.manualAddressPanel.hide();
        app.addressLookupResultsPanel.hide();
        app.customRetailerSelect.hide();
        titleFieldController();

        //function to grab value from dropdow startong from the dropdown container
        function getDropdownValue(thisDropdown, thisFormFieldTarget){
            thisFormFieldTarget.val("");
            thisDropdown.find(".mfs-container a").on("click", function(){
                var value  = thisDropdown.find("select option:selected").val();
                thisFormFieldTarget.val("").val(value);
            });
        };

        //disables the 'Other' option when title is selected via the dropdown
        function titleFieldController(){
            
            var thisDropdown = $("#title-field"),
                otherField = $("#EClassEstate_titleOther");

            thisDropdown.find("select option[value='Mr']").attr("selected","selected");
            otherField.attr('disabled','disabled').val("").hide();
            
            $("#title-field select").on("change",  function(){
                var value  = $(this).find("option:selected").val();
                
                if(value == "Other"){
                    otherField.removeAttr('disabled').val("").show();
                }else{
                    otherField.attr('disabled','disabled').val("").hide();
                }
                //handle error message as best as we can
                if(otherField.attr('disabled')){
                    $("#EClassEstate_titleOther_em_").hide();
                }else{
                    $("#EClassEstate_titleOther_em_").show();
                }
            });

        };

        //address lookup btn
        app.lookUpPostcode.on("click", function(e){
            e.preventDefault();
            $("#no-address-selected-error").empty();
            //get the postcode
            var userPostcode = $.trim($("#EClassEstate_postcode").val().replace(/\s/g, ""));
            
            //empty form fields on the hidden panel 
            app.manualAddressPanel.find(".form-field input").each(function(){
                $(this).val("");
            });
            //empty the postcode lookup dynamic fields..
            app.addressLookupResults.empty();
            app.closestRetailersResults.empty();
            
            //validate postcode function
            function valid_postcode(postcode) {
                postcode = postcode.replace(/\s/g, "");
                //var regex = /^[A-Z]{1,2}[0-9]{1,2} ?[0-9][A-Z]{2}$/i;
                var regex = /^([a-zA-Z]){1}([0-9][0-9]|[0-9]|[a-zA-Z][0-9][a-zA-Z]|[a-zA-Z][0-9][0-9]|[a-zA-Z][0-9]){1}\s*([0-9][a-zA-z][a-zA-z]){1}$/;
                return regex.test(postcode);
            };

            //on postcode lookup populate right input fields with selected address
            function populateAddrssFieldOnselection(theAddress, theAddresses){                        
                var userSelectedAddress = theAddresses[theAddress];
                    if(theAddress == ''){
                        $("#address-display").empty();
                    }else{

                        var addressToDisplay = userSelectedAddress.property+", "+userSelectedAddress.street+", "+userSelectedAddress.town+"<br/>"+userSelectedAddress.postcode;
                        

                        $("#address-display").empty().append(addressToDisplay); 
                        //replace dropdown selected option with default text
                        $("#address-lookup-results a.mfs-selected-option").html("Address selected <span></span>");
                        //remove error
                        $("#address-not-selected").remove();
                    } 

            };

            //append error message on invalid postcode
            if(!userPostcode || !valid_postcode(userPostcode)){
                
                app.addressLookupResults.empty().append("<p class='grid_8 push_4 alpha custom-error errorMessage'>Invalid postcode</p>");
                //app.closestRetailersResults.append("<p class='custom-error errorMessage'>No retailers found</p>");
                $("#retailer-center-selection").hide();
                app.customRetailerOptionBlock.hide();
                $("#custom-error-block").empty();
            
            //else do the postcode and retailers request 
            }else{

                //remove any eventual error
                $("#custom-error-block").empty();
                app.customRetailerOptionBlock.hide();

                //append preloader
                app.addressLookupResults.append("<p class='grid_8 push_4 alpha preloader'>Loading results...</p>")

                //do AJAX call to get addresses from postcode
                $.ajax({
                    type: "GET",
                    dataType: 'json',
                    async: true,
                    url: app.postcodeLookup+userPostcode,
                }).done(function(response) {
                    if(!response.data) {
                        app.addressLookupResults.empty().append("<p class='grid_8 push_4 alpha custom-error errorMessage'>Postcode not found</p>");
                        $("#retailer-center-selection").hide();
                        $("#custom-error-block").hide();
                        return false;
                    } else {
                      $("#retailer-center-selection").show();  
                      $("#custom-error-block").show();
                    }                   
                    var xml = response.data;

                    //function to build the <option> list for the addrss dropdown
                    function renderAddresses(addressesList){
                        var out = "<option value=''>Select one option</option>";

                        for(var i = 0; i<xml.length;i++){
                            
                            var fullAddress = xml[i].property+", "+xml[i].street+", "+xml[i].town;
                            
                            out = out + "<option data-postcode='"+xml[i].postcode+"' value='"+i+"'>"+fullAddress+"</option>";
                        };

                        return out;
                    };
                    

                    //test if any address is returned
                    if(xml.length == 0){

                        //append error if no address can be found for a VALID postcode
                        app.addressLookupResults.empty().append("<p class='grid_8 push_4 alpha custom-error errorMessage'>No addresses found</p>");
                    
                    }else{
                        //populate the address lookup fields
                        //append retailers options
                        app.addressLookupResults.empty().append("<div id='choose-address-field' class='text-block form-field grid_12'>"+
                                                       "<label for='choose-address' class='grid_4 alpha'>Address <sup>*</sup></label>"+
                                                        "<div class='grid_4'>"+  
                                                            "<select id='choose-address' disabled>"+
                                                                renderAddresses(xml)+
                                                            "</select>"+
                                                        "</div>"+
                                                    "</div>"+
                                                    "<div class='clear'></div>"+
                                                    "<div id='address-display' class='text-block grid_4 push_4 alpha'></div>"
                                                    ).mfs();
                    
                        //on click update the address line
                        $("#address-lookup-results").find(".mfs-option a").on("click", function(){
                            
                            var itemIndex  = $("#choose-address-field").find("select option:selected").val(),
                                pCode = $("#choose-address-field").find("select option:selected").attr("data-postcode");
                                
                                //update address panel
                                populateAddrssFieldOnselection(itemIndex, xml);

                                if(itemIndex){
                                    //send address to correct form fields 
                                    app.addressToPost.val(xml[itemIndex].property);
                                    app.addressToPost2.val(xml[itemIndex].street);
                                    app.addressToPost3.val(xml[itemIndex].locality);
                                    app.townToPost.val(xml[itemIndex].town);
                                    app.countyToPost.val(xml[itemIndex].county); 
                                }else{
                                    //empty the form fields
                                    app.addressToPost.val("");
                                    app.addressToPost2.val("");
                                    app.addressToPost3.val("");
                                    app.townToPost.val("");
                                    app.countyToPost.val(""); 
                                };
                                

                        });

                    
                        //show retailer custom selection
                        app.customRetailerOptionBlock.show();

                        //do AJAX call to get closest retailers
                        $.ajax({
                            type: "GET",
                            dataType: 'json',
                            async: true,
                            url: app.closestRetailersData+userPostcode+"&vehicleType=passenger_cars&quantity="+app.closestRetailersNumber,
                        }).done(function(resp) {
                            
                            //retailers options
                            var addresses = resp.data;

                            if(addresses){
                                app.closestRetailersResults.empty();
                               app.closestRetailersResults.empty();
                                for(var i = 0; i < addresses.length; i++){
                                    app.closestRetailersResults.append("<div class='clearfix retailer-option'>"+
                                                                            "<span>"+
                                                                                "<input id='retailer-address-"+(i + 1)+"-rt' type='radio' name='retailer-address' data-value='"+addresses[i].retailer.rod_code+"'/>"+
                                                                            "</span>"+
                                                                            "<label for='retailer-address-"+(i + 1)+"-rt'>"+
                                                                                addresses[i].retailer.name+
                                                                            "</label>"+
                                                                        "</div>"
                                    );
                                };

                                //label is visible
                                $(".retailer-option").show();   
                                app.customRetailerSelect.hide();

                                //show full list of retailers if option is selected
                                //get the selected retailer ROD code and pass it to the correct form field

                                $("input[name='retailer-address']").on("click", function(){
                                    var selectedRetailer;

                                    //remove retailer not selected error
                                    $("#retailer-not-selected").remove();

                                    if( app.customRetailerOption.is(':checked')){
                                        
                                        app.customRetailerSelect.show();
                                        
                                        //send selected retailer info from dropdown
                                        getDropdownValue(app.customRetailerSelect, app.retailerRODCode);

                                        //remove error when option selected from dropdown
                                        var selectionList =  app.customRetailerSelect.find(".mfs-options li a");
                                        selectionList.each(function(index){
                                            $(this).on("click", function(){
                                                $("#retailer-not-selected").remove();
                                            })
                                        })

                                    }else{

                                        app.customRetailerSelect.hide();
          
                                        selectedRetailer = $(this).attr("data-value");
                                        //send selected retailer info from checkbox
                                        app.retailerRODCode.val("").val(selectedRetailer);

                                    };
                                
                                });

                                

                            }else{
                                
                                $(".retailer-option").hide();
                                //show retailer custom selection dropdown only
                                app.customRetailerSelect.show();
                                getDropdownValue(app.customRetailerSelect, app.retailerRODCode);

                                //remove error when option selected from dropdown
                                var selectionList =  app.customRetailerSelect.find(".mfs-options li a");
                                selectionList.each(function(index){
                                    $(this).on("click", function(){
                                        $("#retailer-not-selected").remove();
                                    })
                                });

                            }; 

                        }).fail(function(){
                            //append error if 
                            app.closestRetailersResults.append("<p class='custom-error errorMessage'>No retailers found</p>");
                        });
                    };
       
                }).fail(function(){
                        app.addressLookupResults.empty().append("<p class='grid_8 push_4 alpha custom-error errorMessage'>Invalid postcode</p>");
                        app.closestRetailersResults.append("<p class='custom-error errorMessage'>No retailers found</p>");
                        app.customRetailerOptionBlock.hide();
                });
            };

            //show the panel once populated
            app.addressLookupResultsPanel.delay(2000).show();
            
        });

    },

    customValidation: function(){
        
        function postcodeLookupValidation(event){

            if(!app.addressToPost.val() && !app.retailerRODCode.val() && !app.addressToPost2.val()){
                
                event.preventDefault();

                $("#custom-error-block").empty().append("<p class='errorMessage grid_8' id='retailer-not-selected'>Please select a Retailer</p><p class='errorMessage grid_8' id='address-not-selected'>Please select an address</p>");

                if( app.addressLookupResultsPanel.is(':hidden')){
                    //app.manualAddressPanel.show();
                    $("#no-address-selected-error").empty().append("<p class='errorMessage custom-error'>Please look up your address</p>");
                }else{
                    //all good
                }

                //scroll to error
                app.scrollAction($(".manual-address-block"));

            }else if(!app.retailerRODCode.val()){
                event.preventDefault();
                //add please select retailer
                $("#custom-error-block").empty().append("<p class='errorMessage grid_8' id='retailer-not-selected'>Please select a Retailer</p>");

                //scroll to error
                app.scrollAction($(".manual-address-block"));

            }else if(!app.addressToPost.val() && !app.addressToPost2.val()){
                event.preventDefault();
                //add select house address
                $("#custom-error-block").empty().append("<p class='errorMessage grid_8' id='address-not-selected'>Please select an address</p>");

                //scroll to error
                app.scrollAction($(".manual-address-block"));

            }else{
                //$("#custom-error-block").empty();
                //post the form
            }
             
        };

      /*  function modelRequestValidation(event){
            var modelSelected = $(".model-selected"),
                errorMessage,
                modelName,
                errorType,
                isValid = true;

            //do the check to see if at least one checkbox per model has been selected
            if(modelSelected.length > 0){
                
                modelSelected.each(function(){
                    
                    var checkbox = $(this).find("input:checked");

                    if(checkbox.length == 0){
                        //get this car name and output error
                        modelName = $(this).find(".request-model").html();
                        isValid = false;
                        errorMessage = "Please select an option for " + $.trim(modelName);
                        errorType = "select-this-model-error";
                        
                        return false;
                    }
                
                });

            }else{
                isValid = false;
                errorMessage = "Please select a model";
                modelName = "no-model";
                errorType = "select-model-error";
            }
            
            //prevent submitting the form and show anerror message
            if(isValid == false){
                
                event.preventDefault();
                
                $(".add-model-error:eq(0)").empty().append("<p id='no-selection-for-"+modelName+"' class='"+errorType+" errorMessage custom-error'>"+errorMessage+"</p>");

                //scroll to error
                app.scrollAction($("#form-page-content"));

            }else{
                //do nothing and post the form
                $(".add-model-error").empty();
                
            } 
        }; */

        app.submitFormBtn.on("click", function(e){
            postcodeLookupValidation(e);
            app.checkErrorOnUserDetails();
            //modelRequestValidation(e);
        });
    },
    
    scrollAction: function(element){

        var toGoTo = element.offset().top;
        $('html,body').animate({ 
            scrollTop: toGoTo 
        }, 200, function(){
            return false;
        });
    },

    checkErrorOnUserDetails: function(){
        $("#personal-details-block input[type=text]").each(function(){

            if($(this).is(":empty") && $(this).attr("disabled") != "disabled"){

                app.scrollAction($("#personal-details-block"));

                return false;
            }

        });
    },
                    
    init: function(){
        app.addressSelection();
        app.form.mfs();
        app.manageModels(); 
        app.customValidation();
        app.form.trigger("reset");

    }
};


var utilities = {

    imgTagRollover: function(){
        var theImages = $(".imageRollover");

        theImages.each(function(){

            $(this).hover(
                function(){
                    //hover image here
                    $(this).attr("src", $(this).attr("data-image-hover"));
                },
                function(){
                    //default image here
                    $(this).attr("src", $(this).attr("data-image-default"));
                }
            );

        });
    },
    
    jsDisabledError: function(){
          var thePanel = $("#js-error-msg");
          thePanel.hide();
    },
            

    init: function(){
        utilities.imgTagRollover();
        utilities.jsDisabledError();
    }

};
