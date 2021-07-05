/*

JavaScript for Online Store

*/



function loadContent() {
    //create a welcome alert for landing page
    //alert("Welcome to Techrown Solutions!!");
    let loadCart = [];

    //create add-to-cart button for items listed on shop.html
    $(".table").append("<button class='addToCart'>Add to Cart</button>");
    $(".addToCart").css({"width": "140px", "height": "30px", "border-radius": "3px", "text-align": "center"});


    //variable declaration
    var itemCount = document.querySelector("h6");
    var select = document.querySelector(".select");
    var cartButton = $(".addToCart");
    var buyButton = document.querySelector("#checkOut");
    //create a total variable in the session storage and give it a value o zero
    sessionStorage.setItem("total", "0");   

    //for loop to add counter to cart
    for(press of cartButton) {
        //create an event listener for each click on the add to cart button
        press.addEventListener("click", (e)=>{
            //get the data count attribute and assign it to a variable
            var add = Number(itemCount.getAttribute("data-count") || 0);
            //then set the data count attribute for the item count and add 1 
            itemCount.setAttribute("data-count", add + 1);
            //add to class list zero which will be used to change the opacity (this will make the count visible)
            itemCount.classList.add("zero");

            //copy and paste elements for 'pop up' div
            var parent = e.target.parentNode;
            var cloneB = parent.cloneNode(true);
            //since the entire node is cloned we change the button attributes and text to suite item removal
            //NB: the button is the last element for each clone.
            cloneB.lastChild.innerText = "remove";
            cloneB.lastChild.classList.remove("addToCart");
            cloneB.lastChild.classList.add("remove");
            select.appendChild(cloneB);
            
            //obtain the current price from the current table
            var currentPrice = parent.rows[1].cells[3].innerText;
            var oldTotal = JSON.parse(sessionStorage.getItem("total"));
            //add the price stored in sessionStorage to the selected item's price 
            var newTotal = (parseInt(oldTotal) + parseInt(currentPrice)).toFixed(2);
            //replace the current object in the loadCart array with the updated selection
            var currentSelection = select.innerHTML;
            loadCart.splice(0, 1, currentSelection);
            //update cart in session storage
            sessionStorage.setItem("myCart", JSON.stringify(loadCart));

            //create an alert to display current cart total
            alert("Current Cart Total: R " + newTotal);

            //update total in session storage
            sessionStorage.setItem("total", newTotal);

            //set conditional statement to display .select element when cloneB is 'true'. 
            if(cloneB) {
                //The display will be shown when the cart/item count is clicked
                itemCount.onclick =()=>{
                    select.classList.toggle("display");
                }
            }
            
            //create an event listener on each 'remove' button that will appear in the cart 
            cloneB.lastElementChild.addEventListener("click", (e)=>{
                
                var confirmation = confirm("You are about to remove this item from your cart. Click ok to continue");
                var targetParent = e.target.parentNode;
                var priceToChange = targetParent.rows[1].cells[3].innerText
                    add = Number(itemCount.getAttribute("data-count") || 0);

                //once the user has clicked ok on the confirm dialog
                if(confirmation){
                    //change the total and ...
                    oldTotal = JSON.parse(sessionStorage.getItem("total"));
                    newTotal = (parseInt(oldTotal) - parseInt(priceToChange)).toFixed(2);
                    //remove this node from the cart(.select)
                    targetParent.remove();
                    //... and then change the cart count
                    itemCount.setAttribute("data-count", add -1);
                    alert("Current Cart Total: R " + newTotal);
                    //NB:change total in session storage 
                    sessionStorage.setItem("total", newTotal);
            }
            });
        });   
    }

    //create an event listener for the check out button that appears in the cart(.select)
    buyButton.addEventListener("click", (e)=>{

        var confirmation2 = confirm("Great!! Please press okay to continue.");
        //when the user confirms 
        if(confirmation2){
            //go to checkout page
            window.location.href = "index-checkout.html";  
        }
    });
};


