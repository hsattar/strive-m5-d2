import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export const sendTestEmail = async data => {
    const msg = {
        to: `${data.email}`,
        from: 'hasanraza1798@gmail.com',
        subject: 'Test Email',
        text: `${data.message}`
    }

    try {
        await sgMail.send(msg)
    } catch (error) {
        console.error(error)
    }
}