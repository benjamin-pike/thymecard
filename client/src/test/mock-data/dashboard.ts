import { LoremIpsumGenerator } from '@/lib/lorem';
import { DateTime } from 'luxon';
import seedrandom from 'seedrandom';
import { IPrimaryMetric, ISecondaryMetric, IFeedEventProps, IFeedData } from '@/components/dashboard/feed/feed.types';
import { srngFloat, srngInt } from '@/lib/random.utils';
import FOOD_IMAGES from './data/food-images.json'

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

    let data = [];
    let rng = seedrandom(days.toString());

    for (let day = 0; day < days; day++) {
        let date = startDate.minus({ days: day });

        let mealTimes = [BREAKFAST_TIME, LUNCH_TIME, DINNER_TIME, SNACK_TIME];
        let meals = mealTimes.sort(() => rng() - 0.5).slice(0, Math.floor(rng() * 3) + 1);

        for (let mealTime of meals) {
            mealTime = getRandomTimeAround(mealTime, rng);
            let mealDateTime = date.set({ hour: Math.floor(mealTime), minute: Math.floor((mealTime % 1) * 60) });
            data.push({
                time: mealDateTime?.toISO() || '',
                cal: Math.floor(rng() * (EAT_CAL_RANGE[1] - EAT_CAL_RANGE[0])) + EAT_CAL_RANGE[0]
            });
        }

        let exerciseChoices = EXERCISE_TIMES.sort(() => rng() - 0.5).slice(0, Math.floor(rng() * 3) + 1);

        for (let exerciseTime of exerciseChoices) {
            exerciseTime = getRandomTimeAround(exerciseTime, rng);
            let exerciseDateTime = date.set({ hour: Math.floor(exerciseTime), minute: Math.floor((exerciseTime % 1) * 60) });
            data.push({
                time: exerciseDateTime?.toISO() || '',
                cal: -(Math.floor(rng() * (EXERCISE_CAL_RANGE[1] - EXERCISE_CAL_RANGE[0])) + EXERCISE_CAL_RANGE[0])
            });
        }

        while (data.filter((event) => event.time.startsWith(date.toISODate() ?? '')).reduce((a, b) => a + b.cal, 0) > 0) {
            let exerciseDateTime = date.set({ hour: EXERCISE_TIMES[Math.floor(rng() * EXERCISE_TIMES.length)] });
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
    const RECIPES = [
        { name: 'Mediterranean Summer Salad with Lemon-Tahini Dressing', calories: 253 },
        { name: 'Hearty Tuscan Bean Soup with Garlic Croutons', calories: 182 },
        { name: 'Spicy Chipotle Black Bean Burgers', calories: 349 },
        { name: 'Roasted Butternut Squash and Sage Risotto', calories: 401 },
        { name: 'Honey Glazed Salmon with Citrus Avocado Salsa', calories: 505 },
        { name: 'Sesame Ginger Beef Stir-fry with Bok Choy', calories: 457 },
        { name: 'Banana Coconut Bread with Macadamia Nut Crumble', calories: 298 },
        { name: 'Grilled Chicken Skewers with Chimichurri Sauce', calories: 319 },
        { name: 'Decadent Triple Chocolate Fudge Brownies', calories: 448 },
        { name: 'Moroccan Spiced Lamb Tagine with Apricots and Almonds', calories: 552 },
        { name: 'Vegan Quinoa and Black Bean Tacos', calories: 279 },
        { name: 'Lemon Butter Scallops with Zucchini Noodles', calories: 399 },
        { name: 'Spinach and Goat Cheese Stuffed Chicken Breast', calories: 498 },
        { name: 'Baked Eggplant Parmesan with Fresh Basil', calories: 345 },
        { name: 'Garlic Butter Shrimp Pasta with White Wine Sauce', calories: 602 },
        { name: 'Thai Green Curry with Tofu and Vegetables', calories: 308 },
        { name: 'Smoky BBQ Pulled Pork Sandwiches with Coleslaw', calories: 546 },
        { name: 'Cinnamon Swirl Pancakes with Maple Syrup', calories: 247 },
        { name: 'Classic French Coq au Vin with Creamy Polenta', calories: 705 },
        { name: 'Slow Cooked Beef Bourguignon with Roasted Garlic Mashed Potatoes', calories: 797 },
        { name: 'Crispy Orange Chicken with Jasmine Rice', calories: 493 },
        { name: 'Vegetable Paella with Saffron and Olives', calories: 357 },
        { name: 'Grilled Swordfish Steaks with Lemon Herb Butter', calories: 452 },
        { name: 'Sweet Potato and Kale Frittata with Feta', calories: 304 },
        { name: 'Pan-Seared Scallops with Lemon Caper Pasta', calories: 406 },
        { name: 'Vanilla Bean Crème Brûlée with Fresh Berries', calories: 448 },
        { name: 'Spinach and Artichoke Dip Stuffed Bread Rolls', calories: 399 },
        { name: 'Crispy Baked Tofu Bites with Sweet Chili Sauce', calories: 206 },
        { name: 'Pumpkin Spice Latte Cupcakes with Cream Cheese Frosting', calories: 403 },
        { name: 'Rustic Fig and Almond Galette with Honey Drizzle', calories: 498 }
    ];

    let ACTIVITIES = [
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
        'Coconut Water',
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

// const EVENT_IMAGES: Record<EventType, Record<string, string[]>> = {
//     "breakfast": {
//         "Granola with Yogurt": [
//             "https://freshapron.com/wp-content/uploads/2022/05/Yogurt-Granola-Bowl-02.jpg",
//             "https://goodfoodbaddie.com/wp-content/uploads/2022/07/yogurt-with-granola-recipe-1.jpg",
//             "https://thekitchengirl.com/wp-content/uploads/yogurt-with-granola_41-2.jpg",
//             "https://www.simplylowcal.com/wp-content/uploads/2022/11/healthy-homemade-yogurt-parfait.jpg",
//             "https://www.valyastasteofhome.com/wp-content/uploads/2022/03/The-Best-Yogurt-with-Granola-Super-Nutritious-Recipe-4.jpg",
//             "https://suebeehomemaker.com/wp-content/uploads/2022/03/granola-with-yogurt-4.jpg",
//             "https://mycasualpantry.com/wp-content/uploads/2022/07/Greek-Yogurt-with-Granola-and-Fruit-bowl-1200-%C3%97-1200-px.jpg",
//             "https://lacuisinedegeraldine.fr/wp-content/uploads/2020/05/DSC06532-scaled.jpeg",
//             "https://swirlsofflavor.com/wp-content/uploads/2022/01/Fruit-Yogurt-Parfait-Horizontal-1-scaled.jpg",
//             "https://dailydish.co.uk/wp-content/uploads/2023/04/yogurt-granola-breakfast-bowl-healthy.jpg"
//         ],
//         "French Toast": [
//             "https://www.simplyrecipes.com/thmb/b48moNCTtaUYEc1Qyxhe9V66XKc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-French-Toast-Lead-Shot-3b-c3a68a576a9548f5bd43cce3d2d7f4b7.jpg",
//             "https://www.thespruceeats.com/thmb/MDioJIXM7Yaw5ZtJhzhG5wiO05Y=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/SES-basic-french-toast-3056820-hero-01-6ed70ff7901a4e64995d890b03946ac0.jpg",
//             "https://www.allrecipes.com/thmb/Bp5HWGuXlA8DkdfH2RUezI3S8fk=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/7016-french-toast-i-DDMFS-4x3-26c468d9cb284c2c83432bf2d33d49f8.jpg",
//             "https://d1e3z2jco40k3v.cloudfront.net/-/media/project/oneweb/mccormick-us/mccormick/recipe-images/quick_and_easy_french_toast_new_800x800.webp?rev=472bd38acf3f4e80b329915ba486cae1&vd=20220809T202043Z&hash=34381AE86E477B12B64277F710290F21",
//             "https://hips.hearstapps.com/hmg-prod/images/how-to-make-french-toast-1589827448.jpg?crop=0.734xw:0.490xh;0.0897xw,0.323xh&resize=1200:*",
//             "https://tastesbetterfromscratch.com/wp-content/uploads/2022/09/French-Toast-1.jpg",
//             "https://www.allrecipes.com/thmb/9cOa4DNn29P1rM7oNOrcaHjZVN4=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/2232840-cinnamon-accented-french-toast-Gina-Thiriot-4x3-1-b55614551731406a860fb065d83fd3a7.jpg",
//             "https://hips.hearstapps.com/hmg-prod/images/delish-230308-french-toast-055-rv-index-641c84040274d.jpg?crop=0.8896xw:1xh;center,top&resize=1200:*",
//             "https://amandascookin.com/wp-content/uploads/2022/10/French-Toast-RCSQ.jpg",
//             "https://thebakermama.com/wp-content/uploads/2021/01/IMG_8512-scaled.jpg"
//         ],
//         "Blueberry Pancakes": [
//             "https://cafedelites.com/wp-content/uploads/2020/05/Blueberry-Pancakes-IMAGE-75.jpg",
//             "https://www.allrecipes.com/thmb/ecb0XKvcrE7OyxBLX3OVEd30TbE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/686460-todds-famous-blueberry-pancakes-Dianne-1x1-1-9bd040b975634bce884847ce2090de16.jpg",
//             "https://pinchofyum.com/wp-content/uploads/Blueberry-Pancakes-Feature-1.jpg",
//             "https://recipetineats.com/wp-content/uploads/2019/01/Blueberry-Pancakes_8.jpg",
//             "https://www.tablefortwoblog.com/wp-content/uploads/2023/01/blueberry-pancakes-recipe-photo-tablefortwoblog-11-scaled.jpg",
//             "https://www.inspiredtaste.net/wp-content/uploads/2019/02/Easy-Homemade-Blueberry-Pancakes-Recipe-2-1200.jpg",
//             "https://www.recipegirl.com/wp-content/uploads/2007/07/Blueberry-Pancakes-1.jpeg",
//             "https://www.everyday-delicious.com/wp-content/uploads/2022/03/DSC_3274.jpg",
//             "https://blueberry.org/wp-content/uploads/2021/04/Blueberry-Pancakes-052_940x1409.jpg",
//             "https://cdn.apartmenttherapy.info/image/upload/f_jpg,q_auto:eco,c_fill,g_auto,w_1500,ar_1:1/k%2FPhoto%2FRecipe%20Ramp%20Up%2F2021-08-Blueberry-Pancakes%2FIMG_3868_01"
//         ],
//         "Fruit Salad": [
//             "https://www.allrecipes.com/thmb/pXqfb4xf-T3a-trkKdu-SCfC1hI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/2289556-0981629410f0446d9bec11f0a9ece43c.jpg",
//             "https://hips.hearstapps.com/hmg-prod/images/pasta-salad-horizontal-jpg-1522265695.jpg?crop=0.6668xw:1xh;center,top&resize=1200:*",
//             "https://fitfoodiefinds.com/wp-content/uploads/2020/05/salad-1.jpg",
//             "https://www.cookingclassy.com/wp-content/uploads/2019/05/fruit-salad-2.jpg",
//             "https://shwetainthekitchen.com/wp-content/uploads/2021/08/Fruit-Salad-with-Condensed-Milk.jpg",
//             "https://cheflolaskitchen.com/wp-content/uploads/2022/08/fruit-salad-10.jpg",
//             "https://www.southernliving.com/thmb/5VE-k5Gb1faNUAN4fU8nFi_YX9Q=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Southern-Living-Cheesecake_Fruit_Salad_005-a8903364d8424303b6235a4e6c7a6572.jpg",
//             "https://www.themediterraneandish.com/wp-content/uploads/2023/02/Winter-Fruit-Salad_9.jpg",
//             "https://i0.wp.com/kristineskitchenblog.com/wp-content/uploads/2020/06/fruit-salad-1200-2382.jpg?fit=1200%2C1800&ssl=1",
//             "https://herbsandflour.com/wp-content/uploads/2019/11/Summer-Fruit-Salad.jpg"
//         ],
//         "Omelette": [
//             "https://joyfoodsunshine.com/wp-content/uploads/2022/07/best-omelette-recipe-1.jpg",
//             "https://www.onceuponachef.com/images/2021/12/Omelette-1200x1626.jpg",
//             "https://downshiftology.com/wp-content/uploads/2021/12/How-to-Make-an-Omelette-main-1.jpg",
//             "https://www.simplyrecipes.com/thmb/LLhiA8KZ7JZ5ZI0g-1bF1eg-gGM=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__simply_recipes__uploads__2018__10__HT-Make-an-Omelet-LEAD-HORIZONTAL-17cd2e469c4a4ccbbd1273a7cae6425c.jpg",
//             "https://www.recipegirl.com/wp-content/uploads/2007/06/Avocado-Manchego-Cheese-Omelette-1.jpeg",
//             "https://www.seriouseats.com/thmb/5oPmAF7IggGPRKSmqtccGeeR_-M=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__serious_eats__seriouseats.com__2020__06__20200602-western-denver-omelette-daniel-gritzer-8-20ef3336fd4b44f68987badfde08a71a.jpg",
//             "https://www.mygorgeousrecipes.com/wp-content/uploads/2018/02/Worlds-Best-Vegetarian-Omelette-Quick-and-Easy.jpg",
//             "https://hurrythefoodup.com/wp-content/uploads/2015/03/easy-omelette-recipe-recipe-card-image.jpg",
//             "https://www.indianhealthyrecipes.com/wp-content/uploads/2021/06/cheese-omelette-mozarella-omelette.jpg",
//             "https://easyhealthyrecipes.com/wp-content/uploads/2022/05/Avocado-Omelette-8.jpg"
//         ],
//         "Smoothie": [
//             "https://hips.hearstapps.com/hmg-prod/images/delish-how-to-make-a-smoothie-horizontal-1542310071.png?crop=1xw:0.843328335832084xh;center,top",
//             "https://images.immediate.co.uk/production/volatile/sites/30/2022/12/Smoothie-bowl-16df176.jpg",
//             "https://www.allrecipes.com/thmb/nXTnAdimMBtkQieZhloU45cM1V0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/441727-fruit-and-yogurt-smoothie-Alberta-Rose-4x3-1-aa04390dac11483aaeeec142dff1f6c7.jpg",
//             "https://www.evolvingtable.com/wp-content/uploads/2022/12/How-to-Make-Smoothie-1.jpg",
//             "https://feelgoodfoodie.net/wp-content/uploads/2018/01/Smoothie-Bowls-3-ways-10.jpg",
//             "https://www.sweetandsavorybyshinee.com/wp-content/uploads/2022/04/Rainbow-Smoothie-4.jpg",
//             "https://www.eatingwell.com/thmb/KCDDSEVOd4pRYoDokPJ4cUuwLxI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/EWL-57793-berry-kefir-smoothie-Hero-01-A-ae9e20c50f1843928b81c102bfa80b4c.jpg",
//             "https://littlesunnykitchen.com/wp-content/uploads/2022/07/Berry-Smoothie-1.jpg",
//             "https://cookingformysoul.com/wp-content/uploads/2022/05/triple-berry-smoothie-feat-min.jpg",
//             "https://feelgoodfoodie.net/wp-content/uploads/2016/10/Coffee-Smoothie-05.jpg"
//         ],
//         "Avocado Toast": [
//             "https://www.eatingwell.com/thmb/CTSAuY2CRbo0Ivw4wbfIydhy7Qw=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/1807w-avocado-toast-recipe-8029771-2000-aefaa92c11e74e80b0bfc15788a61465.jpg",
//             "https://www.spendwithpennies.com/wp-content/uploads/2022/09/Avocado-Toast-SpendWithPennies-4.jpg",
//             "https://cdn.loveandlemons.com/wp-content/uploads/2020/01/avocado-toast.jpg",
//             "https://www.thespruceeats.com/thmb/dfa8Uq14SlF33FCAsPbDZVHp9bE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/avocado-toast-4174244-hero-03-d9d005dc633f44889ba5385fe4ebe633.jpg",
//             "https://whatsgabycooking.com/wp-content/uploads/2023/01/Master.jpg",
//             "https://hips.hearstapps.com/hmg-prod/images/avocado-toast-recipe-2-6446eccb127f2.jpg?crop=0.8888888888888888xw:1xh;center,top&resize=1200:*",
//             "https://simplyfreshfoodie.com/wp-content/uploads/2021/08/DSC_0546.jpg",
//             "https://feelgoodfoodie.net/wp-content/uploads/2019/01/Avocado-Toast-with-Egg-9.jpg",
//             "https://www.billyparisi.com/wp-content/uploads/2023/02/avocado-toast1.jpg",
//             "https://www.orchidsandsweettea.com/wp-content/uploads/2022/07/Avocado-Toast-6-of-7-e1658127792371.jpg"
//         ],
//         "Eggs Benedict": [
//             "https://static.onecms.io/wp-content/uploads/sites/43/2022/10/13/17205-eggs-benedict-beauty-4x3-BP-2828.jpg",
//             "https://upload.wikimedia.org/wikipedia/commons/2/24/Traditional_Eggs_Benedict.jpg",
//             "https://www.simplyrecipes.com/thmb/XSpHSUt6_YkCXJ-1ZRp5HfbZoWw=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__simply_recipes__uploads__2010__04__eggs-benedict-horiz-a-1600-6f8850c8046b412b940fb1d657a5ba9a.jpg",
//             "https://www.foodandwine.com/thmb/j6Ak6jECu0fdly1XFHsp4zZM8gQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Eggs-Benedict-FT-RECIPE0123-4f5f2f2544464dc89a667b5d960603b4.jpg",
//             "https://sailorbailey.com/wp-content/uploads/2021/02/Untitled-design-99.jpg",
//             "https://img.jamieoliver.com/jamieoliver/recipe-database/oldImages/large/1436_1_1425380027.jpg?tr=w-800,h-1066",
//             "https://static01.nyt.com/images/2021/04/30/dining/ar-eggs-benedict/ar-eggs-benedict-threeByTwoMediumAt2X.jpg",
//             "https://tatyanaseverydayfood.com/wp-content/uploads/2019/03/Smoked-Salmon-Eggs-Benedict-recipe.jpg",
//             "https://tastesbetterfromscratch.com/wp-content/uploads/2013/08/Eggs-Benedict-11.jpg",
//             "https://www.unileverfoodsolutions.com.au/dam/global-ufs/mcos/anz/calcmenu/recipe/eggs-benedict-with-rosti-hot-smoked-salmon-and-saffron-hollandaise/eggs-benedict-with-rosti-hot-smoked-salmon-and-saffron-hollandaise-main-header.jpg"
//         ],
//         "Cereal with Milk": [
//             "https://npr.brightspotcdn.com/dims4/default/8a456cf/2147483647/strip/true/crop/1000x667+0+0/resize/880x587!/quality/90/?url=http%3A%2F%2Fnpr-brightspot.s3.amazonaws.com%2Flegacy%2Fsites%2Fkera%2Ffiles%2F201811%2Fcereal___milk.jpg",
//             "https://i0.wp.com/images-prod.healthline.com/hlcmsresource/images/AN_images/are-breakfast-cereals-healthy-1296x728-feature.jpg?w=1155&h=1528",
//             "https://thedairyalliance.com/wp-content/uploads/2023/02/cereal-and-milk-engin-akyurt-hGsq0aOZM_w-unsplash-scaled.jpg",
//             "https://thedairyalliance.com/wp-content/uploads/2018/02/Cereal-and-milk.jpg",
//             "https://img.livestrong.com/-/clsd/getty/c160c509dea0437691e10cf181fa4cb8.jpg",
//             "https://mydeliciousmonster.com/wp-content/uploads/2021/03/56-768x1024.png",
//             "https://www.mashed.com/img/gallery/the-real-reason-you-should-save-your-cereal-milk/intro-1592085786.jpg",
//             "https://cdn.britannica.com/25/231225-050-B0EB1747/Little-girl-eating-breakfast-cereal.jpg",
//             "https://assets.entrepreneur.com/content/3x2/2000/1604438191-GettyImages-1196669768.jpg",
//             "https://www.portablepress.com/wp-content/uploads/2014/04/CerealAndMilk_DS.jpg"
//         ],
//         "Toast with Jam": [
//             "https://i.guim.co.uk/img/media/2c0f1c8633ebcf4d53de7ec770ca79240f14b1b6/0_733_3647_4559/master/3647.jpg?width=700&quality=85&auto=format&fit=max&s=6c08bbede0b99296a30c81f5b15056bf",
//             "https://www.kingarthurbaking.com/sites/default/files/styles/featured_image/public/2020-05/Buttered%20toast%20and%20jam-3.jpg?itok=DANTWJO6",
//             "https://www.sidechef.com/recipe/b9a61979-3b4f-4378-b058-db25d386374b.jpeg?d=1408x1120",
//             "https://www.kingarthurbaking.com/sites/default/files/inline-images/Buttered%20toast%20and%20jam-7.jpg",
//             "https://www.bakelshomebaking.com/wp-content/uploads/2015/09/Good-Old-Jam-on-Toast-1-Large.jpg",
//             "https://metahealthcare.co.uk/wp-content/uploads/2020/11/jam-on-toast.jpg",
//             "https://www.weightlossresources.co.uk/pimg/wlr/j/jam-and-fresh-strawberries-on-toast-article.jpg",
//             "https://media.eggs.ca/assets/RecipePhotos/_resampled/FillWyIxMjgwIiwiNzIwIl0/French-Toast-with-Cheese-CMS.jpg",
//             "https://www.sidechef.com/recipe/75f59ce9-a167-41e0-be66-cda880ab4f16.jpg?d=1408x1120",
//             "https://potatorolls.com/wp-content/uploads/2017/03/Grape-Jelly_med.jpg"
//         ],
//         "Bagel with Cream Cheese": [
//             "https://www.foodiecrush.com/?attachment_id=49296",
//             "https://media.newyorker.com/photos/5d13d9c28be7a80008baaf21/master/w_2560%2Cc_limit/Zeller-Cream-Cheese.jpg",
//             "https://www.deliciousmagazine.co.uk/wp-content/uploads/2021/03/960x1200-DEL-Q1-2021-007-SMOKED_SALMON_BAGEL_01-768x960.jpg",
//             "https://berryworld.imgix.net/assets/Toasted-Bagels-with-BerryWorld-Strawberries-Honey-and-Cream-Cheese.jpg?auto=format&crop=focalpoint&fit=crop&fp-x=0.5&fp-y=0.5&h=1500&ixlib=php-3.1.0&q=60&v=1535099253&w=2300",
//             "https://images.eatthismuch.com/img/867492_themalvoso_15dcfb07-d551-46b8-a7d4-48792cad1ddf.png",
//             "https://www.jocooks.com/wp-content/uploads/2021/06/salmon-cream-cheese-bagel-1-8.jpg",
//             "https://www.biggerbolderbaking.com/wp-content/uploads/2020/04/Homemade-Cream-Cheese-Flavors-WS-Thumbnail.jpg",
//             "https://healthyfitnessmeals.com/wp-content/uploads/2019/05/Keto_Parmesan_Everything_Bagel_Square_0001.jpg"
//         ],
//         "Protein Shake": [
//             "https://fitfoodiefinds.com/wp-content/uploads/2020/01/sq.jpg",
//             "https://tastesbetterfromscratch.com/wp-content/uploads/2023/01/Vanilla-Protein-Shake-1.jpg",
//             "https://i.guim.co.uk/img/media/03ac0259bc751c9b186d9f5f71cefd36b051ae76/0_198_2254_2060/master/2254.jpg?width=620&quality=85&auto=format&fit=max&s=3e500adfdb5ec3aeeeeb0c14f8d1e38e",
//             "https://tastesbetterfromscratch.com/wp-content/uploads/2023/01/Chocolate-Protein-Shake-Web-5.jpg",
//             "https://www.thespruceeats.com/thmb/dTA-yuJdk0FyaAPaI-TyHwcdTUk=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/peanut-butter-chocolate-protein-shake-428374-hero-01-8b4bb631d6f64ff78c8623167ea56a03.jpg",
//             "https://www.everydayeasyeats.com/wp-content/uploads/2020/08/Vanilla-Protein-Shake.jpg",
//             "https://feelgoodfoodie.net/wp-content/uploads/2017/02/strawberry-protein-smoothie-04.jpg",
//             "https://www.everydayeasyeats.com/wp-content/uploads/2020/07/Chocolate-Protein-Shake-1.jpg",
//             "https://www.asweetpeachef.com/wp-content/uploads/2021/07/BlueberryProteinShake-6.jpg",
//             "https://www.asweetpeachef.com/wp-content/uploads/2014/09/banana-protein-shake.jpg"
//         ],
//         "Porridge with Berries": [
//             "https://food-images.files.bbci.co.uk/food/recipes/porridge_with_berries_50767_16x9.jpg",
//             "https://www.throughthefibrofog.com/wp-content/uploads/2022/04/berry-porridge-3.jpg",
//             "https://berryworld.imgix.net/assets/berry-best-porridge-recipe.jpg?auto=format&crop=focalpoint&fit=crop&fp-x=0.5&fp-y=0.5&h=1500&ixlib=php-3.1.0&q=60&v=1535100663&w=2300",
//             "https://realfood.tesco.com/media/images/spiced-super-berry-porridge-1400x919-24-71476d44-9813-45bc-a695-f989a41c3f70-0-1400x919.jpg",
//             "https://goop-img.com/wp-content/uploads/2020/12/20201204_Editorial_Food_Detox-Food-Shoot-2021_FONIO-BREAKFAST-PORRIDGE-WITH-BERRIES-AND-NUTS_051.jpg",
//             "https://thehealthytart.com/wp-content/uploads/2018/01/Porridge-with-Berries-and-Seeds_overhead.jpg",
//             "https://realfood.tesco.com/media/images/Seven-grain-porridge-LGH-2be12108-b3ab-48a4-b07a-b87770754a92-0-1400x919.jpg",
//             "https://www.deliciousmagazine.co.uk/wp-content/uploads/2018/11/HFG-25_LR-768x960.jpg",
//             "https://domesticgothess.com/wp-content/uploads/2018/05/banana-porridge-with-blueberry-compote.jpg",
//             "https://img.delicious.com.au/n-N8_rJe/del/2018/08/gluten-free-porridge-with-berries-84877-2.jpg"
//         ],
//         "Quiche": [
//             "https://sallysbakingaddiction.com/wp-content/uploads/2019/04/quiche.jpg",
//             "https://images.immediate.co.uk/production/volatile/sites/30/2022/06/Ultimate-quiche-lorraine-62cec18.jpg?resize=960,872",
//             "https://static.onecms.io/wp-content/uploads/sites/43/2023/01/30/46570-basic-quiche-by-shelly-ddmfs-3X4-0075.jpg",
//             "https://media.houseandgarden.co.uk/photos/6189479a8373470f8394e2e1/16:9/w_1920,h_1080,c_limit/mary-berry-vogue-2-25jun13-pr_bt.jpg",
//             "https://www.evolvingtable.com/wp-content/uploads/2021/12/Mini-Quiche-27-1.jpg",
//             "https://cdn.apartmenttherapy.info/image/upload/f_auto,q_auto:eco,c_fill,g_auto,w_1500,ar_3:2/k%2FPhoto%2FRecipes%2F2021-04-how-to-quiche-reshoot%2F2021-04-13_ATK-51126",
//             "https://www.ifyougiveablondeakitchen.com/wp-content/uploads/2023/03/easy-muffin-tin-quiche.jpg",
//             "https://www.recipetineats.com/wp-content/uploads/2019/09/Mini-Quiches-Featured-photo.jpg",
//             "https://www.culinaryhill.com/wp-content/uploads/2021/05/Mini-Quiche-4-Ways-Culinary-Hill-1200x800-1.jpg",
//             "https://images-gmi-pmc.edge-generalmills.com/00675bc4-6088-4c8b-9a60-fad7509cf86c.jpg"
//         ],
//         "Croissant": [
//             "https://upload.wikimedia.org/wikipedia/commons/2/28/2018_01_Croissant_IMG_0685.JPG",
//             "https://static01.nyt.com/images/2021/04/07/dining/06croissantsrex1/merlin_184841898_ccc8fb62-ee41-44e8-9ddf-b95b198b88db-articleLarge.jpg",
//             "https://www.debic.com/sites/default/files/recipe/5ec30000-66dc-6a13-b9cd-08d8e9ed7eb1.jpg",
//             "https://images.prismic.io/allplants-cms-prod/4d41a068-003a-45f5-8f54-539c4486d914_202006_Croissants-resize.jpg?auto=compress,format&w=1000&h=1000&fit=crop",
//             "https://breadsandsweets.com/wp-content/uploads/2021/08/croissant-blog-2.jpg",
//             "https://www.allrecipes.com/thmb/umNXK2x2E144GBZVzOxUkfg0VYo=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/6916_Croissants_ddmfs_3x4_3880-247a81a8597748cd8381d00f8ae31d36.jpg",
//             "https://static.independent.co.uk/2021/04/09/14/newFile-3.jpg?quality=75&width=1200&auto=webp",
//             "https://wgbh.brightspotcdn.com/dims4/default/7b58d91/2147483647/strip/true/crop/6000x4000+0+0/resize/6000x4000!/quality/70/?url=https%3A%2F%2Fwgbh-brightspot.s3.amazonaws.com%2Fcf%2F63%2Fd47657444e02a472515760939f73%2Fshutterstock-642373528.jpg",
//             "https://www.lbpbakeries.com/wp-content/uploads/2020/11/67460-pack-scaled.jpg",
//             "https://cdn.britannica.com/65/235965-050-A5D740E2/Croissants-jar-of-jam.jpg"
//         ]
//     },
//     "snack": {
//         "Mixed Nuts": [
//             "https://www.dorri.co.uk/wp-content/uploads/2018/09/raw_mixed_nuts.jpeg",
//             "https://m.media-amazon.com/images/I/91AYYQfFxsL.jpg",
//             "https://aldprdproductimages.azureedge.net/media/$Aldi_GB/26.04.23/4088600272689_0.jpg",
//             "https://www.forestwholefoods.co.uk/wp-content/uploads/2016/09/Organic-Deluxe-Mixed-Nuts-Pieces-1kg.jpg",
//             "https://m.media-amazon.com/images/I/61kwUJlDDLL.jpg",
//             "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/the-health-benefits-of-nuts-main-image-700-350-bb95ac2.jpg?quality=90&resize=960,872",
//             "https://shopzero.co.uk/wp-content/uploads/2020/04/Mixed-nuts-scaled.jpg",
//             "https://www.nutsinbulk.co.uk/files/items/mixed/mixed_nuts_without_peanuts.jpg",
//             "https://cdn.shopify.com/s/files/1/1087/1374/products/SaltedNutMixPots_561fe657-29a2-4280-b0b8-933efb559c5f.jpg?v=1654071175",
//             "https://healthylittlepeach.com/wp-content/uploads/2019/02/IMG_2383-5.jpg"
//         ],
//         "Fresh Fruit": [
//             "https://www.pcrm.org/sites/default/files/Fresh%20Fruit_0.jpg",
//             "https://tastesbetterfromscratch.com/wp-content/uploads/2015/04/Fruit-Salad-1.jpg",
//             "https://www.spendwithpennies.com/wp-content/uploads/2019/04/Fruit-Salad-SWP.jpg",
//             "https://hips.hearstapps.com/hmg-prod/images/assortment-of-colorful-ripe-tropical-fruits-top-royalty-free-image-995518546-1564092355.jpg",
//             "https://food.unl.edu/newsletters/images/fresh-fruit.-colorful.jpg",
//             "https://iambaker.net/wp-content/uploads/2013/04/fruitfreshdirect.jpg",
//             "https://www.momontimeout.com/wp-content/uploads/2021/06/fruit-salad-square.jpeg",
//             "https://cdn.apartmenttherapy.info/image/upload/f_jpg,q_auto:eco,c_fill,g_auto,w_1500,ar_16:9/k%2Farchive%2F8cc896a79fec4b374c76136cfe5b5045c7d2d92c",
//             "https://officefruit.ie/wp-content/uploads/2016/07/fruit-delivered-1080x675.jpg",
//             "https://www.safefood.net/Safefood/media/Safefood/Recipes/fruit_salad_1000.jpg?ext=.jpg"
//         ],
//         "Yogurt": [
//             "https://www.alphafoodie.com/wp-content/uploads/2022/11/Natural-Yogurt-square.jpeg",
//             "https://www.daringgourmet.com/wp-content/uploads/2021/01/How-to-Make-Yogurt-7.jpg",
//             "https://www.seriouseats.com/thmb/W7HjvRJOBOMn7ly6F6lIOrE_JfY=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__serious_eats__seriouseats.com__2019__06__20190614-yogurt-vicky-wasik-8-1b8381eea1b44c17ac31879c11e6c624.jpg",
//             "https://assets.bonappetit.com/photos/63b5fe187015aa59a8e880ac/3:2/w_4031,h_2687,c_limit/010323-its-greek-yogurt-taste-test-01.jpg",
//             "https://thegreekfoodie.com/wp-content/uploads/2021/08/How_to_make_greek_yogurt_SQ.jpg",
//             "https://cdn.shopify.com/s/files/1/1045/6708/articles/lactose_free_yogurt_06_1600x.png?v=1591839460",
//             "https://tastesbetterfromscratch.com/wp-content/uploads/2020/05/Instant-Pot-Yogurt-14.jpg",
//             "https://cdn.shopify.com/s/files/1/1045/6708/articles/greek_yogurt_05_1600x.png?v=1589777919",
//             "https://static01.nyt.com/images/2018/07/18/dining/18YOGURT1/18YOGURT1-superJumbo.jpg",
//             "https://bcdairy.ca/wp-content/uploads/2022/07/history-of-yogurt-feature-1024x682.jpg"
//         ],
//         "Granola Bar": [
//             "https://cdn.loveandlemons.com/wp-content/uploads/2020/05/granola-bars.jpg",
//             "https://www.inspiredtaste.net/wp-content/uploads/2019/08/Homemade-Granola-Bar-Recipe-1200.jpg",
//             "https://domesticgothess.com/wp-content/uploads/2016/01/No-bake-superfood-granola-bars-chewy-filling-and-super-healthy-granola-bars-packed-full-of-seeds-nuts-dried-fruit-oats-and-dark-chocolate.jpg",
//             "https://i2.wp.com/www.downshiftology.com/wp-content/uploads/2022/08/Granola-Bars-main-1.jpg",
//             "https://choosingchia.com/jessh-jessh/uploads/2022/08/homemade-healthy-granola-bars-8.jpg",
//             "https://feelgoodfoodie.net/wp-content/uploads/2022/01/Honey-Oat-Granola-Bars-13.jpg",
//             "https://www.wellplated.com/wp-content/uploads/2014/02/Almond-Orange-Healthy-Granola-Bars-with-Coconut-and-Honey.jpg",
//             "https://www.onceuponachef.com/images/2011/05/Homemade-Granola-Bars_.jpg",
//             "https://tmbidigitalassetsazure.blob.core.windows.net/rms3-prod/attachments/37/1200x1200/Honey-Oat-Granola-Bars_EXPS_BOBBZ22_38126_B10_06_1b.jpg",
//             "https://thehappyfoodie.co.uk/wp-content/uploads/2023/03/223_Fruity_granolabars-scaled.jpg"
//         ],
//         "Cheese and Crackers": [
//             "https://upload.wikimedia.org/wikipedia/commons/8/81/HK_CWB_%E9%A6%99%E6%B8%AF%E6%80%A1%E6%9D%B1%E9%85%92%E5%BA%97_Excelsior_Hotel_Cheese_Biscuit_Dec-2011.jpg",
//             "https://static01.nyt.com/images/2021/11/16/dining/21mag-eat-site/21mag-eat-site-superJumbo-v4.jpg",
//             "https://supermancooks.com/wp-content/uploads/2016/02/savory-three-cheese-crackers2F.jpg",
//             "https://adventuresofmel.com/wp-content/uploads/2022/12/Apple-Cheese-and-Crackers.jpg",
//             "https://julieblanner.com/wp-content/uploads/2020/10/best-cheese-and-crackers.jpeg",
//             "https://publish.purewow.net/wp-content/uploads/sites/2/2017/03/cheddar-club-crackers.jpg?fit=728%2C524",
//             "https://www.dinneratthezoo.com/wp-content/uploads/2020/12/cheese-board-5.jpg",
//             "https://www.thespruceeats.com/thmb/wvps-ZwSzJJncrnH8nQpeEJNOtg=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-600599843-57eb2de15f9b586c358bf4fb.jpg",
//             "https://digitalcontent.api.tesco.com/v2/media/ghs/7a96b807-601b-405e-9e9a-94d5ebca5d37/53693e57-a645-4fa6-bd95-90de26576dc6_308394947.jpeg?h=960&w=960",
//             "https://www.bhg.com/thmb/pwmgwGXJfQgApABTFIAVZ3IKXx4=/1200x0/filters:no_upscale():strip_icc()/blue-diamond-variety-of-crackers-with-toppings-6f5ff731-c331645c3a4a48f7b60df822bc0ccdb1.jpg"
//         ],
//         "Smoothie": [
//             "https://hips.hearstapps.com/hmg-prod/images/delish-how-to-make-a-smoothie-horizontal-1542310071.png?crop=1xw:0.843328335832084xh;center,top",
//             "https://images.immediate.co.uk/production/volatile/sites/30/2022/12/Smoothie-bowl-16df176.jpg",
//             "https://www.allrecipes.com/thmb/nXTnAdimMBtkQieZhloU45cM1V0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/441727-fruit-and-yogurt-smoothie-Alberta-Rose-4x3-1-aa04390dac11483aaeeec142dff1f6c7.jpg",
//             "https://www.evolvingtable.com/wp-content/uploads/2022/12/How-to-Make-Smoothie-1.jpg",
//             "https://feelgoodfoodie.net/wp-content/uploads/2018/01/Smoothie-Bowls-3-ways-10.jpg",
//             "https://www.sweetandsavorybyshinee.com/wp-content/uploads/2022/04/Rainbow-Smoothie-4.jpg",
//             "https://www.eatingwell.com/thmb/KCDDSEVOd4pRYoDokPJ4cUuwLxI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/EWL-57793-berry-kefir-smoothie-Hero-01-A-ae9e20c50f1843928b81c102bfa80b4c.jpg",
//             "https://littlesunnykitchen.com/wp-content/uploads/2022/07/Berry-Smoothie-1.jpg",
//             "https://cookingformysoul.com/wp-content/uploads/2022/05/triple-berry-smoothie-feat-min.jpg",
//             "https://hips.hearstapps.com/hmg-prod/images/healthy-smoothie-recipes-1641854658.jpg?crop=1.00xw:0.326xh;0,0.478xh&resize=1200:*"
//         ],
//         "Rice Cakes": [
//             "https://healthynibblesandbits.com/wp-content/uploads/2020/05/Asian-Rice-Cakes-FF.jpg",
//             "https://mykoreankitchen.com/wp-content/uploads/2021/03/1.-Garaetteok.jpg",
//             "https://i.guim.co.uk/img/media/882145af4af08be253fa5e78bbc461b1f1b79369/0_1833_3800_2279/master/3800.jpg?width=1200&height=900&quality=85&auto=format&fit=crop&s=69ce819e83a73f54f92d67a0e663ef5c",
//             "https://www.eatthis.com/wp-content/uploads/sites/4/media/images/ext/736176881/rice-cakes-plate.jpg?quality=82&strip=1",
//             "https://img.taste.com.au/0mjYdE-a/w720-h480-cfill-q80/taste/2016/11/barbecued-japanese-rice-cakes-onigiri-110057-1.jpeg",
//             "https://cdn.veganrecipeclub.org.uk/wp-content/uploads/2021/01/ricecakes2-1568x1122.jpg",
//             "https://lovekoreanfood.com/wp-content/uploads/2021/11/IMG_8023.jpg",
//             "https://aldprdproductimages.azureedge.net/media/$Aldi_GB/31.10.22/4088600526010_0.jpg",
//             "https://healthynibblesandbits.com/wp-content/uploads/2020/05/Asian-Rice-Cakes-3.jpg",
//             "https://www.thespruceeats.com/thmb/NiReVXXEUTiIYM3-QkoZcnb3orM=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/pan-fried-rice-cakes-2031316-steps-09-252c63f2efe1401ba2d0775620b68f6a.JPG"
//         ],
//         "Trail Mix": [
//             "https://therecipecritic.com/wp-content/uploads/2021/07/trailmix.jpg",
//             "https://grabthemangos.com/wp-content/uploads/2022/03/easter-trail-mix-21.jpg",
//             "https://www.eatingbirdfood.com/wp-content/uploads/2022/11/superfood-trail-mix-hero.jpg",
//             "https://i0.wp.com/post.healthline.com/wp-content/uploads/2021/04/trail-mix-snack-1296x728-header.jpeg?w=1155&h=1528",
//             "https://www.thecountrycook.net/wp-content/uploads/2021/10/thumbnail-Fall-Harvest-Trail-Mix-scaled.jpg",
//             "https://cdn.apartmenttherapy.info/image/upload/f_jpg,q_auto:eco,c_fill,g_auto,w_1500,ar_4:3/cs%2F2019%2Fk%2FCalifornia%20Walnuts%2FTrail%20Mix%2F9O4A9922_CC",
//             "https://www.iheartnaptime.net/wp-content/uploads/2022/03/I-Heart-Naptime-trail-mix-recipe-4.jpg",
//             "https://upload.wikimedia.org/wikipedia/commons/9/91/Gorp.jpg",
//             "https://greensnchocolate.com/wp-content/uploads/2022/09/Fall-Trail-Mix-3.jpg",
//             "https://www.eatingbirdfood.com/wp-content/uploads/2020/09/trail-mix-3-ways-white-bowls.jpg"
//         ],
//         "Protein Bar": [
//             "https://www.pulsin.co.uk/Images/Product/Default/large/Cookie_Dough_Protein_Bar.png",
//             "https://cdn.shopify.com/s/files/1/1756/4657/products/Combined_Mockups_x515_2x-min.png?v=1615294105",
//             "https://images.immediate.co.uk/production/volatile/sites/30/2022/04/Reviews-background-2-f880dab.jpg",
//             "https://www.costco.co.uk/medias/sys_master/images/hd6/h41/33778912296990.jpg",
//             "https://tastesbetterfromscratch.com/wp-content/uploads/2022/03/Protein-Bars-High-Res-9-scaled.jpg",
//             "https://static.independent.co.uk/2022/05/20/09/Protein%20bars%20copy.jpg?quality=75&width=1200&auto=webp",
//             "https://homeandkind.com/wp-content/uploads/2023/03/protein-bar-square-1.png",
//             "https://thebigmansworld.com/wp-content/uploads/2022/06/protein-bars-recipe.jpg",
//             "https://www.naturevalley.co.uk/wp-content/uploads/sites/3/2022/01/protein-salted-caramel-nut-banner-1.png",
//             "https://cdn.shopify.com/s/files/1/0577/3210/4377/products/chocolate_caramel.jpg?v=1624892553"
//         ],
//         "Apple Slices with Peanut Butter": [
//             "https://www.eatingwell.com/thmb/eF1v8KGKkfzDY5M2PQ7Vviews3M=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/5553477-29d410e04ee149908c2c7d2f074d91e5.jpg",
//             "https://images.heb.com/is/image/HEBGrocery/recipe-hm-large/apple-slices-with-peanut-butter-snack-recipe.jpg",
//             "https://www.forkintheroad.co/wp-content/uploads/2023/03/apple-slices-peanut-butter-snack-124.jpg",
//             "https://www.everydayeileen.com/wp-content/uploads/2022/07/apple-slices-with-peanut-butter-1.jpg",
//             "https://www.forkintheroad.co/wp-content/uploads/2023/03/apple-slices-peanut-butter-snack-123.jpg",
//             "https://www.savoryonline.com/app/uploads/recipes/232658/apple-slices-with-peanut-butteryogurt-dip.jpg",
//             "https://healthyeatinghub.com.au/wp-content/uploads/2017/03/IMG_6536.jpg",
//             "https://www.healthylittlefoodies.com/wp-content/uploads/2014/01/apple-peanutbutter-sandwich-square.jpg",
//             "https://static.diabetesfoodhub.org/system/thumbs/system/images/recipes/1903-diabetic-snack-peanut-butter-cranberry-walnnut-apples_create-your-plate_022020_3885281428.jpg",
//             "https://cdn-uploads.mealime.com/uploads/recipe_variant/thumbnail/22303/presentation_75e9cad5-7f3c-4965-bb94-d47bd1abf371.jpeg"
//         ],
//         "Vegetable Sticks with Hummus": [
//             "https://food-images.files.bbci.co.uk/food/recipes/lighter_hummus_54148_16x9.jpg",
//             "https://www.veganeasy.org/wp-content/uploads/2022/09/Homemade-Hummus-with-Veggie-Sticks.jpg",
//             "https://healthylunchbox.com.au/wp-content/uploads/CarrotCeleryCapsicumSticks.jpg",
//             "https://www.nourishandtempt.com/wp-content/uploads/2022/08/300873563_892642785452537_5308067737439660327_n.jpg",
//             "https://ontrackretreats.co.uk/wp-content/uploads/2018/02/Healthy-weight-loss-hummus-with-vegetable-sticks.png",
//             "https://foodhub.scene7.com/is/image/woolworthsltdprod/1609-vegetablestickswithcapsicumhummus:Mobile-1300x1150",
//             "https://www.mondaycampaigns.org/wp-content/uploads/2021/04/hummus-02.jpg",
//             "https://northwestcookingafloat.com/wp-content/uploads/2021/12/BlogVeggieCups.jpg",
//             "https://www.verywellfit.com/thmb/B6eyh4PJPOmBNhegNDEOlxsjktA=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/veggies-and-dip-1d96c27db1244efeab577ead84f3698a.jpg",
//             "https://i.ytimg.com/vi/-fEz4vJzX18/maxresdefault.jpg"
//         ],
//         "Popcorn": [
//             "https://www.simplyrecipes.com/thmb/Xzggu-Md45HKhhYSw4DK8tGlZ_I=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Perfect-Popcorn-LEAD-41-4a75a18443ae45aa96053f30a3ed0a6b.JPG",
//             "https://nomoneynotime.com.au/uploads/recipes/Quick-Easy-popcorn.jpg",
//             "https://www.allrecipes.com/thmb/Q1qbaxGu71eF3tKyJ0wtmJfORRw=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/87305-microwave-popcorn-DDMFS-4x3-b4700cc9b5e440fd9d11eb0bdaf1395f.jpg",
//             "https://www.browneyedbaker.com/wp-content/uploads/2021/03/how-to-make-popcorn-10-square.jpg",
//             "https://bellyfull.net/wp-content/uploads/2023/05/Stovetop-Popcorn-blog-1.jpg",
//             "https://amyshealthybaking.com/wp-content/uploads/2018/03/stovetop-air-popped-popcorn-1618.jpg",
//             "https://cdn.britannica.com/61/118661-050-6CAD9A11/Popcorn.jpg",
//             "https://www.currytrail.in/wp-content/uploads/2021/01/Movie-Popcorn-Tubs.jpg",
//             "https://wholefully.com/wp-content/uploads/2017/06/movie-theatre-popcorn-800x1200.jpg",
//             "https://bakedbree.com/wp-content/uploads/2023/04/BB-FEATURED-IMAGE-1-683x1024.jpg.webp"
//         ],
//         "Dark Chocolate": [
//             "https://post.healthline.com/wp-content/uploads/2021/02/dark-chocolate-bar-732x549-thumbnail.jpg",
//             "https://charbonnel.co.uk/wp-content/uploads/2022/04/Dark-Chocolate-Truffles-with-edible-Gold-Leaf-GROUP-Optimised-1.jpg",
//             "https://www.datocms-assets.com/46938/1642082346-dark-chocolate.jpg?auto=format&crop=focalpoint&fit=crop&fp-x=0.16&fp-y=0.46&h=627&w=1200",
//             "https://www.theroastedroot.net/wp-content/uploads/2020/09/how-to-make-dark-chocolate-8-735x1103.jpg",
//             "https://health.clevelandclinic.org/wp-content/uploads/sites/3/2022/03/darkChocolate-463813283-770x533-1-650x428.jpg",
//             "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/dark-chocolate-broken-up-700-350-1f49100.jpg?resize=768,574"
//         ],
//         "Boiled Egg": [
//             "https://www.recipetineats.com/wp-content/uploads/2023/03/How-long-to-boil-eggs-square.jpg",
//             "https://i2.wp.com/www.downshiftology.com/wp-content/uploads/2018/03/How-to-Boil-Eggs-main-1-2.jpg",
//             "https://www.seriouseats.com/thmb/Mzkc2-5ELWaYFv7XhhbHZMYukXU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/steamed-hard-boiled-egg-hero-b19792d9bf7344978dd043e6a8f9c074.JPG",
//             "https://images.everydayhealth.com/images/recipes/how-to-make-the-perfect-hardboiled-egg-1440x810.jpg",
//             "https://assets.bonappetit.com/photos/58c9589584ebdb0ec55e365b/1:1/w_2560%2Cc_limit/hard-boiled-eggs.jpg",
//             "https://healthyrecipesblogs.com/wp-content/uploads/2022/06/fried-boiled-eggs-featured-new.jpg",
//             "https://images.immediate.co.uk/production/volatile/sites/30/2015/04/soft-boiled-egg-d3c5662.jpg?quality=90&resize=768,574",
//             "https://fitfoodiefinds.com/wp-content/uploads/2021/01/hard-boild-eggs-graphic-1180x2048-2.jpg",
//             "https://static.onecms.io/wp-content/uploads/sites/43/2021/02/22/213737_kens-perfect-hard-boiled-egg-and-i-mean-perfect_Dianne.jpeg",
//             "https://www.seriouseats.com/thmb/T5v_t4ZE06pasVLee8VYwkoG9Ec=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/perfect-soft-boiled-eggs-hero-05_1-7680c13e853046fd90db9e277911e4e8.JPG"
//         ]
//     },
//     "lunch": {
//         "Prawn Salad": [
//             "https://flawlessfood.co.uk/wp-content/uploads/2021/07/King-Prawn-Salad-256-Flawless.jpg",
//             "https://www.ocado.com/cmscontent/recipe_image_large/33781309.jpg?a4Lk",
//             "https://hips.hearstapps.com/hmg-prod/images/prawn-salad-long-1585307503.jpg?crop=0.8888888888888888xw:1xh;center,top&resize=1200:*",
//             "https://realfood.tesco.com/media/images/RFO-1400x919-Firey-prawn-cocktail-salad-1e35e961-2ad9-437c-ba7a-4d91aa21bf53-0-1400x919.jpg",
//             "https://img.taste.com.au/TrcVf8A9/taste/2016/11/mexican-prawn-salad-92383-1.jpeg",
//             "https://hips.hearstapps.com/hmg-prod/images/prawn-salad-main-1585307472.jpg",
//             "https://thedevilwearssalad.com/wp-content/uploads/2022/08/prawn-salad-with-avocado-1.jpg",
//             "https://bowelcancernz.org.nz/wp-content/uploads/2021/01/prawn-salad-resized-shutterstock_166735733.jpg",
//             "https://production-media.gousto.co.uk/cms/mood-image/3672---Lemony-Prawn-Salad-With-Avocado-Dressing6367-1628680009499.jpg",
//             "https://www.smokingchimney.com/recipe-pages/images/4x3/prawn-salad-image.jpg"
//         ],
//         "Tuna Salad Wrap": [
//             "https://thehealthyfoodie.com/wp-content/uploads/2016/03/Tuna-Wrap-14.jpg",
//             "https://gimmedelicious.com/wp-content/uploads/2018/05/Spicy-Tuna-Wraps-6.jpg",
//             "https://californiaavocado.com/wp-content/uploads/2020/07/California-Tuna-Salad-Wrap.jpeg",
//             "https://sharedappetite.com/wp-content/uploads/2017/08/southwest-tuna-salad-wrap-13.jpg",
//             "https://www.thegraciouspantry.com/wp-content/uploads/2022/03/tuna-wrap-recipe-v-2-.jpg",
//             "https://greenhealthycooking.com/wp-content/uploads/2016/08/10-Minute-Tuna-Wrap-1.jpg",
//             "https://www.seafoodexperts.com.au/wp-content/uploads/2019/02/SR-197-Superfood-tuna-wraps-CLEAN.jpg",
//             "https://allourway.com/wp-content/uploads/2021/08/Spicy-Tuna-Wrap_1200-x-1200.jpeg",
//             "https://www.acouplecooks.com/wp-content/uploads/2023/03/Tuna-Wrap-004-1.jpg",
//             "https://www.theroastedroot.net/wp-content/uploads/2021/06/tuna-salad-lettuce-wraps-2-720x720.jpg"
//         ],
//         "Chicken Caesar Salad": [
//             "https://www.jessicagavin.com/wp-content/uploads/2022/06/chicken-caesar-salad-28-1200.jpg",
//             "https://healthyfitnessmeals.com/wp-content/uploads/2020/05/instagram-In-Stream_Square___Low-carb-Caesar-salad-4.jpg",
//             "https://feelgoodfoodie.net/wp-content/uploads/2021/06/chicken-caesar-pasta-salad-05.jpg",
//             "https://tastefullygrace.com/wp-content/uploads/2023/03/Blog-Chicken-Caesar-Salad-1-scaled.jpg",
//             "https://cupfulofkale.com/wp-content/uploads/2022/05/Vegan-Chicken-Caesar-Salad-720x720.jpg",
//             "https://www.erinliveswhole.com/wp-content/uploads/2021/03/chicken-caesar-salad-6.jpg",
//             "https://www.saltandlavender.com/wp-content/uploads/2020/04/chicken-caesar-pasta-salad-2.jpg",
//             "https://www.deliciousmeetshealthy.com/wp-content/uploads/2021/06/Chicken-Caesar-Salad-4-scaled.jpg",
//             "https://www.recipetineats.com/wp-content/uploads/2016/05/Caesar-Salad_7-SQ.jpg",
//             "https://www.hairybikers.com/uploads/images/_recipeImage/Chicken-Ceaser-Salad.jpg"
//         ],
//         "Pasta": [
//             "https://static.onecms.io/wp-content/uploads/sites/43/2022/11/07/52734-awesome-pasta-salad-ddmfs-4x3-1.jpg",
//             "https://www.jocooks.com/wp-content/uploads/2018/12/creamy-tomato-chicken-pasta-1-20.jpg",
//             "https://foodhub.scene7.com/is/image/woolworthsltdprod/Easy-chicken-and-bacon-pasta:Mobile-1300x1150",
//             "https://realhousemoms.com/wp-content/uploads/One-Pot-Alfredo-Pasta-RECIPE-CARD2.jpg",
//             "https://www.recipetineats.com/wp-content/uploads/2023/05/Chicken-pasta-bake_7.jpg",
//             "https://img.taste.com.au/TCLQitqx/w720-h480-cfill-q80/taste/2022/09/all-in-one-tuscan-chicken-pasta-bake-181120-2.jpg",
//             "https://www.lemonblossoms.com/wp-content/uploads/2022/03/Butter-Noodles-S5.jpg",
//             "https://feelgoodfoodie.net/wp-content/uploads/2021/01/Baked-Feta-Pasta-7.jpg",
//             "https://i.imgur.com/milKP5v.png",
//             "https://food-images.files.bbci.co.uk/food/recipes/arrabiatta_pasta_47164_16x9.jpg"
//         ],
//         "Burrito": [
//             "https://images.immediate.co.uk/production/volatile/sites/2/2023/02/Beef-burrito-df843b7.jpg?resize=960,872",
//             "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Burrito.JPG/800px-Burrito.JPG",
//             "https://cdn.britannica.com/13/234013-050-73781543/rice-and-chorizo-burrito.jpg",
//             "https://hips.hearstapps.com/hmg-prod/images/delish-breakfast-burrito-horizontaljpg-1541624805.jpg?crop=0.6667307692307692xw:1xh;center,top&resize=1200:*",
//             "https://www.allrecipes.com/thmb/ZsrA9U-cm_OvZjgQpBS4Z-3j6TM=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/14041-delicious-black-bean-burritos-ddmfs-2x1-126-c943f6e37b114bf49a3fb1707dafbb7c.jpg",
//             "https://images.ricardocuisine.com/services/recipes/9380.jpg",
//             "https://www.seriouseats.com/thmb/lOdEqFZsV3LOzX5Pc2Y6XCJuvTs=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__serious_eats__seriouseats.com__2020__10__20201002-mission-style-burrito-jillian-atkinson-2-6841455590ed4c3981529b232166643a.jpg",
//             "https://img.buzzfeed.com/tasty-app-user-assets-prod-us-east-1/recipes/4c7ea5489a6a4871ba38f0b9c8949f91.jpeg?resize=1200:*&output-format=jpg&output-quality=auto",
//             "https://www.recipetineats.com/wp-content/uploads/2020/02/Chicken-Burritos_2.jpg",
//             "https://thecheaplazyvegan.com/wp-content/uploads/2022/07/mushrooms-burrito.jpg"
//         ],
//         "Sushi": [
//             "https://www.justonecookbook.com/wp-content/uploads/2020/01/Sushi-Rolls-Maki-Sushi-%E2%80%93-Hosomaki-1106-II.jpg",
//             "https://www.allrecipes.com/thmb/CBOcP0zp71lR2bn-KUMkgCB92RA=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/24228-Sushi-roll-ddmfs-4x3-2914-1839f746d9334814a7a5d93ed45ba082.jpg",
//             "https://properfoodie.com/wp-content/uploads/2020/07/featured-sushi-2b-feature-sushi-2b-1.jpg",
//             "https://i8b2m3d9.stackpathcdn.com/wp-content/uploads/2019/07/Take-away-sushi-rolls_3781NM.jpg",
//             "https://img.taste.com.au/lNnNoTvU/taste/2010/01/sushi-187034-1.jpg",
//             "https://peasandcrayons.com/wp-content/uploads/2012/10/homemade-sushi-tutorial-recipe-peas-and-crayons-1250.jpg",
//             "https://www.thespruceeats.com/thmb/KKVYHEcAN6Jt7yvULfCB4r3ad30=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/what-is-sushi-5079606-hero-01-e5a0a26f194a49478f84e04193baaefa.jpg",
//             "https://post.medicalnewstoday.com/wp-content/uploads/sites/3/2022/06/is_sushi_healthy_732x549_thumb-732x549.jpg",
//             "https://www.pbs.org/food/files/2012/09/Sushi-1-1.jpg",
//             "https://tatyanaseverydayfood.com/wp-content/uploads/2014/04/Sushi-roll.jpg"
//         ],
//         "Burger and Fries": [
//             "https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fimages.media-allrecipes.com%2Fuserphotos%2F9178710.jpg&q=60&c=sc&orient=true&w=160&poi=auto&h=90",
//             "https://i.dailymail.co.uk/i/pix/2017/11/08/16/4623608900000578-0-image-a-14_1510156907844.jpg",
//             "https://loveincorporated.blob.core.windows.net/contentimages/gallery/8e218130-5426-4069-a1f8-6bf62dd2665a-bc96df8d-4eb3-4249-86aa-9b11fce9c377-michigan-california-burgerz.jpg",
//             "https://insanelygoodrecipes.com/wp-content/uploads/2020/02/Burger-and-Fries.jpg",
//             "https://thumbs.dreamstime.com/b/burger-french-fries-basket-tartan-tablecloth-ketchup-mustard-bottle-background-close-up-135319836.jpg",
//             "https://www.seriouseats.com/thmb/d2DYiLy-rNKmxrW1gchCOZcGIWY=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/20210607-INNOUTBURGERS-JANJIGIAN-seriouseats-23-b2b8a505ff414272aab71590a8985b85.jpg",
//             "https://static.independent.co.uk/s3fs-public/thumbnails/image/2017/11/09/14/istock-178263194.jpg?width=1200",
//             "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnVyZ2VyJTIwZnJpZXN8ZW58MHx8MHx8fDA%3D&w=1000&q=80",
//             "https://c8.alamy.com/comp/MP6B2H/homemade-beef-burger-and-french-fries-with-ketchup-on-wooden-board-on-gray-concrete-background-horizontal-composition-tasty-burger-and-fries-fast-f-MP6B2H.jpg",
//             "https://assets.bonappetit.com/photos/57ad3da553e63daf11a4dd3f/1:1/w_2560%2Cc_limit/Diner41.jpg"
//         ],
//         "BLT Sandwich": [
//             "https://natashaskitchen.com/wp-content/uploads/2020/07/BLT-Sandwich-Recipe-4.jpg",
//             "https://therecipecritic.com/wp-content/uploads/2022/05/blt-1.jpg",
//             "https://www.allrecipes.com/thmb/fhFA3RhualUOwZxXYHig8ixD54M=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/4543157-e47cd201c0e34de0b63c70f62ccbe2ce.jpg",
//             "https://www.jocooks.com/wp-content/uploads/2023/02/blt-sandwiches-1-13.jpg",
//             "https://ohsweetbasil.com/wp-content/uploads/How-to-make-the-best-BLT-recipe-4-scaled.jpg",
//             "https://www.wellplated.com/wp-content/uploads/2021/06/Best-BLT.jpg",
//             "https://www.tastingtable.com/img/gallery/sweet-heat-blt-recipe/intro-1670864182.jpg",
//             "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/BLT_sandwich_%281%29.jpg/1200px-BLT_sandwich_%281%29.jpg",
//             "https://www.whattheforkfoodblog.com/wp-content/uploads/2015/09/Classic-BLT-feature.jpg",
//             "https://www.recipegirl.com/wp-content/uploads/2007/03/BLT-1.jpeg"
//         ],
//         "Chicken Soup": [
//             "https://cdn.apartmenttherapy.info/image/upload/f_jpg,q_auto:eco,c_fill,g_auto,w_1500,ar_1:1/k%2FEdit%2F2023-01-Creamy-Chicken-Soup%2Fcreamy-chicken-soup-4",
//             "https://thecozycook.com/wp-content/uploads/2023/02/Creamy-Chicken-Soup-1.jpg",
//             "https://www.recipetineats.com/wp-content/uploads/2018/04/Chicken-and-Rice-Soup_8-1.jpg",
//             "https://imagesvc.meredithcorp.io/v3/jumpstartpure/image/?url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F43%2F2021%2F04%2F13%2F8814_HomemadeChickenSoup_SoupLovingNicole_LSH-2000.jpg&w=640&h=360&q=90&c=cc",
//             "https://www.ambitiouskitchen.com/wp-content/uploads/2018/02/chickensoup-2-725x725-1.jpg",
//             "https://www.budgetbytes.com/wp-content/uploads/2017/02/Homemade-Chicken-Noodle-Soup-close-e.jpg",
//             "https://www.seriouseats.com/thmb/2nouHHsjM0bN1vwXMOZGUkLFsJ8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__serious_eats__seriouseats.com__recipes__images__2017__12__20171115-chicken-soup-vicky-wasik-11-80db1a04d84a43a089e0559efdddd517.jpg",
//             "https://www.marthastewart.com/thmb/JM9jDnmWj706yDq2LxEo0iu-FkA=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/336138-basic-chicken-soup-08-805a2296589840f9bf9ada60e7e1b644.jpg",
//             "https://mycrazygoodlife.com/wp-content/uploads/2018/08/cream-of-chicken-soup-featured.jpg",
//             "https://storcpdkenticomedia.blob.core.windows.net/media/recipemanagementsystem/media/recipe-media-files/recipes/retail/x17/2020_df_retail_super-easy-chicken-and-rice-soup_20247_760x580.jpg?ext=.jpg"
//         ],
//         "Veggie Wrap": [
//             "https://tastesbetterfromscratch.com/wp-content/uploads/2014/04/Veggie-Wrap-2.jpg",
//             "https://www.bowlofdelicious.com/wp-content/uploads/2014/01/Veggie-Wraps-square.jpg",
//             "https://www.hwcmagazine.com/wp-content/uploads/2022/07/Mediterranean-Veggie-Wraps-7364.jpg",
//             "https://www.acouplecooks.com/wp-content/uploads/2023/02/Veggie-Wrap-002.jpg",
//             "https://diabetesstrong.com/wp-content/uploads/2021/10/grilled-veggie-wraps-8.jpg",
//             "https://food-images.files.bbci.co.uk/food/recipes/quesadillaswithbarbe_1047_16x9.jpg",
//             "https://www.culinaryhill.com/wp-content/uploads/2020/04/Ultimate-Veggie-Wrap-Recipe-Culinary-Hill-LR-04SQ.jpg",
//             "https://eatplant-based.com/wp-content/uploads/2014/12/Veggie-Wraps-720x720.jpg",
//             "https://foodwithfeeling.com/wp-content/uploads/2021/04/vegan-wraps-9.jpg",
//             "https://tmbidigitalassetsazure.blob.core.windows.net/rms3-prod/attachments/37/1200x1200/Hummus---Veggie-Wrap-Up_EXPS_CWAS18_106657_B04_05__4b.jpg"
//         ],
//         "Quinoa Salad": [
//             "https://www.cookingclassy.com/wp-content/uploads/2020/01/quinoa-salad-16.jpg",
//             "https://cookieandkate.com/images/2017/08/best-quinoa-salad-recipe-3.jpg",
//             "https://choosingchia.com/jessh-jessh/uploads/2019/07/meditteranean-quinoa-salad-2.jpg",
//             "https://www.chelseasmessyapron.com/wp-content/uploads/2017/05/Quinoa-Salad-1.jpeg",
//             "https://i.ytimg.com/vi/JHC9k0OWnHQ/maxresdefault.jpg",
//             "https://kristineskitchenblog.com/wp-content/uploads/2022/05/quinoa-salad-2.jpg",
//             "https://cookingwithayeh.com/wp-content/uploads/2021/09/Quinoa-Salad-0.jpg",
//             "https://www.foodiecrush.com/shrimp-scampi/healthy-quinoa-salad-foodiecrush-com-014/",
//             "https://eatwithclarity.com/wp-content/uploads/2022/02/thai-quinoa-salad-2.jpg",
//             "https://cdn.apartmenttherapy.info/image/upload/f_auto,q_auto:eco,c_fill,g_auto,w_1500,ar_3:2/k%2FPhoto%2FRecipes%2F2019-11-recipe-mediterranean-quinoa-salad%2F2019-10-21_Kitchn89095_Mediteranean-Quinoa-Salad"
//         ],
//         "Stir Fry": [
//             "https://images.immediate.co.uk/production/volatile/sites/30/2014/02/Stir-fry-recipes-aab9292.jpg",
//             "https://therecipecritic.com/wp-content/uploads/2019/08/vegetable_stir_fry.jpg",
//             "https://www.allrecipes.com/thmb/xvlRRhK5ldXuGcXad8XDM5tTAfE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/223382_chicken-stir-fry_Rita-1x1-1-b6b835ccfc714bb6a8391a7c47a06a84.jpg",
//             "https://www.wellplated.com/wp-content/uploads/2020/08/Chicken-Noodle-Stir-Fry.jpg",
//             "https://www.allrecipes.com/thmb/7N-Xq1XMMJw8G0KJv2e0ETUYB2I=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/228823-quick-beef-stir-fry-DDMFS-4x3-1f79b031d3134f02ac27d79e967dfef5.jpg",
//             "https://hips.hearstapps.com/hmg-prod/images/veggie-stir-fry-1597687367.jpg?crop=0.793xw:0.793xh;0.0619xw,0.0928xh&resize=1200:*",
//             "https://cafedelites.com/wp-content/uploads/2018/03/Sesame-Beef-Stir-Fry-4.jpg",
//             "https://i2.wp.com/www.downshiftology.com/wp-content/uploads/2021/05/Chicken-Stir-Fry-main-1.jpg",
//             "https://www.dinneratthezoo.com/wp-content/uploads/2019/12/honey-garlic-chicken-stir-fry-final-1.jpg",
//             "https://www.cookingforkeeps.com/wp-content/uploads/2021/05/Healthy-Vegetable-Stir-Fry-Web-10.jpg"
//         ],
//         "Tacos": [
//             "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/001_Tacos_de_carnitas%2C_carne_asada_y_al_pastor.jpg/1200px-001_Tacos_de_carnitas%2C_carne_asada_y_al_pastor.jpg",
//             "https://static.onecms.io/wp-content/uploads/sites/43/2023/01/30/70935-taqueria-style-tacos-mfs-3x2-35.jpg",
//             "https://images-gmi-pmc.edge-generalmills.com/e59f255c-7498-4b84-9c9d-e578bf5d88fc.jpg",
//             "https://food-images.files.bbci.co.uk/food/recipes/budget_beef_tacos_32412_16x9.jpg",
//             "https://pinchandswirl.com/wp-content/uploads/2022/11/Lamb-Tacos__sq.jpg",
//             "https://images.immediate.co.uk/production/volatile/sites/30/2021/02/Next-level-tacos-e163429.jpg",
//             "https://cdn3.tmbi.com/toh/GoogleImagesPostCard/Tacos-Deluxe_EXPS_13x9BZ20_6050_E10_03_3b%20AP.jpg",
//             "https://kristineskitchenblog.com/wp-content/uploads/2023/02/tacos-recipe-16-2.jpg",
//             "https://img.taste.com.au/R_dRdL7V/taste/2022/09/healthy-tacos-recipe-181113-1.jpg",
//             "https://www.finedininglovers.com/sites/g/files/xknfdk626/files/styles/recipes_1200_800_fallback/public/2021-09/carne-asada-tacos-recipe%C2%A9iStock.jpg?itok=1UaGpAYD"
//         ],
//         "Grilled Chicken with Vegetables": [
//             "https://simply-delicious-food.com/wp-content/uploads/2019/04/30-minute-grilled-chicken-and-vegetables-3.jpg",
//             "https://assets.kraftfoods.com/recipe_images/opendeploy/75221_640x428.jpg",
//             "https://lexiscleankitchen.com/wp-content/uploads/2019/07/grilled-veggie-salad1.jpg",
//             "https://gimmedelicious.com/wp-content/uploads/2016/03/roasted-veggies-26-of-45.jpg",
//             "https://www.heart.org/-/media/AHA/Recipe/Recipe-Images/Grilled-Chicken-with-Vegetables-sized.jpg",
//             "https://images.eatsmarter.com/sites/default/files/styles/1600x1200/public/pan-grilled-chicken-breast-with-vegetables-528648.jpg",
//             "https://diethood.com/wp-content/uploads/2015/06/BBQ-Chicken-in-Foil-e1525511287975.jpg",
//             "https://www.spendwithpennies.com/wp-content/uploads/2018/11/SpendWithPennies-Juicy-Roast-Chicken-25.jpg",
//             "https://frombowltosoul.com/wp-content/uploads/2018/05/DSC07530.jpg",
//             "https://www.jocooks.com/wp-content/uploads/2013/10/roasted-chicken-and-vegetables-1-9.jpg"
//         ],
//         "Falafel Pita": [
//             "https://simplyceecee.co/wp-content/uploads/2022/06/falafelfeature.jpg",
//             "https://sixhungryfeet.com/wp-content/uploads/2022/08/Falafel-Pita-Sandwich-5.jpg",
//             "https://www.madhuseverydayindian.com/wp-content/uploads/2022/01/falafel-pita-sandwich-recipe-with-vegetables-and-tahini-.jpg",
//             "https://www.nonguiltypleasures.com/wp-content/uploads/2023/02/falafel-pita-sandwich-square.jpg",
//             "https://www.thespruceeats.com/thmb/5v67ELkFbCch7qYq51l6oEb9wew=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/falafel-pita-sandwich-recipe-2355692-20_preview-5b21243d303713003638c190.jpeg",
//             "https://data.thefeedfeed.com/static/2020/08/14/15974236195f36c003242c4.jpg",
//             "https://thefoodiephysician.com/wp-content/uploads/2023/02/fullsizeoutput_327c.jpeg",
//             "https://sixhungryfeet.com/wp-content/uploads/2022/08/Falafel-Pita-Sandwich-4.jpg",
//             "https://cdn.cleaneatingmag.com/wp-content/uploads/2015/11/falafelpitasandwich.jpg?crop=4:3&width=1600",
//             "https://caitsplate.com/wp-core/wp-content/uploads/2019/07/july_blog-1_caitsplate.jpeg"
//         ]
//     },
//     "drink": {
//         "Iced Coffee": [
//             "https://midwestniceblog.com/wp-content/uploads/2022/06/starbucks-copycat-vanilla-iced-coffee.jpg",
//             "https://www.allrecipes.com/thmb/Hqro0FNdnDEwDjrEoxhMfKdWfOY=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/21667-easy-iced-coffee-ddmfs-4x3-0093-7becf3932bd64ed7b594d46c02d0889f.jpg",
//             "https://images.immediate.co.uk/production/volatile/sites/30/2022/04/Iced-Caramel-Macchiato-f4a10f9.jpg",
//             "https://www.tamingtwins.com/wp-content/uploads/2018/07/iced-coffee-recipe-11.jpg",
//             "https://www.simplejoy.com/wp-content/uploads/2012/06/iced_coffee_cocktail.jpg",
//             "https://hips.hearstapps.com/hmg-prod/images/how-to-make-iced-coffee-1620127075.jpg",
//             "https://www.starbucksathome.com/gb/sites/default/files/2021-03/2-IcedLatte_LongShadow_Cream_1.png",
//             "https://hips.hearstapps.com/goodhousekeeping-uk/main/embedded/48064/gettyimages-71096850.jpg",
//             "https://thegirlonbloor.com/wp-content/uploads/2015/07/Iced-Coffee-Recipes-19.jpg",
//             "https://www.cookingclassy.com/wp-content/uploads/2022/07/iced-coffee-05.jpg"
//         ],
//         "Green Smoothie": [
//             "https://joyfoodsunshine.com/wp-content/uploads/2019/07/green-smoothie-recipe-2.jpg",
//             "https://i2.wp.com/www.downshiftology.com/wp-content/uploads/2020/01/Green-Smoothie-Recipe-7.jpg",
//             "https://cdn.loveandlemons.com/wp-content/uploads/2022/12/green-smoothie-recipes.jpg",
//             "https://feelgoodfoodie.net/wp-content/uploads/2019/01/Green-Smoothie-5.jpg",
//             "https://www.thespruceeats.com/thmb/Qm0s9l3Fw2UKqjeo6vlpCPX-Xsk=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/apple-kiwi-superpower-green-smoothie-recipe-2254290-hero-01-2487af8222f642538032504339d4b595.jpg",
//             "https://dailyburn.com/life/wp-content/uploads/2018/01/AMDU-8699_DB_1000x1500_1.png",
//             "https://www.cookingclassy.com/wp-content/uploads/2019/07/green-smoothie-10.jpg",
//             "https://www.healthyseasonalrecipes.com/wp-content/uploads/2020/06/healthy-green-smoothie-034.jpg",
//             "https://www.lizshealthytable.com/wp-content/uploads/2021/02/Garden-Green-Smoothie-Recipe-800x800.png",
//             "https://choosingchia.com/jessh-jessh/uploads/2021/05/Simple-green-smoothie-1-2.jpg"
//         ],
//         "Lemonade": [
//             "https://www.simplyrecipes.com/thmb/4LFrc9hSMoKErr2WI7tThcnvWwA=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Perfect-Lemonade-LEAD-08-B-441ceb568f854bb485dbed79e082bb4a.jpg",
//             "https://www.allrecipes.com/thmb/Zf-x1audihLePjnI7U1bke4-mMI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/32385-best-lemonade-ever-207-9dda3b3b98ac496e8600eecdcee90797.jpg",
//             "https://assets.bonappetit.com/photos/62aba9d5b433b325383e9ca9/3:2/w_4950,h_3300,c_limit/0616-lemonade-recipe-lede.jpg",
//             "https://www.foodiecrush.com/wp-content/uploads/2022/06/Lemonade-foodiecrush.com-9-1.jpg",
//             "https://www.thespruceeats.com/thmb/DHtedC3i0IkrTlBfp_7jaqQkC3Q=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/homemade-lemonade-2216227-hero-02copy-767d28c1e7cf468db2282d77103d0bf4.jpg",
//             "https://assets.bonappetit.com/photos/63daa2c15b9e0766c1d2a0a5/16:9/w_5584,h_3141,c_limit/0201023-sparkling-preserved-lemonade-lede.jpg",
//             "https://aldprdproductimages.azureedge.net/media/resized/$Aldi_GB/29.09.22/4088600274065_0_XL.jpg",
//             "https://kidsactivitiesblog.com/wp-content/uploads/2020/04/Homemade-lemonade.jpg",
//             "https://food-images.files.bbci.co.uk/food/recipes/strawberry_lemonade_63154_16x9.jpg",
//             "https://detoxinista.com/wp-content/uploads/2022/05/lemonade-recipe.jpg"
//         ],
//         "Iced Tea": [
//             "https://realfood.tesco.com/media/images/RFO-1400x919-IcedTea-8e156836-69f4-4433-8bae-c42e174212c1-0-1400x919.jpg",
//             "https://natashaskitchen.com/wp-content/uploads/2021/07/Iced-Tea-3-1-728x1092.jpg",
//             "https://assets.bonappetit.com/photos/57aca9caf1c801a1038bc6aa/1:1/w_3731,h_3731,c_limit/cold-brew-plum-iced-tea.jpg",
//             "https://natashaskitchen.com/wp-content/uploads/2021/07/Iced-Tea-SQ-1.jpg",
//             "https://www.alyonascooking.com/wp-content/uploads/2019/04/iced-tea-recipe-1.jpg",
//             "https://feelgoodfoodie.net/wp-content/uploads/2018/05/Raspberry-Iced-Tea-09.jpg",
//             "https://www.errenskitchen.com/wp-content/uploads/2014/08/lemon-Iced-Tea.jpg",
//             "https://www.thespruceeats.com/thmb/qZHEIJ6CQIgYPUW4w1MCoOS8DGo=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/oolong-iced-tea-recipe-766389-hero-07-1cc310d9aa8f497b8f78bb7021fd0e5c.jpg",
//             "https://veryveganish.com/wp-content/uploads/2020/05/How-to-make-perfect-southern-iced-tea-sweet-or-unsweetened.jpg",
//             "https://static.onecms.io/wp-content/uploads/sites/43/2022/08/26/AR-109190-SmothSweetTea-0163-4x3-1.jpg"
//         ],
//         "Fresh Juice": [
//             "https://insanelygoodrecipes.com/wp-content/uploads/2021/10/Delicious-Fruit-Juices-Orange-Kiwi-and-Strawberry.jpg",
//             "https://www.alphafoodie.com/wp-content/uploads/2022/11/Juicing-Guide-square.jpeg",
//             "https://i0.wp.com/edibleink.org/wp-content/uploads/2021/01/Featured-Image.png?fit=1200%2C675&ssl=1",
//             "https://www.indianhealthyrecipes.com/wp-content/uploads/2021/12/orange-juice-recipe.jpg",
//             "https://skinjoy.lt/wp-content/uploads/2022/09/1-1.jpg",
//             "https://foodtasia.com/wp-content/uploads/2022/06/strawberry-juice-2-1.jpeg",
//             "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Orange_juice_1.jpg/1200px-Orange_juice_1.jpg",
//             "https://i0.wp.com/blog.dacadoo.com/wp-content/uploads/2013/01/stockvault-orange-juice.jpeg?fit=600%2C720",
//             "https://post.healthline.com/wp-content/uploads/2020/08/orange-juice-732x549-thumbnail.jpg",
//             "https://files.selecthealth.cloud/api/public/content/226106-fuice_juice_fb_sm.jpg"
//         ],
//         "Protein Shake": [
//             "https://fitfoodiefinds.com/wp-content/uploads/2020/01/sq.jpg",
//             "https://tastesbetterfromscratch.com/wp-content/uploads/2023/01/Vanilla-Protein-Shake-1.jpg",
//             "https://www.everydayeasyeats.com/wp-content/uploads/2020/08/Vanilla-Protein-Shake.jpg",
//             "https://tastesbetterfromscratch.com/wp-content/uploads/2023/01/Chocolate-Protein-Shake-Web-5.jpg",
//             "https://feelgoodfoodie.net/wp-content/uploads/2017/02/strawberry-protein-smoothie-04.jpg",
//             "https://i.guim.co.uk/img/media/03ac0259bc751c9b186d9f5f71cefd36b051ae76/0_198_2254_2060/master/2254.jpg?width=620&quality=85&auto=format&fit=max&s=3e500adfdb5ec3aeeeeb0c14f8d1e38e",
//             "https://www.asweetpeachef.com/wp-content/uploads/2021/07/BlueberryProteinShake-6.jpg",
//             "https://www.everydayeasyeats.com/wp-content/uploads/2020/07/Chocolate-Protein-Shake-1.jpg",
//             "https://www.asweetpeachef.com/wp-content/uploads/2014/09/banana-protein-shake-1.jpg",
//             "https://www.natalieshealth.com/wp-content/uploads/2021/01/Peanut-Butter-Protein-Shake-2308.jpg"
//         ],
//         "Water": [
//             "https://media.hswstatic.com/eyJidWNrZXQiOiJjb250ZW50Lmhzd3N0YXRpYy5jb20iLCJrZXkiOiJnaWZcL3dhdGVyLXVwZGF0ZS5qcGciLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjgyOH19fQ==",
//             "https://www.thespruceeats.com/thmb/4Uxr_CKC7aR-UhEicIvVqLaiO0k=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-488636063-5ab2dbd8a8ff48049cfd36e8ad841ae5.jpg",
//             "https://domf5oio6qrcr.cloudfront.net/medialibrary/7909/b8a1309a-ba53-48c7-bca3-9c36aab2338a.jpg",
//             "https://www.eatingwell.com/thmb/qtP5zJfjZjS_6lkAGjOoH2XDNEc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/mineral-water-8cc11cec12c7471bac9378fa9757c83f.jpg",
//             "https://www.wild-ideas.org.uk/wp-content/uploads/2020/08/pexels-pixabay-40784-1024x683.jpg",
//             "https://i.guim.co.uk/img/media/eda873838f940582d1210dcf51900efad3fa8c9b/0_469_7360_4417/master/7360.jpg?width=620&quality=85&auto=format&fit=max&s=0dae5fec7edc41f83e7278dd9c95a650",
//             "https://cdn.britannica.com/31/150831-131-704549C8/molecule-molecules-beads-droplets-water-form-surface.jpg",
//             "https://www.hull.ac.uk/work-with-us/research/site-elements/images/groups/choppy-sea.x49e395a9.jpg?crop=1920,917,0,363",
//             "https://onewater.org.uk/wp-content/uploads/2022/01/Website-Carbon-N-range.jpg",
//             "https://www.cam.ac.uk/sites/www.cam.ac.uk/files/styles/content-885x432/public/news/research/news/daniel-sinoca-aanclsb0su0-unsplash.jpg?itok=oIgltFav"
//         ],
//         "Ginger Tea": [
//             "https://detoxinista.com/wp-content/uploads/2020/10/ginger-tea-recipe.jpg",
//             "https://draxe.com/wp-content/uploads/2020/04/DrAxeGingerTeaThumbnail.jpg",
//             "https://www.thespruceeats.com/thmb/67K1D5bvvtTQNb50ykTTVIfGW6M=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/homemade-ginger-tea-3377239-hero-01-b5150207927b437e81e651d43c72be40.jpg",
//             "https://minimalistbaker.com/wp-content/uploads/2021/12/How-To-Make-Fresh-Ginger-Tea-SQUARE.jpg",
//             "https://aprettylifeinthesuburbs.com/wp-content/uploads/2014/02/Home-Made-Ginger-Tea-1.jpg",
//             "https://cookieandkate.com/images/2019/12/best-ginger-tea-recipe-2.jpg",
//             "https://files.selecthealth.cloud/api/public/content/221093-Tumeric_tea_blog_lg.jpg",
//             "https://www.31daily.com/wp-content/uploads/2020/01/Lemon-Ginger-Tea-2.jpg",
//             "https://i0.wp.com/images-prod.healthline.com/hlcmsresource/images/topic_centers/Food-Nutrition/642x361-Does_Ginger_Tea_Have_Any_Bad_Side_Effects.jpg?w=1155&h=758",
//             "https://yogiproducts.com/wp-content/uploads/2009/03/YT-US-Ginger-CAR-C23-202296-3DFront-WithGlow-300DPI-PNG.png"
//         ],
//         "Hot Chocolate": [
//             "https://food-images.files.bbci.co.uk/food/recipes/hot_chocolate_78843_16x9.jpg",
//             "https://feelgoodfoodie.net/wp-content/uploads/2021/11/how-to-make-hot-chocolate-7.jpg",
//             "https://images.immediate.co.uk/production/volatile/sites/30/2020/10/Classic-Homemade-Hot-Chocolate-7d8353b.jpg",
//             "https://assets.epicurious.com/photos/61eb09dfb37c8d2963dd7bde/1:1/w_2849,h_2849,c_limit/HotCocoaForOne_RECIPE_012022_086_VOG_final.jpg",
//             "https://images.immediate.co.uk/production/volatile/sites/30/2021/02/Easter-egg-hot-chocolate-06c2cbd.jpg",
//             "https://realfood.tesco.com/media/images/Vegan-hot-chocolate-recipe-1400x919-d8405b92-a14c-4105-8fcd-ccf276086cb3-0-1400x919.jpg",
//             "https://www.janespatisserie.com/wp-content/uploads/2018/04/IMG_8447-scaled.jpg",
//             "https://www.sugarhero.com/wp-content/uploads/2023/04/hot-chocolate-floats-1.jpg",
//             "https://www.foodandwine.com/thmb/V1OEgtLQGUv_w2Fvm40WMLsJ4rk=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Indulgent-Hot-Chocolate-FT-RECIPE0223-fd36942ef266417ab40440374fc76a15.jpg",
//             "https://media-cldnry.s-nbcnews.com/image/upload/newscms/2020_50/1650987/hot-cocoa-kb-main-201211.jpg"
//         ],
//         "Espresso": [
//             "https://upload.wikimedia.org/wikipedia/commons/a/a5/Tazzina_di_caff%C3%A8_a_Ventimiglia.jpg",
//             "https://www.thespruceeats.com/thmb/HJrjMfXdLGHbgMhnM0fMkDx9XPQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/what-is-espresso-765702-hero-03_cropped-ffbc0c7cf45a46ff846843040c8f370c.jpg",
//             "https://lovefoodfeed.com/wp-content/uploads/2022/09/Espresso-with-chocolate-750-wp.webp",
//             "https://i1.wp.com/www.teacoffeecup.com/wp-content/uploads/2019/07/espresso-using-machine.jpg?fit=5110%2C3405&ssl=1",
//             "https://www.tasteofhome.com/wp-content/uploads/2020/02/Types-of-Coffee-Drinks_1200X1200.jpg?fit=680,680",
//             "https://hips.hearstapps.com/hmg-prod/images/how-to-make-espresso-1617301390.png?crop=1.00xw:0.668xh;0,0.280xh&resize=1200:*",
//             "https://www.acouplecooks.com/wp-content/uploads/2021/08/How-to-make-espresso-009s.jpg",
//             "https://cdn.apartmenttherapy.info/image/upload/f_jpg,q_auto:eco,c_fill,g_auto,w_1500,ar_1:1/stock%2FGettyImages-1270218142",
//             "https://media.esquirescoffee.co.uk/uploads/2020/02/26085349/tabitha-turner-KWZ-rg9o76A-unsplash.jpg",
//             "https://res.cloudinary.com/pactcoffee/image/upload/f_auto,q_auto/v1586974345/website-d2c/assets/uploadedCMS/espresso.png"
//         ],
//         "Latte": [
//             "https://upload.wikimedia.org/wikipedia/commons/c/c6/Latte_art_3.jpg",
//             "https://www.allrecipes.com/thmb/aAaKltGtttecKWn4uqK4ivZ6SPQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/260904_HomemadeCaramelLatte_ddmfs_3x4_3967-de97df91d502475982fe4ae9299bcf3b.jpg",
//             "https://www.forkinthekitchen.com/wp-content/uploads/2022/06/220518.homemade.latte_.updated-6483.jpg",
//             "https://upload.wikimedia.org/wikipedia/commons/9/98/Latte_with_winged_tulip_art.jpg",
//             "https://athome.starbucks.com/sites/default/files/styles/homepage_banner_xlarge/public/2022-04/CAH_ClassicLatte_Hero.jpg?h=cf77c377&itok=IfuBgei_",
//             "https://www.nescafe.com/gb/sites/default/files/2021-05/drawing-latte-coffee-ingredients-cup.png",
//             "https://www.acouplecooks.com/wp-content/uploads/2020/09/Latte-Art-067s.jpg",
//             "https://www.foodandwine.com/thmb/CCe2JUHfjCQ44L0YTbCu97ukUzA=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Partners-Latte-FT-BLOG0523-09569880de524fe487831d95184495cc.jpg",
//             "https://www.acouplecooks.com/wp-content/uploads/2021/08/Iced-Latte-003.jpg",
//             "https://www.thespruceeats.com/thmb/0CK65lVOSHILEZXSh1dVJ_Hl4Hc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/how-to-make-caffe-latte-765372-hero-01-2417e49c4a9c4789b3abdd36885f06ab.jpg"
//         ],
//         "Matcha Latte": [
//             "https://www.acozykitchen.com/wp-content/uploads/2017/04/IcedMatchaLatte-1.jpg",
//             "https://www.acouplecooks.com/wp-content/uploads/2021/08/Matcha-Latte-001s.jpg",
//             "https://www.butteredsideupblog.com/wp-content/uploads/2023/03/Iced-Matcha-Latte-Recipe-4-scaled.jpg",
//             "https://www.wandercooks.com/wp-content/uploads/2023/02/hot-and-iced-matcha-latte-4.jpg",
//             "https://jessicainthekitchen.com/wp-content/uploads/2022/02/Matcha-latte-hot04442.jpg",
//             "https://www.justonecookbook.com/wp-content/uploads/2022/12/Matcha-Latte-4598-I-1.jpg",
//             "https://choosingchia.com/jessh-jessh/uploads/2022/10/matcha-latte-6.jpg",
//             "https://simpleveganblog.com/wp-content/uploads/2021/09/matcha-latte-2.jpg",
//             "https://www.forkintheroad.co/wp-content/uploads/2021/01/peppermint-matcha-latte-122.jpg",
//             "https://cdn.media.amplience.net/i/japancentre/recipes-16-matcha-green-tea-latte-hot-or-iced/Matcha-green-tea-latte-(hot-or-iced)?$poi$&w=1200&h=630&sm=c&fmt=auto"
//         ],
//         "Coconut Water": [
//             "https://images.immediate.co.uk/production/volatile/sites/30/2017/08/coconut-water-bb9cfe8.jpg",
//             "https://post.healthline.com/wp-content/uploads/2021/08/coconut-water-1200x628-facebook-1200x628.jpg",
//             "https://assets.sainsburys-groceries.co.uk/gol/7284374/1/640x640.jpg",
//             "https://upload.wikimedia.org/wikipedia/commons/5/5c/Coconut_Drink%2C_Pangandaran.JPG",
//             "https://static.independent.co.uk/s3fs-public/thumbnails/image/2013/09/09/16/coco.jpg?quality=75&width=1200&auto=webp",
//             "https://health.clevelandclinic.org/wp-content/uploads/sites/3/2021/09/CoconutWater-637330250-770x533-1.jpg",
//             "https://images.immediate.co.uk/production/volatile/sites/2/2018/01/coconut-water-header1-23bcf76.jpg?resize=960,872",
//             "https://thecoconutmama.com/wp-content/uploads/2023/03/is-coconut-water-low-FODMAP-jpg.webp",
//             "https://i.insider.com/5faeebf31c741f0019ac9c43?width=750&format=jpeg&auto=webp",
//             "https://static.thcdn.com/productimg/1600/1600/12706027-1244837629105756.jpg"
//         ],
//         "Herbal Tea": [
//             "https://m.media-amazon.com/images/I/61rtYVGbpDL._AC_UF894,1000_QL80_.jpg",
//             "https://www.expertreviews.co.uk/sites/expertreviews/files/styles/er_main_wide/public/2022/05/best_herbal_tea_-_lead_img.jpg?itok=-_ryDBmb",
//             "https://static.independent.co.uk/2022/09/05/13/herbal%20tea%20copy.jpg?quality=75&width=1200&auto=webp",
//             "https://static.toiimg.com/photo/69385334.cms",
//             "https://cdn.shopify.com/s/files/1/0615/9253/5282/collections/B-3-Herbal.png?v=1652129407",
//             "https://imageio.forbes.com/blogs-images/nomanazish/files/2018/06/teacup-2325722_1280-1200x800.jpg?format=jpg&width=1200",
//             "https://brodandtaylor.com/cdn/shop/articles/dehydrated-tea-thumb_1024x.jpg?v=1639765759",
//             "https://www.bhg.com/thmb/iqA6y3HjvBFg-nJ2hZj14U6bHfA=/1244x0/filters:no_upscale():strip_icc()/glass-pot-herbal-tea-2613f48f-2b8e256304664c54b4a04b2a6b6694b9.jpg",
//             "https://static.oxinis.com/healthmug/image/blog/article/4-banner-700.jpg",
//             "https://www.100percentpure.com/s/files/1/0648/1955/files/main_hot_herbal_tea.jpg?v=1610077387&em-origin=cdn.shopify.com"
//         ],
//         "Chamomile Tea": [
//             "https://post.healthline.com/wp-content/uploads/2020/09/chamomile-tea-thumb-1-732x549.jpg",
//             "https://images.everydayhealth.com/images/diet-nutrition/all-about-chamomile-722x406.jpg",
//             "https://cdn.shopify.com/s/files/1/0515/3230/0457/products/Camomile_Lemongrassface1_b0aa68c7-932d-416d-80c6-2019cf7ca2d3.jpg?v=1633077969",
//             "https://cdn.shopify.com/s/files/1/0506/7037/0997/products/bwo7oivc8msuo0mojibi.jpg?v=1663887949",
//             "https://m.media-amazon.com/images/I/71PEzZNg1JL.jpg",
//             "https://post.medicalnewstoday.com/wp-content/uploads/sites/3/2023/03/benefits_chamomile_tea_732x549_thumb.jpg",
//             "https://c.ndtvimg.com/2019-04/1qk1ppl8_chamomile-tea_625x300_16_April_19.jpg?im=FaceCrop,algorithm=dnn,width=1200,height=886",
//             "https://c-ec.niceshops.com/upload/image/product/large/default/willi-dungl-organic-chamomile-tea-30-g-1830090-en.jpg",
//             "https://assets.vogue.in/photos/5d4403c6abccd5000893142b/2:3/w_2560%2Cc_limit/shutterstock_564546295.jpg",
//             "https://m.media-amazon.com/images/I/71qVgLGta9L.jpg"
//         ]
//     },
//     "dinner": {
//         "Chicken Stir-Fry": [
//             "https://www.allrecipes.com/thmb/xvlRRhK5ldXuGcXad8XDM5tTAfE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/223382_chicken-stir-fry_Rita-1x1-1-b6b835ccfc714bb6a8391a7c47a06a84.jpg",
//             "https://www.wellplated.com/wp-content/uploads/2019/07/Ginger-Teriyaki-Chicken-Stir-Fry.jpg",
//             "https://static.onecms.io/wp-content/uploads/sites/43/2022/09/13/240708-broccoli-and-chicken-stir-fry-3x4-186-copy.jpg",
//             "https://natashaskitchen.com/wp-content/uploads/2018/08/Chicken-Stir-Fry-1-1.jpg",
//             "https://www.kitchensanctuary.com/wp-content/uploads/2016/03/Quick-Chicken-Stir-Fry-square-FS.jpg",
//             "https://i2.wp.com/www.downshiftology.com/wp-content/uploads/2021/05/Chicken-Stir-Fry-main-1.jpg",
//             "https://www.saltandlavender.com/wp-content/uploads/2022/03/chicken-stir-fry-1.jpg",
//             "https://www.cookingclassy.com/wp-content/uploads/2019/12/chicken-stir-fry-1.jpg",
//             "https://www.gimmesomeoven.com/wp-content/uploads/2016/09/30-Minute-Chicken-Noodle-Stir-Fry-2.jpg",
//             "https://food-images.files.bbci.co.uk/food/recipes/vegetablechickenstir_76805_16x9.jpg"
//         ],
//         "Grilled Salmon and Quinoa": [
//             "https://www.seriouseats.com/thmb/pRFzs9JxSdwFgmcKcKh3Z1fsu3E=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__serious_eats__seriouseats.com__recipes__images__2013__03__20130308-skillet-suppers-salmon-quinoa1-92215fa78bc74c28b55b38e0dcefb0da.jpg",
//             "https://www.jessicagavin.com/wp-content/uploads/2016/02/mediterranean-spiced-salmon-over-vegetable-quinoa-1200.jpg",
//             "https://www.ourhappymess.com/wp-content/uploads/2020/01/Roasted-Salmon-Quinoa-Bowls-6.jpg",
//             "https://mission-food.com/wp-content/uploads/2017/07/Salmon-with-Quinoa-Salad-and-Arugula-Chimichurri-8.jpg",
//             "https://img.taste.com.au/geuYvSY5/taste/2016/11/quinoa-salad-with-salmon-63050-1.jpeg",
//             "https://www.eatingwell.com/thmb/RT-ah2NSs9DNZMAtrdWeju7JmfQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/7493350-be9d56bbbaf6461aa9f503b8e94462de.jpg",
//             "https://chefsheilla.com/wp-content/uploads/2017/07/Grilled-Salmon-with-Mango-Avocado-and-Quinoa-Salad-1200x900.jpg",
//             "https://www.onceuponachef.com/images/2021/05/Quinoa-Roasted-Salmon-Bowl-with-Avocado.-Cucumber-and-Green-Goddess-Dressing-scaled.jpg",
//             "https://www.eatthis.com/wp-content/uploads/sites/4/2018/12/paleo-morroccan-salmon-with-quinoa-pilaf.jpg?quality=82&strip=1",
//             "https://www.paneraathome.com/-/media/banners/salmon-quinoa-bowl.jpg"
//         ],
//         "Steak and Potatoes": [
//             "https://cravinghomecooked.com/wp-content/uploads/2022/11/garlic-butter-steak-and-potatoes-1-14.jpg",
//             "https://www.eatwell101.com/wp-content/uploads/2018/03/Garlic-Butter-flank-Steak-and-Potatoes-Skillet.jpg",
//             "https://www.spendwithpennies.com/wp-content/uploads/2021/09/Rosemary-Garlic-Steak-Potatoes-SpendWithPennies-6.jpg",
//             "https://www.lecremedelacrumb.com/wp-content/uploads/2019/03/steak-potatoes-skillet-3.jpg",
//             "https://lilluna.com/wp-content/uploads/2022/01/steak-and-potatoes-resize-12.jpg",
//             "https://therecipecritic.com/wp-content/uploads/2017/10/skilletgarlicbutterherbsteakpotatoes-1-of-1.jpg",
//             "https://www.joyfulhealthyeats.com/wp-content/uploads/2022/02/Whole30-Garlic-Butter-Steak-Potato-Skillet-web-9.jpg",
//             "https://realfood.tesco.com/media/images/RFO-1400x919-Paprika-and-Thyme-Steaks-88c35f31-6324-4b69-9058-0d941b017178-0-1400x919.jpg",
//             "https://images.getrecipekit.com/20230120072315-steakpotatoesmealprep3.JPG?width=650&quality=90&",
//             "https://simply-delicious-food.com/wp-content/uploads/2019/02/steak-and-twice-baked-potatoes-4-3.jpg"
//         ],
//         "Lasagna": [
//             "https://thecozycook.com/wp-content/uploads/2022/04/Lasagna-Recipe-f.jpg",
//             "https://www.allrecipes.com/thmb/vmL8iEleAiQJzU3s6YfEMVcvhwc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/23600-worlds-best-lasagna-armag-4x3-1-b24f9ad518d74090bf197828492c64a6.jpg",
//             "https://www.simplyrecipes.com/thmb/dA6A2pYGIsrew9YnC269pd4aKF4=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Best-Classic-Lasagna-Lead-1-b67f9c8bb82448d7ac34807d0d62244e.jpg",
//             "https://kristineskitchenblog.com/wp-content/uploads/2022/10/lasagna-recipe-16-2.jpg",
//             "https://www.tastesoflizzyt.com/wp-content/uploads/2022/12/homemade-lasagna-recipe_-8.jpg",
//             "https://thestayathomechef.com/wp-content/uploads/2017/08/Most-Amazing-Lasagna-4-2848x4272.jpg",
//             "https://cafedelites.com/wp-content/uploads/2018/01/Mamas-Best-Lasagna-IMAGE-43.jpg",
//             "https://www.jocooks.com/wp-content/uploads/2019/05/beef-lasagna-1-3.jpg",
//             "https://hips.hearstapps.com/hmg-prod/images/classic-lasagna-lead-643079215b604.jpg?crop=1xw:1xh;center,top&resize=1200:*",
//             "https://www.modernhoney.com/wp-content/uploads/2019/08/Classic-Lasagna-14-scaled.jpg"
//         ],
//         "Fish and Chips": [
//             "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Fish_and_chips_blackpool.jpg/800px-Fish_and_chips_blackpool.jpg",
//             "https://www.thespruceeats.com/thmb/k8Ejnb3LR7yrhwGirJEC2x6r1sg=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/best-fish-and-chips-recipe-434856-Hero-5b61b89346e0fb00500f2141.jpg",
//             "https://tastesbetterfromscratch.com/wp-content/uploads/2022/03/Fish-and-Chips-Web-8.jpg",
//             "https://media.timeout.com/images/105858641/image.jpg",
//             "https://cdn.tasteatlas.com/images/dishes/952be31521114ce89c8525996e17dbce.jpg?m=facebook",
//             "https://lovefoodies.com/wp-content/uploads/2020/02/British-Beer-Battered-Fish-and-ChipsF-720x540.jpg",
//             "https://www.christinascucina.com/wp-content/uploads/2021/02/fullsizeoutput_ec71.jpeg",
//             "https://foodhub.scene7.com/is/image/woolworthsltdprod/p073-fish-chips:Mobile-1300x1150",
//             "https://food-images.files.bbci.co.uk/food/recipes/lighter_fish_and_chips_06976_16x9.jpg",
//             "https://e3.365dm.com/22/06/768x432/skynews-fish-chips_5796594.jpg?20220606075557"
//         ],
//         "Vegetable Curry": [
//             "https://www.recipetineats.com/wp-content/uploads/2017/07/Vegetable-Curry.jpg",
//             "https://food-images.files.bbci.co.uk/food/recipes/vegetablecurry_80763_16x9.jpg",
//             "https://simply-delicious-food.com/wp-content/uploads/2020/09/Creamy-vegetable-curry-4.jpg",
//             "https://www.acouplecooks.com/wp-content/uploads/2020/02/Vegetable-Curry-001.jpg",
//             "https://www.inspiredtaste.net/wp-content/uploads/2021/06/Vegetable-Curry-Recipe-1200.jpg",
//             "https://img.taste.com.au/kUVCKnrN/taste/2016/11/indian-style-vegetable-curry-59371-1.jpeg",
//             "https://www.indianhealthyrecipes.com/wp-content/uploads/2022/06/mixed-vegetable-curry-recipe.jpg",
//             "https://plantbasedandbroke.com/wp-content/uploads/2021/03/Thai-Style-Vegetable-Curry-1200x1200-1.png",
//             "https://www.hummusapien.com/wp-content/uploads/2018/03/vegetable-curry.jpg",
//             "https://www.cookwithmanali.com/wp-content/uploads/2021/09/Vegetable-Chickpea-Coconut-Curry.jpg"
//         ],
//         "Roast Dinner": [
//             "https://www.kitchensanctuary.com/wp-content/uploads/2019/04/Square-FS.jpg",
//             "https://www.kimbersfarmshop.co.uk/blog-admin/wp-content/uploads/2021/10/shutterstock_53001679-scaled.jpg",
//             "https://i2-prod.dailyrecord.co.uk/incoming/article25379997.ece/ALTERNATES/s615/0_JS246322368.jpg",
//             "https://realfood.tesco.com/media/images/1400x919-OneTrayRoastDinner-17b80fd0-8071-474e-84e5-f19eb03da1b5-0-1400x919.jpg",
//             "https://hips.hearstapps.com/hmg-prod/images/one-pan-roast-dinner-delish-1645192411.jpg?crop=1xw:0.84375xh;center,top&resize=1200:*",
//             "https://www.morningadvertiser.co.uk/var/wrbm_gb_hospitality/storage/images/publications/hospitality/morningadvertiser.co.uk/pub-food/news/how-to-make-the-best-pub-roast-dinner/3147308-1-eng-GB/How-to-make-the-best-pub-roast-dinner.jpg",
//             "https://cdn.veganrecipeclub.org.uk/wp-content/uploads/2021/01/big_roast_dinner_supermarket_style-1568x1046.jpg",
//             "https://images.ctfassets.net/e7lf9n037kdg/7hvtzGJdr6MLDQ485dR0LK/1373372259fbff379bd645ab8d6e418e/roast-dinner.jpg?w=1200&h=630&fl=progressive&q=50&fm=jpg",
//             "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Sunday_roast_-_roast_beef_1.jpg/800px-Sunday_roast_-_roast_beef_1.jpg",
//             "https://www.thesun.co.uk/wp-content/uploads/2021/11/NINTCHDBPICT000347126644-1.jpg"
//         ],
//         "Shrimp Paella": [
//             "https://www.eatingwell.com/thmb/MxgMey1OuTVScFWoM8DdzyvZUWQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/shrimp-paella-1705p55-8031576-6f095b2b8b724fb1bf9dcae135d09ccf.jpg",
//             "https://www.foxandbriar.com/wp-content/uploads/2016/04/Shrimp-and-Chorizo-Paella-7-of-10.jpg",
//             "https://simpleseasonal.com/wp-content/uploads/2019/03/shrimp-paella-5-1.jpg",
//             "https://images-gmi-pmc.edge-generalmills.com/acd1145c-ed72-4efe-904c-675032ae47dc.jpg",
//             "https://www.acouplecooks.com/wp-content/uploads/2020/07/Paella-Recipe-014.jpg",
//             "https://media.blueapron.com/recipes/523/square_newsletter_images/20141219-2138-20-0808/Shrimp_20Paella--3_20SQ.jpg?quality=80&width=850&format=pjpg",
//             "https://assets.bonappetit.com/photos/57acce0453e63daf11a4da2b/master/w_1620,h_1080,c_limit/PAELLA.jpg",
//             "https://www.goya.com/media/6905/goya-shrimp-paella.jpg?quality=80",
//             "https://www.flavorquotient.com/wp-content/uploads/2017/01/Paella-FQ-3-4734.jpg",
//             "https://www.foxandbriar.com/wp-content/uploads/2016/04/Shrimp-and-Chorizo-Paella-6-of-10.jpg"
//         ],
//         "Pork Chops": [
//             "https://hips.hearstapps.com/del.h-cdn.co/assets/18/11/1600x1200/sd-aspect-1520972774-pork-chops-horizontal.jpg?resize=1200:*",
//             "https://cdn.apartmenttherapy.info/image/upload/f_jpg,q_auto:eco,c_fill,g_auto,w_1500,ar_1:1/k%2FEdit%2F2022-12-Baked-Boneless-Pork-Chops%2Fbaked-boneles-pork-chops-2",
//             "https://cdn.apartmenttherapy.info/image/upload/f_jpg,q_auto:eco,c_fill,g_auto,w_1500,ar_1:1/k%2FPhoto%2FSeries%2F2022-03_HT_Pan-fried-pork-chops%2F2022-02-22_ATK-4852",
//             "https://fitfoodiefinds.com/wp-content/uploads/2021/07/grilled-pork-chops-5-scaled.jpg",
//             "https://cafedelites.com/wp-content/uploads/2018/05/Honey-Garlic-Pork-Chops-IMAGE-54.jpg",
//             "https://hips.hearstapps.com/hmg-prod/images/grilled-pork-chops-recipe-2-1653595364.jpg?crop=0.6666666666666667xw:1xh;center,top&resize=1200:*",
//             "https://theforkedspoon.com/wp-content/uploads/2019/08/Pork-Chops-3.jpg",
//             "https://www.africanbites.com/wp-content/uploads/2023/01/IMG_7220.jpg",
//             "https://www.theendlessmeal.com/wp-content/uploads/2021/02/Tomahawk-Pork-Chop-3-scaled.jpg",
//             "https://img.taste.com.au/QbzXR8zn/w1200-h630-cfill/taste/2016/11/apple-maple-pork-chops-59031-1.jpeg"
//         ],
//         "Spaghetti Bolognese": [
//             "https://www.ocado.com/cmscontent/recipe_image_large/33362787.png?awck",
//             "https://www.recipetineats.com/wp-content/uploads/2018/07/Spaghetti-Bolognese.jpg",
//             "https://www.errenskitchen.com/wp-content/uploads/2018/08/Spaghetti-Bolognese-1-3.jpg",
//             "https://images.ctfassets.net/uexfe9h31g3m/6QtnhruEFi8qgEyYAICkyS/baae41c24d12e557bcc35c556049f43b/Spaghetti_Bolognese_Lifestyle_Full_Bleed_Recipe_Image__1__copy.jpg?w=768&h=512&fm=webp&fit=thumb&q=90",
//             "https://www.slimmingeats.com/blog/wp-content/uploads/2010/04/spaghetti-bolognese-36.jpg",
//             "https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/easy_spaghetti_bolognese_93639_16x9.jpg",
//             "https://www.sprinklesandsprouts.com/wp-content/uploads/2019/04/Authentic-Spaghetti-Bolognese-SQ.jpg",
//             "https://images.arla.com/recordid/BB387A9D-55A5-4E43-98B6EB61CF940EEA/eggplant-bolognese.jpg?width=1200&height=630&mode=crop",
//             "https://img.taste.com.au/5qlr1PkR/taste/2016/11/spaghetti-bolognese-106560-1.jpeg",
//             "https://leitesculinaria.com/wp-content/uploads/2021/09/spaghetti-bolognese.jpg"
//         ],
//         "BBQ Ribs": [
//             "https://simply-delicious-food.com/wp-content/uploads/2020/06/Sticky-BBQ-ribs-3.jpg",
//             "https://www.onceuponachef.com/images/2022/06/baby-back-ribs-18-1200x1397.jpg",
//             "https://www.allrecipes.com/thmb/gVocwHi0RMwyjfJ1g6q8VHacxJU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/22469-Barbecue-Ribs-ddmfs-4x3-208-0221b0213517493494a29c1c76a8d1cc.jpg",
//             "https://www.southernliving.com/thmb/sQ3jAjFAP-SPt_upe-Im4rxMKrQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/oven-baked-baby-back-ribs-beauty-332_preview-34579f7f15ed4548ae3bb5b2048aab60.jpg",
//             "https://www.grillseeker.com/wp-content/uploads/2022/06/sauced-pork-ribs-on-a-baoking-sheet.jpg",
//             "https://cafedelites.com/wp-content/uploads/2018/06/Oven-Pork-Ribs-IMAGE-5.jpg",
//             "https://www.recipetineats.com/wp-content/uploads/2019/08/Oven-Pork-Ribs-with-Barbecue-Sauce-SQ.jpg",
//             "https://realfood.tesco.com/media/images/49-BBQStickyRibs-LH-619f58a9-2602-4b1b-a106-8de8731d2a04-0-1400x919.jpg",
//             "https://hips.hearstapps.com/hmg-prod/images/grilled-bbq-ribs-1620766568.jpg?crop=0.8891666666666667xw:1xh;center,top&resize=1200:*",
//             "https://www.allrecipes.com/thmb/I2ENWJQG1mb2b5OSXPqQudzlzJw=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/220987-Baked-BBQ-Baby-Back-Ribs-mfs-041-77a42b0ce0f0424e9aeec2b22664f1aa.jpg"
//         ],
//         "Tofu Stir Fry": [
//             "https://www.wellplated.com/wp-content/uploads/2019/03/How-to-Make-Tofu-Stir-Fry.jpg",
//             "https://simpleveganblog.com/wp-content/uploads/2023/01/easy-tofu-stir-fry-square.jpg",
//             "https://jessicainthekitchen.com/wp-content/uploads/2022/07/Vegan-Stir-Fry01030.jpg",
//             "https://minimalistbaker.com/wp-content/uploads/2013/10/Easy-Tofu-Stirfry-minimalistbaker.com_.jpg",
//             "https://khinskitchen.com/wp-content/uploads/2020/06/tofu.jpg",
//             "https://hips.hearstapps.com/hmg-prod/images/190130-tofu-stir-fry-horizontal-150-1549302524.jpg",
//             "https://plantbasedonabudget.com/wp-content/uploads/2013/03/Spicy-Sesame-Tofu-Stir-fry-Plant-Based-on-a-Budget-1-2.jpg",
//             "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/bb9e3ae6c1014c4881c812081c124768/BFV32770_6HighProteinVegetarianDinners_FB.jpg?resize=1200:*&output-format=jpg&output-quality=auto",
//             "https://rainbowplantlife.com/wp-content/uploads/2023/01/tofu-stir-fry-cover-photo-1-of-1.jpg",
//             "https://theplantbasedschool.com/wp-content/uploads/2022/11/Tofu-stir-fry-2-1.jpg"
//         ],
//         "Chicken Parmesan": [
//             "https://www.southernliving.com/thmb/rQaGDkAPGa_MeU4eglrAaeuexjg=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/southern-living-chicken-parmesan-ddmfs-0047-fe218cb392784e79bfb4bb586685d6f9.jpg",
//             "https://tastesbetterfromscratch.com/wp-content/uploads/2023/03/Chicken-Parmesan-1.jpg",
//             "https://thestayathomechef.com/wp-content/uploads/2022/08/Best-Chicken-Parmesan-4.jpg",
//             "https://thecleaneatingcouple.com/wp-content/uploads/2021/11/baked-chicken-parmesan-1.jpg",
//             "https://assets.bonappetit.com/photos/5ea8f0df16738800085ad5d2/1:1/w_2560%2Cc_limit/Chicken-Parmesean-Recipe-Lede.jpg",
//             "https://www.allrecipes.com/thmb/J0U0wHxsY1r-I1JUJ5jXcwCnzRI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/223042-Chicken-Parmesan-mfs_001-7ab952346edc4b2da36f3c0259b78543.jpg",
//             "https://www.jocooks.com/wp-content/uploads/2019/04/chicken-parmesan-1-32.jpg",
//             "https://easychickenrecipes.com/wp-content/uploads/2022/01/Featured-Fried-Chicken-Parmesan-1.jpg",
//             "https://azestybite.com/wp-content/uploads/2011/07/Chicken-Parm-2341.jpg",
//             "https://www.eatingwell.com/thmb/-VdU_t8MI___brO6ez2AJO6G8dA=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Baked-Chicken-Parmesan-1x1-0879-64e37fdc79804c18a81f4b805c5226b7.jpg"
//         ],
//         "Lamb Stew": [
//             "https://hips.hearstapps.com/hmg-prod/images/190326-lamb-stew-325-1553801000.jpg?crop=0.668xw:1.00xh;0.148xw,0.00255xh&resize=1200:*",
//             "https://images.immediate.co.uk/production/volatile/sites/30/2021/12/Easy-lamb-stew-c9e1f16.jpg",
//             "https://natashaskitchen.com/wp-content/uploads/2018/03/Lamb-Stew-5.jpg",
//             "https://sweetandsavorymeals.com/wp-content/uploads/2020/01/lamb-stew-recipe.jpg",
//             "https://natashaskitchen.com/wp-content/uploads/2018/03/Lamb-Stew-2.jpg",
//             "https://www.thespruceeats.com/thmb/-Jl7dmiRNmLiC97BfIPzQLHzols=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/irish-lamb-stew-recipe-1809131-Hero-5b8bf14e46e0fb0025fa2a9b.jpg",
//             "https://www.allrecipes.com/thmb/czhouPlxJo62_tjKNYBI-7a_0hc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/16035_Irish-Lamb-Stew_ddmfs_2x1_1625-0f81ce5af7164c14a98859a2177b70be.jpg",
//             "https://www.bowlofdelicious.com/wp-content/uploads/2017/11/Irish-Lamb-and-Potato-Stew-square.jpg",
//             "https://recipe30.com/wp-content/uploads/2021/03/Lamb-stew.jpg",
//             "https://sweetandsavorymeals.com/wp-content/uploads/2020/01/slow-cooker-lamb-stew.jpg"
//         ],
//         "Vegetarian Pizza": [
//             "https://cookieandkate.com/images/2020/10/best-veggie-pizza-recipe-1.jpg",
//             "https://cdn.loveandlemons.com/wp-content/uploads/2023/02/vegetarian-pizza.jpg",
//             "https://www.twopeasandtheirpod.com/wp-content/uploads/2021/03/Veggie-Pizza-8.jpg",
//             "https://theclevermeal.com/wp-content/uploads/2021/10/veggie-pizza-recipes_002.jpg",
//             "https://www.thursdaynightpizza.com/wp-content/uploads/2022/06/veggie-pizza-featured-image-3.png",
//             "https://www.simplyrecipes.com/thmb/wyfKZ6r4an5GdL19fFiAFlgr19c=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Vegetarian-Pizza-LEAD-5-03d81aaf35f24e5b99de36d2c29c15eb.jpg",
//             "https://www.blessthismessplease.com/wp-content/uploads/2020/05/veggie-pizza-recipe-5-of-8.jpg",
//             "https://i0.wp.com/www.thursdaynightpizza.com/wp-content/uploads/2022/06/veggie-pizza-side-view-out-of-oven.png?resize=720%2C480&ssl=1",
//             "https://www.goodlifeeats.com/wp-content/uploads/2022/06/Vegetarian-Pizza-720x720.jpg",
//             "https://cdn.loveandlemons.com/wp-content/uploads/2018/09/vegan-pizza.jpg"
//         ]
//     },
//     "dessert": {
//         "Ice Cream Sundae": [
//             "https://www.keep-calm-and-eat-ice-cream.com/wp-content/uploads/2022/08/Ice-cream-sundae-hero-11.jpg",
//             "https://realfood.tesco.com/media/images/RFO-1400x919-Strawberry-sharing-sundae-12692ed4-8c60-4366-847f-a73c945801fc-0-1400x919.jpg",
//             "https://icecreamfromscratch.com/wp-content/uploads/2022/05/Ice-Cream-Sundae-1.2-735x1103.jpg",
//             "https://www.sainsburysmagazine.co.uk/uploads/media/3200x1800/04/13534-peach-ice-cream-sundae.jpg?v=1-0",
//             "https://hips.hearstapps.com/hmg-prod/images/dsc03299-sc-1623764031.jpg",
//             "https://assets.rbl.ms/21919567/origin.jpg",
//             "https://dinnerthendessert.com/wp-content/uploads/2021/02/Ice-Cream-Sundae-2.jpg",
//             "https://www.keep-calm-and-eat-ice-cream.com/wp-content/uploads/2020/10/Chocolate-sundae-square.png",
//             "https://images.ctfassets.net/qu53tdnhexvd/2FW4qEI966rN9qpLXaSTLv/665b36a27c78dc40c95532dfcb44aa3f/ice_cream_sundae.jpg",
//             "https://www.elmlea.com/-/media/Project/Upfield/Whitelabels/Elmlea/Assets/Recipes/Synced-images/ad951bd9-558a-416d-b645-8aa02829b6ce.jpg?rev=cbc0ed05bc36413fa0803c45390d5abd&w=1600"
//         ],
//         "Chocolate Cake": [
//             "https://sallysbakingaddiction.com/wp-content/uploads/2013/04/triple-chocolate-cake-4.jpg",
//             "https://food-images.files.bbci.co.uk/food/recipes/easy_chocolate_cake_31070_16x9.jpg",
//             "https://www.mybakingaddiction.com/wp-content/uploads/2011/10/lr-0939-700x1050.jpg",
//             "https://hips.hearstapps.com/hmg-prod/images/raspberry-layer-cake-recipe-2-1668193557.jpg?crop=0.468xw:0.936xh;0.391xw,0&resize=1200:*",
//             "https://butternutbakeryblog.com/wp-content/uploads/2023/04/chocolate-cake.jpg",
//             "https://cdn.easypeasy-lemonsqueezy.co.uk/wp-content/uploads/2018/10/IMG_3155.jpg",
//             "https://www.hummingbirdhigh.com/wp-content/uploads/2021/10/my-best-chocolate-birthday-cake_01_IMG_4223.jpg",
//             "https://prettysimplesweet.com/wp-content/uploads/2021/04/chocolate-birthday-cake.jpg",
//             "https://www.sainsburysmagazine.co.uk/uploads/media/720x770/04/4354-Birthday-Cake-1120.jpg?v=1-0",
//             "https://static.toiimg.com/thumb/53096885.cms?imgsize=1572013&width=800&height=800"
//         ],
//         "Fruit Salad": [
//             "https://www.allrecipes.com/thmb/pXqfb4xf-T3a-trkKdu-SCfC1hI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/2289556-0981629410f0446d9bec11f0a9ece43c.jpg",
//             "https://hips.hearstapps.com/hmg-prod/images/pasta-salad-horizontal-jpg-1522265695.jpg?crop=0.6668xw:1xh;center,top&resize=1200:*",
//             "https://fitfoodiefinds.com/wp-content/uploads/2020/05/salad-1.jpg",
//             "https://www.cookingclassy.com/wp-content/uploads/2019/05/fruit-salad-2.jpg",
//             "https://shwetainthekitchen.com/wp-content/uploads/2021/08/Fruit-Salad-with-Condensed-Milk.jpg",
//             "https://cheflolaskitchen.com/wp-content/uploads/2022/08/fruit-salad-10.jpg",
//             "https://www.southernliving.com/thmb/5VE-k5Gb1faNUAN4fU8nFi_YX9Q=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Southern-Living-Cheesecake_Fruit_Salad_005-a8903364d8424303b6235a4e6c7a6572.jpg",
//             "https://i0.wp.com/kristineskitchenblog.com/wp-content/uploads/2020/06/fruit-salad-1200-2382.jpg?fit=1200%2C1800&ssl=1",
//             "https://www.themediterraneandish.com/wp-content/uploads/2023/02/Winter-Fruit-Salad_9.jpg",
//             "https://herbsandflour.com/wp-content/uploads/2019/11/Summer-Fruit-Salad.jpg"
//         ],
//         "Cheesecake": [
//             "https://www.onceuponachef.com/images/2017/12/cheesecake-1200x1393.jpg",
//             "https://images.immediate.co.uk/production/volatile/sites/30/2022/10/No-bake-raspberry-cheesecake-cc1ee62.jpg?quality=90&resize=960,872",
//             "https://static.onecms.io/wp-content/uploads/sites/43/2022/07/05/8350-chantals-new-york-ddmfs-cheesecake-3x4-311.jpg",
//             "https://therecipecritic.com/wp-content/uploads/2022/07/oreocheesecake-2-1.jpg",
//             "https://joyfoodsunshine.com/wp-content/uploads/2022/03/best-cheesecake-recipe-6.jpg",
//             "https://static01.nyt.com/images/2021/11/02/dining/dg-Tall-and-Creamy-Cheesecake/dg-Tall-and-Creamy-Cheesecake-mediumSquareAt3X.jpg",
//             "https://thecozyplum.com/wp-content/uploads/2022/07/1x1-chocolate-marble-cheesecake-1.jpg",
//             "https://sugarspunrun.com/wp-content/uploads/2019/01/Best-Cheesecake-Recipe-2-1-of-1-4.jpg",
//             "https://juliemarieeats.com/wp-content/uploads/2023/02/Biscoff-Cheesecake-1.jpg",
//             "https://assets.epicurious.com/photos/62bdc36d9de40a39de6bd598/3:2/w_6948,h_4632,c_limit/Cheesecake_RECIPE_062922_36317.jpg"
//         ],
//         "Apple Pie": [
//             "https://images.immediate.co.uk/production/volatile/sites/30/2019/05/Apple-pie-eccbfb3.jpg",
//             "https://www.recipetineats.com/wp-content/uploads/2022/11/Apple-Pie_8.jpg",
//             "https://www.delscookingtwist.com/wp-content/uploads/2021/10/Classic-Apple-Pie_6.jpg",
//             "https://www.inspiredtaste.net/wp-content/uploads/2022/11/Apple-Pie-Recipe-Video.jpg",
//             "https://hips.hearstapps.com/hmg-prod/images/apple-pie-index-6425bd0363f16.jpg?crop=0.8888888888888888xw:1xh;center,top&resize=1200:*",
//             "https://kristineskitchenblog.com/wp-content/uploads/2021/04/apple-pie-1200-square-592-2.jpg",
//             "https://www.allrecipes.com/thmb/A7WiMNVXujJonJx1djOPne6zqMU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/762929-sundays-apple-pie-SMClanton-4x3-1-373c2bca34b44d04a8f32f1d6ace4932.jpg",
//             "https://www.bhg.com/thmb/uUnhiZNf_742Ou8BCfu_33eaH5c=/2652x0/filters:no_upscale():strip_icc()/Apple-pie-AQUoSCYHa7HBCZVOKNKAyV-58451a55556f4384b518162342770819.jpg",
//             "https://inbloombakery.com/wp-content/uploads/2021/11/new-apple-pie-13-of-19.jpg",
//             "https://www.wearesovegan.com/wp-content/uploads/2020/04/veganmcdonaldsapplepierecipe-h1.jpg"
//         ],
//         "Brownie": [
//             "https://upload.wikimedia.org/wikipedia/commons/6/68/Chocolatebrownie.JPG",
//             "https://images.immediate.co.uk/production/volatile/sites/30/2020/10/Gooey-Brownies-5627e49.jpg?resize=768,574",
//             "https://handletheheat.com/wp-content/uploads/2017/03/Chewy-Brownies-Square-1.jpg",
//             "https://www.inspiredtaste.net/wp-content/uploads/2016/06/Brownies-Recipe-1-1200.jpg",
//             "https://cdn.loveandlemons.com/wp-content/uploads/2020/01/brownie-recipe.jpg",
//             "https://img.buzzfeed.com/video-api-prod/assets/fafe8090b4f3434f80c33b6e4ce40e24/BFV21539_BestFudgyBrownies-ThumbB1080.jpg?resize=1200:*",
//             "https://www.sainsburysmagazine.co.uk/media/12840/download/Choc_Brownies.jpg?v=1",
//             "https://cafedelites.com/wp-content/uploads/2018/02/Best-Fudgiest-Brownies-IMAGE-1001.jpg",
//             "https://static.onecms.io/wp-content/uploads/sites/43/2022/09/12/25080-mmmmm-brownies-ddmfs-4x3-0075.jpg",
//             "https://www.thereciperebel.com/wp-content/uploads/2022/05/brownie-sundae-TRR-1200-25-of-40.jpg"
//         ],
//         "Panna Cotta": [
//             "https://assets.epicurious.com/photos/62d6c513077a952f4a8c338c/1:1/w_2848,h_2848,c_limit/PannaCotta_RECIPE_04142022_9822_final.jpg",
//             "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Panna_cotta_a_una_pizzeria_del_carrer_de_Baix%2C_Val%C3%A8ncia.jpg/1200px-Panna_cotta_a_una_pizzeria_del_carrer_de_Baix%2C_Val%C3%A8ncia.jpg",
//             "https://www.cookingclassy.com/wp-content/uploads/2021/05/panna-cotta-01.jpg",
//             "https://cdn.apartmenttherapy.info/image/upload/v1558424450/k/archive/7ed63c9c6146cde6ea5a4d801cd702d79792670d.jpg",
//             "https://leitesculinaria.com/wp-content/uploads/2020/01/panna-cotta.jpg",
//             "https://static.onecms.io/wp-content/uploads/sites/43/2022/07/28/72567_Panna-Cotta_Melissa-Goff_5125477_original-4x3-1.jpg",
//             "https://hips.hearstapps.com/hmg-prod/images/delish-202102-pannacotta-024-ls-1612544700.jpg?crop=0.8888888888888888xw:1xh;center,top&resize=1200:*",
//             "https://www.laylita.com/recipes/wp-content/uploads/2013/02/Red-white-and-blue-pannacotta-dessert.jpg",
//             "https://img.taste.com.au/wWv7e6x-/taste/2019/08/panna-cotta-with-roasted-strawberries-taste-153207-1.jpg",
//             "https://liliebakery.fr/wp-content/uploads/2021/04/Panna-Cotta-Cafe-Vanille-Penchee-Lilie-Bakery.jpg"
//         ],
//         "Raspberry Tart": [
//             "https://food-images.files.bbci.co.uk/food/recipes/fresh_raspberry_tartlets_06318_16x9.jpg",
//             "https://www.beyondthechickencoop.com/wp-content/uploads/2022/08/Raspberry-Tart.jpg",
//             "https://www.abakingjourney.com/wp-content/uploads/2023/03/Raspberry-Tart-Feature.jpg",
//             "https://thehappyfoodie.co.uk/wp-content/uploads/2021/08/tart-2aac3104-5d49-4cbd-bf1d-32d0c1780104_s900x0_c2245x1311_l0x774.jpg",
//             "https://mediterraneantaste.com/wp-content/uploads/2022/07/Raspberry-Tart-3-1482-scaled.jpg",
//             "https://d3lp4xedbqa8a5.cloudfront.net/s3/digital-cougar-assets/food/2015/08/21/26975/Raspberry-flan01.jpg?width=600&height=315&quality=75&mode=crop",
//             "https://www.simplyrecipes.com/thmb/8rd3WCKMH03MKm5ea3fFFgtghBI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__simply_recipes__uploads__2012__12__raspberry-walnut-tart-horiz-a-1600-448ed8d2ef984846a765034ce06b8bbf.jpg",
//             "https://w4s8p5t8.rocketcdn.me/wp-content/uploads/2023/02/raspberry-tart-vegan.jpg.webp",
//             "https://i0.wp.com/www.pardonyourfrench.com/wp-content/uploads/2019/07/raspberry-pistachio-frangipane-tart-19.jpg?fit=2263%2C3395&ssl=1",
//             "https://wsl-media.walkersshortbread.com/media.walkers.com/walkers_site/2020/08/11114753/Vanilla-Shortbread-Raspberry-Tart-Main-800-x-800.jpg"
//         ],
//         "Creme Brulee": [
//             "https://www.livewellbakeoften.com/wp-content/uploads/2019/02/Homemade-Creme-Brulee-9.jpg",
//             "https://simplyhomecooked.com/wp-content/uploads/2023/01/creme-brulee-recipe-6.jpg",
//             "https://static01.nyt.com/images/2017/12/13/dining/15COOKING-CREME-BRULEE1/15COOKING-CREME-BRULEE1-mobileMasterAt3x-v2.jpg",
//             "https://www.onceuponachef.com/images/2023/02/Creme-brulee-1-1200x814.jpg",
//             "https://www.seriouseats.com/thmb/USpfCul06w7RVj3yLWW1iCZ0p6M=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/20230208-CremeBrulee-AmandaSuarez-hero-5fa5d07a77c4474a9c1bb6165d5c402b.JPG",
//             "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/2014_0531_Cr%C3%A8me_br%C3%BBl%C3%A9e_Doi_Mae_Salong_%28cropped%29.jpg/1200px-2014_0531_Cr%C3%A8me_br%C3%BBl%C3%A9e_Doi_Mae_Salong_%28cropped%29.jpg",
//             "https://simply-delicious-food.com/wp-content/uploads/2022/12/Creme-Brulee8.jpg",
//             "https://confessionsofabakingqueen.com/wp-content/uploads/2019/10/vanilla-bean-creme-brulee-recipe-1-of-1-2.jpg",
//             "https://lechefswife.com/wp-content/uploads/2022/03/089A0942.jpg",
//             "https://www.simplyrecipes.com/thmb/2geoVnKSqcOX2cw28Uv4mzK-LtY=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__simply_recipes__uploads__2018__02__Creme-Brulee-LEAD-50a2a2b099d840ce8796c2e2793f254f.jpg"
//         ],
//         "Chocolate Mousse": [
//             "https://www.onceuponachef.com/images/2019/04/Chocolate-Mousse.jpg",
//             "https://www.recipetineats.com/wp-content/uploads/2018/09/Chocolate-Mousse_9.jpg",
//             "https://celebratingsweets.com/wp-content/uploads/2021/01/Easy-Chocolate-Mousse-1-2.jpg",
//             "https://www.seriouseats.com/thmb/TtV_aY4oX03O2rXjOwIOmSWuuSw=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/20230217-Chocolate-Mousse-AmandaSuarez-hero-c88c2ce9afde47d09a8b9d8d57e4434c.jpg",
//             "https://thescranline.com/wp-content/uploads/2021/06/Double-Choc-Mousse-Cake-WEB-01.jpg",
//             "https://realfood.tesco.com/media/images/RFO-1400x919-classic-chocolate-mousse-69ef9c9c-5bfb-4750-80e1-31aafbd80821-0-1400x919.jpg",
//             "https://cookiesandcups.com/wp-content/uploads/2018/05/Easy-Chocolate-Mousse-17.jpg",
//             "https://rainbowplantlife.com/wp-content/uploads/2022/12/COVER-vegan-chocolate-mousse-1-of-1.jpg",
//             "https://www.deliciousmagazine.co.uk/wp-content/uploads/2022/04/DEL_2022_Q1_DAN_JONES_MOUSSE_AU_CHOCOLAT_960-x-1200-768x960.jpg",
//             "https://www.simplyrecipes.com/thmb/UlDAPmXvG5kMr--0ZgWcK_GvKMc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__simply_recipes__uploads__2005__10__Chocolate-Mousse-LEAD-3-cacdb5f8258a494cbb4398804e74cbd4.jpg"
//         ],
//         "Strawberry Shortcake": [
//             "https://celebratingsweets.com/wp-content/uploads/2018/06/Strawberry-Shortcake-Cake-1-1.jpg",
//             "https://static01.nyt.com/images/2023/03/13/multimedia/NHJ-Strawberry-Shortcake-qtkw/NHJ-Strawberry-Shortcake-qtkw-threeByTwoMediumAt2X.jpg",
//             "https://www.saveur.com/uploads/2007/03/Strawberry-shortcake-Recipe-Saveur-11-scaled.jpg?auto=webp",
//             "https://hips.hearstapps.com/hmg-prod/images/strawberry-short-cake-1528726234.jpg?crop=0.8888888888888888xw:1xh;center,top&resize=1200:*",
//             "https://lilluna.com/wp-content/uploads/2020/01/easy-strawberry-shortcake-4-scaled.jpg",
//             "https://www.swankyrecipes.com/wp-content/uploads/2015/04/Easy-Strawberry-Shortcake-recipe.jpg",
//             "https://i8b2m3d9.stackpathcdn.com/wp-content/uploads/2020/08/Strawberry_Shortcake_5140sq.jpg",
//             "https://www.simplyrecipes.com/thmb/MOiPxksxKYJlK3f9Ad3yFCU8_cE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Strawberry-Shortcake-LEAD-08-498ad09338e54c9995ea8ba561dd285b.jpg",
//             "https://i2.wp.com/lmld.org/wp-content/uploads/2021/06/Strawberry-Shortcake-B.jpg",
//             "https://www.onceuponachef.com/images/2018/07/Strawberry-Shortcake.jpg"
//         ],
//         "Tiramisu": [
//             "https://sallysbakingaddiction.com/wp-content/uploads/2019/06/homemade-tiramisu-2.jpg",
//             "https://recipetineats.com/wp-content/uploads/2016/03/Tiramisu_5.jpg",
//             "https://tastesbetterfromscratch.com/wp-content/uploads/2017/04/Tiramisu-15.jpg",
//             "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Tiramisu_-_Raffaele_Diomede.jpg/800px-Tiramisu_-_Raffaele_Diomede.jpg",
//             "https://static.onecms.io/wp-content/uploads/sites/43/2022/04/07/21412-tiramisu-ii-3x2-119.jpg",
//             "https://static01.nyt.com/images/2017/04/05/dining/05COOKING-TIRAMISU1/05COOKING-TIRAMISU1-master768.jpg",
//             "https://www.elmundoeats.com/wp-content/uploads/2020/12/FP-10-Minute-Eggless-Tiramisu-For-Two-2.jpg",
//             "https://i0.wp.com/www.livewellbakeoften.com/wp-content/uploads/2021/01/Tiramisu.jpg?resize=682%2C1024&ssl=1",
//             "https://assets.bonappetit.com/photos/5cad19a64692d487058bb33e/1:1/w_2560%2Cc_limit/old-school-tiramisu.jpg",
//             "https://i.shgcdn.com/269063bf-d72d-41dd-b848-9b30657696e6/-/format/auto/-/preview/3000x3000/-/quality/lighter/"
//         ],
//         "Lemon Meringue Pie": [
//             "https://images.immediate.co.uk/production/volatile/sites/2/2021/04/lemon-meringue-pie-8964b05-e1648552163658.jpg",
//             "https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/marys_lemon_meringue_pie_02330_16x9.jpg",
//             "https://www.simplyrecipes.com/thmb/rF8XOzgj9Nckb3tqildoB47lR50=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__simply_recipes__uploads__2016__05__lemon-meringue-pie-horiz-b-1600-1a6b24442df3465ca6bbed2ffc13b13c.jpg",
//             "https://images-gmi-pmc.edge-generalmills.com/a910e898-ce3a-4d64-a6e0-a6580559d6ae.jpg",
//             "https://www.livingnorth.com/images/media/articles/food-and-drink/recipes/Janes%20Pattiserie/Lemon%20Meringue_Featured%20Image.jpg?fm=pjpg&w=1000&q=95",
//             "https://www.sainsburysmagazine.co.uk/media/9094/download/Lemon_Meringue.jpg?v=1",
//             "https://www.onceuponachef.com/images/2018/04/Lemon-Meringue-Pie-1.jpg",
//             "https://www.allthingsmamma.com/wp-content/uploads/2022/03/lemon-meringue-pie-hero-1-scaled.jpg",
//             "https://hips.hearstapps.com/hmg-prod/images/classic-lemon-meringue-pie-recipe-1620842863.jpg?crop=0.673xw:1.00xh;0.0994xw,0&resize=1200:*",
//             "https://www.thespruceeats.com/thmb/lV7hkvnA9Yyau8HYqwgBnELfUKo=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/easy-lemon-meringue-pie-1665109_hero-01-062327825768499a9c5407346ea709d8.jpg"
//         ],
//         "Carrot Cake": [
//             "https://hips.hearstapps.com/hmg-prod/images/carrot-cake-index-641a055e1a654.jpg?crop=0.6663830993903304xw:1xh;center,top&resize=1200:*",
//             "https://static01.nyt.com/images/2020/11/01/dining/Carrot-Cake-textless/Carrot-Cake-textless-threeByTwoMediumAt2X.jpg",
//             "https://www.glorioustreats.com/wp-content/uploads/2014/05/best-carrot-cake-recipe-square.jpeg",
//             "https://natashaskitchen.com/wp-content/uploads/2023/03/Carrot-Cake-SQ1.jpg",
//             "https://joyfoodsunshine.com/wp-content/uploads/2022/02/best-carrot-cake-recipe-9.jpg",
//             "https://www.spoonforkbacon.com/wp-content/uploads/2021/03/carrot_cake_recipe_card.jpg",
//             "https://www.allrecipes.com/thmb/E4-nj0jW0-uvyfSBRs4q3UfrmyE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/2292660-607ef53b28d345bb8e58dc52e6399438.jpg",
//             "https://inbloombakery.com/wp-content/uploads/2022/04/carrot-cake-featured-image.jpg",
//             "https://bromabakery.com/wp-content/uploads/2020/02/The-Best-Carrot-Cake-4.jpg",
//             "https://www.simplyrecipes.com/thmb/_l8OtZTLIyokmHPivpVd7pj6TmE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Carrot-Cake-LEAD-2-ee84b69b246140ab807010b1b4d4426d.jpg"
//         ],
//         "Baklava": [
//             "https://www.simplyrecipes.com/thmb/3S8HtOSKvpoQmw4wgo5yCW2qjVE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Baklava-LEAD-11-b2a228e6db9f43d697ae3aed378d0b2a.jpg",
//             "https://www.allrecipes.com/thmb/LC_td-hRsYLeMiOF6Y4Z9Ocv19E=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/9454-greek-baklava-s-tuttle-71eff77a5e3e4ceb94c1d48bafec55f1.jpeg",
//             "https://upload.wikimedia.org/wikipedia/commons/c/c7/Baklava%281%29.png",
//             "https://www.modernhoney.com/wp-content/uploads/2023/03/Baklava-8-crop-scaled.jpg",
//             "https://www.swankyrecipes.com/wp-content/uploads/2020/03/Turkish-Pistachio-Baklava.jpg",
//             "https://cleobuttera.com/wp-content/uploads/2018/03/lifted-baklava.jpg",
//             "https://www.thedeliciouscrescent.com/wp-content/uploads/2019/05/Baklava-Recipe-8.jpg",
//             "https://feelgoodfoodie.net/wp-content/uploads/2023/03/Pistachio-Baklava-14.jpg",
//             "https://cdn.tasteatlas.com/images/recipes/105a4e88dca44f4a81dbaf6ccb7b83bc.jpg",
//             "https://simplyhomecooked.com/wp-content/uploads/2021/09/baklava-recipe-3.jpg"
//         ]
//     }
// }

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
}

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
