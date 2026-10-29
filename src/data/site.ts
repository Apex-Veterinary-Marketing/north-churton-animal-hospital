// Site-wide config — NOT a content collection. Webflow models this as two
// CMS collections (Practice Information, Practice Social Links) but both
// are effectively singletons, not repeatable content. See
// Skeleton-Build-Spec.md §4.2. Per-client values get filled in here (or in
// a sibling .json this module imports) during client intake.
//
// NOTE (2026-09-08): direct social-profile links used to live here as a
// plain array (`socialLinks`). They're now their own real content
// collection (src/content/social-links/, accessed via
// getAllSocialLinks()) so each platform's icon renders from the inline-SVG
// library in src/lib/icons/social.ts instead of a name string — see
// content.config.ts. googleReviewsLink/facebookReviewsLink/yelpReviewLink
// below are a different thing (review-platform CTA links used by
// ReputationWidget), unaffected by that move.

export interface SiteInfo {
  practiceName: string;
  // The number SHOWN everywhere. Every tel: link dials callTrackingNumber when
  // set, else this — always build links with phoneHref() from
  // src/lib/utils/phone.ts, never by hand (check:links enforces one number).
  phoneNumber?: string;
  callTrackingNumber?: string; // e.g. "+18635914728" — dialed, never displayed
  email?: string;
  address?: string; // street line — see showStreetAddress
  addressLine2?: string; // "City, ST 00000"
  addressLocality?: string; // city, for the schema PostalAddress
  addressRegion?: string; // state, e.g. "FL"
  postalCode?: string;
  addressLink?: string;
  // Publish the street address? Defaults to true, or to FALSE when mobileVet
  // is true (a mobile/home-based business usually works from a private home).
  // When false, getSiteInfo() drops address, addressLink and mapEmbedLink, so
  // no component, page or schema node can leak it; city/ZIP stay.
  // Confirm with the client at intake — never publish a home address by default.
  showStreetAddress?: boolean;
  mobileVet?: boolean;
  serviceAreaOfCoverage?: string; // comma-separated cities; becomes schema areaServed
  // Primary booking action — every "book" CTA (header button, service pages'
  // closing block, CTA bands) reads these instead of hard-coding a route.
  bookingUrl?: string;
  bookingLabel?: string;
  portalUrl?: string; // client/pet portal (the homepage hero's "Pet Portal" button)
  businessDescription?: string; // one or two plain sentences for the schema Business node
  // Machine-readable hours for schema (hours above is display HTML), e.g.
  // [{ dayOfWeek: ["Monday","Tuesday"], opens: "08:00", closes: "18:00" }]
  openingHoursSpecification?: { dayOfWeek: string[]; opens: string; closes: string }[];
  hours?: string; // rich text/HTML — formatted hours table, not a plain string
  afterHours?: string; // rich text/HTML
  mapEmbedLink?: string;
  googleReviewsLink?: string;
  facebookReviewsLink?: string;
  yelpReviewLink?: string;
  googleRating?: number; // static fallback shown until googleWidgetId is configured
  googleReviewCount?: number;
  logoColor?: string; // asset path
  logoWhite?: string; // asset path
  logoFooter?: string; // asset path — logo variant for the dark footer (falls back to logoWhite)
  footerAbout?: string; // ~160-char practice blurb, Footer's About Us column
  cityState?: string; // "[CITY, ST]" display string
  googleWidgetId?: string;
  // UserWay accessibility-widget account id. Optional override only — leave
  // unset to use the agency's own company-wide account (E6izlREqK3, baked
  // into AccessibilityWidget.astro as the default); set this only if a
  // specific client needs their own separate UserWay account.
  userwayAccountId?: string;
  url?: string; // site's canonical origin, e.g. "https://example.com" — the SINGLE
  // place the domain is configured. astro.config.mjs imports this file directly
  // and sets Astro's `site` from this field, so canonical URLs, OG/Twitter tags,
  // and the sitemap all derive from it automatically — never hard-code the
  // domain anywhere else. MUST be the real production domain (no trailing
  // slash) before launch, or canonical/sitemap URLs will point at the
  // placeholder below.
  // Schema.org @type for the site-wide Business node (see Skeleton-Build-Spec.md
  // §9/§14 item 8). Set it from intake — defaults to "VeterinaryCare", but a
  // non-clinic client (trainer, groomer, boarding) is NOT VeterinaryCare:
  // use e.g. ["LocalBusiness", "ProfessionalService"]. A mobile business
  // also sets mobileVet + serviceAreaOfCoverage (→ areaServed).
  businessSchemaType?: string | string[];
  // The practice's OTHER location, which has its own website (same pattern as
  // Ark). Shown as a tab in the homepage "Our locations" block and in the
  // footer. Its call link dials that location's own tracking number and is
  // marked data-sister-location, the one exception check:links allows.
  sisterLocation?: {
    name: string;
    cityState: string; // "Hillsborough, NC"
    address?: string;
    addressLine2?: string; // "City, ST 00000"
    addressLandmark?: string;
    addressLink?: string; // Google Maps directions link
    phoneNumber?: string; // display number
    callTrackingNumber?: string; // that location's own tracking number
    description?: string;
    hours?: string; // rich text/HTML
    serviceAreas?: string[];
    mapEmbedLink?: string;
    url?: string; // that location's website
  };
  // Google tag IDs (gtag.js). Loaded only on trackingHosts, so local and
  // preview visits never reach the client's analytics.
  ga4Id?: string; // e.g. "G-XXXXXXXXXX"
  googleAdsId?: string; // e.g. "AW-1234567890"
  trackingHosts?: string[]; // hostnames that load the tags, e.g. ["example.com", "www.example.com"]
}

