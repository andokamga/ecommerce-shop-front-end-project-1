import { Payer } from "./payer.model";

export class Body{
    public amount!:string;
    public currency!:string;
    public externalId!:string;
    public payerMessage!:string;
    public payeeNote!:string;
    public payer!:Payer;
    constructor(){}
}