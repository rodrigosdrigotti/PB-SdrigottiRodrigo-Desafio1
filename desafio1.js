class ProductManager {
    constructor() {
        this.products= [];
        this.counterId = 1;
    }
    addProduct(product) {
        //Validar campos obligatiorios
        if(!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock){
            console.log("Todos los campos son obligatorios");
            return;
        }

        //Validar campo "code"
        if(this.products.some(prod => prod.code === product.code)){
            console.log("Ya existe el producto");
            return;
        }

        product.id = this.counterId++;
        this.products.push(product);
        console.log("Producto agregado");
    }

    getProducts() {
        return this.products;
    }

    getProductsById(id) {
        const productFound = this.products.find(prod => prod.id === id);
        if(productFound) {
            return productFound;
        }
        else {
            console.error("Producto no encontrado");
            return null;
        }
    }
}


// Proceso de Testing
const productManager = new ProductManager();

console.log("Todos los productos: ", productManager.getProducts())

productManager.addProduct({
    title: "Producto prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc123",
    stock: 25
});

console.log("Todos los productos: ", productManager.getProducts());

productManager.addProduct({
    title: "Producto prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc123",
    stock: 25
});

const foundProduct = productManager.getProductsById(1);
console.log("Producto encontrado: ", foundProduct);