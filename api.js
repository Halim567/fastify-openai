"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const openai_1 = __importDefault(require("openai"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
let message;
const openai = new openai_1.default({
    apiKey: process.env.API_KEY
});
const server = (0, fastify_1.default)()
    .get('/', (_, reply) => {
    if (message) {
        return reply.code(200).send(message);
    }
    return reply.code(400).send('Tidak ada pesan');
})
    .post('/', async (request, reply) => {
    if (typeof request.body.message !== 'string') {
        return reply.code(400).send('Pesan harus berupa huruf');
    }
    try {
        const res = await openai
            .chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'user',
                    content: request.body.message
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
})
    .listen({ port: 5000 }, (err, add) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server berjalan pada ${add}`);
});
server;
