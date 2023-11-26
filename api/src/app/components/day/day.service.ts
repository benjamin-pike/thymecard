import { buildSetQueryFromUpdate } from '../../lib/data/mongo.utils';
import { ErrorCode } from '../../lib/error/errorCode';
import { NotFoundError } from '../../lib/error/thymecardError';
import { DayCache } from '../../lib/types/cache.types';
import { dayRepository } from './day.model';
import { IDay, IDayCreate, IDayEnriched, IDayUpdate, IMealCreate, IMealUpdate } from './day.types';
import { IPagedResult } from '../../lib/types/common.types';
import { SortQuery } from '../../lib/data/mongo.repository';
import mongoose, { PipelineStage } from 'mongoose';

interface IDayServiceDependencies {
    dayCache: DayCache;
}

export interface IDayService {
    createDay(day: IDayCreate): Promise<IDay>;
    updateDay(dayId: string, userId: string, update: IDayUpdate): Promise<IDay>;
    getDays(userId: string, startKey?: string, limit?: number): Promise<IPagedResult<IDay>>;
    getDay(dayId: string, userId: string): Promise<IDay>;
    getEnrichedDays(userId: string, startKey?: string, limit?: number): Promise<IPagedResult<IDayEnriched>>
    getEnrichedDay(dayId: string, userId: string): Promise<IDayEnriched>;
    deleteDay(dayId: string, userId: string): Promise<void>;
    createMeal(dayId: string, userId: string, meal: IMealCreate): Promise<IDay>;
    updateMeal(dayId: string, userId: string, mealId: string, update: IMealUpdate): Promise<IDay>;
    deleteMeal(dayId: string, userId: string, mealId: string): Promise<void>;
}

export class DayService implements IDayService {
    private readonly cache: DayCache;

    constructor(deps: IDayServiceDependencies) {
        this.cache = deps.dayCache;
    }

    public async createDay(day: IDayCreate): Promise<IDay> {
        return dayRepository.create(day);
    }

    public async updateDay(dayId: string, userId: string, update: IDayUpdate): Promise<IDay> {
        const query = { _id: dayId, userId };
        const updatedDay = await dayRepository.findOneAndUpdate(query, update);

        if (!updatedDay) {
            throw new NotFoundError(ErrorCode.DayNotFound, 'Day not found', {
                origin: 'DayService.updateDay',
                data: { dayId, userId, update }
            });
        }

        return updatedDay;
    }

    public async getDays(userId: string, startKey?: string, limit?: number): Promise<IPagedResult<IDay>> {
        const query = { userId };
        const sortQuery: SortQuery = { date: 1 };

        return await dayRepository.getPaged(query, startKey, limit, sortQuery);
    }

    public async getDay(dayId: string, userId: string): Promise<IDay> {
        const query = { _id: dayId, userId };
        const day = await dayRepository.getOne(query);

        if (!day) {
            throw new NotFoundError(ErrorCode.DayNotFound, 'Day not found', {
                origin: 'DayService.getDay',
                data: { dayId, userId }
            });
        }

        return day;
    }

    public async getEnrichedDays(userId: string, startKey?: string, limit?: number): Promise<IPagedResult<IDayEnriched>> {
        const matchQuery = { userId: new mongoose.Types.ObjectId(userId) };
        const sortQuery: SortQuery = { date: 1 };

        const enrichedDays = await dayRepository.aggregatePaged<IDayEnriched>(matchQuery, enrichmentPipeline, startKey, limit, sortQuery);

        return enrichedDays;
    }

