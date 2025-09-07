import "./App.css";

import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTheme, ThemeProvider } from "@mui/material";
import { orange } from "@mui/material/colors";

const queryClient = new QueryClient();

const theme = createTheme({
    palette: {
        orange: { main: orange[50] },
    },
});

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
                <RouterProvider router={router} />
            </ThemeProvider>
        </QueryClientProvider>
    );
}
export default App;
