import ReactDOM from "react-dom";
import Welcome from "./welcome";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import reduxPromise from "redux-promise";
// import { reducer } from "./reducer";
import { composeWithDevTools } from "redux-devtools-extension";
// import App from "./app";
// import { init } from "./socket";

// const store = createStore(
//     reducer,
//     composeWithDevTools(applyMiddleware(reduxPromise))
// );

let elem;
if (location.pathname === "/welcome") {
    elem = <Welcome />;
} else {
    elem = <p>Im not the welcome route!</p>;
}

ReactDOM.render(elem, document.querySelector("main"));
