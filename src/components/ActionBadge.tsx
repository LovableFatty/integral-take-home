interface ActionBadgeProps {
  action: string;
  className?: string;
}

export default function ActionBadge({ action, className = "" }: ActionBadgeProps) {
  const getActionConfig = (actionType: string) => {
    const normalized = actionType.toUpperCase();
    
    switch (normalized) {
      case "CREATED":
        return {
          label: "Created",
          bgColor: "bg-blue-100",
          textColor: "text-blue-800",
          borderColor: "border-blue-200",
        };
      case "STATUS_CHANGED":
        return {
          label: "Status Changed",
          bgColor: "bg-purple-100",
          textColor: "text-purple-800",
          borderColor: "border-purple-200",
        };
      case "VIEWED":
        return {
          label: "Viewed",
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
          borderColor: "border-gray-200",
        };
      case "ASSIGNED":
        return {
          label: "Assigned",
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-800",
          borderColor: "border-yellow-200",
        };
      case "DOCUMENT_UPLOADED":
        return {
          label: "Document Uploaded",
          bgColor: "bg-green-100",
          textColor: "text-green-800",
          borderColor: "border-green-200",
        };
      case "PRIVILEGED_VIEW_ACCESSED":
        return {
          label: "PII View Accessed",
          bgColor: "bg-orange-100",
          textColor: "text-orange-800",
          borderColor: "border-orange-200",
        };
      default:
        return {
          label: actionType,
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
          borderColor: "border-gray-200",
        };
    }
  };

  const config = getActionConfig(action);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bgColor} ${config.textColor} ${config.borderColor} ${className}`}
    >
      {config.label}
    </span>
  );
}
