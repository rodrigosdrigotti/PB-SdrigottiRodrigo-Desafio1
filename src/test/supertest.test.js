const chai = require('chai')
const supertest = require('supertest')

const expect = chai.expect
const requester = supertest('http://localhost:8080')

describe("Testing Products", () => {
    let authTokenCookie
    let productID
    describe('POST /login', () => {
        it('Login', async () => {
            const res = await requester
                .post('/api/auth')
                .send({ email: 'sabrina.avallone2@gmail.com', password: 'sabrina' })
            
            expect(res.status).to.equal(200) 
            expect(res.body.status).to.equal('Success')
            expect(res.body.payload).to.equal('Logged In')
            
            expect(res.header['set-cookie']).to.be.an('array');
            authTokenCookie = res.header['set-cookie'].find(cookie => cookie.startsWith('authToken='));
            console.log(authTokenCookie)
            expect(authTokenCookie).to.exist; 
        })
    })

    describe("Test GET /products", () => {
        it("Devuelve todos los productos", async () => {
            const res = await requester
                .get('/api/products')
                .set('cookie', authTokenCookie)
            
            expect(res.ok).to.be.true
            expect(res.text).to.include('<div class="products-container">')
        })
    })

    describe("Test POST /products", () => {
        it("Agrega un Producto", async () => {
            const productMock = {
                title: 'Nuevo producto',
                description: 'Descripción del producto',
                code: 'ABC123',
                price: 10.99,
                stock: 100,
                category: 'Electronics',
                thumbnail: 'https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg',
                owner: 'si'
            }
            const { status, ok, _body } = await requester
                .post('/api/products')
                .set('cookie', authTokenCookie)
                .send(productMock)
            console.log(status, ok, _body)
            productID = _body.payload._id
            expect(_body.payload).to.have.property('_id')
        })
    })

    describe("Test PUT /products/:pid", () => {
        it("Actualiza un Producto a traves del ID", async () => {
            const updatedData = {
                title: 'Nuevo producto Modificado',
                description: 'Descripción del producto Modificado',
                code: 'ABC123',
                price: 10.99,
                stock: 100,
                category: 'Electronics',
                thumbnail: 'https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg',
                //owner: 'si'
            }
            const res = await requester
                .put(`/api/products/${productID}`)
                .set('cookie', authTokenCookie)
                .send(updatedData)
            expect(res.status).to.equal(201)
            expect(res.body.status).to.equal('success')
        })
    })

    describe("Test DELETE /products/:pid", () => {
        it("Elimina un Producto a traves del ID", async () => {
            const userData = {
                email: 'sabrina.avallone2@gmail.com',
                role: 'premium'
            } 
            const res = await requester
                .delete(`/api/products/${productID}`)
                .set('cookie', authTokenCookie)
                .set('user', userData)
            
            expect(res.status).to.equal(201)
            expect(res.body.status).to.equal('success')
        })
    })
})