/*
  Warnings:

  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "sync_events" DROP CONSTRAINT "sync_events_user_id_fkey";

-- AlterTable
ALTER TABLE "sync_events" ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ALTER COLUMN "server_timestamp" SET DEFAULT (extract(epoch from now()) * 1000)::bigint;

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "sync_events" ADD CONSTRAINT "sync_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
