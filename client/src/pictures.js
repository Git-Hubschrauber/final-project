import BackBtn from "./hooks/backBtn";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { getAllImages } from "./actions";
import { format } from "date-fns";

import { Link } from "react-router-dom";

export default function () {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getAllImages());
    }, []);

    const allImages = useSelector((state) => state.allImages);

    console.log("client - allImages: ", allImages?.reverse());

    let displayElement;

    if (allImages) {
        const imageDatesUnsorted = [
            ...new Set(allImages.map((e) => e.pic_date)),
        ];
        const imageDates = imageDatesUnsorted.sort(
            (a, b) => new Date(b) - new Date(a)
        );
        console.log("imageDates: ", imageDates);
        displayElement = (
            <div>
                {imageDates.map((e, index) => (
                    <div className="picGallery" key={index}>
                        <h1 className="pictureDate">
                            {format(new Date(e), "dd. MMMM yyyy (eeee)")}
                        </h1>

                        <div>
                            {allImages.map((element, index) => {
                                if (element.pic_date == e) {
                                    return (
                                        <img
                                            key={index}
                                            className="galleryImg"
                                            src={element.pictures}
                                        />
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
