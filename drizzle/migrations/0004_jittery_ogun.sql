CREATE TABLE `log` (
	`id` text PRIMARY KEY NOT NULL,
	`message` text NOT NULL,
	`initiator` text,
	`created_at` integer
);
