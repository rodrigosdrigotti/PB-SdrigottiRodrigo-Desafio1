
function deleteUser(userId) {
    // Realizar la solicitud DELETE a la API
    fetch(`/api/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(responseData => {
      if (responseData.status === 'Success') { 
          window.location.href = '/api/users'; 
      }
    })
    .catch(error => {
      console.error('Error al agregar al eliminar el usuario:', error);
    });
  }

 
function editUser(userId) {

  const userRole = document.getElementById('userRole').value

  // Realizar la solicitud PUT a la API
  fetch(`/api/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userRole }),
  })
  .then(response => response.json())
  .then(responseData => {
    if (responseData.status === 'Success') { 
        window.location.href = '/api/users'; 
    }
  })
  .catch(error => {
    console.error('Error al agregar al eliminar el usuario:', error);
  });
}

function searchUsers() {
  let input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("searchUserId");
  filter = input.value.toUpperCase();
  table = document.getElementsByTagName("table")[0];
  tr = table.getElementsByTagName("tr");
  
  for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[0]; // Change index to match the column you want to search
      if (td) {
          txtValue = td.textContent || td.innerText;
          if (txtValue.toUpperCase().indexOf(filter) > -1) {
              tr[i].style.display = "";
          } else {
              tr[i].style.display = "none";
          }
      }       
  }
}