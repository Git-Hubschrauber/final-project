import axios from "./axios";
import BackBtn from "./hooks/backBtn";
import InputTable from "./input_table";
import Uploader from "./uploader";
import { getDayInfo, getImagesOfDay } from "./actions";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";

export default function (props) {
    const dispatch = useDispatch();

    const selectedDay = props.match.params.date;
    useEffect(() => {
        console.log("useeffect single day props here: ", props);
        dispatch(getDayInfo(selectedDay));
    }, []);
    useEffect(() => {
        console.log("useeffect single day props here: ", props);
        dispatch(getImagesOfDay(selectedDay));
    }, []);

    const dbInputFields = useSelector((state) => state.inputFields);
    const picsOfDay = useSelector((state) => state.picsOfDay);
    let displayElement;
    if (!dbInputFields) {
        return (displayElement = (
            <div>
                <h1>{format(new Date(selectedDay), "dd. MMMM yyyy (eeee)")}</h1>
                <h1>No entry for this day!</h1>
                <InputTable selectedDay={selectedDay} />
                <Uploader selectedDay={selectedDay} />
                <BackBtn />
            </div>
        ));
    }

    console.log("singleday dbInputFields: ", dbInputFields);

    if (dbInputFields.length === 0) {
        displayElement = <h1>No entry for this day!</h1>;
    } else {
        displayElement = (
            <div>
                <h1>Your entries for this day!</h1>
                {dbInputFields.map((element, index) => (
                    <div key={index}>
                        <h2>{element}</h2>
                        <h2>Content to display</h2>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div>
            <h1 className="dateOfDay">
                {format(new Date(selectedDay), "dd. MMMM yyyy (eeee)")}
            </h1>
            <div className="displayElementContainer">{displayElement} </div>
            <InputTable selectedDay={selectedDay} />
            <Uploader selectedDay={selectedDay} />
            <BackBtn />
        </div>
    );
}
