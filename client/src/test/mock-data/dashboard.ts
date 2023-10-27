import { LoremIpsumGenerator } from '@/lib/lorem';
import { DateTime } from 'luxon';
import seedrandom from 'seedrandom';
import { IPrimaryMetric, ISecondaryMetric, IFeedEventProps, IFeedData } from '@/components/dashboard/feed/feed.types';
import { srngFloat, srngInt } from '@/lib/random.utils';
import FOOD_IMAGES from './data/food-images.json';
import { RECIPES } from './data/recipes';

export const generateMockProgressData = (startDate: DateTime, days: number): any[] => {
    const BREAKFAST_TIME = 9;
    const LUNCH_TIME = 13;
    const DINNER_TIME = 18;
    const SNACK_TIME = 21;
    const EXERCISE_TIMES = [8, 12, 16, 20];

    const EAT_CAL_RANGE = [600, 1500];
    const EXERCISE_CAL_RANGE = [700, 2000];

    const getRandomTimeAround = (hour: number, rng: seedrandom.PRNG) => {
        return hour + rng() * 3 - 1.5;
    };

    const data = [];
    const rng = seedrandom(days.toString());

    for (let day = 0; day < days; day++) {
        const date = startDate.minus({ days: day });

        const mealTimes = [BREAKFAST_TIME, LUNCH_TIME, DINNER_TIME, SNACK_TIME];
        const meals = mealTimes.sort(() => rng() - 0.5).slice(0, Math.floor(rng() * 3) + 1);

        for (let mealTime of meals) {
            mealTime = getRandomTimeAround(mealTime, rng);
            const mealDateTime = date.set({ hour: Math.floor(mealTime), minute: Math.floor((mealTime % 1) * 60) });
            data.push({
                time: mealDateTime?.toISO() || '',
                cal: Math.floor(rng() * (EAT_CAL_RANGE[1] - EAT_CAL_RANGE[0])) + EAT_CAL_RANGE[0]
            });
        }

        const exerciseChoices = EXERCISE_TIMES.sort(() => rng() - 0.5).slice(0, Math.floor(rng() * 3) + 1);

        for (let exerciseTime of exerciseChoices) {
            exerciseTime = getRandomTimeAround(exerciseTime, rng);
            const exerciseDateTime = date.set({ hour: Math.floor(exerciseTime), minute: Math.floor((exerciseTime % 1) * 60) });
            data.push({
                time: exerciseDateTime?.toISO() || '',
                cal: -(Math.floor(rng() * (EXERCISE_CAL_RANGE[1] - EXERCISE_CAL_RANGE[0])) + EXERCISE_CAL_RANGE[0])
            });
        }

        while (data.filter((event) => event.time.startsWith(date.toISODate() ?? '')).reduce((a, b) => a + b.cal, 0) > 0) {
            const exerciseDateTime = date.set({ hour: EXERCISE_TIMES[Math.floor(rng() * EXERCISE_TIMES.length)] });
            data.push({
                time: exerciseDateTime?.toISO() || '',
                cal: -(Math.floor(rng() * (EXERCISE_CAL_RANGE[1] - EXERCISE_CAL_RANGE[0])) + EXERCISE_CAL_RANGE[0])
            });
        }
    }

    data.sort((a, b) => b.time.localeCompare(a.time));

    return data;
};

