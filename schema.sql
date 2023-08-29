-- @block posts table
CREATE TABLE IF NOT EXISTS posts (
	postId INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	title VARCHAR(255) NOT NULL UNIQUE,
	content TEXT,
	date DATETIME NOT NULL,
	path VARCHAR(255) NOT NULL UNIQUE,
	postType VARCHAR(255) NOT NULL, --should only be shortStories, longStories, or blogs; not enforced
	primaryStory BOOLEAN
);

-- @block postTags table
CREATE TABLE IF NOT EXISTS postTags (
	postId INT NOT NULL,
	tagId int NOT NULL
);

-- @block tags table
CREATE TABLE IF NOT EXISTS tags (
	tagId INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	title VARCHAR(100) NOT NULL UNIQUE
);

-- @block users table
CREATE TABLE IF NOT EXISTS users (
	userId INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	username VARCHAR(100) NOT NULL UNIQUE,
	passwordHash VARCHAR(100) NOT NULL
);
