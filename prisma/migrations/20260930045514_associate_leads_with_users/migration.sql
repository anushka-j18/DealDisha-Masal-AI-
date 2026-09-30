/*
  Warnings:

  - Added the required column `userId` to the `Lead` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Lead" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "propertyRequirement" TEXT NOT NULL,
    "budget" TEXT NOT NULL,
    "buyingTimeline" TEXT NOT NULL,
    "customerMessage" TEXT NOT NULL,
    "score" INTEGER,
    "priority" TEXT,
    "analysis" TEXT,
    "nextMove" TEXT,
    "chatHistory" TEXT,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT NOT NULL,
    CONSTRAINT "Lead_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Lead" ("analysis", "budget", "buyingTimeline", "chatHistory", "createdAt", "customerMessage", "customerName", "id", "location", "nextMove", "priority", "propertyRequirement", "score", "updatedAt") SELECT "analysis", "budget", "buyingTimeline", "chatHistory", "createdAt", "customerMessage", "customerName", "id", "location", "nextMove", "priority", "propertyRequirement", "score", "updatedAt" FROM "Lead";
DROP TABLE "Lead";
ALTER TABLE "new_Lead" RENAME TO "Lead";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
