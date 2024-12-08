import { IPir } from ".";
import { ID } from "./ID";


export interface IGroup {
    id: ID
    pirs: IPir[] | null;
    description: string;
}