import "./App.css";
import Router from "./shared/navigation/browser_router";
import { LanguageProvider } from "./shared/language/language_context";

function App() {
  return (
    <div className="app">
      <header>
        <LanguageProvider>
          <Router />
        </LanguageProvider>
      </header>
    </div>
  );
}

export default App;
