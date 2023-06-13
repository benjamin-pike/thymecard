export interface IEvent {
    time: string;
    type: string;
    name: string;
    duration: number;
}

export type PlannerData = Record<string, IEvent[]>;

export const mockData: PlannerData = {
    '2023-01-01': [
        {
            type: 'activity',
            name: 'Hiking',
            duration: 90,
            time: '09:50'
        },
        {
            type: 'lunch',
            name: 'Quinoa Salad',
            duration: 45,
            time: '14:15'
        },
        {
            type: 'dinner',
            name: 'Pork Chops',
            duration: 60,
            time: '20:15'
        }
    ],
    '2023-01-02': [
        {
            type: 'snack',
            name: 'Trail Mix',
            duration: 15,
            time: '07:20'
        },
        {
            type: 'activity',
            name: 'Yoga',
            duration: 45,
            time: '08:40'
        },
        {
            type: 'lunch',
            name: 'Burrito',
            duration: 30,
            time: '12:30'
        },
        {
            type: 'snack',
            name: 'Mixed Nuts',
            duration: 20,
            time: '13:10'
        },
        {
            type: 'activity',
            name: 'Aerobics',
            duration: 30,
            time: '19:15'
        }
    ],
    '2023-01-03': [
        {
            type: 'snack',
            name: 'Popcorn',
            duration: 20,
            time: '09:15'
        },
        {
            type: 'activity',
            name: 'Gym Workout',
            duration: 30,
            time: '12:20'
        },
        {
            type: 'activity',
            name: 'Weight Training',
            duration: 90,
            time: '20:40'
        }
    ],
    '2023-01-04': [
        {
            type: 'snack',
            name: 'Smoothie',
            duration: 15,
            time: '14:00'
        },
        {
            type: 'activity',
            name: 'Zumba',
            duration: 45,
            time: '14:30'
        },
        {
            type: 'activity',
            name: 'Zumba',
            duration: 45,
            time: '18:50'
        }
    ],
    '2023-01-05': [
        {
            type: 'snack',
            name: 'Mixed Nuts',
            duration: 20,
            time: '12:50'
        },
        {
            type: 'activity',
            name: 'Zumba',
            duration: 90,
            time: '19:40'
        }
    ],
    '2023-01-06': [
        {
            type: 'snack',
            name: 'Granola Bar',
            duration: 20,
            time: '12:10'
        },
        {
            type: 'activity',
            name: 'Rowing',
            duration: 30,
            time: '13:10'
        },
        {
            type: 'dessert',
            name: 'Chocolate Cake',
            duration: 15,
            time: '18:45'
        }
    ],
    '2023-01-07': [
        {
            type: 'breakfast',
            name: 'Avocado Toast',
            duration: 15,
            time: '08:15'
        },
        {
            type: 'activity',
            name: 'Tai Chi',
            duration: 60,
            time: '18:00'
        }
    ],
    '2023-01-08': [
        {
            type: 'breakfast',
            name: 'Granola with Yogurt',
            duration: 30,
            time: '07:20'
        },
        {
            type: 'snack',
            name: 'Smoothie',
            duration: 15,
            time: '09:20'
        },
        {
            type: 'snack',
            name: 'Apple Slices with Peanut Butter',
            duration: 20,
            time: '13:00'
        },
        {
            type: 'activity',
            name: 'Soccer',
            duration: 75,
            time: '20:45'
        }
    ],
    '2023-01-09': [
        {
            type: 'activity',
            name: 'Bike Ride',
            duration: 60,
            time: '09:30'
        },
        {
            type: 'lunch',
            name: 'Quinoa Salad',
            duration: 45,
            time: '13:20'
        },
        {
            type: 'drink',
            name: 'Iced Coffee',
            duration: 20,
            time: '18:15'
        }
    ],
    '2023-01-10': [
        {
            type: 'snack',
            name: 'Rice Cakes',
            duration: 20,
            time: '09:45'
        },
        {
            type: 'snack',
            name: 'Trail Mix',
            duration: 15,
            time: '13:10'
        },
        {
            type: 'drink',
            name: 'Matcha Latte',
            duration: 20,
            time: '19:30'
        }
    ],
    '2023-01-11': [
        {
            type: 'snack',
            name: 'Cheese and Crackers',
            duration: 20,
            time: '13:40'
        },
        {
            type: 'dinner',
            name: 'Pork Chops',
            duration: 60,
            time: '20:15'
        }
    ],
    '2023-01-12': [
        {
            type: 'snack',
            name: 'Popcorn',
            duration: 20,
            time: '09:10'
        },
        {
            type: 'lunch',
            name: 'Grilled Chicken with Vegetables',
            duration: 30,
            time: '12:40'
        },
        {
            type: 'activity',
            name: 'Kickboxing',
            duration: 75,
            time: '14:50'
        },
        {
            type: 'drink',
            name: 'Water',
            duration: 20,
            time: '19:20'
        },
        {
            type: 'activity',
            name: 'Gym Workout',
            duration: 75,
            time: '20:50'
        }
    ],
    '2023-01-13': [
        {
            type: 'breakfast',
            name: 'Eggs Benedict',
            duration: 15,
            time: '07:10'
        },
        {
            type: 'lunch',
            name: 'Pasta',
            duration: 45,
            time: '12:50'
        },
        {
            type: 'dessert',
            name: 'Creme Brulee',
            duration: 20,
            time: '19:40'
        },
        {
            type: 'activity',
            name: 'Dance Class',
            duration: 90,
            time: '20:10'
        }
    ],
    '2023-01-14': [
        {
            type: 'snack',
            name: 'Dark Chocolate',
            duration: 20,
            time: '08:00'
        },
        {
            type: 'dinner',
            name: 'Grilled Salmon and Quinoa',
            duration: 45,
            time: '20:10'
        }
    ],
    '2023-01-15': [
        {
            type: 'activity',
            name: 'Kickboxing',
            duration: 90,
            time: '07:00'
        },
        {
            type: 'snack',
            name: 'Smoothie',
            duration: 20,
            time: '13:45'
        },
        {
            type: 'dinner',
            name: 'Vegetable Curry',
            duration: 45,
            time: '19:50'
        }
    ],
    '2023-01-16': [
        {
            type: 'activity',
            name: 'Dance Class',
            duration: 30,
            time: '08:30'
        },
        {
            type: 'snack',
            name: 'Boiled Egg',
            duration: 20,
            time: '13:00'
        },
        {
            type: 'drink',
            name: 'Protein Shake',
            duration: 25,
            time: '19:10'
        }
    ],
    '2023-01-17': [
        {
            type: 'breakfast',
            name: 'Granola with Yogurt',
            duration: 30,
            time: '08:50'
        },
        {
            type: 'snack',
            name: 'Fresh Fruit',
            duration: 20,
            time: '13:20'
        },
        {
            type: 'dinner',
            name: 'Spaghetti Bolognese',
            duration: 60,
            time: '18:00'
        }
    ],
    '2023-01-18': [
        {
            type: 'dessert',
            name: 'Baklava',
            duration: 30,
            time: '20:45'
        }
    ],
    '2023-01-19': [
        {
            type: 'breakfast',
            name: 'Cereal with Milk',
            duration: 15,
            time: '09:15'
        },
        {
            type: 'activity',
            name: 'Bike Ride',
            duration: 60,
            time: '13:00'
        },
        {
            type: 'dinner',
            name: 'Vegetable Curry',
            duration: 30,
            time: '19:30'
        }
    ],
    '2023-01-20': [
        {
            type: 'breakfast',
            name: 'Avocado Toast',
            duration: 15,
            time: '07:00'
        },
        {
            type: 'lunch',
            name: 'Sushi',
            duration: 30,
            time: '13:45'
        },
        {
            type: 'dessert',
            name: 'Carrot Cake',
            duration: 20,
            time: '19:50'
        },
        {
            type: 'activity',
            name: 'Rowing',
            duration: 75,
            time: '20:45'
        }
    ],
    '2023-01-21': [
        {
            type: 'breakfast',
            name: 'Protein Shake',
            duration: 30,
            time: '08:10'
        },
        {
            type: 'snack',
            name: 'Granola Bar',
            duration: 20,
            time: '12:40'
        },
        {
            type: 'dessert',
            name: 'Baklava',
            duration: 15,
            time: '20:50'
        }
    ],
    '2023-01-22': [
        {
            type: 'snack',
            name: 'Cheese and Crackers',
            duration: 20,
            time: '09:40'
        },
        {
            type: 'snack',
            name: 'Trail Mix',
            duration: 15,
            time: '13:50'
        },
        {
            type: 'dinner',
            name: 'Steak and Potatoes',
            duration: 30,
            time: '20:00'
        },
        {
            type: 'drink',
            name: 'Fresh Juice',
            duration: 15,
            time: '20:50'
        }
    ],
    '2023-01-23': [
        {
            type: 'lunch',
            name: 'Tacos',
            duration: 45,
            time: '14:10'
        }
    ],
    '2023-01-24': [
        {
            type: 'snack',
            name: 'Vegetable Sticks with Hummus',
            duration: 15,
            time: '08:50'
        },
        {
            type: 'lunch',
            name: 'BLT Sandwich',
            duration: 15,
            time: '12:00'
        },
        {
            type: 'snack',
            name: 'Fresh Fruit',
            duration: 15,
            time: '13:45'
        },
        {
            type: 'dessert',
            name: 'Baklava',
            duration: 15,
            time: '20:20'
        }
    ],
    '2023-01-25': [
        {
            type: 'activity',
            name: 'Gym Workout',
            duration: 75,
            time: '13:45'
        },
        {
            type: 'dinner',
            name: 'Chicken Stir-Fry',
            duration: 60,
            time: '19:50'
        }
    ],
    '2023-01-26': [
        {
            type: 'snack',
            name: 'Yogurt',
            duration: 20,
            time: '08:00'
        },
        {
            type: 'lunch',
            name: 'Tuna Salad Wrap',
            duration: 30,
            time: '14:00'
        },
        {
            type: 'dinner',
            name: 'Pork Chops',
            duration: 30,
            time: '20:10'
        }
    ],
    '2023-01-27': [
        {
            type: 'snack',
            name: 'Trail Mix',
            duration: 20,
            time: '07:50'
        },
        {
            type: 'drink',
            name: 'Iced Tea',
            duration: 25,
            time: '19:40'
        }
    ],
    '2023-01-28': [
        {
            type: 'breakfast',
            name: 'Granola with Yogurt',
            duration: 15,
            time: '09:00'
        },
        {
            type: 'activity',
            name: 'Zumba',
            duration: 90,
            time: '09:45'
        },
        {
            type: 'snack',
            name: 'Mixed Nuts',
            duration: 20,
            time: '13:40'
        },
        {
            type: 'dessert',
            name: 'Ice Cream Sundae',
            duration: 20,
            time: '20:10'
        }
    ],
    '2023-01-29': [
        {
            type: 'activity',
            name: 'Gym Workout',
            duration: 75,
            time: '08:40'
        },
        {
            type: 'snack',
            name: 'Mixed Nuts',
            duration: 20,
            time: '14:45'
        },
        {
            type: 'activity',
            name: 'Gym Workout',
            duration: 75,
            time: '18:50'
        }
    ],
    '2023-01-30': [
        {
            type: 'breakfast',
            name: 'Eggs Benedict',
            duration: 30,
            time: '07:00'
        },
        {
            type: 'snack',
            name: 'Rice Cakes',
            duration: 20,
            time: '09:50'
        },
        {
            type: 'lunch',
            name: 'Quinoa Salad',
            duration: 45,
            time: '13:15'
        },
        {
            type: 'drink',
            name: 'Ginger Tea',
            duration: 20,
            time: '18:45'
        }
    ],
    '2023-01-31': [
        {
            type: 'activity',
            name: 'Aerobics',
            duration: 75,
            time: '08:10'
        },
        {
            type: 'lunch',
            name: 'Prawn Salad',
            duration: 45,
            time: '13:45'
        },
        {
            type: 'dinner',
            name: 'Vegetable Curry',
            duration: 60,
            time: '18:30'
        },
        {
            type: 'drink',
            name: 'Iced Tea',
            duration: 25,
            time: '20:45'
        }
    ],
    '2023-02-01': [
        {
            type: 'activity',
            name: 'Tennis',
            duration: 75,
            time: '13:45'
        },
        {
            type: 'dessert',
            name: 'Chocolate Cake',
            duration: 15,
            time: '19:20'
        }
    ],
    '2023-02-02': [
        {
            type: 'activity',
            name: 'Jogging',
            duration: 90,
            time: '08:20'
        },
        {
            type: 'lunch',
            name: 'Burger and Fries',
            duration: 15,
            time: '14:00'
        },
        {
            type: 'dessert',
            name: 'Brownie',
            duration: 15,
            time: '18:20'
        }
    ],
    '2023-02-03': [
        {
            type: 'lunch',
            name: 'Prawn Salad',
            duration: 30,
            time: '13:40'
        }
    ],
    '2023-02-04': [
        {
            type: 'breakfast',
            name: 'Croissant',
            duration: 30,
            time: '09:20'
        },
        {
            type: 'lunch',
            name: 'Pasta',
            duration: 15,
            time: '13:40'
        },
        {
            type: 'drink',
            name: 'Chamomile Tea',
            duration: 20,
            time: '20:00'
        }
    ],
    '2023-02-05': [
        {
            type: 'dinner',
            name: 'Pork Chops',
            duration: 45,
            time: '20:30'
        }
    ],
    '2023-02-06': [
        {
            type: 'snack',
            name: 'Vegetable Sticks with Hummus',
            duration: 20,
            time: '08:50'
        },
        {
            type: 'drink',
            name: 'Hot Chocolate',
            duration: 20,
            time: '18:40'
        }
    ],
    '2023-02-07': [
        {
            type: 'activity',
            name: 'Pilates',
            duration: 75,
            time: '14:10'
        },
        {
            type: 'dinner',
            name: 'Roast Dinner',
            duration: 60,
            time: '19:20'
        }
    ],
    '2023-02-08': [
        {
            type: 'breakfast',
            name: 'Protein Shake',
            duration: 30,
            time: '07:50'
        },
        {
            type: 'snack',
            name: 'Dark Chocolate',
            duration: 20,
            time: '09:10'
        },
        {
            type: 'lunch',
            name: 'Pasta',
            duration: 15,
            time: '12:45'
        },
        {
            type: 'dinner',
            name: 'BBQ Ribs',
            duration: 45,
            time: '18:40'
        },
        {
            type: 'dessert',
            name: 'Baklava',
            duration: 20,
            time: '20:15'
        }
    ],
    '2023-02-09': [
        {
            type: 'activity',
            name: 'Tai Chi',
            duration: 45,
            time: '07:10'
        },
        {
            type: 'snack',
            name: 'Cheese and Crackers',
            duration: 20,
            time: '13:20'
        },
        {
            type: 'dessert',
            name: 'Chocolate Cake',
            duration: 20,
            time: '19:15'
        }
    ],
    '2023-02-10': [
        {
            type: 'snack',
            name: 'Mixed Nuts',
            duration: 15,
            time: '08:10'
        }
    ],
    '2023-02-11': [
        {
            type: 'activity',
            name: 'Swimming',
            duration: 90,
            time: '14:40'
        },
        {
            type: 'dessert',
            name: 'Carrot Cake',
            duration: 15,
            time: '18:10'
        }
    ],
    '2023-02-12': [
        {
            type: 'activity',
            name: 'Hiking',
            duration: 30,
            time: '08:10'
        },
        {
            type: 'dinner',
            name: 'Grilled Salmon and Quinoa',
            duration: 45,
            time: '19:50'
        }
    ],
    '2023-02-13': [
        {
            type: 'activity',
            name: 'Dance Class',
            duration: 45,
            time: '08:00'
        },
        {
            type: 'dessert',
            name: 'Ice Cream Sundae',
            duration: 30,
            time: '19:30'
        }
    ],
    '2023-02-14': [
        {
            type: 'snack',
            name: 'Trail Mix',
            duration: 20,
            time: '08:20'
        },
        {
            type: 'lunch',
            name: 'Tacos',
            duration: 45,
            time: '12:10'
        },
        {
            type: 'activity',
            name: 'Weight Training',
            duration: 60,
            time: '14:45'
        },
        {
            type: 'dinner',
            name: 'Roast Dinner',
            duration: 60,
            time: '20:30'
        }
    ],
    '2023-02-15': [
        {
            type: 'snack',
            name: 'Dark Chocolate',
            duration: 15,
            time: '09:20'
        },
        {
            type: 'snack',
            name: 'Vegetable Sticks with Hummus',
            duration: 20,
            time: '12:50'
        },
        {
            type: 'drink',
            name: 'Iced Coffee',
            duration: 15,
            time: '20:20'
        }
    ],
    '2023-02-16': [
        {
            type: 'dessert',
            name: 'Chocolate Mousse',
            duration: 30,
            time: '20:45'
        }
    ],
    '2023-02-17': [
        {
            type: 'lunch',
            name: 'Prawn Salad',
            duration: 15,
            time: '12:50'
        },
        {
            type: 'dessert',
            name: 'Ice Cream Sundae',
            duration: 20,
            time: '18:30'
        }
    ],
    '2023-02-18': [
        {
            type: 'breakfast',
            name: 'Quiche',
            duration: 15,
            time: '07:40'
        },
        {
            type: 'activity',
            name: 'Cycling',
            duration: 60,
            time: '08:50'
        },
        {
            type: 'dinner',
            name: 'Fish and Chips',
            duration: 60,
            time: '19:00'
        }
    ],
    '2023-02-19': [
        {
            type: 'activity',
            name: 'Tennis',
            duration: 60,
            time: '08:10'
        },
        {
            type: 'lunch',
            name: 'Burrito',
            duration: 15,
            time: '12:20'
        },
        {
            type: 'activity',
            name: 'Pilates',
            duration: 60,
            time: '19:30'
        }
    ],
    '2023-02-20': [
        {
            type: 'breakfast',
            name: 'Fruit Salad',
            duration: 30,
            time: '08:40'
        },
        {
            type: 'snack',
            name: 'Popcorn',
            duration: 20,
            time: '09:20'
        },
        {
            type: 'activity',
            name: 'Cycling',
            duration: 30,
            time: '12:10'
        },
        {
            type: 'dinner',
            name: 'BBQ Ribs',
            duration: 60,
            time: '20:10'
        }
    ],
    '2023-02-21': [
        {
            type: 'breakfast',
            name: 'Quiche',
            duration: 15,
            time: '09:15'
        },
        {
            type: 'lunch',
            name: 'Quinoa Salad',
            duration: 15,
            time: '12:40'
        },
        {
            type: 'activity',
            name: 'Yoga',
            duration: 30,
            time: '13:15'
        },
        {
            type: 'drink',
            name: 'Iced Tea',
            duration: 15,
            time: '18:40'
        }
    ],
    '2023-02-22': [
        {
            type: 'breakfast',
            name: 'Toast with Jam',
            duration: 30,
            time: '07:50'
        },
        {
            type: 'lunch',
            name: 'Chicken Caesar Salad',
            duration: 15,
            time: '14:30'
        },
        {
            type: 'dessert',
            name: 'Chocolate Mousse',
            duration: 15,
            time: '19:45'
        }
    ],
    '2023-02-23': [
        {
            type: 'lunch',
            name: 'Sushi',
            duration: 30,
            time: '14:50'
        },
        {
            type: 'dinner',
            name: 'Roast Dinner',
            duration: 60,
            time: '20:50'
        }
    ],
    '2023-02-24': [
        {
            type: 'snack',
            name: 'Rice Cakes',
            duration: 15,
            time: '08:40'
        },
        {
            type: 'dinner',
            name: 'Roast Dinner',
            duration: 45,
            time: '20:10'
        }
    ],
    '2023-02-25': [
        {
            type: 'activity',
            name: 'Meditation',
            duration: 60,
            time: '07:30'
        },
        {
            type: 'activity',
            name: 'Boxing',
            duration: 45,
            time: '13:30'
        },
        {
            type: 'dinner',
            name: 'Spaghetti Bolognese',
            duration: 45,
            time: '19:40'
        }
    ],
    '2023-02-26': [
        {
            type: 'activity',
            name: 'Soccer',
            duration: 45,
            time: '08:00'
        },
        {
            type: 'lunch',
            name: 'Veggie Wrap',
            duration: 45,
            time: '12:15'
        },
        {
            type: 'activity',
            name: 'Hiking',
            duration: 45,
            time: '20:15'
        }
    ],
    '2023-02-27': [
        {
            type: 'breakfast',
            name: 'Omelette',
            duration: 30,
            time: '08:50'
        },
        {
            type: 'lunch',
            name: 'Chicken Soup',
            duration: 30,
            time: '13:50'
        },
        {
            type: 'snack',
            name: 'Rice Cakes',
            duration: 20,
            time: '14:45'
        },
        {
            type: 'dinner',
            name: 'Chicken Parmesan',
            duration: 30,
            time: '19:40'
        }
    ],
    '2023-02-28': [
        {
            type: 'snack',
            name: 'Popcorn',
            duration: 20,
            time: '07:50'
        },
        {
            type: 'lunch',
            name: 'Falafel Pita',
            duration: 45,
            time: '14:40'
        },
        {
            type: 'dessert',
            name: 'Brownie',
            duration: 30,
            time: '19:50'
        }
    ],
    '2023-03-01': [
        {
            type: 'snack',
            name: 'Vegetable Sticks with Hummus',
            duration: 15,
            time: '08:10'
        },
        {
            type: 'activity',
            name: 'Tai Chi',
            duration: 75,
            time: '09:45'
        },
        {
            type: 'snack',
            name: 'Mixed Nuts',
            duration: 15,
            time: '14:10'
        },
        {
            type: 'activity',
            name: 'Soccer',
            duration: 45,
            time: '19:20'
        }
    ],
    '2023-03-02': [
        {
            type: 'breakfast',
            name: 'Quiche',
            duration: 15,
            time: '09:10'
        },
        {
            type: 'dessert',
            name: 'Ice Cream Sundae',
            duration: 15,
            time: '19:20'
        }
    ],
    '2023-03-03': [
        {
            type: 'breakfast',
            name: 'Quiche',
            duration: 30,
            time: '08:30'
        },
        {
            type: 'dinner',
            name: 'Vegetable Curry',
            duration: 60,
            time: '18:45'
        }
    ],
    '2023-03-04': [
        {
            type: 'snack',
            name: 'Boiled Egg',
            duration: 15,
            time: '09:50'
        },
        {
            type: 'lunch',
            name: 'Veggie Wrap',
            duration: 15,
            time: '14:45'
        }
    ],
    '2023-03-05': [
        {
            type: 'breakfast',
            name: 'Blueberry Pancakes',
            duration: 15,
            time: '09:00'
        },
        {
            type: 'snack',
            name: 'Cheese and Crackers',
            duration: 15,
            time: '12:40'
        },
        {
            type: 'dessert',
            name: 'Brownie',
            duration: 20,
            time: '18:15'
        }
    ],
    '2023-03-06': [
        {
            type: 'breakfast',
            name: 'Protein Shake',
            duration: 30,
            time: '07:20'
        },
        {
            type: 'snack',
            name: 'Smoothie',
            duration: 15,
            time: '09:00'
        },
        {
            type: 'dessert',
            name: 'Apple Pie',
            duration: 30,
            time: '20:00'
        }
    ],
    '2023-03-07': [
        {
            type: 'drink',
            name: 'Water',
            duration: 20,
            time: '18:45'
        }
    ],
    '2023-03-08': [
        {
            type: 'breakfast',
            name: 'Porridge with Berries',
            duration: 15,
            time: '07:15'
        },
        {
            type: 'snack',
            name: 'Dark Chocolate',
            duration: 20,
            time: '08:40'
        },
        {
            type: 'activity',
            name: 'Tennis',
            duration: 90,
            time: '13:40'
        },
        {
            type: 'drink',
            name: 'Herbal Tea',
            duration: 20,
            time: '19:40'
        },
        {
            type: 'activity',
            name: 'Tennis',
            duration: 60,
            time: '20:15'
        }
    ],
    '2023-03-09': [
        {
            type: 'activity',
            name: 'Dance Class',
            duration: 75,
            time: '09:45'
        },
        {
            type: 'lunch',
            name: 'Tacos',
            duration: 15,
            time: '13:10'
        },
        {
            type: 'dinner',
            name: 'Lasagna',
            duration: 30,
            time: '20:30'
        }
    ],
    '2023-03-10': [
        {
            type: 'snack',
            name: 'Cheese and Crackers',
            duration: 15,
            time: '08:50'
        },
        {
            type: 'activity',
            name: 'Basketball',
            duration: 75,
            time: '09:20'
        },
        {
            type: 'snack',
            name: 'Cheese and Crackers',
            duration: 20,
            time: '12:30'
        },
        {
            type: 'dessert',
            name: 'Creme Brulee',
            duration: 30,
            time: '19:10'
        },
        {
            type: 'activity',
            name: 'Gym Workout',
            duration: 60,
            time: '20:15'
        }
    ],
    '2023-03-11': [
        {
            type: 'snack',
            name: 'Yogurt',
            duration: 20,
            time: '08:50'
        },
        {
            type: 'activity',
            name: 'Tai Chi',
            duration: 60,
            time: '12:45'
        },
        {
            type: 'dinner',
            name: 'Chicken Parmesan',
            duration: 45,
            time: '20:30'
        }
    ],
    '2023-03-12': [
        {
            type: 'snack',
            name: 'Boiled Egg',
            duration: 20,
            time: '14:10'
        },
        {
            type: 'drink',
            name: 'Coconut Water',
            duration: 25,
            time: '19:45'
        }
    ],
    '2023-03-13': [
        {
            type: 'breakfast',
            name: 'Bagel with Cream Cheese',
            duration: 15,
            time: '07:10'
        },
        {
            type: 'snack',
            name: 'Popcorn',
            duration: 20,
            time: '07:45'
        },
        {
            type: 'lunch',
            name: 'Prawn Salad',
            duration: 15,
            time: '13:40'
        }
    ],
    '2023-03-14': [
        {
            type: 'activity',
            name: 'Yoga',
            duration: 60,
            time: '07:15'
        },
        {
            type: 'snack',
            name: 'Protein Bar',
            duration: 15,
            time: '13:20'
        }
    ],
    '2023-03-15': [
        {
            type: 'snack',
            name: 'Popcorn',
            duration: 20,
            time: '12:15'
        },
        {
            type: 'activity',
            name: 'Tennis',
            duration: 60,
            time: '18:00'
        }
    ],
    '2023-03-16': [
        {
            type: 'breakfast',
            name: 'Porridge with Berries',
            duration: 30,
            time: '08:30'
        },
        {
            type: 'lunch',
            name: 'Tuna Salad Wrap',
            duration: 15,
            time: '14:40'
        },
        {
            type: 'drink',
            name: 'Iced Coffee',
            duration: 25,
            time: '18:00'
        },
        {
            type: 'activity',
            name: 'Aerobics',
            duration: 30,
            time: '19:10'
        }
    ],
    '2023-03-17': [
        {
            type: 'activity',
            name: 'Soccer',
            duration: 90,
            time: '07:40'
        },
        {
            type: 'snack',
            name: 'Cheese and Crackers',
            duration: 20,
            time: '14:40'
        },
        {
            type: 'activity',
            name: 'Basketball',
            duration: 75,
            time: '20:40'
        }
    ],
    '2023-03-18': [
        {
            type: 'activity',
            name: 'Meditation',
            duration: 75,
            time: '07:00'
        }
    ],
    '2023-03-19': [
        {
            type: 'snack',
            name: 'Smoothie',
            duration: 15,
            time: '09:30'
        },
        {
            type: 'dinner',
            name: 'BBQ Ribs',
            duration: 45,
            time: '20:00'
        }
    ],
    '2023-03-20': [
        {
            type: 'breakfast',
            name: 'Eggs Benedict',
            duration: 15,
            time: '09:20'
        },
        {
            type: 'snack',
            name: 'Dark Chocolate',
            duration: 20,
            time: '14:00'
        },
        {
            type: 'dinner',
            name: 'Roast Dinner',
            duration: 30,
            time: '19:00'
        }
    ],
    '2023-03-21': [
        {
            type: 'snack',
            name: 'Trail Mix',
            duration: 20,
            time: '08:40'
        },
        {
            type: 'lunch',
            name: 'Prawn Salad',
            duration: 30,
            time: '12:40'
        },
        {
            type: 'dessert',
            name: 'Raspberry Tart',
            duration: 20,
            time: '20:00'
        }
    ],
    '2023-03-22': [
        {
            type: 'snack',
            name: 'Cheese and Crackers',
            duration: 15,
            time: '08:10'
        },
        {
            type: 'lunch',
            name: 'Falafel Pita',
            duration: 30,
            time: '14:50'
        },
        {
            type: 'dinner',
            name: 'Grilled Salmon and Quinoa',
            duration: 45,
            time: '20:40'
        }
    ],
    '2023-03-23': [
        {
            type: 'breakfast',
            name: 'Porridge with Berries',
            duration: 15,
            time: '09:15'
        },
        {
            type: 'lunch',
            name: 'Chicken Soup',
            duration: 15,
            time: '13:45'
        },
        {
            type: 'dessert',
            name: 'Cheesecake',
            duration: 15,
            time: '19:40'
        },
        {
            type: 'drink',
            name: 'Matcha Latte',
            duration: 15,
            time: '20:10'
        }
    ],
    '2023-03-24': [
        {
            type: 'breakfast',
            name: 'Avocado Toast',
            duration: 15,
            time: '08:50'
        },
        {
            type: 'lunch',
            name: 'Burrito',
            duration: 30,
            time: '13:00'
        },
        {
            type: 'dinner',
            name: 'Steak and Potatoes',
            duration: 60,
            time: '20:30'
        }
    ],
    '2023-03-25': [
        {
            type: 'breakfast',
            name: 'Protein Shake',
            duration: 15,
            time: '08:00'
        },
        {
            type: 'snack',
            name: 'Granola Bar',
            duration: 15,
            time: '09:30'
        },
        {
            type: 'activity',
            name: 'Basketball',
            duration: 75,
            time: '13:30'
        },
        {
            type: 'dinner',
            name: 'Chicken Stir-Fry',
            duration: 45,
            time: '20:40'
        }
    ],
    '2023-03-26': [
        {
            type: 'breakfast',
            name: 'Granola with Yogurt',
            duration: 30,
            time: '09:10'
        },
        {
            type: 'lunch',
            name: 'Burger and Fries',
            duration: 30,
            time: '12:30'
        },
        {
            type: 'snack',
            name: 'Cheese and Crackers',
            duration: 15,
            time: '13:30'
        },
        {
            type: 'dinner',
            name: 'Grilled Salmon and Quinoa',
            duration: 60,
            time: '20:00'
        }
    ],
    '2023-03-27': [
        {
            type: 'snack',
            name: 'Dried Fruit',
            duration: 20,
            time: '13:15'
        },
        {
            type: 'dessert',
            name: 'Chocolate Cake',
            duration: 30,
            time: '20:10'
        }
    ],
    '2023-03-28': [
        {
            type: 'snack',
            name: 'Cheese and Crackers',
            duration: 20,
            time: '09:10'
        }
    ],
    '2023-03-29': [
        {
            type: 'breakfast',
            name: 'Croissant',
            duration: 30,
            time: '09:10'
        },
        {
            type: 'activity',
            name: 'Basketball',
            duration: 60,
            time: '14:30'
        }
    ],
    '2023-03-30': [
        {
            type: 'breakfast',
            name: 'Quiche',
            duration: 15,
            time: '08:45'
        },
        {
            type: 'snack',
            name: 'Popcorn',
            duration: 15,
            time: '09:40'
        },
        {
            type: 'snack',
            name: 'Cheese and Crackers',
            duration: 20,
            time: '13:40'
        },
        {
            type: 'activity',
            name: 'Dance Class',
            duration: 60,
            time: '14:30'
        },
        {
            type: 'dinner',
            name: 'Chicken Parmesan',
            duration: 60,
            time: '20:30'
        }
    ],
    '2023-03-31': [
        {
            type: 'breakfast',
            name: 'Omelette',
            duration: 15,
            time: '09:45'
        },
        {
            type: 'snack',
            name: 'Trail Mix',
            duration: 20,
            time: '14:20'
        },
        {
            type: 'dinner',
            name: 'BBQ Ribs',
            duration: 30,
            time: '19:00'
        }
    ],
    '2023-04-01': [
        {
            type: 'activity',
            name: 'Meditation',
            duration: 60,
            time: '07:00'
        },
        {
            type: 'snack',
            name: 'Smoothie',
            duration: 20,
            time: '12:20'
        },
        {
            type: 'activity',
            name: 'Zumba',
            duration: 90,
            time: '13:30'
        },
        {
            type: 'drink',
            name: 'Iced Coffee',
            duration: 25,
            time: '20:45'
        }
    ],
    '2023-04-02': [
        {
            type: 'breakfast',
            name: 'Protein Shake',
            duration: 30,
            time: '09:15'
        },
        {
            type: 'lunch',
            name: 'Quinoa Salad',
            duration: 30,
            time: '12:45'
        },
        {
            type: 'dessert',
            name: 'Carrot Cake',
            duration: 30,
            time: '19:50'
        }
    ],
    '2023-04-03': [
        {
            type: 'snack',
            name: 'Vegetable Sticks with Hummus',
            duration: 20,
            time: '07:00'
        },
        {
            type: 'lunch',
            name: 'Burrito',
            duration: 30,
            time: '12:45'
        },
        {
            type: 'dinner',
            name: 'Lamb Stew',
            duration: 60,
            time: '18:15'
        },
        {
            type: 'dessert',
            name: 'Fruit Salad',
            duration: 20,
            time: '20:10'
        }
    ],
    '2023-04-04': [
        {
            type: 'breakfast',
            name: 'Avocado Toast',
            duration: 30,
            time: '09:10'
        },
        {
            type: 'dinner',
            name: 'Grilled Salmon and Quinoa',
            duration: 60,
            time: '18:40'
        }
    ],
    '2023-04-05': [
        {
            type: 'breakfast',
            name: 'Protein Shake',
            duration: 30,
            time: '09:50'
        }
    ],
    '2023-04-06': [
        {
            type: 'snack',
            name: 'Cheese and Crackers',
            duration: 15,
            time: '08:00'
        },
        {
            type: 'activity',
            name: 'Hiking',
            duration: 60,
            time: '08:20'
        },
        {
            type: 'drink',
            name: 'Iced Coffee',
            duration: 15,
            time: '20:20'
        }
    ],
    '2023-04-07': [
        {
            type: 'snack',
            name: 'Yogurt',
            duration: 15,
            time: '07:50'
        },
        {
            type: 'activity',
            name: 'Hiking',
            duration: 60,
            time: '08:15'
        },
        {
            type: 'activity',
            name: 'Cycling',
            duration: 45,
            time: '13:15'
        },
        {
            type: 'activity',
            name: 'Pilates',
            duration: 90,
            time: '19:10'
        }
    ],
    '2023-04-08': [
        {
            type: 'breakfast',
            name: 'Omelette',
            duration: 30,
            time: '09:50'
        },
        {
            type: 'activity',
            name: 'Yoga',
            duration: 75,
            time: '12:50'
        }
    ],
    '2023-04-09': [
        {
            type: 'snack',
            name: 'Granola Bar',
            duration: 20,
            time: '13:40'
        },
        {
            type: 'dinner',
            name: 'Tofu Stir Fry',
            duration: 60,
            time: '20:30'
        }
    ],
    '2023-04-10': [
        {
            type: 'snack',
            name: 'Yogurt',
            duration: 15,
            time: '07:50'
        },
        {
            type: 'lunch',
            name: 'Burger and Fries',
            duration: 30,
            time: '14:30'
        },
        {
            type: 'dinner',
            name: 'Lasagna',
            duration: 30,
            time: '20:50'
        }
    ],
    '2023-04-11': [
        {
            type: 'breakfast',
            name: 'Blueberry Pancakes',
            duration: 15,
            time: '08:30'
        },
        {
            type: 'lunch',
            name: 'Sushi',
            duration: 45,
            time: '13:10'
        },
        {
            type: 'snack',
            name: 'Popcorn',
            duration: 15,
            time: '14:10'
        },
        {
            type: 'dinner',
            name: 'Roast Dinner',
            duration: 45,
            time: '18:15'
        },
        {
            type: 'drink',
            name: 'Espresso',
            duration: 25,
            time: '19:50'
        }
    ],
    '2023-04-12': [
        {
            type: 'breakfast',
            name: 'Eggs Benedict',
            duration: 15,
            time: '07:45'
        },
        {
            type: 'dinner',
            name: 'Grilled Salmon and Quinoa',
            duration: 30,
            time: '20:50'
        }
    ],
    '2023-04-13': [
        {
            type: 'breakfast',
            name: 'Omelette',
            duration: 30,
            time: '07:20'
        },
        {
            type: 'snack',
            name: 'Smoothie',
            duration: 20,
            time: '09:15'
        },
        {
            type: 'lunch',
            name: 'Veggie Wrap',
            duration: 45,
            time: '14:20'
        }
    ],
    '2023-04-14': [
        {
            type: 'activity',
            name: 'Rowing',
            duration: 60,
            time: '08:30'
        },
        {
            type: 'lunch',
            name: 'Chicken Soup',
            duration: 30,
            time: '12:40'
        },
        {
            type: 'dessert',
            name: 'Baklava',
            duration: 30,
            time: '18:00'
        },
        {
            type: 'activity',
            name: 'Dance Class',
            duration: 45,
            time: '19:00'
        }
    ],
    '2023-04-15': [
        {
            type: 'breakfast',
            name: 'Smoothie',
            duration: 30,
            time: '08:50'
        },
        {
            type: 'dessert',
            name: 'Fruit Salad',
            duration: 30,
            time: '20:20'
        }
    ],
    '2023-04-16': [
        {
            type: 'breakfast',
            name: 'Cereal with Milk',
            duration: 15,
            time: '09:45'
        },
        {
            type: 'snack',
            name: 'Cheese and Crackers',
            duration: 20,
            time: '14:00'
        },
        {
            type: 'activity',
            name: 'Yoga',
            duration: 90,
            time: '14:30'
        },
        {
            type: 'dinner',
            name: 'Roast Dinner',
            duration: 60,
            time: '20:00'
        }
    ],
    '2023-04-17': [
        {
            type: 'snack',
            name: 'Cheese and Crackers',
            duration: 20,
            time: '12:10'
        },
        {
            type: 'dinner',
            name: 'Fish and Chips',
            duration: 45,
            time: '19:45'
        }
    ],
    '2023-04-18': [
        {
            type: 'breakfast',
            name: 'Protein Shake',
            duration: 30,
            time: '07:30'
        },
        {
            type: 'snack',
            name: 'Trail Mix',
            duration: 20,
            time: '09:00'
        },
        {
            type: 'lunch',
            name: 'Burger and Fries',
            duration: 45,
            time: '14:50'
        },
        {
            type: 'dinner',
            name: 'Roast Dinner',
            duration: 45,
            time: '19:00'
        },
        {
            type: 'drink',
            name: 'Green Smoothie',
            duration: 20,
            time: '20:00'
        }
    ],
    '2023-04-19': [
        {
            type: 'lunch',
            name: 'Tuna Salad Wrap',
            duration: 45,
            time: '13:30'
        },
        {
            type: 'dessert',
            name: 'Chocolate Mousse',
            duration: 30,
            time: '19:15'
        }
    ],
    '2023-04-20': [
        {
            type: 'snack',
            name: 'Protein Bar',
            duration: 15,
            time: '09:10'
        },
        {
            type: 'lunch',
            name: 'Tacos',
            duration: 30,
            time: '14:50'
        },
        {
            type: 'dinner',
            name: 'Lasagna',
            duration: 60,
            time: '20:15'
        }
    ],
    '2023-04-21': [
        {
            type: 'snack',
            name: 'Vegetable Sticks with Hummus',
            duration: 15,
            time: '08:30'
        },
        {
            type: 'activity',
            name: 'Cycling',
            duration: 90,
            time: '09:20'
        },
        {
            type: 'dessert',
            name: 'Chocolate Mousse',
            duration: 15,
            time: '18:50'
        }
    ],
    '2023-04-22': [
        {
            type: 'activity',
            name: 'Soccer',
            duration: 45,
            time: '12:40'
        },
        {
            type: 'activity',
            name: 'Meditation',
            duration: 30,
            time: '19:15'
        }
    ],
    '2023-04-23': [
        {
            type: 'activity',
            name: 'Aerobics',
            duration: 60,
            time: '12:30'
        },
        {
            type: 'activity',
            name: 'Dance Class',
            duration: 45,
            time: '19:10'
        }
    ],
    '2023-04-24': [
        {
            type: 'lunch',
            name: 'Chicken Soup',
            duration: 15,
            time: '13:40'
        },
        {
            type: 'drink',
            name: 'Chamomile Tea',
            duration: 20,
            time: '18:45'
        }
    ],
    '2023-04-25': [
        {
            type: 'breakfast',
            name: 'Bagel with Cream Cheese',
            duration: 15,
            time: '09:20'
        },
        {
            type: 'lunch',
            name: 'Burger and Fries',
            duration: 30,
            time: '13:10'
        },
        {
            type: 'snack',
            name: 'Granola Bar',
            duration: 15,
            time: '13:45'
        },
        {
            type: 'drink',
            name: 'Green Smoothie',
            duration: 25,
            time: '19:15'
        }
    ],
    '2023-04-26': [
        {
            type: 'breakfast',
            name: 'Toast with Jam',
            duration: 30,
            time: '09:10'
        },
        {
            type: 'lunch',
            name: 'Tuna Salad Wrap',
            duration: 45,
            time: '14:15'
        },
        {
            type: 'dessert',
            name: 'Strawberry Shortcake',
            duration: 15,
            time: '19:15'
        }
    ],
    '2023-04-27': [
        {
            type: 'snack',
            name: 'Smoothie',
            duration: 20,
            time: '13:10'
        },
        {
            type: 'dessert',
            name: 'Tiramisu',
            duration: 15,
            time: '18:30'
        },
        {
            type: 'drink',
            name: 'Espresso',
            duration: 20,
            time: '20:10'
        }
    ],
    '2023-04-28': [
        {
            type: 'snack',
            name: 'Apple Slices with Peanut Butter',
            duration: 20,
            time: '09:40'
        },
        {
            type: 'snack',
            name: 'Rice Cakes',
            duration: 20,
            time: '13:30'
        },
        {
            type: 'dinner',
            name: 'Lamb Stew',
            duration: 45,
            time: '18:45'
        },
        {
            type: 'activity',
            name: 'Weight Training',
            duration: 45,
            time: '19:40'
        }
    ],
    '2023-04-29': [
        {
            type: 'snack',
            name: 'Smoothie',
            duration: 20,
            time: '09:00'
        }
    ],
    '2023-04-30': [
        {
            type: 'breakfast',
            name: 'Quiche',
            duration: 30,
            time: '07:30'
        },
        {
            type: 'snack',
            name: 'Popcorn',
            duration: 20,
            time: '12:00'
        },
        {
            type: 'dinner',
            name: 'Lamb Stew',
            duration: 45,
            time: '20:45'
        }
    ],
    '2023-05-01': [
        {
            type: 'breakfast',
            name: 'Protein Shake',
            duration: 30,
            time: '07:50'
        },
        {
            type: 'snack',
            name: 'Protein Bar',
            duration: 15,
            time: '08:45'
        },
        {
            type: 'lunch',
            name: 'Chicken Caesar Salad',
            duration: 15,
            time: '14:10'
        },
        {
            type: 'drink',
            name: 'Iced Tea',
            duration: 25,
            time: '18:10'
        }
    ],
    '2023-05-02': [
        {
            type: 'snack',
            name: 'Cheese and Crackers',
            duration: 15,
            time: '14:40'
        },
        {
            type: 'drink',
            name: 'Protein Shake',
            duration: 15,
            time: '20:20'
        }
    ],
    '2023-05-03': [
        {
            type: 'activity',
            name: 'Basketball',
            duration: 75,
            time: '07:15'
        },
        {
            type: 'lunch',
            name: 'Tacos',
            duration: 15,
            time: '13:40'
        },
        {
            type: 'snack',
            name: 'Trail Mix',
            duration: 15,
            time: '14:15'
        }
    ],
    '2023-05-04': [
        {
            type: 'lunch',
            name: 'Sushi',
            duration: 15,
            time: '13:15'
        },
        {
            type: 'dinner',
            name: 'BBQ Ribs',
            duration: 45,
            time: '19:50'
        }
    ],
    '2023-05-05': [
        {
            type: 'snack',
            name: 'Protein Bar',
            duration: 15,
            time: '13:45'
        },
        {
            type: 'dinner',
            name: 'Fish and Chips',
            duration: 45,
            time: '18:45'
        },
        {
            type: 'dessert',
            name: 'Panna Cotta',
            duration: 20,
            time: '20:00'
        }
    ],
    '2023-05-06': [
        {
            type: 'breakfast',
            name: 'Bagel with Cream Cheese',
            duration: 15,
            time: '08:40'
        },
        {
            type: 'lunch',
            name: 'BLT Sandwich',
            duration: 30,
            time: '14:00'
        }
    ],
    '2023-05-07': [
        {
            type: 'breakfast',
            name: 'Cereal with Milk',
            duration: 30,
            time: '09:50'
        },
        {
            type: 'snack',
            name: 'Protein Bar',
            duration: 20,
            time: '14:20'
        }
    ],
    '2023-05-08': [
        {
            type: 'snack',
            name: 'Mixed Nuts',
            duration: 15,
            time: '14:40'
        },
        {
            type: 'dessert',
            name: 'Tiramisu',
            duration: 15,
            time: '19:45'
        }
    ],
    '2023-05-09': [
        {
            type: 'activity',
            name: 'Yoga',
            duration: 45,
            time: '08:10'
        },
        {
            type: 'lunch',
            name: 'Pasta',
            duration: 30,
            time: '14:10'
        },
        {
            type: 'dinner',
            name: 'Pork Chops',
            duration: 30,
            time: '20:50'
        }
    ],
    '2023-05-10': [
        {
            type: 'breakfast',
            name: 'Quiche',
            duration: 30,
            time: '09:00'
        },
        {
            type: 'drink',
            name: 'Herbal Tea',
            duration: 15,
            time: '20:30'
        }
    ],
    '2023-05-11': [
        {
            type: 'snack',
            name: 'Fresh Fruit',
            duration: 20,
            time: '07:15'
        },
        {
            type: 'activity',
            name: 'Rowing',
            duration: 60,
            time: '14:10'
        },
        {
            type: 'drink',
            name: 'Chamomile Tea',
            duration: 20,
            time: '19:45'
        }
    ],
    '2023-05-12': [
        {
            type: 'snack',
            name: 'Protein Bar',
            duration: 20,
            time: '12:30'
        }
    ],
    '2023-05-13': [
        {
            type: 'breakfast',
            name: 'Eggs Benedict',
            duration: 15,
            time: '07:50'
        },
        {
            type: 'snack',
            name: 'Cheese and Crackers',
            duration: 15,
            time: '09:15'
        },
        {
            type: 'dessert',
            name: 'Tiramisu',
            duration: 20,
            time: '20:50'
        }
    ],
    '2023-05-14': [
        {
            type: 'dinner',
            name: 'Roast Dinner',
            duration: 30,
            time: '19:30'
        },
        {
            type: 'dessert',
            name: 'Raspberry Tart',
            duration: 30,
            time: '20:15'
        }
    ],
    '2023-05-15': [
        {
            type: 'breakfast',
            name: 'Quiche',
            duration: 30,
            time: '07:50'
        },
        {
            type: 'drink',
            name: 'Espresso',
            duration: 20,
            time: '18:20'
        }
    ],
    '2023-05-16': [
        {
            type: 'snack',
            name: 'Boiled Egg',
            duration: 15,
            time: '07:40'
        },
        {
            type: 'dinner',
            name: 'Pork Chops',
            duration: 30,
            time: '19:50'
        },
        {
            type: 'activity',
            name: 'Weight Training',
            duration: 75,
            time: '20:20'
        }
    ],
    '2023-05-17': [
        {
            type: 'activity',
            name: 'Tennis',
            duration: 60,
            time: '09:10'
        },
        {
            type: 'activity',
            name: 'Tai Chi',
            duration: 30,
            time: '13:10'
        },
        {
            type: 'dessert',
            name: 'Lemon Meringue Pie',
            duration: 20,
            time: '19:40'
        }
    ],
    '2023-05-18': [
        {
            type: 'breakfast',
            name: 'Quiche',
            duration: 15,
            time: '09:50'
        },
        {
            type: 'snack',
            name: 'Cheese and Crackers',
            duration: 15,
            time: '12:15'
        },
        {
            type: 'dinner',
            name: 'Chicken Stir-Fry',
            duration: 60,
            time: '18:10'
        }
    ],
    '2023-05-19': [
        {
            type: 'snack',
            name: 'Dried Fruit',
            duration: 20,
            time: '07:15'
        },
        {
            type: 'lunch',
            name: 'Veggie Wrap',
            duration: 30,
            time: '12:10'
        },
        {
            type: 'snack',
            name: 'Rice Cakes',
            duration: 15,
            time: '13:40'
        },
        {
            type: 'dessert',
            name: 'Chocolate Cake',
            duration: 20,
            time: '18:45'
        }
    ],
    '2023-05-20': [
        {
            type: 'breakfast',
            name: 'Omelette',
            duration: 30,
            time: '08:20'
        },
        {
            type: 'lunch',
            name: 'Veggie Wrap',
            duration: 30,
            time: '12:40'
        }
    ],
    '2023-05-21': [
        {
            type: 'lunch',
            name: 'Prawn Salad',
            duration: 45,
            time: '12:40'
        },
        {
            type: 'dessert',
            name: 'Baklava',
            duration: 15,
            time: '19:45'
        },
        {
            type: 'drink',
            name: 'Herbal Tea',
            duration: 25,
            time: '20:30'
        }
    ],
    '2023-05-22': [
        {
            type: 'lunch',
            name: 'Tacos',
            duration: 30,
            time: '14:15'
        }
    ],
    '2023-05-23': [
        {
            type: 'breakfast',
            name: 'Smoothie',
            duration: 30,
            time: '09:00'
        },
        {
            type: 'snack',
            name: 'Smoothie',
            duration: 20,
            time: '13:10'
        },
        {
            type: 'dinner',
            name: 'Steak and Potatoes',
            duration: 60,
            time: '18:40'
        },
        {
            type: 'dessert',
            name: 'Lemon Meringue Pie',
            duration: 20,
            time: '20:00'
        },
        {
            type: 'drink',
            name: 'Matcha Latte',
            duration: 20,
            time: '20:50'
        }
    ],
    '2023-05-24': [
        {
            type: 'breakfast',
            name: 'Toast with Jam',
            duration: 15,
            time: '08:40'
        },
        {
            type: 'lunch',
            name: 'Pasta',
            duration: 45,
            time: '14:50'
        }
    ],
    '2023-05-25': [
        {
            type: 'snack',
            name: 'Dried Fruit',
            duration: 20,
            time: '09:50'
        },
        {
            type: 'dinner',
            name: 'Lasagna',
            duration: 30,
            time: '18:10'
        }
    ],
    '2023-05-26': [
        {
            type: 'snack',
            name: 'Dark Chocolate',
            duration: 20,
            time: '13:50'
        }
    ],
    '2023-05-27': [
        {
            type: 'activity',
            name: 'Pilates',
            duration: 45,
            time: '07:50'
        },
        {
            type: 'lunch',
            name: 'Pasta',
            duration: 15,
            time: '14:10'
        },
        {
            type: 'activity',
            name: 'Meditation',
            duration: 90,
            time: '14:45'
        },
        {
            type: 'dinner',
            name: 'Vegetable Curry',
            duration: 60,
            time: '18:45'
        }
    ],
    '2023-05-28': [
        {
            type: 'breakfast',
            name: 'Protein Shake',
            duration: 30,
            time: '07:20'
        },
        {
            type: 'snack',
            name: 'Smoothie',
            duration: 15,
            time: '14:15'
        }
    ],
    '2023-05-29': [
        {
            type: 'snack',
            name: 'Rice Cakes',
            duration: 15,
            time: '14:40'
        },
        {
            type: 'activity',
            name: 'Weight Training',
            duration: 45,
            time: '19:50'
        }
    ],
    '2023-05-30': [
        {
            type: 'breakfast',
            name: 'Protein Shake',
            duration: 15,
            time: '08:45'
        },
        {
            type: 'lunch',
            name: 'Quinoa Salad',
            duration: 30,
            time: '13:50'
        },
        {
            type: 'snack',
            name: 'Mixed Nuts',
            duration: 20,
            time: '14:50'
        }
    ],
    '2023-05-31': [
        {
            type: 'breakfast',
            name: 'Blueberry Pancakes',
            duration: 30,
            time: '07:10'
        },
        {
            type: 'snack',
            name: 'Boiled Egg',
            duration: 15,
            time: '14:40'
        },
        {
            type: 'dinner',
            name: 'Fish and Chips',
            duration: 45,
            time: '19:40'
        }
    ],
    '2023-06-01': [
        {
            type: 'snack',
            name: 'Smoothie',
            duration: 15,
            time: '07:50'
        },
        {
            type: 'activity',
            name: 'Weight Training',
            duration: 60,
            time: '19:40'
        }
    ],
    '2023-06-02': [
        {
            type: 'lunch',
            name: 'Chicken Soup',
            duration: 15,
            time: '12:20'
        },
        {
            type: 'snack',
            name: 'Popcorn',
            duration: 15,
            time: '14:30'
        },
        {
            type: 'activity',
            name: 'Meditation',
            duration: 30,
            time: '20:30'
        }
    ],
    '2023-06-03': [
        {
            type: 'breakfast',
            name: 'Porridge with Berries',
            duration: 30,
            time: '08:40'
        },
        {
            type: 'lunch',
            name: 'Chicken Caesar Salad',
            duration: 30,
            time: '12:30'
        },
        {
            type: 'snack',
            name: 'Trail Mix',
            duration: 20,
            time: '14:40'
        },
        {
            type: 'dinner',
            name: 'Pork Chops',
            duration: 60,
            time: '18:10'
        },
        {
            type: 'activity',
            name: 'Bike Ride',
            duration: 90,
            time: '19:30'
        }
    ],
    '2023-06-04': [
        {
            type: 'breakfast',
            name: 'Bagel with Cream Cheese',
            duration: 15,
            time: '09:30'
        },
        {
            type: 'snack',
            name: 'Dark Chocolate',
            duration: 15,
            time: '12:40'
        },
        {
            type: 'dinner',
            name: 'Steak and Potatoes',
            duration: 60,
            time: '18:10'
        }
    ],
    '2023-06-05': [
        {
            type: 'activity',
            name: 'Zumba',
            duration: 30,
            time: '09:15'
        },
        {
            type: 'dessert',
            name: 'Raspberry Tart',
            duration: 15,
            time: '18:20'
        }
    ],
    '2023-06-06': [
        {
            type: 'breakfast',
            name: 'Eggs Benedict',
            duration: 15,
            time: '07:00'
        },
        {
            type: 'lunch',
            name: 'Burrito',
            duration: 15,
            time: '12:20'
        },
        {
            type: 'snack',
            name: 'Dark Chocolate',
            duration: 15,
            time: '13:15'
        },
        {
            type: 'activity',
            name: 'Dance Class',
            duration: 75,
            time: '20:50'
        }
    ],
    '2023-06-07': [
        {
            type: 'breakfast',
            name: 'Blueberry Pancakes',
            duration: 30,
            time: '07:50'
        },
        {
            type: 'snack',
            name: 'Granola Bar',
            duration: 15,
            time: '09:10'
        },
        {
            type: 'activity',
            name: 'Kickboxing',
            duration: 30,
            time: '19:50'
        }
    ],
    '2023-06-08': [
        {
            type: 'breakfast',
            name: 'Fruit Salad',
            duration: 15,
            time: '07:30'
        },
        {
            type: 'lunch',
            name: 'Burger and Fries',
            duration: 30,
            time: '14:40'
        },
        {
            type: 'dinner',
            name: 'Lamb Stew',
            duration: 60,
            time: '19:20'
        }
    ],
    '2023-06-09': [
        {
            type: 'breakfast',
            name: 'Granola with Yogurt',
            duration: 15,
            time: '09:30'
        },
        {
            type: 'lunch',
            name: 'Chicken Soup',
            duration: 30,
            time: '13:30'
        },
        {
            type: 'activity',
            name: 'Gym Workout',
            duration: 75,
            time: '14:00'
        },
        {
            type: 'dinner',
            name: 'Grilled Salmon and Quinoa',
            duration: 30,
            time: '18:00'
        }
    ],
    '2023-06-10': [
        {
            type: 'snack',
            name: 'Smoothie',
            duration: 15,
            time: '08:15'
        },
        {
            type: 'lunch',
            name: 'Burrito',
            duration: 15,
            time: '14:50'
        },
        {
            type: 'dessert',
            name: 'Fruit Salad',
            duration: 30,
            time: '20:50'
        }
    ],
    '2023-06-11': [
        {
            type: 'snack',
            name: 'Boiled Egg',
            duration: 15,
            time: '09:00'
        },
        {
            type: 'dinner',
            name: 'Lamb Stew',
            duration: 45,
            time: '19:20'
        }
    ],
    '2023-06-12': [
        {
            type: 'snack',
            name: 'Mixed Nuts',
            duration: 20,
            time: '09:20'
        },
        {
            type: 'lunch',
            name: 'Stir Fry',
            duration: 30,
            time: '14:30'
        },
        {
            type: 'dinner',
            name: 'Lamb Stew',
            duration: 30,
            time: '18:20'
        },
        {
            type: 'dessert',
            name: 'Lemon Meringue Pie',
            duration: 15,
            time: '18:50'
        },
        {
            type: 'activity',
            name: 'Tai Chi',
            duration: 30,
            time: '19:30'
        }
    ],
    '2023-06-13': [
        {
            type: 'activity',
            name: 'Tai Chi',
            duration: 30,
            time: '07:15'
        },
        {
            type: 'activity',
            name: 'Bike Ride',
            duration: 30,
            time: '12:00'
        }
    ],
    '2023-06-14': [
        {
            type: 'breakfast',
            name: 'Smoothie',
            duration: 30,
            time: '08:10'
        },
        {
            type: 'activity',
            name: 'Weight Training',
            duration: 60,
            time: '09:45'
        },
        {
            type: 'lunch',
            name: 'Chicken Soup',
            duration: 30,
            time: '12:40'
        },
        {
            type: 'activity',
            name: 'Rowing',
            duration: 45,
            time: '14:45'
        },
        {
            type: 'activity',
            name: 'Aerobics',
            duration: 90,
            time: '18:15'
        }
    ],
    '2023-06-15': [
        {
            type: 'snack',
            name: 'Protein Bar',
            duration: 20,
            time: '07:30'
        },
        {
            type: 'lunch',
            name: 'Grilled Chicken with Vegetables',
            duration: 15,
            time: '13:45'
        },
        {
            type: 'dinner',
            name: 'Vegetarian Pizza',
            duration: 30,
            time: '20:10'
        }
    ],
    '2023-06-16': [
        {
            type: 'activity',
            name: 'Soccer',
            duration: 45,
            time: '12:10'
        },
        {
            type: 'dinner',
            name: 'Spaghetti Bolognese',
            duration: 30,
            time: '20:45'
        }
    ],
    '2023-06-17': [
        {
            type: 'dinner',
            name: 'Grilled Salmon and Quinoa',
            duration: 60,
            time: '18:40'
        },
        {
            type: 'dessert',
            name: 'Carrot Cake',
            duration: 20,
            time: '20:40'
        }
    ],
    '2023-06-18': [
        {
            type: 'breakfast',
            name: 'Bagel with Cream Cheese',
            duration: 30,
            time: '09:10'
        },
        {
            type: 'lunch',
            name: 'Pasta',
            duration: 30,
            time: '14:15'
        },
        {
            type: 'dessert',
            name: 'Creme Brulee',
            duration: 20,
            time: '18:45'
        }
    ],
    '2023-06-19': [
        {
            type: 'lunch',
            name: 'Grilled Chicken with Vegetables',
            duration: 45,
            time: '14:00'
        },
        {
            type: 'dinner',
            name: 'Chicken Stir-Fry',
            duration: 60,
            time: '20:10'
        }
    ],
    '2023-06-20': [
        {
            type: 'snack',
            name: 'Vegetable Sticks with Hummus',
            duration: 15,
            time: '08:00'
        },
        {
            type: 'activity',
            name: 'Gym Workout',
            duration: 90,
            time: '12:20'
        },
        {
            type: 'activity',
            name: 'Swimming',
            duration: 60,
            time: '18:40'
        }
    ],
    '2023-06-21': [
        {
            type: 'snack',
            name: 'Fresh Fruit',
            duration: 15,
            time: '08:30'
        },
        {
            type: 'lunch',
            name: 'Quinoa Salad',
            duration: 45,
            time: '12:50'
        }
    ],
    '2023-06-22': [
        {
            type: 'snack',
            name: 'Cheese and Crackers',
            duration: 15,
            time: '09:00'
        },
        {
            type: 'snack',
            name: 'Protein Bar',
            duration: 20,
            time: '14:40'
        },
        {
            type: 'dinner',
            name: 'Vegetarian Pizza',
            duration: 60,
            time: '19:50'
        }
    ],
    '2023-06-23': [
        {
            type: 'snack',
            name: 'Protein Bar',
            duration: 15,
            time: '09:00'
        },
        {
            type: 'lunch',
            name: 'Grilled Chicken with Vegetables',
            duration: 15,
            time: '12:00'
        }
    ],
    '2023-06-24': [
        {
            type: 'activity',
            name: 'Cycling',
            duration: 75,
            time: '09:40'
        },
        {
            type: 'snack',
            name: 'Dark Chocolate',
            duration: 20,
            time: '13:20'
        },
        {
            type: 'drink',
            name: 'Green Smoothie',
            duration: 25,
            time: '19:20'
        }
    ],
    '2023-06-25': [
        {
            type: 'breakfast',
            name: 'Bagel with Cream Cheese',
            duration: 30,
            time: '07:30'
        },
        {
            type: 'snack',
            name: 'Cheese and Crackers',
            duration: 15,
            time: '09:45'
        },
        {
            type: 'activity',
            name: 'Dance Class',
            duration: 75,
            time: '13:10'
        },
        {
            type: 'dinner',
            name: 'Pork Chops',
            duration: 60,
            time: '20:10'
        }
    ],
    '2023-06-26': [
        {
            type: 'breakfast',
            name: 'Protein Shake',
            duration: 30,
            time: '08:00'
        },
        {
            type: 'snack',
            name: 'Apple Slices with Peanut Butter',
            duration: 15,
            time: '13:15'
        },
        {
            type: 'activity',
            name: 'Tennis',
            duration: 45,
            time: '14:10'
        },
        {
            type: 'dessert',
            name: 'Raspberry Tart',
            duration: 15,
            time: '18:15'
        },
        {
            type: 'drink',
            name: 'Coconut Water',
            duration: 15,
            time: '19:20'
        }
    ],
    '2023-06-27': [
        {
            type: 'lunch',
            name: 'BLT Sandwich',
            duration: 30,
            time: '12:00'
        },
        {
            type: 'activity',
            name: 'Yoga',
            duration: 60,
            time: '18:15'
        }
    ],
    '2023-06-28': [
        {
            type: 'breakfast',
            name: 'Toast with Jam',
            duration: 30,
            time: '09:45'
        },
        {
            type: 'lunch',
            name: 'BLT Sandwich',
            duration: 45,
            time: '13:50'
        },
        {
            type: 'dessert',
            name: 'Raspberry Tart',
            duration: 20,
            time: '18:00'
        },
        {
            type: 'drink',
            name: 'Herbal Tea',
            duration: 20,
            time: '19:20'
        }
    ],
    '2023-06-29': [
        {
            type: 'snack',
            name: 'Smoothie',
            duration: 15,
            time: '14:30'
        },
        {
            type: 'dinner',
            name: 'Chicken Parmesan',
            duration: 30,
            time: '20:20'
        }
    ],
    '2023-06-30': [
        {
            type: 'snack',
            name: 'Trail Mix',
            duration: 15,
            time: '12:45'
        },
        {
            type: 'dinner',
            name: 'Chicken Parmesan',
            duration: 45,
            time: '18:15'
        },
        {
            type: 'activity',
            name: 'Cycling',
            duration: 90,
            time: '20:40'
        }
    ],
    '2023-07-01': [
        {
            type: 'breakfast',
            name: 'Protein Shake',
            duration: 15,
            time: '08:20'
        },
        {
            type: 'activity',
            name: 'Boxing',
            duration: 60,
            time: '13:45'
        }
    ],
    '2023-07-02': [
        {
            type: 'snack',
            name: 'Dried Fruit',
            duration: 20,
            time: '08:20'
        },
        {
            type: 'lunch',
            name: 'BLT Sandwich',
            duration: 45,
            time: '12:15'
        },
        {
            type: 'snack',
            name: 'Dark Chocolate',
            duration: 20,
            time: '14:50'
        },
        {
            type: 'drink',
            name: 'Chamomile Tea',
            duration: 20,
            time: '20:20'
        }
    ],
    '2023-07-03': [
        {
            type: 'breakfast',
            name: 'Quiche',
            duration: 30,
            time: '07:10'
        },
        {
            type: 'snack',
            name: 'Fresh Fruit',
            duration: 15,
            time: '08:20'
        },
        {
            type: 'snack',
            name: 'Apple Slices with Peanut Butter',
            duration: 15,
            time: '14:45'
        },
        {
            type: 'drink',
            name: 'Coconut Water',
            duration: 25,
            time: '20:45'
        }
    ],
    '2023-07-04': [
        {
            type: 'snack',
            name: 'Boiled Egg',
            duration: 15,
            time: '07:15'
        },
        {
            type: 'lunch',
            name: 'Sushi',
            duration: 30,
            time: '14:50'
        },
        {
            type: 'dessert',
            name: 'Lemon Meringue Pie',
            duration: 20,
            time: '19:40'
        },
        {
            type: 'drink',
            name: 'Chamomile Tea',
            duration: 15,
            time: '20:50'
        }
    ],
    '2023-07-05': [
        {
            type: 'activity',
            name: 'Pilates',
            duration: 90,
            time: '07:10'
        },
        {
            type: 'lunch',
            name: 'BLT Sandwich',
            duration: 30,
            time: '12:20'
        },
        {
            type: 'drink',
            name: 'Espresso',
            duration: 20,
            time: '19:20'
        }
    ],
    '2023-07-06': [
        {
            type: 'breakfast',
            name: 'Avocado Toast',
            duration: 15,
            time: '07:00'
        },
        {
            type: 'snack',
            name: 'Dried Fruit',
            duration: 15,
            time: '09:40'
        },
        {
            type: 'drink',
            name: 'Iced Tea',
            duration: 25,
            time: '20:45'
        }
    ],
    '2023-07-07': [
        {
            type: 'breakfast',
            name: 'Croissant',
            duration: 15,
            time: '07:40'
        },
        {
            type: 'lunch',
            name: 'Veggie Wrap',
            duration: 15,
            time: '13:00'
        },
        {
            type: 'dessert',
            name: 'Chocolate Mousse',
            duration: 15,
            time: '19:00'
        },
        {
            type: 'activity',
            name: 'Pilates',
            duration: 30,
            time: '19:30'
        }
    ],
    '2023-07-08': [
        {
            type: 'breakfast',
            name: 'Bagel with Cream Cheese',
            duration: 30,
            time: '07:15'
        },
        {
            type: 'activity',
            name: 'Soccer',
            duration: 30,
            time: '08:45'
        },
        {
            type: 'snack',
            name: 'Dried Fruit',
            duration: 20,
            time: '13:30'
        },
        {
            type: 'drink',
            name: 'Protein Shake',
            duration: 15,
            time: '18:15'
        }
    ],
    '2023-07-09': [
        {
            type: 'breakfast',
            name: 'Blueberry Pancakes',
            duration: 15,
            time: '08:10'
        },
        {
            type: 'dessert',
            name: 'Strawberry Shortcake',
            duration: 15,
            time: '18:50'
        }
    ],
    '2023-07-10': [
        {
            type: 'dinner',
            name: 'Vegetarian Pizza',
            duration: 60,
            time: '19:45'
        }
    ],
    '2023-07-11': [
        {
            type: 'breakfast',
            name: 'Porridge with Berries',
            duration: 15,
            time: '09:00'
        }
    ],
    '2023-07-12': [
        {
            type: 'breakfast',
            name: 'Toast with Jam',
            duration: 30,
            time: '08:15'
        },
        {
            type: 'dinner',
            name: 'Vegetable Curry',
            duration: 45,
            time: '20:40'
        }
    ],
    '2023-07-13': [
        {
            type: 'dinner',
            name: 'Steak and Potatoes',
            duration: 30,
            time: '20:30'
        }
    ],
    '2023-07-14': [
        {
            type: 'activity',
            name: 'Cycling',
            duration: 45,
            time: '07:45'
        },
        {
            type: 'lunch',
            name: 'Burrito',
            duration: 30,
            time: '12:40'
        },
        {
            type: 'activity',
            name: 'Yoga',
            duration: 45,
            time: '14:40'
        },
        {
            type: 'dessert',
            name: 'Brownie',
            duration: 15,
            time: '20:20'
        }
    ],
    '2023-07-15': [
        {
            type: 'activity',
            name: 'Gym Workout',
            duration: 90,
            time: '08:40'
        },
        {
            type: 'dinner',
            name: 'Shrimp Paella',
            duration: 45,
            time: '19:40'
        },
        {
            type: 'drink',
            name: 'Green Smoothie',
            duration: 15,
            time: '20:30'
        }
    ],
    '2023-07-16': [
        {
            type: 'activity',
            name: 'Cycling',
            duration: 30,
            time: '09:10'
        },
        {
            type: 'snack',
            name: 'Rice Cakes',
            duration: 20,
            time: '12:00'
        },
        {
            type: 'activity',
            name: 'Gym Workout',
            duration: 75,
            time: '13:10'
        },
        {
            type: 'dessert',
            name: 'Carrot Cake',
            duration: 20,
            time: '20:40'
        }
    ],
    '2023-07-17': [
        {
            type: 'breakfast',
            name: 'Quiche',
            duration: 15,
            time: '09:15'
        },
        {
            type: 'lunch',
            name: 'Sushi',
            duration: 30,
            time: '14:00'
        },
        {
            type: 'dessert',
            name: 'Creme Brulee',
            duration: 15,
            time: '20:20'
        }
    ],
    '2023-07-18': [
        {
            type: 'snack',
            name: 'Apple Slices with Peanut Butter',
            duration: 15,
            time: '12:15'
        },
        {
            type: 'activity',
            name: 'Basketball',
            duration: 60,
            time: '12:50'
        },
        {
            type: 'dessert',
            name: 'Fruit Salad',
            duration: 20,
            time: '18:40'
        }
    ],
    '2023-07-19': [
        {
            type: 'breakfast',
            name: 'Toast with Jam',
            duration: 30,
            time: '07:10'
        },
        {
            type: 'activity',
            name: 'Kickboxing',
            duration: 75,
            time: '08:50'
        },
        {
            type: 'snack',
            name: 'Dried Fruit',
            duration: 15,
            time: '13:20'
        },
        {
            type: 'dessert',
            name: 'Chocolate Mousse',
            duration: 20,
            time: '19:10'
        },
        {
            type: 'drink',
            name: 'Chamomile Tea',
            duration: 25,
            time: '20:45'
        }
    ],
    '2023-07-20': [
        {
            type: 'activity',
            name: 'Swimming',
            duration: 60,
            time: '13:30'
        },
        {
            type: 'dinner',
            name: 'Chicken Parmesan',
            duration: 45,
            time: '18:15'
        }
    ],
    '2023-07-21': [
        {
            type: 'breakfast',
            name: 'French Toast',
            duration: 30,
            time: '07:30'
        },
        {
            type: 'activity',
            name: 'Tai Chi',
            duration: 75,
            time: '08:10'
        },
        {
            type: 'activity',
            name: 'Bike Ride',
            duration: 30,
            time: '12:50'
        },
        {
            type: 'drink',
            name: 'Iced Coffee',
            duration: 25,
            time: '18:20'
        }
    ],
    '2023-07-22': [
        {
            type: 'activity',
            name: 'Kickboxing',
            duration: 60,
            time: '07:15'
        },
        {
            type: 'lunch',
            name: 'Quinoa Salad',
            duration: 45,
            time: '12:15'
        },
        {
            type: 'activity',
            name: 'Rowing',
            duration: 90,
            time: '14:50'
        }
    ],
    '2023-07-23': [
        {
            type: 'activity',
            name: 'Boxing',
            duration: 45,
            time: '08:50'
        },
        {
            type: 'lunch',
            name: 'Grilled Chicken with Vegetables',
            duration: 30,
            time: '12:20'
        },
        {
            type: 'snack',
            name: 'Protein Bar',
            duration: 15,
            time: '14:10'
        },
        {
            type: 'drink',
            name: 'Lemonade',
            duration: 25,
            time: '18:30'
        },
        {
            type: 'activity',
            name: 'Soccer',
            duration: 75,
            time: '20:50'
        }
    ],
    '2023-07-24': [
        {
            type: 'breakfast',
            name: 'Eggs Benedict',
            duration: 30,
            time: '08:20'
        },
        {
            type: 'lunch',
            name: 'Prawn Salad',
            duration: 30,
            time: '14:00'
        },
        {
            type: 'dinner',
            name: 'Shrimp Paella',
            duration: 60,
            time: '18:15'
        },
        {
            type: 'drink',
            name: 'Hot Chocolate',
            duration: 25,
            time: '19:15'
        },
        {
            type: 'activity',
            name: 'Jogging',
            duration: 75,
            time: '19:40'
        }
    ],
    '2023-07-25': [
        {
            type: 'breakfast',
            name: 'Croissant',
            duration: 15,
            time: '07:30'
        },
        {
            type: 'snack',
            name: 'Protein Bar',
            duration: 15,
            time: '07:45'
        },
        {
            type: 'activity',
            name: 'Kickboxing',
            duration: 60,
            time: '08:10'
        },
        {
            type: 'lunch',
            name: 'Falafel Pita',
            duration: 45,
            time: '12:15'
        },
        {
            type: 'dinner',
            name: 'Lasagna',
            duration: 60,
            time: '19:45'
        }
    ],
    '2023-07-26': [
        {
            type: 'snack',
            name: 'Smoothie',
            duration: 20,
            time: '09:45'
        },
        {
            type: 'activity',
            name: 'Hiking',
            duration: 75,
            time: '14:15'
        },
        {
            type: 'dinner',
            name: 'Grilled Salmon and Quinoa',
            duration: 30,
            time: '20:00'
        }
    ],
    '2023-07-27': [
        {
            type: 'snack',
            name: 'Granola Bar',
            duration: 15,
            time: '09:20'
        },
        {
            type: 'dessert',
            name: 'Chocolate Mousse',
            duration: 20,
            time: '19:10'
        },
        {
            type: 'drink',
            name: 'Iced Coffee',
            duration: 15,
            time: '20:40'
        }
    ],
    '2023-07-28': [
        {
            type: 'breakfast',
            name: 'Omelette',
            duration: 15,
            time: '09:20'
        }
    ],
    '2023-07-29': [
        {
            type: 'activity',
            name: 'Yoga',
            duration: 75,
            time: '09:45'
        },
        {
            type: 'snack',
            name: 'Popcorn',
            duration: 20,
            time: '12:45'
        }
    ],
    '2023-07-30': [
        {
            type: 'lunch',
            name: 'BLT Sandwich',
            duration: 30,
            time: '14:20'
        },
        {
            type: 'activity',
            name: 'Soccer',
            duration: 90,
            time: '19:50'
        }
    ],
    '2023-07-31': [
        {
            type: 'snack',
            name: 'Smoothie',
            duration: 15,
            time: '09:45'
        },
        {
            type: 'lunch',
            name: 'Burrito',
            duration: 30,
            time: '14:50'
        },
        {
            type: 'dessert',
            name: 'Raspberry Tart',
            duration: 15,
            time: '19:15'
        },
        {
            type: 'activity',
            name: 'Rowing',
            duration: 45,
            time: '20:10'
        }
    ],
    '2023-08-01': [
        {
            type: 'breakfast',
            name: 'Smoothie',
            duration: 30,
            time: '09:45'
        }
    ],
    '2023-08-02': [
        {
            type: 'breakfast',
            name: 'Toast with Jam',
            duration: 15,
            time: '08:30'
        },
        {
            type: 'snack',
            name: 'Fresh Fruit',
            duration: 15,
            time: '13:15'
        },
        {
            type: 'dinner',
            name: 'BBQ Ribs',
            duration: 45,
            time: '20:15'
        }
    ],
    '2023-08-03': [
        {
            type: 'lunch',
            name: 'Pasta',
            duration: 30,
            time: '13:40'
        },
        {
            type: 'dinner',
            name: 'Spaghetti Bolognese',
            duration: 30,
            time: '20:45'
        }
    ],
    '2023-08-04': [
        {
            type: 'dessert',
            name: 'Fruit Salad',
            duration: 20,
            time: '20:15'
        }
    ],
    '2023-08-05': [
        {
            type: 'snack',
            name: 'Dark Chocolate',
            duration: 15,
            time: '07:50'
        },
        {
            type: 'lunch',
            name: 'Chicken Soup',
            duration: 30,
            time: '14:30'
        },
        {
            type: 'dinner',
            name: 'Lasagna',
            duration: 60,
            time: '19:30'
        }
    ],
    '2023-08-06': [
        {
            type: 'drink',
            name: 'Hot Chocolate',
            duration: 20,
            time: '18:50'
        },
        {
            type: 'activity',
            name: 'Basketball',
            duration: 75,
            time: '19:45'
        }
    ],
    '2023-08-07': [
        {
            type: 'activity',
            name: 'Soccer',
            duration: 90,
            time: '09:40'
        },
        {
            type: 'drink',
            name: 'Latte',
            duration: 25,
            time: '18:50'
        }
    ],
    '2023-08-08': [
        {
            type: 'lunch',
            name: 'BLT Sandwich',
            duration: 45,
            time: '13:20'
        },
        {
            type: 'drink',
            name: 'Latte',
            duration: 20,
            time: '18:45'
        }
    ],
    '2023-08-09': [
        {
            type: 'snack',
            name: 'Cheese and Crackers',
            duration: 20,
            time: '09:50'
        },
        {
            type: 'activity',
            name: 'Bike Ride',
            duration: 60,
            time: '13:20'
        },
        {
            type: 'dinner',
            name: 'Vegetarian Pizza',
            duration: 60,
            time: '18:10'
        },
        {
            type: 'dessert',
            name: 'Tiramisu',
            duration: 30,
            time: '19:50'
        }
    ],
    '2023-08-10': [
        {
            type: 'snack',
            name: 'Apple Slices with Peanut Butter',
            duration: 15,
            time: '09:10'
        },
        {
            type: 'lunch',
            name: 'Tacos',
            duration: 15,
            time: '13:00'
        },
        {
            type: 'drink',
            name: 'Iced Tea',
            duration: 15,
            time: '20:45'
        }
    ],
    '2023-08-11': [
        {
            type: 'breakfast',
            name: 'Porridge with Berries',
            duration: 30,
            time: '08:40'
        },
        {
            type: 'activity',
            name: 'Pilates',
            duration: 60,
            time: '12:40'
        },
        {
            type: 'dinner',
            name: 'Grilled Salmon and Quinoa',
            duration: 30,
            time: '19:45'
        }
    ],
    '2023-08-12': [
        {
            type: 'snack',
            name: 'Trail Mix',
            duration: 20,
            time: '07:45'
        },
        {
            type: 'lunch',
            name: 'Pasta',
            duration: 45,
            time: '14:15'
        },
        {
            type: 'dinner',
            name: 'Pork Chops',
            duration: 60,
            time: '18:45'
        }
    ],
    '2023-08-13': [
        {
            type: 'snack',
            name: 'Trail Mix',
            duration: 15,
            time: '08:10'
        },
        {
            type: 'activity',
            name: 'Dance Class',
            duration: 90,
            time: '14:20'
        }
    ],
    '2023-08-14': [
        {
            type: 'activity',
            name: 'Weight Training',
            duration: 60,
            time: '13:30'
        },
        {
            type: 'drink',
            name: 'Fresh Juice',
            duration: 15,
            time: '19:15'
        }
    ],
    '2023-08-15': [
        {
            type: 'breakfast',
            name: 'Avocado Toast',
            duration: 15,
            time: '09:45'
        },
        {
            type: 'activity',
            name: 'Weight Training',
            duration: 90,
            time: '14:00'
        }
    ],
    '2023-08-16': [
        {
            type: 'snack',
            name: 'Smoothie',
            duration: 20,
            time: '07:20'
        },
        {
            type: 'lunch',
            name: 'Tuna Salad Wrap',
            duration: 45,
            time: '14:30'
        }
    ],
    '2023-08-17': [
        {
            type: 'breakfast',
            name: 'Cereal with Milk',
            duration: 15,
            time: '08:50'
        },
        {
            type: 'dessert',
            name: 'Apple Pie',
            duration: 15,
            time: '19:50'
        },
        {
            type: 'activity',
            name: 'Rowing',
            duration: 30,
            time: '20:10'
        }
    ],
    '2023-08-18': [
        {
            type: 'breakfast',
            name: 'Toast with Jam',
            duration: 30,
            time: '07:30'
        },
        {
            type: 'activity',
            name: 'Aerobics',
            duration: 60,
            time: '08:40'
        },
        {
            type: 'dinner',
            name: 'Lamb Stew',
            duration: 30,
            time: '19:20'
        }
    ],
    '2023-08-19': [
        {
            type: 'breakfast',
            name: 'Blueberry Pancakes',
            duration: 15,
            time: '07:15'
        },
        {
            type: 'snack',
            name: 'Fresh Fruit',
            duration: 15,
            time: '08:10'
        },
        {
            type: 'dessert',
            name: 'Carrot Cake',
            duration: 15,
            time: '18:10'
        },
        {
            type: 'activity',
            name: 'Aerobics',
            duration: 45,
            time: '18:40'
        }
    ],
    '2023-08-20': [
        {
            type: 'activity',
            name: 'Aerobics',
            duration: 90,
            time: '20:20'
        }
    ],
    '2023-08-21': [
        {
            type: 'lunch',
            name: 'Tacos',
            duration: 30,
            time: '13:45'
        },
        {
            type: 'drink',
            name: 'Coconut Water',
            duration: 25,
            time: '18:00'
        }
    ],
    '2023-08-22': [
        {
            type: 'activity',
            name: 'Rowing',
            duration: 60,
            time: '07:15'
        },
        {
            type: 'activity',
            name: 'Weight Training',
            duration: 75,
            time: '14:15'
        },
        {
            type: 'dinner',
            name: 'Fish and Chips',
            duration: 60,
            time: '20:50'
        }
    ],
    '2023-08-23': [
        {
            type: 'snack',
            name: 'Dark Chocolate',
            duration: 20,
            time: '09:20'
        },
        {
            type: 'snack',
            name: 'Dried Fruit',
            duration: 20,
            time: '14:40'
        },
        {
            type: 'dessert',
            name: 'Raspberry Tart',
            duration: 30,
            time: '18:40'
        }
    ],
    '2023-08-24': [
        {
            type: 'breakfast',
            name: 'Toast with Jam',
            duration: 30,
            time: '09:40'
        },
        {
            type: 'snack',
            name: 'Fresh Fruit',
            duration: 15,
            time: '14:20'
        },
        {
            type: 'drink',
            name: 'Iced Coffee',
            duration: 20,
            time: '20:50'
        }
    ],
    '2023-08-25': [
        {
            type: 'breakfast',
            name: 'Quiche',
            duration: 30,
            time: '07:40'
        },
        {
            type: 'drink',
            name: 'Iced Coffee',
            duration: 25,
            time: '19:50'
        }
    ],
    '2023-08-26': [
        {
            type: 'breakfast',
            name: 'Cereal with Milk',
            duration: 15,
            time: '09:45'
        },
        {
            type: 'activity',
            name: 'Jogging',
            duration: 45,
            time: '13:45'
        },
        {
            type: 'activity',
            name: 'Pilates',
            duration: 45,
            time: '18:40'
        }
    ],
    '2023-08-27': [
        {
            type: 'breakfast',
            name: 'Eggs Benedict',
            duration: 15,
            time: '08:00'
        },
        {
            type: 'lunch',
            name: 'Tacos',
            duration: 30,
            time: '13:40'
        },
        {
            type: 'dessert',
            name: 'Carrot Cake',
            duration: 30,
            time: '20:45'
        }
    ],
    '2023-08-28': [
        {
            type: 'dessert',
            name: 'Fruit Salad',
            duration: 20,
            time: '18:20'
        }
    ],
    '2023-08-29': [
        {
            type: 'breakfast',
            name: 'Protein Shake',
            duration: 30,
            time: '08:15'
        },
        {
            type: 'activity',
            name: 'Rowing',
            duration: 30,
            time: '13:00'
        }
    ],
    '2023-08-30': [
        {
            type: 'activity',
            name: 'Cycling',
            duration: 75,
            time: '08:10'
        },
        {
            type: 'lunch',
            name: 'Sushi',
            duration: 30,
            time: '12:00'
        },
        {
            type: 'dessert',
            name: 'Tiramisu',
            duration: 30,
            time: '18:30'
        },
        {
            type: 'drink',
            name: 'Matcha Latte',
            duration: 20,
            time: '19:45'
        }
    ],
    '2023-08-31': [
        {
            type: 'breakfast',
            name: 'Blueberry Pancakes',
            duration: 15,
            time: '08:30'
        },
        {
            type: 'activity',
            name: 'Cycling',
            duration: 75,
            time: '13:40'
        }
    ],
    '2023-09-01': [
        {
            type: 'snack',
            name: 'Cheese and Crackers',
            duration: 15,
            time: '08:20'
        },
        {
            type: 'drink',
            name: 'Herbal Tea',
            duration: 25,
            time: '19:20'
        }
    ],
    '2023-09-02': [
        {
            type: 'snack',
            name: 'Popcorn',
            duration: 20,
            time: '07:10'
        },
        {
            type: 'lunch',
            name: 'Quinoa Salad',
            duration: 30,
            time: '12:00'
        },
        {
            type: 'activity',
            name: 'Tai Chi',
            duration: 45,
            time: '14:45'
        },
        {
            type: 'drink',
            name: 'Latte',
            duration: 15,
            time: '19:10'
        }
    ],
    '2023-09-03': [
        {
            type: 'breakfast',
            name: 'Smoothie',
            duration: 30,
            time: '07:00'
        },
        {
            type: 'snack',
            name: 'Smoothie',
            duration: 15,
            time: '13:15'
        },
        {
            type: 'activity',
            name: 'Cycling',
            duration: 30,
            time: '14:15'
        },
        {
            type: 'dessert',
            name: 'Fruit Salad',
            duration: 20,
            time: '18:20'
        },
        {
            type: 'activity',
            name: 'Aerobics',
            duration: 45,
            time: '19:00'
        }
    ],
    '2023-09-04': [
        {
            type: 'activity',
            name: 'Yoga',
            duration: 90,
            time: '09:15'
        },
        {
            type: 'dessert',
            name: 'Chocolate Mousse',
            duration: 20,
            time: '19:15'
        },
        {
            type: 'drink',
            name: 'Lemonade',
            duration: 20,
            time: '20:10'
        }
    ],
    '2023-09-05': [
        {
            type: 'snack',
            name: 'Smoothie',
            duration: 15,
            time: '07:15'
        },
        {
            type: 'activity',
            name: 'Yoga',
            duration: 45,
            time: '09:30'
        },
        {
            type: 'snack',
            name: 'Boiled Egg',
            duration: 20,
            time: '14:00'
        },
        {
            type: 'dinner',
            name: 'Pork Chops',
            duration: 45,
            time: '20:45'
        }
    ],
    '2023-09-06': [
        {
            type: 'activity',
            name: 'Zumba',
            duration: 75,
            time: '08:20'
        },
        {
            type: 'lunch',
            name: 'Burger and Fries',
            duration: 30,
            time: '13:20'
        },
        {
            type: 'snack',
            name: 'Protein Bar',
            duration: 20,
            time: '14:45'
        },
        {
            type: 'dessert',
            name: 'Tiramisu',
            duration: 20,
            time: '20:20'
        }
    ],
    '2023-09-07': [
        {
            type: 'breakfast',
            name: 'Omelette',
            duration: 15,
            time: '08:40'
        }
    ],
    '2023-09-08': [
        {
            type: 'snack',
            name: 'Granola Bar',
            duration: 15,
            time: '12:10'
        },
        {
            type: 'dessert',
            name: 'Chocolate Mousse',
            duration: 15,
            time: '18:40'
        }
    ],
    '2023-09-09': [
        {
            type: 'breakfast',
            name: 'Blueberry Pancakes',
            duration: 30,
            time: '09:45'
        },
        {
            type: 'snack',
            name: 'Cheese and Crackers',
            duration: 20,
            time: '13:50'
        }
    ],
    '2023-09-10': [
        {
            type: 'snack',
            name: 'Trail Mix',
            duration: 15,
            time: '13:00'
        },
        {
            type: 'dinner',
            name: 'Vegetarian Pizza',
            duration: 30,
            time: '19:45'
        }
    ],
    '2023-09-11': [
        {
            type: 'snack',
            name: 'Smoothie',
            duration: 15,
            time: '09:10'
        },
        {
            type: 'lunch',
            name: 'Quinoa Salad',
            duration: 15,
            time: '14:45'
        },
        {
            type: 'dessert',
            name: 'Apple Pie',
            duration: 15,
            time: '19:40'
        }
    ],
    '2023-09-12': [
        {
            type: 'snack',
            name: 'Granola Bar',
            duration: 20,
            time: '09:00'
        },
        {
            type: 'lunch',
            name: 'Tuna Salad Wrap',
            duration: 30,
            time: '13:10'
        },
        {
            type: 'dinner',
            name: 'Steak and Potatoes',
            duration: 60,
            time: '20:10'
        }
    ],
    '2023-09-13': [
        {
            type: 'lunch',
            name: 'Chicken Soup',
            duration: 15,
            time: '14:00'
        },
        {
            type: 'activity',
            name: 'Zumba',
            duration: 60,
            time: '20:40'
        }
    ],
    '2023-09-14': [
        {
            type: 'breakfast',
            name: 'Toast with Jam',
            duration: 30,
            time: '09:50'
        },
        {
            type: 'lunch',
            name: 'Grilled Chicken with Vegetables',
            duration: 45,
            time: '13:10'
        },
        {
            type: 'drink',
            name: 'Matcha Latte',
            duration: 15,
            time: '19:20'
        }
    ],
    '2023-09-15': [
        {
            type: 'breakfast',
            name: 'Granola with Yogurt',
            duration: 30,
            time: '08:30'
        },
        {
            type: 'snack',
            name: 'Smoothie',
            duration: 15,
            time: '09:20'
        },
        {
            type: 'snack',
            name: 'Fresh Fruit',
            duration: 15,
            time: '13:50'
        },
        {
            type: 'dessert',
            name: 'Apple Pie',
            duration: 15,
            time: '18:00'
        },
        {
            type: 'drink',
            name: 'Fresh Juice',
            duration: 15,
            time: '19:45'
        }
    ],
    '2023-09-16': [
        {
            type: 'breakfast',
            name: 'Smoothie',
            duration: 15,
            time: '09:30'
        },
        {
            type: 'drink',
            name: 'Water',
            duration: 15,
            time: '19:40'
        }
    ],
    '2023-09-17': [
        {
            type: 'activity',
            name: 'Kickboxing',
            duration: 90,
            time: '20:00'
        }
    ],
    '2023-09-18': [
        {
            type: 'activity',
            name: 'Yoga',
            duration: 45,
            time: '08:40'
        },
        {
            type: 'activity',
            name: 'Meditation',
            duration: 60,
            time: '12:45'
        },
        {
            type: 'dessert',
            name: 'Apple Pie',
            duration: 15,
            time: '18:20'
        },
        {
            type: 'drink',
            name: 'Herbal Tea',
            duration: 15,
            time: '20:15'
        }
    ],
    '2023-09-19': [
        {
            type: 'snack',
            name: 'Smoothie',
            duration: 20,
            time: '07:10'
        },
        {
            type: 'lunch',
            name: 'Burger and Fries',
            duration: 30,
            time: '14:40'
        },
        {
            type: 'drink',
            name: 'Matcha Latte',
            duration: 20,
            time: '20:50'
        }
    ],
    '2023-09-20': [
        {
            type: 'breakfast',
            name: 'Protein Shake',
            duration: 15,
            time: '07:30'
        },
        {
            type: 'activity',
            name: 'Meditation',
            duration: 30,
            time: '08:00'
        },
        {
            type: 'activity',
            name: 'Aerobics',
            duration: 45,
            time: '13:45'
        },
        {
            type: 'dinner',
            name: 'Tofu Stir Fry',
            duration: 60,
            time: '20:45'
        }
    ],
    '2023-09-21': [
        {
            type: 'snack',
            name: 'Rice Cakes',
            duration: 20,
            time: '12:50'
        },
        {
            type: 'activity',
            name: 'Aerobics',
            duration: 60,
            time: '13:15'
        },
        {
            type: 'dinner',
            name: 'Pork Chops',
            duration: 45,
            time: '19:50'
        }
    ],
    '2023-09-22': [
        {
            type: 'breakfast',
            name: 'French Toast',
            duration: 30,
            time: '07:15'
        },
        {
            type: 'snack',
            name: 'Granola Bar',
            duration: 20,
            time: '07:50'
        },
        {
            type: 'activity',
            name: 'Bike Ride',
            duration: 60,
            time: '08:15'
        },
        {
            type: 'snack',
            name: 'Trail Mix',
            duration: 15,
            time: '14:45'
        },
        {
            type: 'dessert',
            name: 'Creme Brulee',
            duration: 30,
            time: '19:50'
        }
    ],
    '2023-09-23': [
        {
            type: 'activity',
            name: 'Weight Training',
            duration: 45,
            time: '08:50'
        },
        {
            type: 'dinner',
            name: 'Steak and Potatoes',
            duration: 30,
            time: '20:20'
        }
    ],
    '2023-09-24': [
        {
            type: 'snack',
            name: 'Yogurt',
            duration: 15,
            time: '09:15'
        },
        {
            type: 'dessert',
            name: 'Ice Cream Sundae',
            duration: 20,
            time: '18:45'
        },
        {
            type: 'activity',
            name: 'Tai Chi',
            duration: 30,
            time: '20:20'
        }
    ],
    '2023-09-25': [
        {
            type: 'snack',
            name: 'Mixed Nuts',
            duration: 20,
            time: '12:45'
        },
        {
            type: 'dinner',
            name: 'Shrimp Paella',
            duration: 45,
            time: '18:15'
        },
        {
            type: 'drink',
            name: 'Chamomile Tea',
            duration: 15,
            time: '20:10'
        }
    ],
    '2023-09-26': [
        {
            type: 'snack',
            name: 'Dried Fruit',
            duration: 15,
            time: '07:45'
        }
    ],
    '2023-09-27': [
        {
            type: 'breakfast',
            name: 'Avocado Toast',
            duration: 30,
            time: '08:00'
        },
        {
            type: 'snack',
            name: 'Popcorn',
            duration: 20,
            time: '08:30'
        },
        {
            type: 'dessert',
            name: 'Ice Cream Sundae',
            duration: 30,
            time: '18:50'
        }
    ],
    '2023-09-28': [
        {
            type: 'breakfast',
            name: 'Blueberry Pancakes',
            duration: 30,
            time: '09:10'
        },
        {
            type: 'activity',
            name: 'Jogging',
            duration: 75,
            time: '18:30'
        }
    ],
    '2023-09-29': [
        {
            type: 'breakfast',
            name: 'French Toast',
            duration: 15,
            time: '07:20'
        },
        {
            type: 'activity',
            name: 'Tennis',
            duration: 60,
            time: '14:00'
        },
        {
            type: 'dinner',
            name: 'Fish and Chips',
            duration: 45,
            time: '18:50'
        },
        {
            type: 'drink',
            name: 'Espresso',
            duration: 25,
            time: '20:00'
        }
    ],
    '2023-09-30': [
        {
            type: 'activity',
            name: 'Cycling',
            duration: 75,
            time: '09:45'
        },
        {
            type: 'activity',
            name: 'Gym Workout',
            duration: 60,
            time: '14:50'
        }
    ],
    '2023-10-01': [
        {
            type: 'snack',
            name: 'Vegetable Sticks with Hummus',
            duration: 15,
            time: '08:20'
        },
        {
            type: 'activity',
            name: 'Rowing',
            duration: 75,
            time: '09:40'
        },
        {
            type: 'dessert',
            name: 'Fruit Salad',
            duration: 15,
            time: '18:50'
        },
        {
            type: 'drink',
            name: 'Espresso',
            duration: 25,
            time: '19:20'
        }
    ],
    '2023-10-02': [
        {
            type: 'snack',
            name: 'Dark Chocolate',
            duration: 15,
            time: '07:40'
        },
        {
            type: 'lunch',
            name: 'Chicken Soup',
            duration: 15,
            time: '13:40'
        },
        {
            type: 'dessert',
            name: 'Raspberry Tart',
            duration: 30,
            time: '19:30'
        }
    ],
    '2023-10-03': [
        {
            type: 'breakfast',
            name: 'Smoothie',
            duration: 15,
            time: '07:30'
        },
        {
            type: 'snack',
            name: 'Dried Fruit',
            duration: 15,
            time: '12:50'
        },
        {
            type: 'activity',
            name: 'Weight Training',
            duration: 90,
            time: '18:30'
        }
    ],
    '2023-10-04': [
        {
            type: 'activity',
            name: 'Tennis',
            duration: 60,
            time: '08:10'
        },
        {
            type: 'lunch',
            name: 'Falafel Pita',
            duration: 30,
            time: '14:10'
        },
        {
            type: 'dinner',
            name: 'Lamb Stew',
            duration: 60,
            time: '18:45'
        }
    ],
    '2023-10-05': [],
    '2023-10-06': [
        {
            type: 'snack',
            name: 'Vegetable Sticks with Hummus',
            duration: 20,
            time: '07:20'
        },
        {
            type: 'activity',
            name: 'Weight Training',
            duration: 75,
            time: '08:00'
        },
        {
            type: 'snack',
            name: 'Smoothie',
            duration: 15,
            time: '12:30'
        },
        {
            type: 'activity',
            name: 'Yoga',
            duration: 60,
            time: '18:40'
        }
    ],
    '2023-10-07': [
        {
            type: 'activity',
            name: 'Tennis',
            duration: 30,
            time: '08:10'
        },
        {
            type: 'lunch',
            name: 'Grilled Chicken with Vegetables',
            duration: 15,
            time: '14:30'
        },
        {
            type: 'dinner',
            name: 'Lamb Stew',
            duration: 30,
            time: '20:45'
        }
    ],
    '2023-10-08': [
        {
            type: 'activity',
            name: 'Gym Workout',
            duration: 90,
            time: '12:00'
        },
        {
            type: 'dessert',
            name: 'Panna Cotta',
            duration: 30,
            time: '18:00'
        },
        {
            type: 'drink',
            name: 'Fresh Juice',
            duration: 20,
            time: '19:40'
        }
    ],
    '2023-10-09': [
        {
            type: 'snack',
            name: 'Dried Fruit',
            duration: 15,
            time: '09:30'
        },
        {
            type: 'drink',
            name: 'Coconut Water',
            duration: 20,
            time: '20:20'
        }
    ],
    '2023-10-10': [
        {
            type: 'dinner',
            name: 'Chicken Parmesan',
            duration: 45,
            time: '18:10'
        }
    ],
    '2023-10-11': [
        {
            type: 'snack',
            name: 'Cheese and Crackers',
            duration: 20,
            time: '09:50'
        },
        {
            type: 'lunch',
            name: 'Grilled Chicken with Vegetables',
            duration: 30,
            time: '14:45'
        },
        {
            type: 'dinner',
            name: 'Lamb Stew',
            duration: 60,
            time: '18:50'
        },
        {
            type: 'drink',
            name: 'Iced Tea',
            duration: 20,
            time: '19:50'
        }
    ],
    '2023-10-12': [
        {
            type: 'dinner',
            name: 'Chicken Stir-Fry',
            duration: 45,
            time: '20:50'
        }
    ],
    '2023-10-13': [
        {
            type: 'breakfast',
            name: 'Fruit Salad',
            duration: 30,
            time: '07:00'
        },
        {
            type: 'dessert',
            name: 'Raspberry Tart',
            duration: 30,
            time: '20:20'
        }
    ],
    '2023-10-14': [
        {
            type: 'breakfast',
            name: 'Smoothie',
            duration: 30,
            time: '08:20'
        },
        {
            type: 'snack',
            name: 'Dried Fruit',
            duration: 20,
            time: '12:30'
        },
        {
            type: 'dinner',
            name: 'Spaghetti Bolognese',
            duration: 60,
            time: '19:10'
        },
        {
            type: 'activity',
            name: 'Dance Class',
            duration: 30,
            time: '20:50'
        }
    ],
    '2023-10-15': [
        {
            type: 'snack',
            name: 'Boiled Egg',
            duration: 20,
            time: '08:30'
        },
        {
            type: 'lunch',
            name: 'Veggie Wrap',
            duration: 15,
            time: '12:00'
        },
        {
            type: 'dinner',
            name: 'Pork Chops',
            duration: 60,
            time: '19:40'
        }
    ],
    '2023-10-16': [
        {
            type: 'activity',
            name: 'Swimming',
            duration: 90,
            time: '09:00'
        },
        {
            type: 'snack',
            name: 'Protein Bar',
            duration: 20,
            time: '14:50'
        },
        {
            type: 'dessert',
            name: 'Chocolate Cake',
            duration: 30,
            time: '20:30'
        }
    ],
    '2023-10-17': [
        {
            type: 'lunch',
            name: 'Burger and Fries',
            duration: 30,
            time: '14:30'
        },
        {
            type: 'dinner',
            name: 'Chicken Parmesan',
            duration: 30,
            time: '20:10'
        }
    ],
    '2023-10-18': [
        {
            type: 'snack',
            name: 'Protein Bar',
            duration: 20,
            time: '07:50'
        },
        {
            type: 'activity',
            name: 'Boxing',
            duration: 45,
            time: '08:45'
        },
        {
            type: 'activity',
            name: 'Rowing',
            duration: 30,
            time: '13:40'
        },
        {
            type: 'dinner',
            name: 'Grilled Salmon and Quinoa',
            duration: 30,
            time: '19:10'
        }
    ],
    '2023-10-19': [
        {
            type: 'breakfast',
            name: 'Quiche',
            duration: 15,
            time: '07:50'
        },
        {
            type: 'snack',
            name: 'Boiled Egg',
            duration: 20,
            time: '09:40'
        },
        {
            type: 'snack',
            name: 'Trail Mix',
            duration: 20,
            time: '12:50'
        },
        {
            type: 'dessert',
            name: 'Fruit Salad',
            duration: 15,
            time: '20:10'
        }
    ],
    '2023-10-20': [
        {
            type: 'breakfast',
            name: 'Avocado Toast',
            duration: 30,
            time: '09:20'
        },
        {
            type: 'lunch',
            name: 'Quinoa Salad',
            duration: 45,
            time: '13:15'
        },
        {
            type: 'dinner',
            name: 'BBQ Ribs',
            duration: 30,
            time: '20:45'
        }
    ],
    '2023-10-21': [
        {
            type: 'breakfast',
            name: 'Toast with Jam',
            duration: 30,
            time: '07:15'
        },
        {
            type: 'snack',
            name: 'Fresh Fruit',
            duration: 20,
            time: '09:45'
        },
        {
            type: 'activity',
            name: 'Weight Training',
            duration: 60,
            time: '12:15'
        },
        {
            type: 'dinner',
            name: 'Chicken Stir-Fry',
            duration: 45,
            time: '20:50'
        }
    ],
    '2023-10-22': [
        {
            type: 'snack',
            name: 'Dark Chocolate',
            duration: 15,
            time: '09:40'
        },
        {
            type: 'dinner',
            name: 'Steak and Potatoes',
            duration: 30,
            time: '20:00'
        }
    ],
    '2023-10-23': [
        {
            type: 'lunch',
            name: 'Sushi',
            duration: 30,
            time: '13:10'
        },
        {
            type: 'dinner',
            name: 'Vegetable Curry',
            duration: 60,
            time: '20:50'
        }
    ],
    '2023-10-24': [
        {
            type: 'snack',
            name: 'Fresh Fruit',
            duration: 20,
            time: '13:45'
        },
        {
            type: 'dinner',
            name: 'Shrimp Paella',
            duration: 60,
            time: '18:40'
        }
    ],
    '2023-10-25': [
        {
            type: 'breakfast',
            name: 'Omelette',
            duration: 15,
            time: '09:50'
        },
        {
            type: 'lunch',
            name: 'Chicken Caesar Salad',
            duration: 45,
            time: '12:45'
        },
        {
            type: 'dessert',
            name: 'Tiramisu',
            duration: 20,
            time: '20:15'
        }
    ],
    '2023-10-26': [
        {
            type: 'breakfast',
            name: 'Croissant',
            duration: 30,
            time: '08:40'
        }
    ],
    '2023-10-27': [
        {
            type: 'breakfast',
            name: 'Avocado Toast',
            duration: 30,
            time: '07:00'
        },
        {
            type: 'snack',
            name: 'Granola Bar',
            duration: 20,
            time: '09:30'
        },
        {
            type: 'lunch',
            name: 'Burrito',
            duration: 45,
            time: '14:45'
        },
        {
            type: 'drink',
            name: 'Coconut Water',
            duration: 20,
            time: '18:50'
        }
    ],
    '2023-10-28': [
        {
            type: 'activity',
            name: 'Weight Training',
            duration: 45,
            time: '08:15'
        },
        {
            type: 'snack',
            name: 'Popcorn',
            duration: 20,
            time: '12:45'
        },
        {
            type: 'drink',
            name: 'Chamomile Tea',
            duration: 25,
            time: '19:40'
        }
    ],
    '2023-10-29': [
        {
            type: 'snack',
            name: 'Granola Bar',
            duration: 20,
            time: '07:50'
        },
        {
            type: 'lunch',
            name: 'Tuna Salad Wrap',
            duration: 45,
            time: '14:45'
        },
        {
            type: 'dinner',
            name: 'Chicken Parmesan',
            duration: 60,
            time: '19:40'
        }
    ],
    '2023-10-30': [
        {
            type: 'breakfast',
            name: 'Eggs Benedict',
            duration: 15,
            time: '09:15'
        },
        {
            type: 'snack',
            name: 'Cheese and Crackers',
            duration: 15,
            time: '14:10'
        },
        {
            type: 'dinner',
            name: 'Lasagna',
            duration: 30,
            time: '18:00'
        },
        {
            type: 'activity',
            name: 'Basketball',
            duration: 45,
            time: '20:30'
        }
    ],
    '2023-10-31': [
        {
            type: 'breakfast',
            name: 'Quiche',
            duration: 30,
            time: '08:10'
        },
        {
            type: 'lunch',
            name: 'BLT Sandwich',
            duration: 15,
            time: '12:45'
        },
        {
            type: 'activity',
            name: 'Pilates',
            duration: 45,
            time: '14:45'
        },
        {
            type: 'dinner',
            name: 'Vegetarian Pizza',
            duration: 30,
            time: '19:40'
        }
    ],
    '2023-11-01': [
        {
            type: 'breakfast',
            name: 'Cereal with Milk',
            duration: 30,
            time: '09:10'
        },
        {
            type: 'dessert',
            name: 'Creme Brulee',
            duration: 20,
            time: '18:20'
        },
        {
            type: 'drink',
            name: 'Espresso',
            duration: 20,
            time: '19:10'
        },
        {
            type: 'activity',
            name: 'Yoga',
            duration: 90,
            time: '20:50'
        }
    ],
    '2023-11-02': [
        {
            type: 'lunch',
            name: 'Tuna Salad Wrap',
            duration: 15,
            time: '13:30'
        },
        {
            type: 'dessert',
            name: 'Fruit Salad',
            duration: 30,
            time: '19:45'
        }
    ],
    '2023-11-03': [
        {
            type: 'snack',
            name: 'Apple Slices with Peanut Butter',
            duration: 20,
            time: '09:00'
        },
        {
            type: 'lunch',
            name: 'Stir Fry',
            duration: 15,
            time: '13:50'
        },
        {
            type: 'drink',
            name: 'Chamomile Tea',
            duration: 15,
            time: '20:45'
        }
    ],
    '2023-11-04': [
        {
            type: 'dessert',
            name: 'Brownie',
            duration: 15,
            time: '18:00'
        },
        {
            type: 'drink',
            name: 'Water',
            duration: 20,
            time: '20:00'
        }
    ],
    '2023-11-05': [
        {
            type: 'lunch',
            name: 'Burrito',
            duration: 15,
            time: '12:10'
        },
        {
            type: 'dessert',
            name: 'Ice Cream Sundae',
            duration: 30,
            time: '19:15'
        }
    ],
    '2023-11-06': [
        {
            type: 'breakfast',
            name: 'Smoothie',
            duration: 30,
            time: '09:20'
        },
        {
            type: 'snack',
            name: 'Popcorn',
            duration: 20,
            time: '13:30'
        },
        {
            type: 'dessert',
            name: 'Creme Brulee',
            duration: 15,
            time: '18:00'
        }
    ],
    '2023-11-07': [
        {
            type: 'activity',
            name: 'Zumba',
            duration: 90,
            time: '07:40'
        },
        {
            type: 'lunch',
            name: 'Grilled Chicken with Vegetables',
            duration: 15,
            time: '12:45'
        },
        {
            type: 'snack',
            name: 'Trail Mix',
            duration: 15,
            time: '13:20'
        },
        {
            type: 'dinner',
            name: 'Lasagna',
            duration: 30,
            time: '18:40'
        }
    ],
    '2023-11-08': [
        {
            type: 'snack',
            name: 'Boiled Egg',
            duration: 15,
            time: '07:40'
        },
        {
            type: 'lunch',
            name: 'Prawn Salad',
            duration: 15,
            time: '13:00'
        },
        {
            type: 'dessert',
            name: 'Fruit Salad',
            duration: 15,
            time: '19:10'
        },
        {
            type: 'drink',
            name: 'Coconut Water',
            duration: 20,
            time: '20:30'
        }
    ],
    '2023-11-09': [
        {
            type: 'activity',
            name: 'Gym Workout',
            duration: 30,
            time: '08:50'
        },
        {
            type: 'drink',
            name: 'Iced Coffee',
            duration: 25,
            time: '19:10'
        }
    ],
    '2023-11-10': [
        {
            type: 'breakfast',
            name: 'Avocado Toast',
            duration: 15,
            time: '07:10'
        },
        {
            type: 'activity',
            name: 'Zumba',
            duration: 90,
            time: '08:45'
        },
        {
            type: 'drink',
            name: 'Hot Chocolate',
            duration: 20,
            time: '20:10'
        }
    ],
    '2023-11-11': [
        {
            type: 'dinner',
            name: 'Grilled Salmon and Quinoa',
            duration: 60,
            time: '19:50'
        }
    ],
    '2023-11-12': [
        {
            type: 'snack',
            name: 'Mixed Nuts',
            duration: 20,
            time: '13:00'
        },
        {
            type: 'dessert',
            name: 'Raspberry Tart',
            duration: 15,
            time: '18:00'
        },
        {
            type: 'activity',
            name: 'Meditation',
            duration: 60,
            time: '18:15'
        }
    ],
    '2023-11-13': [
        {
            type: 'activity',
            name: 'Hiking',
            duration: 60,
            time: '08:30'
        },
        {
            type: 'activity',
            name: 'Swimming',
            duration: 45,
            time: '14:10'
        },
        {
            type: 'dinner',
            name: 'Vegetable Curry',
            duration: 60,
            time: '20:45'
        }
    ],
    '2023-11-14': [
        {
            type: 'activity',
            name: 'Hiking',
            duration: 45,
            time: '09:00'
        },
        {
            type: 'dinner',
            name: 'Pork Chops',
            duration: 60,
            time: '20:10'
        }
    ],
    '2023-11-15': [
        {
            type: 'snack',
            name: 'Fresh Fruit',
            duration: 15,
            time: '08:50'
        },
        {
            type: 'snack',
            name: 'Vegetable Sticks with Hummus',
            duration: 15,
            time: '13:45'
        },
        {
            type: 'activity',
            name: 'Kickboxing',
            duration: 60,
            time: '14:45'
        },
        {
            type: 'dessert',
            name: 'Brownie',
            duration: 15,
            time: '20:50'
        }
    ],
    '2023-11-16': [
        {
            type: 'snack',
            name: 'Protein Bar',
            duration: 20,
            time: '09:45'
        },
        {
            type: 'lunch',
            name: 'Quinoa Salad',
            duration: 45,
            time: '12:45'
        },
        {
            type: 'dinner',
            name: 'Pork Chops',
            duration: 45,
            time: '20:10'
        }
    ],
    '2023-11-17': [
        {
            type: 'snack',
            name: 'Dried Fruit',
            duration: 20,
            time: '08:40'
        },
        {
            type: 'dinner',
            name: 'Grilled Salmon and Quinoa',
            duration: 60,
            time: '19:50'
        }
    ],
    '2023-11-18': [
        {
            type: 'activity',
            name: 'Cycling',
            duration: 75,
            time: '13:00'
        },
        {
            type: 'dinner',
            name: 'Lasagna',
            duration: 45,
            time: '20:10'
        }
    ],
    '2023-11-19': [
        {
            type: 'snack',
            name: 'Boiled Egg',
            duration: 20,
            time: '14:10'
        },
        {
            type: 'dinner',
            name: 'Roast Dinner',
            duration: 30,
            time: '18:30'
        }
    ],
    '2023-11-20': [
        {
            type: 'snack',
            name: 'Protein Bar',
            duration: 20,
            time: '09:50'
        },
        {
            type: 'lunch',
            name: 'Chicken Soup',
            duration: 30,
            time: '13:50'
        },
        {
            type: 'dinner',
            name: 'Spaghetti Bolognese',
            duration: 30,
            time: '19:10'
        }
    ],
    '2023-11-21': [
        {
            type: 'snack',
            name: 'Dark Chocolate',
            duration: 20,
            time: '07:20'
        },
        {
            type: 'lunch',
            name: 'Falafel Pita',
            duration: 45,
            time: '13:40'
        },
        {
            type: 'snack',
            name: 'Granola Bar',
            duration: 20,
            time: '14:50'
        }
    ],
    '2023-11-22': [
        {
            type: 'activity',
            name: 'Jogging',
            duration: 75,
            time: '07:15'
        },
        {
            type: 'lunch',
            name: 'Burrito',
            duration: 15,
            time: '14:50'
        },
        {
            type: 'dinner',
            name: 'BBQ Ribs',
            duration: 45,
            time: '18:10'
        }
    ],
    '2023-11-23': [
        {
            type: 'snack',
            name: 'Dried Fruit',
            duration: 20,
            time: '08:50'
        },
        {
            type: 'activity',
            name: 'Cycling',
            duration: 75,
            time: '09:20'
        },
        {
            type: 'dessert',
            name: 'Raspberry Tart',
            duration: 30,
            time: '19:30'
        }
    ],
    '2023-11-24': [
        {
            type: 'activity',
            name: 'Gym Workout',
            duration: 75,
            time: '14:40'
        },
        {
            type: 'dinner',
            name: 'Lasagna',
            duration: 45,
            time: '18:50'
        },
        {
            type: 'drink',
            name: 'Green Smoothie',
            duration: 25,
            time: '20:10'
        }
    ],
    '2023-11-25': [
        {
            type: 'snack',
            name: 'Vegetable Sticks with Hummus',
            duration: 20,
            time: '09:10'
        },
        {
            type: 'dinner',
            name: 'Spaghetti Bolognese',
            duration: 45,
            time: '18:15'
        },
        {
            type: 'activity',
            name: 'Meditation',
            duration: 90,
            time: '20:30'
        }
    ],
    '2023-11-26': [
        {
            type: 'breakfast',
            name: 'Omelette',
            duration: 15,
            time: '07:20'
        },
        {
            type: 'lunch',
            name: 'Grilled Chicken with Vegetables',
            duration: 45,
            time: '12:20'
        },
        {
            type: 'activity',
            name: 'Rowing',
            duration: 75,
            time: '13:50'
        },
        {
            type: 'dinner',
            name: 'Vegetable Curry',
            duration: 60,
            time: '20:20'
        }
    ],
    '2023-11-27': [
        {
            type: 'breakfast',
            name: 'Quiche',
            duration: 15,
            time: '09:40'
        },
        {
            type: 'snack',
            name: 'Granola Bar',
            duration: 15,
            time: '12:45'
        },
        {
            type: 'activity',
            name: 'Meditation',
            duration: 30,
            time: '14:10'
        },
        {
            type: 'dinner',
            name: 'Chicken Parmesan',
            duration: 60,
            time: '18:15'
        },
        {
            type: 'dessert',
            name: 'Strawberry Shortcake',
            duration: 15,
            time: '19:50'
        },
        {
            type: 'drink',
            name: 'Chamomile Tea',
            duration: 15,
            time: '20:15'
        }
    ],
    '2023-11-28': [
        {
            type: 'snack',
            name: 'Vegetable Sticks with Hummus',
            duration: 15,
            time: '08:50'
        },
        {
            type: 'activity',
            name: 'Bike Ride',
            duration: 90,
            time: '09:40'
        },
        {
            type: 'lunch',
            name: 'Chicken Soup',
            duration: 45,
            time: '12:30'
        },
        {
            type: 'snack',
            name: 'Yogurt',
            duration: 20,
            time: '14:45'
        },
        {
            type: 'dessert',
            name: 'Apple Pie',
            duration: 15,
            time: '18:40'
        }
    ],
    '2023-11-29': [
        {
            type: 'breakfast',
            name: 'Eggs Benedict',
            duration: 30,
            time: '07:30'
        },
        {
            type: 'lunch',
            name: 'Stir Fry',
            duration: 45,
            time: '14:10'
        }
    ],
    '2023-11-30': [
        {
            type: 'breakfast',
            name: 'Bagel with Cream Cheese',
            duration: 30,
            time: '07:10'
        },
        {
            type: 'activity',
            name: 'Hiking',
            duration: 45,
            time: '08:20'
        },
        {
            type: 'lunch',
            name: 'Veggie Wrap',
            duration: 30,
            time: '13:45'
        }
    ],
    '2023-12-01': [
        {
            type: 'breakfast',
            name: 'Porridge with Berries',
            duration: 15,
            time: '07:45'
        },
        {
            type: 'snack',
            name: 'Smoothie',
            duration: 15,
            time: '08:30'
        },
        {
            type: 'lunch',
            name: 'Quinoa Salad',
            duration: 15,
            time: '13:45'
        },
        {
            type: 'dessert',
            name: 'Creme Brulee',
            duration: 20,
            time: '19:10'
        }
    ],
    '2023-12-02': [
        {
            type: 'breakfast',
            name: 'Granola with Yogurt',
            duration: 15,
            time: '08:30'
        },
        {
            type: 'activity',
            name: 'Rowing',
            duration: 60,
            time: '12:50'
        },
        {
            type: 'dinner',
            name: 'Shrimp Paella',
            duration: 45,
            time: '18:30'
        },
        {
            type: 'activity',
            name: 'Weight Training',
            duration: 75,
            time: '19:50'
        }
    ],
    '2023-12-03': [
        {
            type: 'lunch',
            name: 'Quinoa Salad',
            duration: 30,
            time: '13:20'
        },
        {
            type: 'dinner',
            name: 'Shrimp Paella',
            duration: 60,
            time: '20:45'
        }
    ],
    '2023-12-04': [
        {
            type: 'activity',
            name: 'Kickboxing',
            duration: 45,
            time: '08:30'
        },
        {
            type: 'dessert',
            name: 'Carrot Cake',
            duration: 15,
            time: '19:40'
        }
    ],
    '2023-12-05': [
        {
            type: 'breakfast',
            name: 'Blueberry Pancakes',
            duration: 15,
            time: '07:30'
        },
        {
            type: 'snack',
            name: 'Vegetable Sticks with Hummus',
            duration: 15,
            time: '14:45'
        },
        {
            type: 'dessert',
            name: 'Brownie',
            duration: 20,
            time: '19:30'
        }
    ],
    '2023-12-06': [
        {
            type: 'breakfast',
            name: 'Bagel with Cream Cheese',
            duration: 15,
            time: '09:30'
        },
        {
            type: 'lunch',
            name: 'Tuna Salad Wrap',
            duration: 30,
            time: '12:15'
        },
        {
            type: 'dessert',
            name: 'Chocolate Mousse',
            duration: 15,
            time: '18:20'
        },
        {
            type: 'drink',
            name: 'Water',
            duration: 20,
            time: '19:45'
        }
    ],
    '2023-12-07': [
        {
            type: 'breakfast',
            name: 'Croissant',
            duration: 30,
            time: '09:10'
        },
        {
            type: 'activity',
            name: 'Bike Ride',
            duration: 75,
            time: '13:00'
        },
        {
            type: 'drink',
            name: 'Espresso',
            duration: 20,
            time: '18:00'
        },
        {
            type: 'activity',
            name: 'Gym Workout',
            duration: 90,
            time: '19:15'
        }
    ],
    '2023-12-08': [
        {
            type: 'snack',
            name: 'Smoothie',
            duration: 20,
            time: '08:30'
        },
        {
            type: 'lunch',
            name: 'Grilled Chicken with Vegetables',
            duration: 30,
            time: '13:20'
        },
        {
            type: 'drink',
            name: 'Coconut Water',
            duration: 15,
            time: '18:40'
        }
    ],
    '2023-12-09': [
        {
            type: 'breakfast',
            name: 'Eggs Benedict',
            duration: 15,
            time: '07:15'
        },
        {
            type: 'snack',
            name: 'Rice Cakes',
            duration: 20,
            time: '14:40'
        },
        {
            type: 'drink',
            name: 'Espresso',
            duration: 25,
            time: '19:20'
        }
    ],
    '2023-12-10': [
        {
            type: 'breakfast',
            name: 'Quiche',
            duration: 15,
            time: '08:45'
        },
        {
            type: 'snack',
            name: 'Yogurt',
            duration: 15,
            time: '09:50'
        },
        {
            type: 'dessert',
            name: 'Tiramisu',
            duration: 15,
            time: '20:20'
        }
    ],
    '2023-12-11': [
        {
            type: 'activity',
            name: 'Jogging',
            duration: 60,
            time: '09:00'
        },
        {
            type: 'snack',
            name: 'Mixed Nuts',
            duration: 15,
            time: '14:00'
        },
        {
            type: 'dinner',
            name: 'BBQ Ribs',
            duration: 30,
            time: '18:10'
        }
    ],
    '2023-12-12': [
        {
            type: 'breakfast',
            name: 'Granola with Yogurt',
            duration: 30,
            time: '07:20'
        },
        {
            type: 'lunch',
            name: 'Tacos',
            duration: 45,
            time: '12:40'
        },
        {
            type: 'dinner',
            name: 'Pork Chops',
            duration: 60,
            time: '18:40'
        }
    ],
    '2023-12-13': [
        {
            type: 'snack',
            name: 'Cheese and Crackers',
            duration: 15,
            time: '07:00'
        },
        {
            type: 'snack',
            name: 'Popcorn',
            duration: 15,
            time: '12:40'
        },
        {
            type: 'dinner',
            name: 'Chicken Stir-Fry',
            duration: 30,
            time: '19:30'
        }
    ],
    '2023-12-14': [
        {
            type: 'snack',
            name: 'Boiled Egg',
            duration: 15,
            time: '14:40'
        },
        {
            type: 'drink',
            name: 'Matcha Latte',
            duration: 15,
            time: '19:20'
        }
    ],
    '2023-12-15': [
        {
            type: 'lunch',
            name: 'Chicken Caesar Salad',
            duration: 30,
            time: '14:00'
        },
        {
            type: 'dinner',
            name: 'Fish and Chips',
            duration: 45,
            time: '18:40'
        }
    ],
    '2023-12-16': [
        {
            type: 'breakfast',
            name: 'French Toast',
            duration: 30,
            time: '09:30'
        },
        {
            type: 'snack',
            name: 'Dark Chocolate',
            duration: 15,
            time: '14:10'
        },
        {
            type: 'dessert',
            name: 'Cheesecake',
            duration: 15,
            time: '20:30'
        }
    ],
    '2023-12-17': [
        {
            type: 'activity',
            name: 'Boxing',
            duration: 75,
            time: '14:50'
        },
        {
            type: 'dinner',
            name: 'Lamb Stew',
            duration: 60,
            time: '20:40'
        }
    ],
    '2023-12-18': [
        {
            type: 'drink',
            name: 'Ginger Tea',
            duration: 20,
            time: '19:15'
        }
    ],
    '2023-12-19': [
        {
            type: 'breakfast',
            name: 'Fruit Salad',
            duration: 15,
            time: '08:00'
        },
        {
            type: 'snack',
            name: 'Smoothie',
            duration: 20,
            time: '09:20'
        },
        {
            type: 'snack',
            name: 'Dried Fruit',
            duration: 20,
            time: '14:30'
        },
        {
            type: 'dinner',
            name: 'Chicken Parmesan',
            duration: 60,
            time: '20:20'
        }
    ],
    '2023-12-20': [
        {
            type: 'snack',
            name: 'Rice Cakes',
            duration: 20,
            time: '08:15'
        },
        {
            type: 'activity',
            name: 'Yoga',
            duration: 75,
            time: '09:30'
        },
        {
            type: 'snack',
            name: 'Vegetable Sticks with Hummus',
            duration: 15,
            time: '13:50'
        },
        {
            type: 'drink',
            name: 'Iced Tea',
            duration: 15,
            time: '20:20'
        },
        {
            type: 'activity',
            name: 'Hiking',
            duration: 75,
            time: '20:50'
        }
    ],
    '2023-12-21': [
        {
            type: 'snack',
            name: 'Rice Cakes',
            duration: 15,
            time: '14:00'
        },
        {
            type: 'dessert',
            name: 'Creme Brulee',
            duration: 30,
            time: '20:50'
        }
    ],
    '2023-12-22': [
        {
            type: 'snack',
            name: 'Dried Fruit',
            duration: 20,
            time: '07:50'
        },
        {
            type: 'activity',
            name: 'Tennis',
            duration: 75,
            time: '08:40'
        },
        {
            type: 'lunch',
            name: 'Tuna Salad Wrap',
            duration: 45,
            time: '12:10'
        },
        {
            type: 'drink',
            name: 'Ginger Tea',
            duration: 25,
            time: '18:45'
        }
    ],
    '2023-12-23': [
        {
            type: 'breakfast',
            name: 'Omelette',
            duration: 15,
            time: '08:50'
        },
        {
            type: 'snack',
            name: 'Rice Cakes',
            duration: 15,
            time: '09:15'
        },
        {
            type: 'lunch',
            name: 'Burger and Fries',
            duration: 15,
            time: '12:15'
        },
        {
            type: 'activity',
            name: 'Tai Chi',
            duration: 75,
            time: '14:45'
        },
        {
            type: 'dessert',
            name: 'Chocolate Mousse',
            duration: 15,
            time: '20:10'
        }
    ],
    '2023-12-24': [
        {
            type: 'snack',
            name: 'Rice Cakes',
            duration: 20,
            time: '07:45'
        },
        {
            type: 'activity',
            name: 'Dance Class',
            duration: 75,
            time: '14:50'
        },
        {
            type: 'dinner',
            name: 'Fish and Chips',
            duration: 30,
            time: '19:50'
        }
    ],
    '2023-12-25': [
        {
            type: 'breakfast',
            name: 'French Toast',
            duration: 30,
            time: '07:00'
        },
        {
            type: 'snack',
            name: 'Popcorn',
            duration: 20,
            time: '08:00'
        },
        {
            type: 'activity',
            name: 'Bike Ride',
            duration: 60,
            time: '09:50'
        },
        {
            type: 'lunch',
            name: 'Burrito',
            duration: 30,
            time: '12:40'
        },
        {
            type: 'activity',
            name: 'Bike Ride',
            duration: 45,
            time: '13:20'
        }
    ],
    '2023-12-26': [
        {
            type: 'activity',
            name: 'Zumba',
            duration: 90,
            time: '09:00'
        },
        {
            type: 'lunch',
            name: 'Sushi',
            duration: 15,
            time: '12:00'
        },
        {
            type: 'activity',
            name: 'Hiking',
            duration: 45,
            time: '19:15'
        }
    ],
    '2023-12-27': [
        {
            type: 'activity',
            name: 'Zumba',
            duration: 75,
            time: '07:30'
        },
        {
            type: 'activity',
            name: 'Basketball',
            duration: 60,
            time: '14:50'
        },
        {
            type: 'dinner',
            name: 'Steak and Potatoes',
            duration: 45,
            time: '18:45'
        },
        {
            type: 'activity',
            name: 'Yoga',
            duration: 45,
            time: '20:10'
        }
    ],
    '2023-12-28': [
        {
            type: 'breakfast',
            name: 'Quiche',
            duration: 30,
            time: '09:15'
        },
        {
            type: 'dessert',
            name: 'Strawberry Shortcake',
            duration: 20,
            time: '18:30'
        }
    ],
    '2023-12-29': [
        {
            type: 'snack',
            name: 'Fresh Fruit',
            duration: 20,
            time: '08:20'
        },
        {
            type: 'lunch',
            name: 'Chicken Soup',
            duration: 15,
            time: '14:45'
        },
        {
            type: 'drink',
            name: 'Chamomile Tea',
            duration: 25,
            time: '20:20'
        }
    ],
    '2023-12-30': [
        {
            type: 'breakfast',
            name: 'Toast with Jam',
            duration: 15,
            time: '07:40'
        },
        {
            type: 'snack',
            name: 'Granola Bar',
            duration: 20,
            time: '08:00'
        },
        {
            type: 'lunch',
            name: 'Quinoa Salad',
            duration: 30,
            time: '13:15'
        },
        {
            type: 'drink',
            name: 'Latte',
            duration: 25,
            time: '19:20'
        }
    ],
    '2023-12-31': [
        {
            type: 'breakfast',
            name: 'Fruit Salad',
            duration: 30,
            time: '09:00'
        },
        {
            type: 'lunch',
            name: 'Tuna Salad Wrap',
            duration: 15,
            time: '14:10'
        },
        {
            type: 'dinner',
            name: 'Spaghetti Bolognese',
            duration: 45,
            time: '19:10'
        }
    ]
};
