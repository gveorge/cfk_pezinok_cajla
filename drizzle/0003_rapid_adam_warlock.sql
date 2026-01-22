CREATE TABLE `membership_payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`player_id` int NOT NULL,
	`year` int NOT NULL,
	`month` int NOT NULL,
	`paid` int NOT NULL DEFAULT 0,
	`amount` int,
	`paid_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `membership_payments_id` PRIMARY KEY(`id`)
);
