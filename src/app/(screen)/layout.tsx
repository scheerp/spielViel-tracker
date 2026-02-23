export default function ScreenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="flex-grow">{children}</main>;
}
