const form = document.getElementById('addProductForm')

form.addEventListener('submit', e => {
    e.preventDefault()

    const data = new FormData(form)
    console.log(data)
    const obj = {}

    data.forEach((value, key) => (obj[key] = value))

    const fetchParams = {
        url: '/api/products',
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
        if (responseData.status === 'success') { 
            Swal.fire({
                icon: "success",
                text: "Se ha agregado el producto correctamente.",
            })
            //* Limpiar los campos del formulario
            form.reset();
        }
    })
    //.catch(error => console.log(error.message))
    .catch(error => {
        console.log("Cambio de Contraseña fallida")
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: `${error.cause}`,
        });
    })
})