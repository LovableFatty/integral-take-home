import DocumentItem from "./DocumentItem";
import { Document } from "@/types/intake";

interface DocumentsSectionProps {
  documents: Document[];
  onDownload: (documentId: string) => void;
  onDownloadAll: () => void;
}

export default function DocumentsSection({
  documents,
  onDownload,
  onDownloadAll,
}: DocumentsSectionProps) {
  if (documents.length === 0) {
    return null;
  }

  // TODO: Implement download all logic
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Supporting Documents ({documents.length})
        </h3>
        <button
          onClick={onDownloadAll}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
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
          Download All
        </button>
      </div>
      <div className="space-y-2">
        {documents.map((doc) => (
          <DocumentItem
            key={doc.id}
            id={doc.id}
            fileName={doc.fileName}
            documentType={doc.documentType}
            onDownload={onDownload}
          />
        ))}
      </div>
    </div>
  );
}
