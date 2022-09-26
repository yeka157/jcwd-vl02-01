import axios from "axios";
import "./App.css";
import { useEffect, useState } from "react";
import { Button } from "@chakra-ui/react"


function App() {

  return (
    <div className="App bg-yellow-500">
      <h1 className="text-green-">Halo</h1>
      <Button colorScheme='teal' size='xs'>
        Button
      </Button>
    </div>
  );
}

export default App;
