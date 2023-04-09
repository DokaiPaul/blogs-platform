export const decodeBase64 = (input: string) => {
    const immutable = input
    const code = immutable.split(' ')[1];

    const buff = new Buffer(code, 'base64')
    const decoded = buff.toString('ascii')
    return decoded.split(':')
}