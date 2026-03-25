import { Schema, model } from 'mongoose';
import { TicketSchema, BattleStatus } from '../../types/db';

const ticketSchema = new Schema<TicketSchema>(
    {
        panelOriginId: { type: String, required: true },
        players: { type: [String], required: true },
        teamOne: { type: [String], required: true },
        teamTwo: { type: [String], required: true },
        iceType: { type: Number, required: true },
        status: { type: Number, required: true, default: BattleStatus.Pending },
        winnerTeam: { type: String, required: true, default: 'draw' },
        channelId: { type: String, required: true },
        messageId: { type: String, required: true },
        createdTimestamp: { type: Number, required: true },
        closed: { type: Boolean, required: true, default: false },
    },
    { versionKey: false },
);

export const ticketModel = model('ticket', ticketSchema);
