// Turns a raw date from the API (e.g. "2026-11-20T18:00:00.000Z")
// into readable French text.
//   dateFormat(date)       -> "20 novembre 2026"
//   dateFormat(date, true) -> "20 novembre 2026 à 13 h 00"
export function dateFormat(date, withTime = false) {
    // data not loaded yet -> show nothing instead of "Invalid Date"
    if (!date) {
        return ''
    }

    const newDate = new Date(date)

    const options = { day: 'numeric', month: 'long', year: 'numeric' }

    if (withTime) {
        options.hour = '2-digit'
        options.minute = '2-digit'
    }

    return newDate.toLocaleString('fr-CA', options)
}

// Turns a raw date from the API into the format of <input type="date">.
//   versInputDate("2026-09-01T04:00:00.000Z") -> "2026-09-01"
export function versInputDate(date) {
    if (!date) {
        return ''
    }

    const newDate = new Date(date)

    // local time, getMonth() starts at 0
    const annee = newDate.getFullYear()
    const mois = String(newDate.getMonth() + 1).padStart(2, '0')
    const jour = String(newDate.getDate()).padStart(2, '0')

    return `${annee}-${mois}-${jour}`
}

// Turns a raw date from the API into the format of <input type="datetime-local">.
//   versInputDateTime("2026-09-21T03:59:00.000Z") -> "2026-09-20T23:59"
export function versInputDateTime(date) {
    if (!date) {
        return ''
    }

    const newDate = new Date(date)

    const heures = String(newDate.getHours()).padStart(2, '0')
    const minutes = String(newDate.getMinutes()).padStart(2, '0')

    return `${versInputDate(date)}T${heures}:${minutes}`
}
