-- CreateTable
CREATE TABLE "admin_users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "participants" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "participantCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "occupation" TEXT NOT NULL,
    "governmentWebsiteExperience" BOOLEAN NOT NULL,
    "disnakertransExperience" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "study_phases" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "phaseNumber" INTEGER NOT NULL,
    "phaseName" TEXT NOT NULL,
    "instrument" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "startDate" DATETIME,
    "endDate" DATETIME,
    "participantMode" TEXT NOT NULL DEFAULT 'SAME_ONLY',
    "externalUrl" TEXT,
    "instructions" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "phase_tasks" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "phaseId" INTEGER NOT NULL,
    "taskCode" TEXT NOT NULL,
    "feature" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "expectedResult" TEXT,
    "acceptanceCriteria" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "phase_tasks_phaseId_fkey" FOREIGN KEY ("phaseId") REFERENCES "study_phases" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "sus_responses" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "participantId" INTEGER NOT NULL,
    "phaseId" INTEGER NOT NULL,
    "q1" INTEGER NOT NULL,
    "q2" INTEGER NOT NULL,
    "q3" INTEGER NOT NULL,
    "q4" INTEGER NOT NULL,
    "q5" INTEGER NOT NULL,
    "q6" INTEGER NOT NULL,
    "q7" INTEGER NOT NULL,
    "q8" INTEGER NOT NULL,
    "q9" INTEGER NOT NULL,
    "q10" INTEGER NOT NULL,
    "susScore" REAL NOT NULL,
    "fb1" TEXT,
    "fb2" TEXT,
    "fb3" TEXT,
    "fb4" TEXT,
    "fb5" TEXT,
    "fb6" TEXT,
    "completedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "sus_responses_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "participants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "sus_responses_phaseId_fkey" FOREIGN KEY ("phaseId") REFERENCES "study_phases" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ueq_responses" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "participantId" INTEGER NOT NULL,
    "phaseId" INTEGER NOT NULL,
    "item1" INTEGER NOT NULL,
    "item2" INTEGER NOT NULL,
    "item3" INTEGER NOT NULL,
    "item4" INTEGER NOT NULL,
    "item5" INTEGER NOT NULL,
    "item6" INTEGER NOT NULL,
    "item7" INTEGER NOT NULL,
    "item8" INTEGER NOT NULL,
    "item9" INTEGER NOT NULL,
    "item10" INTEGER NOT NULL,
    "item11" INTEGER NOT NULL,
    "item12" INTEGER NOT NULL,
    "item13" INTEGER NOT NULL,
    "item14" INTEGER NOT NULL,
    "item15" INTEGER NOT NULL,
    "item16" INTEGER NOT NULL,
    "item17" INTEGER NOT NULL,
    "item18" INTEGER NOT NULL,
    "item19" INTEGER NOT NULL,
    "item20" INTEGER NOT NULL,
    "item21" INTEGER NOT NULL,
    "item22" INTEGER NOT NULL,
    "item23" INTEGER NOT NULL,
    "item24" INTEGER NOT NULL,
    "item25" INTEGER NOT NULL,
    "item26" INTEGER NOT NULL,
    "attractiveness" REAL NOT NULL,
    "perspicuity" REAL NOT NULL,
    "efficiency" REAL NOT NULL,
    "dependability" REAL NOT NULL,
    "stimulation" REAL NOT NULL,
    "novelty" REAL NOT NULL,
    "completedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ueq_responses_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "participants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ueq_responses_phaseId_fkey" FOREIGN KEY ("phaseId") REFERENCES "study_phases" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "uat_task_responses" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "participantId" INTEGER NOT NULL,
    "phaseId" INTEGER NOT NULL,
    "taskId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "notes" TEXT,
    "completedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "uat_task_responses_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "participants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "uat_task_responses_phaseId_fkey" FOREIGN KEY ("phaseId") REFERENCES "study_phases" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "uat_task_responses_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "phase_tasks" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "uat_overall_feedback" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "participantId" INTEGER NOT NULL,
    "phaseId" INTEGER NOT NULL,
    "rating1" INTEGER NOT NULL,
    "rating2" INTEGER NOT NULL,
    "rating3" INTEGER NOT NULL,
    "meanRating" REAL NOT NULL,
    "completedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "uat_overall_feedback_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "participants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "uat_overall_feedback_phaseId_fkey" FOREIGN KEY ("phaseId") REFERENCES "study_phases" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "participants_participantCode_key" ON "participants"("participantCode");

-- CreateIndex
CREATE UNIQUE INDEX "study_phases_phaseNumber_key" ON "study_phases"("phaseNumber");

-- CreateIndex
CREATE UNIQUE INDEX "sus_responses_participantId_phaseId_key" ON "sus_responses"("participantId", "phaseId");

-- CreateIndex
CREATE UNIQUE INDEX "ueq_responses_participantId_phaseId_key" ON "ueq_responses"("participantId", "phaseId");

-- CreateIndex
CREATE UNIQUE INDEX "uat_task_responses_participantId_phaseId_taskId_key" ON "uat_task_responses"("participantId", "phaseId", "taskId");

-- CreateIndex
CREATE UNIQUE INDEX "uat_overall_feedback_participantId_phaseId_key" ON "uat_overall_feedback"("participantId", "phaseId");
