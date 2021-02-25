import axios from "./axios";
import React from "react";
import { Link } from "react-router-dom";

export default class ResetPassword extends React.Component {
    constructor() {
        super();
        this.state = {
            renderView: 1,
            error: false,
        };
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    handleClick1() {
        const userInput = this.state;
        axios
            .post("/password/reset/start", userInput)
            .then((resp) => {
                let error = resp.data.error;
                if (error) {
                    console.log("error from server");
                    this.setState({
                        error: true,
                    });
                } else {
                    this.setState({
                        renderView: this.state.renderView + 1,
                        error: false,
                    });
                }
            })
            .catch((err) => {
                console.log("error in registration: ", err);
            });
    }

    handleClick2() {
        const userInput = this.state;
        axios
            .post("/password/reset/verify", userInput)
            .then((resp) => {
                let error = resp.data.error;
                if (error) {
                    console.log("error from server");
                    this.setState({
                        error: true,
                    });
                } else {
                    this.setState({
                        renderView: this.state.renderView + 1,
                        error: false,
                    });
                }
            })
            .catch((err) => {
                console.log("error in registration: ", err);
            });
    }

    renderViewSelector() {
        if (this.state.renderView === 1) {
            return (
                <div className="inputFields">
                    <h1>Please enter your email address</h1>
                    <input
                        onChange={(e) => this.handleChange(e)}
                        name="email"
                        type="email"
                        placeholder="email"
                        required
                    />

                    <button onClick={() => this.handleClick1()}>Submit</button>
                </div>
            );
        } else if (this.state.renderView === 2) {
            return (
                <div className="inputFields">
                    <h1>Email with a verification code was sent.</h1>
                    <h1>Please enter the code and set a new password</h1>
                    <input
                        onChange={(e) => this.handleChange(e)}
                        name="code"
                        type="text"
                        placeholder="code"
                        required
                    />
                    <input
                        onChange={(e) => this.handleChange(e)}
                        name="newPassword"
                        type="password"
                        placeholder="new password"
                        required
                    />

                    <button onClick={() => this.handleClick2()}>Submit</button>
                </div>
            );
        } else if (this.state.renderView === 3) {
            return (
                <div>
                    <h1>Password reset successfull!</h1>
                </div>
            );
        }
    }

    render() {
        return (
            <div className="registrationTable">
                <h1>Reset Password</h1>
                {this.renderViewSelector()}
                {this.state.error && <p className="error">An error occurred</p>}
                <p>
                    Back to <Link to="/login">LOGIN</Link>
                </p>
            </div>
        );
    }
}
