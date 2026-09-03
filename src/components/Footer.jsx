import TrustBanner from "./TrustBanner";
import FooterBrand from "./FooterBrand";
import SocialLinks from "./SocialLinks";
import ContactInfo from "./ContactInfo";

export default function Footer() {
  return (
    <footer className="flex flex-col bg-footer">
      <div>
        <TrustBanner />
      </div>
      <div className="flex flex-col lg:flex-row lg:justify-between lg:px-8  gap-6 py-8 items-center border-t border-gray-600">
        <FooterBrand />
        <ContactInfo />
        <SocialLinks />
      </div>
    </footer>
  );
}
