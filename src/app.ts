import 'dotenv/config';
import { InteractionResponseType, InteractionType } from 'discord-interactions';
import express from 'express';
import { CREATE_GRAPH_COMMNAND, HasGuildCommands, START_COMMAND, STOP_COMMAND, TEST_COMMAND } from './commands.js';
import { VerifyDiscordRequest, ZeroPadding } from './utils.js';
import { CreateGraph, PostPixel } from './pixela.js';

const app = express();
const PORT = process.env.PORT || 3000;
let start_time: Date;
let stop_time;
let is_started = false;
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
                    content: 'Hello world.',
                }
            });
        }
        if (name === 'start') {
            if (is_started == true) {
                return res.send({
                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: {
                        content: 'Task already started',
                    }
                });
            }
            is_started = true;
            start_time = new Date();
            return res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: 'Task starts',
                }
            });
        }
        if (name === 'stop') {
            if (is_started == false) {
                return res.send({
                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: {
                        content: 'No task already started',
                    }
                });
            }
            is_started = false;
            stop_time = new Date();
            const diff = stop_time.getTime() - start_time.getTime();
            const diff_hour = Math.floor(diff / (60 * 60 * 1000));
            const diff_minute = Math.floor(diff / (60 * 1000));
            const diff_second = Math.floor(diff / 1000);
            const recorded_time = `${ZeroPadding(diff_hour, 2)}:${ZeroPadding(diff_minute, 2)}:${ZeroPadding(diff_second, 2)}`;
            const quantity = (diff / (60 * 60 * 1000)).toFixed(2);
            await PostPixel(quantity);
            return res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: `Recorded time: ${recorded_time}`,
                }
            })
        }
        if (name === 'create_graph') {
            return res.send({
                type: InteractionResponseType.MODAL,
                data: {
                    title: 'Create graph',
                    custom_id: 'create-graph',
                    components: [
                        {
                            type: 1,
                            components: [
                                {
                                    type: 4,
                                    style: 1,
                                    label: 'id',
                                    custom_id: 'id',
                                },
                            ]
                        },
                        {
                            type: 1,
                            components: [
                                {
                                    type: 4,
                                    style: 1,
                                    label: 'name',
                                    custom_id: 'name',
                                },
                            ]
                        },
                        {
                            type: 1,
                            components: [
                                {
                                    type: 4,
                                    style: 1,
                                    label: 'unit',
                                    custom_id: 'unit',
                                },
                            ]
                        },
                        {
                            type: 1,
                            components: [
                                {
                                    type: 4,
                                    style: 1,
                                    label: 'type',
                                    custom_id: 'type',
                                    placeholder: 'only int or float',
                                },
                            ]
                        },
                        {
                            type: 1,
                            components: [
                                {
                                    type: 4,
                                    style: 1,
                                    label: 'color',
                                    custom_id: 'color',
                                    placeholder: 'shibafu, momiji, sora, ichou, ajisai, kuro',
                                },
                            ]
                        },
                    ]
                },
            });
        }
    }
    if (type === InteractionType.MODAL_SUBMIT) {
        console.log(data);
        if (data.custom_id === 'create-graph') {
            const id = data.components[0].components[0].value;
            const name = data.components[1].components[0].value;
            const unit = data.components[2].components[0].value;
            const type = data.components[3].components[0].value;
            const color = data.components[4].components[0].value;
            const res_pixela = await CreateGraph(id, name, unit, type, color);
            if (!res_pixela.ok) {
                const data = await res_pixela.json();
                return res.send({
                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: {
                        content: JSON.stringify(data)
                    }
                })
            }
            return res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: 'Graph created'
                },
            });
        }
    }
})

app.listen(PORT, () => {
    console.log('Listening on port', PORT);

    HasGuildCommands(process.env.APP_ID, process.env.GUILD_ID, [
        TEST_COMMAND, START_COMMAND, STOP_COMMAND, CREATE_GRAPH_COMMNAND
    ]);
});