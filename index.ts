import { type FastifyInstance, type FastifyRequest } from 'fastify';
import OpenAI from 'openai';

async function routes(fastify: FastifyInstance, options: any) {
    let message: string | null;

    const openai = new OpenAI({
        apiKey: process.env.API_KEY
    });

    type BodySchema = {
        message: string;
    };

    fastify
        .get('/', (_, reply) => {
            if (message) {
                return reply.code(200).send(message);
            }

            return reply.code(400).send('Tidak ada pesan');
        })
        .post('/', async (req: FastifyRequest<{ Body: BodySchema }>, reply) => {
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
                return reply.code(200).send('Berhasil terkirim')
            } catch(e) {
                console.error(e);
                return reply.code(500).send(e);
            }
        })
}

export default routes;