import 'dotenv/config';
import { verifyKey } from "discord-interactions";
import fetch from 'node-fetch';


export function VerifyDiscordRequest(clientKey: any) {
    return function(req: any, res: any, buf: any, encoding: any) {
        const signature = req.get('X-Signature-Ed25519');
        const timestamp = req.get('X-Signature-Timestamp');

        const isValidRequest = verifyKey(buf, signature, timestamp, clientKey);
        if (!isValidRequest) {
            res.status(401).send('Bad request signature');
            throw new Error('Bad request signature');
        }
    }
}

export async function DiscordRequest(endpoint: string, options: any) {
    const url = 'https://discord.com/api/v10/' + endpoint;
    console.log(url);
    if (options.body) options.body = JSON.stringify(options.body);
    const res = await fetch(url, {
        headers: {
            Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
            'Content-Type': 'application/json; charset=UTF-8',
            'User-Agent': 'DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)',
        },
        ...options
    });
    if (!res.ok) {
        const data = await res.json();
        console.log(res.status);
        throw new Error(JSON.stringify(data));
    }
    return res;
}

export function ZeroPadding(num: number, digit: number) {
    const zero = '0'.repeat(digit - 1);
    const result = (zero + num).slice(-1 * digit);
    return result
}