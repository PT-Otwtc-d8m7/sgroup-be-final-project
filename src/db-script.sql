USE testdatabase;

CREATE TABLE user (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  gender boolean NOT NULL,
  age VARCHAR(100) NOT NULL,
  salt VARCHAR(255) NOT NULL,
  passwordResetToken VARCHAR(255) NOT NULL,
  passwordResetExpiration VARCHAR(255) NOT NULL
);

CREATE TABLE polls (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  user_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE options (
  id INT AUTO_INCREMENT PRIMARY KEY,
  poll_id INT,
  text VARCHAR(255) NOT NULL,
  FOREIGN KEY (poll_id) REFERENCES polls(id)
);

CREATE TABLE votes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  option_id INT,
  FOREIGN KEY (user_id) REFERENCES user(id),
  FOREIGN KEY (option_id) REFERENCES options(id),
  UNIQUE KEY unique_vote (user_id, option_id)
);