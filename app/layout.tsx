import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { basehub } from "basehub";
import { Pump } from "basehub/react-pump";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { draftMode } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

export const generateMetadata = async (): Promise<Metadata> => {
  const { global } = await basehub({ next: { revalidate: 10 } }).query({
    global: {
      favicon: { url: true, mimeType: true },
      meta: {
        title: true,
        description: true,
        ogImage: {
          url: { __args: { width: 1200, height: 630 } },
          width: true,
          height: true,
        },
      },
    },
  });

  return {
    title: global.meta.title,
    description: global.meta.description,
    icons: global.favicon
      ? [
          {
            url: global.favicon.url,
            rel: "icon",
            type: global.favicon.mimeType,
          },
        ]
      : [],
    ...(global.meta.ogImage
      ? {
          openGraph: {
            images: [
              {
                url: global.meta.ogImage.url,
                width: global.meta.ogImage.width,
                height: global.meta.ogImage.height,
              },
            ],
          },
          twitter: {
            images: [
              {
                url: global.meta.ogImage.url,
                width: global.meta.ogImage.width,
                height: global.meta.ogImage.height,
              },
            ],
            card: "summary_large_image",
          },
        }
      : {}),
  };
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Pump
          queries={[
            {
              global: {
                theme: {
                  accentColorLight: { rgb: true },
                  accentColorDark: { rgb: true },
                },
              },
            },
          ]}
          draft={draftMode().isEnabled}
          next={{ revalidate: 10 }}
        >
          {async ([{ global }]) => {
            "use server";

            function extractRGB(rgb: string) {
              // Use a regular expression to extract numbers÷
              const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);

              if (match) {
                const [, r, g, b] = match.map(Number);
                return { r, g, b };
              } else {
                return null;
              }
            }

            // Use a regular expression to extract numbers
            const light = extractRGB(global.theme.accentColorLight.rgb);
            const dark = extractRGB(global.theme.accentColorDark.rgb);

            return (
              <style>{`
:root {
  ${light ? `--color-accent-light: ${light.r} ${light.g} ${light.b};` : ""}
  ${dark ? `--color-accent-dark: ${dark.r} ${dark.g} ${dark.b};` : ""}
}
            `}</style>
            );
          }}
        </Pump>
        <ThemeProvider attribute="class">{children}</ThemeProvider>
      </body>
    </html>
  );
}
