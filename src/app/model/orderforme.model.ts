import { Client } from "./client.model";
import { OrdeLine } from "./ordeline.model";

export class OrderForme{
    public idOrde!: number;
    public idUser!: number;
    public totalPrince!: number;
    public ordeLine: OrdeLine[]=[];
    public client!: Client;
    constructor(){}
}