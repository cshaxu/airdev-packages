/* "@airdev/next": "managed" */

import { Img } from '@react-email/components';

type Props = { src: string; alt: string };

export default function Logo({ src, alt }: Props) {
  return (
    <Img
      src={src}
      width="50"
      height="50"
      alt={alt}
      className="mx-auto rounded-3xl object-cover"
    />
  );
}
