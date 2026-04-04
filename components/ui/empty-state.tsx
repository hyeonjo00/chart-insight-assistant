type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-950/30 px-6 py-12 text-center">
      <div className="h-12 w-12 rounded-full bg-sky-400/10 ring-1 ring-sky-300/20" />
      <h2 className="mt-6 text-xl font-semibold text-white">{title}</h2>
      <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">{description}</p>
    </div>
  );
}
