import { Event } from '../../structure/Event';
import { Events, Interaction } from 'discord.js';
import { confirmButtonHandler } from '../../handlers/panel/confirmButton';
import { cancelButtonHandler } from '../../handlers/panel/cancelButton';
import { joinHandler } from '../../handlers/panelMessage/joinHandler';
import { leaveHandler } from '../../handlers/panelMessage/leaveHandler';
import { closeButton } from '../../handlers/ticket/closeButton';
import { selectWinnerMenu } from '../../handlers/ticket/selectWinnerMenu';
import { IceType } from '../../types/db';
import { editPanelDataHandler } from '../../handlers/panel/editPanelDataHandler';
import { CustomIds } from '../../types/global';

export default class InteractionCreateEvent extends Event {
    public name = Events.InteractionCreate;

    public async execute(interaction: Interaction) {
        if (!interaction.isAnySelectMenu() && !interaction.isButton()) return;
        const { customId } = interaction;
        const isButton = interaction.isButton();

        switch (interaction.customId) {
            case 'closeTicket':
                if (isButton) return closeButton(interaction);
            case 'selectWinner':
                if (interaction.isStringSelectMenu())
                    return selectWinnerMenu(interaction);
        }

        if (isButton && customId.startsWith('joinIce'))
            return joinHandler(
                interaction,
                customId === 'joinIceNormal'
                    ? IceType.Normal
                    : IceType.Infinity,
            );

        if (isButton && customId === 'leave') return leaveHandler(interaction);

        const message = interaction.message;
        const commandAuthor = message.mentions.repliedUser;
        if (!commandAuthor || interaction.user.id !== commandAuthor.id) return; // deixar somente o autor usar o painel

        if (Object.values(CustomIds).includes(customId as CustomIds)) {
            if (
                interaction.isChannelSelectMenu() ||
                interaction.isStringSelectMenu()
            )
                return editPanelDataHandler(interaction);
        }

        if (isButton && customId === 'confirmButton')
            return confirmButtonHandler(interaction);

        if (isButton && customId === 'cancelButton')
            return cancelButtonHandler(interaction);
    }
}
