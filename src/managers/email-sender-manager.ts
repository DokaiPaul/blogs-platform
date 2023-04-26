import {UserDbModel} from "../models/mongo-db-models/users-db-model";
import {emailAdapter} from "../adapters/email-adapter";

export const emailsManager = {
    async sendEmailConfirmationCode (user: UserDbModel, code: string) {
        const email = user.email
        const subject = 'Email Confirmation'
        const text = `<h1>Thank for your registration</h1>
        <p>To finish registration please follow the link below:
        <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>
        </p>`

        await emailAdapter.sendEmail(email, subject , text)
    }
}