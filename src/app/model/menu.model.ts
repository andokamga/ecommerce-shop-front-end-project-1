export interface Menu{
    id?:number;
    title?:string;
    icon?:string;
    url?: string;
    sousMenu?: Array<Menu>;
}