export const changeKeyName = (obj: object, old_key: string, new_key: string): void => {
    // @ts-ignore
    obj[new_key] = obj[old_key];
    // @ts-ignore
    delete obj[old_key]
}