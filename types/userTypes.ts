import { Timestamp } from "firebase/firestore/lite";

export type User = {
	uid: string;
	image?: string;
	name: string;
	email: string;
	password: string;
	createdAdd: Timestamp;
};
