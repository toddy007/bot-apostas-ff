import { Event } from '../../structure/Event';
import { Events } from 'discord.js';
import { client } from '../..';
import { connect } from 'mongoose';
import { detectInactiveTickets } from '../../functions/detectInactiveTickets';
import { setMediators } from '../../functions/setMediators';

export default class ReadyEvent extends Event {
    public name = Events.ClientReady;

    public async execute() {
        await connect(process.env.MONGODB!).catch(() => {
            throw new Error('Invalid MongoDB URL');
        });

        console.log(client.user.username + ' is ready');

        setInterval(detectInactiveTickets, 1000 * 60 * 10);

        detectInactiveTickets();

        setMediators(); // adiciona as pessoas que receberam o cargo enquanto o bot estava offline ( as colocando pro fim da fila )
    }
}
