
//utils.js
const isActive = async (ctx, ctxFn) => {
    let currentGlobalState = await ctxFn.globalState.getMyState();
    currentGlobalState.encendido = currentGlobalState.encendido ?? true;
    return currentGlobalState.encendido
}

const isConvActive = async (ctx, ctxFn) => {
    let currentState = await ctxFn.state.getMyState();
    currentState = currentState ?? {};
    const active = currentState.active ?? true;
    return active
}

const toogleActive = async (ctx, ctxFn) => {
    let currentState = await ctxFn.state.getMyState();
    currentState = currentState ?? {};
    const active = currentState.active ?? true;
    const newActiveState = !active;
    await ctxFn.state.update({ active: newActiveState });

    return newActiveState
}

module.exports = { isActive, isConvActive, toogleActive }