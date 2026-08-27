import {
  ShoppingCartIcon,
  TagIcon,
  ListIcon,
  UserIcon,
  MagnifyingGlassIcon,
} from "@phosphor-icons/react";

export default function Navbar() {
  return (
    <nav className="flex justify-center bg-bg w-full py-4 border-b">
      <div className="flex justify-between w-[90%]">
        <div className="flex items-center gap-1">
          <TagIcon size={26} weight="bold" className="text-olive" />
          <h1 className="font-semibold font-heading text-3xl">Fakestore</h1>
        </div>
        <div className="flex items-center gap-6 text-text">
          <MagnifyingGlassIcon weight="thin" size={26} />
          <ShoppingCartIcon weight="thin" size={26} />
          <ListIcon weight="thin" size={26} />
        </div>
      </div>
    </nav>
  );
}
