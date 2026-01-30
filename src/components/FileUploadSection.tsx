"use client";

interface FileUploadSectionProps {
  files: File[];
  fileTypes: Record<string, string>;
  onFilesChange: (files: File[]) => void;
  onFileTypesChange: (fileTypes: Record<string, string>) => void;
}

/**
 * Generates a unique key for each file based on name, size, lastModified, and index
 */
export function getFileKey(file: File, index: number): string {
  return `${file.name}-${file.size}-${file.lastModified}-${index}`;
}

export default function FileUploadSection({
  files,
  fileTypes,
  onFilesChange,
  onFileTypesChange,
}: FileUploadSectionProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const combined = [...files];
      newFiles.forEach((newFile) => {
        const exists = files.some(
          (existingFile) =>
            existingFile.name === newFile.name &&
            existingFile.size === newFile.size &&
            existingFile.lastModified === newFile.lastModified
        );
        if (!exists) {
          combined.push(newFile);
        }
      });

      const updatedTypes = { ...fileTypes };
      combined.forEach((file, index) => {
        const key = getFileKey(file, index);
        if (!updatedTypes[key]) {
          updatedTypes[key] = "OTHER";
        }
      });

      onFilesChange(combined);
      onFileTypesChange(updatedTypes);

      // Reset the input so the same file can be selected again if needed
      e.target.value = "";
    }
  };

  const handleFileTypeChange = (fileKey: string, type: string) => {
    onFileTypesChange({ ...fileTypes, [fileKey]: type });
  };

  const handleRemoveFile = (fileKey: string, index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    const updatedTypes = { ...fileTypes };
    delete updatedTypes[fileKey];
    onFilesChange(updatedFiles);
    onFileTypesChange(updatedTypes);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm sm:text-base font-semibold text-gray-900 border-b border-gray-200 pb-2">
        Supporting Documents
      </h3>

      <div>
        <label
          htmlFor="documents"
          className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
        >
          Upload Documents <span className="text-gray-500 text-xs">(Optional)</span>
        </label>
        <p className="text-xs text-gray-500 mb-2">
          Medical records, insurance cards, prescriptions, ID photos, etc. (PDF, JPG, PNG, DOC, DOCX - Max 10MB per file)
        </p>
        <input
          id="documents"
          type="file"
          multiple
          onChange={handleFileChange}
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
        />
        {files.length > 0 && (
          <div className="mt-3 space-y-3">
            {files.map((file, index) => {
              const fileKey = getFileKey(file, index);
              return (
                <div key={fileKey} className="p-3 bg-gray-50 rounded-md border border-gray-200">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm font-medium text-gray-700">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(fileKey, index)}
                      className="ml-2 text-red-600 hover:text-red-800 text-xs sm:text-sm font-medium"
                      aria-label="Remove file"
                    >
                      Remove
                    </button>
                  </div>
                  <label
                    htmlFor={`fileType-${fileKey}`}
                    className="block text-xs text-gray-600 mb-1"
                  >
                    Document Type
                  </label>
                  <select
                    id={`fileType-${fileKey}`}
                    value={fileTypes[fileKey] || "OTHER"}
                    onChange={(e) => handleFileTypeChange(fileKey, e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                  >
                    <option value="MEDICAL_RECORD">Medical Record</option>
                    <option value="INSURANCE_CARD">Insurance Card</option>
                    <option value="PRESCRIPTION">Prescription</option>
                    <option value="ID">ID</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
