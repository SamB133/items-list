import type { NextApiRequest, NextApiResponse } from 'next';
import Database from 'better-sqlite3';
import { fromRow } from '../../../src/item';
import Cors from 'cors';
const db = new Database('items-list.db', {});

const cors = Cors({
    methods: ['POST', 'GET', 'HEAD', 'DELETE', 'PUT'],
});

function runMiddleware(
    req: NextApiRequest,
    res: NextApiResponse,
    fn: Function,
) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result: any) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>,
) {
    await runMiddleware(req, res, cors);
    if (req.method === 'GET') {
        const stmt = db.prepare('SELECT * FROM items');
        res.status(200).json(stmt.all().map(fromRow));
    } else if (req.method === 'POST') {
        const stmt = db.prepare(`INSERT INTO items ("description", "complete")
        VALUES (@description, 0);`);
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
