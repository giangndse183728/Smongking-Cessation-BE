import { MailService } from '@libs/mail/mail.service';

export async function sendPasswordResetEmail(
  mailService: MailService,
  email: string,
  resetToken: string,
): Promise<void> {
  const resetLink = `https://your-frontend-url/reset-password?token=${resetToken}`;
  const subject = 'Password Reset Request';
  const text = `You are receiving this because you (or someone else) has requested the reset of the password for your account.\n\n
    Please click on the following link, or paste this into your browser to complete the process:\n\n
    ${resetLink}\n\n
    If you did not request this, please ignore this email and your password will remain unchanged.\n`;

  try {
    await mailService.sendMail(email, subject, text);
    console.log(`Password reset email sent to ${email}`);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
}
