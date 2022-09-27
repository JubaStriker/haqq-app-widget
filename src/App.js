import * as React from "react";
// 1. import `ChakraProvider` component
import { ChakraProvider } from "@chakra-ui/react";
import { ShopContext } from "./context";
import EmbedRoute from "./routes/embed/Embed";
import { parseQuery } from "./utils/url";
// import { XummSdk } from "xumm-sdk";
// import { XummSdkJwt} from "xumm-sdk";
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
