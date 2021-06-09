import { MessageAttachment } from "discord.js";
import { Document } from "yaml";
import { Collection, Node, Pair, Schema } from "yaml/types";
const YAML = require("yaml");

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
    defaultValue(list = false) {
        if (list) {
            return [""];
        }
        return "";
    }
}

export function generateBlankYaml(schema: ConfigSchema): string {
    const nodes = schemaToYamlCollection(schema);

    return (YAML.stringify(nodes));
}

// TODO: make this code nice
function schemaToYamlCollection(schema: ConfigSchema): Node[] {
    const nodes: Node[] = [];
    
    for (const key in schema) {
        const data: ConfigSchema | ConfigType = schema[key];

        const method: TypeMethod = getTypeMethod(data);

        const node = YAML.createNode({});
        

        if (method == TypeMethod.Category) {
            const subNode = YAML.createNode({});
            schemaToYamlCollection(data as ConfigSchema).forEach(_subNode => {
                subNode.items.push((_subNode as any).items[0]);
            })
            node.add(new Pair(key, subNode));
            
        } else if (method == TypeMethod.List) {
            node.add(new Pair(key, (data as TypeList).type.defaultValue(true)));
        } else {
            if (data instanceof EndType) {
                node.add(new Pair(key, (data as EndType).defaultValue()));
            } else {
                node.add(new Pair(key, (data.type as EndType).defaultValue()));
                node.commentBefore = (data as any).description;
            }
        }

        nodes.push(node);
    }

    return nodes;
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