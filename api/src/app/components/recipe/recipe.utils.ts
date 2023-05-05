import he from 'he';
import {
    isArray,
    isArrayOf,
    isNonEmptyString,
    isNumber,
    isPlainObject,
    isString,
    parseFloatOrUndefined,
    validateWithFallback
} from '../../lib/types/typeguards.utils';
import {
    IIngredient,
    IYield,
    INutritionalInformation,
    Method,
    IRecipeCreate,
    isSchemaOrgHowToStep,
    isSchemaOrgHowToSection
} from './recipe.types';
import { UNIT_MAP, FRACTION_MAP, VALID_PREP_STYLES, VALID_PREP_STYLE_MODIFIERS } from './recipe.globals';

export class RecipeParser {
    private readonly resource: Record<string, any>;

    constructor(resource: Record<string, any>) {
        this.resource = resource;
    }

    public parseRecipe(): Partial<IRecipeCreate> {
        return {
            name: validateWithFallback(this.resource.name, isNonEmptyString, undefined),
            description: validateWithFallback(this.resource.description, isNonEmptyString, undefined),
            images: this.parseImages(this.resource.image),
            authors: this.parseAuthors(this.resource.author),
            category: this.parseCategoryOrCuisine(this.resource.recipeCategory),
            cuisine: this.parseCategoryOrCuisine(this.resource.recipeCuisine),
            keywords: this.parseKeywords(this.resource.keywords),
            prepTime: this.parseDuration(this.resource.prepTime),
            cookTime: this.parseDuration(this.resource.cookTime),
            totalTime: this.parseDuration(this.resource.totalTime),
            yield: this.parseYield(this.resource.recipeYield),
            diet: this.parseDietInformation(this.resource.suitableForDiet),
            nutrition: this.parseNutritionInformation(this.resource.nutrition),
            ingredients: this.parseIngredients(this.resource.recipeIngredient),
            method: this.parseMethod(this.resource.recipeInstructions)
        };
    }

    private parseImages(resource: any): string[] | undefined {
        let images: string[] | undefined;

        if (isNonEmptyString(resource)) {
            images = [resource];
        } else if (this.isSchemaOrgObject(resource, 'ImageObject')) {
            images = [resource.url];
        } else if (isArrayOf(resource, isNonEmptyString)) {
            images = resource;
        } else if (isArray<any>(resource) && resource.every((obj) => this.isSchemaOrgObject(obj, 'ImageObject'))) {
            images = resource.map((obj) => obj.url);
        }

        if (images) {
            return this.removeDuplicateImagesByBaseName(images);
        }
    }

    private parseAuthors(resource: any): string[] | undefined {
        if (isNonEmptyString(resource)) {
            return [resource];
        }
        if (this.isSchemaOrgObject(resource, 'Person')) {
            return [resource.name];
        }
        if (isArrayOf(resource, isNonEmptyString)) {
            return resource;
        }
        if (isArray<any>(resource) && resource.every((obj) => this.isSchemaOrgObject(obj, 'Person'))) {
            return resource.map((obj) => obj.name);
        }
    }

    private parseCategoryOrCuisine(resource: any): string[] | undefined {
        if (!resource) {
            return undefined;
        }

        if (isNonEmptyString(resource)) {
            return resource.split(',').map((category) => category.trim());
        }

        if (isArrayOf(resource, isNonEmptyString)) {
            return resource.flatMap((element) => element.split(',').map((category) => category.trim()));
        }
    }

    private parseKeywords(resource: any): string[] | undefined {
        if (!isNonEmptyString(resource)) {
            return undefined;
        }

        return resource
            .split(',')
            .map((keyword) => keyword.trim())
            .filter((keyword) => keyword.length > 0);
    }

    private parseDuration(resource: any): number | undefined {
        if (!isNonEmptyString(resource)) {
            return undefined;
        }

        const regex = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
        const matches = resource.match(regex);

        if (!matches) {
            return undefined;
        }

        let totalMinutes = 0;

        if (matches[1] !== undefined) {
            // Hours
            totalMinutes += parseInt(matches[1]) * 60;
        }
        if (matches[2] !== undefined) {
            // Minutes
            totalMinutes += parseInt(matches[2]);
        }
        if (matches[3] !== undefined) {
            // Seconds
            totalMinutes += parseInt(matches[3]) / 60;
        }

        if (totalMinutes === 0) {
            return undefined;
        }

        return totalMinutes;
    }

