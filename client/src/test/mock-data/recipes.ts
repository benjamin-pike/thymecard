import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';

import { srngFloat, srngInt } from '@/lib/random.utils';
import { RECIPES, TAGS } from './data/recipes';
import RECIPE_IMAGES from './data/recipe-images.json';
import NUTRITIONAL_INFO from './data/nutritional-info.json';
import { IIngredient, IMethodSection, IRecipe, IRecipeMetadata } from '@/types/recipe.types';

const ALL_IMAGES: Record<string, string[]> = RECIPE_IMAGES;

export const generateMockRecipeList = (): IRecipe[] => {
    const recipeNames = RECIPES.map((recipe) => recipe.name).sort((a, b) => 0.5 - srngFloat([a, b]));

    return recipeNames.map(generateRecipeEntry);
};

export const generateNutitionalInfo = () => {
    return [...NUTRITIONAL_INFO].sort((a, b) => 0.5 - srngFloat([a.code.toString(), b.code.toString()])).slice(0, 15);
};

const generateRecipeEntry = (name: string): IRecipe => {
    const imageCandidates = ALL_IMAGES[name];
    const tagCandidates = TAGS[name] ?? [];
    const minutesInYear = 60 * 24 * 365;

    const imageUrl = imageCandidates[srngInt(0, imageCandidates.length - 1, [name, 'image'])];
    const servings = srngInt(1, 6, [name, 'servings']) * 2;
    const prepTime = srngInt(2, 20, [name, 'prepTime']) * 5;
    const cookTime = srngInt(2, 20, [name, 'cookTime']) * 5;
    const rating = srngInt(1, 10, [name, 'rating']) / 2;
    const tags = tagCandidates.slice(0, srngInt(2, 5, [name, 'tags']));
    const bookmarked = srngFloat([name, 'bookmarked']) > 0.5;
    const dateAdded = DateTime.local()
        .minus({ minutes: srngInt(0, minutesInYear, [name, 'dateAdded']) })
        .toJSDate();

    return {
        id: uuidv4(),
        name,
        imageUrl,
        servings,
        prepTime,
        cookTime,
        rating,
        bookmarked,
        dateAdded,
        tags
    };
};

export const TITLE = "Roasted Tomato and Basil Soup with Grilled Cheese"

export const DESCRIPTION = "Slow-roasted tomatoes and fresh basil create a flavorful soup base, while a blend of creamy cheddar, nutty Gruyère, and Parmesan melts to perfection between toasted artisanal bread slices for the ultimate grilled cheese. This recipe combines classic comfort with gourmet taste, perfect for a hearty and satisfying meal.";

export const METADATA: IRecipeMetadata = {
    author: 'Carmen Berzatto',
    url: 'https://www.kitchensanctuary.com/korean-fried-chicken/',
    yield: {
        quantity: [4, 6],
        units: 'people'
    },
    prepTime: 30,
    cookTime: 150,
    totalTime: 180,
    rating: 3.5,
    created: new Date('2023-01-29'),
    lastCooked: new Date('2023-05-13'),
    tags: ['Vegetarian', 'Soup', 'Hearty', 'Tomato', 'Basil', 'Cheese']
}

export const IMAGES = [
    'https://simply-delicious-food.com/wp-content/uploads/2021/11/Roasted-tomato-soup-with-grilled-cheese-croutons-5.jpg',
    'https://gimmedelicious.com/wp-content/uploads/2016/11/roasted-tomato-soup-with-grilled-cheese-8-of-12.jpg',
    'https://www.acouplecooks.com/wp-content/uploads/2021/09/Tomato-Soup-004.jpg',
    'https://i0.wp.com/www.aspicyperspective.com/wp-content/uploads/2020/02/Roasted-Tomato-Basil-Soup-Recipe-7.jpg?fit=1200%2C1706&ssl=1',
    'https://simply-delicious-food.com/wp-content/uploads/2019/08/Tomato-soup-with-grilled-cheese-5.jpg',
    'https://simply-delicious-food.com/wp-content/uploads/2019/08/Tomato-soup-with-grilled-cheese-2.jpg',
    'https://hips.hearstapps.com/delish/assets/15/44/1446063831-weeknight-din-tomato-soup.jpg'
] 

