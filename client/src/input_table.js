import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveInputFields } from "./actions";

export default function (props) {
    const dispatch = useDispatch();

    const [inputFields, setInputFields] = useState([
        { title: "", content: "" },
    ]);

    const selectedDay = props.selectedDay;
    console.log("props in input tables: ", selectedDay);
    // inputFields = useSelector((state) => state.inputFields);

    useEffect(
        (inputFields) => {
            if (inputFields) {
                console.log("input changed");
            }
        },
        [inputFields]
    );

    const handleChange = (index, e) => {
        console.log(
            "handleChange name:val: ",
            e.target.name + ":" + e.target.value,
            index
        );
        const values = [...inputFields];
        values[index][e.target.name] = e.target.value;
        setInputFields(values);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("saved inputFields: ", inputFields);

        dispatch(saveInputFields([selectedDay, inputFields]));
    };

    const addField = (index) => {
        // setInputFields([...inputFields, { title: "", content: "" }]);
        console.log("add index: ", index);
        const values = [...inputFields];
        values.splice(index + 1, 0, { title: "", content: "" });
        setInputFields(values);
        dispatch(saveInputFields([selectedDay, inputFields]));
    };
    const deleteField = (index) => {
        console.log("delete index: ", index);
        const values = [...inputFields];
        values.splice(index, 1);
        setInputFields(values);
        dispatch(saveInputFields([selectedDay, inputFields]));
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                {inputFields.map((inputField, index) => (
                    <div key={index}>
                        <table>
                            <tbody>
                                <tr>
                                    <td>
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
                                    <td>
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

                <button onClick={handleSubmit}>Save</button>
            </form>
        </div>
    );
}
