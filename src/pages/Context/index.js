import React, { createContext, useState } from "react";

const DataGameContext = createContext();

const DataGame = ({children}) => {
    const [prom, setProm] = useState(false);

    return (
        <DataGameContext.Provider value={{
            prom, 
            setProm
        }}>
            {children}
        </DataGameContext.Provider>
    );
}

export default DataGame;
export {
    DataGameContext
};