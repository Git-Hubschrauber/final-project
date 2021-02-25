import axios from "./axios";
import React from "react";
import { Link } from "react-router-dom";

export default class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            error: false,
            email: "",
            password: "",
        };
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    handleClick() {
        const userInput = this.state;
        this.setState({
            error: false,
        });
        axios
            .post("/login/userlogin", userInput)
            .then((resp) => {
                let error = resp.data.error;
                if (error) {
                    console.log("error from server in Login");
                    this.setState({
                        error: true,
                    });
                } else {
                    location.replace("/");
                }
            })
            .catch((err) => {
                console.log("error in Login: ", err);
            });
    }

    render() {
        return (
            <div className="registrationTable">
                <h1>Login</h1>
                {this.state.error && <p className="error">An error occurred</p>}
                <div className="inputFields">
                    <input
                        onChange={(e) => this.handleChange(e)}
                        name="email"
                        type="email"
                        placeholder="email"
                        required
                    />
                    <input
                        onChange={(e) => this.handleChange(e)}
                        name="password"
                        type="password"
                        placeholder="password"
                        required
                    />
                    <button onClick={() => this.handleClick()}>LOGIN</button>
                </div>
                <p>
                    Not yet registered? Then please <Link to="/">REGISTER</Link>
                </p>
                <p>
                    You forgot your password? Please click here to{" "}
                    <Link to="/resetPassword">RESET PASSWORD</Link>
                </p>
            </div>
        );
    }
}
