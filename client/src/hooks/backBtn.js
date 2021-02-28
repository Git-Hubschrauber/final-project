import React from "react";
import { useHistory, Link } from "react-router-dom";

export default function () {
    const history = useHistory();
    return (
        <Link to="/">
            <button className="backBtn">back</button>
        </Link>
    );
}
