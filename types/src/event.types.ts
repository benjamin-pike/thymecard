export enum EEventType {
	BREAKFAST = "BREAKFAST",
	LUNCH = "LUNCH",
	DINNER = "DINNER",
	ACTIVITY = "ACTIVITY",
	SNACK = "SNACK",
	DRINK = "DRINK",
	APPETIZER = "APPETIZER",
	DESSERT = "DESSERT"
}

export enum EMealType {
    BREAKFAST = "BREAKFAST",
	LUNCH = "LUNCH",
	DINNER = "DINNER",
	ACTIVITY = "ACTIVITY",
	SNACK = "SNACK",
	DRINK = "DRINK",
	APPETIZER = "APPETIZER",
	DESSERT = "DESSERT"
}

export type MealType = Exclude<EEventType, EEventType.ACTIVITY>;

export interface ITime {
	hours: number;
	minutes: number;
}