const socket = io()

// Escucha el evento para actualizar la lista de productos
socket.on('updateProducts', (products) => {
  // Actualiza la lista de productos en la vista
  const productList = document.getElementById('productList');
  productList.innerHTML = '';
  products.forEach(product => {
    productList.innerHTML += `<li>${product}</li>`;
  });
});
  
// Maneja el envío del formulario para agregar productos
document.getElementById('productForm').addEventListener('submit', (event) => {
  event.preventDefault();

  const productTitle = document.getElementById('productTitle').value;
  const productDescription = document.getElementById('productDescription').value;
  const productCode = document.getElementById('productCode').value;
  const productPrice = document.getElementById('productPrice').value;
  const productStock = document.getElementById('productStock').value;
  const productCategory = document.getElementById('productCategory').value;
  socket.emit('createProduct', {
    title: productTitle,
    description: productDescription,
    code: productCode,
    price: productPrice,
    status: true,
    stock: productStock,
    category: productCategory
  });

  // Limpia el campo del formulario después de enviar
  document.getElementById('productTitle').value = '';
  document.getElementById('productDescription').value = '';
  document.getElementById('productCode').value = '';
  document.getElementById('productPrice').value = '';
  document.getElementById('productStock').value = '';
  document.getElementById('productCategory').value = '';
});
