const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')
const { isActive } = require("../Utils")

module.exports = addKeyword(["!active", "!help"])
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
                await ctxFn.globalState.update({ encendido: true });
                return ctxFn.flowDynamic("Bot desactivado.");
            } else {
                await ctxFn.globalState.update({ encendido: true });
                return ctxFn.flowDynamic("Bot activado.");
            }
        }
    });