import axios from "../axios";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// import { socket } from "../socket";
import {
    makeFriendship,
    acceptFriendship,
    cancelFriendship,
    checkFriendshipStatus,
} from "../actions";

export default function (props) {
    const id = props.id;
    const dispatch = useDispatch();

    let [friendshipStatus, setfriendshipStatus] = useState("none");
    // let friendshipState = useSelector((state) => state.friendshipStatus);
    let recipient_id = useSelector((state) => state.recipient_id);
    let sender_id = useSelector((state) => state.sender_id);

    useEffect(() => {
        console.log("HERE friendsbutton: ");
        dispatch(checkFriendshipStatus(id));
    }, [friendshipStatus]);

    let friendshipState = useSelector((state) => state.friendshipStatus);

    useEffect(() => {
        if (friendshipState) {
            setfriendshipStatus(friendshipState);
        }
        console.log("HERE friendsbutton: ");

        if (friendshipState === undefined) {
            return setfriendshipStatus("none");
        }
        if (
            typeof friendshipState !== undefined &&
            friendshipState == false &&
            recipient_id == id
        ) {
            return setfriendshipStatus("sent");
        }
        if (
            typeof friendshipState !== undefined &&
            friendshipState == false &&
            sender_id == id
        ) {
            return setfriendshipStatus("received");
        }
        if (typeof friendshipState != undefined && friendshipState == true) {
            return setfriendshipStatus("accepted");
        }
    }, [friendshipState]);

    // console.log("friendshipState inside: ", friendshipState);
    // console.log("friendshipState sender: ", sender_id);
    // console.log("friendshipState recipient: ", recipient_id);
    return (
        <div>
            {friendshipStatus == "none" && (
                <button
                    onClick={() => {
                        dispatch(makeFriendship(id));
                        setfriendshipStatus("sent");
                    }}
                >
                    Send friendship request
                </button>
            )}
            {friendshipStatus == "sent" && (
                <button
                    onClick={() => {
                        dispatch(cancelFriendship(id));
                        setfriendshipStatus("none");
                    }}
                >
                    Cancel friendship request
                </button>
            )}
            {friendshipStatus == "received" && (
                <button
                    onClick={() => {
                        dispatch(acceptFriendship(id));
                        setfriendshipStatus("accepted");
                    }}
                >
                    Accept friendship request
                </button>
            )}

            {friendshipStatus == "accepted" && (
                <button
                    onClick={() => {
                        dispatch(cancelFriendship(id));
                        setfriendshipStatus("none");
                    }}
                >
                    End friendship
                </button>
            )}
        </div>
    );
}
