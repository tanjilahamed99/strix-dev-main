import emailjs  from '@emailjs/browser';

export const SendEmail = async (formData: any) => {
    return await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID || "YOUR_SERVICE_ID",
        import.meta.env.VITE_TEMPLATE_ID || "YOUR_TEMPLATE_ID",
        {
            name: formData.name,
            email: formData.email,
            message: formData.message,
            time: new Date().toLocaleString(),
        },
        import.meta.env.VITE_EMAIL_PUBLIC_KEY || "YOUR_PUBLIC_KEY",
    );
}