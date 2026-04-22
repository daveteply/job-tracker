'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Breadcrumbs() {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(Boolean); // Split and remove empty strings

  return (
    <div className="breadcrumbs text-sm">
      <ul className="capitalize">
        {pathSegments.map((segment, index) => {
          const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
          const isLast = index === pathSegments.length - 1;
          const decodedSeg = decodeURIComponent(segment);
          return (
            <li key={index}>
              {isLast ? (
                <span className="text-base-content/60 cursor-default hover:no-underline">
                  {decodedSeg}
                </span>
              ) : (
                <Link href={href}>{decodedSeg}</Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Breadcrumbs;
