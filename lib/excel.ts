import { google } from "googleapis"
import { JWT } from "google-auth-library"

// Type pour les données de nomination
export type NominationData = {
  nominatorFullName: string
  nominatorEmail: string
  relationship: string
  nominees: {
    fullName: string
    email: string
    country: string
    isUnder40: string
    whyStrong: string
  }[]
  submittedAt: Date
}

// ID de ta Google Sheet (extrait de l’URL)
const SHEET_ID = "12mEVIV17730qIYOQkJXIn2SF3JGYCk2MXF14YgZwmcM"
const SHEET_NAME = "Nominations" // Doit exister dans ton Google Sheet

// Création du client Google Auth avec un compte de service
const auth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
})

const sheets = google.sheets({ version: "v4", auth })

// Fonction pour ajouter une nomination à Google Sheets
export async function addNominationToGoogleSheet(data: NominationData) {
  const rows = data.nominees.map(nominee => [
    data.submittedAt.toISOString(),
    data.nominatorFullName,
    data.nominatorEmail,
    data.relationship,
    nominee.fullName,
    nominee.email,
    nominee.country,
    nominee.isUnder40,
    nominee.whyStrong,
  ])

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A1`,
      valueInputOption: "RAW",
      requestBody: {
        values: rows,
      },
    })
    console.log("✅ Données ajoutées à Google Sheets")
  } catch (err) {
    console.error("❌ Erreur lors de l'ajout à Google Sheets:", err)
    throw err
  }
}
