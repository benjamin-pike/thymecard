import express from 'express'
import { IDependencies } from '../../lib/types/server.types';
import { IRoutePermissions } from '../../lib/auth/permissions';

export const plannerRouter = (dependencies: IDependencies) => {
    const { plannerController } = dependencies;
    
    const router = express.Router();

    return router;
}

export const plannerPermissions: IRoutePermissions = {
    'POST /planner': [],
};
