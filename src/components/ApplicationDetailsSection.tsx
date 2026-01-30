import FieldLabel from "./FieldLabel";

interface ApplicationDetailsSectionProps {
  description: string;
  notes: string | null;
}

export default function ApplicationDetailsSection({
  description,
  notes,
}: ApplicationDetailsSectionProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Application Details
      </h3>
      <div className="space-y-4">
        {description && (
          <FieldLabel label="Description">
            <p className="whitespace-pre-wrap">{description}</p>
          </FieldLabel>
        )}
        {notes && (
          <FieldLabel label="Notes">
            <p className="whitespace-pre-wrap">{notes}</p>
          </FieldLabel>
        )}
      </div>
    </div>
  );
}
