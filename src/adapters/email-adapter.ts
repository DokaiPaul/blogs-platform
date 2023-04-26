import nodemailer from 'nodemailer'

export const emailAdapter = {
    async sendEmail(email: string, subject: string, message: string) {
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'denchik.excel@gmail.com',
                pass: 'wozfyuujebcyrvtf'
            }
        });

        const info = await transport.sendMail({
            from: 'Pashych <denchik.excel@gmail.com>',
            to: email,
            subject: subject,
            html: message
        });
        console.log(info)
        return info
    }
}