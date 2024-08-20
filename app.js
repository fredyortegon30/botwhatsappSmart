const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')
require("dotenv").config

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

const { isActive } = require("./Utils")


const flowAdmin = require("./flows/admin.flow")

const flowFormulario = addKeyword(EVENTS.ACTION)
    .addAnswer(
        "¿Cuál es tu nombre?",
        { capture: true },
        async (ctx, ctxFn) => {
            await ctxFn.state.update({ name: ctx.body }); // Guarda el nombre del usuario en el estado
        }
    )
    .addAnswer("¿Cuál es tu edad?", { capture: true }, async (ctx, ctxFn) => {
        await ctxFn.state.update({ age: ctx.body }); // Guarda la edad del usuario en el estado
    })
    .addAnswer(
        "¿De que pais sos?",
        { capture: true },
        async (ctx, ctxFn) => {
            await ctxFn.state.update({ country: ctx.body }); // Guarda la comida favorita en el estado
        }
    )
    .addAnswer("¡Gracias por la información!", null, async (ctx, ctxFn) => {
        const userInfo = await ctxFn.state.getMyState(); // Recupera todos los datos almacenados en el estado
        console.log(userInfo)
        //console.log(`Nombre: ${userInfo.name}`);
        //console.log(`Edad: ${userInfo.age}`);
        //console.log(`Pais: ${userInfo.country}`);
    });



const flowValidation = addKeyword(EVENTS.WELCOME)
    .addAction(async (ctx, ctxFn) => {
        if (!await isActive(ctx, ctxFn)) {
            return ctxFn.endFlow()
        } else {
            return ctxFn.gotoFlow(flowFormulario)
        }
    })


const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowAdmin, flowValidation, flowFormulario])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()