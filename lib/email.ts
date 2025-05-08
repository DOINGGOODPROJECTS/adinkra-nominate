import nodemailer from "nodemailer"

// Type pour les données d'email
export type EmailData = {
  to: string
  subject: string,
  cc: string,
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
    cc: data.cc,
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
      <h3>You’ve Been Nominated for the Adinkra Fellowship 2026 – Apply Now</h3>
    </div>
    <div class="content">
      <p>Dear ${nomineeName},</p>
      <p>I hope this message finds you well.</p>
      <p>I’m reaching out because someone recently nominated you for the <strong>Adinkra Fellowship 2026</strong>, a prestigious program celebrating and connecting emerging Black leaders aged 40 and under from Africa and the global diaspora.</p>
      <p>Each year, we aim to select 20 exceptional individuals—10 from Africa and 10 from the diaspora—for an amazing leadership journey that includes two immersive experiences in Africa and/or a diaspora country. The fellowship offers powerful connections, deep cultural exploration, and the opportunity to shape the future of global Black leadership.</p>
      <p>
        <strong>🔗 Apply by July 3:</strong><br />
        <a href="https://adinkrafellowship.com/apply.html">https://adinkrafellowship.com/apply.html</a>
      </p>

      <p>If, for any reason, you’re unable to apply, feel free to pass this along to someone equally exceptional in your circle.</p>
      <p>We’re building a bold, brilliant, and borderless community—and we’d love for you to be part of it.</p>
      
      <p>With warm regards,<br>
      The Adinkra Fellowship Team</p>
    </div>
    <br />
    <br />
    <br />
    <div>---------------</div>
    <br />
    <br />
    <br />
    <div class="header">
      <h3>Vous avez été nominé·e pour le programme Adinkra Fellowship 2026 – Postulez dès maintenant</h3>
    </div>
    <div class="content">
      <p>Cher·e ${nomineeName},</p>
      <p>J’espère que ce message vous trouve en pleine forme.</p>
      <p>Je vous écris car vous avez été récemment nommé·e pour le programme <strong>Adinkra Fellowship 2026</strong> — une initiative unique qui célèbre et connecte les leaders émergents noirs de 40 ans et moins, en provenance de la diaspora et de l’Afrique.</p>
      
      <p>Chaque année, le programme sélectionne 20 personnalités d’exception — 10 d’Afrique et 10 de la diaspora — pour un parcours de leadership transformateur, incluant deux immersions culturelles en Afrique et/ou dans un pays de la diaspora. C’est une opportunité rare d’élargir votre réseau, d’explorer votre héritage, et de contribuer à façonner l’avenir du leadership noir à l’échelle mondiale.</p>
      <p>
        <strong>🔗 Postulez avant le 3 juillet :</strong><br />
        <a href="https://adinkrafellowship.com/apply.html">https://adinkrafellowship.com/apply.html</a>
      </p>
      <p>Et si jamais vous ne pouviez pas postuler cette fois-ci, n’hésitez pas à transmettre cette opportunité à une personne exceptionnelle de votre entourage.</p>
      <p>Nous bâtissons une communauté audacieuse, brillante et sans frontières — et nous aimerions que vous en fassiez partie.</p>
      
      <p>Bien cordialement,<br>
      L'Équipe de l’Adinkra Fellowship</p>
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
