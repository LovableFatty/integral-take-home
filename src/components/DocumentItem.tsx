import { getDocumentTypeLabel } from "@/utils/documents";

interface DocumentItemProps {
  id: string;
  fileName: string;
  documentType: string;
  onDownload: (id: string) => void;
}

export default function DocumentItem({
  id,
  fileName,
  documentType,
  onDownload,
}: DocumentItemProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{fileName}</p>
          <p className="text-xs text-gray-500">
            {getDocumentTypeLabel(documentType)}
          </p>
        </div>
      </div>
      <button
        onClick={() => onDownload(id)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        aria-label={`Download ${fileName}`}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        Download
      </button>
    </div>
  );
}
