const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')
const MongoAdapter = require('@bot-whatsapp/database/mongo')
const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const { isActive, isConvActive, toogleActive } = require("./Utils")
const flowAdmin = require("./flows/admin.flow")

// Cargar variables de entorno solo si no estamos en producción
if (process.env.NODE_ENV !== 'production') {
    require("dotenv").config()
}

const flowToogle = addKeyword("ToogleActive")
    .addAction(async (ctx, ctxFn) => {
        const active = await toogleActive(ctx, ctxFn)
        console.log(active)
    })

const flowValidation = addKeyword(EVENTS.WELCOME)
    .addAction(async (ctx, ctxFn) => {
        if (!await isActive(ctx, ctxFn)) {
            return ctxFn.endFlow()
        } else if (!await isConvActive(ctx, ctxFn)) {
            return ctxFn.endFlow()
        } else {
            return ctxFn.flowDynamic("Esta todo activo")
        }
    })

const main = async () => {
    try {
        console.log('Intentando conectar a MongoDB...')

        const mongoOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            ssl: true,
            sslValidate: true,
        }

        const adapterDB = new MongoAdapter({
            dbUri: process.env.MONGO_DB_URL,
            dbName: 'db_bot',
            connectOptions: mongoOptions
        })

        console.log('Conexión a MongoDB establecida')

        const adapterFlow = createFlow([flowAdmin, flowValidation, flowToogle])
        const adapterProvider = createProvider(BaileysProvider)

        createBot({
            flow: adapterFlow,
            provider: adapterProvider,
            database: adapterDB,
        })

        QRPortalWeb()
    } catch (error) {
        console.error('Error al iniciar el bot:', error)
    }
}

main().catch(err => {
    console.error('Error en la función principal:', err)
    process.exit(1)
})