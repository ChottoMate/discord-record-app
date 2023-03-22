import fetch from "node-fetch";

const baseURL = 'https://pixe.la/';

export async function CreateGraph() {
    const endpoint = baseURL + `v1/users/${process.env.USER_NAME}/graphs`;
    console.log(endpoint);
    const body = {
        id: 'test-id',
        name: 'test-name',
        unit: 'km',
        type: 'int',
        color: 'momiji',
    }
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-USER-TOKEN': process.env.PASSWORD,
        },
        body: JSON.stringify(body),
    };
    console.log(options);
    const res = await fetch(endpoint, options);
    return res
}