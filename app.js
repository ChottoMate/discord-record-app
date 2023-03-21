import 'dotenv/config';
import { InteractionResponseType, InteractionType } from 'discord-interactions';
import express from 'express';
import { HasGuildCommands, START_COMMAND, STOP_COMMAND, TEST_COMMAND } from './commands.js';
import { VerifyDiscordRequest, ZeroPadding } from './utils.js';

const app = express();
const PORT = process.env.PORT || 3000;
let start_time;
let stop_time;
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

app.post('/interactions', async function(req, res) {
    const { type, id, data } = req.body;

    if (type === InteractionType.PING) {
        return res.send({ type: InteractionResponseType.PONG });
    }

    if (type === InteractionType.APPLICATION_COMMAND) {
        const { name } = data;
        
        if (name === 'test') {
            return res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: 'hello world.'
                }
            });
        }
        if (name === 'start') {
            start_time = new Date();
            return res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: 'Task starts',
                }
            })
        }
        if (name === 'stop') {
            stop_time = new Date();
            let diff = stop_time.getTime() - start_time.getTime();
            let diff_hour = Math.floor(diff / (60 * 60 * 1000));
            let diff_minute = Math.floor(diff / (60 * 1000));
            let diff_second = Math.floor(diff / 1000);
            let recorded_time = `${ZeroPadding(diff_hour, 2)}:${ZeroPadding(diff_minute, 2)}:${ZeroPadding(diff_second, 2)}`;
            return res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: `Recorded time: ${recorded_time}`,
                }
            })
        }
    }
})

app.listen(PORT, () => {
    console.log('Listening on port', PORT);

    HasGuildCommands(process.env.APP_ID, process.env.GUILD_ID, [
        TEST_COMMAND, START_COMMAND, STOP_COMMAND
    ]);
});