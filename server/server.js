const express = require("express");
const app = express();

const server = require("http").Server(app);
const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(null, req.headers.referer.startsWith("http://localhost:3000")),
});

const compression = require("compression");
const path = require("path");
const db = require("./db");
const cookieSession = require("cookie-session");
const { hash, compare } = require("./bc");
const csurf = require("csurf");
const { sendEmail } = require("./ses");
const cryptoRandomString = require("crypto-random-string");
const fs = require("fs");

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
    maxAge: 1000 * 60 * 60 * 3,
});
app.use(cookieSessionMiddleware);
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});
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
app.use(express.static(path.join(__dirname, "..", "server", "uploads")));

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
    try {
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
    } catch (err) {
        console.log("error in login: ", err);
        res.json({ login_error: true });
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
    try {
        const results1 = await db.getAllUserInfo1(req.session.userId);
        const results2 = await db.getAllUserInfo2(req.session.userId);
        const data = { ...results2.rows[0], ...results1.rows[0] };

        console.log("all User Info: ", data);
        res.json(data);
    } catch (err) {
        console.log("error in /api/allUserInfo: ", err);
        res.json({ error: true });
    }
});

//
// Profile

app.post("/api/editProfile", async (req, res) => {
    console.log("/api/editProfile here");
    try {
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
    } catch (err) {
        console.log("error in /api/editProfile: ", err);
        res.json({ error: true });
    }
});

app.post(
    "/api/uploadProfilePic/",
    uploader.single("file"),
    async (req, res) => {
        console.log("/api/uploadProfilePic/ here");
        try {
            const profilePic =
                "/" + req.session.userId + "/" + req.file.filename;
            console.log("/api/Profile´Pic req.body: ", profilePic);
            await db.updateProfilePic(req.session.userId, profilePic);
            res.json(profilePic);
        } catch (err) {
            console.log("error in api/uploadProfilePic/: ", err);
            res.json({ error: true });
        }
    }
);

app.post("/deleteProfilePic", async (req, res) => {
    const def = ["/default.png"];

    console.log("/delete here");
    try {
        await db.deleteImage(req.session.userId, def);

        res.json({
            sucess: true,
        });
    } catch (err) {
        console.log("error in api/deleteProfilePic/: ", err);
        res.json({ error: true });
    }
});
//
//
//SingleDay

app.get("/api/day/:date", async (req, res) => {
    console.log("/api/day/:date here");
    console.log("/api/day/:date api req.params: ", req.params.date);
    try {
        const { rows } = await db.getDayInfo(
            req.session.userId,
            req.params.date
        );
        console.log("/api/day/:date rows: ", rows);

        res.json(rows[0]);
    } catch (err) {
        console.log("error in /api/day/:date ", err);
        res.json({ error: true });
    }
});

app.get("/api/images/:date", async (req, res) => {
    console.log("/api/images/:date here");
    console.log("//api/images/:date req.params: ", req.params.date);
    try {
        const { rows } = await db.getImagesForDayInfo(
            req.session.userId,
            req.params.date
        );
        console.log("/api/images/:date rows: ", rows);

        res.json(rows);
    } catch (err) {
        console.log("error in /api/images/:date ", err);
        res.json({ error: true });
    }
});

app.get("/api/getDiaryEntries", async (req, res) => {
    console.log("/api/getDiaryEntries here");
    try {
        const { rows } = await db.getDiaryEntries(req.session.userId);
        console.log("/api/getDiaryEntries rows: ", rows);
        res.json(rows);
    } catch (err) {
        console.log("error in /api/getDiaryEntries: ", err);
        res.json({ error: true });
    }
});

app.get("/api/getEntryDays", async (req, res) => {
    console.log("/api/getEntryDays");
    try {
        const { rows } = await db.getEntryDays1(req.session.userId);
        let resultsA1 = rows.map((e) => Object.values(e));
        const results = await db.getEntryDays2(req.session.userId);
        let resultsB1 = results.rows.map((e) => Object.values(e));
        let resultsAB = [...resultsA1, ...resultsB1];
        let resultsABC = resultsAB.flat();
        let uniq = [...new Set(resultsABC)];
        console.log("/api/getEntryDays resultsB1: ", resultsB1);
        console.log("/api/getEntryDays resultsA1: ", resultsA1);
        console.log("/api/getEntryDays resultsAB: ", resultsAB);
        console.log("/api/getEntryDays resultsABC: ", resultsABC);
        // console.log("/api/getEntryDays results3: ", results3);
        // console.log("/api/getEntryDays results3: ", results4);
        console.log("/api/getEntryDays uniq2: ", uniq);
        res.json(uniq);
    } catch (err) {
        console.log("error in /api/getEntryDays: ", err);
        res.json({ error: true });
    }
});

