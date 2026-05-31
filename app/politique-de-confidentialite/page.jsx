export const metadata = {
  title      : 'Politique de confidentialité | Skanema',
  description: 'Politique de confidentialité et protection des données personnelles de Skanema.',
}

const Section = ({ title, children }) => (
  <section>
    <h2 style={{ fontSize:'11px', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.1em', color:'#888', margin:'0 0 20px' }}>{title}</h2>
    {children}
  </section>
)

const Block = ({ children }) => (
  <div style={{ background:'#f9f9f9', border:'0.5px solid #e5e5e5', borderRadius:'12px', padding:'20px 24px' }}>
    {children}
  </div>
)

const Item = ({ label, value }) => (
  <div style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'0.5px solid #e5e5e5', gap:'24px' }}>
    <span style={{ fontSize:'13px', color:'#888', flexShrink:0 }}>{label}</span>
    <span style={{ fontSize:'13px', color:'#333', fontWeight:500, textAlign:'right' }}>{value}</span>
  </div>
)

export default function PolitiqueConfidentialite() {
  return (
    <div style={{ maxWidth:'720px', margin:'0 auto', padding:'48px 24px', fontFamily:'system-ui,sans-serif' }}>

      <a href="/" style={{ fontSize:'13px', color:'#888', textDecoration:'none', display:'inline-flex', alignItems:'center', gap:'6px', marginBottom:'40px' }}>
        ← Retour
      </a>

      <div style={{ borderBottom:'0.5px solid #e5e5e5', paddingBottom:'32px', marginBottom:'48px' }}>
        <p style={{ fontSize:'12px', fontWeight:500, color:'#888', textTransform:'uppercase', letterSpacing:'0.08em', margin:'0 0 12px' }}>Légal</p>
        <h1 style={{ fontSize:'32px', fontWeight:500, color:'#111', margin:'0 0 8px', lineHeight:1.2 }}>Politique de confidentialité</h1>
        <p style={{ fontSize:'14px', color:'#888', margin:0 }}>Dernière mise à jour : juin 2026</p>
      </div>

      <div style={{ display:'grid', gap:'48px' }}>

        <Section title="Responsable du traitement">
          <p style={{ fontSize:'15px', color:'#333', lineHeight:1.75, margin:0 }}>
            TERYAT SUARL, éditeur de la plateforme Skanema, est responsable du traitement de vos données personnelles.
            Contact : <a href="mailto:contact@skanema.com" style={{ color:'#111', fontWeight:500, textDecoration:'none' }}>contact@skanema.com</a>
          </p>
        </Section>

        <Section title="Données collectées">
          <div style={{ display:'grid', gap:'12px' }}>
            <Block>
              <p style={{ fontSize:'12px', fontWeight:500, color:'#888', textTransform:'uppercase', letterSpacing:'0.06em', margin:'0 0 14px' }}>Restaurants (professionnels)</p>
              {['Nom, adresse et type de cuisine', 'Adresse email et mot de passe (hashé bcrypt)', 'Numéro de téléphone professionnel', 'Coordonnées GPS du restaurant', 'Informations de paiement Wave (chiffrées)', 'Photos et images des plats', 'Données de commandes reçues'].map((item, i, arr) => (
                <div key={i} style={{ fontSize:'14px', color:'#333', padding:'8px 0', borderBottom: i < arr.length-1 ? '0.5px solid #e5e5e5' : 'none' }}>{item}</div>
              ))}
            </Block>
            <Block>
              <p style={{ fontSize:'12px', fontWeight:500, color:'#888', textTransform:'uppercase', letterSpacing:'0.06em', margin:'0 0 14px' }}>Clients finaux (via WhatsApp)</p>
              {['Numéro de téléphone WhatsApp', 'Localisation GPS partagée lors de la commande', 'Historique des commandes'].map((item, i, arr) => (
                <div key={i} style={{ fontSize:'14px', color:'#333', padding:'8px 0', borderBottom: i < arr.length-1 ? '0.5px solid #e5e5e5' : 'none' }}>{item}</div>
              ))}
            </Block>
          </div>
        </Section>

        <Section title="Finalités du traitement">
          <Block>
            {['Fourniture du service de commande en ligne via WhatsApp', 'Gestion des comptes restaurants et authentification', 'Traitement et suivi des commandes', 'Calcul des frais de livraison selon la localisation', 'Envoi de notifications WhatsApp liées aux commandes', 'Facturation et gestion des abonnements', 'Amélioration du service et statistiques d\'usage'].map((item, i, arr) => (
              <div key={i} style={{ fontSize:'14px', color:'#333', padding:'8px 0', borderBottom: i < arr.length-1 ? '0.5px solid #e5e5e5' : 'none' }}>{item}</div>
            ))}
          </Block>
        </Section>

        <Section title="Durée de conservation">
          <div style={{ display:'grid', gap:'1px', background:'#e5e5e5', border:'0.5px solid #e5e5e5', borderRadius:'12px', overflow:'hidden' }}>
            {[
              ['Données de compte',    'Durée de l\'abonnement + 3 ans après résiliation'],
              ['Données de commandes', '5 ans (obligations comptables)'],
              ['Sessions WhatsApp',    '30 jours d\'inactivité puis suppression automatique'],
              ['Logs techniques',      '90 jours'],
            ].map(([label, value]) => (
              <Item key={label} label={label} value={value} />
            ))}
          </div>
        </Section>

        <Section title="Partage des données">
          <p style={{ fontSize:'15px', color:'#333', lineHeight:1.75, margin:'0 0 16px' }}>
            Vos données ne sont jamais vendues à des tiers. Elles peuvent être partagées uniquement avec nos prestataires techniques dans le cadre strict de la fourniture du service.
          </p>
          <div style={{ display:'grid', gap:'1px', background:'#e5e5e5', border:'0.5px solid #e5e5e5', borderRadius:'12px', overflow:'hidden' }}>
            {[
              ['Meta Platforms', 'Service WhatsApp Business API'],
              ['Wave',           'Traitement des paiements'],
              ['Cloudinary',     'Stockage des images'],
              ['MongoDB Atlas',  'Stockage des données'],
              ['Railway / Vercel','Infrastructure d\'hébergement'],
            ].map(([label, value]) => (
              <Item key={label} label={label} value={value} />
            ))}
          </div>
        </Section>

        <Section title="Vos droits">
          <p style={{ fontSize:'15px', color:'#333', lineHeight:1.75, margin:'0 0 16px' }}>
            Conformément aux lois applicables, vous disposez d'un droit d'accès, de rectification, d'effacement, de portabilité et d'opposition au traitement de vos données personnelles.
          </p>
          <p style={{ fontSize:'15px', color:'#333', lineHeight:1.75, margin:0 }}>
            Pour exercer ces droits :{' '}
            <a href="mailto:contact@skanema.com" style={{ color:'#111', fontWeight:500, textDecoration:'none' }}>contact@skanema.com</a>
          </p>
        </Section>

        <Section title="Sécurité">
          <p style={{ fontSize:'15px', color:'#333', lineHeight:1.75, margin:0 }}>
            TERYAT SUARL met en œuvre les mesures techniques appropriées pour protéger vos données : chiffrement des mots de passe (bcrypt), communications HTTPS, authentification par tokens JWT, rate limiting sur les API et accès restreints aux bases de données.
          </p>
        </Section>

        <Section title="Cookies">
          <p style={{ fontSize:'15px', color:'#333', lineHeight:1.75, margin:0 }}>
            Le site skanema.com utilise uniquement des cookies techniques nécessaires au fonctionnement du service (authentification, session). Aucun cookie publicitaire ou de tracking tiers n'est utilisé.
          </p>
        </Section>

        <section style={{ borderTop:'0.5px solid #e5e5e5', paddingTop:'32px' }}>
          <p style={{ fontSize:'13px', color:'#888', margin:0 }}>
            Pour toute question :{' '}
            <a href="mailto:contact@skanema.com" style={{ color:'#111', fontWeight:500, textDecoration:'none' }}>contact@skanema.com</a>
          </p>
        </section>

      </div>
    </div>
  )
}
