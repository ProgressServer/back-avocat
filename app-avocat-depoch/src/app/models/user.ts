import {Speciality} from "./speciality";

export class User {
    _id!: string;
    firstname!: string;
    lastname!: string;
    username!: string;
    email!: string;
    password!: string;
    phone!: string;
    barreau!: string;
    speciality!: Speciality[];
    gender!: string;
    website!: string;
    bio!: string;
    activationLimit!: Date;
    activationCode!: string;
    roles!: string[];
    follow!: User[];
    profilePicture!: string;
}