import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Shield, Loader2 } from 'lucide-react'
import { createCheckoutSession } from '../services/api'

const formSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  phone: z.string().min(10, 'Numéro de téléphone invalide'),
  email: z.string().email('Email invalide'),
  address: z.string().min(5, 'Adresse invalide'),
  operator: z.string().min(1, 'Veuillez sélectionner un opérateur'),
  connectionType: z.string().min(1, 'Veuillez sélectionner un type de connexion'),
  delay: z.string().min(1, 'Veuillez sélectionner un délai'),
  details: z.string().min(10, 'Veuillez décrire le problème (min 10 caractères)'),
  consent: z.boolean().refine(val => val === true, {
    message: 'Vous devez accepter la pré-autorisation',
  }),
})

type FormData = z.infer<typeof formSchema>

export function SOSForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const session = await createCheckoutSession({
        name: data.name,
        phone: data.phone,
        email: data.email,
        address: data.address,
        operator: data.operator,
        connectionType: data.connectionType,
        delay: data.delay,
        details: data.details,
      })

      // Redirect to Stripe Checkout
      if (session.url) {
        window.location.href = session.url
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Une erreur est survenue. Veuillez réessayer.')
      setIsSubmitting(false)
    }
  }

  return (
    <section id="sos-form" className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy text-center mb-3">
              Créer un SOS
            </h2>
            <p className="text-gray-600 text-center mb-8">
              Remplissez le formulaire et un technicien arrivera dans les 2 heures
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-navy mb-2">
                  Nom complet
                </label>
                <input
                  {...register('name')}
                  type="text"
                  placeholder="Jean Dupont"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-electric focus:border-transparent outline-none transition"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-navy mb-2">
                    Téléphone
                  </label>
                  <input
                    {...register('phone')}
                    type="tel"
                    placeholder="06 12 34 56 78"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-electric focus:border-transparent outline-none transition"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-navy mb-2">
                    Email
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="jean@exemple.fr"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-electric focus:border-transparent outline-none transition"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-semibold text-navy mb-2">
                  Adresse d'intervention
                </label>
                <input
                  {...register('address')}
                  type="text"
                  placeholder="123 Rue de Rivoli, Paris 75001"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-electric focus:border-transparent outline-none transition"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                )}
              </div>

              {/* Operator & Connection Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-navy mb-2">
                    Opérateur internet
                  </label>
                  <select
                    {...register('operator')}
                    className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-electric focus:border-transparent outline-none transition bg-white appearance-none cursor-pointer"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                  >
                    <option value="">Sélectionner</option>
                    <option value="Orange">Orange</option>
                    <option value="Free">Free</option>
                    <option value="SFR">SFR</option>
                    <option value="Bouygues">Bouygues Telecom</option>
                    <option value="Autre">Autre</option>
                  </select>
                  {errors.operator && (
                    <p className="mt-1 text-sm text-red-600">{errors.operator.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-navy mb-2">
                    Type de connexion
                  </label>
                  <select
                    {...register('connectionType')}
                    className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-electric focus:border-transparent outline-none transition bg-white appearance-none cursor-pointer"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                  >
                    <option value="">Sélectionner</option>
                    <option value="Fibre">Fibre optique</option>
                    <option value="ADSL">ADSL</option>
                    <option value="4G/5G">Box 4G/5G</option>
                    <option value="Cable">Câble</option>
                  </select>
                  {errors.connectionType && (
                    <p className="mt-1 text-sm text-red-600">{errors.connectionType.message}</p>
                  )}
                </div>
              </div>

              {/* Delay */}
              <div>
                <label className="block text-sm font-semibold text-navy mb-2">
                  Délai souhaité
                </label>
                <select
                  {...register('delay')}
                  className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-electric focus:border-transparent outline-none transition bg-white appearance-none cursor-pointer"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                >
                  <option value="">Sélectionner</option>
                  <option value="Dans les 2 heures">Dans les 2 heures</option>
                  <option value="Aujourd'hui">Aujourd'hui</option>
                  <option value="Demain">Demain</option>
                </select>
                {errors.delay && (
                  <p className="mt-1 text-sm text-red-600">{errors.delay.message}</p>
                )}
              </div>

              {/* Problem Details */}
              <div>
                <label className="block text-sm font-semibold text-navy mb-2">
                  Détails du problème
                </label>
                <textarea
                  {...register('details')}
                  rows={4}
                  placeholder="Décrivez le problème que vous rencontrez..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-electric focus:border-transparent outline-none transition resize-none"
                />
                {errors.details && (
                  <p className="mt-1 text-sm text-red-600">{errors.details.message}</p>
                )}
              </div>

              {/* Consent Checkbox */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    {...register('consent')}
                    type="checkbox"
                    className="mt-1 w-5 h-5 text-blue-electric border-gray-300 rounded focus:ring-2 focus:ring-blue-electric"
                  />
                  <span className="text-sm text-gray-700 leading-relaxed">
                    J'autorise une pré-autorisation de 50€ via Stripe. Cette empreinte sera automatiquement
                    libérée si la connexion n'est pas rétablie. Je ne paie que si le problème est résolu.
                  </span>
                </label>
                {errors.consent && (
                  <p className="mt-2 text-sm text-red-600">{errors.consent.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-navy-dark text-white font-bold text-lg rounded-lg hover:bg-navy transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Redirection vers le paiement...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    Autoriser et créer l'SOS
                  </>
                )}
              </button>

              <p className="text-center text-sm text-gray-500 flex items-center justify-center gap-2">
                <Shield className="w-4 h-4 text-blue-electric" />
                Paiement sécurisé par Stripe — Vous ne payez que si c'est réparé
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

