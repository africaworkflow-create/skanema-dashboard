export const metadata = {
  title      : "Conditions générales d'utilisation | Skanema",
  description: "Conditions générales d'utilisation de la plateforme Skanema.",
}

const Section = ({ number, title, children }) => (
  <section style={{ display:'grid', gridTemplateColumns:'32px 1fr', gap:'0 24px' }}>
    <span style={{ fontSize:'13px', color:'#bbb', fontWeight:500, paddingTop:'2px' }}>{number}</span>
    <div>
      <h2 style={{ fontSize:'16px', fontWeight:500, color:'#111', margin:'0 0 16px' }}>{title}</h2>
      {children}
    </div>
  </section>
)

const Block = ({ items }) => (
  <div style={{ background:'#f9f9f9', border:'0.5px solid #e5e5e5', borderRadius:'12px', overflow:'hidden' }}>
    {items.map((item, i) => (
      <div key={i} style={{ fontSize:'14px', color:'#333', padding:'12px 20px', borderBottom: i < items.length-1 ? '0.5px solid #e5e5e5' : 'none' }}>
        {item}
      </div>
    ))}
  </div>
)

const P = ({ children }) => (
  <p style={{ fontSize:'15px', color:'#333', lineHeight:1.75, margin:0 }}>{children}</p>
)

export default function CGU() {
  return (
    <div style={{ maxWidth:'720px', margin:'0 auto', padding:'48px 24px', fontFamily:'system-ui,sans-serif' }}>

      <a href="/" style={{ fontSize:'13px', color:'#888', textDecoration:'none', display:'inline-flex', alignItems:'center', gap:'6px', marginBottom:'40px' }}>
        ← Retour
      </a>

      <div style={{ borderBottom:'0.5px solid #e5e5e5', paddingBottom:'32px', marginBottom:'48px' }}>
        <p style={{ fontSize:'12px', fontWeight:500, color:'#888', textTransform:'uppercase', letterSpacing:'0.08em', margin:'0 0 12px' }}>Légal</p>
        <h1 style={{ fontSize:'32px', fontWeight:500, color:'#111', margin:'0 0 8px', lineHeight:1.2 }}>{"Conditions générales d'utilisation"}</h1>
        <p style={{ fontSize:'14px', color:'#888', margin:0 }}>Dernière mise à jour : juin 2026</p>
      </div>

      <div style={{ display:'grid', gap:'40px' }}>

        <Section number="01" title="Présentation">
          <P>Skanema est une plateforme SaaS éditée par TERYAT SUARL permettant aux restaurants de recevoir et gérer leurs commandes via WhatsApp. En accédant à la plateforme, vous acceptez sans réserve les présentes conditions.</P>
        </Section>

        <Section number="02" title="Accès au service">
          <p style={{ fontSize:'15px', color:'#333', lineHeight:1.75, margin:'0 0 16px' }}>L'accès à Skanema est réservé aux professionnels disposant d'un compte valide. Lors de l'inscription, vous vous engagez à :</p>
          <Block items={['Fournir des informations exactes et à jour', 'Maintenir la confidentialité de vos identifiants', 'Notifier immédiatement tout accès non autorisé', 'Ne pas partager votre compte avec des tiers']} />
        </Section>

        <Section number="03" title="Utilisation du service">
          <p style={{ fontSize:'15px', color:'#333', lineHeight:1.75, margin:'0 0 16px' }}>Il est notamment interdit de :</p>
          <Block items={['Utiliser le service à des fins frauduleuses', 'Publier des contenus illicites, trompeurs ou offensants', 'Perturber le fonctionnement de la plateforme', "Tenter d'accéder aux données d'autres restaurants", 'Effectuer de la rétro-ingénierie sur le code de la plateforme']} />
        </Section>

        <Section number="04" title="Contenu utilisateur">
          <P>Vous êtes seul responsable des contenus publiés sur votre espace (plats, descriptions, photos, prix). TERYAT SUARL se réserve le droit de supprimer tout contenu manifestement illicite sans préavis.</P>
        </Section>

        <Section number="05" title="Disponibilité du service">
          <P>TERYAT SUARL s'efforce d'assurer une disponibilité optimale de la plateforme. Des interruptions peuvent survenir pour maintenance ou en cas de force majeure. TERYAT SUARL ne saurait être tenue responsable des interruptions indépendantes de sa volonté.</P>
        </Section>

        <Section number="06" title="Propriété intellectuelle">
          <P>La plateforme Skanema, son code source, son design et ses fonctionnalités sont la propriété exclusive de TERYAT SUARL. L'abonnement confère un droit d'usage limité, non exclusif et non transférable.</P>
        </Section>

        <Section number="07" title="Résiliation">
          <P>Vous pouvez résilier votre abonnement à tout moment en contactant le support. La résiliation prend effet à la fin de la période d'abonnement en cours. TERYAT SUARL se réserve le droit de suspendre tout compte en violation des présentes CGU.</P>
        </Section>

        <Section number="08" title="Limitation de responsabilité">
          <P>TERYAT SUARL ne saurait être tenue responsable des pertes de revenus liées à une interruption de service, des litiges entre restaurants et clients finaux, ou de tout dommage indirect résultant de l'utilisation de la plateforme.</P>
        </Section>

        <Section number="09" title="Modifications">
          <P>TERYAT SUARL se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront notifiés par email au moins 15 jours avant l'entrée en vigueur des modifications.</P>
        </Section>

        <Section number="10" title="Droit applicable">
          <P>Les présentes CGU sont soumises au droit sénégalais. Tout litige sera soumis à la compétence exclusive des tribunaux de Dakar, Sénégal.</P>
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
