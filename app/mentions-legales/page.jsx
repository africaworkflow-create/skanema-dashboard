export const metadata = {
  title      : 'Mentions légales | Skanema',
  description: 'Mentions légales de Skanema, une solution TERYAT SUARL.',
}

export default function MentionsLegales() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-5 py-16">
        <a href="/" className="text-sm text-gray-400 hover:text-gray-600 mb-8 inline-block">← Retour</a>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Mentions légales</h1>
        <p className="text-sm text-gray-400 mb-10">Dernière mise à jour : juin 2026</p>

        <div className="space-y-8 text-sm text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">Éditeur du site</h2>
            <div className="bg-gray-50 rounded-xl p-5 space-y-1.5">
              <p><span className="text-gray-500">Raison sociale :</span> TERYAT SUARL</p>
              <p><span className="text-gray-500">Forme juridique :</span> Société Unipersonnelle à Responsabilité Limitée (SUARL)</p>
              <p><span className="text-gray-500">NINEA :</span> 012949957</p>
              <p><span className="text-gray-500">Registre de commerce :</span> SN DKR 2026 B 12120</p>
              <p><span className="text-gray-500">Siège social :</span> Nord Foire Diamalaye III, Villa N°238, Dakar, Sénégal</p>
              <p><span className="text-gray-500">Représentant légal :</span> Le Gérant</p>
              <p><span className="text-gray-500">Email :</span> <a href="mailto:contact@skanema.com" className="text-gray-900 underline">contact@skanema.com</a></p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">Hébergement</h2>
            <div className="bg-gray-50 rounded-xl p-5 space-y-1.5">
              <p><span className="text-gray-500">Frontend (skanema.com) :</span> Vercel Inc. — 340 Pine Street, Suite 701, San Francisco, CA 94104, USA</p>
              <p><span className="text-gray-500">Backend (api.skanema.com) :</span> Railway Corporation — San Francisco, CA, USA</p>
              <p><span className="text-gray-500">Base de données :</span> MongoDB Atlas — MongoDB Inc., New York, USA</p>
              <p><span className="text-gray-500">Nom de domaine :</span> OVH SAS — 2 rue Kellermann, 59100 Roubaix, France</p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">Propriété intellectuelle</h2>
            <p>L'ensemble des contenus présents sur le site skanema.com (textes, images, logos, code source) sont la propriété exclusive de TERYAT SUARL et sont protégés par les lois applicables en matière de propriété intellectuelle. Toute reproduction, même partielle, est interdite sans autorisation préalable écrite.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">Responsabilité</h2>
            <p>TERYAT SUARL s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur ce site. Toutefois, elle ne peut garantir l'exactitude, la complétude ou l'actualité des informations. L'utilisation des informations et contenus disponibles sur ce site se fait sous l'entière responsabilité de l'utilisateur.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">Contact</h2>
            <p>Pour toute question relative aux présentes mentions légales, vous pouvez nous contacter à l'adresse suivante : <a href="mailto:contact@skanema.com" className="text-gray-900 underline">contact@skanema.com</a></p>
          </section>

        </div>
      </div>
    </div>
  )
}
