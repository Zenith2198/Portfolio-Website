-- @block posts table
CREATE TABLE IF NOT EXISTS posts (
	postId INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	title VARCHAR(255) NOT NULL UNIQUE,
	dateModified INT NOT NULL, --unix time in seconds
	datePosted INT NOT NULL, --unix time in seconds
	path VARCHAR(255) NOT NULL UNIQUE,
	postType VARCHAR(255) NOT NULL, --should only be shortStories, longStories, or blogs; not enforced
	primaryStory BOOLEAN,
	image VARCHAR(255)
);

-- @block create new table
CREATE TABLE IF NOT EXISTS chapters (
	postId INT NOT NULL,
	number INT NOT NULL,
	title VARCHAR(255),
	content TEXT NOT NULL,
	PRIMARY KEY (postId, number),
	FOREIGN KEY (postId) REFERENCES posts(postId)
);

-- @block postTags table
CREATE TABLE IF NOT EXISTS postTags (
	postId INT NOT NULL,
	tagId int NOT NULL,
	FOREIGN KEY (postId) REFERENCES posts(postId),
	FOREIGN KEY (tagId) REFERENCES tags(tagId)
);

-- @block tags table
CREATE TABLE IF NOT EXISTS tags (
	tagId INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	title VARCHAR(100) NOT NULL UNIQUE
);

-- @block users table
CREATE TABLE IF NOT EXISTS users (
	userId INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(100) NOT NULL UNIQUE,
	passwordHash VARCHAR(50) NOT NULL,
	role VARCHAR(255)
);
