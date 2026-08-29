export default function PopupHeader({
  title,
  onClose,
}: {
  title: string;
  onClose: () => void;
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <p className="text-sm text-brand-accent">{title}</p>
      <button
        onClick={onClose}
        aria-label="Close"
        className="pixel-btn bg-brand-primary px-2 py-1 text-xs text-brand-accent hover:bg-brand-primary-hover"
      >
        ✕
      </button>
    </div>
  );
}
