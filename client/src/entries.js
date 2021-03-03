import BackBtn from "./hooks/backBtn";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { getAllEntries } from "./actions";
import { format } from "date-fns";

import { Link } from "react-router-dom";

export default function () {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getAllEntries());
    }, []);

    const allEntries = useSelector((state) => state.allEntries);

    console.log("client - allEntries: ", allEntries?.reverse());

    let displayElement;

    if (!allEntries || allEntries.length === 0) {
        displayElement = <h1>No entries available</h1>;
    } else {
        const entryDatesUnsorted = [
            ...new Set(allEntries.map((e) => e.diary_date)),
        ];
        const entryDates = entryDatesUnsorted.sort(
            (a, b) => new Date(b) - new Date(a)
        );

        console.log("diaryDates: ", entryDates);
        displayElement = (
            <div>
                {entryDates.map((e, index) => (
                    <div className="picGallery" key={index}>
                        <h1 className="pictureDate">
                            {format(new Date(e), "dd. MMMM yyyy (eeee)")}
                        </h1>

                        <div>
                            {allEntries.map((element) => {
                                if (element.diary_date == e) {
                                    return (
                                        <div key={element.id}>
                                            {element.inputfields.map(
                                                (x, index) => {
                                                    const y = JSON.parse(x);
                                                    return (
                                                        <div key={index}>
                                                            <h2>{y.title}</h2>
                                                            <p>{y.content}</p>
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </div>
                                    );
                                }
                            })}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div>
            {displayElement}
            <div>
                <BackBtn />
            </div>
        </div>
    );
}
