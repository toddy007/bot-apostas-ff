import { ChannelType } from 'discord.js';
import { client } from '../';
import { BattleStatus } from '../types/db';

export const detectInactiveTickets = async () => {
    const ONE_HOUR_AND_10M_IN_MS = 70 * 60 * 1000;
    const filter = {
        createdTimestamp: { $lte: Date.now() - ONE_HOUR_AND_10M_IN_MS },
        closed: false,
    };

    const tickets = await client.db.ticket.find(filter, ['channelId']);
    if (tickets.length === 0) return;

    for (const ticket of tickets) {
        const channel = await client.channels
            .fetch(ticket.channelId)
            .catch(() => null);
        if (channel && channel.type === ChannelType.GuildText) {
            channel
                .send(
                    '⏰・Inatividade detectada, deletando o canal em 10 segundos...',
                )
                .catch(() => null);

            setTimeout(() => channel.delete().catch(() => null), 10000);
        }
    }

    await client.db.ticket.updateMany(filter, {
        $set: { closed: true, status: BattleStatus.Cancelled },
    });
};
