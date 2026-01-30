interface FieldLabelProps {
  label: string;
  children: React.ReactNode;
}

export default function FieldLabel({ label, children }: FieldLabelProps) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">
        {label}
      </label>
      <div className="text-sm text-gray-900">{children}</div>
    </div>
  );
}
