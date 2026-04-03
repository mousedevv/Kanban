import { RowDataPacket } from "mysql2";
import { User } from "../src/user";

export type userRow = RowDataPacket & User; 