export const generateMockBookmarksData = (number: number) => {
    const ACTIVITIES = [
        { name: '12km Easy Run', calories: -1163 },
        { name: 'Abs and Legs Circuit', calories: -423 },
        { name: 'Yoga Flow Session', calories: -201 },
        { name: 'CrossFit Workout', calories: -552 },
        { name: '45min Spin Class', calories: -476 },
        { name: 'Swimming Laps', calories: -607 },
        { name: 'Boxing Training', calories: -517 },
        { name: 'Pilates Class', calories: -285 },
        { name: '30min HIIT Session', calories: -345 },
        { name: '10km Bike Ride', calories: -315 },
        { name: 'Powerlifting Session', calories: -507 },
        { name: 'Basketball Game', calories: -456 },
        { name: 'Hiking Adventure', calories: -657 },
        { name: 'Squash Match', calories: -628 },
        { name: 'Zumba Dance Class', calories: -397 },
        { name: 'Tennis Match', calories: -505 },
        { name: 'Soccer Game', calories: -482 },
        { name: 'Rowing Machine Workout', calories: -427 },
        { name: 'Martial Arts Training', calories: -575 },
        { name: 'Rock Climbing', calories: -702 },
        { name: 'Skateboarding Session', calories: -352 },
        { name: 'Walking the Dog', calories: -205 },
        { name: 'Jump Rope Workout', calories: -335 },
        { name: 'Stair Climbing', calories: -295 },
        { name: 'Beach Volleyball Game', calories: -408 },
        { name: 'Aerobics Class', calories: -368 },
        { name: 'Tai Chi Practice', calories: -158 },
        { name: 'Skiing Day', calories: -605 },
        { name: 'Ice Hockey Game', calories: -536 },
        { name: 'Horseback Riding', calories: -255 }
    ];

    const getRandomEvents = (options: { name: string; calories: number }[], type: string) => {
        const rng = seedrandom(`${DateTime.now().toFormat('yyyyLLdd')}${type}`);

        return [...options]
            .sort(() => 0.5 - rng())
            .slice(0, number)
            .map((recipe) => {
                const lastCompleted = DateTime.now().minus({ months: 3 * rng() });
                return { ...recipe, lastCompleted };
            })
            .sort((a, b) => b.lastCompleted.toMillis() - a.lastCompleted.toMillis())
            .map((recipe) => ({ ...recipe, lastCompleted: recipe.lastCompleted.toFormat('yyyy-LL-dd') }));
    };

    return {
        recipes: getRandomEvents(RECIPES, 'recipes'),
        activities: getRandomEvents(ACTIVITIES, 'activities')
    };
};

export const generateMockOverviewData = () => {
    const getRandomValue = (lower: number, upper: number, iterations: number) => {
        const rng = seedrandom(DateTime.now().toFormat('yyyyLLdd'));

        let value = 0;
        for (let i = 0; i < iterations; i++) {
            value += rng() * (upper - lower + 1) + lower;
        }
        return Math.floor(value);
    };
    const getRandomMeals = (factor: number) => getRandomValue(3, 6, factor);
    const getRandomActivities = (factor: number) => getRandomValue(2, 4, factor);
    const getRandomCaloriesIn = (factor: number) => getRandomValue(1500, 3500, factor);
    const getRandomCaloriesOut = (factor: number) => getRandomValue(1750, 4000, factor);

    const allTime = getRandomValue(365, 1000, 1);
    const ordinal = DateTime.local().ordinal;
    const dayOfMonth = DateTime.local().day;
    const dayOfWeek = DateTime.local().weekday;

    return {
        allTime: {
            events: {
                meals: getRandomMeals(allTime),
                activities: getRandomActivities(allTime)
            },
            calories: {
                in: getRandomCaloriesIn(allTime),
                out: getRandomCaloriesOut(allTime)
            }
        },
        year: {
            events: {
                meals: getRandomMeals(ordinal),
                activities: getRandomActivities(ordinal)
            },
            calories: {
                in: getRandomCaloriesIn(ordinal),
                out: getRandomCaloriesOut(ordinal)
            }
        },
        month: {
            events: {
                meals: getRandomMeals(dayOfMonth),
                activities: getRandomActivities(dayOfMonth)
            },
            calories: {
                in: getRandomCaloriesIn(dayOfMonth),
                out: getRandomCaloriesOut(dayOfMonth)
            }
        },
        week: {
            events: {
                meals: getRandomMeals(dayOfWeek),
                activities: getRandomActivities(dayOfWeek)
            },
            calories: {
                in: getRandomCaloriesIn(dayOfWeek),
                out: getRandomCaloriesOut(dayOfWeek)
            }
        }
    };
};

