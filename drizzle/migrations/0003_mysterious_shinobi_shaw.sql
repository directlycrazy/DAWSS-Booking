CREATE TABLE `seat` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`booked_to` text,
	`table_id` integer,
	FOREIGN KEY (`booked_to`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`table_id`) REFERENCES `table`(`id`) ON UPDATE no action ON DELETE no action
);
