import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "ARFAD Content Admin",
  description: "Edit ARFAD's website content, projects, services and media.",
};

const THEME_INIT = `
(function(){
  try{
    var t = localStorage.getItem("admin-theme") || "dark";
    if(t === "dark") document.documentElement.classList.add("dark");
  }catch(e){
    document.documentElement.classList.add("dark");
  }
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body className="antialiased bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
