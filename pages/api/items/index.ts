import type { NextApiRequest, NextApiResponse } from 'next';
import Database from 'better-sqlite3';
import { fromRow } from '../../../src/item';
const db = new Database('items-list.db', {});

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>,
) {
    if (req.method === 'GET') {
        const stmt = db.prepare('SELECT * FROM items');
        res.status(200).json(stmt.all().map(fromRow));
    } else if (req.method === 'POST') {
        const stmt = db.prepare(`INSERT INTO items ("description", "complete")
        VALUES (@description, 0);`);
        console.log(req.body);
        const id = stmt.run(req.body).lastInsertRowid;
        res.status(200).json({
            id,
            description: req.body.description,
            complete: false,
        });
    } else {
        res.status(404).json({});
    }
}
