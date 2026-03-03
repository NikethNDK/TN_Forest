import React from 'react';

// Local fallback images (used when a center doesn't have imageUrl in Firestore)
import ThoppurImage from '../assets/Thoppur.jpeg';
import HarurMNCImage from '../assets/Harur MNC.jpeg';
import KalamavoorImage from '../assets/Kalamavoor.jpeg';
import ValkaraduImage from '../assets/Valkaradu.jpeg';
import AlwarmalaiImage from '../assets/Alwarmalai.jpeg';
import EdaikkalImage from '../assets/Edaikkal.jpeg';
import KathiripuramImage from '../assets/Kathiripuram.jpeg';
import MelchengamImage from '../assets/Melchengam.jpeg';
import JamunamarathurImage from '../assets/Jamunamarathur.jpeg';
import MaragattaImage from '../assets/Maragatta.jpeg';

export type DivisionStatItem = {
  value: string;
  label: string;
};

export type DivisionContactFallbacks = {
  phone: string;
  /**
   * Used to generate a fallback email when a center doesn't have an email set.
   * Current behavior: `${center.name.toLowerCase().replace(/\s+/g, '')}@${emailDomain}`
   */
  emailDomain: string;
};

export type ModernNurseryDivisionConfig = {
  divisionSlug: string;
  overview: React.ReactNode;
  focusAreasImageSrc: string;
  stats: DivisionStatItem[];
  centerImageFallbacks: Record<string, string>;
  tollFreeFallback: {
    display: string;
    tel: string;
  };
  contactFallbacks: DivisionContactFallbacks;
};

