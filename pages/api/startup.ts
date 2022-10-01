import type { NextApiRequest, NextApiResponse } from 'next';
import Database from 'better-sqlite3';
const db = new Database('items-list.db', {});
const stmt = db.prepare(`
CREATE TABLE IF NOT EXISTS items (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "description" TEXT,
    "complete" INTEGER
);`);

export default function handler(req: NextApiRequest, res: NextApiResponse<{}>) {
    stmt.run();
    res.status(200).json({});
}
