const fs = require('fs').promises;

class ProductManager {
    constructor(path) {
        this.products= [];
        this.counterId = 1;
        this.path = path;
    }

    async addProduct (product) {
        //Validar campos obligatiorios
        if(!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock){
            console.log("Todos los campos son obligatorios");
            return;
        }
        //Validar campo "code"
        if(this.products.some(prod => prod.code === product.code)){
            console.error("Ya existe el producto");
            return;
        }

        product.id = this.counterId++;
        this.products.push(product);
        
        try { 
            await fs.writeFile(this.path, JSON.stringify(this.products, null, 2), 'utf-8');
            console.log("Producto agregado", product);
        } catch (error) {
            console.log("Error al escribir el archivo: ", error.message)
        }
    }
    async getProducts() {
        try {
            const dataRead = JSON.parse(await fs.readFile(this.path, "utf-8"))
            return dataRead;
        } catch (error) {
            console.log("Error al leer Archivo", error.message)
            return [];
        }
    }
    async getProductsById(id) {
        try {
            const dataRead = JSON.parse(await fs.readFile(this.path, "utf-8"))
            const productFound = dataRead.find(prod => prod.id === id)
            if(productFound){
                return productFound;
            }
            else {
                console.error("Producto no encontrado");
                return null;
            }
        } catch (error) {
            console.log("Error al buscar el producto: ", error.message)
        }
    }
    async updateProduct(id, newProduct) {
        try {
            const dataRead = JSON.parse(await fs.readFile(this.path, "utf-8"))
            const index = dataRead.findIndex(prod => prod.id === id)
            if(dataRead) {
                if(typeof newProduct === "object"){
                    dataRead[index] = {...dataRead[index], ...newProduct}
                } else if(typeof newProduct === "string"){
                    dataRead[index][newProduct] = newProduct;
                }
                await fs.writeFile('productos.json', JSON.stringify(dataRead, null, 2), 'utf8');
            }
        } catch (error) {
            console.log("Error al modificar el archivo. ", error.message);
        }
    }
    async deleteProduct(id) {
        try {
            const dataRead = JSON.parse(await fs.readFile(this.path, "utf-8"))
            const productFound = dataRead.filter(prod => prod.id !== id)
            if(productFound) {
                await fs.writeFile('productos.json', JSON.stringify(productFound, null, 2), 'utf8');
            }
            else {
                console.error("Producto no encontrado");
                return null;
            }
        } catch (error) {
            console.log("Error al eliminar el producto: ", error.message)
        }
    }
}

// Proceso de Testing
const productManager = new ProductManager("./productos.json");

(async () => {
    try {
        const products = await productManager.getProducts()
        console.log("Todos los productos: ", products)
    } catch (error) {
        console.log("Error: ", error)
    }
    await productManager.addProduct({
        title: "Producto prueba",
        description: "Este es un producto prueba",
        price: 200,
        thumbnail: "Sin imagen",
        code: "abc123",
        stock: 25
    });

    try {
        const productFound = await productManager.getProductsById(1)
        console.log("Producto Encontrado: ", productFound)
    } catch (error) {
        console.log("Error: ", error)
    }

    try {
        const idToUpdate = 1;
        const fieldToUpdate = 'price';
        const valueToUpdate = 100;
        const objectToUpdate = { newVariable: 'New Field', price: 500 };
        await productManager.updateProduct(idToUpdate, objectToUpdate);
        //await productManager.updateProduct(idToUpdate, fieldToUpdate);
        //await productManager.updateProduct(idToUpdate, { [fieldToUpdate]: valueToUpdate });
    } catch (error) {
        console.log("El producto no hay podido ser modificado. ", error.message)
    }

    try {
        const products = await productManager.getProducts()
        console.log("Todos los productos: ", products)
    } catch (error) {
        console.log("Error: ", error)
    }

    try {
        const idToDelete = 1
        await productManager.deleteProduct(idToDelete)
        console.log(`El producto con el id: ${idToDelete} ha sido eliminado correctamente`)
    } catch (error) {
        console.log("El producto no hay podido ser eliminado. ", error.message)
    }
 }) ();
 

 