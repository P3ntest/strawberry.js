import { Client } from "discord.js";
import { ClientWrapper } from "./wrapper";

export function wrapClient(client: Client) {
    return new ClientWrapper(client);
}