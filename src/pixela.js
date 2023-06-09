import fetch from "node-fetch";
import { ZeroPadding } from "./utils.js";

const baseURL = 'https://pixe.la/';

export async function CreateGraph(id, name, unit, type, color) {
    const endpoint = baseURL + `v1/users/${process.env.USER_NAME}/graphs`;
    const body = {
        id: id,
        name: name,
        unit: unit,
        type: type,
        color: color,
    };
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

export async function PostPixel(quantity) {
    const endpoint = baseURL + `v1/users/${process.env.USER_NAME}/graphs/${process.env.GRAPH_ID}`;
    const now = new Date();
    const body = {
        date: now.getFullYear().toString() + ZeroPadding(now.getMonth() + 1, 2) + ZeroPadding(now.getDate(), 2),
        quantity: quantity,
    };
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-USER-TOKEN': process.env.PASSWORD,
        },
        body: JSON.stringify(body),
    };
    await fetch(endpoint, options);
}