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
    const q = `UPDATE registered_users SET profilePic = ($2) WHERE id =($1)`;
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

module.exports.getEntryDays1 = (id) => {
    const q = `SELECT diary_date
    FROM diaryData WHERE diaryOwner_id = ($1)`;
    const params = [id];
    return db.query(q, params);
};

module.exports.getEntryDays2 = (id) => {
    const q = `SELECT pic_date
    FROM pictureData WHERE pictureOwner_id = ($1)`;
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

module.exports.getAllPictures = (id) => {
    const q = `SELECT * FROM pictureData WHERE pictureOwner_id = ($1)`;
    const params = [id];
    return db.query(q, params);
};
module.exports.getAllEntries = (id) => {
    const q = `SELECT * FROM diaryData WHERE diaryOwner_id = ($1)`;
    const params = [id];
    return db.query(q, params);
};

//
//
//

module.exports.getUserInfo = (id) => {
    const q = `SELECT * FROM registered_users
    WHERE id = ($1)`;
    const params = [id];
    return db.query(q, params);
};

// module.exports.getUserInfo = (id) => {
//     const q = `SELECT *
//     FROM  editProfileData
//     JOIN registered_users ON (registered_users.id = ($1) OR editProfileData.profileOwner_id = ($1))`;
//     const params = [id];
//     return db.query(q, params);
// };

module.exports.searchUsers = (val) => {
    const q = `SELECT * FROM registered_users WHERE first ILIKE ($1) ORDER BY first ASC LIMIT 5`;
    const params = [val + "%"];
    return db.query(q, params);
};

module.exports.getFriendshipStatus = (sender_id, recipient_id) => {
    const q = `SELECT * FROM friendships WHERE (recipient_id = ($1) AND sender_id = ($2)) OR (recipient_id = ($2) AND sender_id = ($1))`;
    const params = [sender_id, recipient_id];
    return db.query(q, params);
};

module.exports.makeFriendship = (sender_id, recipient_id) => {
    const q = `INSERT INTO friendships (sender_id, recipient_id, accepted) VALUES (($1),($2), FALSE)`;
    const params = [sender_id, recipient_id];
    return db.query(q, params);
};

module.exports.acceptFriendship = (sender_id, recipient_id) => {
    const q = `UPDATE friendships SET accepted = TRUE WHERE (sender_id = ($1) AND recipient_id = ($2))`;
    const params = [sender_id, recipient_id];
    return db.query(q, params);
};

module.exports.cancelFriendship = (sender_id, recipient_id) => {
    const q = `DELETE FROM friendships WHERE (recipient_id = ($1) AND sender_id = ($2)) OR (recipient_id = ($2) AND sender_id = ($1))`;
    const params = [sender_id, recipient_id];
    return db.query(q, params);
};

module.exports.getFriends = (id) => {
    const q = `Select * FROM friendships WHERE (sender_id = ($1) AND accepted = TRUE) OR (recipient_id = ($1) AND accepted = TRUE)`;
    const params = [id];
    return db.query(q, params);
};

module.exports.getFriendsandRequests = (id) => {
    const q = `SELECT registered_users.id, first, last, profilePic, accepted, sender_id, recipient_id 
    FROM friendships
    JOIN registered_users
    ON (recipient_id = $1 AND sender_id = registered_users.id)
    OR (sender_id = $1 AND recipient_id = registered_users.id)`;
    const params = [id];
    return db.query(q, params);
};

module.exports.getOthersFriends = (id) => {
    const q = `SELECT registered_users.id, first, last, profilePic, accepted, sender_id, recipient_id 
    FROM friendships
    JOIN registered_users
    ON (recipient_id = $1 AND sender_id = registered_users.id AND accepted = TRUE)
    OR (sender_id = $1 AND recipient_id = registered_users.id AND accepted = TRUE)`;
    const params = [id];
    return db.query(q, params);
};

//
//
//

module.exports.getOnlineUsers = (elem) => {
    const q = `Select * FROM registered_users WHERE id = ANY($1)`;
    const params = [elem];
    return db.query(q, params);
};

module.exports.getFriendsandRequests = (id) => {
    const q = `SELECT registered_users.id, first, last, profilePic, accepted, sender_id, recipient_id 
    FROM friendships
    JOIN registered_users
    ON (recipient_id = $1 AND sender_id = registered_users.id)
    OR (sender_id = $1 AND recipient_id = registered_users.id)`;
    const params = [id];
    return db.query(q, params);
};

module.exports.getOthersFriends = (id) => {
    const q = `SELECT registered_users.id, first, last, profilePic, accepted, sender_id, recipient_id 
    FROM friendships
    JOIN registered_users
    ON (recipient_id = $1 AND sender_id = registered_users.id AND accepted = TRUE)
    OR (sender_id = $1 AND recipient_id = registered_users.id AND accepted = TRUE)`;
    const params = [id];
    return db.query(q, params);
};

module.exports.getLastMessages = () => {
    const q = `SELECT first, last, profilePic, chat.id, mes_sender_id, sent_message, sent_timestamp
    FROM chat
    JOIN registered_users ON (mes_sender_id = registered_users.id) ORDER BY chat.id DESC LIMIT 10`;
    return db.query(q);
};

module.exports.insertMessage = (sender_id, message) => {
    const q = `INSERT INTO chat (mes_sender_id, sent_message) VALUES (($1),($2))`;
    const params = [sender_id, message];
    return db.query(q, params);
};

module.exports.getLastMessageInfo = () => {
    const q = `SELECT first, last, profilePic, chat.id, mes_sender_id, sent_message, sent_timestamp
    FROM chat
    JOIN registered_users ON (mes_sender_id = registered_users.id) ORDER BY chat.id DESC LIMIT 1`;
    return db.query(q);
};

module.exports.deleteAccountChat = (id) => {
    const q = `DELETE
    FROM chat
    WHERE  mes_sender_id =  ($1)`;
    const params = [id];
    return db.query(q, params);
};

module.exports.deleteAccountFriendships = (id) => {
    const q = `DELETE
    FROM friendships
    WHERE  recipient_id = ($1) OR sender_id =  ($1)`;
    const params = [id];
    return db.query(q, params);
};

module.exports.deleteAccountUsers = (id) => {
    const q = `DELETE
    FROM registered_users
    WHERE  id = ($1)`;
    const params = [id];
    return db.query(q, params);
};
