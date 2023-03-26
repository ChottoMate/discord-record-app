import { DiscordRequest } from "../utils";
import fetch from "node-fetch";
const {Response} = jest.requireActual('node-fetch');
jest.mock('node-fetch', () => jest.fn());

test('it should be success', async () => {
    const expectedResponse = { ok: true };
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue(new Response(JSON.stringify(expectedResponse)));
    const options = { method: 'POST', body: {test: 'test'}};
    const endpoint = 'test/'
    const discord_response = await DiscordRequest(endpoint, options);
    expect(discord_response).toEqual("faf");
});