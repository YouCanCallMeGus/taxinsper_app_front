"use client";

import { useEffect, useState } from "react";
import Tile from "./tile";
import axios from "axios";

const Interface = () => {
    const [row, setRow] = useState(0)
    const [column, setColumn] = useState(0)
    const [maps, setMap] = useState(Array.from({ length: row }, () => Array.from({ length: column }, () => 0)))
    const [fieldType, setFieldType] = useState("")
    const [cost, setCost] = useState(0)
    const [speed, setSpeed] = useState(1)
    const [path, setPath] = useState([])
    
    function search () {
        axios.post("http://localhost:5000/taxi",{"map":maps}).then((response) => {
            const fullPath = response.data.path;
            console.log(response.data.cost);
            
            setCost(response.data.cost)
            fullPath.forEach(([i, j], index) => {
                setTimeout(() => {
                    setPath(prev => [prev, [i, j]]);
                }, index * (1000/speed)); 
            });
        }).catch((error) => {
            console.log(error)
        })
    } 

    function setDim(value, type) {
        const numValue = Number(value)
        if (numValue <31 && numValue > 0) {
            if (type == "row") {
                setRow(value);
            }
            if (type == "column") {
                setColumn(value)
            }
        }
    }
    
    function setTileValue(i,j, newValue) {
        const updated = [...maps];
        updated[i] = [...updated[i]];
        updated[i][j] = newValue;
        setMap(updated)
    }

    useEffect(() => {
        setMap(
            Array.from({ length: row }, () => Array.from({ length: column }, () => 0))
        );
        setPath([]);
        
    }, [row, column])

    return (
        <>
            <header>
                <div className="headerleft">
                    <button onClick={() => setFieldType("water")} 
                            onMouseEnter={(element) => {element.target.style.backgroundColor = "cyan"}}
                            onMouseLeave={(element) => {element.target.style.backgroundColor = "white"}}
                            >agua</button>
                    <button onClick={() => setFieldType("wall")} 
                            onMouseEnter={(element) => {element.target.style.backgroundColor = "black"; element.target.style.color = "white"}}
                            onMouseLeave={(element) => {element.target.style.backgroundColor = "white"; element.target.style.color = "black"}}
                            >parede</button>
                    <button onClick={() => setFieldType("empty")} 
                            >livre</button>
                    <button onClick={() => setFieldType("dirt")} 
                            onMouseEnter={(element) => {element.target.style.backgroundColor = "#964B00"}}
                            onMouseLeave={(element) => {element.target.style.backgroundColor = "white"}}
                            >terra</button>
                </div>
                <div className="headerright">
                    <label>linhas</label>
                    <input onChange={(r)=>{setDim(r.target.value, "row")}} type="number"/>
                    <label>colunas</label>
                    <input onChange={(c)=>{setDim(c.target.value, "column")}} type="number"/>
                    <label>velocidade</label>
                    <input onChange={(s)=>{setSpeed(s.target.value)}} type="number"/>
                </div>
            </header>
            <div className="subheader">
                <button onClick={() => search()} style={{
                }}>busca</button>
                <div style={{
                    border:"1px solid black",
                    width: "100px",
                    
                }}>
                    {`${cost}`}
                </div>
            </div>
            

            <div className="city" style={{
                display: "grid",
                gridTemplateColumns: `repeat(${column}, 40px)`,
                width:"100%",
                justifyContent: "center"
            }}>
                {maps.map((row, rowIndex) => 
                    row.map((value, columnIndex) => 
                        <Tile key={`(${rowIndex}, ${columnIndex})`} 
                            value={value} 
                            type={`${fieldType}`} 
                            setFieldValue={(newValue) => setTileValue(rowIndex,columnIndex,newValue)} 
                            isPath={path.some(([i, j]) => i === rowIndex && j === columnIndex)}/>
                ))}
            </div>
            
        </>
    )
}

export default Interface;