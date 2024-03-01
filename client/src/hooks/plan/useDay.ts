import { useCallback, useState } from 'react';
import { DateTime } from 'luxon';
import { v4 as uuid } from 'uuid';
import { Client, EEventType, IMealEventItem, IRecipe, ITime } from '@thymecard/types';

interface IInitialState {
    type?: EEventType;
    date?: DateTime;
    time?: ITime;
    duration?: ITime;
    items?: IMealEventItem[];
}

export const useDay = (initial: IInitialState) => {
    const [selectedType, setSelectedType] = useState<EEventType | undefined>(initial.type);
    const [selectedDate, setSelectedDate] = useState<DateTime | undefined>(initial.date);
    const [selectedTime, setSelectedTime] = useState<ITime | undefined>(initial.time);
    const [selectedDuration, setSelectedDuration] = useState<ITime | undefined>(initial.duration);

    const [selectedItems, setSelectedItems] = useState<IMealEventItem[]>(initial.items || []);

    const handleSelectEventType = useCallback((type: EEventType) => {
        setSelectedType(type);
    }, []);

    const handleSelectEventDate = useCallback((date: DateTime) => {
        setSelectedDate(date);
    }, []);

    const handleUpdateEventTime = useCallback((time: ITime) => {
        setSelectedTime(time);
    }, []);

    const handleUpdateEventDuration = useCallback((duration: ITime) => {
        setSelectedDuration(duration);
    }, []);

    const handleAddItem = useCallback(() => {
        setSelectedItems((prevItems) => [
            ...prevItems,
            {
                id: uuid(),
                name: '',
                calories: 0,
                servings: 0
            }
        ]);
    }, []);

    const handleRemoveItem = useCallback(
        (id: string) => () => {
            setSelectedItems((prevItems) => prevItems.filter((item) => item.id !== id));
        },
        []
    );

    const handleNameChange = useCallback(
        (id: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
            setSelectedItems((prevItems) =>
                prevItems.map((item) => {
                    if (item.id === id) {
                        return { ...item, name: e.target.value };
                    }

                    return item;
                })
            );
        },
        []
    );

    const handleCaloriesChange = useCallback(
        (id: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
            setSelectedItems((prevItems) =>
                prevItems.map((item) => {
                    if (item.id === id) {
                        return { ...item, calories: parseInt(e.target.value) };
                    }

                    return item;
                })
            );
        },
        []
    );

    const handleServingsChange = useCallback(
        (id: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
            setSelectedItems((prevItems) =>
                prevItems.map((item) => {
                    if (item.id === id) {
                        return { ...item, servings: parseInt(e.target.value) };
                    }

                    return item;
                })
            );
        },
        []
    );

    const handleLinkRecipe = useCallback((id: string, recipe: Client<IRecipe>) => {
        setSelectedItems((prevItems) =>
            prevItems.map((item) => {
                if (item.id === id) {
                    return {
                        ...item,
                        name: recipe.title,
                        calories: recipe.nutrition?.calories || 0,
                        servings: 1,
                        recipeId: recipe._id
                    };
                }

                return item;
            })
        );
    }, []);

    return {
        selectedType,
        selectedDate,
        selectedTime,
        selectedDuration,
        selectedItems,
        handleSelectEventType,
        handleSelectEventDate,
        handleUpdateEventTime,
        handleUpdateEventDuration,
        handleAddItem,
        handleRemoveItem,
        handleNameChange,
        handleCaloriesChange,
        handleServingsChange,
        handleLinkRecipe
    };
};
