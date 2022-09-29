// Client facing scripts here

console.log("yes");

$(document).ready(function() {
  console.log("ready");
  $('.add-to-cart').click(function(){
    let quantity = $('.quantity').val();
    console.log(quantity);
  });
});
