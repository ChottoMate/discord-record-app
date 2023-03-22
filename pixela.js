import fetch from "node-fetch";

const baseURL = 'https://pixe.la/';

export async function CreateGraph() {
    const endpoint = baseURL + `vi/users/${process.env.USER_NAME}/graphs`;
    console.log(endpoint);
    const body = {
        id: 'test_id',
        name: 'test_name',
        unit: 'km',
        type: 'int',
        color: 'momiji',
    }
    const options = {
        method: 'POST',
        headers: {
            `X-USER-TOKEN: ${process.env.PASSWORD}`,
        },
        body: JSON.stringify(body),
    };
    console.log(options);
    const res = await fetch(endpoint, options);
    return res
}