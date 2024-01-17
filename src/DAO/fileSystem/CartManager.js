const fs = require('fs').promises;

class CartManager {
    constructor(path) {
        this.carts= [];
        this.counterId = 1;
        this.path = path;
        this.loadCarts();
    }

    async loadCarts() {
        try {
            const cartToAdd = JSON.parse(await fs.readFile(this.path, "utf-8"))
            this.carts = cartToAdd
            this.counterId = Math.max(...this.carts.map(cart => cart.id), 0) +1
        } catch (error) {
            console.log("Error al leer Archivo", error.message)
        }
    }

    async newCart() {
        const newCart = {
            id: this.counterId++,
            products: [],
        }

        this.carts.push(newCart);
        
        try { 
            await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2), 'utf-8');
            //console.log("Carrito agregado", newCart);
            return newCart;
        } catch (error) {
            console.log("Error al escribir el archivo: ", error.message)
        }
    }
    async allCarts() {
        try {
            const dataRead = JSON.parse(await fs.readFile(this.path, "utf-8"))
            this.carts = dataRead;
            return dataRead;
        } catch (error) {
            console.log("Error al leer Archivo", error.message)
            return [];
        }
    }
    async oneCartById(id) {
        try {
            const dataRead = JSON.parse(await fs.readFile(this.path, "utf-8"))
            const cartProductsFound = dataRead.find(cart => cart.id === Number(id))
            if(cartProductsFound){
                return cartProductsFound;
            }
            else {
                console.error("Carrito no encontrado");
                return null;
            }
        } catch (error) {
            console.log("Error al buscar el producto: ", error.message)
        }
    }
    async newProductAddedToCart(cid, pid) {
        const cartExist = this.carts.find(cart => cart.id === Number(cid))
        const cartIndex = this.carts.findIndex(cart => cart.id === Number(cid))

        if(cartExist){
            const prodExist = cartExist.products.find(prod => prod.id === pid)
            if(prodExist){
                prodExist.quantity += 1
            } else {
                this.carts[cartIndex].products.push({
                    id: pid,
                    quantity: 1
                })
            }
        } else {
            console.error("Carrito no encontrado");
            return null;
        }

        try { 
            await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2), 'utf-8');
            //console.log("Producto agregado", cartExist);
            return cartExist;
        } catch (error) {
            console.log("Error al escribir el archivo: ", error.message)
        }
    }
}

module.exports = CartManager;