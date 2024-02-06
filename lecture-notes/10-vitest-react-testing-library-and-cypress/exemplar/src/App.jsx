import { Provider } from "react-redux";

import BookList from "./components/BookList";
import { store } from "./utils/store";

const App = () => {
  return (
    <Provider store={store}>
      <BookList />
    </Provider>
  );
};

export default App;