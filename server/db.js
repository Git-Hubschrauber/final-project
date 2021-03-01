const spicedPg = require("spiced-pg");

let db;
if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    db = spicedPg("postgres:postgres:postgres@localhost:5432/registered_users");
}

//
//
//Register

module.exports.addRegistration = (first, last, email, password) => {
    const q = `INSERT INTO registered_users (first, last, email, password)
    VALUES ($1,$2,$3, $4) RETURNING id`;
    const params = [first, last, email, password];
    return db.query(q, params);
};

//Login Page

module.exports.checkEmailRegistration = (email) => {
    const q = `SELECT email FROM registered_users where email = ($1)`;
    const params = [email];
    return db.query(q, params);
};

module.exports.getPassword = (email) => {
    const q = `SELECT password FROM registered_users where email = ($1)`;
    const params = [email];
    return db.query(q, params);
};

module.exports.getRegId = (email) => {
    const q = `SELECT id FROM registered_users where email = ($1)`;
    const params = [email];
    return db.query(q, params);
};

module.exports.saveSecretCode = (email, secretCode) => {
    const q = `INSERT INTO reset_password (email, code)
    VALUES ($1,$2)`;
    const params = [email, secretCode];
    return db.query(q, params);
};

module.exports.checkCode = (code, email) => {
    const q = `SELECT * FROM reset_password
    WHERE code = ($1) AND email = ($2) AND (CURRENT_TIMESTAMP - timestamp < INTERVAL '10 MINUTES')`;
    const params = [code, email];
    return db.query(q, params);
};

module.exports.insertNewPW = (email, password) => {
    const q = `UPDATE registered_users SET password = ($2) WHERE email =($1)`;
    const params = [email, password];
    return db.query(q, params);
};

module.exports.insertProfileData = (id, age, username, sex, hobbies, about) => {
    const q = `INSERT INTO editProfileData ( profileOwner_id,
        age,
        username,
        sex,
        hobbies,
        about)
    VALUES (($1), ($2), ($3), ($4), ($5), ($6)) ON CONFLICT (profileOwner_id) DO UPDATE SET age=($2), username=($3), sex=($4), hobbies=($5), about=($6)`;
    const params = [id, age, username, sex, hobbies, about];
    return db.query(q, params);
};

module.exports.updateName = (id, inputFirst, inputLast) => {
    const q = `UPDATE registered_users SET first = ($2), last = ($3) WHERE id = ($1)`;
    const params = [id, inputFirst, inputLast];
    return db.query(q, params);
};

module.exports.updateProfilePic = (id, profilePic) => {
    const q = `UPDATE registered_users SET profilePic = ($2) WHERE id =($1)`;
    const params = [id, profilePic];
    return db.query(q, params);
};

module.exports.deleteImage = (id, def) => {
    const q = `UPDATE users SET profile_pic_url = ($2) WHERE id =($1)`;
    const params = [id, def];
    return db.query(q, params);
};

module.exports.getAllUserInfo1 = (id) => {
    const q = `SELECT *
    FROM registered_users WHERE registered_users.id = ($1)`;
    const params = [id];
    return db.query(q, params);
};

module.exports.getAllUserInfo2 = (id) => {
    const q = `SELECT *
    FROM editProfileData WHERE profileOwner_id = ($1)`;
    const params = [id];
    return db.query(q, params);
};

module.exports.getDayInfo = (id, date) => {
    const q = `SELECT *
    FROM diaryData WHERE diaryOwner_id = ($1) AND diary_date = ($2)`;
    const params = [id, date];
    return db.query(q, params);
};

module.exports.insertDiaryInfo = (id, date, inputFields) => {
    const q = `INSERT INTO diaryData (diaryOwner_id, diary_date, inputFields) VALUES (($1), ($2), ($3))`;
    const params = [id, date, inputFields];
    return db.query(q, params);
};
module.exports.getDiaryEntries = (id) => {
    const q = `SELECT *
    FROM diaryData WHERE diaryOwner_id = ($1)`;
    const params = [id];
    return db.query(q, params);
};

module.exports.getEntryDays = (id) => {
    const q = `SELECT diary_date
    FROM diaryData WHERE diaryOwner_id = ($1)`;
    const params = [id];
    return db.query(q, params);
};

module.exports.insertPictureData = (id, date, pictures) => {
    const q = `INSERT INTO pictureData (pictureOwner_id, pic_date, pictures) VALUES (($1), ($2), ($3))`;
    const params = [id, date, pictures];
    return db.query(q, params);
};

module.exports.getImagesForDayInfo = (id, date) => {
    const q = `SELECT * FROM pictureData WHERE pictureOwner_id = ($1) AND pic_date= ($2)`;
    const params = [id, date];
    return db.query(q, params);
};