    private parseYield(resource: any): IYield | undefined {
        if (!resource) {
            return undefined;
        }
        if (isNumber(resource)) {
            return { quantity: [resource], units: null };
        }
        if (isNonEmptyString(resource)) {
            const match = resource.match(/(\d+)\s*(-|to)\s*(\d+)|(\d+)\s*(\D+)/i);
            if (match) {
                let quantity: number[] | undefined;
                let units: string | undefined;

                if (match[1] && match[3]) {
                    quantity = [parseInt(match[1]), parseInt(match[3])];
                } else if (match[4]) {
                    quantity = [parseInt(match[4])];
                }

                if (match[5]) {
                    units = match[5].trim();
                }

                if (!quantity) {
                    return undefined;
                }

                return { quantity, units: units ?? null };
            }

            const parsedQuantity = parseInt(resource);
            if (parsedQuantity) {
                return { quantity: [parsedQuantity], units: null };
            }

            return undefined;
        }
        if (isArray(resource)) {
            const result = resource.map((item) => this.parseYield(item)).find((result) => result !== undefined);
            if (result !== undefined) {
                return result;
            }
        }
    }

    private parseDietInformation(resource: any): string[] | undefined {
        if (!resource) {
            return undefined;
        }

        const isolateDiet = (path: string): string => {
            const splitPath = path.split('/');
            const isolatedString = splitPath[splitPath.length - 1];
            return isolatedString
                .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
                .toLowerCase()
                .replace('diet', '')
                .trim();
        };

        if (isNonEmptyString(resource)) {
            return [isolateDiet(resource)];
        }

        if (isArrayOf(resource, isNonEmptyString)) {
            return resource.map(isolateDiet);
        }
    }

    private parseNutritionInformation(resource: any): INutritionalInformation | undefined {
        if (!this.isSchemaOrgObject(resource, 'NutritionInformation')) {
            return undefined;
        }

        const nutritionInformation: INutritionalInformation = {
            calories: parseFloatOrUndefined(resource.calories),
            sugar: parseFloatOrUndefined(resource.sugarContent),
            carbohydrate: parseFloatOrUndefined(resource.carbohydrateContent),
            cholesterol: parseFloatOrUndefined(resource.cholesterolContent),
            fat: parseFloatOrUndefined(resource.fatContent),
            saturatedFat: parseFloatOrUndefined(resource.saturatedFatContent),
            transFat: parseFloatOrUndefined(resource.transFatContent),
            unsaturatedFat: parseFloatOrUndefined(resource.unsaturatedFatContent),
            protein: parseFloatOrUndefined(resource.proteinContent),
            fiber: parseFloatOrUndefined(resource.fiberContent),
            sodium: parseFloatOrUndefined(resource.sodiumContent),
            servingSize: this.parseYield(resource.servingSize)
        };

        return nutritionInformation;
    }

    private parseIngredients(resource: any): IIngredient[] | undefined {
        if (!isArrayOf(resource, isNonEmptyString)) {
            return;
        }

        const ingredientsParser = new IngredientsParser(resource);
        return ingredientsParser.parseIngredients();
    }

    private parseMethod(resource: any): Method | undefined {
        if (isArray(resource)) {
            const result: Method = [];

            for (const element of resource) {
                if (isSchemaOrgHowToStep(element)) {
                    const step = {
                        instructions: element.text,
                        stepTitle: element.name !== element.text ? element.name : undefined,
                        image: this.parseImages(element.image)
                    };
                    result.push({ steps: [step] });
                    continue;
                }
                if (isSchemaOrgHowToSection(element)) {
                    const steps = element.itemListElement.map((step: any) => {
                        return {
                            instructions: step.text,
                            stepTitle: step.name !== step.text ? step.name : undefined,
                            image: this.parseImages(step.image)
                        };
                    });

                    result.push({
                        steps,
                        sectionTitle: element.name
                    });
                }
            }

            return result;
        }
    }

    private isSchemaOrgObject = (obj: any, type: string): boolean => {
        return obj && obj['@type'] === type;
    };

