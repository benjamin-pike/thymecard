import { DateTime, Duration } from 'luxon';
import seedrandom from 'seedrandom';
import { IEvent } from '@/lib/global.types';
import { EEventType } from '@thymecard/types';

export const generateMockPlannerData = (startDate: string, endDate: string, seed: number, volume = 0.5): Record<string, IEvent[]> => {
    type PartOfDay = 'morning' | 'afternoon' | 'evening';

    const EVENT_TYPES = {
        morning: [EEventType.BREAKFAST, EEventType.SNACK, EEventType.ACTIVITY] as const,
        afternoon: [EEventType.LUNCH, EEventType.SNACK, EEventType.ACTIVITY] as const,
        evening: [EEventType.DINNER, EEventType.DESSERT, EEventType.DRINK, EEventType.ACTIVITY] as const
    } as const;

    const EVENT_NAMES = {
        [EEventType.ACTIVITY]: [
            'Yoga',
            'Bike Ride',
            'Meditation',
            'Hiking',
            'Swimming',
            'Gym Workout',
            'Jogging',
            'Basketball',
            'Soccer',
            'Tennis',
            'Dance Class',
            'Aerobics',
            'Boxing',
            'Pilates',
            'Weight Training',
            'Rowing',
            'Cycling',
            'Kickboxing',
            'Zumba',
            'Tai Chi'
        ],
        [EEventType.BREAKFAST]: [
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
        [EEventType.SNACK]: [
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
        [EEventType.LUNCH]: [
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
        [EEventType.DRINK]: [
            'Iced Coffee',
            'Green Smoothie',
            'Lemonade',
            'Iced Tea',
            'Fresh Juice',
            'Protein Shake',
            'Water',
            'Ginger Tea',
            'Hot Chocolate',
            'Espresso',
            'Latte',
            'Matcha Latte',
            'Coconut Water',
            'Herbal Tea',
            'Chamomile Tea'
        ],
        [EEventType.APPETIZER]: [
            'Bruschetta',
            'Chicken Wings',
            'Spring Rolls',
            'Garlic Bread',
            'Nachos',
            'Hummus',
            'Guacamole',
            'Mozzarella Sticks',
            'Baked Brie',
            'Stuffed Mushrooms',
            'Meatballs',
            'Deviled Eggs',
            'Bacon Wrapped Dates',
            'Fried Calamari',
            'Crab Cakes'
        ],
        [EEventType.DINNER]: [
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
        [EEventType.DESSERT]: [
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
    } as const;

    const EVENT_TIME_RANGE = {
        morning: ['07:00', '10:00'],
        afternoon: ['12:00', '15:00'],
        evening: ['18:00', '21:00']
    };

    const EVENT_DURATION: Record<EEventType, number[]> = {
        [EEventType.BREAKFAST]: [15, 30],
        [EEventType.SNACK]: [15, 20],
        [EEventType.ACTIVITY]: [30, 45, 60, 75, 90],
        [EEventType.LUNCH]: [15, 30, 45],
        [EEventType.DRINK]: [15, 20, 25],
        [EEventType.APPETIZER]: [15, 20, 30],
        [EEventType.DINNER]: [30, 45, 60],
        [EEventType.DESSERT]: [15, 20, 30]
    };

    const getRandomIndex = (length: number, rng: seedrandom.PRNG): number => {
        return Math.floor(rng() * length);
    };

    const getRandomEventName = (eventType: EEventType, rng: seedrandom.PRNG): string => {
        const names = EVENT_NAMES[eventType];
        return names[getRandomIndex(names.length, rng)];
    };

    const getRandomTime = (start: string, end: string, date: DateTime, rng: seedrandom.PRNG): DateTime => {
        const startDateTime = DateTime.fromISO(`${date.toISODate()}T${start}`);
        const endDateTime = DateTime.fromISO(`${date.toISODate()}T${end}`);
        const diffInMinutes = endDateTime.diff(startDateTime, 'minutes').minutes;
        const randomMinutes = Math.round(getRandomIndex(diffInMinutes, rng) / 15) * 15;

        return startDateTime.plus(Duration.fromObject({ minutes: randomMinutes }));
    };

    const getRandomDuration = (eventType: EEventType, rng: seedrandom.PRNG): number => {
        const durations = EVENT_DURATION[eventType];
        return durations[getRandomIndex(durations.length, rng)];
    };

    const createRandomDay = (date: DateTime, rng: seedrandom.PRNG): IEvent[] => {
        const daySequence = [];
        for (const partOfDay in EVENT_TYPES) {
            const eventList = EVENT_TYPES[partOfDay as PartOfDay];
            const [start, end] = EVENT_TIME_RANGE[partOfDay as PartOfDay];

            for (const eventType of eventList) {
                if (rng() < volume) {
                    const startTime = getRandomTime(start, end, date, rng);
                    const duration = getRandomDuration(eventType, rng);

                    const startTimeStr = startTime.toISOTime()?.split(':').slice(0, 2).join(':'); // Only take hh:mm part
                    if (startTimeStr) {
                        if (!daySequence.length || daySequence[daySequence.length - 1].time <= startTimeStr) {
                            daySequence.push({
                                time: startTimeStr,
                                type: eventType,
                                name: getRandomEventName(eventType, rng),
                                duration: duration
                            });
                        }
                    }
                }
            }
        }

        daySequence.sort((a, b) => a.time.localeCompare(b.time));

        const finalSequence = [];
        let currentEndTime = DateTime.fromISO(`${date.toISODate()}T00:00`);
        for (const event of daySequence) {
            const eventStartTime = DateTime.fromISO(`${date.toISODate()}T${event.time}`);
            if (eventStartTime >= currentEndTime) {
                finalSequence.push(event);
                currentEndTime = eventStartTime.plus({ minutes: event.duration });
            }
        }
        return finalSequence;
    };

    const rng = seedrandom(seed.toString());
    const start = DateTime.fromISO(startDate);
    const end = DateTime.fromISO(endDate);

    let currentDate = start;
    const data: Record<string, IEvent[]> = {};

    while (currentDate <= end) {
        const dayEvents = createRandomDay(currentDate, rng);
        const currentDateIso = currentDate.toISODate();
        if (currentDateIso) {
            data[currentDateIso] = dayEvents;
        }

        currentDate = currentDate.plus({ days: 1 });
    }

    return data;
};
