import fastify, { FastifyRequest } from "fastify";
import OpenAI from "openai";
import { config } from "dotenv";

config();

let message: string | null;

type schema = {
    message: string;
};

const openai = new OpenAI({
    apiKey: process.env.API_KEY
});


const server = fastify()
    .get('/', (_, reply) => {
        if (message) {
            return reply.code(200).send(message);
        }

        return reply.code(400).send('Tidak ada pesan');
    })
    .post('/', async (request: FastifyRequest<{ Body: schema }>, reply) => {
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
            return reply.code(200).send('Berhasil terkirim')
        } catch(e) {
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