export enum EventType {
	BREAKFAST = "breakfast",
	LUNCH = "lunch",
	DINNER = "dinner",
	ACTIVITY = "activity",
	SNACK = "snack",
	DRINK = "drink",
	APPETIZER = "appetizer",
	DESSERT = "dessert"
}

export interface IEventItem {
	title: string;
	isFavorite: boolean;
	recipeId?: string;
}
