import { Town } from "./town.model";

export class Shop{
    public idShop!: number;
    public shopName!:string;
    public longitude!: number;
    public latitude!: number;	
    public attitude!: number;
    public town!: Town;
    constructor(){}
}