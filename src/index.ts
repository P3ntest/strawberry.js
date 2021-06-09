import { Client } from "discord.js";
import { generateBlankYaml, List, Number, Text } from "./config";
import { ClientWrapper } from "./wrapper";

export function wrapClient(client: Client) {
    return new ClientWrapper(client);
}

generateBlankYaml({
    simpleNumber: Number(),
    coolNumber: {
        type: Number(),
        description: "Im cool"
    },
    simpleText: Text(),
    textList: List(Text()),
    subSchema: {
        test: Number()
    }
})