// Homepage content (src/components/home/).
// Copy is agency-written from the onboarding form and intake — a draft for
// the client to review, not their own words.
import { getSiteInfo } from "./site";
import { getFeaturedServices } from "./services";
import { getAllDoctors } from "./doctors";

export async function getHomeData() {
  const site = await getSiteInfo();
  const featured = await getFeaturedServices();
  const doctors = await getAllDoctors();
  const featuredDoctors = doctors.filter((d) => d.data.showOnHome);
  const homeDoctors = featuredDoctors.length ? featuredDoctors : doctors.slice(0, 1);

  const services = featured.map((s) => ({
    href: `/services/${s.id}`,
    label: s.data.featuredHeading || s.data.customName || s.data.name,
    blurb: s.data.featuredText ?? "",
    icon: s.data.serviceIcon,
    image: s.data.pageHeaderImage,
    imageAlt: s.data.pageHeaderImageAlt ?? "",
  }));

  return {
    site,
    services,
    doctors: homeDoctors,
    // Hero background video (agency stock, mirrored so the dog is opposite the text).
    // position = object-position on wide screens, aimed at the dog.
    heroVideo: { src: "/video/north-churton-hero.mp4", poster: "/video/north-churton-hero-poster.jpg", position: "100% 75%" },
    headline: "Where pets are family.",
    lede: "Wellness exams, dental care and surgery for Hillsborough dogs and cats, from Dr. James Miller, Dr. Korinn Saker and a team that knows your pet by name.",
    // The homepage's one set of highlights (hero pills) — don't repeat them elsewhere on the page.
    highlights: ["Same-day sick visits when we can", "Digital X-rays and in-house lab", "Dr. Miller: 30+ years caring for pets"],
    welcome: [
      "Since 2006, North Churton Animal Hospital has cared for the dogs and cats of Hillsborough and nearby towns like Efland, Mebane and Cedar Grove.",
      "Dr. James Miller, who has cared for pets for more than 30 years, Dr. Korinn Saker and our team know many of our patients from their first puppy and kitten visits through their senior years, and we take the time to explain every option so you can make the right choice for your pet.",
    ],
    payment: "We accept cash, credit and debit cards, CareCredit and Cherry financing, and work with Trupanion pet insurance.",
    landmark: "In front of Dollar General",
    serviceArea: (site.serviceAreaOfCoverage ?? "").split(",").map((t) => t.trim()).filter(Boolean),
  };
}
