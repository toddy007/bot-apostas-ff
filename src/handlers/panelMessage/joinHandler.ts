import {
    ButtonInteraction,
    MessageFlags,
    EmbedBuilder,
    PermissionFlagsBits,
} from 'discord.js';
import { client } from '../../';
import { IceType, TotalPlayers } from '../../types/db';
import { createTicket } from '../../functions/createTicket';

export const joinHandler = async (
    interaction: ButtonInteraction,
    iceType: IceType,
) => {
    const { message, user, guild } = interaction;
    if (!guild) return;
    const panel = await client.db.panel.findOne({ messageId: message.id });
    if (!panel)
        return interaction.reply({
            content: '❌・Este painel não está na minha database.',
            flags: [MessageFlags.Ephemeral],
        });

    const totalPlayers = TotalPlayers[panel.battleType];

    const queueType =
        iceType === IceType.Normal
            ? 'playersInQueueNormal'
            : 'playersInQueueInfinity';
    if (panel[queueType].includes(user.id))
        return interaction.reply({
            content: '❌・Você já está na fila.',
            flags: [MessageFlags.Ephemeral],
        });
    panel[queueType].push(user.id);

    if (panel[queueType].length > totalPlayers) {
        interaction.reply({
            content: '⚠️・Ocorreu um erro inesperado, resetando a fila...',
            flags: [MessageFlags.Ephemeral],
        });
        panel[queueType] = [];
    }

    let queueFilled = false;
    const players = panel[queueType];
    if (panel[queueType].length === totalPlayers) {
        const meMember = guild.members.me;
        if (!meMember!.permissions.has(PermissionFlagsBits.ManageChannels)) {
            interaction.reply({
                content:
                    '⚠️・Eu não tenho permissão de `gerenciar canais` neste servidor, portanto, não posso criar o ticket, resetando a fila...\n-# Avise um Administrador.',
                flags: [MessageFlags.Ephemeral],
            });
            panel[queueType] = [];
            return;
        }

        queueFilled = true;
        panel[queueType] = [];
    }

    const [messageEmbed] = message.embeds;
    const newEmbed = new EmbedBuilder(messageEmbed.toJSON());
    newEmbed.setFields({
        name: 'Jogadores na Fila:',
        value:
            `${panel.playersInQueueNormal.length > 0 ? panel.playersInQueueNormal.map((playerId) => `<@${playerId}>`).join(', ') : '**Ninguém**'} - gelo normal\n` +
            `${panel.playersInQueueInfinity.length > 0 ? panel.playersInQueueInfinity.map((playerId) => `<@${playerId}>`).join(', ') : '**Ninguém**'} - gelo infinito`,
    });

    message.edit({ embeds: [newEmbed] });

    await panel.save();

    interaction.reply({
        content: `✅・Você entrou na fila de **${iceType === IceType.Normal ? 'gelo normal' : 'gelo infinito'}**.`,
        flags: [MessageFlags.Ephemeral],
    });

    if (queueFilled) return createTicket(panel, players, iceType, guild);
};
