export const metadata = {
  title      : "Conditions générales d'utilisation | Skanema",
  description : "Conditions générales d'utilisation de la plateforme Skanema.",
}

export default function CGU() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-5 py-16">
        <a href="/" className="text-sm text-gray-400 hover:text-gray-600 mb-8 inline-block">← Retour</a>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{"Conditions générales d'utilisation"}</h1>
        <p className="text-sm text-gray-400 mb-10">Dernière mise à jour : juin 2026</p>

        <div className="space-y-8 text-sm text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">1. Présentation</h2>
            <p>Skanema est une plateforme SaaS éditée par TERYAT SUARL permettant aux restaurants de recevoir et gérer leurs commandes via WhatsApp. En accédant à la plateforme, vous acceptez sans réserve les présentes conditions.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">2. Accès au service</h2>
            <p className="mb-3">L'accès à Skanema est réservé aux professionnels (restaurants, commerces de restauration) disposant d'un compte valide. Lors de l'inscription, vous vous engagez à :</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600 ml-2">
              <li>Fournir des informations exactes et à jour</li>
              <li>Maintenir la confidentialité de vos identifiants</li>
              <li>Notifier immédiatement tout accès non autorisé</li>
              <li>Ne pas partager votre compte avec des tiers</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">3. Utilisation du service</h2>
            <p className="mb-3">Vous vous engagez à utiliser Skanema exclusivement pour des activités légales et conformes aux réglementations en vigueur. Il est notamment interdit de :</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600 ml-2">
              <li>Utiliser le service à des fins frauduleuses</li>
              <li>Publier des contenus illicites, trompeurs ou offensants</li>
              <li>Perturber le fonctionnement de la plateforme</li>
              <li>Tenter d'accéder aux données d'autres restaurants</li>
              <li>Effectuer de la rétro-ingénierie sur le code de la plateforme</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">4. Contenu utilisateur</h2>
            <p>Vous êtes seul responsable des contenus publiés sur votre espace (nom des plats, descriptions, photos, prix). TERYAT SUARL se réserve le droit de supprimer tout contenu manifestement illicite sans préavis.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">5. Disponibilité du service</h2>
            <p>TERYAT SUARL s'efforce d'assurer une disponibilité optimale de la plateforme (objectif 99,5% de disponibilité mensuelle). Des interruptions peuvent survenir pour maintenance ou en cas de force majeure. TERYAT SUARL ne saurait être tenue responsable des interruptions indépendantes de sa volonté.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">6. Propriété intellectuelle</h2>
            <p>La plateforme Skanema, son code source, son design et ses fonctionnalités sont la propriété exclusive de TERYAT SUARL. L'abonnement vous confère un droit d'usage limité, non exclusif et non transférable.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">7. Résiliation</h2>
            <p>Vous pouvez résilier votre abonnement à tout moment depuis votre espace ou en contactant le support. La résiliation prend effet à la fin de la période d'abonnement en cours. Aucun remboursement ne sera effectué pour la période restante.</p>
            <p className="mt-2">TERYAT SUARL se réserve le droit de suspendre ou résilier votre compte en cas de violation des présentes CGU, sans préavis ni remboursement.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">8. Limitation de responsabilité</h2>
            <p>TERYAT SUARL ne saurait être tenue responsable des pertes de revenus liées à une interruption de service, des litiges entre restaurants et clients finaux, ou de tout dommage indirect résultant de l'utilisation de la plateforme.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">9. Modifications</h2>
            <p>TERYAT SUARL se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront notifiés par email au moins 15 jours avant l'entrée en vigueur des modifications.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">10. Droit applicable</h2>
            <p>Les présentes CGU sont soumises au droit sénégalais. Tout litige sera soumis à la compétence exclusive des tribunaux de Dakar, Sénégal.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">11. Contact</h2>
            <p><a href="mailto:contact@skanema.com" className="text-gray-900 underline">contact@skanema.com</a></p>
          </section>

        </div>
      </div>
    </div>
  )
}
