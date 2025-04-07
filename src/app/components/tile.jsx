"use client";

const Tile = ({value, type = "empty", setFieldValue, isPath}) => {
    const defaultColor = () => (value == 1?"black": value == 2? "blue": value==3? "#964B00": "white")

    function setValue(fieldType) {
        if (fieldType == "wall") {
            setFieldValue(1);
        }
        else if (fieldType == "water") {
            setFieldValue(2);
        }
        else if (fieldType == "empty") {
            setFieldValue(0);
        }
        else if (fieldType == "dirt") {
            setFieldValue(3);
        }
    }

    return (
        <>
        <div className="tile" 
             style={{
                border: "1px solid black",
                height:"40px",
                width:"40px",
                cursor: "pointer",
                backgroundColor: defaultColor()
             }}
             onClick={() => setValue(type)}
             >
                {isPath? (<img src="/image.png" width={"39px"} height={"38px"}></img>): null}
        </div>
        </>
    );
}

export default Tile