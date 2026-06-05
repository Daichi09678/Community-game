'use client';

export function EditableText({
  value, onChange, isEditing, className, placeholder, multiline,
}: {
  value: string; onChange: (v: string) => void; isEditing: boolean;
  className?: string; placeholder?: string; multiline?: boolean;
}) {
  if (!isEditing) return <span className={className}>{value || placeholder}</span>;
  if (multiline) return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={3}
      className={`bg-[rgba(200,169,110,0.06)] border border-[rgba(200,169,110,0.3)] outline-none px-2 py-1 resize-none w-full ${className}`}
    />
  );
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={`bg-[rgba(200,169,110,0.06)] border border-[rgba(200,169,110,0.3)] outline-none px-2 py-1 w-full ${className}`}
    />
  );
}