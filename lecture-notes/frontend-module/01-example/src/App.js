import MyFirstComponent from "./components/examples/MyFirstComponent";
import MyProps from "./components/examples/MyProps";
import MyCounter from "./components/examples/MyCounter";
import MyInput from "./components/examples/MyInput";
import MyCheckbox from "./components/examples/MyCheckbox";
import MyForm from "./components/examples/MyForm";
import MyLifecycle from "./components/examples/MyLifecycle";
import MyCounterTwo from "./components/examples/MyCounterTwo";
import MyUnmount from "./components/examples/MyUnmount";
import MyProducts from "./components/examples/MyProducts";

const App = () => {
  return (
    <>
      <h1>My First component example</h1>
      <MyFirstComponent />
      <hr />
      <h1>My props example</h1>
      <MyProps name="John" />
      <hr />
      <h1>My state examples</h1>
      <MyCounter />
      <MyInput />
      <MyCheckbox />
      <MyForm />
      <hr />
      <h1>My lifecycle examples</h1>
      <MyLifecycle />
      <MyCounterTwo />
      <MyUnmount />
      <hr />
      <h1>My lists and keys example</h1>
      <MyProducts />
      <hr />
    </>
  );
};

export default App;
