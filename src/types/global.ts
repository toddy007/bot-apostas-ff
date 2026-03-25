import { Message } from 'discord.js';
import { Client } from '../structure/Client';

export interface CommandPayload {
    client: Client<true>;
    message: Message<true>;
    args: string[];
}

export interface Command {
    name: string;
    aliases: string[];
    execute: (payload: CommandPayload) => void;
}

export interface CommandConstructor {
    name: string;
    aliases?: string[];
}

export enum CustomIds {
    ChannelSelectMenu = 'channelMenu',
    BattleTypeSelectMenu = 'battleMenu',
    BetValueSelectMenu = 'betValueMenu',
}

export enum ComponentIndex {
    ChannelSelectMenu = 2,
    BattleTypeSelectMenu = 6,
    BetValueSelectMenu = 10,
}
