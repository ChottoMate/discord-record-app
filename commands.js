import { DiscordRequest } from "./utils.js"

export async function HasGuildCommands(appId, guildId, commands) {
    if (guildId === '' || appId === '') return;
    commands.forEach((c) => HasGuildCommand(appId, guildId, c));
}

async function HasGuildCommand(appId, guildId, command) {
    const endpoint = `applications/${appId}/guilds/${guildId}/commands`

    try {
        const res = await DiscordRequest(endpoint, { method: 'GET'});
        const data = await res.json();
        
        if (data) {
            const installedNames = data.map((c) => c['name']);
            console.log(installedNames);
            if (!installedNames.includes(command['name'])) {
                console.log(`Installing "${command['name']}"`);
                InstallGuildCommand(appId, guildId, command);
            } else {
                console.log(`"${command['name']}" command already installed`);
            }
        }
    } catch (err) {
        console.error(err);
    }
}

export async function InstallGuildCommand(appId, guildId, command) {
    const endpoint = `applications/${appId}/guilds/${guildId}/commands`;
    try {
        await DiscordRequest(endpoint, { method: 'POST', body: command});
    } catch (err) {
        console.error(err);
    }
}

export const TEST_COMMAND = {
    name: 'test',
    description: 'Basic guild command',
    type: 1,
};

export const START_COMMAND = {
    name: 'start',
    description: 'Start task command',
    type: 1,
}

export const STOP_COMMAND = {
    name: 'stop',
    description: 'Stop task command',
    type: 1,
}

export const CREATE_GRAPH_COMMNAND = {
    name: 'create_graph',
    description: 'Create graph command',
    type: 1,
}