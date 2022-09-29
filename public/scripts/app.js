// Client facing scripts here

$(document).ready(function() {
  let quantity = 0;
  $('.add-to-cart').click(function(){
    quantity += parseInt($('.quantity').val());
    console.log(quantity);
  });
});
