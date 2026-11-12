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
