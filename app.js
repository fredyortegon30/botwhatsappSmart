const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')

const MongoAdapter = require('@bot-whatsapp/database/mongo');
require("dotenv").config();

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')


const { isActive, isConvActive, toogleActive } = require("./utils")
const flowAdmin = require("./flows/admin.flow")

const flowToogle = addKeyword("ToogleActive")
    .addAction(async (ctx, ctxFn) => {
        const active = await toogleActive(ctx, ctxFn);
        console.log(active)
    })

const flowValidation = addKeyword(EVENTS.WELCOME)
    .addAction(async (ctx, ctxFn) => {
        if (!await isActive(ctx, ctxFn)) {
            return ctxFn.endFlow()
        } else {
            if (!await isConvActive(ctx, ctxFn)) {
                return ctxFn.endFlow()
            } else {
                return ctxFn.flowDynamic("Esta todo activo");
            }
        }
    })

const main = async () => {
    const adapterDB = new MongoAdapter({
        dbUri: process.env.MONGO_DB_URL,  // Corrige la manera de acceder a las variables de entorno
        dbName: 'db_bot',
    })
    const adapterFlow = createFlow([flowAdmin, flowValidation, flowToogle])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()