const { email } = require('../configs/services.config')
const transport = require('../utils/nodemailer.util')
const { generateToken } = require('../utils/jwt.util')

class MailAdapter {
  async sendMessage(messageInfo, code) {

    switch (code) {
      case 1:
        const token = generateToken({
          email: messageInfo.email,
          first_name: messageInfo.first_name,
          last_name: messageInfo.last_name,
          role: messageInfo.role,
          cart: messageInfo.cart,
        })
    
        const resetLink = `http://localhost:8080/api/userRecovered/${token}`;

        await transport.sendMail({
            from: 'rodrigosdrigotti@gmail.com',
            to: messageInfo.email,
            subject: 'Eliminación de cuenta por inactividad',
            html: `
                <h1>Hola ${messageInfo.first_name}!!!</h1>
                <div>Su cuenta ha sido eliminada debido a la inactividad. Póngase en contacto con el soporte si tiene alguna pregunta.</div>
                <div>Si desea activarla nuevamente haz click debajo.</div>
                <a href="${resetLink}"><button class='loginButton'>Enviar Link</button></a>
              `,
        })
        break
      
      case 2:
        await transport.sendMail({
          from: email.identifier,
          to: messageInfo.email,
          subject: 'Bienvenido a nuestro Sitio',
          html: `
              <h1>Hola ${messageInfo.first_name}!!!</h1>
              <div>Bienvenido a mi Ecommerce de Coderhouse</div>
              <p>Y este perrito es para ti</p>
              <img src="cid:perrito" alt="Un perrito"/>
              <p>Disfrútalo</p
            <div>
            `,
          attachments: [
            {
              filename: 'perrito.jpg',
              path: process.cwd() + '/src/public/img/perrito.jpg',
              cid: 'perrito',
            },
          ],
        })
        break

      case 3:
        await transport.sendMail({
          from: 'rodrigosdrigotti@gmail.com',
          to: messageInfo.email,
          subject: 'Eliminación de Producto',
          html: `
              <h1>Hola ${messageInfo.first_name}!!!</h1>
              <div>Se eliminó un producto que usted ha creado. Póngase en contacto con el soporte si tiene alguna pregunta.</div>
             `,
        })
        break

      default:
        break
    }

  }
}

module.exports = MailAdapter