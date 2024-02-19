const form = document.getElementById('loginForm')

form.addEventListener('submit', e => {
    e.preventDefault()

    const data = new FormData(form)

    const obj = {}

    data.forEach((value, key) => (obj[key] = value))

    const fetchParams = {
        url: '/api/auth',
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
            window.location.href = '/api/products'; 
        } else {
            // Inicio de sesión no exitoso
            console.log("Inicio de sesión fallido")
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Usuario o Contraseña incorrecta",
              });
        }
    })
    .catch(error => console.log(error))
})