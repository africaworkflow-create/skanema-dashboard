export const metadata = {
  title      : 'Conditions générales de vente | Skanema',
  description : 'Conditions générales de vente et politique tarifaire de Skanema.',
}

export default function CGV() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-5 py-16">
        <a href="/" className="text-sm text-gray-400 hover:text-gray-600 mb-8 inline-block">← Retour</a>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Conditions générales de vente</h1>
        <p className="text-sm text-gray-400 mb-10">Dernière mise à jour : juin 2026</p>

        <div className="space-y-8 text-sm text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">1. Vendeur</h2>
            <div className="bg-gray-50 rounded-xl p-5 space-y-1.5">
              <p><span className="text-gray-500">Société :</span> TERYAT SUARL</p>
              <p><span className="text-gray-500">NINEA :</span> 012949957</p>
              <p><span className="text-gray-500">RC :</span> SN DKR 2026 B 12120</p>
              <p><span className="text-gray-500">Adresse :</span> Nord Foire Diamalaye III, Villa N°238, Dakar, Sénégal</p>
              <p><span className="text-gray-500">Email :</span> <a href="mailto:contact@skanema.com" className="text-gray-900 underline">contact@skanema.com</a></p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">2. Offres et tarifs</h2>
            <p className="mb-4">Skanema propose les abonnements mensuels suivants, payables en FCFA via Wave :</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-3 border border-gray-200 font-medium text-gray-900">Plan</th>
                    <th className="text-left p-3 border border-gray-200 font-medium text-gray-900">Prix mensuel</th>
                    <th className="text-left p-3 border border-gray-200 font-medium text-gray-900">Plats</th>
                    <th className="text-left p-3 border border-gray-200 font-medium text-gray-900">Zones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 border border-gray-200">Basic</td>
                    <td className="p-3 border border-gray-200 font-medium">15 000 FCFA</td>
                    <td className="p-3 border border-gray-200">10 plats</td>
                    <td className="p-3 border border-gray-200">1 zone</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-3 border border-gray-200">Pro</td>
                    <td className="p-3 border border-gray-200 font-medium">35 000 FCFA</td>
                    <td className="p-3 border border-gray-200">25 plats</td>
                    <td className="p-3 border border-gray-200">3 zones</td>
                  </tr>
                  <tr>
                    <td className="p-3 border border-gray-200">Premium</td>
                    <td className="p-3 border border-gray-200 font-medium">75 000 FCFA</td>
                    <td className="p-3 border border-gray-200">Illimité</td>
                    <td className="p-3 border border-gray-200">Illimité</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-gray-500">Les tarifs sont exprimés en Francs CFA (XOF) toutes taxes comprises. TERYAT SUARL se réserve le droit de modifier ses tarifs avec un préavis de 30 jours.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">3. Essai gratuit</h2>
            <p>Tout nouveau compte bénéficie d'une période d'essai gratuite de 14 jours sans engagement et sans nécessité de renseigner un moyen de paiement. À l'issue de cette période, un abonnement payant est requis pour continuer à utiliser le service.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">4. Commande et paiement</h2>
            <p className="mb-3">Le paiement de l'abonnement s'effectue via Wave. En souscrivant, vous autorisez TERYAT SUARL à prélever le montant correspondant à votre plan. L'abonnement est activé dès réception du paiement confirmé.</p>
            <p>Les abonnements sont renouvelés automatiquement chaque mois à la date anniversaire de souscription. Un rappel de renouvellement est envoyé 2 jours avant l'échéance.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">5. Politique de remboursement</h2>
            <p className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-amber-800">Aucun remboursement ne sera effectué pour les abonnements déjà payés, quelle que soit la date de résiliation au cours de la période. La résiliation prend effet à la fin de la période d'abonnement en cours.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">6. Résiliation</h2>
            <p>L'abonné peut résilier son abonnement à tout moment en contactant le support Skanema. La résiliation prend effet à la fin de la période mensuelle en cours. Aucun remboursement pro-rata ne sera accordé.</p>
            <p className="mt-2">En cas de manquement grave aux CGU, TERYAT SUARL se réserve le droit de suspendre ou résilier le compte sans préavis ni remboursement.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">7. Suspension de service</h2>
            <p>En cas de non-paiement à l'échéance, le service sera suspendu. Le compte et les données sont conservés pendant 30 jours après la suspension. Passé ce délai, le compte peut être définitivement supprimé.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">8. Droit applicable</h2>
            <p>Les présentes CGV sont soumises au droit sénégalais. Tout litige relatif à leur interprétation ou exécution relève de la compétence exclusive des tribunaux de Dakar, Sénégal.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">9. Contact</h2>
            <p>Pour toute question relative à votre abonnement : <a href="mailto:contact@skanema.com" className="text-gray-900 underline">contact@skanema.com</a></p>
          </section>

        </div>
      </div>
    </div>
  )
}
