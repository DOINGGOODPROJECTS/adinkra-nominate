"use client"

import { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox" // Ajout du composant Checkbox
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { countries } from "@/lib/countries"

// Schéma de validation pour le formulaire
const nomineeSchema = z.object({
  fullName: z.string().min(2, {
    message: "Le nom complet doit contenir au moins 2 caractères.",
  }),
  email: z.string().email({
    message: "Veuillez entrer une adresse email valide.",
  }),
  country: z.string().min(1, {
    message: "Veuillez sélectionner un pays.",
  }),
  isUnder40: z.enum(["yes", "no"], {
    required_error: "Veuillez indiquer si le candidat a 40 ans ou moins.",
  }),
  whyStrong: z
    .string()
    .min(10, {
      message: "Veuillez expliquer pourquoi le candidat est un bon choix (minimum 10 caractères).",
    })
    .max(1000, {
      message: "La description ne doit pas dépasser 1000 caractères (environ 200 mots).",
    }),
})

const formSchema = z.object({
  nominatorFullName: z.string().min(2, {
    message: "Le nom complet doit contenir au moins 2 caractères.",
  }),
  nominatorEmail: z.string().email({
    message: "Veuillez entrer une adresse email valide.",
  }),
  relationship: z.string().min(2, {
    message: "Veuillez préciser votre relation avec le candidat.",
  }),
  nominees: z.array(nomineeSchema).min(1, {
    message: "Veuillez ajouter au moins un candidat.",
  }),
  joinRecommenders: z.boolean().optional(), // Nouveau champ pour la case à cocher
})

type FormValues = z.infer<typeof formSchema>

export default function NominationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Initialiser le formulaire avec react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nominatorFullName: "",
      nominatorEmail: "",
      relationship: "",
      nominees: [
        {
          fullName: "",
          email: "",
          country: "",
          isUnder40: "yes",
          whyStrong: "",
        },
      ],
      joinRecommenders: false, // Valeur par défaut pour la case à cocher
    },
  })

  // Configuration pour les champs de tableau (nominees)
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "nominees",
  })

  // Gérer la soumission du formulaire
  async function onSubmit(data: FormValues) {
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/submit-nomination", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Une erreur est survenue lors de la soumission")
      }

      toast({
        title: "Nomination soumise avec succès",
        description: "Un email a été envoyé à chaque candidat nominé.",
      })

      // Réinitialiser le formulaire
      form.reset({
        nominatorFullName: "",
        nominatorEmail: "",
        relationship: "",
        nominees: [
          {
            fullName: "",
            email: "",
            country: "",
            isUnder40: "yes",
            whyStrong: "",
          },
        ],
        joinRecommenders: false, // Réinitialiser la case à cocher
      })
    } catch (error) {
      console.error("Erreur lors de la soumission:", error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la soumission du formulaire. Veuillez réessayer.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-black">
            Nominator Information / Informations sur le Nominant / Informações do Nominador
          </h2>

          <FormField
            control={form.control}
            name="nominatorFullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name / Nom et Prénoms / Nome Completo <span className="text-red-0">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nominatorEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address / Adresse e-mail / Endereço de Email <span className="text-red-0">*</span></FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john.doe@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="relationship"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Relationship to Nominee / Relation avec le Candidat / Relação com o Nomeado <span className="text-red-0">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Colleague, Mentor, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-black-0">
              Nominee Information / Informations sur le Candidat / Informações do Nomeado
            </h2>
            {fields.length > 1 && (
              <p className="text-sm text-amber-600">{fields.length} nominees / candidats / nomeados</p>
            )}
          </div>

          {fields.map((field, index) => (
            <Card key={field.id} className="border-black-0">
              <CardContent className="pt-6">
                {fields.length > 1 && (
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Nominee {index + 1}</h3>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                )}

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name={`nominees.${index}.fullName`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name / Nom et Prénoms / Nome Completo <span className="text-red-0">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="Jane Smith" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`nominees.${index}.email`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address / Adresse e-mail / Endereço de Email <span className="text-red-0">*</span></FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="jane.smith@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`nominees.${index}.country`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country of Residence / Pays de Résidence / País de Residência <span className="text-red-0">*</span></FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-[200px]">
                            {countries.map((country) => (
                              <SelectItem key={country.code} value={country.name}>
                                {country.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`nominees.${index}.isUnder40`}
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>
                          Age (Must be 40 or under as of application deadline) / Âge (Doit être agé(e) de 40 ans ou moins à la
                          date limite de candidature) / Idade (Deve ter 40 anos ou menos até o prazo de inscrição) <span className="text-red-0">*</span>
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex space-x-4"
                          >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="yes" />
                              </FormControl>
                              <FormLabel className="font-normal">Yes / Oui / Sim</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="no" />
                              </FormControl>
                              <FormLabel className="font-normal">No / Non / Não</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`nominees.${index}.whyStrong`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Why the Nominee is a Strong Candidate (200 words max) / Pourquoi le Candidat est un Bon Choix
                          (200 mots maximum) / Por que o Nomeado é um Forte Candidato (200 palavras no máximo) <span className="text-red-0">*</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Please describe why this nominee would be a good fit for the Adinkra Fellowship..."
                            className="min-h-[150px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>{field.value.length}/1000 caractères</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({
                fullName: "",
                email: "",
                country: "",
                isUnder40: "yes",
                whyStrong: "",
              })
            }
            className="w-full border-dashed border-black-0 hover:border-black-0 hover:bg-white-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Another Nominee / Ajouter un Candidat / Adicionar Nomeado
          </Button>
        </div>

        {/* Nouvelle case à cocher */}
        <FormField
          control={form.control}
          name="joinRecommenders"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>
                Please tick here if you would like to join our circle of recommenders and help nominate outstanding individuals for future editions of the Adinkra. <br className="mt-2" /> Veuillez cocher ici si vous souhaitez rejoindre notre cercle de recommandataires et contribuer à la nomination de personnes exceptionnelles pour les prochaines éditions du Adinkra Fellowship. <br className="mt-2" /> Por favor, marque aqui se desejar juntar-se ao nosso círculo de recomendadores e ajudar a nomear pessoas excecionais para as futuras edições do Adinkra Fellowship.
              </FormLabel>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full bg-black-0 hover:bg-black-0" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting / Soumission en cours / Enviando...
            </>
          ) : (
            "Submit / Soumettre / Enviar"
          )}
        </Button>
      </form>
    </Form>
  )
}