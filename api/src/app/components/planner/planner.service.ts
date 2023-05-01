import { PlannerCache } from "../../lib/types/cache.types";

interface IPlannerServiceDependencies {
    plannerCache: PlannerCache;
}

export interface IPlannerService {
}

export class PlannerService implements IPlannerService {
    private readonly cache: PlannerCache;

    constructor(deps: IPlannerServiceDependencies) {
        this.cache = deps.plannerCache;
    }
}
