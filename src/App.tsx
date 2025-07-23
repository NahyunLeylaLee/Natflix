import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import Header from "./Routes/Header";
import TV from "./Routes/TV";
import NotFound from "./Routes/NotFound";
import { ErrorBoundary } from "react-error-boundary";

function App() {
  return (
    <ErrorBoundary fallback={<NotFound />}>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:category/:movieId" element={<Home />} />
          <Route path="/tv" element={<TV />} />
          <Route path="/tv/:category/:tvId" element={<TV />} />
          <Route path="/search" element={<Search />} />
          <Route path="/search/:category/:showId" element={<Search />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;