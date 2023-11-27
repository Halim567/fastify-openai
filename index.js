"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const openai_1 = __importDefault(require("openai"));
async function routes(fastify, options) {
    let message;
    const openai = new openai_1.default({
        apiKey: process.env.API_KEY
    });
    fastify
        .get('/', (_, reply) => {
        if (message) {
            return reply.code(200).send(message);
        }
        return reply.code(400).send('Tidak ada pesan');
    })
        .post('/', async (req, reply) => {
        if (typeof req.body.message !== 'string') {
            return reply.code(400).send('Pesan harus berupa huruf');
        }
        try {
            const res = await openai
                .chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'user',
                        content: req.body.message
                    }
                ]
            });
            message = res.choices[0].message.content;
            return reply.code(200).send('Berhasil terkirim');
        }
        catch (e) {
            console.error(e);
            return reply.code(500).send(e);
        }
    });
}
exports.default = routes;
