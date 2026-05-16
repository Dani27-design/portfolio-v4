import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

// Root layout is a thin pass-through.
// The real <html>/<body> and providers live in [locale]/layout.tsx
// because next-intl needs the locale param to set lang attribute.
export default function RootLayout({ children }: Props) {
  return children;
}