export const modernNurseryDivisionConfig: ModernNurseryDivisionConfig = {
  divisionSlug: 'modern-nursery',
  overview: (
    <div className="space-y-8">
      {/* MODERN NURSERY DIVISION AT A GLANCE */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Introduction Section */}
        {/* <div className="mb-8">
          <h3 className="text-2xl font-semibold text-green-700 mb-4 text-center">
            Historical Background
          </h3>
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
            <p className="text-justify">
              Under the <strong>Tamil Nadu Agricultural Development Programme (T.N.A.D.P)</strong>, two Seed Technology Divisions were established, with headquarters in Trichy and Dharmapuri, along with a Transfer Technology Division based in Trichy. The primary objective of the Seed Technology Division was to enhance the quality and availability of seedlings, facilitate the mass production and distribution of Tamarind grafts, and establish various seed-related facilities, including clonal orchards and designated seed production areas.
            </p>
            <p className="text-justify">
              This initiative aimed to support local farmers by improving access to high-quality planting materials, thereby aiding in betterment of agricultural practices and higher crop yields.
            </p>
            <p className="text-justify">
              Parallelly, the Transfer Technology Division was dedicated to educating farmers about innovative forestry technologies. This involved organizing workshops, field demonstrations, and training sessions to ensure that farmers were well-informed about the latest advancements in tree cultivation.
            </p>
          </div>
        </div> */}
        {/* Focus Areas Image Section */}
        <div className="mb-8 border-t border-gray-200 pt-8">
          <div className="flex justify-center">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md">
              <img
                src="/MND_Focus_Areas.png"
                alt="Modern Nursery Division Focus Areas"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Formation Section */}
        <div className="mb-8 border-t border-gray-200 pt-8">
          <h3 className="text-2xl font-semibold text-green-700 mb-4 text-center">
            Background
          </h3>
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
            <p className="text-justify">
              The <strong>Modern Nursery Division</strong> (for short hereinafter Division), headquartered in Dharmapuri was formalized by <strong>G.O.M.S.No.54</strong> issued by the Environment and Forests Department on <strong>February 26, 1999</strong>.
            </p>

            <p className="text-justify">
              The formation of the Division marked a significant step towards improving the infrastructure for quality seedling production and distribution in Tamil Nadu. By focusing on modern nursery practices, the Division aims to enhance the quality of planting material available to the stake holders. Furthermore, it marked a significant milestone in the Tamil Nadu Forest Department in the areas of research and production of Biofertilizers. Under a single Division it facilitated a more cohesive approach to research, development, production and technology transfer, ultimately benefiting the forest department, line departments and agricultural community at large.
            </p>
          </div>
        </div>


        {/* Mission and Bio-fertilizers Section */}
        <div className="mb-8 border-t border-gray-200 pt-8">
          <h3 className="text-2xl font-semibold text-green-700 mb-4 text-center">
            Mission and Bio-fertilizers Production
          </h3>
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
            <p className="text-justify">
              The division&apos;s primary mission is to produce and supply high-quality vermicompost, <strong>Vesicular Arbuscular Mycorrhizae (VAM)</strong>, and various bio-fertilizers, including <strong>Azospirillum</strong> and <strong>Phosphobacteria</strong>. A significant milestone was reached in <strong>2000</strong> with the inauguration of a state-of-the-art laboratory, which has been crucial for the continuous production and supply of essential nitrogen-fixing bacteria like Azospirillum, phosphate-solubilizing bacteria such as Phosphobacteria, as well as root-rot suppressing agents like <strong>Pseudomonas sp.</strong> and the fungus <strong>Trichoderma viride</strong>.
            </p>
          </div>
        </div>

        {/* ISO Certification Section */}
        <div className="mb-8 border-t border-gray-200 pt-8">
          <h3 className="text-2xl font-semibold text-green-700 mb-4 text-center">
            ISO Certification
          </h3>
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
            <p className="text-justify">
              To further our commitment to quality, the Bio-Fertilizers Research and Production Units are <strong>ISO 9001:2015</strong> certified, affirming our adherence to rigorous standards. This certification applies to the production facilities for Biofertilizer production at Dharmapuri and VAM and Vermicompost across five Modern Nursery Centres: <strong>Thoppur, Harur, Kalamavoor, Valkaradu, and Alwarmalai</strong>.
            </p>
          </div>
        </div>

        {/* Forest Tree Seed Centre Section */}
        <div className="mb-8 border-t border-gray-200 pt-8">
          <h3 className="text-2xl font-semibold text-green-700 mb-4 text-center">
            Forest Tree Seed Centre
          </h3>
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
            <p className="text-justify">
              Additionally, a <strong>Forest Tree Seed Centre</strong> was established at <strong>M.R.Palayam</strong> to ensure availability of forest tree seeds for current and future needs. This initiative aims to provide high-quality, purified seeds to the Forest Department, as well as to farmers, industries, sister departments and other stakeholders.
            </p>
            <p className="text-justify">
              The formation of this seed centre was announced on <strong>August 11, 2016</strong>, on the floor of the Tamil Nadu State Assembly. The issuance of <strong>G.O. No. 97</strong> Tamil Nadu Forest Department Research WingEnvironment and Forests (FRIV) Department on <strong>April 20, 2017</strong>, formalized the establishment.
            </p>
          </div>
        </div>
      </div>
    </div>
  ),
  focusAreasImageSrc: '/MND_Focus_Areas.png',
  stats: [
    { value: '10', label: 'Research Centers' },
    { value: '15+', label: 'Active Projects' },
    { value: '50+', label: 'Completed Projects' },
    { value: '1000+', label: 'Saplings Produced' },
  ],
  centerImageFallbacks: {
    'Thoppur Modern Nursery Centre': ThoppurImage,
    'Harur Modern Nursery Centre': HarurMNCImage,
    'Kalamavoor Modern Nursery Centre': KalamavoorImage,
    'Valkaradu Modern Nursery Centre': ValkaraduImage,
    'Alwarmalai Modern Nursery Centre': AlwarmalaiImage,
    'Edaikkal Research Centre': EdaikkalImage,
    'Kathiripuram Research Centre': KathiripuramImage,
    'Melchengam Research Centre': MelchengamImage,
    'Jamunamarathur Research Centre': JamunamarathurImage,
    'Maragatta Research Centre': MaragattaImage,
  },
  tollFreeFallback: {
    display: '1800-425-2313',
    tel: '18004252313',
  },
  contactFallbacks: {
    phone: '+91 44 1234 5681',
    emailDomain: 'tnfrd.gov.in',
  },
};


