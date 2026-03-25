import { Schema, model } from 'mongoose';
import { PanelSchema } from '../../types/db';

const panelSchema = new Schema<PanelSchema>(
    {
        messageId: { type: String, required: true },
        battleType: { type: String, required: true },
        betValue: { type: Number, required: true },
        playersInQueueNormal: { type: [String], required: true, default: [] },
        playersInQueueInfinity: { type: [String], required: true, default: [] },
    },
    { versionKey: false },
);

export const panelModel = model('panel', panelSchema);
