import {
    MessageFlags,
    StringSelectMenuInteraction,
    PermissionFlagsBits,
    ChannelType,
    Snowflake,
} from 'discord.js';
import { client } from '../../';
import { WinnerTeam, BattleStatus } from '../../types/db';

export const selectWinnerMenu = async (
    interaction: StringSelectMenuInteraction,
) => {
    const { channel, guild, values, member, user } = interaction;
    if (!channel || !guild) return;
    if (channel.type !== ChannelType.GuildText) return;

    if (typeof member!.permissions === 'string') return;
    if (!member!.permissions.has(PermissionFlagsBits.Administrator))
        return interaction.reply({
            content: '❌・Somente Administradores podem usar isso.',
            flags: [MessageFlags.Ephemeral],
        });

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
        `⚔️・O usuário <@${user.id}> definiu o **${winnerTeam === 'teamOne' ? 'Time 1' : 'Time 2'}** ${ticket ? '(' + ticket[winnerTeam].map((playerId: Snowflake) => `<@${playerId}>`).join(' | ') + ')' : ''} como vencedor.` +
            complement,
    );

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
