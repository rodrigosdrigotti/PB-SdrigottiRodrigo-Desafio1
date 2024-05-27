const clear = document.getElementById('clearInput')
const form = document.getElementById('recoverUser')

clear.onclick = function() {
    form.reset()
}

form.addEventListener('submit', e => {
    e.preventDefault()

    const data = new FormData(form)

    const obj = {}

    data.forEach((value, key) => (obj[key] = value))

    const fetchParams = {
        url: '/api/users/recoverUser',
        headers: {
            'Content-type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(obj),
    }

    fetch(fetchParams.url, {
        headers: fetchParams.headers,
        method: fetchParams.method,
        body: fetchParams.body
    })
    .then(response => response.json())
    .then(responseData => {
        if (responseData.status === 'Success') { 
            window.location.href = '/login.html'; 
        } else {
            // Inicio de sesión no exitoso
            console.log("Recupero de Usuario fallido")
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Se ha producido un error al recuperar el Usuario",
              });
        }
    })
    .catch(error => console.log(error))
})