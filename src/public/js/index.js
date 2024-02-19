

const test = document.addEventListener('DOMContentLoaded', function () {
  if(test){
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
  }
}) 

function addToCart(productId) {
    const quantity = 1;  // Puedes ajustar la cantidad según tus necesidades

    // Realizar la solicitud POST a la API
    fetch(`/api/carts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId, quantity }),
    })
    .then(response => response.json())
    .then(responseData => {
      if (responseData.status === 'Success') { 
          window.location.href = '/api/carts'; 
      }
    })
    .catch(error => {
      console.error('Error al agregar al carrito:', error);
    });
  }