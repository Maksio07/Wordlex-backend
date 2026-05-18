-- CREATE TABLE IF NOT EXISTS users(
--     id INT PRIMARY KEY AUTO_INCREMENT,
--     user_name VARCHAR(200) NOT NULL,
--     user_email VARCHAR(300) NOT NULL,
--     user_password VARCHAR(500) NOT NULL,
--     user_keyword VARCHAR(300) NOT NULL
-- );

-- CREATE TABLE IF NOT EXISTS languages(
--     id INT PRIMARY KEY AUTO_INCREMENT,
--     language_name VARCHAR(200) NOT NULL,
--     language_id VARCHAR(200) NOT NULL,
--     language_img_path VARCHAR(2000) NOT NULL
-- );

-- CREATE TABLE IF NOT EXISTS topics(
--     id INT PRIMARY KEY AUTO_INCREMENT,
--     topic_name VARCHAR(500) NOT NULL,
--     topic_polish_name VARCHAR(500) NOT NULL,
--     topic_id VARCHAR(500) NOT NULL
-- );

-- CREATE TABLE IF NOT EXISTS words(
--     id INT PRIMARY KEY AUTO_INCREMENT,
--     word_name VARCHAR(500) NOT NULL,
--     word_polish_name VARCHAR(500) NOT NULL,
--     word_id VARCHAR(500) NOT NULL,
--     word_example TEXT DEFAULT NULL,
--     word_img_path VARCHAR(2000) DEFAULT NULL
-- );

-- CREATE TABLE IF NOT EXISTS admins (
--     id INT PRIMARY KEY AUTO_INCREMENT,
--     admin_name VARCHAR(200) NOT NULL,
--     admin_email VARCHAR(300) NOT NULL,
--     admin_password VARCHAR(500) NOT NULL,
--     admin_keyword VARCHAR(300) NOT NULL
-- );


-- DROP TABLE words;
-- DROP TABLE topics;
-- DROP TABLE languages;
-- DROP TABLE users;


-- CREATE EVENT expire_records_event ON SCHEDULE EVERY 1 HOUR DO DELETE FROM sessions WHERE expires < NOW()


