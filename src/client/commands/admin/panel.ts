import { Command } from '../../../structure/Command';
import { CommandPayload } from '../../../types/global';
import {
    ContainerBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelSelectMenuBuilder,
    StringSelectMenuBuilder,
    PermissionFlagsBits,
    ChannelType,
    MessageFlags,
    SeparatorSpacingSize,
} from 'discord.js';
import { BattleType } from '../../../types/db';

export default class PanelCommand extends Command {
    public constructor() {
        super({
            name: 'painel',
            aliases: ['config', 'panel', 'configurar'],
        });
    }

    public async execute({ message }: CommandPayload) {
        const member = message.member;
        if (!member!.permissions.has(PermissionFlagsBits.Administrator))
            return message.reply(
                '❌・Você precisa da permissão de `Administrador` para usar este comando.',
            );

        const channelSelectMenu = new ChannelSelectMenuBuilder()
            .setCustomId('channelMenu')
            .setPlaceholder('Selecione um canal')
            .setMaxValues(1)
            .setMinValues(1)
            .setChannelTypes(ChannelType.GuildText);
        const battleTypeSelectMenu = new StringSelectMenuBuilder()
            .setCustomId('battleMenu')
            .setPlaceholder('Selecione o tipo')
            .setMaxValues(1)
            .setMinValues(1)
            .setOptions([
                {
                    label: BattleType.OneXOne,
                    value: BattleType.OneXOne,
                },
                {
                    label: BattleType.TwoXTwo,
                    value: BattleType.TwoXTwo,
                },
                {
                    label: BattleType.ThreeXThree,
                    value: BattleType.ThreeXThree,
                },
                {
                    label: BattleType.FourXFour,
                    value: BattleType.FourXFour,
                },
            ]);

        const betValueSelectMenu = new StringSelectMenuBuilder()
            .setCustomId('betValueMenu')
            .setPlaceholder('Selecione o valor da aposta')
            .setMaxValues(1)
            .setMinValues(1)
            .setOptions([
                {
                    label: 'R$1,00',
                    value: '1',
                },
                {
                    label: 'R$2,00',
                    value: '2',
                },
                {
                    label: 'R$5,00',
                    value: '5',
                },
                {
                    label: 'R$10,00',
                    value: '10',
                },
                {
                    label: 'R$20,00',
                    value: '20',
                },
                {
                    label: 'R$50,00',
                    value: '50',
                },
                {
                    label: 'R$100,00',
                    value: '100',
                },
            ]);

        const confirmButton = new ButtonBuilder()
            .setCustomId('confirmButton')
            .setLabel('Confirmar')
            .setStyle(ButtonStyle.Success)
            .setEmoji('✅');

        const cancelButton = new ButtonBuilder()
            .setCustomId('cancelButton')
            .setLabel('Cancelar')
            .setStyle(ButtonStyle.Danger)
            .setEmoji('❎');

        const container = new ContainerBuilder()
            .addTextDisplayComponents((textDisplay) =>
                textDisplay.setContent('# [⚙️] Configuração do Painel'),
            )
            .addTextDisplayComponents((textDisplay) =>
                textDisplay.setContent('## 💬・Canal para enviar o painel:'),
            )
            .addTextDisplayComponents((textDisplay) =>
                textDisplay.setContent('**Nenhum selecionado**'),
            )
            .addActionRowComponents(
                new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
                    channelSelectMenu,
                ),
            )
            .addSeparatorComponents((separator) =>
                separator
                    .setDivider(true)
                    .setSpacing(SeparatorSpacingSize.Small),
            )
            .addTextDisplayComponents((textDisplay) =>
                textDisplay.setContent('## 🪂・Selecione o tipo do x1'),
            )
            .addTextDisplayComponents((textDisplay) =>
                textDisplay.setContent('**Nenhum selecionado**'),
            )
            .addActionRowComponents(
                new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                    battleTypeSelectMenu,
                ),
            )
            .addSeparatorComponents((separator) =>
                separator
                    .setDivider(true)
                    .setSpacing(SeparatorSpacingSize.Small),
            )
            .addTextDisplayComponents((textDisplay) =>
                textDisplay.setContent('## 💵・Selecione o valor da aposta'),
            )
            .addTextDisplayComponents((textDisplay) =>
                textDisplay.setContent('**Nenhum selecionado**'),
            )
            .addActionRowComponents(
                new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                    betValueSelectMenu,
                ),
            )
            .addSeparatorComponents((separator) =>
                separator
                    .setDivider(true)
                    .setSpacing(SeparatorSpacingSize.Small),
            )
            .addActionRowComponents(
                new ActionRowBuilder<ButtonBuilder>().setComponents(
                    confirmButton,
                    cancelButton,
                ),
            )
            .setAccentColor([0, 229, 255]);

        message.reply({
            components: [container],
            flags: [MessageFlags.IsComponentsV2],
        });
    }
}
