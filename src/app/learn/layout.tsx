import { Baloo_2 } from "next/font/google";

const baloo = Baloo_2({
  variable: "--font-learn-face",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${baloo.variable} learn-landing max-w-[100vw] overflow-x-clip`}>
      {children}
    </div>
  );
}
