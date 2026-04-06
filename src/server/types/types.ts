import { RowDataPacket, QueryResult } from "mysql2";

import { User } from "./user";
import { Project } from "./project";

export type userRow = RowDataPacket & User; 
export type projectRow = RowDataPacket & Project;

export type projectRole = "admin" | "user";

export interface insertRowExtension {
    insertId: number;
}