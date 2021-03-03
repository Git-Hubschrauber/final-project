import axios from "./axios";
// import { Redirect } from "react-router";
// import React from "react";
// import { BrowserRouter, Route } from "react-router-dom";
// import Profile from "./profile";

export async function saveProfile(profile_data) {
    console.log("Save Profile clicked: ", profile_data);

    try {
        await axios.post("/api/editProfile", profile_data);
        console.log("Profile_data after axios action: ", profile_data);
        // history.goback();
        // location.pathname = "/profile";

        return {
            type: "PERSONAL_DATA",
            profile_data,
        };
    } catch (err) {
        console.log("error in Save Profile ", err);
    }
}
export async function importProfile(profile_data) {
    try {
        console.log("Import Profile_data in actions: ", profile_data);
        return {
            type: "PERSONAL_DATA",
            profile_data,
        };
    } catch (err) {
        console.log("error in import Profile", err);
    }
}

export async function changeProfilePic(profilepic) {
    try {
        console.log("Import Profile_data in actions: ", profilepic);
        return {
            type: "CHANGE_PROFILE_PIC",
            profilepic,
        };
    } catch (err) {
        console.log("error in import Profile", err);
    }
}

export async function getDayInfo(props) {
    console.log("getDayInfo props in action.js: ", props);

    try {
        const results = await axios.get("/api/day/" + props);
        const dayInfo = results.data;
        console.log("dayInfo after axios action: ", dayInfo.inputfields);
        const inputFields = dayInfo.inputfields;
        console.log("inputfields after axios action: ", inputFields);

        return {
            type: "DAYINFO",
            inputFields,
        };
    } catch (err) {
        console.log("error in getDayInfo actions", err);
    }
}

export async function addEntryDate(newDate) {
    try {
        console.log("addEntryDate in actions: ", newDate);
        return {
            type: "ADD_ENTRY_DATE",
            newDate,
        };
    } catch (err) {
        console.log("error in addEntryDate", err);
    }
}

export async function getEntryDays() {
    console.log("getEntryDays in action.js: ");

    try {
        const results = await axios.get("/api/getEntryDays");

        console.log("getEntryDays after axios action: ", results);
        const entryDays = results.data;
        return {
            type: "ENTRYDAYS",
            entryDays,
        };
    } catch (err) {
        console.log("error in getEntryDays", err);
    }
}

export async function saveInputFields(inputFields1) {
    console.log("saveInputFields in action.js: ", inputFields1);

    return {
        type: "INPUTFIELDS",
        inputFields1,
    };
}
export async function getImagesOfDay(selectedDay) {
    console.log("getImagesOfDay in action.js: ", selectedDay);

    try {
        const results = await axios.get("/api/images/" + selectedDay);
        console.log("getImagesOfDay results in action.js: ", results.data);
        const picsOfDay = results.data;
        return {
            type: "IMAGES_OF_DAY",
            picsOfDay,
        };
    } catch (err) {
        console.log("error in getImagesOfDay", err);
    }
}

export async function addNewPictures(picsOfDay) {
    console.log("addNewPictures: ", picsOfDay);

    return {
        type: "NEW_IMAGES_ADDED",
        picsOfDay,
    };
}

export async function getAllImages() {
    try {
        const results = await axios.get("/api/pictures");

        console.log("allImages after axios action: ", results.data);
        const allImages = results.data;
        return {
            type: "ALL_IMAGES",
            allImages,
        };
    } catch (err) {
        console.log("error in getAllImages", err);
    }
}

export async function getAllEntries() {
    try {
        const results = await axios.get("/api/entries");

        console.log("allEnries after axios action: ", results.data);
        const allEntries = results.data;
        return {
            type: "ALL_ENTRIES",
            allEntries,
        };
    } catch (err) {
        console.log("error in getAllEntries", err);
    }
}

//
//
//
//

export async function getUserInfo(id) {
    const resp = await axios.get("/api/user/" + id);

    console.log("resp. in otherProfile: ", resp.data.userInfo);
    const userInfo = resp.data.userInfo;
    console.log("friendship in otherProfile: ", resp.data.friendship);
    return {
        type: "USER_INFO",
        userInfo,
    };
}

