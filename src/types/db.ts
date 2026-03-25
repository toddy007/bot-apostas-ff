import { Snowflake } from 'discord.js';

export interface BaseSchema {
    _id: string;
}

export interface PanelSchema extends BaseSchema {
    messageId: Snowflake;
    battleType: BattleType;
    betValue: number;
    playersInQueueNormal: Snowflake[]; // gelo normal
    playersInQueueInfinity: Snowflake[]; // gelo infinito
}

export enum BattleType {
    OneXOne = '1x1',
    TwoXTwo = '2x2',
    ThreeXThree = '3x3',
    FourXFour = '4x4',
}

export interface TicketSchema extends BaseSchema {
    panelOriginId: Snowflake; // messageId do painel
    players: Snowflake[];
    teamOne: Snowflake[];
    teamTwo: Snowflake[];
    iceType: IceType;
    status: BattleStatus;
    winnerTeam: WinnerTeam;
    channelId: Snowflake; // id do ticket
    messageId: Snowflake;
    createdTimestamp: number;
    closed: boolean;
}

export enum BattleStatus {
    Finished,
    Pending,
    Cancelled,
}

export type WinnerTeam = 'teamOne' | 'teamTwo' | 'draw';

export enum IceType {
    Normal,
    Infinity,
}

export const PlayersPerTeam = {
    [BattleType.OneXOne]: 1,
    [BattleType.TwoXTwo]: 2,
    [BattleType.ThreeXThree]: 3,
    [BattleType.FourXFour]: 4,
};

export const TotalPlayers = {
    [BattleType.OneXOne]: 2,
    [BattleType.TwoXTwo]: 4,
    [BattleType.ThreeXThree]: 6,
    [BattleType.FourXFour]: 8,
};
