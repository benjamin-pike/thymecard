import express from 'express';
import { IDependencies } from '../../../server';
import { validateContext } from '../../middleware/context.middleware';
import { enrichError } from '../../lib/error/error.utils';
import { excludeResFields, includeResFields } from '../../middleware/resFilter.middleware';

export const userRouter = (dependencies: IDependencies) => {
    const { userController } = dependencies;

    const router = express.Router();

    const resRootKey = 'user';
    router.use(excludeResFields(resRootKey, ['password']));
    router.use(includeResFields(resRootKey, ['createdAt', 'updatedAt']));

    return router
        .post('/', async (req, res, next) => {
            const context = validateContext(req.context, 'userRouter.post');
            try {
                const user = await userController.create(context, req.body);
                res.status(201).json({ [resRootKey]: user });
            } catch (err) {
                next(enrichError(err, context));
            }
        })
        .get('/:userId', async (req, res, next) => {
            const context = validateContext(req.context, 'userRouter.get');
            try {
                const user = await userController.getById(context, req.params.userId);
                res.status(200).json({ [resRootKey]: user });
            } catch (err) {
                next(enrichError(err, context));
            }
        })
        .put('/:userId', async (req, res, next) => {
            const context = validateContext(req.context, 'userRouter.put');
            try {
                const user = await userController.update(context, req.params.userId, req.body);
                res.status(200).json({ [resRootKey]: user });
            } catch (err) {
                next(enrichError(err, context));
            }
        })
        .delete('/:userId', async (req, res, next) => {
            const context = validateContext(req.context, 'userRouter.delete');
            try {
                await userController.delete(context, req.params.userId);
                res.status(204).end();
            } catch (err) {
                next(enrichError(err, context));
            }
        });
};
