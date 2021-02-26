import axios from "./axios";

async function logout() {
    console.log("logout clicked");
    try {
        await axios.post("/api/logout");
        console.log("logout done");
        location.pathname = "/welcome";
    } catch (err) {
        console.log("error in Logout", err);
    }
}

export default function () {
    return <button onClick={() => logout()}>LOGOUT</button>;
}