app.post("/api/editDiary/:date", async (req, res) => {
    console.log("api/editDiary/:date here");
    console.log("api/editDiary/:date req.params: ", req.params.date);
    console.log("api/editDiary/:date req.body: ", req.body);
    try {
        await db.insertDiaryInfo(req.session.userId, req.params.date, req.body);

        res.json(req.params.date);
    } catch (err) {
        console.log("error in /api/editDiary/:date ", err);
        res.json({ error: true });
    }
});

app.post("/api/upload/:date", uploader.single("file"), async (req, res) => {
    console.log("/api/upload/:date here");
    console.log("/api/upload/:date file: ", req.file.filename);
    const image = [];
    image.push("/" + req.session.userId + "/" + req.file.filename);
    console.log("/api/upload/:date image: ", image);
    console.log("/api/upload/:date req.params: ", req.params.date);
    await db.insertPictureData(req.session.userId, req.params.date, image);

    res.json(image);
});

app.post("/api/uploads/:date", uploader.array("files"), async (req, res) => {
    console.log("/api/uploads/:date here");
    console.log("/api/uploads/:date req.files: ", req.files);

    const images = req.files.map((element) => {
        return "/" + req.session.userId + "/" + element.filename;
    });

    console.log("/apiuploads/:date rows: ", images);
    const arr = images.map((e) => new Array(e));
    console.log("array in uploads: ", arr);
    arr.map((e) =>
        db.insertPictureData(req.session.userId, req.params.date, e)
    );

    res.json(arr);
});

app.get("/api/pictures", async (req, res) => {
    console.log("/pictures in server here");
    const { rows } = await db.getAllPictures(req.session.userId);
    console.log("/pictures in server - results: ", rows);
    res.json(rows);
});

app.get("/api/entries", async (req, res) => {
    console.log("/entries in server here");
    const { rows } = await db.getAllEntries(req.session.userId);
    console.log("/entries in server - results: ", rows);
    res.json(rows);
});

//
//
app.post("/api/searchUsers/:searchedUser", async (req, res) => {
    console.log("req.body: ", req.body);
    console.log(" req.params.searchedUser: ", req.params.searchedUser);

    let val = req.params.searchedUser;
    let results = await db.searchUsers(val);
    console.log("/searchuser results: ", results.rows);

    res.json(results.rows);
});

app.get("/api/user/:id", async (req, res) => {
    const userId = req.session.userId;
    const recipient_id = req.params.id;
    try {
        const results1 = await db.getUserInfo(req.params.id);
        const results2 = await db.getFriendshipStatus(userId, recipient_id);

        return res.json({
            userInfo: results1.rows[0],
            error: false,
            friendship: results2.rows[0],
        });
    } catch (err) {
        console.log("err in /api/user/:id", err);
        res.json({ error: true });
    }
});

app.post("/api/userInvitation/:id", async (req, res) => {
    const sender_id = req.session.userId;
    const recipient_id = req.params.id;
    try {
        const results = await db.makeFriendship(sender_id, recipient_id);

        console.log("friendship invitation results: ", results);
        res.json({
            sender_id: req.session.userId,
            recipient_id: req.params.id,
        });
    } catch (err) {
        console.log("err in /userInvitation", err);
        res.json({ error: true });
    }
});

app.post("/api/acceptInvitation/:id", async (req, res) => {
    const sender_id = req.session.userId;
    const recipient_id = req.params.id;
    try {
        await db.acceptFriendship(recipient_id, sender_id);
        const results = await db.getFriendshipStatus(sender_id, recipient_id);

        console.log("accept invitation results: ", results.rows);
        res.json(results.rows);
    } catch (err) {
        console.log("err in /acceptInvitation", err);
        res.json({ error: true });
    }
});

