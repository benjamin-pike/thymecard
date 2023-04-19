import express from 'express';
import { IDependencies } from '../../../server';
import { validateContext } from '../../middleware/context.middleware';
import { enrichError } from '../../lib/error/error.utils';
import { excludeResFields, includeResFields } from '../../middleware/resFilter.middleware';

export const userRouter = (dependencies: IDependencies) => {
    const { userController } = dependencies;

    const router = express.Router();

    router.use(excludeResFields('user', ['password']));
    router.use(includeResFields('user', ['createdAt', 'updatedAt']));

    return router
        .get('/:userId', async (req, res, next) => {
            const context = validateContext(req.context, 'userRouter.get');
            try {
                const user = await userController.getUserById(context, req.params.userId);
                res.status(200).json({ user });
            } catch (err) {
                next(enrichError(err, context));
            }
        })
        .put('/:userId', async (req, res, next) => {
            const context = validateContext(req.context, 'userRouter.put');
            try {
                const user = await userController.updateUser(context, req.params.userId, req.body);
                res.status(200).json({ user });
            } catch (err) {
                next(enrichError(err, context));
            }
        })
        .delete('/:userId', async (req, res, next) => {
            const context = validateContext(req.context, 'userRouter.delete');
            try {
                await userController.deleteUser(context, req.params.userId);
                res.status(204).end();
            } catch (err) {
                next(enrichError(err, context));
            }
        });
};
