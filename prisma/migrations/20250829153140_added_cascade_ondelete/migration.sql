-- DropForeignKey
ALTER TABLE "public"."Upvotes" DROP CONSTRAINT "Upvotes_streamId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Upvotes" ADD CONSTRAINT "Upvotes_streamId_fkey" FOREIGN KEY ("streamId") REFERENCES "public"."Stream"("id") ON DELETE CASCADE ON UPDATE CASCADE;
