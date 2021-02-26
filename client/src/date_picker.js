import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import { format } from "date-fns";

export default function (props) {
    const [selectedDate, setSelectedDate] = useState(new Date());
    console.log("props in datePicker: ", props);
    return (
        <div>
            <DatePicker
                selected={selectedDate}
                onChange={(date) => {
                    console.log(
                        "clicked date: ",
                        format(new Date(date), "yyyy-MM-dd")
                    );
                    let newDate = format(new Date(date), "yyyy-MM-dd");
                    setSelectedDate(date);
                    props.history.push("/day/" + newDate);
                }}
                // onClick={props.history.push(
                //     "/day/" + format(selectedDate, "yyyy-MM-dd")
                // )}
                dateFormat="dd/MM/yyyy"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                shouldCloseOnSelect={true}
                inline={false}
                highlightDates={[
                    new Date("2021-02-20"),
                    new Date("2021-02-05"),
                    new Date("2021-01-07"),
                    new Date("2021-03-07"),
                ]}
            />
        </div>
    );
}
