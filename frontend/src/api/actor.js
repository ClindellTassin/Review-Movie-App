import { catchError, getToken } from "../utils/helper";
import client from "./client";

export const createActor = async (formData) => {
    const token = getToken();
    try {
        const { data } = await client.post("/actor/create", formData,
            {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'content-type': 'multipart/form-data'
                },
            });
        return data;
    } catch (error) {
        return catchError(error);
    }
}

export const searchActor = async (query) => {
    const token = getToken();
    try {
        const { data } = await client(`/actor/search?name=${query}`,
            {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'content-type': 'multipart/form-data'
                },
            });
        return data;
    } catch (error) {
        return catchError(error);
    }
}