export const generateMockLatestEventData = () => {
    const getRandomDateTime = (startTime: number, endTime: number, type: string): string => {
        const rngDay = seedrandom(`${DateTime.now().toFormat('yyyyLLdd')}${type}Day`);
        const rngHour = seedrandom(`${DateTime.now().toFormat('yyyyLLdd')}${type}Hour`);
        const rngMinute = seedrandom(`${DateTime.now().toFormat('yyyyLLdd')}${type}Minute`);

        if (startTime < 0 || startTime > 23 || endTime < 0 || endTime > 23 || startTime >= endTime) {
            throw new Error(
                'Invalid time range provided. Hours should be between 0 and 23 (inclusive), and start time should be less than end time.'
            );
        }

        const randomDate = DateTime.local().minus({ days: Math.floor(rngDay() * 7) });
        const randomHour = startTime + Math.floor(rngHour() * (endTime - startTime + 1));
        const randomMinute = Math.floor(rngMinute() * 60);
        const randomDateTime = randomDate.set({ hour: randomHour, minute: randomMinute, second: 0 });

        return randomDateTime.toISO() ?? '';
    };

    const events = generateMockBookmarksData(1);

    return {
        meals: { ...events.recipes[0], lastCompleted: getRandomDateTime(17, 20, 'meals') },
        activities: { ...events.activities[0], lastCompleted: getRandomDateTime(6, 15, 'activities') }
    };
};

export enum EventType {
    Breakfast = 'breakfast',
    Lunch = 'lunch',
    Dinner = 'dinner',
    Snack = 'snack',
    Dessert = 'dessert',
    Drink = 'drink'
}

export enum PartOfDay {
    Morning = 'morning',
    Afternoon = 'afternoon',
    Evening = 'evening'
}

const EVENT_TYPES: Record<PartOfDay, EventType[]> = {
    morning: [EventType.Breakfast, EventType.Snack],
    afternoon: [EventType.Lunch, EventType.Snack],
    evening: [EventType.Dinner, EventType.Dessert, EventType.Drink]
};

const EVENT_NAMES = {
    breakfast: [
        'Granola with Yogurt',
        'French Toast',
        'Blueberry Pancakes',
        'Fruit Salad',
        'Omelette',
        'Smoothie',
        'Avocado Toast',
        'Eggs Benedict',
        'Cereal with Milk',
        'Toast with Jam',
        'Bagel with Cream Cheese',
        'Protein Shake',
        'Porridge with Berries',
        'Quiche',
        'Croissant'
    ],
    snack: [
        'Mixed Nuts',
        'Fresh Fruit',
        'Yogurt',
        'Granola Bar',
        'Cheese and Crackers',
        'Smoothie',
        'Rice Cakes',
        'Trail Mix',
        'Protein Bar',
        'Apple Slices with Peanut Butter',
        'Vegetable Sticks with Hummus',
        'Popcorn',
        'Dark Chocolate',
        'Dried Fruit',
        'Boiled Egg'
    ],
    lunch: [
        'Prawn Salad',
        'Tuna Salad Wrap',
        'Chicken Caesar Salad',
        'Pasta',
        'Burrito',
        'Sushi',
        'Burger and Fries',
        'BLT Sandwich',
        'Chicken Soup',
        'Veggie Wrap',
        'Quinoa Salad',
        'Stir Fry',
        'Tacos',
        'Grilled Chicken with Vegetables',
        'Falafel Pita'
    ],
    drink: [
        'Iced Coffee',
        'Green Smoothie',
        'Lemonade',
        'Iced Tea',
        'Fresh Juice',
        'Protein Shake',
        'Hot Chocolate',
        'Espresso',
        'Latte',
        'Matcha Latte',
        'Coconut Water'
    ],
    dinner: [
        'Chicken Stir-Fry',
        'Grilled Salmon and Quinoa',
        'Steak and Potatoes',
        'Lasagna',
        'Fish and Chips',
        'Vegetable Curry',
        'Roast Dinner',
        'Shrimp Paella',
        'Pork Chops',
        'Spaghetti Bolognese',
        'BBQ Ribs',
        'Tofu Stir Fry',
        'Chicken Parmesan',
        'Lamb Stew',
        'Vegetarian Pizza'
    ],
    dessert: [
        'Ice Cream Sundae',
        'Chocolate Cake',
        'Fruit Salad',
        'Cheesecake',
        'Apple Pie',
        'Brownie',
        'Panna Cotta',
        'Raspberry Tart',
        'Creme Brulee',
        'Chocolate Mousse',
        'Strawberry Shortcake',
        'Tiramisu',
        'Lemon Meringue Pie',
        'Carrot Cake',
        'Baklava'
    ]
};