    public async getEnrichedDay(dayId: string, userId: string): Promise<IDayEnriched> {
        const pipeline: PipelineStage[] = [
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(dayId),
                    userId: new mongoose.Types.ObjectId(userId)
                }
            },
            ...enrichmentPipeline
        ];

        const enrichedDay = await dayRepository.aggregateOne<IDayEnriched>(pipeline);

        if (!enrichedDay) {
            throw new NotFoundError(ErrorCode.DayNotFound, 'Day not found', {
                origin: 'DayService.getEnrichedDay',
                data: { dayId, userId }
            });
        }

        return enrichedDay;
    }

    public async deleteDay(dayId: string, userId: string): Promise<void> {
        const query = { _id: dayId, userId };
        const deletedDay = await dayRepository.delete(query);

        if (!deletedDay) {
            throw new NotFoundError(ErrorCode.DayNotFound, 'Day not found', {
                origin: 'DayService.deleteDay',
                data: { dayId, userId }
            });
        }

        return;
    }

    public async createMeal(dayId: string, userId: string, meal: IMealCreate): Promise<IDay> {
        const query = { _id: dayId, userId };
        const update = {
            $push: {
                meals: {
                    $each: [meal],
                    $sort: { time: 1 } // Sort in ascending order based on meal time
                }
            }
        };

        const updatedDay = await dayRepository.findOneAndUpdate(query, update);

        if (!updatedDay) {
            throw new NotFoundError(ErrorCode.DayNotFound, 'Day not found', {
                origin: 'DayService.createMeal',
                data: { dayId, userId, meal }
            });
        }

        return updatedDay;
    }

    public async updateMeal(dayId: string, userId: string, mealId: string, update: IMealUpdate): Promise<IDay> {
        const findQuery = { _id: dayId, userId, 'meals._id': mealId };
        const updateQuery = { $set: buildSetQueryFromUpdate(update, 'meals.$') };

        let updatedDay = await dayRepository.findOneAndUpdate(findQuery, updateQuery);

        if (updatedDay) {
            const mealsAreSorted = updatedDay.meals.every(
                (meal, index, mealsArray) => index === 0 || meal.time > mealsArray[index - 1].time
            );
            if (!mealsAreSorted) {
                const sortedMeals = updatedDay.meals.sort((a, b) => a.time - b.time);
                const sortUpdateQuery = { $set: { meals: sortedMeals } };

                updatedDay = await dayRepository.findOneAndUpdate(findQuery, sortUpdateQuery);
            }
        }

        if (!updatedDay) {
            throw new NotFoundError(ErrorCode.DayNotFound, 'Meal not found', {
                origin: 'DayService.updateMeal',
                data: { dayId, userId, mealId, update }
            });
        }

        return updatedDay;
    }

    public async deleteMeal(dayId: string, userId: string, mealId: string): Promise<void> {
        const query = { _id: dayId, userId };
        const update = {
            $pull: { meals: { _id: mealId } }
        };

        const updatedDay = await dayRepository.findOneAndUpdate(query, update);

        if (!updatedDay) {
            throw new NotFoundError(ErrorCode.DayNotFound, 'Day not found', {
                origin: 'DayService.deleteMeal',
                data: { dayId, userId, mealId }
            });
        }

        if (updatedDay.meals.length === 0) {
            await dayRepository.delete(query);
        }

        return;
    }
}

const enrichmentPipeline = [
    {
        // Deconstruct meals array, creating a duplicate documents for each meal
        $unwind: '$meals'
    },
    {
        // Join with the recipes collection, appending a recipe array to each created meal document
        $lookup: {
            from: 'recipes',
            localField: 'meals.recipeId',
            foreignField: '_id',
            as: 'recipe'
        }
    },
    {
        // Flatten the recipe array into an object
        $unwind: {
            path: '$recipe',
            preserveNullAndEmptyArrays: true
        }
    },
    {
        // Add the enriched fields to each meal document (null if not found)
        $addFields: {
            'meals.name': { $ifNull: ['$recipe.name', null] },
            'meals.duration': { $ifNull: ['$recipe.totalTime', null] },
            'meals.calories': { $ifNull: ['$recipe.nutrition.calories', null] },
            'meals.ingredientsCount': {
                $cond: {
                    if: { $ifNull: ['$recipe.ingredients', false] },
                    then: { $size: '$recipe.ingredients' },
                    else: null
                }
            }
        }
    },
    {
        // Regroup the meals back into an array according to the dayId
        $group: {
            _id: '$_id',
            root: { $first: '$$ROOT' },
            meals: { $push: '$meals' }
        }
    },
    {
        // Merge the grouped fields with the original doc, replacing the root
        $replaceRoot: {
            newRoot: {
                $mergeObjects: ['$root', { meals: '$meals' }]
            }
        }
    },
    {
        // Remove the recipe field and version field
        $project: { recipe: 0, __v: 0 }
    }
];
