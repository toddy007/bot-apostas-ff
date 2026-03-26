import { Event } from '../../structure/Event';
import { Events, GuildMember } from 'discord.js';
import { client } from '../..';

export default class ReadyEvent extends Event {
    public name = Events.GuildMemberUpdate;

    public async execute(oldMember: GuildMember, newMember: GuildMember) {
        const { id: userId } = newMember;
        const guildDb = await client.db.guilds.findOne({
            _id: newMember.guild.id,
        });

        if (!guildDb || !guildDb.mediatorRoleId) return;
        if (
            oldMember.roles.cache.has(guildDb.mediatorRoleId) &&
            newMember.roles.cache.has(guildDb.mediatorRoleId)
        )
            return;

        if (newMember.roles.cache.has(guildDb.mediatorRoleId)) {
            guildDb.mediators.push(userId);
            await guildDb.save();
            return;
        } // se ele tiver com o cargo de mediador, então ele recebeu o cargo

        guildDb.mediators.splice(guildDb.mediators.indexOf(userId));
        await guildDb.save();
        return;
        // * se não
    }
}
