DROP TABLE IF EXISTS reset_password;
DROP TABLE IF EXISTS pictureData;
DROP TABLE IF EXISTS diaryData;
DROP TABLE IF EXISTS editProfileData;
DROP TABLE IF EXISTS registered_users;


CREATE TABLE registered_users (
      id SERIAL PRIMARY KEY,
      first VARCHAR(255) NOT NULL CHECK (first !=''),
      last VARCHAR(255) NOT NULL CHECK (last !=''),
      email VARCHAR(255) NOT NULL UNIQUE CHECK (email !=''),
      password VARCHAR(255) NOT NULL  CHECK (password !=''),
      profilePic VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reset_password(
    id SERIAL PRIMARY KEY,
    email VARCHAR NOT NULL CHECK (email !=''),
    code VARCHAR NOT NULL CHECK (code !=''),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE editProfileData(
    id SERIAL PRIMARY KEY,
    profileOwner_id INTEGER UNIQUE REFERENCES registered_users(id) NOT NULL,
    age VARCHAR(255),
    username VARCHAR(255),
    sex VARCHAR(255),
    hobbies VARCHAR(255),
    about VARCHAR(255)
);

CREATE TABLE diaryData(
    id SERIAL PRIMARY KEY,
    diaryOwner_id INTEGER,
    diary_date VARCHAR(255),
    inputFields VARCHAR[]
);


CREATE TABLE pictureData(
    id SERIAL PRIMARY KEY,
    pictureOwner_id INTEGER,
    pic_date VARCHAR(255),
    pictures VARCHAR[]
);