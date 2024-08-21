const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')
const pdf = require("pdf-parse")
const fs = require("fs")
const chat = require("./chatgpt")
const { voiceToText } = require("./voice2text")
const { text2voice } = require("./text2voice")

require("dotenv").config()


const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')



const flowVoice = addKeyword(EVENTS.VOICE_NOTE)
    .addAction(async (ctx, ctxFn) => {
        const pdfPath = "./pdfs/pdf.pdf"
        let pdfBuff = fs.readFileSync(pdfPath)
        const pdfRead = await pdf(pdfBuff)
        const pdfTxt = pdfRead.text

        const prompt = "habla en español. eres un contacto inicial de una empresa  que se llama Smart Legacy, trata de enviar respuestas cortas, es una empresa de ecuador. El pitch es el siguiente: " + pdfTxt
        const response = await voiceToText(ctx);
        const text = response;
        const responseGPT = await chat(prompt, text);

        //await ctxFn.flowDynamic(responseGPT)

        const answerAudio = await text2voice(responseGPT);
        await ctxFn.provider.sendAudio(`${ctx.from}@s.whatsapp.net`, answerAudio);
    })




const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowVoice])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()