const logoutButton = document.getElementById('logout');
   
   logoutButton.addEventListener('click', e =>{
    fetch('/api/auth/logout')
    .then(response => response.json())
    .then( window.location.href = "/api/login" )
    .catch(error => console.log(error))
});