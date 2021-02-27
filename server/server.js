const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const cookieSession = require("cookie-session");
const { hash, compare } = require("./bc");
const csurf = require("csurf");
const { sendEmail } = require("./ses");
const cryptoRandomString = require("crypto-random-string");
const fs = require("fs");
const db = require("./db");

//
// multer
const multer = require("multer");
const uidSafe = require("uid-safe");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        const path = __dirname + "/uploads/" + req.session.userId;
        fs.mkdirSync(path, { recursive: true });
        callback(null, path);
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

//
//
let sessionSecret;
if (process.env.NODE_ENV === "production") {
    sessionSecret = process.env.sessionSecret;
} else {
    sessionSecret = require("./secrets.json").sessionSecret;
}

const cookieSessionMiddleware = cookieSession({
    secret: sessionSecret,
    maxAge: 1000 * 60 * 60,
});
app.use(cookieSessionMiddleware);
app.use(express.json());

app.use(csurf());

app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

app.use(function (req, res, next) {
    res.setHeader("x-frame-options", "deny");
    next();
});

app.use(compression());

app.use(express.static(path.join(__dirname, "..", "client", "public")));
// app.use(express.static(path.join(__dirname, "..", "server", "uploads")));

//
//
//
//

//
// Welcome
app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

//
//Registration
app.post("/registration", async (req, res) => {
    if (
        req.body.first == "" ||
        req.body.last == "" ||
        !req.body.email.includes("@") ||
        req.body.password == ""
    ) {
        console.log("input field check: error");
        res.json({ registration_error: true });
    } else {
        try {
            const password = await hash(req.body.password);
            const { rows } = await db.addRegistration(
                req.body.first,
                req.body.last,
                req.body.email,
                password
            );

            console.log("userId: ", rows[0].id);
            req.session.userId = rows[0].id;
            res.json(rows[0].id);
        } catch (err) {
            console.log("error in registration: ", err);
            res.json({ registration_error: true });
        }
    }
});

//
//Login
app.post("/login/userlogin", async (req, res) => {
    console.log("/login post route here: ", req.body.email);
    const { rows } = await db.checkEmailRegistration(req.body.email);

    let checkedEmail = rows[0].email;

    if (checkedEmail == req.body.email) {
        let result = await db.getPassword(checkedEmail);
        let hashFromDB = result.rows[0].password;
        let match = await compare(req.body.password, hashFromDB);

        if (match) {
            let results = await db.getRegId(checkedEmail);
            req.session.userId = results.rows[0].id;

            console.log("userId in login: ", results.rows[0].id);
            res.json(results.rows[0].id);
        } else {
            console.log("err in compare2");
            res.json({ login_error: true });
        }
    }
});

//
//Reset Password

app.post("/password/reset/start", async (req, res) => {
    const emailToReset = req.body.email;

    try {
        const results = await db.checkEmailRegistration(emailToReset);

        let checkedEmail = results.rows[0].email;

        if (checkedEmail == emailToReset) {
            const secretCode = cryptoRandomString({
                length: 6,
            });

            await db.saveSecretCode(emailToReset, secretCode);

            const message = "Please enter the following code: " + secretCode;
            const subject = "Password reset for your account";
            sendEmail(emailToReset, message, subject);

            res.json(secretCode);
        } else {
            console.log("email DOES NOT EXISTS: ");
            res.json({ error: true });
        }
    } catch (err) {
        console.log("err in resetPW start", err);
        res.json({ error: true });
    }
});

app.post("/password/reset/verify", async (req, res) => {
    const { code, email, newPassword } = req.body;
    const result = await db.checkCode(code, email);
    try {
        if (!result.rows) {
            console.log("err2 in checkCod2e");
            return res.json({ error: true });
        } else {
            let password = await hash(newPassword);

            await db.insertNewPW(email, password);

            res.json({ error: false });
        }
    } catch (err) {
        console.log("err in resetPW verify", err);
        res.json({ error: true });
    }
});

//
//
//

app.get("/api/allUserInfo", async (req, res) => {
    console.log("api/allUserInfo here");
    const results1 = await db.getAllUserInfo1(req.session.userId);
    const results2 = await db.getAllUserInfo2(req.session.userId);
    const data = { ...results1.rows[0], ...results2.rows[0] };

    console.log("all User Info: ", data);
    res.json(data);
});

//
// Profile

app.post("/api/editProfile", async (req, res) => {
    console.log("/api/editProfile here");
    let { first, last, age, username, sex, hobbies, about } = req.body;
    console.log("/api/editProfile req.body: ", req.body);
    await db.updateName(req.session.userId, first, last);
    await db.insertProfileData(
        req.session.userId,
        age,
        username,
        sex,
        hobbies,
        about
    );

    res.json({ success: true });
});

//
//
//SingleDay

app.get("/api/day/:date", async (req, res) => {
    console.log("/api/day/:date here");
    console.log("/api/day/:date api req.params: ", req.params.date);
    const { rows } = await db.getDayInfo(req.session.userId, req.params.date);
    console.log("/api/day/:date rows: ", rows);

    res.json(rows[0]);
});

app.get("/api/getDiaryEntries", async (req, res) => {
    console.log("/api/getDiaryEntries here");
    const { rows } = await db.getDiaryEntries(req.session.userId);
    console.log("/api/getDiaryEntries rows: ", rows);
    res.json(rows);
});

app.get("/api/getEntryDays", async (req, res) => {
    console.log("/api/getEntryDays");
    const { rows } = await db.getEntryDays(req.session.userId);
    console.log("/api/getEntryDays rows: ", rows);
    res.json(rows);
});

app.post("/api/editDiary/:date", async (req, res) => {
    console.log("api/editDiary/:date here");
    console.log("api/editDiary/:date req.params: ", req.params);
    console.log(
        "api/editDiary/:date req.body.inputFields: ",
        req.body.selectedDay[1]
    );
    console.log(
        "api/editDiary/:date req.body.selectedDay: ",
        req.body.selectedDay[0]
    );
    await db.insertDiaryInfo(
        req.session.userId,
        req.body.selectedDay[0],
        req.body.selectedDay[1]
    );

    res.json(req.params.date);
});

app.post("/api/upload/:date", uploader.single("file"), async (req, res) => {
    console.log("/api/upload/:date here");
    console.log("/api/upload/:date req.params: ", req.params.date);
    // const { rows } = await db.getDayInfo(req.session.userId, req.params.date);
    // console.log("/api/day/:date rows: ", rows);

    // res.json(rows[0]);
    res.json({ success: true });
});

app.post("/api/uploads/:date", uploader.array("files"), async (req, res) => {
    console.log("/api/uploads/:date here");
    console.log("/api/uploads/:date req.params: ", req.params.date);
    // const { rows } = await db.getDayInfo(req.session.userId, req.params.date);
    // console.log("/api/day/:date rows: ", rows);

    // res.json(rows[0]);
    res.json({ success: true });
});

//
//
//Logout
app.post("/api/logout", (req, res) => {
    req.session.userId = null;
    req.session = null;
    res.redirect("/welcome");
});

//
//

app.get("*", function (req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});
//
//
//
app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
