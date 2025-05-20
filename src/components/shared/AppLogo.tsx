import Link from 'next/link';

export function AppLogo() {
  return (
    <Link href="/dashboard" className="flex items-center gap-2 group">
      {/* Icon removed as per Amity theme focusing on text logo */}
      {/* <PackageSearch className="h-7 w-7 text-primary group-hover:text-accent transition-colors" /> */}
      <span className="text-lg font-bold text-sidebar-foreground group-hover:text-sidebar-accent-foreground transition-colors">
        Amity University Punjab
      </span>
    </Link>
  );
}
