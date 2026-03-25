import { ButtonInteraction, MessageFlags, EmbedBuilder } from 'discord.js';
import { client } from '../../';

export const leaveHandler = async (interaction: ButtonInteraction) => {
    const { message, user } = interaction;
    const panel = await client.db.panel.findOne({ messageId: message.id });
    if (!panel)
        return interaction.reply({
            content: '❌・Este painel não está na minha database.',
            flags: [MessageFlags.Ephemeral],
        });

    const queueNormal = panel.playersInQueueNormal;
    const queueInfinity = panel.playersInQueueInfinity;

    if (!queueNormal.includes(user.id) && !queueInfinity.includes(user.id))
        return interaction.reply({
            content: '❌・Você não está em nenhuma fila.',
            flags: [MessageFlags.Ephemeral],
        });

    if (queueNormal.includes(user.id))
        panel.playersInQueueNormal.splice(
            panel.playersInQueueNormal.indexOf(user.id),
        );
    if (queueInfinity.includes(user.id))
        panel.playersInQueueInfinity.splice(
            panel.playersInQueueInfinity.indexOf(user.id),
        );

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

    return interaction.reply({
        content: `✅・Você saiu das filas.`,
        flags: [MessageFlags.Ephemeral],
    });
};