    private removeDuplicateImagesByBaseName(imageUrls: string[]): string[] {
        const duplicates: Set<number> = new Set();

        for (let i = 0; i < imageUrls.length; i++) {
            if (duplicates.has(i)) {
                continue;
            }

            const url1 = new URL(imageUrls[i]);
            const pathComponents1 = url1.pathname.split('/');
            const fileName1 = pathComponents1[pathComponents1.length - 1].split('.')[0];

            for (let j = 0; j < imageUrls.length; j++) {
                if (i === j) {
                    continue;
                }

                const url2 = new URL(imageUrls[j]);
                const pathComponents2 = url2.pathname.split('/');
                const fileName2 = pathComponents2[pathComponents2.length - 1].split('.')[0];

                if (fileName2.includes(fileName1)) {
                    duplicates.add(j);
                }
            }
        }

        const uniqueImages = imageUrls.filter((_, index) => !duplicates.has(index));
        return uniqueImages;
    }
}

export class IngredientsParser {
    private resource: string[];

    private fractionPattern = '\\d+/\\d+';
    private mixedNumberPattern = '\\d+\\s+' + this.fractionPattern;
    private numberPattern = '\\d+(?:[.,]\\d+)?';
    private rangePattern = `(?:${this.mixedNumberPattern}|${this.fractionPattern}|${this.numberPattern})\\s*(-|to|or)\\s*(?:${this.mixedNumberPattern}|${this.fractionPattern}|${this.numberPattern})`;
    private quantityRegex = new RegExp(
        `^(${this.rangePattern}|${this.mixedNumberPattern}|${this.fractionPattern}|${this.numberPattern})\\s*`
    );
    private unitRegex = new RegExp(`^(${Object.keys(UNIT_MAP).join('|')})\\b`, 'i');

    constructor(resource: string[]) {
        this.resource = resource;
    }

    public parseIngredients(): IIngredient[] {
        return this.resource.map((ingredient) => this.parseIngredient(ingredient));
    }

    private parseIngredient(input: string): IIngredient {
        let quantity: number[] | null;
        let unit: string | null;

        let parentheticals: string[];
        let parsedPrepStyles: string[];
        let intermediateText: string;

        // Progressively extract components from the input string
        ({ quantity, intermediateText } = this.parseQuantity(input.trim()));
        intermediateText = this.translocateMeasurementQualifier(intermediateText);
        ({ unit, intermediateText } = this.parseUnit(intermediateText));
        intermediateText = this.removeAltMeasurements(intermediateText);
        ({ parentheticals, intermediateText } = this.extractParentheticals(intermediateText));
        ({ prepStyles: parsedPrepStyles, intermediateText } = this.parsePrepStyles(intermediateText));

        // Get quantity for edge cases inputs such as 'Zest of 1 lemon' (=> '1 lemon, zest of')
        if (!quantity && !unit) {
            ({ quantity, intermediateText } = this.parseQuantity(intermediateText));
        }

        const [item, ...notesAndStyles] = intermediateText
            .split(/,|;|:/)
            .concat(parentheticals)
            .map(this.cleanupText)
            .filter(isNonEmptyString);

        const prepStyles = parsedPrepStyles
            .concat(notesAndStyles.filter(this.isPrepStyle.bind(this)))
            .map((style) => style.toLowerCase())
            .map(this.cleanupText);

        const notes = notesAndStyles.filter((note) => !prepStyles.includes(note));

        return {
            quantity,
            unit,
            item,
            prepStyles: prepStyles.length ? prepStyles : undefined,
            notes: notes.length ? notes : undefined,
            source: input
        };
    }

    private parseQuantity(input: string): { intermediateText: string; quantity: number[] | null } {
        const asciiString = this.replaceUnicodeFractions(input);
        const quantityMatch = asciiString.match(this.quantityRegex);

        let quantity: number[] | null = null;
        let intermediateText = asciiString;

        if (quantityMatch) {
            const range = quantityMatch[0]
                .trim() // Remove leading and trailing whitespace
                .split(/-|to|or/) // Split on potential range indicators
                .map((val) => this.convertFractionToDecimal(val)); // Parse each value into a decimal
            const isRange = range.length !== 1;
            quantity = isRange ? [range[0], range[1]] : [range[0]];
            intermediateText = asciiString.slice(quantityMatch[0].length);
        }

        return { intermediateText, quantity };
    }

