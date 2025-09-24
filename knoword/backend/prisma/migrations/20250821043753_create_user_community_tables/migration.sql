-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "communities";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "users";

-- CreateEnum
CREATE TYPE "communities"."CommunityRole" AS ENUM ('ADMIN', 'MODERATOR', 'MEMBER');

-- CreateTable
CREATE TABLE "users"."users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "realName" TEXT NOT NULL,
    "avatar" TEXT,
    "bio" TEXT,
    "emailVerificationToken" TEXT,
    "emailVerificationExpiresAt" TIMESTAMP(3),
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "passwordResetToken" TEXT,
    "passwordResetExpiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "communities"."communities" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "avatar" TEXT,
    "banner" TEXT,
    "isPrivate" BOOLEAN NOT NULL DEFAULT true,
    "createdById" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "communities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "communities"."community_members" (
    "userId" INTEGER NOT NULL,
    "communityId" INTEGER NOT NULL,
    "role" "communities"."CommunityRole" NOT NULL DEFAULT 'MEMBER',

    CONSTRAINT "community_members_pkey" PRIMARY KEY ("userId","communityId")
);

-- CreateTable
CREATE TABLE "communities"."tags" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "communities"."_CommunityToTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CommunityToTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"."users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_emailVerificationToken_key" ON "users"."users"("emailVerificationToken");

-- CreateIndex
CREATE UNIQUE INDEX "users_passwordResetToken_key" ON "users"."users"("passwordResetToken");

-- CreateIndex
CREATE INDEX "users_deletedAt_idx" ON "users"."users"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "communities_name_key" ON "communities"."communities"("name");

-- CreateIndex
CREATE INDEX "communities_deletedAt_createdById_idx" ON "communities"."communities"("deletedAt", "createdById");

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "communities"."tags"("name");

-- CreateIndex
CREATE INDEX "_CommunityToTag_B_index" ON "communities"."_CommunityToTag"("B");

-- AddForeignKey
ALTER TABLE "communities"."communities" ADD CONSTRAINT "communities_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communities"."community_members" ADD CONSTRAINT "community_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communities"."community_members" ADD CONSTRAINT "community_members_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "communities"."communities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communities"."_CommunityToTag" ADD CONSTRAINT "_CommunityToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "communities"."communities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communities"."_CommunityToTag" ADD CONSTRAINT "_CommunityToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "communities"."tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
