export default function TrustBanner() {
  return (
    <div className="flex flex-col lg:flex-row lg:justify-center text-center gap-4 items-center py-6 px-4 ">
      <a
        href="https://tryggehandel.svenskhandel.se/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src="/logo.svg"
          alt="Trygg E-handel certifiering"
          className="w-12 h-12"
        />
      </a>

      <div className="flex flex-col gap-1">
        <p className="font-bold font-body text-white text-sm">
          Secure payments – Pay directly or split into installments
        </p>
        <p className="font-body text-white text-sm">
          Want to know more{" "}
          <a href="#" className="underline cursor-pointer">
            about our payment options?
          </a>
        </p>
      </div>
    </div>
  );
}
