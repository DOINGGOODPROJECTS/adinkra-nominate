import nodemailer from "nodemailer"

// Type pour les données d'email
export type EmailData = {
  to: string
  subject: string
  text: string
  html: string
}

// Fonction pour envoyer un email
export async function sendEmail(data: EmailData): Promise<void> {
  // Créer un transporteur SMTP
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: Number(process.env.EMAIL_PORT) === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  // Envoyer l'email
  await transporter.sendMail({
    from: `"Adinkra Fellowship" <${process.env.EMAIL_USER}>`,
    to: data.to,
    subject: data.subject,
    text: data.text,
    html: data.html,
  })
}

// Fonction pour générer l'email de nomination
export function generateNominationEmail(nomineeName: string): { text: string; html: string } {
  const text = `
Subject: You've Been Nominated for the Adinkra Fellowship!

Dear ${nomineeName},

We are thrilled to inform you that you have been nominated for the prestigious Adinkra Fellowship! Your nomination reflects the high regard in which you are held by your nominator for your outstanding contributions and potential.

To proceed, we invite you to complete the application process by submitting the required materials before the deadline of July 3, 2025 - 10 AM GMT+0. You can find the application form and further details on our website at https://adinkrafellowship.com/.

If you have any questions or need assistance, feel free to contact us at team@adinkrafellowship.com.

We look forward to receiving your application and learning more about your achievements!

Best regards,
The Adinkra Fellowship Team
  `

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background-color: #e1ebfa;
      color: #000;
      padding: 20px;
      text-align: center;
    }
    .content {
      padding: 20px;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      font-size: 12px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Adinkra Fellowship Nomination</h1>
    </div>
    <div class="content">
      <p>Dear ${nomineeName},</p>
      
      <p>We are thrilled to inform you that you have been nominated for the prestigious <strong>Adinkra Fellowship</strong>! Your nomination reflects the high regard in which you are held by your nominator for your outstanding contributions and potential.</p>
      
      <p>To proceed, we invite you to complete the application process by submitting the required materials before the deadline of <strong>July 3, 2025 - 10 AM GMT+0</strong>. You can find the application form and further details on our website at <a href="https://adinkrafellowship.com/">https://adinkrafellowship.com/</a>.</p>
      
      <p>If you have any questions or need assistance, feel free to contact us at <a href="mailto:team@adinkrafellowship.com">team@adinkrafellowship.com</a>.</p>
      
      <p>We look forward to receiving your application and learning more about your achievements!</p>
      
      <p>Best regards,<br>
      The Adinkra Fellowship Team</p>
    </div>
    <div class="footer">
      <p>© 2025 Adinkra Fellowship. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `

  return { text, html }
}
