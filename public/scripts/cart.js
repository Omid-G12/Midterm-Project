

const loadCart = function () {
  $.get("/api/order")
  .then (data => {
    console.log("data:", data);
  })
};

const deleteItem = function () {

};

const increaseItemQuantity = function () {

};

const decreaseItemQuantity = function () {

};

$(document).ready(function() {
  // --- our code goes here ---

    loadCart();


  $(".addToCart").on("click", loadCart);
  $(".deleteItem").on("click", deleteItem);
  $(".increaseQuantity").on("click", increaseItemQuantity);
  $(".decreaseQuantity").on("click", decreaseItemQuantity);
});