    private parseUnit(input: string): { intermediateText: string; unit: string | null } {
        const unitMatch = input.match(this.unitRegex);

        let unit: string | null = null;
        let intermediateText = input;

        if (unitMatch) {
            unit = UNIT_MAP[unitMatch[0].trim().toLowerCase()]; // Convert unit to standard unit (eg. grams => g)
            intermediateText = input.slice(unitMatch[0].length).trim(); // Remove the unit from the name
        }

        return { intermediateText, unit };
    }

    private parsePrepStyles(input: string): { intermediateText: string; prepStyles: string[] } {
        const wordBoundary = '\\b';
        const space = '\\s';
        const prepStylesPattern = VALID_PREP_STYLES.map((style) => `${wordBoundary}${style}${wordBoundary}`).join('|');
        const prepStyleModifiersPattern = VALID_PREP_STYLE_MODIFIERS.map((modifier) => `${wordBoundary}${modifier}${space}`).join('|');
        const separatorPattern = `${space}(and|or)${space}`;
        const regexPattern = `(${prepStyleModifiersPattern})?(${prepStylesPattern})(${separatorPattern})?(${prepStyleModifiersPattern})?(${prepStylesPattern})?`;
        const regex = new RegExp(regexPattern, 'gi');

        const prepStyles: string[] = [];
        let match: RegExpExecArray | null;

        const preCommaString = input.split(/,|;|:/)[0];
        const postCommaString = input.split(/,|;|:/).slice(1).join(',');

        while ((match = regex.exec(preCommaString)) !== null) {
            const combinedStyle = match[0];
            prepStyles.push(combinedStyle);
        }

        const intermediateText = this.cleanupText(`${preCommaString.replace(regex, '')}, ${postCommaString}`);

        return {
            intermediateText,
            prepStyles
        };
    }

    private isPrepStyle(input: string): boolean {
        return this.cleanupText(this.parsePrepStyles(input).intermediateText) === '';
    }

    private cleanupText(input: string): string {
        // Trims non-alpha chars, removes surplus spaces, removes space before comma/semicolon

        return input
            .replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '')
            .replace(/\s+/g, ' ')
            .replace(' ,', ',')
            .replace(' ;', ';');
    }

    private extractParentheticals(input: string): { intermediateText: string; parentheticals: string[] } {
        const regex = /\(([^()]*)\)/g;
        let match: RegExpExecArray | null;
        let parentheticals: string[] = [];

        while ((match = regex.exec(input)) !== null) {
            parentheticals.push(match[1]);
            input = input.slice(0, match.index) + input.slice(match.index + match[0].length);
            regex.lastIndex = 0;
        }

        for (let i = 0; i < parentheticals.length; i++) {
            const nested = this.extractParentheticals(parentheticals[i]);
            input = input.replace(`(${parentheticals[i]})`, '');
            parentheticals[i] = nested.intermediateText;
            parentheticals = parentheticals.slice(0, i + 1).concat(nested.parentheticals, parentheticals.slice(i + 1));
        }

        const intermediateText = this.cleanupText(input);

        return { intermediateText, parentheticals };
    }

    private replaceUnicodeFractions(input: string): string {
        // Replaces unicode fractions with ascii equivalents  (e.g. ½ -> 1/2)

        return input
            .replace(new RegExp('(?<=\\d)(?=' + Object.keys(FRACTION_MAP).join('|') + ')', 'g'), ' ')
            .replace(new RegExp(Object.keys(FRACTION_MAP).join('|'), 'g'), (match) => FRACTION_MAP[match]);
    }

    private convertFractionToDecimal(input: string): number {
        // Converts fractions quantities to decimals, e.g. 1/2 -> 0.5

        const match = input.match(new RegExp(this.fractionPattern));
        if (match) {
            const [numerator, denominator] = match[0].split('/').map((x) => parseFloat(x));
            const fraction = numerator / denominator;

            const wholeNumberMatch = input.match(new RegExp('\\d+(?=\\s+' + this.fractionPattern + ')'));
            return wholeNumberMatch ? parseFloat(wholeNumberMatch[0]) + fraction : fraction;
        } else {
            return parseFloat(input.replace(',', '.'));
        }
    }

    private translocateMeasurementQualifier(input: string): string {
        // Translocates opening parentheses to either:
        //     1) before the first comma
        //     2) before the next parentheses
        //     3) to the end of the string
        // Used to move measurement qualitifer to after measurement (eg. 1 (14 oz) can of tomatoes -> 1 can of tomatoes (14 oz))

        const regex = /^\((.*?)\)/;
        const match = input.match(regex);

        if (match) {
            const matchedParentheses = match[0];
            const remainingStr = input.replace(regex, '');

            const commaIndex = remainingStr.indexOf(',');
            const nextParenthesesIndex = remainingStr.search(/\(.*?\)/);

            let insertIndex = remainingStr.length;

            if (commaIndex > -1 && (nextParenthesesIndex === -1 || commaIndex < nextParenthesesIndex)) {
                insertIndex = commaIndex;
            } else if (nextParenthesesIndex > -1) {
                insertIndex = nextParenthesesIndex;
            }

            return remainingStr.slice(0, insertIndex) + matchedParentheses + remainingStr.slice(insertIndex);
        }

        return input;
    }

    private removeAltMeasurements(input: string): string {
        // Removes parentheticals from the beginning of the string
        // Used to remove alternative measurements (eg. 1 cup (250 ml) milk)
        let formatedText = input;

        const openingParenthesesRegex = /^\((.*?)\)/;
        if (input.match(openingParenthesesRegex)) {
            formatedText = input.replace(openingParenthesesRegex, '').trim();
        }

        // Remove opening slash and any following measurements from the beginning of the string
        // Used to remove alternative measurements (eg. 1 lb / 500g ground beef)
        const openingSlashRegex = /^\/(.*)$/;
        if (formatedText.match(openingSlashRegex)) {
            formatedText = formatedText.replace(openingSlashRegex, '$1').trim();

            const altQuantityMatch = formatedText.match(this.quantityRegex);
            if (altQuantityMatch) {
                const altUnitMatch = formatedText.slice(altQuantityMatch[0].length).trim().match(this.unitRegex);
                if (altUnitMatch) {
                    formatedText = formatedText.slice(altQuantityMatch[0].length).slice(altUnitMatch[0].length).trim();
                }
            }
        }

        return formatedText.trim();
    }
}