export async function askForFriendsandRequests() {
    const { data } = await axios.get("/api/friends");
    console.log("data.friendships in actions ", data.friendships);

    return {
        type: "FRIENDSHIPSTATUS_REQUEST",
        usersForFriendship: data.friendships,
    };
}

export async function unfriend(id) {
    await axios.post("/api/cancelInvitation/" + id);
    console.log("unfriend button clicked: ", id);

    const { data } = await axios.get("/api/friends");
    return {
        type: "FRIENDSHIPSTATUS_REQUEST",
        usersForFriendship: data.friendships,
        loggedUser: data.loggedUser,
    };
}

export async function checkFriendshipStatus(id) {
    console.log("checkFriendshipStatus executed: ", id);

    const results = await axios.get("/api/user/" + id);
    // console.log(
    //     "checkFriendshipStatus recipient in actions: ",
    //     results.data.friendship.recipient_id
    // );
    // console.log(
    //     "checkFriendshipStatus sender in actions: ",
    //     results.data.friendship.sender_id
    // );
    return {
        type: "FRIENDSHIPSTATUS_CHECK",
        checkedId: id,
        friendshipStatus: results.data.friendship.accepted,
        sender_id: results.data.friendship.sender_id,
        recipient_id: results.data.friendship.recipient_id,
    };
}

//
//
//
export async function makeFriendship(id) {
    try {
        axios.post("/api/userInvitation/" + id);
        return {
            type: "SET_FRIENDSHIPSTATUS",
            friendshipStatus: "sent",
        };
    } catch (err) {
        console.log("err in makeFriendship", err);
    }
}

export async function acceptFriendship(id) {
    try {
        await axios.post("/api/acceptInvitation/" + id);
        console.log("accept button clicked: ", id);

        const { data } = await axios.get("/api/friends");
        return {
            type: "SET_FRIENDSHIPSTATUS",
            friendshipStatus: "accepted",
            // usersForFriendship: data.friendships,
        };
    } catch (err) {
        console.log("err in acceptFriendship", err);
    }
}

export async function cancelFriendship(id) {
    try {
        await axios.post("/api/cancelInvitation/" + id);

        return {
            type: "SET_FRIENDSHIPSTATUS",
            friendshipStatus: "none",
        };
    } catch (err) {
        console.log("err in acceptFriendship", err);
    }
}

//
//
//
// Chat

export function chatMessages(msgs) {
    console.log("last 10 chat messages: ", msgs);

    return { type: "MESSAGES", messages: msgs };
}

export function chatMessage(msg) {
    console.log("chat messages sent: ", msg);

    return { type: "MESSAGE", message: msg };
}

export function sendNewMessage(newMessage) {
    console.log("just posted message: ", newMessage);

    return {
        type: "NEW_MESSAGE",
        newMessage,
    };
}

export async function getOthersFriends(id) {
    const { data } = await axios.get("/api/viewFriends/" + id);
    const friends = data.reverse();
    console.log("actions resp. from /api/viewFriends/: ", friends);

    return {
        type: "OTHERS_FRIENDS",
        friends,
    };
}

export function OtherOnlineUsers(otherOnlineUsersData) {
    return {
        type: "OTHERS_ONLINEUSERS",
        otherOnlineUsersData,
    };
}

export function newOnlineUser(newUserInfo) {
    return {
        type: "NEW_ONLINEUSER",
        newUserInfo,
    };
}

// export function notifyFriendRequest(data) {
//     console.log("actions notifyFriendRequest: ", data);
//     socket.emit("request", data.recipient_id);
//     return {
//         type: "NOTIFY_FRIENDSHIPREQUEST",
//         data,
//     };
// }
// export function displayFriendRequest(data_2) {
//     console.log("actions displayFriendRequest: ", data_2);
//     return {
//         type: "NOTIFY_FRIENDSHIPREQUEST_2",
//         data_2,
//     };
// }
