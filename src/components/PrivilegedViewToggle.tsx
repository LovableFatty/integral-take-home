interface PrivilegedViewToggleProps {
  privileged: boolean;
  onToggle: (privileged: boolean) => void;
}

export default function PrivilegedViewToggle({
  privileged,
  onToggle,
}: PrivilegedViewToggleProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={privileged}
        onChange={(e) => onToggle(e.target.checked)}
        className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
      />
      <span className="text-sm font-medium text-gray-700">Privileged View</span>
    </label>
  );
}
