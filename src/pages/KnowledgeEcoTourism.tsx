/**
 * Knowledge Eco Tourism
 *
 * Page under Bio Diversity Information Service listing tree parks and eco-tourism sites.
 * SFRI Genetic Resources Tree Park (Kolapakkam) is open; Pattakarai AFRD and SFRI Neyveli
 * Tree Park are listed as coming soon.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Clock,
  Ticket,
  TreePine,
  Leaf,
  Droplets,
  Baby,
  Coffee,
} from 'lucide-react';
import { colors } from '../config/colors';

const KnowledgeEcoTourism: React.FC = () => {
  return (
    <div className="py-10 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page title */}
        <div className="mb-10">
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: colors.text.heading }}
          >
            Knowledge Eco Tourism
          </h1>
          <p className="text-lg" style={{ color: colors.text.secondary }}>
            Tree parks and eco-tourism sites under the Bio Diversity Information Service. Explore
            rare and threatened tree species, medicinal plants, and nature trails.
          </p>
        </div>

        {/* SFRI Genetic Resources Tree Park — Open */}
        <article
          className="bg-white rounded-xl shadow-md border overflow-hidden mb-10"
          style={{ borderColor: colors.border.light }}
        >
          {/* Hero: park entrance */}
          <div className="w-full overflow-hidden rounded-t-xl">
            <img
              src="/front.jpeg"
              alt="Forest Genetic Resources Tree Park entrance, Kolapakkam, Chennai"
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <h2
                className="text-2xl font-semibold"
                style={{ color: colors.primary.dark }}
              >
                Forest Genetic Resources Tree Park
              </h2>
              <span
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: colors.status.success.lightest,
                  color: colors.status.success.dark,
                }}
              >
                Open
              </span>
            </div>

            <p className="text-justify mb-6" style={{ color: colors.text.primary }}>
              The Tree Park, established in <strong>2018</strong>, harbors nearly{' '}
              <strong>300 rare, endangered, and threatened tree species</strong> from the Eastern
              and Western Ghats, making it a significant repository of regional biodiversity. Each
              tree is accompanied by an information board detailing its scientific and vernacular
              names, classification, distribution, and medicinal properties. The park also
              includes a diverse collection of medicinal plants, a bamboo setum, a ficatorium, and a
              palmatum, further enhancing its appeal and supporting eco-tourism.
            </p>

            {/* Location & Approach */}
            <section className="mb-6">
              <h3
                className="text-lg font-semibold flex items-center gap-2 mb-3"
                style={{ color: colors.primary.dark }}
              >
                <MapPin className="h-5 w-5 flex-shrink-0" />
                Location & Approach
              </h3>
              <p className="mb-2" style={{ color: colors.text.secondary }}>
                The Park is located near State Forest Research Institute, Kolapakkam on the
                Vandalur–Kelambakkam Highway. Its proximity to key transport points:
              </p>
              <ul
                className="list-disc list-inside space-y-1 text-sm"
                style={{ color: colors.text.secondary }}
              >
                <li>40 km from Central Railway station</li>
                <li>17 km from the Airport</li>
                <li>38 km from Egmore Railway station</li>
                <li>10 km from Tambaram</li>
                <li>1 km from Arignar Anna Zoological Park</li>
                <li>0.5 km from Kolapakkam Bus stop</li>
              </ul>
            </section>

            {/* Details of the Park (with buggy image) */}
            <section className="mb-6">
              <h3
                className="text-lg font-semibold flex items-center gap-2 mb-3"
                style={{ color: colors.primary.dark }}
              >
                <Clock className="h-5 w-5 flex-shrink-0" />
                Details of the Park
              </h3>
              <div className="flex flex-col md:flex-row md:items-start gap-4 mb-4">
                <div className="flex-1 space-y-2 text-sm" style={{ color: colors.text.secondary }}>
                  <p>
                    <strong style={{ color: colors.text.primary }}>Open hours:</strong> 9:00 a.m. to
                    5:30 p.m. (Tuesday – weekly holiday)
                  </p>
                  <p className="flex items-center gap-2">
                    <Ticket className="h-4 w-4 flex-shrink-0" />
                    <span>
                      <strong style={{ color: colors.text.primary }}>Entry fee:</strong> Rs. 20
                      per person
                    </span>
                  </p>
                  <p>
                    <strong style={{ color: colors.text.primary }}>
                      Special walking hours (Saturdays & Sundays):
                    </strong>
                    <br />
                    Morning: 6:00 a.m. to 8:00 a.m. · Evening: 4:00 p.m. to 6:00 p.m.
                  </p>
                  <p>
                    Newly introduced <strong>battery-operated buggy cart service (11-seater)</strong>.
                  </p>
                </div>
                <div className="flex-shrink-0 md:w-80">
                  <img
                    src="/buggy.jpeg"
                    alt="Battery-operated buggy cart at Forest Genetic Resources Tree Park"
                    className="w-full h-auto rounded-lg shadow-md"
                  />
                </div>
              </div>
            </section>

            {/* Other Attractions and Facilities */}
            <section>
              <h3
                className="text-lg font-semibold flex items-center gap-2 mb-3"
                style={{ color: colors.primary.dark }}
              >
                <TreePine className="h-5 w-5 flex-shrink-0" />
                Other Attractions and Facilities of the Tree Park
              </h3>
              <ul
                className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm"
                style={{ color: colors.text.secondary }}
              >
                <li className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 flex-shrink-0 text-green-600" />
                  Water cascade and water fountain
                </li>
                <li className="flex items-center gap-2">Stone benches placed across the park</li>
                <li className="flex items-center gap-2">Visitor sheds and gazebos</li>
                <li className="flex items-center gap-2">
                  <Leaf className="h-4 w-4 flex-shrink-0 text-green-600" />
                  Assemblage of tree species from the Western and Eastern Ghats
                </li>
                <li className="flex items-center gap-2">Bamboosetum and ficatorium collections</li>
                <li className="flex items-center gap-2">Walking paths and nature trails</li>
                <li className="flex items-center gap-2">
                  Information boards and interpretive signage
                </li>
                <li className="flex items-center gap-2">
                  <Baby className="h-4 w-4 flex-shrink-0 text-green-600" />
                  Children&apos;s play area with swings, merry-go-rounds, and other play items
                </li>
                <li className="flex items-center gap-2">
                  <Coffee className="h-4 w-4 flex-shrink-0 text-green-600" />
                  RO drinking water facility
                </li>
                <li className="flex items-center gap-2">Check dam within the park area</li>
                <li className="flex items-center gap-2">Interpretation centre for visitors</li>
                <li className="flex items-center gap-2">Floral and Butterfly Garden</li>
              </ul>
            </section>

            <div className="mt-8 pt-6 border-t" style={{ borderColor: colors.border.light }}>
              <Link
                to="/divisions/state-forest-research"
                className="text-sm font-medium hover:underline"
                style={{ color: colors.text.link }}
              >
                View State Forest Research Division →
              </Link>
            </div>
          </div>
        </article>

        {/* Pattakarai AFRD — Coming soon */}
        <article
          className="bg-white rounded-xl shadow border overflow-hidden mb-10 opacity-90"
          style={{ borderColor: colors.border.light }}
        >
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h2
                className="text-xl font-semibold"
                style={{ color: colors.text.heading }}
              >
                Pattakarai AFRD
              </h2>
              <span
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: colors.status.warning.lightest,
                  color: colors.status.warning.dark,
                }}
              >
                Coming soon
              </span>
            </div>
            <p className="text-sm" style={{ color: colors.text.secondary }}>
              This park is not yet open to the public. Details will be updated when available.
            </p>
          </div>
        </article>

        {/* SFRI Neyveli Tree Park — Coming soon */}
        <article
          className="bg-white rounded-xl shadow border overflow-hidden"
          style={{ borderColor: colors.border.light }}
        >
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h2
                className="text-xl font-semibold"
                style={{ color: colors.text.heading }}
              >
                SFRI Neyveli Tree Park
              </h2>
              <span
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: colors.status.warning.lightest,
                  color: colors.status.warning.dark,
                }}
              >
                Coming soon
              </span>
            </div>
            <p className="text-sm" style={{ color: colors.text.secondary }}>
              This park is not yet open to the public. Details will be updated when available.
            </p>
          </div>
        </article>
      </div>
    </div>
  );
};

export default KnowledgeEcoTourism;
