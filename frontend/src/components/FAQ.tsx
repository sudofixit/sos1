import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface FAQItemProps {
  question: string
  answer: string
}

function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-navy text-lg pr-4">{question}</span>
        <ChevronDown
          className={`w-5 h-5 text-blue-electric flex-shrink-0 transition-transform ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-6 pb-5 text-gray-600 leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  )
}

export function FAQ() {
  const faqs = [
    {
      question: 'Vais-je être débité immédiatement ?',
      answer:
        'Non. Nous prenons uniquement une pré-autorisation (empreinte bancaire) de 50€ qui bloque temporairement ce montant sur votre carte. Vous ne serez débité que si le technicien parvient à rétablir votre connexion. Si la réparation échoue, l\'empreinte est automatiquement libérée sous 7 jours maximum.',
    },
    {
      question: 'Et si la réparation échoue ?',
      answer:
        'Si notre technicien ne parvient pas à résoudre votre problème de connexion, vous ne payez rien. La pré-autorisation de 50€ sera annulée et les fonds seront automatiquement libérés sur votre compte bancaire. Notre garantie de satisfaction est totale.',
    },
    {
      question: 'Quelles zones sont desservies ?',
      answer:
        'Nous intervenons actuellement dans toute la région Paris & Île-de-France, incluant Paris intra-muros et les départements 77, 78, 91, 92, 93, 94 et 95. Notre réseau de techniciens qualifiés permet une intervention rapide dans toute la zone couverte.',
    },
    {
      question: 'Combien de temps dure l\'intervention ?',
      answer:
        'La durée d\'intervention varie selon la nature du problème, généralement entre 30 minutes et 2 heures. Le technicien arrivera chez vous dans les 2 heures suivant votre demande et diagnostiquera rapidement la panne pour la résoudre efficacement.',
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-navy mb-4">
            Questions Fréquentes
          </h2>
          <p className="text-lg text-gray-600">
            Tout ce que vous devez savoir sur notre service
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  )
}

