import sgMail from '@sendgrid/mail'

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

    const msg = {
        to: `${email}`,
        from: `${process.env.SENDER_EMAIL}`,
        subject: `New Blog - ${blog.title}`,
        text: `${blog.content}`,
        html: `
            <img src=${blog.cover} />
            <h2>${blog.title}</h2>
            <p>${blog.content}</p>
            <a href=\`https://hs-strive-blogs.vercel.app/blogs/${blog.id}\`>View The Blog</a>
            `
    }

    try {
        await sgMail.send(msg)    
    } catch (error) {
        console.log(error)
    }
}