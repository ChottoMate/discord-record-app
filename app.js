import 'dotenv/config';
import { InteractionResponseType, InteractionType } from 'discord-interactions';
import express from 'express';
import { HasGuildCommands, TEST_COMMAND } from './commands.js';
import { VerifyDiscordRequest } from './utils.js';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

app.post('/interactions', async function(req, res) {
    const { type, id, data } = req.body;

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
    }
})

app.listen(PORT, () => {
    console.log('Listening on port', PORT);

    HasGuildCommands(process.env.APP_ID, process.env.GUILD_ID, [
        TEST_COMMAND
    ]);
});