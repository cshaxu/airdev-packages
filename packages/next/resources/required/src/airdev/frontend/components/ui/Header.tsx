/* "@airdev/next": "managed" */

'use client';

type Props = { title: string; children?: React.ReactNode };

export default function Header({ title, children }: Props) {
  return (
    <div className="bg-background/95 border-border sticky top-0 z-10 -mx-6 mb-5 flex items-center justify-between border-b px-6 pt-5 pb-2 backdrop-blur">
      <h2 className="text-foreground text-2xl font-bold">{title}</h2>
      {children}
    </div>
  );
}
