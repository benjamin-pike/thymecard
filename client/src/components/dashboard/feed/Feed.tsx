import FeedDay from './FeedDay';
import FeedEvent from './FeedEvent';
import { IFeedData } from './feed.types';

const data: IFeedData[] = [
    {
        date: new Date('2023-05-26'),
        events: [
            {
                type: 'Breakfast',
                time: new Date('2023-05-26T08:32'),
                location: 'Home (Oxford)',
                rating: 7,
                name: 'Blueberries and Banana on Toast',
                metrics: {
                    primary: {
                        measurement: 'calories',
                        value: 624
                    },
                    secondary: [
                        {
                            measurement: 'carbs',
                            value: 13
                        },
                        {
                            measurement: 'protein',
                            value: 8
                        },
                        {
                            measurement: 'fat',
                            value: 16
                        }
                    ]
                },
                journal:
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus.',
                visuals: [
                    'https://cdn2.egglandsbest.com/assets/images/recipes/_recipeImage/Egg-Dish-3-max-res.jpg',
                    'https://realfood.tesco.com/media/images/RFO-1400x919-Peanut-butter-and-banana-toast-topper-3e552b65-7136-468f-b385-bf3066540c6f-0-1400x919.jpg',
                    'https://blog.myfitnesspal.com/wp-content/uploads/2021/02/Banana-Blueberry-French-Toast.jpg',
                    'https://i.pinimg.com/564x/27/7e/9f/277e9fd4b31b1546f1f100d306dd3315.jpg',
                    'https://i.pinimg.com/564x/27/7e/9f/277e9fd4b31b1546f1f100d306dd3315.jpg'
                    // 'https://i.pinimg.com/564x/27/7e/9f/277e9fd4b31b1546f1f100d306dd3315.jpg'
                ]
            },
            {
                type: 'Lunch',
                time: new Date('2023-05-26T12:56'),
                location: 'Home (Oxford)',
                rating: 9,
                name: 'Smoked Salmon and Cream Cheese Bagel',
                metrics: {
                    primary: {
                        measurement: 'calories',
                        value: 768
                    },
                    secondary: [
                        {
                            measurement: 'carbs',
                            value: 11.2
                        },
                        {
                            measurement: 'protein',
                            value: 9.2
                        },
                        {
                            measurement: 'fat',
                            value: 23
                        }
                    ]
                },
                journal:
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.'
            }
        ]
    },
    {
        date: new Date('2023-05-25'),
        events: [
            {
                type: 'Breakfast',
                time: new Date('2023-05-26T08:32'),
                location: 'Home (Oxford)',
                rating: 7,
                name: 'Blueberries and Banana on Toast',
                metrics: {
                    primary: {
                        measurement: 'calories',
                        value: 624
                    },
                    secondary: [
                        {
                            measurement: 'carbs',
                            value: 13
                        },
                        {
                            measurement: 'protein',
                            value: 8
                        },
                        {
                            measurement: 'fat',
                            value: 16
                        }
                    ]
                },
                journal:
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus.',
                visuals: [
                    'https://cdn2.egglandsbest.com/assets/images/recipes/_recipeImage/Egg-Dish-3-max-res.jpg',
                    'https://realfood.tesco.com/media/images/RFO-1400x919-Peanut-butter-and-banana-toast-topper-3e552b65-7136-468f-b385-bf3066540c6f-0-1400x919.jpg',
                    'https://blog.myfitnesspal.com/wp-content/uploads/2021/02/Banana-Blueberry-French-Toast.jpg'
                    // 'https://i.pinimg.com/564x/27/7e/9f/277e9fd4b31b1546f1f100d306dd3315.jpg',
                    // 'https://i.pinimg.com/564x/27/7e/9f/277e9fd4b31b1546f1f100d306dd3315.jpg',
                    // 'https://i.pinimg.com/564x/27/7e/9f/277e9fd4b31b1546f1f100d306dd3315.jpg'
                ]
            },
            {
                type: 'Lunch',
                time: new Date('2023-05-26T12:56'),
                location: 'Home (Oxford)',
                rating: 9,
                name: 'Smoked Salmon and Cream Cheese Bagel',
                metrics: {
                    primary: {
                        measurement: 'calories',
                        value: 768
                    },
                    secondary: [
                        {
                            measurement: 'carbs',
                            value: 11.2
                        },
                        {
                            measurement: 'protein',
                            value: 9.2
                        },
                        {
                            measurement: 'fat',
                            value: 23
                        }
                    ]
                },
                journal:
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.'
            }
        ]
    }
];

export default () => {
    return (
        <>
            {data.map(({ date, events }, i) => (
                <FeedDay key={i} date={date}>
                    {events.map((event, j) => (
                        <FeedEvent key={j} {...event} />
                    ))}
                </FeedDay>
            ))}
        </>
    );
};
