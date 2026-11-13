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

export async function addDisponibilites(id, matricule, disponibilites) {
    const url = `${API_URL}/travaux/${id}/disponibilites/${matricule}`
    try {
        const res = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(disponibilites)
        })

        const data = await res.json()

        // ok + status pour savoir si c'est un 409 (ferme), 400, 404...
        return { ok: res.ok, status: res.status, data }
    } catch (err) {
        console.error(err)
        return { ok: false, data: { error: "serveur injoignable" } }
    }
}

export async function connexion(identifiant, motDePasse) {
    const url = `${API_URL}/connexion`
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ identifiant, motDePasse })
        })

        const data = await res.json()

        return { ok: res.ok, data }
    } catch (err) {
        console.error(err)
        return { ok: false, data: { error: "serveur injoignable" } }
    }
}

async function fetchAdmin(url, method, body) {
    const sessionToken = sessionStorage.getItem("token")
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionToken}`
        }
    }

    if (body) {
        options.body = JSON.stringify(body)
    }

    try {

        const res = await fetch(url, options)
        const data = await res.json()

        return { ok: res.ok, status: res.status, data }

    } catch (err) {
        console.error(err)
        return { ok: false, data: { error: "serveur injoignable" } }
    }
}

export async function deconnexion() {
    const url = `${API_URL}/deconnexion`
    return fetchAdmin(url, 'POST')
}

export async function getAdminTravaux() {
    const url = `${API_URL}/admin/travaux`
    try {
        return fetchAdmin(url, 'GET')
    } catch (err) {
        console.error(err)
        return []
    }
}

export async function updateTravail(id, travail) {
    const url = `${API_URL}/travaux/${id}`
    return fetchAdmin(url, 'PUT', travail)
}

export async function addCreneau(travailId, creneau) {
    const url = `${API_URL}/travaux/${travailId}/creneaux`
    return fetchAdmin(url, 'POST', creneau)
}

export async function updateCreneau(id, creneau) {
    const url = `${API_URL}/creneaux/${id}`
    return fetchAdmin(url, 'PUT', creneau)
}

export async function deleteCreneau(id) {
    const url = `${API_URL}/creneaux/${id}`
    return fetchAdmin(url, 'DELETE')
}
