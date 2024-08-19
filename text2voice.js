const fs = require("fs");
const path = require("path");
const OpenAI = require("openai");

const openaiApiKey = process.env.OPENAI_API_KEY;

const openai = new OpenAI({
    apiKey: openaiApiKey,
});

const speechFile = path.resolve(`./tmp/speech-${Date.now()}.mp3`);

const text2voice = async (txt) => {
    try {
        const mp3 = await openai.audio.speech.create({
            model: "tts-1",
            voice: "alloy",
            input: txt,
        });
        const buffer = Buffer.from(await mp3.arrayBuffer());
        await fs.promises.writeFile(speechFile, buffer);
    } catch (e) {
        console.log(e)
    }
    return speechFile;
}

module.exports = { text2voice };