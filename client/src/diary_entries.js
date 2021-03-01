import BackBtn from "./hooks/backBtn";
import InputTable from "./input_table";
import Uploader from "./uploader";
import { getDayInfo, getImagesOfDay } from "./actions";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import PictureGallery from "./picture_gallery";

export default function (props) {
    const dispatch = useDispatch();
    const selectedDay = props.selectedDay;
    console.log("selectedDay in entries: ", selectedDay);

    useEffect(() => {
        console.log("useeffect single day props here: ", props);
        dispatch(getDayInfo(selectedDay));
    }, []);

    const dbInputFields = useSelector((state) => state.inputFields);

    let displayElement;
    if (!dbInputFields) {
        displayElement = (
            <h1 className="pictureGalleryHeadlines">No entry for this day!</h1>
        );
    }

    // console.log("singleday dbInputFields: ", dbInputFields);

    // if (dbInputFields.length === 0) {
    //     displayElement = <h1>No entry for this day!</h1>;
    // }
    else {
        console.log("type of dbInputFields: ", typeof dbInputFields[0]);
        let dbInputFields2;
        if (typeof dbInputFields[0] == "string") {
            dbInputFields2 = dbInputFields.map((e) => JSON.parse(e));
        } else {
            dbInputFields2 = dbInputFields;
        }
        console.log("dbInputFields2: ", dbInputFields2);
        displayElement = (
            <div>
                <h1>Your entries for this day!</h1>
                {dbInputFields2.map((element, index) => (
                    <div className="entryTable" key={index}>
                        <table>
                            <tbody>
                                <tr>
                                    <td className="entryCol1">
                                        <h2>{element.title}</h2>
                                    </td>
                                    <td className="entryCol2">
                                        <h3>{element.content}</h3>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div>
            <div className="displayElementContainer">{displayElement} </div>
        </div>
    );
}
