import Image from "next/image";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen w-full bg-app_bg flex flex-col items-center justify-center">
      {/* 1. Left Side (Image) */}
      <Image
        // Using a placeholder that matches the orange theme from the image
        src="/logo.png"
        width={70}
        height={70}
        alt="A person enjoying a healthy meal"
        priority // Load this image first
        className="object-cover"
      />
      {children}
    </div>
  );
}
