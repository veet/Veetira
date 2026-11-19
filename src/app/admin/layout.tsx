/** The public site is Hebrew and right-to-left; the admin stays English, left-to-right, in the Latin fonts. */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div dir="ltr" lang="en" className="admin-ltr font-sans">
      {children}
    </div>
  );
}