export const parseJsonLinkedData = (html: string): any => {
    const regex = /<script(.*?)type="application\/ld\+json"(.*?)>(.*?)<\/script>/gis;
    const matches = [...html.matchAll(regex)];
    const linkedData = matches.flatMap((match) => JSON.parse(match.at(-1) as string));
    const decodedLinkedData = decodeHtmlEntities(linkedData);

    let data;
    if (decodedLinkedData.length === 1) {
        if (decodedLinkedData[0]['@graph']) {
            data = decodedLinkedData[0]['@graph'];
        } else {
            data = decodedLinkedData[0];
        }
    } else {
        data = decodedLinkedData;
    }

    if (!isArray(data)) {
        if (!isPlainObject(data) || !data['@type']) {
            return {};
        }
        data = [data];
    }

    data = splitMultiTypeObjects(data);

    const dataObject = data.reduce((output: Record<string, any>, object: Record<string, any>) => {
        const type = object['@type'];
        if (!output[type] || Object.keys(object).length > Object.keys(output[type]).length) {
            output[type] = object;
        }
        return output;
    }, {});

    return dataObject;
};

export const decodeHtmlEntities = (obj: any): any => {
    if (isString(obj)) {
        return he.decode(obj);
    }

    if (isArray(obj)) {
        return obj.map(decodeHtmlEntities);
    }

    if (isPlainObject(obj)) {
        const newObj: Record<string, any> = {};
        for (const key in obj) {
            newObj[key] = decodeHtmlEntities(obj[key]);
        }
        return newObj;
    }

    return obj;
};

export const splitMultiTypeObjects = (objs: any): object[] => {
    const duplicatedObjects: object[] = [];

    for (const obj of objs) {
        const type = obj['@type'];

        if (!type) {
            continue;
        }

        if (isString(type)) {
            duplicatedObjects.push(obj);
            continue;
        }

        if (isArrayOf(type, isString)) {
            for (const t of type) {
                const duplicatedObj = { ...obj, '@type': t };
                duplicatedObjects.push(duplicatedObj);
            }
            continue;
        }
    }

    return duplicatedObjects;
};
