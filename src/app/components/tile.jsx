"use client";

const Tile = ({value, type = "empty", setFieldValue, isPath, taxi = [],passenger = [],dest = [], i,j}) => {
    const defaultColor = () => (value == 1?"black": value == 2? "blue": value==3? "#964B00": "white")
    const existTaxi = taxi[0] == i && taxi[1] == j
    const existPassenger = passenger[0] == i && passenger[1] == j
    const existDest = dest[0] == i && dest[1] == j
    

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
        else if (fieldType == "taxi") {
            setFieldValue(4)
        }
        else if (fieldType == "passenger") {
            setFieldValue(5)
        }
        else if (fieldType == "dest") {
            setFieldValue(6)
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
                {isPath? (<img src="/img1.png" width={"39px"} height={"38px"}></img>)
                : existTaxi ? (
                <img src="/img1.png" width="39px" height="38px" />
                ) : existPassenger ? (
                <img src="/img2.png" width="39px" height="38px" />
                ) : existDest ? (
                <img src="/img3.png" width="39px" height="38px" />
                ) : null}

        </div>
        </>
    );
}

export default Tile