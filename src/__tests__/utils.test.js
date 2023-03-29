import { expect } from "chai";
import fetch from "node-fetch";
import Sinon from "sinon";
import { DiscordRequest } from "../utils.js";

describe('DiscordRequest', () => {
    it('it should be success', async () => {
        let fetchMock = Sinon.stub(fetch, "Promise").resolves({
            ok: true
        });
        const endpoint = 'test/';
        const options = {'test': 'test'};
        const res = await DiscordRequest(endpoint, options);
        expect(fetchMock.calledOnce).to.equal(true);
        expect(res.ok).equals(true);
        fetchMock.restore();
    });

    it('it should be thrown exception when ok is not true', async () => {
        const body = {json: () => ({error: "error message"})};
        let fetchMock = await Sinon.stub(fetch, "Promise").resolves(body);
        const endpoint = 'test/';
        const options = {'test': 'test'};
        await DiscordRequest(endpoint, options).catch((e) => {
            expect(e.message).to.equal(JSON.stringify({error: "error message"}));
        })
        expect(fetchMock.calledOnce).to.equal(true);
        fetchMock.restore();
    })
});