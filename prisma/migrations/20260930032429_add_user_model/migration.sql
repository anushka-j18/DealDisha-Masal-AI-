-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    "updatedAt" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
