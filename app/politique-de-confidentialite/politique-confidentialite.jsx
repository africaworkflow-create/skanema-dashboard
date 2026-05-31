export const metadata = {
  title      : 'Politique de confidentialité | Skanema',
  description: 'Politique de confidentialité et protection des données personnelles de Skanema.',
}

export default function PolitiqueConfidentialite() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-5 py-16">
        <a href="/" className="text-sm text-gray-400 hover:text-gray-600 mb-8 inline-block">← Retour</a>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Politique de confidentialité</h1>
        <p className="text-sm text-gray-400 mb-10">Dernière mise à jour : juin 2026</p>

        <div className="space-y-8 text-sm text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">1. Responsable du traitement</h2>
            <p>TERYAT SUARL, éditeur de la plateforme Skanema, est responsable du traitement de vos données personnelles. Contact : <a href="mailto:contact@skanema.com" className="text-gray-900 underline">contact@skanema.com</a></p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">2. Données collectées</h2>
            <div className="space-y-4">
              <div>
                <p className="font-medium text-gray-800 mb-2">Données des restaurants (professionnels) :</p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 ml-2">
                  <li>Nom du restaurant, adresse, type de cuisine</li>
                  <li>Adresse email et mot de passe (hashé)</li>
                  <li>Numéro de téléphone professionnel</li>
                  <li>Coordonnées GPS du restaurant</li>
                  <li>Informations de paiement Wave (clé API, chiffrée)</li>
                  <li>Photo de couverture et images des plats</li>
                  <li>Données de commandes reçues</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-gray-800 mb-2">Données des clients finaux (via WhatsApp) :</p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 ml-2">
                  <li>Numéro de téléphone WhatsApp</li>
                  <li>Localisation GPS partagée lors de la commande</li>
                  <li>Historique des commandes passées</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">3. Finalités du traitement</h2>
            <ul className="list-disc list-inside space-y-1 text-gray-600 ml-2">
              <li>Fourniture du service de commande en ligne via WhatsApp</li>
              <li>Gestion des comptes restaurants et authentification</li>
              <li>Traitement et suivi des commandes</li>
              <li>Calcul des frais de livraison selon la localisation</li>
              <li>Envoi de notifications WhatsApp liées aux commandes</li>
              <li>Facturation et gestion des abonnements</li>
              <li>Amélioration du service et statistiques d'usage</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">4. Base légale</h2>
            <p>Le traitement de vos données repose sur l'exécution du contrat (CGU/CGV acceptées lors de l'inscription) et sur l'intérêt légitime de TERYAT SUARL à améliorer ses services.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">5. Durée de conservation</h2>
            <div className="bg-gray-50 rounded-xl p-5 space-y-2">
              <p><span className="text-gray-500">Données de compte :</span> Durée de l'abonnement + 3 ans après résiliation</p>
              <p><span className="text-gray-500">Données de commandes :</span> 5 ans (obligations comptables)</p>
              <p><span className="text-gray-500">Sessions WhatsApp :</span> 30 jours d'inactivité puis suppression automatique</p>
              <p><span className="text-gray-500">Logs techniques :</span> 90 jours</p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">6. Partage des données</h2>
            <p className="mb-3">Vos données ne sont jamais vendues à des tiers. Elles peuvent être partagées avec :</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600 ml-2">
              <li><strong>Meta Platforms</strong> — pour le service WhatsApp Business API</li>
              <li><strong>Wave</strong> — pour le traitement des paiements</li>
              <li><strong>Cloudinary</strong> — pour le stockage des images</li>
              <li><strong>MongoDB Atlas</strong> — pour le stockage des données</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">7. Vos droits</h2>
            <p className="mb-3">Conformément aux lois applicables, vous disposez des droits suivants :</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600 ml-2">
              <li>Droit d'accès à vos données</li>
              <li>Droit de rectification</li>
              <li>Droit à l'effacement (droit à l'oubli)</li>
              <li>Droit à la portabilité</li>
              <li>Droit d'opposition au traitement</li>
            </ul>
            <p className="mt-3">Pour exercer ces droits : <a href="mailto:contact@skanema.com" className="text-gray-900 underline">contact@skanema.com</a></p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">8. Sécurité</h2>
            <p>TERYAT SUARL met en œuvre les mesures techniques et organisationnelles appropriées pour protéger vos données : chiffrement des mots de passe (bcrypt), communications HTTPS, accès restreints aux données, tokens JWT pour l'authentification, rate limiting sur les API.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">9. Cookies</h2>
            <p>Le site skanema.com utilise uniquement des cookies techniques nécessaires au fonctionnement du service (authentification, session). Aucun cookie publicitaire ou de tracking tiers n'est utilisé.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">10. Contact</h2>
            <p>Pour toute question relative à la protection de vos données : <a href="mailto:contact@skanema.com" className="text-gray-900 underline">contact@skanema.com</a></p>
          </section>

        </div>
      </div>
    </div>
  )
}
