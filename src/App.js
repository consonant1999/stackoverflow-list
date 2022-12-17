import List from './features/List';
import { ListContextProvider } from "./features/List/ListContext";

function App() {
  return (
    <ListContextProvider>
      <List />
    </ListContextProvider>
  );
}

export default App;
