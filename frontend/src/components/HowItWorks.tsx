import { FileEdit, Clock, CheckCircle2 } from 'lucide-react'

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-navy mb-4">
            Comment ça marche
          </h2>
          <p className="text-lg text-gray-600">
            Un processus simple et transparent pour rétablir votre connexion rapidement
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          <StepCard
            number="1"
            icon={<FileEdit className="w-8 h-8" />}
            title="Créez un SOS"
            description="Remplissez le formulaire et autorisez une empreinte bancaire de 50€. Aucun débit immédiat."
          />
          <StepCard
            number="2"
            icon={<Clock className="w-8 h-8" />}
            title="Technicien en 2h"
            description="Nous assignons le meilleur technicien disponible qui arrive chez vous en 2 heures maximum."
          />
          <StepCard
            number="3"
            icon={<CheckCircle2 className="w-8 h-8" />}
            title="Payez uniquement si c'est réparé"
            description="Si la connexion est rétablie, les 50€ sont débités. Sinon, l'empreinte est libérée."
          />
        </div>

        {/* Satisfaction Guarantee */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-blue-electric rounded-2xl flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-navy mb-3">
                  Garantie de Satisfaction
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Notre engagement est simple : vous ne payez que si votre problème est résolu. Si le
                  technicien ne parvient pas à rétablir votre connexion, aucun montant ne sera débité et
                  la pré-autorisation sera automatiquement annulée.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

interface StepCardProps {
  number: string
  icon: React.ReactNode
  title: string
  description: string
}

function StepCard({ number, icon, title, description }: StepCardProps) {
  return (
    <div className="relative bg-white rounded-2xl p-8 card-shadow card-hover">
      <div className="absolute -top-4 -left-4 w-12 h-12 bg-blue-electric rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
        {number}
      </div>
      <div className="text-navy mb-4 mt-2">{icon}</div>
      <h3 className="text-xl font-bold text-navy mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  )
}

