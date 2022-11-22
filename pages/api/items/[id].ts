import type { NextApiRequest, NextApiResponse } from 'next';
import { fromRow } from '../../../src/item';
import { Client } from 'pg';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>,
) {
    const client = new Client();
    await client.connect();
    const { id } = req.query;
    if (req.method === 'GET') {
        const result = await client.query(
            'SELECT * FROM items WHERE "id" = $1;',
            [id],
        );
        if (result.rowCount < 1) {
            res.status(404).json({});
        } else {
            res.status(200).json(fromRow(result.rows[0]));
        }
    } else if (req.method === 'PUT') {
        let temp = { ...req.body, id, complete: req.body.complete ? 1 : 0 };
        let result = await client.query(
            `UPDATE items
        SET "description" = $1,
        "complete" = $2
        WHERE "id" = $3;`,
            [temp.description, temp.complete, temp.id],
        );
        if (result.rowCount === 0) {
            res.status(404).json({});
        } else {
            res.status(200).json({
                id,
                description: req.body.description,
                complete: req.body.complete,
            });
        }
    } else if (req.method === 'DELETE') {
        const result = await client.query(
            `DELETE FROM items WHERE "id" = $1;`,
            [id],
        );
        res.status(200).json({});
    } else {
        res.status(404).json({});
    }
    client.end();
}
