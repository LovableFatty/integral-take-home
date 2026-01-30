-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Intake" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "clientName" TEXT NOT NULL,
    "clientEmail" TEXT NOT NULL,
    "clientPhone" TEXT NOT NULL,
    "dateOfBirth" TEXT NOT NULL,
    "ssn" TEXT NOT NULL,
    "fullAddress" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "notes" TEXT,
    "submittedById" TEXT NOT NULL,
    "reviewerId" TEXT,
    CONSTRAINT "Intake_submittedById_fkey" FOREIGN KEY ("submittedById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Intake_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Intake" ("clientEmail", "clientName", "clientPhone", "createdAt", "dateOfBirth", "description", "fullAddress", "id", "notes", "reviewerId", "ssn", "status", "submittedById", "updatedAt") SELECT "clientEmail", "clientName", "clientPhone", "createdAt", "dateOfBirth", "description", "fullAddress", "id", "notes", "reviewerId", "ssn", "status", "submittedById", "updatedAt" FROM "Intake";
DROP TABLE "Intake";
ALTER TABLE "new_Intake" RENAME TO "Intake";
CREATE INDEX "Intake_status_idx" ON "Intake"("status");
CREATE INDEX "Intake_submittedById_idx" ON "Intake"("submittedById");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "organization" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "email", "id", "name", "organization", "password", "role", "updatedAt") SELECT "createdAt", "email", "id", "name", "organization", "password", "role", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
