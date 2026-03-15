import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendAuthNotification = async (type: 'signup' | 'login', userDetails: { name?: string, email: string }) => {
  const notificationEmail = process.env.NOTIFICATION_EMAIL || 'uttamkumarchiloush123@gmail.com';
  
  // If SMTP is not configured, we just log it to avoid crashing
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log(`[Email Mock] Notification to ${notificationEmail}: User ${type} - ${JSON.stringify(userDetails)}`);
    return;
  }

  const subject = `WellMind AI: User ${type === 'signup' ? 'Registered' : 'Logged In'}`;
  const text = `
    User Details:
    Type: ${type.toUpperCase()}
    Name: ${userDetails.name || 'N/A'}
    Email: ${userDetails.email}
    Time: ${new Date().toISOString()}
  `;

  try {
    await transporter.sendMail({
      from: `"WellMind AI" <${process.env.SMTP_USER}>`,
      to: notificationEmail,
      subject,
      text,
    });
    console.log(`Notification email sent to ${notificationEmail}`);
  } catch (error) {
    console.error('Error sending notification email:', error);
  }
};
