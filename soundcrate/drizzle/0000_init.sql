CREATE TABLE `daws` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `daws_slug_unique` ON `daws` (`slug`);--> statement-breakpoint
CREATE TABLE `genres` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `genres_slug_unique` ON `genres` (`slug`);--> statement-breakpoint
CREATE TABLE `pack_daws` (
	`pack_id` integer NOT NULL,
	`daw_id` integer NOT NULL,
	PRIMARY KEY(`pack_id`, `daw_id`),
	FOREIGN KEY (`pack_id`) REFERENCES `packs`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`daw_id`) REFERENCES `daws`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `pack_genres` (
	`pack_id` integer NOT NULL,
	`genre_id` integer NOT NULL,
	PRIMARY KEY(`pack_id`, `genre_id`),
	FOREIGN KEY (`pack_id`) REFERENCES `packs`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`genre_id`) REFERENCES `genres`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `pack_synths` (
	`pack_id` integer NOT NULL,
	`synth_id` integer NOT NULL,
	PRIMARY KEY(`pack_id`, `synth_id`),
	FOREIGN KEY (`pack_id`) REFERENCES `packs`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`synth_id`) REFERENCES `synths`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `packs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`brand` text NOT NULL,
	`description` text NOT NULL,
	`price_cents` integer,
	`currency` text DEFAULT 'USD' NOT NULL,
	`image_url` text,
	`preview_url` text,
	`affiliate_url` text NOT NULL,
	`has_midi` integer DEFAULT false NOT NULL,
	`has_presets` integer DEFAULT false NOT NULL,
	`sample_count` integer,
	`size_mb` integer,
	`featured` integer DEFAULT false NOT NULL,
	`clicks` integer DEFAULT 0 NOT NULL,
	`released_at` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `packs_slug_unique` ON `packs` (`slug`);--> statement-breakpoint
CREATE TABLE `synths` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `synths_slug_unique` ON `synths` (`slug`);