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

// ID de ta Google Sheet
const SHEET_ID = "12mEVIV17730qIYOQkJXIn2SF3JGYCk2MXF14YgZwmcM"
const SHEET_NAME = "Nominations" // Assure-toi que ce nom existe dans ton document

// Authentification avec ton compte de service
const auth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
})

const sheets = google.sheets({ version: "v4", auth })

export async function countFilledRowsInColumnA(): Promise<number> {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A:A`, // Colonne A entière
    })

    const rows = response.data.values || []
    const filledRows = rows.filter(row => row[0] !== "").length

    console.log(`✅ Nombre de lignes remplies : ${filledRows}`)
    return (filledRows > 0 ? filledRows - 1 : 0)+1
  } catch (err) {
    console.error("❌ Erreur lors du comptage des lignes :", err)
    throw err
  }
}


// Fonction pour ajouter les données
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

  const count = await countFilledRowsInColumnA();

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A${count}`, // ✅
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
