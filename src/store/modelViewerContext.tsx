'use client'
import React, { useContext, useState } from 'react'

const modelViewerContext = React.createContext<any>({})

export function useModelViewerStates() {
  const returnValues = useContext(modelViewerContext)
  return returnValues
}

export default function ModelViewerContextProvider({ children }) {
  const [states, setStates] = useState({})

  const passingValues = {
    states,
    changePropsState: setStates,
  }

  return (
    <modelViewerContext.Provider value={passingValues}>
      {children}
    </modelViewerContext.Provider>
  )
}