// Placeholder example data — replace during client intake. Kept non-empty
// so components/pages have something real to render while the skeleton is
// being built and reviewed.
export const siteInfo: SiteInfo = {
  practiceName: "North Churton Animal Hospital",
  businessSchemaType: "VeterinaryCare",
  phoneNumber: "(919) 644-7387",
  callTrackingNumber: "+19842176265",
  address: "636 N Churton St",
  addressLine2: "Hillsborough, NC 27278",
  addressLocality: "Hillsborough",
  addressRegion: "NC",
  postalCode: "27278",
  addressLink:
    "https://www.google.com/maps/search/?api=1&query=North+Churton+Animal+Hospital%2C+636+N+Churton+St%2C+Hillsborough%2C+NC+27278",
  mapEmbedLink:
    "https://maps.google.com/maps?q=North+Churton+Animal+Hospital%2C+636+N+Churton+St%2C+Hillsborough%2C+NC+27278&output=embed",
  serviceAreaOfCoverage:
    "Hillsborough, Durham, Efland, Chapel Hill, Mebane, Prospect Hills, Cedar Grove, Orange Grove, Roxboro, Rougemont, Schley",
  // Appointments go through the client's TheVetHero portal (same setup as Durham, 2026-10-29).
  bookingUrl: "https://pp.thevethero.com/north-churton-animal-hospital/login",
  bookingLabel: "Book an Appointment",
  portalUrl: "https://pp.thevethero.com/north-churton-animal-hospital/login",
  businessDescription:
    "North Churton Animal Hospital is a full-service veterinary hospital in Hillsborough, NC, caring for dogs and cats since 2006 with wellness exams, diagnostics, dentistry and surgery.",
  openingHoursSpecification: [
    { dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "17:30" },
  ],
  cityState: "Hillsborough, NC",
  hours:
    "<p>Mon&ndash;Fri: 8:00am&ndash;5:30pm<br>Sat&ndash;Sun: Closed</p><p>Please call for doctor&rsquo;s appointment availability.</p>",
  afterHours:
    "<p>Triangle Veterinary Referral Hospital<br>608 Morreene Rd, Durham, NC 27705<br>(919) 489-0615</p>",
  footerAbout:
    "North Churton Animal Hospital has cared for Hillsborough dogs and cats since 2006, with wellness exams, diagnostics, dental care, and surgery from a caring team.",
  googleReviewsLink: "https://goo.gl/maps/q19BJMJYLYg6FGk29",
  facebookReviewsLink: "https://www.facebook.com/NorthChurtonAnimalHospital/reviews",
  // REPLACE with the real domain at launch (the old site's address, until DNS moves).
  url: "https://northchurtonanimalhospital.com",
  logoWhite: "/logo-white.png",
  logoColor: "/logo-color.png",
  logoFooter: "/logo-footer.png",
  // Sister location: Durham Animal Hospital, same owner.
  sisterLocation: {
    name: "Durham Animal Hospital",
    cityState: "Durham, NC",
    address: "4306 N Roxboro St",
    addressLine2: "Durham, NC 27704",
    addressLandmark: "Directly behind Captain D's",
    addressLink:
      "https://www.google.com/maps/search/?api=1&query=Durham+Animal+Hospital%2C+4306+N+Roxboro+St%2C+Durham%2C+NC+27704",
    phoneNumber: "(919) 620-7387",
    callTrackingNumber: "+19842533420", // Durham's Twilio number
    hours: "<p>Mon&ndash;Fri: 8:00am&ndash;5:30pm<br>Sat&ndash;Sun: Closed</p><p>Please call for doctor&rsquo;s appointment hours.</p>",
    serviceAreas: ["Durham", "Rougemont", "Hurdle Mills", "Creedmoor", "Roxboro", "Chapel Hill", "Raleigh"],
    mapEmbedLink:
      "https://maps.google.com/maps?q=Durham+Animal+Hospital%2C+4306+N+Roxboro+St%2C+Durham%2C+NC+27704&output=embed",
    url: "https://durhamanimalhospital.com",
  },
  // The client's existing GA4 property (from the old site), so reporting continues after launch.
  ga4Id: "G-GQ2CSWYRGD",
  trackingHosts: ["northchurtonanimalhospital.com", "www.northchurtonanimalhospital.com"],
};