export const INGREDIENTS: IIngredient[] = [
    {
        quantity: [2.5],
        unit: 'pounds',
        item: 'ripe tomatoes',
        prepStyles: null,
        notes: 'preferably plum tomatoes',
        source: 'Roasted Tomato and Basil Soup',
        match: {
            id: '0',
            name: 'Tomatoes',
            strength: 'weak'
        }
    },
    {
        quantity: [1],
        unit: null,
        item: 'onion, large',
        prepStyles: 'chopped',
        notes: 'red or white',
        source: 'Roasted Tomato and Basil Soup',
        match: {
            id: '1',
            name: 'Onion',
            strength: 'strong'
        }
    },
    {
        quantity: [4],
        unit: 'cloves',
        item: 'garlic',
        prepStyles: 'minced',
        notes: null,
        source: 'Roasted Tomato and Basil Soup',
        match: {
            id: '2',
            name: 'Garlic',
            strength: 'strong'
        }
    },
    {
        quantity: [2],
        unit: 'tbsp',
        item: 'olive oil',
        prepStyles: null,
        notes: null,
        source: 'Roasted Tomato and Basil Soup',
        match: {
            id: '3',
            name: 'Olive Oil',
            strength: 'strong'
        }
    },
    {
        quantity: [0.5],
        unit: 'tsp',
        item: 'salt',
        prepStyles: null,
        notes: 'or to taste',
        source: 'Roasted Tomato and Basil Soup',
        match: {
            id: '4',
            name: 'Salt',
            strength: 'strong'
        }
    },
    {
        quantity: [0.25],
        unit: 'tsp',
        item: 'black pepper',
        prepStyles: null,
        notes: 'or to taste',
        source: 'Roasted Tomato and Basil Soup',
        match: {
            id: '5',
            name: 'Black Pepper',
            strength: 'strong'
        }
    },
    {
        quantity: [0.5],
        unit: 'tsp',
        item: 'dried oregano',
        prepStyles: null,
        notes: null,
        source: 'Roasted Tomato and Basil Soup',
        match: {
            id: '6',
            name: 'Oregano',
            strength: 'confirmed'
        }
    },
    {
        quantity: [0.5],
        unit: 'tsp',
        item: 'dried basil',
        prepStyles: null,
        notes: null,
        source: 'Roasted Tomato and Basil Soup',
        match: {
            id: '7',
            name: 'Basil',
            strength: 'confirmed'
        }
    },
    {
        quantity: [0.25],
        unit: 'tsp',
        item: 'red pepper flakes',
        prepStyles: null,
        notes: 'optional, for a little heat',
        source: 'Roasted Tomato and Basil Soup',
        match: null
    },
    {
        quantity: [4],
        unit: 'cups',
        item: 'vegetable broth',
        prepStyles: null,
        notes: 'or chicken broth, if preferred',
        source: 'Roasted Tomato and Basil Soup',
        match: {
            id: '8',
            name: 'Vegetable Stock',
            strength: 'confirmed'
        }
    },
    {
        quantity: [0.25],
        unit: 'cup',
        item: 'heavy cream',
        prepStyles: null,
        notes: 'optional, for added creaminess',
        source: 'Roasted Tomato and Basil Soup',
        match: {
            id: '9',
            name: 'Cream',
            strength: 'weak'
        }
    },
    {
        quantity: null,
        unit: null,
        item: 'Fresh basil leaves',
        prepStyles: null,
        notes: 'for garnish',
        source: 'Roasted Tomato and Basil Soup',
        match: null
    },
    {
        quantity: [8],
        unit: 'slices',
        item: 'artisanal bread',
        prepStyles: null,
        notes: 'such as sourdough or ciabatta',
        source: 'Grilled Cheese Sandwiches',
        match: {
            id: '10',
            name: 'Bread',
            strength: 'weak'
        }
    },
    {
        quantity: [4],
        unit: 'tbsp',
        item: 'unsalted butter',
        prepStyles: null,
        notes: 'softened',
        source: 'Grilled Cheese Sandwiches',
        match: {
            id: '11',
            name: 'Butter',
            strength: 'weak'
        }
    },
    {
        quantity: [8],
        unit: 'slices',
        item: 'cheese',
        prepStyles: null,
        notes: 'such as cheddar, Swiss, or Gruyère',
        source: 'Grilled Cheese Sandwiches',
        match: {
            id: '12',
            name: 'Cheese',
            strength: 'weak'
        }
    }
];

