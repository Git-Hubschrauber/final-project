import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveInputFields, addEntryDate } from "./actions";
import axios from "./axios";

export default function (props) {
    const dispatch = useDispatch();

    const [inputFields1, setInputFields] = useState([
        { title: "", content: "" },
    ]);

    const selectedDay = props.selectedDay;
    // console.log("props in input tables: ", selectedDay);
    // const inputFieldsFromRedux = useSelector((state) => state.inputFields);
    // console.log("inputfields from redux:", inputFieldsFromRedux);
    // useEffect(() => {
    //     if (inputFieldsFromRedux) {
    //         console.log("input changed");
    //     }
    // }, [inputFields]);

    const handleChange = (index, e) => {
        // console.log(
        //     "handleChange name:val: ",
        //     e.target.name + ":" + e.target.value,
        //     index
        // );
        e.preventDefault();
        const values = [...inputFields1];
        values[index][e.target.name] = e.target.value;
        setInputFields(values);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("saved inputFields: ", inputFields1);
        try {
            await axios.post("/api/editDiary/" + selectedDay, inputFields1);
            dispatch(saveInputFields(inputFields1));
            dispatch(addEntryDate(selectedDay));
        } catch (err) {
            console.log("error in saveInputFields", err);
        }
    };

    const addField = (index) => {
        // setInputFields([...inputFields, { title: "", content: "" }]);
        console.log("add index: ", index);
        // const values = [...inputFields, { title: "", content: "" }];

        const values = [...inputFields1];

        values.splice(index + 1, 0, { title: "", content: "" });
        setInputFields(values);
        // dispatch(saveInputFields(inputFields));
    };
    const deleteField = (index) => {
        console.log("delete index: ", index);
        const values = [...inputFields1];
        values.splice(index, 1);
        setInputFields(values);
        // dispatch(saveInputFields(inputFields));
    };

    return (
        <div className="inputTable">
            <form onSubmit={handleSubmit}>
                {inputFields1.map((inputField, index) => (
                    <div key={index}>
                        <table>
                            <tbody>
                                <tr>
                                    <td className="tableCol1">
                                        <input
                                            type="text"
                                            placeholder="title"
                                            name="title"
                                            // defaultValue={
                                            //     inputField.title
                                            // }
                                            onChange={(e) =>
                                                handleChange(index, e)
                                            }
                                        ></input>
                                    </td>
                                    <td className="tableCol2">
                                        <textarea
                                            placeholder="content"
                                            name="content"
                                            // defaultValue={
                                            //     inputField.content
                                            // }
                                            onChange={(e) =>
                                                handleChange(index, e)
                                            }
                                        />
                                    </td>
                                    <td>
                                        <button onClick={() => addField(index)}>
                                            +
                                        </button>
                                        <button
                                            onClick={() => deleteField(index)}
                                        >
                                            -
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ))}

                <button className="saveBtn" onClick={handleSubmit}>
                    Save
                </button>
            </form>
        </div>
    );
}
