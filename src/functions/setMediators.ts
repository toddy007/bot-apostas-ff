import { client } from '../';

export const setMediators = async () => {
    await client.guilds.fetch();

    const guilds = client.guilds.cache;

    for (const guild of guilds.values()) {
        const guildDb = await client.db.guilds.findOne({ _id: guild.id });
        if (!guildDb || !guildDb.mediatorRoleId) continue;
        const { mediatorRoleId, mediators } = guildDb;

        const mediatorRole = await guild.roles
            .fetch(mediatorRoleId)
            .catch(() => null);
        if (!mediatorRole) {
            guildDb.mediators = [];
            await guildDb.save();
            continue;
        }

        await guild.members.fetch();
        const membersWithMediator = guild.members.cache.filter((member) =>
            member.roles.cache.has(mediatorRoleId),
        );

        const newMediators = membersWithMediator.filter(
            (member) => !mediators.includes(member.id),
        );

        if (newMediators.size === 0) continue;

        guildDb.mediators = [
            ...mediators,
            ...newMediators.map((member) => member.id),
        ];
        await guildDb.save();
    }
};
