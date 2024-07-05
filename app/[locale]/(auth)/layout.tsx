export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex h-screen flex-col bg-[#f5f6fa]">{children}</main>
  );
}
