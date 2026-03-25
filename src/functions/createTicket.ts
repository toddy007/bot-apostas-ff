import {
    Snowflake,
    ChannelType,
    EmbedBuilder,
    Guild,
    PermissionFlagsBits,
    ButtonBuilder,
    ButtonStyle,
    StringSelectMenuBuilder,
    ActionRowBuilder,
} from 'discord.js';
import { client } from '../';
import { IceType, PlayersPerTeam, PanelSchema } from '../types/db';
import { randomString } from './randomString';

export const createTicket = async (
    panel: PanelSchema,
    players: Snowflake[],
    iceType: IceType,
    guild: Guild,
) => {
    const playersPerTeam = PlayersPerTeam[panel.battleType];
    const teamOne = players.slice(0, playersPerTeam);
    const teamTwo = players.slice(-playersPerTeam);

    const ticketId = randomString();

    const embed = new EmbedBuilder()
        .setTitle('Ticket de x1 | ' + panel.battleType)
        .setDescription(
            '> Mencione um mediador para criar a sala.\n' +
                `- **Aposta**: R$${panel.betValue},00\n` +
                `- **Tipo de Gelo:** ${iceType === IceType.Normal ? 'Normal' : 'Infinito'}`,
        )
        .addFields(
            {
                name: 'Time 1',
                value: teamOne.map((playerId) => `<@${playerId}>`).join(', '),
            },
            {
                name: 'Time 2',
                value: teamTwo.map((playerId) => `<@${playerId}>`).join(', '),
            },
        )
        .setFooter({ text: 'TicketID:' + ticketId })
        .setTimestamp()
        .setColor('Random');

    const playersPermissions = players.map((playerId) => {
        return {
            id: playerId,
            allow: [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.ReadMessageHistory,
                PermissionFlagsBits.AttachFiles,
                PermissionFlagsBits.EmbedLinks,
            ],
        };
    });

    const ticketChannel = await guild.channels.create({
        name: `ticket-${ticketId}`,
        type: ChannelType.GuildText,
        permissionOverwrites: [
            {
                id: guild.id, // id do servidor = id do everyone
                deny: [PermissionFlagsBits.ViewChannel],
            },
            ...playersPermissions,
        ],
    });

    const closeButton = new ButtonBuilder()
        .setCustomId('closeTicket')
        .setLabel('Fechar')
        .setStyle(ButtonStyle.Danger)
        .setEmoji('❎');

    const selectWinner = new StringSelectMenuBuilder()
        .setCustomId('selectWinner')
        .setPlaceholder('Selecione o time vencedor')
        .addOptions(
            {
                label: 'Time 1',
                value: 'teamOne',
            },
            {
                label: 'Time 2',
                value: 'teamTwo',
            },
        )
        .setMaxValues(1)
        .setMinValues(1);

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        selectWinner,
    );
    const rowTwo = new ActionRowBuilder<ButtonBuilder>().addComponents(
        closeButton,
    );

    const message = await ticketChannel.send({
        content: players.map((playerId) => `<@${playerId}>`).join(', '),
        embeds: [embed],
        components: [row, rowTwo],
    });

    await client.db.ticket.create({
        panelOriginId: panel.messageId,
        players,
        teamOne,
        teamTwo,
        iceType,
        channelId: ticketChannel.id,
        messageId: message.id,
        createdTimestamp: Date.now(),
    });
};
