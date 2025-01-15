import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `roshanbounty_${name}`);

export const posts = createTable(
  "post",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    name: varchar("name", { length: 256 }),
    createdById: varchar("created_by", { length: 255 })
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  },
  (example) => ({
    createdByIdIdx: index("created_by_idx").on(example.createdById),
    nameIndex: index("name_idx").on(example.name),
  })
);
export const projects = createTable("projects", {
  id: varchar("id", { length: 255 }).primaryKey().notNull(), // Unique identifier
  projectId: varchar("project_id", { length: 255 }).unique().notNull(), // Unique project ID
  title: varchar("title", { length: 255 }).notNull(), // Title of the project
  description: text("description").notNull(), // Detailed description of the project
  reward: varchar("reward", { length: 50 }).notNull(), // Reward value
  deadline: timestamp("deadline").notNull(), // Deadline for the project
  isCompleted: boolean("is_completed").default(false).notNull(), // Boolean indicating if the project is completed
});
export const cretfiedAuditors = createTable("certified_auditors", {
  id: varchar("id", { length: 255 })
  .notNull()
  .primaryKey()
  .$defaultFn(() => crypto.randomUUID()),
name: varchar("name", { length: 255 }),
email: varchar("email", { length: 255 }).notNull(),
emailVerified: timestamp("email_verified", {
  mode: "date",
  withTimezone: true,
}).default(sql`CURRENT_TIMESTAMP`),
image: varchar("image", { length: 255 }),
})

export const submissions = createTable("submissions", {
  id: varchar("id", { length: 255 }).primaryKey().notNull(), // Unique identifier for the record
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id), // Foreign key referencing users table
  projectId: varchar("project_id", { length: 255 })
    .notNull()
    .references(() => projects.projectId), // Foreign key referencing projects table
  demoLink: varchar("demo_link", { length: 512 }), // Link to the demo application
  demoVideo: varchar("demo_video", { length: 512 }), // Link to the demo video
  githubRepo: varchar("github_repo", { length: 512 }),
  isShortListed : boolean("isShortListed").default(false) , 
  isWinner : boolean("isWinner").default(false)
});

export const users = createTable("user", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("email_verified", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_user_id_idx").on(account.userId),
  })
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("session_token", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_user_id_idx").on(session.userId),
  })
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);
