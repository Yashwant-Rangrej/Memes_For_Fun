export function Footer() {
  return (
    <footer className="border-t border-border py-6 mt-auto">
      <div className="container-app flex items-center justify-between text-sm text-secondary">
        <span>© {new Date().getFullYear()} CatMood</span>
        <span>v0.1.0</span>
      </div>
    </footer>
  );
}
