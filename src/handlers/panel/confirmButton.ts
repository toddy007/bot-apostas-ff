import {
    ButtonInteraction,
    PermissionFlagsBits,
    MessageFlags,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    ChannelType,
    ActionRowBuilder,
} from 'discord.js';
import { BattleType, PlayersPerTeam } from '../../types/db';
import { client } from '../../';
import { ComponentIndex } from '../../types/global';

export const confirmButtonHandler = async (interaction: ButtonInteraction) => {
    const { message, guild } = interaction;
    const container = message.components[0];

    // @ts-ignore
    const channelToSendMention =
        container.components[ComponentIndex.ChannelSelectMenu].data.content;

    // @ts-ignore
    const battleType = container.components[ComponentIndex.BattleTypeSelectMenu]
        .data.content as BattleType;
    if (!PlayersPerTeam[battleType])
        return interaction.reply({
            content: '❌・Você não selecionou o tipo.',
            flags: [MessageFlags.Ephemeral],
        });

    // @ts-ignore
    const betValue = Number(
        container.components[ComponentIndex.BetValueSelectMenu].data.content,
    );
    if (isNaN(betValue))
        return interaction.reply({
            content: '❌・Você não selecionou o valor da aposta.',
            flags: [MessageFlags.Ephemeral],
        });

    const channelToSendId = channelToSendMention.replace(/<#|>/g, '');
    if (isNaN(Number(channelToSendId)))
        return interaction.reply({
            content: '❌・Você não selecionou o canal.',
            flags: [MessageFlags.Ephemeral],
        });

    const channelToSend = await client.channels
        .fetch(channelToSendId)
        .catch(() => null);
    if (!channelToSend)
        return interaction.reply({
            content: '❌・Eu não encontrei o canal selecionado.',
            flags: [MessageFlags.Ephemeral],
        });

    const meMember = guild!.members.me;
    if (
        !meMember!
            .permissionsIn(channelToSendId)
            .has(PermissionFlagsBits.SendMessages) ||
        !meMember!
            .permissionsIn(channelToSendId)
            .has(PermissionFlagsBits.ViewChannel)
    )
        return interaction.reply({
            content:
                '❌・Eu não tenho permissão para **enviar mensagens** e/ou **ver o canal** no canal selecionado.',
            flags: [MessageFlags.Ephemeral],
        });

    const joinIceNormalButton = new ButtonBuilder()
        .setCustomId('joinIceNormal')
        .setLabel('Gelo Normal')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('🧊');

    const joinIceInfinityButton = new ButtonBuilder()
        .setCustomId('joinIceInfinity')
        .setLabel('Gelo Infinito')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('♾️');

    const leaveButton = new ButtonBuilder()
        .setCustomId('leave')
        .setLabel('Sair da Fila')
        .setStyle(ButtonStyle.Danger)
        .setEmoji('🚪');

    const embed = new EmbedBuilder()
        .setTitle('⚔️・Fila x1')
        .setThumbnail(guild!.iconURL())
        .setDescription(
            '> Entre na fila para iniciar um x1. Escolha entre gelo **normal** ou **infinito**.\n' +
                '### Dados:\n' +
                `- **Tipo:** ${battleType}\n` +
                `- **Valor da aposta:** R$${betValue},00`,
        )
        .addFields({
            name: 'Jogadores na Fila:',
            value: '**Ninguém**',
        })
        .setColor('Random')
        .setTimestamp();

    const row = new ActionRowBuilder<ButtonBuilder>().setComponents(
        joinIceNormalButton,
        joinIceInfinityButton,
        leaveButton,
    );

    if (channelToSend.type !== ChannelType.GuildText) return;
    const msg = await channelToSend.send({
        embeds: [embed],
        components: [row],
    });

    await client.db.panel.create({
        messageId: msg.id,
        battleType,
        betValue,
    });

    await message.delete();

    if (message.channel.type === ChannelType.GuildText)
        message.channel.send(
            `✅・Painel criado com sucesso no canal ${channelToSend}.`,
        );

    return interaction.reply({
        content: '✅',
        flags: [MessageFlags.Ephemeral],
    });
};
