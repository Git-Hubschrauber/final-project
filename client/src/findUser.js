import axios from "./axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Friends from "./friends";

export default function () {
    const [searchUsers, setSearchUsers] = useState([]);
    const [searchedUser, setSearchedUser] = useState("");

    useEffect(() => {
        let abort = false;
        (async () => {
            try {
                const { data } = await axios.post(
                    "/api/searchUsers/" + searchedUser
                );

                if (!abort) {
                    setSearchUsers(data);
                }
            } catch (err) {
                console.log(err);
            }
        })();
        return () => {
            abort = true;
        };
    }, [searchedUser]);

    return (
        <div>
            <h1>Searching anyone?</h1>
            <input
                name="searchedUsers"
                type="text"
                placeholder="search a member"
                onChange={(e) => setSearchedUser(e.target.value)}
                autoComplete="off"
            />
            <div className="findpeople">
                {searchUsers.map((elem, index) => {
                    return (
                        <div key={index}>
                            <Link to={"/user/" + elem.id}>
                                <img src={elem.profilepic || "/default.png"} />
                                <p>
                                    {elem.first} {elem.last}
                                </p>
                            </Link>
                        </div>
                    );
                })}
            </div>
            <Friends />
            <Link to={"/"}>
                <button className="backBtn">BACK</button>
            </Link>
        </div>
    );
}
