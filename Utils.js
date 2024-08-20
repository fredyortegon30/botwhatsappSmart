const isActive = async (ctx, ctxFn) => {
    let currentGlobalState = await ctxFn.globalState.getMyState();
    currentGlobalState.encendido = currentGlobalState.encendido ?? false; //Por default encendido
    return currentGlobalState.encendido
}

module.exports = { isActive }