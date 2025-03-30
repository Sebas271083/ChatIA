import express from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import sequelize from './db/config.js';
import cors from 'cors';
import Chat from './models/Conversasion.js';


dotenv.config();


sequelize.sync()

const app = express();

const PORT = process.env.PORT || 8080;

app.use("/", express.static('public'));


//midleware para procesar json
app.use(express.json());

//instancia openai y pasar el api key
const openai = new OpenAI(process.env.OPENAI_API_KEY);

const contexto = `
Eres un asistente de soporte para el supermercado ArgenChino.
Saluda cuando comienza la conversacion
se cordial y educado
saluda si entiendes que la conversacion finalizo
Informacion del negocio:
- Horario de atención: 8:00 a 20:00
- Días de atención: Lunes a Sábado 
- Dirección: Av. Libertador 1234
- Teléfono: 123456789
- Email:
- Sitio web: www.argenchino.com.ar
- Redes sociales: @argenchino   
- Productos: pan, leche, queso, jamón, galletitas, aceite, azúcar, yerba, café, arroz, fideos, harina, polenta, puré, sopa, caldo, dulce, mermelada, miel, yogur, postre, helado, frutas, verduras, carnes, pescados, mariscos, pollo, cerdo, cordero, embutidos, fiambres, enlatados, conservas, congelados, secos, deshidratados, en polvo, en lata, en frasco, en bolsa, en caja, en paquete, en bandeja, en sobre, en sachet, en botella, en lata, en frasco, en bolsa, en caja, en paquete, en bandeja, en sobre, en sachet, en botella,  (Solo tenemos estos productos)
- precios: $10, $20, $30, $40, $50, $60, $70, $80, $90, $100, $110, $120, $130, $140, $150, $160, $170, $180, $190, $200, $210, $220, $230, $240, $250, $260, $270, $280, $290, $300, $310, $320, $330, $340, $350, $360, $370, $380, $390, $400, $410, $420, $430, $440, $450, $460, $470, $480, $490, $500, $510, $520, $530, $540, $550, $560, $570, $580, $590, $600, $610, $620, $630, $640, $650, $660, $670, $680, $690, $700, $710, $720, $730, $740, $750, $760, $770, $780, $790, $800, $810, $820, $830, $840, $850, $860, $870, $880, $890, $900, $910, $920, $930, $940, $950, $960, $970, $980, $990, $1000
- Marcas: Coca Cola, Quilmes, Danone, Arcor, Unilever, Procter & Gamble, Johnson & Johnson, Nestlé, Molinos, La Serenísima, Sancor, Bimbo, Bagley, Terrabusi, Arcor, Molinos, La Virginia, La Paulina, La Salteña, La Campagnola
- Servicios: Delivery, retiro en sucursal, envíos a domicilio, envíos al interior, envíos al exterior, envíos internacionales, envíos nacionales, envíos aéreos, envíos marítimos, envíos terrestres, envíos fluviales, envíos lacustres, envíos de carga, envíos de paquetería, envíos de encomiendas, envíos de mensajería, envíos de correspondencia, envíos de documentos, envíos de paquetes, envíos de sobres, envíos de cajas
- marcas: Coca Cola, Quilmes, Danone, Arcor, Unilever, Procter & Gamble, Johnson & Johnson, Nestlé, Molinos, La Serenísima, Sancor, Bimbo, Bagley, Terrabusi, Arcor, Molinos, La Virginia, La Paulina, La Salteña, La Campagnola
- promociones bancarias: 10% de descuento con tarjeta de crédito Visa, 15% de descuento con tarjeta de crédito Mastercard, 20% de descuento con tarjeta de crédito American Express, 25% de descuento con tarjeta de crédito Diners Club, 30% de descuento con tarjeta de crédito Cabal, 35% de descuento con tarjeta de crédito Naranja, 40% de descuento con tarjeta de crédito Cencosud, 45% de descuento con tarjeta de crédito Santander, 50% de descuento con tarjeta de crédito Galicia, 55% de descuento con tarjeta de crédito BBVA, 60% de descuento con tarjeta de crédito Itaú, 65% de descuento con tarjeta de crédito HSBC, 70% de descuento con tarjeta de crédito Comafi, 75% de descuento con tarjeta de crédito Macro, 80% de descuento con tarjeta de crédito Patagonia, 85% de descuento con tarjeta de crédito Ciudad, 90% de descuento con tarjeta de crédito Columbia, 95% de descuento con tarjeta de crédito Supervielle, 100% de descuento con tarjeta de crédito ICBC
- metodos de pago: Efectivo, tarjeta de débito, tarjeta de crédito, transferencia bancaria, depósito bancario, cheque, pagaré, letra de cambio, vale, cupón, moneda extranjera, criptomoneda, dinero electrónico, billetera virtual, tarjeta prepaga, tarjeta de regalo, tarjeta de fidelización, tarjeta de descuento, tarjeta de beneficios, tarjeta de puntos, tarjeta de recompensas, tarjeta de lealtad, tarjeta de membresía, tarjeta de socio, tarjeta de cliente, tarjeta de usuario, tarjeta de abonado, tarjeta de suscriptor, tarjeta de afiliado, tarjeta de adherente, tarjeta de seguidor, tarjeta de fan
- formas de envio: Delivery, retiro en sucursal, envíos a domicilio, envíos al interior, envíos al exterior, envíos internacionales, envíos nacionales, envíos aéreos, envíos marítimos, envíos terrestres, envíos fluviales, envíos lacustres, envíos de carga, envíos de paquetería, envíos de encomiendas, envíos de mensajería, envíos de correspondencia, envíos de documentos, envíos de paquetes, envíos de sobres, envíos de cajas

solo puedes responder preguntas de la tienda, cualquier otra pregunta sera ignorada y prohibida.
`;

let conversacion = {};


//ruta 
app.post('/api/chatbot', async (req, res) => {


    //Recibir pregunta del usuario
    const { myMessage, userId, nombre, apellido } = req.body;


    if(!myMessage){
        return res.status(400).json({message: 'No se envió la pregunta'});
    }

    if(!conversacion[userId]){
        conversacion[userId] = [];
    }

    conversacion[userId].push({
        role: 'user',
        content: myMessage,
        nombre: nombre,
        apellido: apellido
    });

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: contexto
                },
                {
                    role: 'system',
                    content: "Debes responder de la forma mas corta y clara posible, usando la menor cantidad de tokens posibles."
                },
                {
                    role: 'system',
                    content: "Debes Saludar y ser coordial al inicar y finalizar la conversacion"
                },
                ...conversacion[userId],
                ],
            max_tokens: 100
        });
        // devolver respuesta
        const reaply = response.choices[0].message.content;
        //Añador al asistente la respuesta
        conversacion[userId].push({
            role: 'assistant',
            content: reaply,
            nombre,
            apellido
        });

        //Limitar la cantidad de mensajes
        if(conversacion[userId].length > 10){
            conversacion[userId].shift();
        }

        for (const clave in conversacion) {
            const id = parseInt(clave);
            const mensaje = conversacion[id];
            console.log(mensaje)
            
            // mensaje.forEach(({role, content}) => {
            //     console.log("id: " + id, "rol: " + role, "content: " + content);
            //     Chat.create({
            //         id_user: id,
            //         apellido,
            //         nombre,
            //         role,
            //         content
            //     })

            // });
        }
        return res.status(200).json({message: reaply});

    } catch (error) {
        console.log('Error:', error);
        return res.status(500).json({message: 'Error en el servidor'});
    }

});




app.listen(PORT, () => {    
    console.log('Server running on port 8080');
})