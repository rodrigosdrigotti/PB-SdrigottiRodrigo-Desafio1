const form = document.getElementById('signupForm')

form.addEventListener('submit', e => {
    e.preventDefault()

    const data = new FormData(form)

    const obj = {}

    data.forEach((value, key) => (obj[key] = value))

    const fetchParams = {
        url: '/api/users',
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
    //.then(data => console.log(data))
    .then(responseData => {
        if (responseData.status === 'success') { 
            Swal.fire({
                icon: "success",
                title: "Felicitaciones",
                text: "Se ha registrado correctamente. Inicie sesión",
            })
        }
    })
    .catch(error => console.log(error))
})

