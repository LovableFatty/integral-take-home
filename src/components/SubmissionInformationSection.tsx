import FieldLabel from "./FieldLabel";

interface SubmissionInformationSectionProps {
  submittedBy: {
    name: string;
    email: string;
  };
  reviewer: {
    name: string;
    email: string;
  } | null;
}

export default function SubmissionInformationSection({
  submittedBy,
  reviewer,
}: SubmissionInformationSectionProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Submission Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FieldLabel label="Submitted By">
          <p>{submittedBy.name}</p>
          <p className="text-xs text-gray-500">{submittedBy.email}</p>
        </FieldLabel>
        {reviewer && (
          <FieldLabel label="Reviewer">
            <p>{reviewer.name}</p>
            <p className="text-xs text-gray-500">{reviewer.email}</p>
          </FieldLabel>
        )}
      </div>
    </div>
  );
}