//this function is for the checkout page 
function loadCartContent() {

    //on load the the invoice div slides up
    $("#invoiceDiv").slideUp();

    //variable declaration
    var deliveryForm = document.getElementById("deliveryDetails");
    loadCart = JSON.parse(sessionStorage.getItem("myCart"));
    cartTotal = JSON.parse(sessionStorage.getItem("total"));

    //with the use of a for loop the cart items are appended to the checkout page
    for(items of loadCart) {

        var outterDiv = document.createElement("div");
        var divCart = document.querySelector(".checkOutCart");

        outterDiv.innerHTML = items;
        divCart.appendChild(outterDiv);
    };

    //more variable declarations
    let eleForTotal= document.createElement("p");
    eleForTotal.id = "orderTotal";
    //A proforma text is created and appended to the same div where the cart items were added.
    eleForTotal.innerHTML = `<br><br><h3>Proforma Invoice: </h3>
            
    Purchase order Total: R ${cartTotal}.00 (excluding VAT)<br><br>
    
    (Note: This amount is subject to change on account of delivery charges and/or applicable discounts.)`
    divCart.appendChild(eleForTotal);

    //remove buttons that now appear on the checkout page
    let removeBtns = document.getElementsByClassName("remove");
    
    //using a for loop iterate each of the remove buttons
    for(press2 of removeBtns){
        //add an event listener
        press2.addEventListener("click", (e)=>{
        
        //find the node that will be removed and the price to be deducted from the total
        //due to the buttons position, its next sibling would be our target
        var targetParent2 = e.target.nextSibling;
        var priceToChange2 = targetParent2.rows[1].cells[3].innerText;
    
        var confirmation3 = confirm("You are about to remove this item from your cart. Click ok to continue");
        
        //once the user confirms
        if(confirmation3){
            //change the total and ...
            var oldotal2 = JSON.parse(sessionStorage.getItem("total"));
            var newTotal2 = (parseInt(oldotal2) - parseInt(priceToChange2)).toFixed(2);
            //remove the node
            targetParent2.remove();
            //remove the button
            e.target.remove();

            //change the total accordingly and notify user
            alert("Current Cart Total: R " + newTotal2);
            
            var newOrderTotal = document.getElementById("orderTotal");

            newOrderTotal.innerHTML = `<br><br><h3>Proforma Invoice: </h3>
            
            Purchase order Total: R ${newTotal2}.00 (excluding VAT)<br><br>
            
            (Note: This amount is subject to change on account of delivery charges and/or applicable discounts.)`;

            divCart.appendChild(newOrderTotal);

            sessionStorage.setItem("total", newTotal2);
        }
    });

    }

    //function to take user form input and create an invoice and order notifaction
    //create an event listener for the form submission
    //which will execute the function
    deliveryForm.addEventListener("submit", function(e){
        //here, prevent default so that we can use the form data
        e.preventDefault();
        
        //variable declaration
        let invDiv = document.getElementById("invoiceDiv");
        let invParts = document.createElement("p");
        let refNum = Math.floor(Math.random()*10000) + 1;
        var prodTotal = JSON.parse(sessionStorage.getItem("total"));
        var vatTotal = (prodTotal*0.15).toFixed(2);
        var coupons = new Map();
        coupons.set("TSC0021", 0.02);
        coupons.set("TSC0022", 0.03);
        coupons.set("TSC0023", 0.04);
        coupons.set("TSC0024", 0.05);
        coupons.set("TSC0025", 0.10);
        var deliveryCost = new Map();
        deliveryCost.set("freight", 250);
        //variable declaration using form elements
        var inputName = document.getElementById("deliveryDetails").elements.namedItem("name").value;
        var inputEmail = document.getElementById("deliveryDetails").elements.namedItem("email").value;
        var inputPhone = document.getElementById("deliveryDetails").elements.namedItem("phoneNumber").value;
        var inputAltPhone = document.getElementById("deliveryDetails").elements.namedItem("alternativeNumber").value;
        var inputAddress1 = document.getElementById("deliveryDetails").elements.namedItem("address1").value;
        var inputAddress2 = document.getElementById("deliveryDetails").elements.namedItem("address2").value;
        var inputAddress3 = document.getElementById("deliveryDetails").elements.namedItem("address3").value;
        var inputAddress4 = document.getElementById("deliveryDetails").elements.namedItem("address4").value;
        var compAddress =  `${inputAddress1}, ${inputAddress2}, ${inputAddress3}, ${inputAddress4}`;
        
        var discountPerc = 0;
        var today = new Date();
        var date = today.getDate() + "-" + (today.getMonth() + 1) + "-" + today.getFullYear()
            
        //the if else statements below determine the correct value from the checked radio buttons
        if (document.getElementById("deliver").checked) {
            deliveryMethod = document.getElementById("deliveryDetails").elements.namedItem("deliverMethod").value;
            //delivery charge from array
            deliveryCharge = deliveryCost.get(deliveryMethod);
        }
        else if(document.getElementById("collect").checked){
            
            deliveryCharge = 0;
        }

        if (document.getElementById("account").checked) {
            paymentMethod = document.getElementById("deliveryDetails").elements.namedItem("account").value;
        }
        else if(document.getElementById("cash").checked) {
            paymentMethod = document.getElementById("deliveryDetails").elements.namedItem("cash").value;
        }
        else if(document.getElementById("creditCard").checked){
            paymentMethod = document.getElementById("deliveryDetails").elements.namedItem("creditCard").value;
        }


        if(document.getElementById("couponYes").checked) {
            couponVal = document.getElementById("couponYes").value;
            var couponRef = document.getElementById("deliveryDetails").elements.namedItem("couponCode").value;
            //discount percentage from coupons array
            discountPerc = coupons.get(couponRef);
            //calculate actual discount amount
            discountAmt = (prodTotal*discountPerc).toFixed(2);
        }
        else if(document.getElementById("couponNo").checked){
            couponVal = document.getElementById("deliveryDetails").elements.namedItem("couponNo").value;
            discountAmt = (prodTotal*discountPerc).toFixed(2);
        }
        //calculate final total
        var finalTotal = (prodTotal + deliveryCharge + parseFloat(vatTotal) - discountAmt).toFixed(2)
        
        //create an alert for user with all info
        alert(`
            Reference: TS${refNum}
            Client: ${inputName}
            Date: ${date}
            Email: ${inputEmail}
            Phone: ${inputPhone}
            Alt Phone: ${inputAltPhone}
            Adrress: ${compAddress}

            Product Total (PT): R ${prodTotal}.00
            Delivery Charge (DC): R ${deliveryCharge}.00 
            Discount: R ${discountAmt}
            VAT (15%): R ${vatTotal}
            Order Total: R ${finalTotal}
        `);

        
        //append all order info to invoice on checkout page
        invParts.innerHTML = `
        <span class="amt">Ref: ${refNum}</span><br>
        <span class="amt">Date: ${date}</span><br><br>
        ${inputName}<br>
        ${inputEmail}<br>
        ${inputPhone}<br>
        ${compAddress} <br>
        <hr class="invHr"><br>
        Product Total <span class="amt">R ${prodTotal}.00 </span><br>
        Delivery Charge <span class="amt">R ${deliveryCharge}.00 </span><br>
        Discount <span class="amt">R ${discountAmt}</span><br>
        VAT (15%) <span class="amt">R ${vatTotal}</span><br>
        <hr class="invHr"><br>
        Order Total <span class="amt">R ${finalTotal}</span><br>
        <hr class="invHr"><br>`;
 
        invDiv.appendChild(invParts);

        //slide populated invoice div down after submission
        $("#invoiceDiv").slideDown(1000);   
    });
}






