import { IPlannerService } from './planner.service';

interface IPlannerControllerDependencies {
    plannerService: IPlannerService;
}

export interface IPlannerController {}

export class PlannerController implements IPlannerController {
    private plannerService: IPlannerService;

    constructor(deps: IPlannerControllerDependencies) {
        this.plannerService = deps.plannerService;
    }
}
