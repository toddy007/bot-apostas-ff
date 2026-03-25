import { ButtonInteraction, ChannelType, MessageFlags } from 'discord.js';
import { client } from '../../';
import { BattleStatus } from '../../types/db';

export const closeButton = async (interaction: ButtonInteraction) => {
    const { channel, guild, user } = interaction;
    if (!channel || !guild) return;
    if (channel.type !== ChannelType.GuildText) return;

    const ticket = await client.db.ticket.findOne({ channelId: channel.id }, [
        '_id',
        'status',
    ]);

    channel.send(
        `⚠️・O usuário <@${user.id}> fechou o ticket. Excluindo o canal em 5 segundos.`,
    );

    setTimeout(() => channel.delete().catch(() => null), 5000);

    if (ticket) {
        if (ticket.status === BattleStatus.Pending) {
            ticket.status = BattleStatus.Cancelled;
            ticket.closed = true;
            await ticket.save();
        }
    }

    return interaction.reply({
        content: '✅・Ticket fechado.',
        flags: [MessageFlags.Ephemeral],
    });
};
