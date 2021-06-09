import { MessageAttachment } from "discord.js";
import { Collection, Pair, Schema } from "yaml/types";
import { Type } from "yaml/util";

export class ConfigurationManager {
    schema: ConfigSchema;

    constructor(schema: ConfigSchema) {
        this.schema = schema;
    }
}

export interface ConfigSchema {
    [index: string]: ConfigSchema | ConfigType;
}


export type ConfigType = EndType | {type: ConfigType, description?: string, category?: string, required?: boolean} | TypeList;

export function Number(): EndType {
    return new EndType(Types.Number);
}

export function Text(): EndType {
    return new EndType(Types.Text);
}


enum Types {
    Token,
    BotToken,
    Text,
    Number,
}




export function List(type: EndType): TypeList {
    return new TypeList(type);
}

class TypeList {
    type: EndType;
    constructor(type: EndType) {
        this.type = type;
    }
}

class EndType {
    type: Types;
    constructor(type: Types) {
        this.type = type;
    }
}

export function generateBlankYaml(schema: ConfigSchema): Collection {
    const col = new Collection();
    
    for (const key in schema) {
        const data: ConfigSchema | ConfigType = schema[key];

        const method: TypeMethod = getTypeMethod(data);

        if (method == TypeMethod.Category) {
            col.add(generateBlankYaml(data as ConfigSchema));
        } else if (method == List) {

        } else {
            col.add(new Pair(key, (data as EndType).type));
        }
    }

    return col;
    
}

enum TypeMethod {
    List,
    EndType,
    Category
}

function getTypeMethod(object: ConfigType | ConfigSchema): TypeMethod {
    if (object instanceof TypeList || object.type instanceof TypeList) {
        return TypeMethod.List;
    }

    if (object instanceof EndType || object.type instanceof EndType) {
        return TypeMethod.EndType;
    }

    return TypeMethod.Category;
}