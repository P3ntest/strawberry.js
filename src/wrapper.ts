import { Client } from "discord.js";

export class ClientWrapper {
    client: Client

    constructor(client: Client) {
        this.client = client;
    }
}