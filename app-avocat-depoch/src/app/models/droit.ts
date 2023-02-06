import { Children } from "./children";
import { User } from "./user";

export class Droit {
    _id!: string;
    title!: string;
    content!: string;
    more!: string;
    children!: Children[];
    owner!: User[];
}