export const METHOD: IMethodSection[] = [
    {
        id: '509cf481-7371-493c-9d5a-6b1087c47f81',
        sectionTitle: 'Preparation',
        steps: [
            {
                id: 'c9465e04-cf64-4e1b-9aec-b94f369083c7',
                stepTitle: 'Preheat the Oven',
                instructions: 'Preheat your oven to 400°F (200°C).'
            },
            {
                id: 'f2792ffa-50f1-437a-9f1d-bf81ab7a1129',
                stepTitle: 'Roast the Tomatoes',
                instructions:
                    'Wash and core the tomatoes. Cut them in half horizontally. ' +
                    'Place the tomato halves on a baking sheet, cut side up. ' +
                    'Drizzle 2 tablespoons of olive oil over the tomatoes and sprinkle them with 0.5 teaspoons of salt, 0.25 teaspoons of black pepper, 0.5 teaspoons of dried oregano, 0.5 teaspoons of dried basil, and optionally, 0.25 teaspoons of red pepper flakes for a little heat. ' +
                    'Roast the tomatoes in the preheated oven for about 30-35 minutes, or until they start to caramelize and wrinkle.'
            },
            {
                id: 'f31b661a-36b8-4f6d-88d1-9a9218ca619c',
                stepTitle: 'Sauté the Onion and Garlic',
                instructions:
                    'While the tomatoes are roasting, heat 2 tablespoons of olive oil in a large pot over medium heat. ' +
                    'Add 1 chopped large onion and sauté until it becomes translucent, about 5 minutes. ' +
                    'Stir in 4 minced cloves of garlic and cook for an additional 1-2 minutes until fragrant.'
            }
        ]
    },
    {
        id: '52633adc-bc8d-4a82-b88e-745b99a6c832',
        sectionTitle: 'Soup Preparation',
        steps: [
            {
                id: 'f5655d51-0918-4bad-b6f1-15391509053b',
                stepTitle: 'Blend the Soup',
                instructions:
                    'Once the tomatoes are done roasting, remove them from the oven and let them cool slightly. ' +
                    'Transfer the roasted tomatoes, including any juices from the baking sheet, to the pot with the sautéed onions and garlic. ' +
                    'Add 4 cups of vegetable broth to the pot and bring the mixture to a simmer. ' +
                    'Let the soup simmer for about 15-20 minutes to allow the flavors to meld together. ' +
                    'Use an immersion blender or a regular blender to puree the soup until smooth. If using a regular blender, be sure to blend in batches and allow it to cool slightly before blending.'
            },
            {
                id: 'b164ad70-1249-4189-be93-6609ebaf8cff',
                stepTitle: 'Finish the Soup',
                instructions:
                    'Return the pureed soup to the pot and heat it over low-medium heat. ' +
                    'If using heavy cream, stir in 0.25 cups of heavy cream to make it creamy. ' +
                    'Taste the soup and adjust the seasonings with more salt and pepper if needed.'
            }
        ]
    },
    {
        id: '5e564e3d-c01a-4b43-b328-5f038b354b16',
        sectionTitle: 'Grilled Cheese Sandwiches',
        steps: [
            {
                id: 'a63af17b-f0a9-4892-bf4f-976bbfe3d2e6',
                stepTitle: 'Prepare the Grilled Cheese',
                instructions:
                    'While the soup is simmering, assemble the grilled cheese sandwiches. ' +
                    'Butter one side of each of the 8 slices of artisanal bread. ' +
                    'Place a generous amount of shredded cheese (about 8 slices) between two slices of bread, buttered sides facing out. ' +
                    'Heat a skillet or griddle over medium heat and add a bit of butter to coat the pan. ' +
                    'Grill each sandwich until the bread is golden brown, and the cheese is melted, about 3-4 minutes per side.'
            }
        ]
    },
    {
        id: '1473c795-9ef2-4ecc-9fd2-b9f7e1765a16',
        steps: [
            {
                id: '63add157-9492-41b5-8b26-721dc6eb5b2b',
                instructions:
                    'Ladle the hot roasted tomato and basil soup into bowls. ' +
                    'Garnish with fresh basil leaves. ' +
                    'Serve the grilled cheese sandwiches alongside the soup for a delicious and comforting meal.'
            }
        ]
    }
];