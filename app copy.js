const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')
require("dotenv").config

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

const isActive = async (ctx, ctxFn) => {
    let currentGlobalState = await ctxFn.globalState.getMyState();
    currentGlobalState.encendido = currentGlobalState.encendido ?? true; //Por default encendido
    return currentGlobalState.encendido
}

const flowAdministrador = addKeyword(["!active", "!help"])
    .addAction(async (ctx, ctxFn) => {
        // Lista de números de administradores autorizados
        //const adminNum = ["NUMERO ADMIN"];

        // Validación de número de administrador
        //if (!adminNum.includes(ctx.from)) {
        //    return ctxFn.flowDynamic("No estás autorizado para comandar el bot.");
        //}

        // Comando de ayuda
        if (ctx.body.includes("!help")) {
            return ctxFn.flowDynamic("!active - Este comando activa o desactiva el bot para TODAS las conversaciones");
        }

        // Comando para encender/apagar el bot
        if (ctx.body.includes("!active")) {
            if (await isActive(ctx, ctxFn)) {
                await ctxFn.globalState.update({ encendido: false });
                return ctxFn.flowDynamic("Bot desactivado.");
            } else {
                await ctxFn.globalState.update({ encendido: true });
                return ctxFn.flowDynamic("Bot activado.");
            }
        }
    });

const flowActive = addKeyword(EVENTS.ACTION)
    .addAnswer("Hola, bienvenido!")

const flowValidation = addKeyword(EVENTS.WELCOME)
    .addAction(async (ctx, ctxFn) => {
        if (!await isActive(ctx, ctxFn)) {
            return ctxFn.endFlow()
        } else {
            return ctxFn.gotoFlow(flowActive)
        }
    })

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowAdministrador, flowValidation, flowActive])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()