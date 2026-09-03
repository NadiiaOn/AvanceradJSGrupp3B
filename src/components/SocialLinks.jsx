import {
  FacebookLogoIcon,
  InstagramLogoIcon,
  PinterestLogoIcon,
  YoutubeLogoIcon,
} from "@phosphor-icons/react";

export default function SocialLinks() {
  return (
    <div className="flex text-white gap-8 flex-wrap justify-center">
      <a
        href="https://www.facebook.com"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-olive"
      >
        <FacebookLogoIcon size={32} />
      </a>
      <a
        href="https://www.instagram.com"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-olive"
      >
        <InstagramLogoIcon size={32} />
      </a>
      <a
        href="https://www.pinterest.com"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-olive"
      >
        <PinterestLogoIcon size={32} />
      </a>
      <a
        href="https://www.youtube.com"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-olive"
      >
        <YoutubeLogoIcon size={32} />
      </a>
    </div>
  );
}
