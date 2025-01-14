CREATE TABLE IF NOT EXISTS "roshanbounty_projectDetails" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"project_id" varchar(255) NOT NULL,
	"demo_link" varchar(512),
	"demo_video" varchar(512),
	"github_repo" varchar(512)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roshanbounty_projects" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"project_id" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"reward" varchar(50) NOT NULL,
	"deadline" timestamp NOT NULL,
	"is_completed" boolean DEFAULT false NOT NULL,
	CONSTRAINT "roshanbounty_projects_project_id_unique" UNIQUE("project_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "roshanbounty_projectDetails" ADD CONSTRAINT "roshanbounty_projectDetails_user_id_roshanbounty_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."roshanbounty_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "roshanbounty_projectDetails" ADD CONSTRAINT "roshanbounty_projectDetails_project_id_roshanbounty_projects_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."roshanbounty_projects"("project_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
