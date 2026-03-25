import {
    ChannelSelectMenuInteraction,
    StringSelectMenuInteraction,
    MessageFlags,
    ContainerBuilder,
} from 'discord.js';
import { CustomIds, ComponentIndex } from '../../types/global';

export const customIdType = {
    [CustomIds.ChannelSelectMenu]: ComponentIndex.ChannelSelectMenu,
    [CustomIds.BattleTypeSelectMenu]: ComponentIndex.BattleTypeSelectMenu,
    [CustomIds.BetValueSelectMenu]: ComponentIndex.BetValueSelectMenu,
};

export const editPanelDataHandler = async (
    interaction: ChannelSelectMenuInteraction | StringSelectMenuInteraction,
) => {
    const [value] = interaction.values;
    const { message, customId } = interaction;
    const thisCustomIdType = customIdType[customId];

    const container = message.components[0];
    // @ts-ignore
    container.components[thisCustomIdType].data.content =
        thisCustomIdType === ComponentIndex.ChannelSelectMenu
            ? '<#' + value + '>'
            : value;
    // @ts-ignore
    const newContainer = new ContainerBuilder(container.toJSON());

    message.edit({
        components: [newContainer],
        flags: [MessageFlags.IsComponentsV2],
    });

    return interaction.reply({
        content: '✅',
        flags: [MessageFlags.Ephemeral],
    });
};
