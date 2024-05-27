function deleteProduct(productId) {
    // Realizar la solicitud DELETE a la API
    fetch(`/api/carts`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId }),
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