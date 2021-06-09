import { Collection } from "yaml/types";

export class ConfigurationManager {
    schema: ConfigSchema;

    constructor(schema: ConfigSchema) {
        this.schema = schema;
    }
}

export interface ConfigSchema {
    [index: number]: ConfigSchema | ConfigType;
  }

export type ConfigType = Types | {type: ConfigType, description?: string, category?: string, required?: boolean} | TypeList;

export enum Types {
    Token,
    BotToken,
    Text,
    Number,
}



export function List(type: ConfigType): TypeList {
    return new TypeList(type);
}

class TypeList {
    type: ConfigType;
    constructor(type: ConfigType) {
        this.type = type;
    }
}

function generateBlankYaml(schema: ConfigSchema) {
    
}