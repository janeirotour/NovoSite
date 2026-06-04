import { getUncachableStripeClient } from './stripeClient';

const tours = [
  { slug: 'christ-redeemer-tour', name: 'Cristo Redentor, Tijuca Forest & City Tour (7 Hours)', description: 'Visit Cristo Redentor, Tijuca Forest, and the top highlights of Rio in a full-day guided experience.', priceUsd: 95 },
  { slug: 'rio-city-tour', name: 'Full-Day Rio de Janeiro City Tour — Cristo, Sugarloaf & Highlights', description: 'Comprehensive full-day city tour visiting Cristo, Sugarloaf, Santa Teresa, and more.', priceUsd: 200 },
  { slug: 'airport-transfer-rio', name: 'Airport Transfer: Arrival or Departure (GIG Airport)', description: 'Private airport transfer between GIG International Airport and Rio hotels.', priceUsd: 60 },
  { slug: 'private-rio-experience', name: 'Rio Highlights in 5 Hours — Cristo, Sugarloaf & More', description: 'A curated 5-hour private tour of Rio\'s most iconic landmarks.', priceUsd: 180 },
  { slug: 'little-africa-walking-tour', name: 'Afro-Brazilian History & Immersion Walking Tour', description: 'Explore Rio\'s African heritage through the Pequena África neighborhood.', priceUsd: 95 },
  { slug: 'rio-cooking-class', name: 'Rio Cooking Class', description: 'Learn to cook authentic Brazilian dishes with a local chef in Rio.', priceUsd: 150 },
  { slug: 'favela-tour-rio', name: 'Favela Tour Rio de Janeiro', description: 'A respectful, community-led tour through Rio\'s vibrant favela communities.', priceUsd: 75 },
  { slug: 'hang-gliding-rio', name: 'Hang Gliding Adventure in Rio de Janeiro', description: 'Soar above Rio\'s mountains and beaches on a tandem hang gliding flight.', priceUsd: 170 },
  { slug: 'helicopter-rio-essential', name: 'Rio Helicopter Experience – Essential Flight', description: 'A breathtaking helicopter flight over Cristo Redentor, Sugarloaf, and Guanabara Bay.', priceUsd: 156 },
  { slug: 'helicopter-rio-premium', name: 'Rio Helicopter Experience – Premium Flight', description: 'Extended helicopter tour with wider coverage of Rio\'s skyline and beaches.', priceUsd: 179 },
  { slug: 'helicopter-rio-doors-off', name: 'Rio Helicopter Doors-Off Experience', description: 'The ultimate open-air helicopter experience for the most breathtaking shots of Rio.', priceUsd: 399 },
  { slug: 'rio-nightlife-culture', name: 'Rio Nightlife & Local Culture Experience', description: 'An authentic evening of Rio nightlife, music, and culture.', priceUsd: 60 },
];

async function seedProducts() {
  try {
    const stripe = await getUncachableStripeClient();
    console.log('Seeding Janeiro Tour products in Stripe...\n');

    for (const tour of tours) {
      const existing = await stripe.products.search({
        query: `metadata['tour_slug']:'${tour.slug}'`,
      });

      if (existing.data.length > 0) {
        console.log(`✓ Skipped (exists): ${tour.name}`);
        continue;
      }

      const product = await stripe.products.create({
        name: tour.name,
        description: tour.description,
        metadata: { tour_slug: tour.slug },
      });

      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: tour.priceUsd * 100,
        currency: 'usd',
        metadata: { tour_slug: tour.slug, per: 'person' },
      });

      console.log(`✓ Created: ${tour.name} — $${tour.priceUsd}/person (${price.id})`);
    }

    console.log('\n✅ Done! Webhook will sync products to your database automatically.');
  } catch (err: any) {
    console.error('Error seeding products:', err.message);
    process.exit(1);
  }
}

seedProducts();
