CREATE TABLE `table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL
);
--> statement-breakpoint
ALTER TABLE `user` ADD `role` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `user` ADD `attending` integer DEFAULT false;