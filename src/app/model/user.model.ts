import { UserRole } from "./role.model";

export class UserApp{
    public idUserApp!: number;
    public firstName?: string;
    public userName!: string;
    public email?: string;
    public password!: string;
    public phoneNumber?: string;
    public active?: boolean;
    public userRoles?: UserRole[];
    constructor(){}
}