const EVENT_TIME_RANGE = {
    morning: ['07:00', '10:00'],
    afternoon: ['12:00', '15:00'],
    evening: ['18:00', '21:00']
};

const EVENT_IMAGES: Record<EventType, Record<string, string[]>> = FOOD_IMAGES;

function generateMetric(uid: string): IPrimaryMetric {
    return {
        measurement: 'calories',
        value: srngInt(100, 1000, [uid, 'calories'])
    };
}

function generateSecondaryMetric(uid: string): ISecondaryMetric[] {
    return [
        {
            measurement: 'carbs',
            value: srngInt(1, 50, [uid, 'carbs'])
        },
        {
            measurement: 'protein',
            value: srngInt(1, 50, [uid, 'protein'])
        },
        {
            measurement: 'fat',
            value: srngInt(1, 50, [uid, 'fat'])
        }
    ];
}

const generateImages = (eventType: EventType, eventName: string, uid: string) => {
    const maxImages = srngInt(1, 10, [uid, 'numberOfImages']);
    const images = EVENT_IMAGES[eventType][eventName];

    if (!images || images.length === 0) {
        return undefined;
    }

    return images.slice(0, maxImages);
};

function generateEvent(eventType: EventType, partOfDay: PartOfDay, uid: string): IFeedEventProps {
    const name = EVENT_NAMES[eventType][srngInt(0, EVENT_NAMES[eventType].length - 1, [uid, 'name'])];

    const primaryMetric = generateMetric(uid);
    const secondaryMetrics = generateSecondaryMetric(uid);

    const visuals = generateImages(eventType, name, uid);

    const [timeLower, timeUpper] = EVENT_TIME_RANGE[partOfDay].map((time) => parseInt(time));
    const timeRange = timeUpper - timeLower;

    const hour = Math.floor(timeLower + srngInt(0, timeRange, [uid, 'hour']));
    const time = DateTime.now().set({ hour, minute: srngInt(0, 59, [uid, 'minute']), second: 0 });

    const lorem = new LoremIpsumGenerator();
    return {
        type: eventType,
        time: time.toJSDate(),
        location: 'Home (Oxford)',
        rating: srngInt(1, 10, [uid, 'rating']),
        name,
        metrics: {
            primary: primaryMetric,
            secondary: secondaryMetrics
        },
        journal: srngFloat([uid, 'journal']) < 0.8 ? lorem.generate(srngInt(2, 8, [uid, 'lorem']), uid, true) : undefined,
        visuals: srngFloat([uid, 'visuals']) < 0.7 ? visuals : undefined
    };
}

export function generateMockFeedData(days = 30): IFeedData[] {
    return Array.from({ length: days }, (_, index) => {
        const date = DateTime.now().minus({ days: index });

        const events: IFeedEventProps[] = [];

        Object.values(PartOfDay).forEach((partOfDay) => {
            EVENT_TYPES[partOfDay].forEach((eventType) => {
                const uid = `${index}${partOfDay}${eventType}`;

                if (srngFloat([uid, 'event']) > 0.5) {
                    return;
                }

                events.push(generateEvent(eventType, partOfDay, uid));
            });
        });

        return {
            date: date.toJSDate(),
            events
        };
    });
}
