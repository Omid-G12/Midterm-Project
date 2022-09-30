$(document).ready(function() {

  const ordered_items = [];
  //listener for add to cart 1
  $('.add-to-cart-1').click( () => {
    if ($('.quantity-1').val() > 0) {
      //console.log('yo');
      const item = { id: 1, quantity: $('.quantity-1').val() }
      console.log(item);
      ordered_items.push(item);
    }
  })

  $('.add-to-cart-2').click( () => {
    if ($('.quantity-2').val() > 0) {
      //console.log('yo');
      const item = { id: 2, quantity: $('.quantity-2').val() }
      console.log(item);
      ordered_items.push(item);
    }
  })

  $('.add-to-cart-3').click( () => {
    if ($('.quantity-3').val() > 0) {
      //console.log('yo');
      const item = { id: 3, quantity: $('.quantity-3').val() }
      console.log(item);
      ordered_items.push(item);
    }
  })

  $('#place-order').click( () => {
    console.log("ordered items:", ordered_items);
    //const test = getMenuItems();
    //$.ajax('/api/order/allmenuitems')
    $.ajax('/api/order', {
      method: 'post',
      data: {items: ordered_items},
    })

  })
});
