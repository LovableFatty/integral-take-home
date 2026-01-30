import PIIMask from "./PIIMask";
import FieldLabel from "./FieldLabel";
import { formatDateOfBirth } from "@/utils/format";

interface PersonalInformationSectionProps {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  dateOfBirth: string;
  ssn: string;
  fullAddress: string;
  privileged: boolean;
}

export default function PersonalInformationSection({
  clientName,
  clientEmail,
  clientPhone,
  dateOfBirth,
  ssn,
  fullAddress,
  privileged,
}: PersonalInformationSectionProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Personal Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FieldLabel label="Full Name">{clientName}</FieldLabel>
        <FieldLabel label="Email Address">
          <PIIMask value={clientEmail} type="email" showPrivileged={privileged} />
        </FieldLabel>
        <FieldLabel label="Phone Number">
          <PIIMask value={clientPhone} type="phone" showPrivileged={privileged} />
        </FieldLabel>
        <FieldLabel label="Date of Birth">
          {formatDateOfBirth(dateOfBirth, privileged)}
        </FieldLabel>
        <FieldLabel label="Social Security Number">
          <PIIMask value={ssn} type="ssn" showPrivileged={privileged} />
        </FieldLabel>
        <FieldLabel label="Full Address">
          {privileged ? (
            fullAddress || "—"
          ) : (
            <PIIMask value={fullAddress || ""} type="address" showPrivileged={privileged} />
          )}
        </FieldLabel>
      </div>
    </div>
  );
}
