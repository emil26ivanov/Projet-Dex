//imports
import { API_URL } from './config.js'

export async function getCours() {
    try {
        const res = await fetch(`${API_URL}/cours`)
        if (!res.ok) throw new Error("response error")
        const data = await res.json()

        //return filled object
        return data;
    } catch (err) {
        console.error(err);
        //return empty object
        return [];
    }
}

export async function getTravaux() {
    try {

        
        const res = await fetch(`${API_URL}/travaux`)
        if (!res.ok) throw new Error("response error")
        const data = await res.json()

        //return filled object
        return data;
    } catch (err) {
        console.error(err)
        return [];
    }
}