app.post("/api/cancelInvitation/:id", async (req, res) => {
    const sender_id = req.session.userId;
    const recipient_id = req.params.id;
    try {
        await db.cancelFriendship(sender_id, recipient_id);
        res.json({ error: false });
    } catch (err) {
        console.log("err in /cancelInvitation", err);
        res.json({ error: true });
    }
});

app.get("/api/friends/", async (req, res) => {
    const loggedId = req.session.userId;

    try {
        const { rows } = await db.getFriendsandRequests(loggedId);

        res.json({ friendships: rows, loggedUser: loggedId });
    } catch (err) {
        console.log("err in /friends", err);
        res.json({ error: true });
    }
});

app.get("/api/friend/:id", async (req, res) => {
    try {
        const { rows } = await db.getUserInfo(req.params.id);
        console.log("results in /friends/id", rows);

        res.json(rows);

        // console.log("friends: ", friends);
        // res.json({ results: friends });
    } catch (err) {
        console.log("err in /friend/id", err);
        res.json({ error: true });
    }
});

app.get("/api/viewFriends/:id", async (req, res) => {
    try {
        const { rows } = await db.getOthersFriends(req.params.id);
        // console.log("server results in /viewfriends", rows);
        res.json(rows.reverse());
    } catch (err) {
        console.log("err in /friends", err);
        res.json({ error: true });
    }
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
// app.listen(process.env.PORT || 3001, function () {
//     console.log("I'm listening.");
// });

server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
let onlineUsers = {};
let requestToIds = [];

io.on("connection", function (socket) {
    console.log(`socket with the id ${socket.id} is now connected`);

    const userId = socket.request.session.userId;

    if (!socket.request.session.userId) {
        console.log("socket disconnected");

        return socket.disconnect(true);
    }

    //
    //
    //

    console.log("onlineUsers in server: ", Object.values(onlineUsers));
    let onlineUsersIds = Object.values(onlineUsers);
    let otherOnlineUsersIds = [
        ...new Set(onlineUsersIds.filter((element) => element !== userId)),
    ];

    console.log("otherOnlineUsers in server: ", otherOnlineUsersIds);
    db.getOnlineUsers(otherOnlineUsersIds).then(({ rows }) => {
        console.log("OtheronlineUsers Data: ", rows);
        socket.emit("whoElseIsOnline", rows);
    });

    if (!onlineUsersIds.includes(userId)) {
        console.log("newUser joined: ", userId);
        db.getUserInfo(userId).then(({ rows }) => {
            console.log("server - new user joined: ", rows);
            let newUserInfo = rows[0];
            socket.broadcast.emit("newUserJoined", newUserInfo);
        });
    }
    onlineUsers[socket.id] = userId;

    otherOnlineUsersIds = [
        ...new Set(onlineUsersIds.filter((element) => element !== userId)),
    ];
    //
    //

    db.getLastMessages().then((results) => {
        io.emit("chatMessages", results.rows.reverse());
    });

    //
    //

    socket.on("chatMessage", async (msg) => {
        try {
            console.log("msg-data: ", msg);
            await db.insertMessage(userId, msg);
            const { rows } = await db.getLastMessageInfo();
            console.log("sender Info: ", rows[0]);
            io.emit("newMessage", rows[0]);
        } catch (err) {
            console.log("err in server socket chatMessage", err);
        }
    });

    // socket.on("request", (data) => {
    //     console.log("notifyFriendRequest in server: ", data);
    //     requestToIds.push(parseInt(data));
    // });

    // let numberOfRequests = requestToIds.filter((v) => v == userId).length;

    // if (numberOfRequests > 0) {
    //     socket.emit("displayFriendRequest", numberOfRequests);
    // }
    // console.log("requestToIds 2: ", requestToIds);
    // console.log("numberOfRequests 2: ", numberOfRequests);

    socket.on("disconnect", () => {
        delete onlineUsers[socket.id];
        console.log(
            "onlineUsers in server after a disconnect: ",
            Object.values(onlineUsers)
        );
        onlineUsersIds = Object.values(onlineUsers);
        otherOnlineUsersIds = [
            ...new Set(onlineUsersIds.filter((element) => element !== userId)),
        ];
        db.getOnlineUsers(otherOnlineUsersIds).then(({ rows }) => {
            console.log("OtheronlineUsers Data: ", rows);
            socket.broadcast.emit("whoElseIsOnline", rows);
        });
        console.log(`Socket with id: ${socket.id} just DISCONNECTED!!!!`);
    });
});
