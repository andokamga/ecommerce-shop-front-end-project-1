import { Client } from "./client.model";
import { ItemProduct } from "./itemproduct.model";

export class Caddy{
    public name!: string;
    public items: Map<number,ItemProduct> = new Map();
    public client!: Client;
    constructor(name: string){
        this.name = name
    }
}