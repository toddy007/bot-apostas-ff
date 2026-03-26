import {
    MessageFlags,
    StringSelectMenuInteraction,
    ChannelType,
    Snowflake,
} from 'discord.js';
import { client } from '../../';
import { WinnerTeam, BattleStatus } from '../../types/db';

export const selectWinnerMenu = async (
    interaction: StringSelectMenuInteraction,
) => {
    const { channel, guild, values, user } = interaction;
    if (!channel || !guild) return;
    if (channel.type !== ChannelType.GuildText) return;

    const ticket = await client.db.ticket.findOne({ channelId: channel.id }, [
        '_id',
        'teamOne',
        'teamTwo',
    ]);
    const winnerTeam = values[0] as WinnerTeam;

    const complement = ticket
        ? ''
        : '\n-# ⚠️・Este ticket não está na minha database.';
    channel.send(
        `⚔️・O mediador <@${user.id}> definiu o **${winnerTeam === 'teamOne' ? 'Time 1' : 'Time 2'}** ${ticket ? '(' + ticket[winnerTeam].map((playerId: Snowflake) => `<@${playerId}>`).join(' | ') + ')' : ''} como vencedor.` +
            complement,
    );

    channel.send(`<@${user.id}> faça o pagamento ao time vencedor.`);

    if (ticket) {
        ticket.status = BattleStatus.Finished;
        ticket.winnerTeam = winnerTeam;
        await ticket.save();
    }

    return interaction.reply({
        content: '✅・Vencedor definido.',
        flags: [MessageFlags.Ephemeral],
    });
};
