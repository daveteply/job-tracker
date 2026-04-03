'use client';

import { PhoneIcon, ArrowTopRightOnSquareIcon, EnvelopeIcon } from '@heroicons/react/24/solid';

export enum ExternalLinkType {
  Link,
  Phone,
  Email,
}

interface ExternalLinkProps {
  url?: string | null;
  linkText?: string;
  linkType?: ExternalLinkType;
}

export function ExternalLink({
  url,
  linkText,
  linkType = ExternalLinkType.Link,
}: ExternalLinkProps) {
  const accentIcon = (linkType: ExternalLinkType) => {
    switch (linkType) {
      case ExternalLinkType.Phone:
        return <PhoneIcon />;

      case ExternalLinkType.Email:
        return <EnvelopeIcon />;

      default:
        return <ArrowTopRightOnSquareIcon />;
    }
  };

  const urlScheme = (url?: string, linkType?: ExternalLinkType) => {
    if (!url || url === ``) return '';
    switch (linkType) {
      case ExternalLinkType.Email:
        return `mailto:${url}`;

      case ExternalLinkType.Phone:
        return `tel:${url}`;

      default:
        return url;
    }
  };

  return (
    url &&
    url !== '' && (
      <a
        className="link flex link-info"
        href={urlScheme(url, linkType)}
        target={linkType === ExternalLinkType.Link ? '_blank' : '_self'}
        rel={linkType === ExternalLinkType.Link ? 'noopener noreferrer' : ''}
        title={url}
      >
        <span className="pr-1">{linkText ? linkText : url}</span>
        <span className="size-4">{accentIcon(linkType)}</span>
      </a>
    )
  );
}

export default ExternalLink;
