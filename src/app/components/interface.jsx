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
    const [taxiPos, setTaxi] = useState([])
    const [passengerPos, setPassenger] = useState([])
    const [destPos, setDest] = useState([])
    const [isOnTaxi, setPassengerTaxi] = useState(false)
    
    // try connection with backend
    // success: set pathing
    // fail: logs error
    function search () {
        axios.post("http://localhost:5000/taxi",{"map":maps, "cost": cost, "taxiPos": taxiPos, "passengerPos":passengerPos, "destPos": destPos}).then((response) => {
            const fullPath = response.data.path;
            setPassengerTaxi(false)
            
            if (response.data.message == null) {
                setTaxi([]);
                fullPath.forEach(([i, j], index) => {
                    setTimeout(() => {
                        if (passengerPos[0] == i && passengerPos[1] == j) {
                            setPassenger([])
                            setPassengerTaxi(true)
                        }
                        if (destPos[0] == i && destPos[1] == j && isOnTaxi) {
                            setDest([])
                            setPassengerTaxi(false)
                        }
                        setPath(prev => [prev, [i, j]]);
                    }, index * (1000/speed)); 
                });
            }
            else {
                alert(`${response.data.message}`)
            }
        }).catch((error) => {
            alert(`${error.response.data.message}`)
        })
    } 

    //sets map dimension
    function setDim(value, type) {
        const numValue = Number(value)
        if (numValue <41 && numValue > 0) {
            if (type == "row") {
                setRow(value);
            }
            if (type == "column") {
                setColumn(value)
            }
        }
    }
    // sets the matrix i,j value according to the tile map or sets the taxi/passenger/destination pos
    function setTileValue(i,j, newValue) {
        if (newValue < 4) {
            const updated = [...maps];
            updated[i] = [...updated[i]];
            updated[i][j] = newValue;
            setMap(updated)
        }
        else {
            if (fieldType === "taxi") {
                setTaxi([i,j])
                setPath([])
                // if (taxiPos[0] == destPos[0] && taxiPos[1] == destPos[1]) {
                //     setDest([])
                // }
                // if (taxiPos[0] == passengerPos[0] && taxiPos[1] == passengerPos[1]) {
                //     setPassenger([])
                // }
            }
            if (fieldType === "passenger") {
                setPassenger([i,j])
                // if (passengerPos[0] == destPos[0] && passengerPos[1] == destPos[1]) {
                //     setDest([])
                // }
                // if (passengerPos[0] == taxiPos[0] && passengerPos[1] == taxiPos[1]) {
                //     setTaxi([])
                // }
            }
            if (fieldType === "dest") {
                setDest([i,j])
                // if (destPos[0] == passengerPos[0] && destPos[1] == passengerPos[1]) {
                //     setPassenger([])
                // }
                // if (destPos[0] == taxiPos[0] && destPos[1] == taxiPos[1]) {
                //     setTaxi([])
                // }
            }
        }
    }

    // keeps updating the map
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
                    <button onClick={() => setFieldType("taxi")} 
                            onMouseEnter={(element) => {element.target.style.backgroundColor = "#964B00"}}
                            onMouseLeave={(element) => {element.target.style.backgroundColor = "white"}}
                            >taxi</button>
                    <button onClick={() => setFieldType("passenger")} 
                            onMouseEnter={(element) => {element.target.style.backgroundColor = "#964B00"}}
                            onMouseLeave={(element) => {element.target.style.backgroundColor = "white"}}
                            >passageiro</button>
                    <button onClick={() => setFieldType("dest")} 
                            onMouseEnter={(element) => {element.target.style.backgroundColor = "#964B00"}}
                            onMouseLeave={(element) => {element.target.style.backgroundColor = "white"}}
                            >destino</button>
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
                <label>custo</label>
                <input onChange={(c)=>{setCost(c.target.value)}} type="number"/>
                <button onClick={() => search()} style={{
                }}>busca</button>
            </div>
            

            <div className="city" style={{
                display: "grid",
                gridTemplateColumns: `repeat(${column}, 40px)`,
                width:"100%",
                justifyContent: "center"
            }}>
                {maps.map((row, rowIndex) => 
                    row.map((value, columnIndex) => 
                        {
                            return <Tile key={`(${rowIndex}, ${columnIndex})`} 
                                        value={value} 
                                        type={`${fieldType}`} 
                                        setFieldValue={(newValue) => {
                                            setTileValue(rowIndex,columnIndex,newValue)
                                        }} 
                                        isPath={path.some(([i, j]) => i === rowIndex && j === columnIndex)}
                                        taxi = {taxiPos}
                                        passenger = {passengerPos}
                                        dest = {destPos}
                                        i = {rowIndex}
                                        j = {columnIndex}
                                        passengerOnTaxi = {isOnTaxi}
                                    />
                        }
                ))}
            </div>
            
        </>
    )
}

export default Interface;