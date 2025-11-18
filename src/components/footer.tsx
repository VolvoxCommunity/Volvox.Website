"use client";

export function Footer() {
  return (
    <footer className="py-8 px-4 border-t">
      <div className="container mx-auto max-w-7xl text-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Volvox. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
