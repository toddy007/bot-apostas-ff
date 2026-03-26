import { Command } from '../../../structure/Command';
import { CommandPayload } from '../../../types/global';
import { PermissionFlagsBits } from 'discord.js';

export default class SetMediatorRoleCommand extends Command {
    public constructor() {
        super({
            name: 'mediador',
            aliases: ['setmediador', 'setmediator', 'mediator'],
        });
    }

    public async execute({ client, message, args }: CommandPayload) {
        if (!message.member!.permissions.has(PermissionFlagsBits.Administrator))
            return message.reply(
                '❌・Você precisa da permissão de `Administrador` para usar este comando.',
            );

        const guildDb = await client.db.guilds.findOne(
            { _id: message.guildId },
            ['_id', 'mediatorRoleId'],
        );

        const [role] = args;
        const mediatorRole =
            message.mentions.roles.first() ||
            message.guild.roles.cache.get(role) ||
            message.guild.roles.cache.find((r) => r.name === role);
        if (!mediatorRole)
            return message.reply(
                '❌・Você precisa mencionar um cargo para configurar.',
            );
        if (
            guildDb!.mediatorRoleId &&
            guildDb!.mediatorRoleId === mediatorRole.id
        )
            return message.reply(
                '❌・Este cargo já está configurado como cargo de **mediador**.',
            );

        const mediators = message.guild.members.cache
            .filter((member) => member.roles.cache.has(mediatorRole.id))
            .map((member) => member.id);

        const complement =
            mediators.length === 0
                ? '\n-# ⚠️・O cargo selecionado não tem nenhum membro, os tickets não irão funcionar.'
                : '';
        message.reply(
            `✅・O cargo ${mediatorRole} foi configurado como cargo de **mediador**.` +
                complement,
        );

        await client.db.guilds.findOneAndUpdate(
            { _id: message.guildId },
            { $set: { mediatorRoleId: mediatorRole.id, mediators } },
        );
    }
}
