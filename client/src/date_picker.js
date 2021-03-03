import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { getEntryDays } from "./actions";

export default function (props) {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getEntryDays());
    }, []);

    const markedDays = useSelector((state) => state.entryDays);
    console.log("markeddays: ", markedDays);
    let arrayMarkedDays;
    if (markedDays) {
        arrayMarkedDays = markedDays.map((e) => new Date(e));
    }
    return (
        <div>
            <DatePicker
                placeholderText="Click here and pick a date"
                onChange={(date) => {
                    console.log(
                        "clicked date: ",
                        format(new Date(date), "yyyy-MM-dd")
                    );
                    let newDate = format(new Date(date), "yyyy-MM-dd");
                    setSelectedDate(date);
                    props.history.push("/day/" + newDate);
                }}
                dateFormat="dd/MM/yyyy"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                shouldCloseOnSelect={false}
                inline={false}
                highlightDates={arrayMarkedDays}
                // highlightDates={[
                //     new Date("2021-02-20"),
                //     new Date("2021-02-05"),
                //     new Date("2021-01-07"),
                //     new Date("2021-03-07"),
                // ]}
            />
        </div>
    );
}
