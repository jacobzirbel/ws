import { Connection } from "sockjs";

export interface Players {
    [k: string]: Player;
}

export interface Player {
    connection: Connection;
    x: number;
    y: number;

}