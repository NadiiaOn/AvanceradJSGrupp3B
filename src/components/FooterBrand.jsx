import { TagIcon } from "@phosphor-icons/react";

export default function FooterBrand() {
  return (
    <div className="flex items-center gap-1">
      <TagIcon className="text-olive" weight="bold" size={28} />
      <h3 className="font-heading font-bold text-3xl text-white ">Fakestore</h3>
    </div>
  );
}
