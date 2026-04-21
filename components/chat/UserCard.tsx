export function UserCard() {
  return (
    <div className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-sidebarHover">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-[13px] font-semibold text-white">
        G
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-ink">Guest</div>
        <div className="truncate text-xs text-subtle">Free preview</div>
      </div>
    </div>
  );
}
