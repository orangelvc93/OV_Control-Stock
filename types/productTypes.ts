import { Timestamp } from "firebase/firestore";
import { ItemImage } from "./ItemImageTypes";

export type Product = {
	id?: string;
	image: ItemImage;
	name: string;
	price: number;
	soldUnits: number;
	createdAt?: Timestamp;
};
