import sgMail from '@sendgrid/mail'
import fs from 'fs'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export const sendTestEmail = async data => {
    const msg = {
        to: `${data.email}`,
        from: `${process.env.SENDER_EMAIL}`,
        subject: 'Test Email',
        text: `${data.message}`
    }

    try {
        await sgMail.send(msg)
    } catch (error) {
        console.error(error)
    }
}


export const sendNewBlogCreatedEmail = async (email, blog) => {

    fs.readFile(('./src/data/test.pdf'), async (err, data) => {
        if (err) console.log(err)
        if (data) {
            const msg = {
                to: `${email}`,
                from: `${process.env.SENDER_EMAIL}`,
                subject: `New Blog - ${blog.title}`,
                text: `${blog.content}`,
                html: `
                    <img src=${blog.cover} />
                    <h2>${blog.title}</h2>
                    <p>${blog.content}</p>
                    <a href=\`https://hs-strive-blogs.vercel.app/blog/${blog.id}\`>View The Blog</a>
                    `,
                attachments: [
                    {
                        content: data.toString('base64'),
                        filename: `${blog.title}.pdf`,
                        type: 'application/csv',
                        disposition: 'attachment',
                        content_id: blog.id
                    }
                ]
            }

            try {
                await sgMail.send(msg)    
            } catch (error) {
                console.log(error)
            }

        }
    })
        

}