import * as React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { ShopContext } from "./context";
import EmbedRoute from "./routes/embed/Embed";
import { parseQuery } from "./utils/url";

const { shop = "" } = parseQuery(window.location.search);


function App() {
  return (
    <ChakraProvider>
      <ShopContext.Provider value={shop}>
        <EmbedRoute />
      </ShopContext.Provider>
    </ChakraProvider>
  );
}

export default App;
