class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
    }
  }

  render() {
    return (
      <div>
        <h1>Today's date: {this.state.date.toLocaleTimeString()}</h1>
      </div>
    );
  }
}