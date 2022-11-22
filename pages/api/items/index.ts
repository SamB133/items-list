import type { NextApiRequest, NextApiResponse } from 'next';
import { fromRow } from '../../../src/item';
import { Client } from 'pg';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>,
) {
    const client = new Client();
    await client.connect();
    if (req.method === 'GET') {
        const result = await client.query(
            'SELECT * FROM items ORDER BY "id" ASC',
        );
        res.status(200).json(result.rows.map(fromRow));
    } else if (req.method === 'POST') {
        const result = await client.query(
            `INSERT INTO items ("description", "complete")
        VALUES ($1, 0) RETURNING "id";`,
            [req.body.description],
        );
        const id = result.rows[0].id;
        res.status(200).json({
            id,
            description: req.body.description,
            complete: false,
        });
    } else {
        res.status(404).json({});
    }
    client.end();
}
