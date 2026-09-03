import { PhoneIcon, EnvelopeSimpleIcon } from "@phosphor-icons/react";

export default function ContactInfo() {
  return (
    <div className="flex gap-6 flex-wrap justify-center">
      <a
        href="tel:+46812345678"
        className="flex items-center gap-2 font-body text-white text-sm hover:text-olive"
      >
        <PhoneIcon size={20} />
        08-123 45 678
      </a>
      <a
        href="mailto:info@fakestore.se"
        className="flex items-center gap-1 font-body text-white text-sm hover:text-olive"
      >
        <EnvelopeSimpleIcon size={20} />
        info@fakestore.se
      </a>
    </div>
  );
}
