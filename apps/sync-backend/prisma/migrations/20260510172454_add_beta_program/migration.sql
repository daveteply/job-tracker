-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_login_at" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "plan" TEXT NOT NULL DEFAULT 'beta',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sync_events" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "event_op" TEXT NOT NULL,
    "document_id" TEXT NOT NULL,
    "collection_name" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "version" INTEGER NOT NULL,
    "server_timestamp" BIGINT NOT NULL DEFAULT (extract(epoch from now()) * 1000)::bigint,

    CONSTRAINT "sync_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "beta_applications" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "name" TEXT,
    "reason" TEXT,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "beta_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "beta_tokens" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "token" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3),
    "max_uses" INTEGER NOT NULL DEFAULT 1,
    "uses" INTEGER NOT NULL DEFAULT 0,
    "issued_to_email" TEXT,
    "issued_by" TEXT,
    "notes" TEXT,

    CONSTRAINT "beta_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "idx_user_collection_timestamp" ON "sync_events"("user_id", "collection_name", "server_timestamp");

-- CreateIndex
CREATE INDEX "idx_doc_id" ON "sync_events"("document_id");

-- CreateIndex
CREATE UNIQUE INDEX "beta_applications_email_key" ON "beta_applications"("email");

-- CreateIndex
CREATE UNIQUE INDEX "beta_tokens_token_key" ON "beta_tokens"("token");

-- AddForeignKey
ALTER TABLE "sync_events" ADD CONSTRAINT "sync_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
