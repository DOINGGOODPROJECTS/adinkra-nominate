import { NextResponse } from "next/server"
import { addNominationToGoogleSheet } from "@/lib/excel"
import { sendEmail, generateNominationEmail } from "@/lib/email"

export async function POST(request: Request) {
  try {
    // Récupérer les données du formulaire
    const data = await request.json()

    // Ajouter la date de soumission
    const nominationData = {
      ...data,
      submittedAt: new Date(),
    }

    // Ajouter les données au fichier Excel
    await addNominationToGoogleSheet(nominationData)

    // Envoyer un email à chaque nominé
    for (const nominee of data.nominees) {
      const { text, html } = generateNominationEmail(nominee.fullName)

      await sendEmail({
        to: nominee.email,
        cc: data.nominatorEmail,
        subject: "You've Been Nominated for the Adinkra Fellowship!",
        text,
        html,
      })
    }

    // Retourner une réponse de succès
    return NextResponse.json({
      success: true,
      message: "Nomination submitted successfully",
    })
  } catch (error) {
    console.error("Error processing nomination:", error)

    // Retourner une réponse d'erreur
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while processing your nomination",
      },
      { status: 500 },
    )
  }
}
