export function Loader({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div className="w-6 h-6 border-2 border-border border-t-foreground rounded-full animate-spin" />
      <p className="text-sm text-secondary">{text}</p>
    </div>
  );
}
