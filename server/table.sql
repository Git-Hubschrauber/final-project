DROP TABLE IF EXISTS reset_password;
DROP TABLE IF EXISTS registered_users;


CREATE TABLE registered_users (
      id SERIAL PRIMARY KEY,
      first VARCHAR(255) NOT NULL CHECK (first !=''),
      last VARCHAR(255) NOT NULL CHECK (last !=''),
      email VARCHAR(255) NOT NULL UNIQUE CHECK (email !=''),
      password VARCHAR(255) NOT NULL  CHECK (password !=''),
      profile_pic_url VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reset_password(
    id SERIAL PRIMARY KEY,
    email VARCHAR NOT NULL CHECK (email !=''),
    code VARCHAR NOT NULL CHECK (code !=''),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);