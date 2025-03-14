export const isValidStringArray = (object:any) => {
    if (!Array.isArray(object)) return false
    if (object.length > 20) return false
    for (const item of object) {
        if (!(typeof item == "string")) return false
    }
    return true
}