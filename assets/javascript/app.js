// GLOBAL VARIABLES=================================================================
// Variable containing user keywords from search page
var keywords = "";

// Variable containing user keyword from home page
var keywordHome = "";

// Variable containing user min price, set to 0 in case user doesn't specify
var minPrice = 0;

// Variable containing user max price, set to 1,000,000 in case user doesn't specify
var maxPrice = 1000000000;

// Variable containing query URL for Etsy from search page parameters
var queryEtsyURL = "";

// Variable containing query URL for eBay from search page parameters
var queryEbayURL = "";

// Variable for Etsy API response object
var etsyResponseObj;

// Variable for Etsy iterator
var etsyIterator = 0;

// Variable for eBay API response object
var ebayResponseObj;

// Variable for eBay iterator
var ebayIterator = 0;

// FUNCTIONS
$(document).ready(function () {

    // GLOBAL FUNCTIONS===============================================================
    // Function to show localStorage 
    function showlocalstorage() {
        for (let i = 0; i < 4; i++) {
            $("#recentlyviewed").append(localStorage.getItem("title" + "description" + "itemURL" + "image" + i));
        }
    };

    // Function to retrieve user parameters from search.html
    function getParametersSearch() {
        // Empty current search results displayed
        $("#columnone").empty();
        $("#columntwo").empty();

        // Create variable containing user keywords
        keywords = $("#keyword-search").val().trim();

        // Create variable containing user min price
        minPrice = $("#minprice-search").val().trim();

        // Check if minPrice value was entered by user,
        // if not, enter 0
        if (minPrice <= 0) {
            minPrice = 0;
        }

        // Create variable containing user max price
        maxPrice = $("#maxprice-search").val().trim();

        // Check if maxPrice value was entered by user,
        // if not, enter 1 billion
        if (maxPrice <= 0) {
            maxPrice = 1000000000;
        }

        // Create variable for Etsy URL
        queryEtsyURL = "https://openapi.etsy.com/v2/listings/active?api_key=jydjjl78x1gb73jboqntx9o1&keywords=" + keywords + "&min_price=" + minPrice + "&max_price=" + maxPrice + "&includes=MainImage";

        // Create eBay queryURL for API requests
        queryEbayURL = "https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=EdCourtn-Gifty-PRD-dc2330105-18ab1ff8&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&keywords=" + keywords + "&itemFilter.name=MinPrice&itemFilter.value=" + minPrice + "&itemFilter.name=MaxPrice&itemFilter.value=" + maxPrice + "&itemFilter.paramName=Currency&itemFilter.paramValue=USD&outputSelector=PictureURLSuperSize";
    }

    // Function for Etsy for loop that passes in new iterator number to ask for 
    // four more items
    function etsyForLoop(etsyIterator) {
        for (let i = etsyIterator; i < (etsyIterator + 4); i++) {
        // Create variables needed
        var title = etsyResponseObj.results[i].title;
        var description = etsyResponseObj.results[i].description;
        var itemURL = etsyResponseObj.results[i].url;
        var image = etsyResponseObj.results[i].MainImage.url_fullxfull;
        var price = etsyResponseObj.results[i].price;

        // Create overall div to display in HTML and can be clicked to add to shopping cart
        var itemDiv = $("<div>")

        // Add display-item class to div to grab when adding to shopping cart
        itemDiv.addClass("display-item");

        // Create itemImage to attach to itemDiv
        var itemImage = $("<img>");

        // Add image source and responsive-img class
        itemImage.attr("src", image).addClass("responsive-img");

        // Creat URL to display in HTML
        var displayURL = $("<a>").attr("href", itemURL).attr("target", "_blank");

        // Create text to display in HTML
        var displayText = $("<h5>").text(title);

        // Add displayText to displayURL
        displayURL.append(displayText);

        // Add commas to price
        var displayPriceString = parseFloat(price).toLocaleString('en');

        // Add $ to price
        displayPriceString = "$" + displayPriceString;

        // Append image, URL, text, price to itemDiv
        itemDiv.append(itemImage).append(displayURL).append(displayPriceString);

        // Append itemDiv to HTML
        $("#columnone").append(itemDiv);
        }
    }

    // Function for Etsy for loop that passes in new iterator number to ask for 
    // four more items  
    function ebayForLoop(ebayIterator) {
        for (let x = ebayIterator; x < (ebayIterator + 4); x++) {
        // Create variables needed                        
        var ebayTitle = ebayResponseObj[x].title;
        var ebayItemURL = ebayResponseObj[x].viewItemURL;
        var ebayImage = ebayResponseObj[x].pictureURLSuperSize;
        var ebayItemPrice = ebayResponseObj[x].sellingStatus[0].convertedCurrentPrice[0]["__value__"];

        // Create overall div to display in HTML and can be clicked to add to shopping cart
        var ebayItemDiv = $("<div>")

        // Add display-item class to div to grab when adding to shopping cart
        ebayItemDiv.addClass("display-item");

        // Create itemImage to attach to itemDiv
        var ebayItemImage = $("<img>");

        // Add image source and responsive-img class
        ebayItemImage.attr("src", ebayImage).addClass("responsive-img");

        // Creat URL to display in HTML
        var ebayDisplayURL = $("<a>").attr("href", ebayItemURL).attr("target", "_blank");

        // Create text to display in HTML
        var ebayDisplayText = $("<h5>").text(ebayTitle);

        // Add displayText to displayURL
        ebayDisplayURL.append(ebayDisplayText);

        // Create price to display in HTML
        // Convert price object to a string
        var ebayPriceString = JSON.stringify(ebayItemPrice)
        // Remove quotes around new string
        ebayPriceString = ebayPriceString.replace(/^"(.*)"$/, '$1');
        // Add commas to price string 
        ebayPriceString = parseFloat(ebayPriceString).toLocaleString('en');

        // Add $ to price
        var ebayDisplayPrice = "$" + ebayPriceString;

        // Append image, URL, text, price to itemDiv
        ebayItemDiv.append(ebayItemImage).append(ebayDisplayURL).append(ebayDisplayPrice);

        // Append itemDiv to HTML
        $("#columntwo").append(ebayItemDiv);
        }
    }

    // Function to send Etsy API request, display results on search page
    function etsyAPI() {
        console.log("Etsy API function fired")
        console.log("Etsy queryURL: " + queryEtsyURL)
        // Create AJAX Etsy request based on user submission
        $.ajax({
            url: queryEtsyURL,
            method: "GET"
        }).then(function (resEtsy) {
            etsyResponseObj = resEtsy;
            etsyForLoop(0);
            etsyIterator += 4
            console.log("Etsy iterator #: " + etsyIterator);            
        });
    }

    // Function to send eBay API request, display in HTML
    function ebayAPI() {
        // Creat AJAX eBay request based on user submission
        $.ajax({
            url: queryEbayURL,
            method: "GET"
        }).then(function (resEbay) {
            // API comes back as a string, need to parse 
            var ebayobj = JSON.parse(resEbay);
            // Variable for itemArray to run the for loop for
            ebayResponseObj = ebayobj.findItemsByKeywordsResponse[0].searchResult[0].item;
            ebayForLoop(0);
            ebayIterator += 4
            console.log("Ebay iterator #: " + ebayIterator);
        })
    }

    // MAIN PROCESS===================================================================
    $(document).ready(function () {

        // CLICK FUNCTIONS
        // Retrieve values from search on search.html
        $("#search-search").on("click", function (event) {
            // event.preventDefault() prevents the form from trying to submit itself.
            event.preventDefault();

            // Clear previous search results from HTML
            $("#columnone").empty();
            $("#columntwo").empty();

            // Retrieve user search parameters
            getParametersSearch();

            // Send Etsy API request, display at search.html
            etsyAPI();

            // Send Ebay API request, display at search.html
            ebayAPI();

            // Display "More Choices" button
            $(".btn-more").css("display", "inline-block");

            // Reset keyword, min price and max price values for next search
            keywords = "";
            minPrice = 0;
            maxPrice = 1000000000;
        });

        // Retrieve values from search on home page and stores in local storage
        $("#search-index").on("click", function (event) {
            // event.preventDefault() prevents the form from trying to submit itself.
            event.preventDefault();

            // Clear previous search results from HTML
            $("#columnone").empty();
            $("#columntwo").empty();

            // Create variable containing user keywords
            keywords = $("#keyword-index").val().trim();

            // Store user keywords in localStorage
            localStorage.setItem("storage-keywords", keywords);

            window.location = "search.html";
        })

        // MORE RESULTS button action
        $(".btn-more").on("click", function (event) {
            // event.preventDefault() prevents the form from trying to submit itself.
            event.preventDefault();

            // Run Etsy For Loop
            etsyForLoop(etsyIterator);
            ebayForLoop(etsyIterator);
        })

        // GLOBAL PROCESS==================================================
        showlocalstorage();

        // PROCESS TO START ON SEARCH PAGE LOAD==============================
        if ($("body").is("#search-pg")) {
            console.log("Window location is working!");

            // Assign value from localStorage to keywordHome variable for API requests 
            var keywordHome = localStorage.getItem("storage-keywords");
            console.log("Local Storage keyword: " + keywordHome);

            // Create Etsy, eBay URLS
            queryEtsyURL = "https://openapi.etsy.com/v2/listings/active?api_key=jydjjl78x1gb73jboqntx9o1&keywords=" + keywordHome + "&includes=MainImage";
            queryEbayURL = "https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=EdCourtn-Gifty-PRD-dc2330105-18ab1ff8&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&keywords=" + keywordHome + "&itemFilter.paramName=Currency&itemFilter.paramValue=USD&outputSelector=PictureURLSuperSize";

            console.log(queryEbayURL);
            console.log(queryEtsyURL);

            // Do API requests, display in HTLM for Etsy, eBay
            etsyAPI();
            ebayAPI();

            // Display More button
            $(".btn-more").css("display", "inline-block");

            // Reset keyword, min price and max price values for next search
            keywords = "";
            minPrice = 0;
            maxPrice = 1000000000;
        };
    });
        // Clear previous search results from HTML
        $("#columnone").empty();
        $("#columntwo").empty();
        
        // Create variable containing user keywords
        keywords = $("#keyword-index").val().trim();

        // Store user keywords in localStorage
        localStorage.setItem("storage-keywords", keywords);
      
        window.location="search.html";
    })