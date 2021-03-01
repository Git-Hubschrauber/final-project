import BackBtn from "./hooks/backBtn";
import InputTable from "./input_table";
import Uploader from "./uploader";
import { getDayInfo, getImagesOfDay } from "./actions";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import PictureGallery from "./picture_gallery";
import DiaryEntries from "./diary_entries";

export default function (props) {
    const dispatch = useDispatch();

    const selectedDay = props.match.params.date;
    useEffect(() => {
        console.log("useeffect single day props here: ", props);
        dispatch(getDayInfo(selectedDay));
    }, []);
    useEffect(() => {
        dispatch(getImagesOfDay(selectedDay));
    }, []);

    return (
        <div className="singleDayContainer">
            <h1 className="dateOfDay">
                {format(new Date(selectedDay), "dd. MMMM yyyy (eeee)")}
            </h1>
            <DiaryEntries selectedDay={selectedDay} />

            <InputTable selectedDay={selectedDay} />

            <div>
                <h1 className="pictureGalleryHeadlines">Picture Gallery</h1>
                <PictureGallery selectedDay={selectedDay} />
            </div>
            <Uploader selectedDay={selectedDay} />
            {/* <BackBtn /> */}
        </div>
    );
}
