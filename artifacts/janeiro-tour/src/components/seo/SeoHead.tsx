import { Helmet } from "react-helmet-async";

const SITE_URL = "https://www.janeirotour.com";
const DEFAULT_IMAGE = `${SITE_URL}/opengraph.jpg`;
const SITE_NAME = "Janeiro Tour & Travel";

const ORG_SCHEMA = {
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness", "TouristInformationCenter"],
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  alternateName: "Janeiro Tour",
  url: SITE_URL,
  logo: `${SITE_URL}/janeiro-logo.png`,
  image: DEFAULT_IMAGE,
  description:
    "Janeiro Tour & Travel is a Black-owned Afrotourism agency founded in Rio de Janeiro, Brazil. We offer premium cultural tours, private experiences, airport transfers and curated travel packages throughout Brazil.",
  foundingDate: "2014",
  founder: {
    "@type": "Person",
    name: "Dandara",
    jobTitle: "Founder & CEO",
    description: "Afro-Brazilian entrepreneur and tourism expert based in Rio de Janeiro",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Rio de Janeiro",
    addressRegion: "RJ",
    addressCountry: "BR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "-22.9068",
    longitude: "-43.1729",
  },
  telephone: "+5521965297618",
  email: "info@janeirotour.com",
  priceRange: "$$",
  currenciesAccepted: "USD, EUR, BRL, GBP, NOK",
  paymentAccepted: "Credit Card, Debit Card",
  openingHours: "Mo-Su 07:00-20:00",
  areaServed: [
    "Rio de Janeiro", "São Paulo", "Bahia", "Brazil",
  ],
  hasMap: "https://maps.google.com/?q=Rio+de+Janeiro,Brazil",
  sameAs: [
    "https://www.tripadvisor.com/Attraction_Review-g303488-d14760440-Reviews-Janeiro_Tour_Travel-State_of_Rio_de_Janeiro.html",
    "https://www.instagram.com/janeirotour",
    "https://www.facebook.com/janeirotour",
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5",
    reviewCount: "120",
    bestRating: "5",
    worstRating: "1",
  },
};

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface SeoHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  noIndex?: boolean;
  schemas?: object[];
  breadcrumbs?: BreadcrumbItem[];
  lang?: string;
  alternateUrls?: Record<string, string>;
}

function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

const HREFLANG_LOCALES: Record<string, string> = {
  en: "en",
  es: "es",
  pt: "pt-BR",
  fr: "fr",
  de: "de",
  no: "nb",
};

export function SeoHead({
  title,
  description,
  canonical,
  ogImage = DEFAULT_IMAGE,
  ogType = "website",
  noIndex = false,
  schemas = [],
  breadcrumbs,
  lang,
  alternateUrls,
}: SeoHeadProps) {
  const fullTitle = title
    ? `${title} | Janeiro Tour & Travel`
    : "Janeiro Tour & Travel — Premium Afrotourism in Rio de Janeiro";

  const metaDesc =
    description ||
    "Janeiro Tour & Travel — Black-owned Afrotourism agency offering premium cultural tours, private experiences and travel packages in Rio de Janeiro, Brazil.";

  const canonicalUrl = canonical
    ? canonical.startsWith("http") ? canonical : `${SITE_URL}${canonical}`
    : SITE_URL;

  const allSchemas = [ORG_SCHEMA, ...schemas];
  if (breadcrumbs && breadcrumbs.length > 0) {
    allSchemas.push(buildBreadcrumbSchema(breadcrumbs));
  }

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDesc} />
      <link rel="canonical" href={canonicalUrl} />
      {noIndex && <meta name="robots" content="noindex,nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content={lang === "pt" ? "pt_BR" : lang === "es" ? "es_ES" : lang === "de" ? "de_DE" : lang === "fr" ? "fr_FR" : "en_US"} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDesc} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@janeirotour" />

      {/* hreflang */}
      {alternateUrls
        ? Object.entries(alternateUrls).map(([l, url]) => (
            <link key={l} rel="alternate" hrefLang={HREFLANG_LOCALES[l] || l} href={url} />
          ))
        : Object.values(HREFLANG_LOCALES).map((l) => (
            <link key={l} rel="alternate" hrefLang={l} href={canonicalUrl} />
          ))}
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />

      {/* JSON-LD */}
      {allSchemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
