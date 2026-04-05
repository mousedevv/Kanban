import { RowDataPacket } from "mysql2";
import { User } from "./user";

export type userRow = RowDataPacket & User; 