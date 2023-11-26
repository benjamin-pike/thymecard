export enum StockSection {
	PANTRY = "pantry",
	SHOPPING_LIST = "shoppingList",
	FAVORITES = "favorites"
}

export interface IStock {
    _id: string;
	userId: string;
	pantry: IStockCategory[];
	shoppingList: IStockCategory[];
	favorites: IStockCategory[];
}

export interface IStockCategory {
	id: string;
	name: string;
	items: IStockItem[];
}

export interface IStockItem {
	id: string;
	name: string;
	quantity?: string;
	note?: string;
	expiryDate?: string;
}

export type IStockCreate = Omit<IStock, "_id" | "createdAt" | "updatedAt">;
export type IStockUpdate = {
	[key in StockSection]: IStockCategory[];
};
