import {jest} from '@jest/globals'
import fetch, { Response } from "node-fetch";
import { DiscordRequest } from "../utils";

test('it should be success', async () => {
    // jest.mocked(fetch).mockReturnValue(
    //     Promise.resolve(new Response("ok", { status: 200 }))
    // );
    const expectedResponse = { ok: true };
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(new Response(JSON.stringify(expectedResponse)));
    const options = { method: 'POST', body: {test: 'test'}};
    const endpoint = 'test/'
    
    const discord_response = await DiscordRequest(endpoint, options);
    expect(discord_response).toEqual("faf");
});