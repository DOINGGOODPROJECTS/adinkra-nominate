import NominationForm from "@/components/nomination-form"

export default function Home() {
  return (
    <main className="min-h-screen bg-customblue py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-black mb-4">Adinkra Nominate</h1>
        </div>
        <div className="bg-white-1 shadow-xl rounded-lg p-6 md:p-10">
          <NominationForm />
        </div>
      </div>
    </main>
  )
}
