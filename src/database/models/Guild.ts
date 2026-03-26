import { Schema, model } from 'mongoose';
import { GuildSchema } from '../../types/db';

const guildSchema = new Schema<GuildSchema>(
    {
        _id: { type: String, required: true },
        mediatorRoleId: { type: String },
        mediators: { type: [String], required: true, default: [] },
    },
    { versionKey: false },
);

export const guildModel = model('guilds', guildSchema);
