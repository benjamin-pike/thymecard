import { IPantryProduct, IPantryProductResource } from "./pantry.types";

export const parseJsonFields = (resource: IPantryProductResource): IPantryProduct => {
    return {
        ...resource,
        categories: resource.categories ? JSON.parse(resource.categories) : null,
        tags: resource.tags ? JSON.parse(resource.tags) : null,
        brands: resource.brands ? JSON.parse(resource.brands) : null,
    };
}