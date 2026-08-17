export default function WidgetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Deliberately bare: this renders inside someone else's iframe, so no global styles.
  return children;
}
