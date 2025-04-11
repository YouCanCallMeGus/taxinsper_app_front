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
        axios.post("https://taxinsper-app-back.onrender.com/taxi",{"map":maps, "cost": cost, "taxiPos": taxiPos, "passengerPos":passengerPos, "destPos": destPos}).then((response) => {
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
        if (type == "row") {
            setRow(numValue);
        }
        if (type == "column") {
            setColumn(numValue)
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
            }
            if (fieldType === "passenger") {
                setPassenger([i,j])
            }
            if (fieldType === "dest") {
                setDest([i,j])
            }
        }
    }

    // keeps updating the map
    useEffect(() => {
        setMap(
            Array.from({ length: row }, () => Array.from({ length: column }, () => 0))
        );
        setPath([]);
        setDest([])
        setTaxi([])
        setPassenger([])
        
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
                    <div className="hl-bottom">
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
                </div>
                <div className="headerright">
                    <div className="hr-top">
                        <div className="inputfield">
                            <label>linhas</label>
                            <input onChange={(r)=>{
                                const value = Math.max(0,Math.min(30,r.target.value))
                                setDim(value, "row")
                                }} type="number" min={0} max={30} placeholder="0" value={row}/>
                        </div>
                        <div className="inputfield">
                            <label>colunas</label>
                            <input onChange={(c)=>{
                                const value = Math.max(0,Math.min(30,c.target.value))
                                setDim(value, "column")
                                }} type="number" min={0} max={30} placeholder="0" value={column}/>
                        </div>
                        <div className="inputfield">
                            <label>velocidade</label>
                            <input onChange={(s)=>{
                                const value = Math.max(0,Math.min(100,s.target.value))
                                setSpeed(value)
                                }} type="number" min={1} max={100} placeholder="1" value={speed}/>
                        </div>
                    </div>
                    <div className="hr-bottom">
                        <div className="inputfield">
                            <label>Valor da corrida</label>
                            <input onChange={(c)=>{setCost(c.target.value)}} type="number" placeholder="0"/>
                        </div>
                        <button onClick={() => search()} style={{
                        }}>busca</button>
                    </div>
                </div>
            </header>
            

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