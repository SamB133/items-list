import type { NextApiRequest, NextApiResponse } from 'next';
import Database from 'better-sqlite3';
import { fromRow, Item } from '../../../src/item';
const db = new Database('items-list.db', {});

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>,
) {
    const { id } = req.query;
    if (req.method === 'GET') {
        const stmt = db.prepare('SELECT * FROM items WHERE "id" = ?;');
        let row = stmt.get(id);
        if (!row) {
            res.status(404).json({});
        } else {
            res.status(200).json(fromRow(row));
        }
    } else if (req.method === 'PUT') {
        const stmt = db.prepare(`UPDATE items
        SET "description" = @description,
        "complete" = @complete
        WHERE "id" = @id;`);
        let temp = { ...req.body, id, complete: req.body.complete ? 1 : 0 };
        let changes = stmt.run(temp).changes;
        if (changes === 0) {
            res.status(404).json({});
        } else {
            res.status(200).json({
                id,
                description: req.body.description,
                complete: req.body.complete,
            });
        }
    } else if (req.method === 'DELETE') {
        const stmt = db.prepare(`DELETE FROM items WHERE "id" = ?;`);
        stmt.run(id);
        res.status(200).json({});
    } else {
        res.status(404).json({});
    }
}
