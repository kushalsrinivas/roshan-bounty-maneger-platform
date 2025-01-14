ALTER TABLE "roshanbounty_projectDetails" RENAME TO "roshanbounty_submissions";--> statement-breakpoint
ALTER TABLE "roshanbounty_submissions" DROP CONSTRAINT "roshanbounty_projectDetails_user_id_roshanbounty_user_id_fk";
--> statement-breakpoint
ALTER TABLE "roshanbounty_submissions" DROP CONSTRAINT "roshanbounty_projectDetails_project_id_roshanbounty_projects_project_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "roshanbounty_submissions" ADD CONSTRAINT "roshanbounty_submissions_user_id_roshanbounty_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."roshanbounty_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "roshanbounty_submissions" ADD CONSTRAINT "roshanbounty_submissions_project_id_roshanbounty_projects_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."roshanbounty_projects"("project_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
