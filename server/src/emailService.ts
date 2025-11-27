import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

interface EmailTranslations {
  [key: string]: {
    resetPassword: {
      subject: string;
      title: string;
      subtitle: string;
      greeting: string;
      message: string;
      shopName: string;
      buttonText: string;
      validFor: string;
      minutes: string;
      securityTip: string;
      copyright: string;
    };
    passwordChanged: {
      subject: string;
      title: string;
      subtitle: string;
      greeting: string;
      message: string;
      shopName: string;
      notYou: string;
      contactSupport: string;
      copyright: string;
    };
    orderConfirmation: {
      subject: string;
      title: string;
      subtitle: string;
      greeting: string;
      orderNumber: string;
      total: string;
      items: string;
      thankYou: string;
      copyright: string;
    };
    emailVerification: {
      subject: string;
      title: string;
      subtitle: string;
      greeting: string;
      message: string;
      buttonText: string;
      validFor: string;
      copyright: string;
    };
  };
}

const emailTranslations: EmailTranslations = {
  pt: {
    resetPassword: {
      subject: 'Recuperação de Palavra-passe - Arte em Ponto',
      title: 'Recuperar Palavra-passe',
      subtitle: 'Não se preocupe, nós ajudamos!',
      greeting: 'Olá',
      message: 'Recebemos um pedido para redefinir a palavra-passe da sua conta na',
      shopName: 'Arte em Ponto',
      buttonText: 'Redefinir Palavra-passe',
      validFor: 'Este link é válido por',
      minutes: '15 minutos',
      securityTip: 'Nunca partilhe a sua palavra-passe. Se não solicitou esta recuperação, ignore este email.',
      copyright: '© {year} Arte em Ponto - Todos os direitos reservados'
    },
    passwordChanged: {
      subject: 'Palavra-passe Alterada - Arte em Ponto',
      title: 'Senha Redefinida!',
      subtitle: 'A sua conta está segura',
      greeting: 'Olá',
      message: 'A sua palavra-passe da',
      shopName: 'Arte em Ponto',
      notYou: 'Se não realizou esta alteração, contacte-nos imediatamente.',
      contactSupport: 'Suporte: arteemponto@exemplo.com',
      copyright: '© {year} Arte em Ponto - Todos os direitos reservados'
    },
    orderConfirmation: {
      subject: 'Confirmação de Pedido #{orderNumber} - Arte em Ponto',
      title: 'Pedido Confirmado!',
      subtitle: 'Obrigado pela sua compra',
      greeting: 'Olá',
      orderNumber: 'Pedido',
      total: 'Total',
      items: 'Artigos',
      thankYou: 'Obrigado por comprar na Arte em Ponto!',
      copyright: '© {year} Arte em Ponto - Todos os direitos reservados'
    },
    emailVerification: {
      subject: 'Verificar Email - Arte em Ponto',
      title: 'Verificar o seu Email',
      subtitle: 'Bem-vindo à Arte em Ponto!',
      greeting: 'Olá',
      message: 'Para ativar a sua conta, por favor clique no botão abaixo:',
      buttonText: 'Verificar Email',
      validFor: 'Este link é válido por 24 horas',
      copyright: '© {year} Arte em Ponto - Todos os direitos reservados'
    }
  },
  en: {
    resetPassword: {
      subject: 'Password Recovery - Arte em Ponto',
      title: 'Recover Password',
      subtitle: "Don't worry, we'll help you!",
      greeting: 'Hello',
      message: 'We received a request to reset your password for your account at',
      shopName: 'Arte em Ponto',
      buttonText: 'Reset Password',
      validFor: 'This link is valid for',
      minutes: '15 minutes',
      securityTip: 'Never share your password. If you did not request this recovery, ignore this email.',
      copyright: '© {year} Arte em Ponto - All rights reserved'
    },
    passwordChanged: {
      subject: 'Password Changed - Arte em Ponto',
      title: 'Password Reset!',
      subtitle: 'Your account is secure',
      greeting: 'Hello',
      message: 'Your password for',
      shopName: 'Arte em Ponto',
      notYou: 'If you did not make this change, contact us immediately.',
      contactSupport: 'Support: arteemponto@example.com',
      copyright: '© {year} Arte em Ponto - All rights reserved'
    },
    orderConfirmation: {
      subject: 'Order Confirmation #{orderNumber} - Arte em Ponto',
      title: 'Order Confirmed!',
      subtitle: 'Thank you for your purchase',
      greeting: 'Hello',
      orderNumber: 'Order',
      total: 'Total',
      items: 'Items',
      thankYou: 'Thank you for shopping at Arte em Ponto!',
      copyright: '© {year} Arte em Ponto - All rights reserved'
    },
    emailVerification: {
      subject: 'Verify Email - Arte em Ponto',
      title: 'Verify your Email',
      subtitle: 'Welcome to Arte em Ponto!',
      greeting: 'Hello',
      message: 'To activate your account, please click the button below:',
      buttonText: 'Verify Email',
      validFor: 'This link is valid for 24 hours',
      copyright: '© {year} Arte em Ponto - All rights reserved'
    }
  }
};

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    const emailConfig = {
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    };

    console.log('🔧 Email configuration:', {
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      user: emailConfig.auth.user
    });

    this.transporter = nodemailer.createTransport(emailConfig);

    this.transporter.verify()
      .then(() => {
        console.log('✅ Email server ready and verified');
      })
      .catch((error) => {
        console.error('❌ Email configuration error:', error.message);
        console.warn('⚠️ Email server may not be available, but the application will continue');
      });
  }

  async sendPasswordResetEmail(email: string, resetToken: string, userName: string, language = 'pt') {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/redefinir-senha?token=${resetToken}`;
    const t = emailTranslations[language] || emailTranslations.pt;
    const content = t.resetPassword;

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'Arte em Ponto'}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: content.subject,
      html: this.getResetPasswordHTML(resetUrl, userName, content),
      text: this.getResetPasswordText(resetUrl, userName, content)
    };

    try {
      console.log('📧 Sending email to:', email);
      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Reset email sent successfully!', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error: any) {
      console.error('❌ Error sending reset email:', error);
      throw new Error(`Could not send email: ${error.message}`);
    }
  }

  async sendPasswordChangedNotification(email: string, userName: string, language = 'pt') {
    const t = emailTranslations[language] || emailTranslations.pt;
    const content = t.passwordChanged;

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'Arte em Ponto'}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: content.subject,
      html: this.getPasswordChangedHTML(userName, content),
      text: this.getPasswordChangedText(userName, content)
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Password changed notification sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error: any) {
      console.error('❌ Error sending notification:', error.message);
      return { success: false, error: error.message };
    }
  }

  async sendOrderConfirmation(
    email: string,
    userName: string,
    orderNumber: string,
    orderDetails: any,
    language = 'pt'
  ) {
    const t = emailTranslations[language] || emailTranslations.pt;
    const content = t.orderConfirmation;

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'Arte em Ponto'}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: content.subject.replace('{orderNumber}', orderNumber),
      html: this.getOrderConfirmationHTML(userName, orderNumber, orderDetails, content),
      text: this.getOrderConfirmationText(userName, orderNumber, orderDetails, content)
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Order confirmation sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error: any) {
      console.error('❌ Error sending order confirmation:', error.message);
      return { success: false, error: error.message };
    }
  }

  async sendEmailVerification(email: string, verificationToken: string, userName: string, language = 'pt') {
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verificar-email?token=${verificationToken}`;
    const t = emailTranslations[language] || emailTranslations.pt;
    const content = t.emailVerification;

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'Arte em Ponto'}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: content.subject,
      html: this.getEmailVerificationHTML(verificationUrl, userName, content),
      text: this.getEmailVerificationText(verificationUrl, userName, content)
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Verification email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error: any) {
      console.error('❌ Error sending verification email:', error.message);
      throw new Error(`Could not send email: ${error.message}`);
    }
  }

  private getResetPasswordHTML(resetUrl: string, userName: string, content: any): string {
    return `
<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${content.title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 50%, #f5f5f5 100%); min-height: 100vh;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1); overflow: hidden;">
          <tr>
            <td style="padding: 48px 40px 32px; text-align: center;">
              <div style="display: inline-block; width: 80px; height: 80px; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); border-radius: 20px; box-shadow: 0 8px 20px rgba(239, 68, 68, 0.3); margin-bottom: 24px; line-height: 80px;">
                <span style="font-size: 40px;">🔐</span>
              </div>
              <h1 style="margin: 0 0 12px; font-size: 28px; font-weight: 700; color: #1a1a1a;">${content.title}</h1>
              <p style="margin: 0; font-size: 15px; color: #8c8c8c;">${content.subtitle}</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 40px;">
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #404040;">
                ${content.greeting}${userName ? ` <strong>${userName}</strong>` : ''},
              </p>
              <p style="margin: 0 0 32px; font-size: 15px; line-height: 1.7; color: #5f6368;">
                ${content.message} <strong>${content.shopName}</strong>.
              </p>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding: 0 0 32px;">
                    <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 16px 48px; border-radius: 12px; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);">
                      ${content.buttonText}
                    </a>
                  </td>
                </tr>
              </table>
              <div style="background: #f8f9fa; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                <p style="margin: 0 0 8px; font-size: 13px; color: #5f6368;">
                  <strong>⏱️ ${content.validFor} ${content.minutes}</strong>
                </p>
                <p style="margin: 0; font-size: 12px; color: #8c8c8c; word-break: break-all;">
                  ${resetUrl}
                </p>
              </div>
              <div style="background: #fffbeb; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 13px; color: #92400e;">
                  🔒 ${content.securityTip}
                </p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 40px; border-top: 1px solid #e8eaed; text-align: center; background: #f8f9fa;">
              <p style="margin: 0; font-size: 12px; color: #b3b3b3;">
                ${content.copyright.replace('{year}', new Date().getFullYear().toString())}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;
  }

  private getResetPasswordText(resetUrl: string, userName: string, content: any): string {
    return `
${content.title}

${content.greeting}${userName ? ` ${userName}` : ''},

${content.message} ${content.shopName}.

${content.buttonText}: ${resetUrl}

${content.validFor} ${content.minutes}

${content.securityTip}

${content.copyright.replace('{year}', new Date().getFullYear().toString())}
    `;
  }

  private getPasswordChangedHTML(userName: string, content: any): string {
    return `
<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${content.title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 50%, #f5f5f5 100%); min-height: 100vh;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1); overflow: hidden;">
          <tr>
            <td style="padding: 48px 40px 32px; text-align: center;">
              <div style="display: inline-block; width: 80px; height: 80px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 20px; box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3); margin-bottom: 24px; line-height: 80px;">
                <span style="font-size: 40px;">✓</span>
              </div>
              <h1 style="margin: 0 0 12px; font-size: 28px; font-weight: 700; color: #1a1a1a;">${content.title}</h1>
              <p style="margin: 0; font-size: 15px; color: #8c8c8c;">${content.subtitle}</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 40px;">
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #404040;">
                ${content.greeting}${userName ? ` <strong>${userName}</strong>` : ''},
              </p>
              <p style="margin: 0 0 32px; font-size: 15px; line-height: 1.7; color: #5f6368;">
                ${content.message} <strong>${content.shopName}</strong> foi alterada com sucesso.
              </p>
              <div style="background: #fef2f2; border-left: 4px solid #ef4444; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 13px; color: #991b1b;">
                  ⚠️ ${content.notYou}
                </p>
              </div>
              <div style="background: #f8f9fa; border-radius: 12px; padding: 20px; text-align: center;">
                <p style="margin: 0; font-size: 13px; color: #5f6368;">
                  ${content.contactSupport}
                </p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 40px; border-top: 1px solid #e8eaed; text-align: center; background: #f8f9fa;">
              <p style="margin: 0; font-size: 12px; color: #b3b3b3;">
                ${content.copyright.replace('{year}', new Date().getFullYear().toString())}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;
  }

  private getPasswordChangedText(userName: string, content: any): string {
    return `
${content.title}

${content.greeting}${userName ? ` ${userName}` : ''},

${content.message} ${content.shopName} foi alterada com sucesso.

${content.notYou}

${content.contactSupport}

${content.copyright.replace('{year}', new Date().getFullYear().toString())}
    `;
  }

  private getOrderConfirmationHTML(userName: string, orderNumber: string, orderDetails: any, content: any): string {
    const itemsHTML = orderDetails.items.map((item: any) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e8eaed;">${item.name}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e8eaed; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e8eaed; text-align: right;">${item.price.toFixed(2)}€</td>
      </tr>
    `).join('');

    return `
<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${content.title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 50%, #f5f5f5 100%); min-height: 100vh;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1); overflow: hidden;">
          <tr>
            <td style="padding: 48px 40px 32px; text-align: center;">
              <div style="display: inline-block; width: 80px; height: 80px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 20px; box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3); margin-bottom: 24px; line-height: 80px;">
                <span style="font-size: 40px;">🎉</span>
              </div>
              <h1 style="margin: 0 0 12px; font-size: 28px; font-weight: 700; color: #1a1a1a;">${content.title}</h1>
              <p style="margin: 0; font-size: 15px; color: #8c8c8c;">${content.subtitle}</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 40px;">
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #404040;">
                ${content.greeting}${userName ? ` <strong>${userName}</strong>` : ''},
              </p>
              <div style="background: #f8f9fa; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                <p style="margin: 0 0 8px; font-size: 14px; color: #5f6368;">
                  <strong>${content.orderNumber}:</strong> #${orderNumber}
                </p>
                <p style="margin: 0; font-size: 14px; color: #5f6368;">
                  <strong>${content.total}:</strong> ${orderDetails.total.toFixed(2)}€
                </p>
              </div>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 24px;">
                <thead>
                  <tr style="background: #f8f9fa;">
                    <th style="padding: 12px; text-align: left; font-size: 13px; color: #5f6368;">Artigo</th>
                    <th style="padding: 12px; text-align: center; font-size: 13px; color: #5f6368;">Qtd</th>
                    <th style="padding: 12px; text-align: right; font-size: 13px; color: #5f6368;">Preço</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHTML}
                </tbody>
              </table>
              <p style="margin: 0; font-size: 15px; text-align: center; color: #5f6368;">
                ${content.thankYou}
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 40px; border-top: 1px solid #e8eaed; text-align: center; background: #f8f9fa;">
              <p style="margin: 0; font-size: 12px; color: #b3b3b3;">
                ${content.copyright.replace('{year}', new Date().getFullYear().toString())}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;
  }

  private getOrderConfirmationText(userName: string, orderNumber: string, orderDetails: any, content: any): string {
    const itemsText = orderDetails.items.map((item: any) => 
      `${item.name} x${item.quantity} - ${item.price.toFixed(2)}€`
    ).join('\n');

    return `
${content.title}

${content.greeting}${userName ? ` ${userName}` : ''},

${content.orderNumber}: #${orderNumber}
${content.total}: ${orderDetails.total.toFixed(2)}€

${content.items}:
${itemsText}

${content.thankYou}

${content.copyright.replace('{year}', new Date().getFullYear().toString())}
    `;
  }

  private getEmailVerificationHTML(verificationUrl: string, userName: string, content: any): string {
    return `
<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${content.title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 50%, #f5f5f5 100%); min-height: 100vh;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1); overflow: hidden;">
          <tr>
            <td style="padding: 48px 40px 32px; text-align: center;">
              <div style="display: inline-block; width: 80px; height: 80px; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border-radius: 20px; box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3); margin-bottom: 24px; line-height: 80px;">
                <span style="font-size: 40px;">📧</span>
              </div>
              <h1 style="margin: 0 0 12px; font-size: 28px; font-weight: 700; color: #1a1a1a;">${content.title}</h1>
              <p style="margin: 0; font-size: 15px; color: #8c8c8c;">${content.subtitle}</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 40px;">
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #404040;">
                ${content.greeting}${userName ? ` <strong>${userName}</strong>` : ''},
              </p>
              <p style="margin: 0 0 32px; font-size: 15px; line-height: 1.7; color: #5f6368;">
                ${content.message}
              </p>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding: 0 0 32px;">
                    <a href="${verificationUrl}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 16px 48px; border-radius: 12px; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);">
                      ${content.buttonText}
                    </a>
                  </td>
                </tr>
              </table>
              <div style="background: #f8f9fa; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                <p style="margin: 0 0 8px; font-size: 13px; color: #5f6368;">
                  <strong>⏱️ ${content.validFor}</strong>
                </p>
                <p style="margin: 0; font-size: 12px; color: #8c8c8c; word-break: break-all;">
                  ${verificationUrl}
                </p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 40px; border-top: 1px solid #e8eaed; text-align: center; background: #f8f9fa;">
              <p style="margin: 0; font-size: 12px; color: #b3b3b3;">
                ${content.copyright.replace('{year}', new Date().getFullYear().toString())}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;
  }

  private getEmailVerificationText(verificationUrl: string, userName: string, content: any): string {
    return `
${content.title}

${content.greeting}${userName ? ` ${userName}` : ''},

${content.message}

${content.buttonText}: ${verificationUrl}

${content.validFor}

${content.copyright.replace('{year}', new Date().getFullYear().toString())}
    `;
  }
}

export default new EmailService();
