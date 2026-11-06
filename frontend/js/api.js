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

export async function getTravaux(id) {
    try {
        let res
        if (id === '') {
            // fetch without query
            res = await fetch(`${API_URL}/travaux`)


        } else {
            // fetch with query
            res = await fetch(`${API_URL}/travaux?cours=${id}`)
        }
        if (!res.ok) throw new Error("response error")
        const data = await res.json()

        //return filled object
        return data;
    } catch (err) {
        console.error(err)
        return [];
    }
}

export async function getTravail(id) {
    try {
        const res = await fetch(`${API_URL}/travaux/${id}`)
        if (!res.ok) throw new Error("response error")
        const data = await res.json()

        // return filled object
        return data;
    } catch (err) {
        console.error(err)
        return {};
    }
}

export async function getDisponibilites(id) {
    try {
        const res = await fetch(`${API_URL}/travaux/${id}/disponibilites`)
        if (!res.ok) throw new Error("response error")
        const data = await res.json()

        // return all dispos of a travail
        return data;
    } catch (err) {
        console.error(err)
        return [];
    }
}

export async function addDisponibilites(id, disponibilites) {
    const url = `${API_URL}/travaux/${id}/disponibilites`
    try {
        const res = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(disponibilites)
        })
        if (!res.ok) throw new Error("response error")

        const data = await res.json()

        return data;
    } catch (err) {
        console.error(err)
        return null
    }
}

