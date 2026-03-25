import { ButtonInteraction } from 'discord.js';

export const cancelButtonHandler = async (interaction: ButtonInteraction) => {
    const { message } = interaction;
    await message.delete();

    return interaction.reply('❌・Configuração cancelada.');
};
