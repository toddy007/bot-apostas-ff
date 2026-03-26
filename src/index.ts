import { Client } from './structure/Client';

export const client = new Client<true>({ intents: [33283] }); // intents in https://discord-intents-calculator.vercel.app/

client.run();

process.on('unhandRejection', console.error);

process.on('uncaughtException', (error, origin) => {
    console.error(error.stack, origin);
});
