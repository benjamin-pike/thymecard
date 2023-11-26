import { Request, Response, NextFunction } from 'express';
import { filterObjectKeys } from '../lib/types/object.utils';
import { UnprocessableError } from '../lib/error/thymecardError';
import { isDefined, isString } from '../lib/types/typeguards.utils';
import { ErrorCode } from '../lib/error/errorCode';

export const excludeResFields = (rootKey: string | undefined, excludeFields: string[]) => {
    return (_req: Request, res: Response, next: NextFunction) => {
        const originalJsonFn = res.json;

        res.json = (body: Record<string, any>) => {
            const rootedExcludeFields = rootKey ? excludeFields.map((field) => `${rootKey}.${field}`) : null;
            const filteredBody = filterObjectKeys(body, rootedExcludeFields ?? excludeFields);
            return originalJsonFn.call(res, filteredBody);
        };

        next();
    };
};

export const includeResFields = (rootKey: string | undefined, excludeFieldsByDefault: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const originalJsonFn = res.json;

        res.json = (body: Record<string, any>) => {
            const includeValue = req.query.include;

            if (isDefined(includeValue) && !isString(includeValue)) {
                throw new UnprocessableError(ErrorCode.InvalidQueryParameter, "Query parameter 'include' must be a string", {
                    origin: 'filterMiddleware.includeResFields',
                    data: {
                        parameterName: 'include',
                        parameterValue: req.query.include
                    }
                });
            }

            const includeFields = includeValue ? includeValue.split(',') : [];
            const excludeFields = excludeFieldsByDefault.filter((field) => !includeFields.includes(field));
            const rootedExcludeFields = rootKey ? excludeFields.map((field) => `${rootKey}.${field}`) : null;
            const filteredBody = filterObjectKeys(body, rootedExcludeFields ?? excludeFields);

            return originalJsonFn.call(res, filteredBody);
        };

        next();
    };
};
