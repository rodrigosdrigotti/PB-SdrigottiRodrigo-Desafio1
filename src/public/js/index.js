/* let btn = document.getElementById('agregarProducto');
   
   // when the btn is clicked print info in console 
   btn.addEventListener('click', (ev)=>{
     console.log("Btn clicked");
}); */

document.addEventListener('DOMContentLoaded', function () {
    let productToAdd = document.getElementById('agregarProducto')
  
        productToAdd.addEventListener('click', function () {
        const cartId = "65ad98aa813faafe418d2fde"
        const productId = this._id
        const quantity = 1
  
        fetch(`/api/carts/${cartId}`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            },
            // Envia la nueva cantidad en el cuerpo de la solicitud
            body: JSON.stringify({ quantity }),
        })
            .then(function (response) {
            return response.json();
            })
            .then(function (carritoActualizado) {
            // Maneja el carrito actualizado después de la actualización de cantidad
            console.log(carritoActualizado);
            })
            .catch(function (error) {
            // Maneja cualquier error que ocurra durante la solicitud
            console.error('Error en la solicitud fetch:', error);
            });
    })
}) 

function addToCart(productId) {
    const quantity = 1;  // Puedes ajustar la cantidad según tus necesidades

    // Realizar la solicitud PUT a la API
    fetch(`/api/carts/65ad98aa813faafe418d2fde`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId, quantity }),
    })
    .then(response => response.json())
    .then(data => {
      // Manejar la respuesta según tus necesidades
      console.log('Carrito actualizado:', data);
    })
    .catch(error => {
      console.error('Error al agregar al carrito:', error);
    });
  }