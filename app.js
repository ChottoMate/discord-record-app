import 'dotenv/config';
import { InteractionResponseType, InteractionType } from 'discord-interactions';
import express from 'express';
import { HasGuildCommands, START_COMMAND, STOP_COMMAND, TEST_COMMAND } from './commands.js';
import { VerifyDiscordRequest } from './utils.js';

const app = express();
const PORT = process.env.PORT || 3000;
let start_time;
let stop_time;
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

app.post('/interactions', async function(req, res) {
    const { type, id, data } = req.body;

    if (type === InteractionType.PING) {
        console.log("うんち");
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
            let start_time_format = `${start_time.getHours()}:${start_time.getMinutes()}:${start_time.getSeconds()}`;
            return res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: 'Task starts',
                }
            })
        }
        if (name === 'stop') {
            stop_time = new Date();
            console.log(start_time);
            let stop_time_format = `${stop_time.getHours()}:${stop_time.getMinutes()}:${stop_time.getSeconds()}`;
            let diff = stop_time.getTime() - start_time.getTime();
            let diff_hour = ('0' + Math.floor(diff / (60 * 60 * 1000))).slice(-2);
            let diff_minute = ('0' + Math.floor(diff / (60 * 1000))).slice(-2);
            let diff_second = ('0' +  Math.floor(diff / 1000)).slice(-2);
            let recorded_time = `${diff_hour}:${diff_minute}:${diff_second}`;
            console.log("recorded time: " + recorded_time);
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