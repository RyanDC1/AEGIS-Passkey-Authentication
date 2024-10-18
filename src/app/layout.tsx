import type { Metadata } from "next";
import { ConfigProvider, ThemeConfig } from "antd";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import Providers from "./providers";
import "./globals.scss";

export const metadata: Metadata = {
  title: "AEGIS AUTH",
  description: "Seamless Passkey Authentication using WebAuthn API",
  creator: 'Ryan Da Costa'
};

const theme: ThemeConfig = {
  token: {
    colorPrimary: "#066C98",
    colorInfo: "#066C98"
  },
  components: {
    Typography: {
      colorTextHeading: 'rgba(54,54,54,0.8)',
      colorText: 'rgba(54,54,54,0.8)'
    }
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          <ConfigProvider
            theme={theme}
          >
            <Providers>
              {children}
            </Providers>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
