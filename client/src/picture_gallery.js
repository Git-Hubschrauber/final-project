import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getImagesOfDay } from "./actions";

export default function (props) {
    console.log("props in gallery: ", props);
    const selectedDay = props.selectedDay;
    const dispatch = useDispatch();
    console.log("selectedDay in gallery: ", selectedDay);
    useEffect(() => {
        dispatch(getImagesOfDay(selectedDay));
    }, [picsOfDay]);
    const picsOfDay = useSelector((state) => state.picsOfDay);
    let picArray = [];
    if (picsOfDay) {
        console.log("picsOfDay: ", picsOfDay);
        picArray = picsOfDay.map((e) => e.pictures);
        console.log("picsOfDay array: ", picArray);
        console.log("picsOfDay array: ", picArray.length);
    }

    let pics;
    if (!picArray || picArray.length === 0) {
        pics = <h2 className="pictureGalleryHeadlines">No photos uploaded</h2>;
    } else {
        pics = (
            <div className="picGallery">
                {picArray.map((e, index) => (
                    <div key={index}>
                        <img className="galleryImg" src={e} />
                    </div>
                ))}
            </div>
        );
    }

    return <div>{pics}</div>;
}
