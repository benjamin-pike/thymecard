import { isArray, isObject } from "@sirona/types";

export const compare = (objA: any, objB: any): boolean => {
	if (objA === objB) {
		return true;
	}

	if (!isObject(objA) || !isObject(objB)) {
		return false;
	}

	if (Object.getPrototypeOf(objA) !== Object.getPrototypeOf(objB)) {
		return false;
	}

	if (isArray(objA) && isArray(objB)) {
		if (objA.length !== objB.length) {
			return false;
		}
		for (let i = 0; i < objA.length; i++) {
			if (!compare(objA[i], objB[i])) {
				return false;
			}
		}
		return true;
	}

	const keysA = Object.keys(objA) as (keyof typeof objA)[];
	const keysB = Object.keys(objB) as (keyof typeof objB)[];

	if (keysA.length !== keysB.length) {
		return false;
	}

	for (let key of keysA) {
		if (!keysB.includes(key)) {
			return false;
		}
	}

	for (let key of keysA) {
		if (!compare(objA[key], objB[key])) {
			return false;
		}
	}

	return true;
};
