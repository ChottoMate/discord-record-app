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
    });
});