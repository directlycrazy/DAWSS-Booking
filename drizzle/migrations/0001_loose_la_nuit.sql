DROP TABLE `seat`;--> statement-breakpoint
DROP INDEX `user_seat_id_unique`;--> statement-breakpoint
ALTER TABLE `user` ADD `table_id` integer;--> statement-breakpoint
CREATE UNIQUE INDEX `user_table_id_unique` ON `user` (`table_id`);--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `seat_id`;