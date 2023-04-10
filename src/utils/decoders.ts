export const decodeBase64 = (input: string) => {
    const buff = new Buffer(input, 'base64')
    const decoded = buff.toString('ascii')
    return decoded.split(':')
}