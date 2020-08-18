import React from 'react';

class ElapsedSinceDoom extends React.Component {
  constructor() {
    super();
    const f = this.setDate.bind(this);
    this.gavFuckyWucky = (new Date("08/13/2020 08:00")).getTime();
    this.state = {now: Date.now(), tickerId: setInterval(f, 1000)};
  }

  setDate() {
    this.setState({now: Date.now()});
  }

  componentWillUnmount() {
    clearInterval(this.state.tickerId);
  }

  render() {
    // Sub the results day date from the current date.
    const diff = this.state.now - this.gavFuckyWucky;

    // Get the parts to render.
    const parts = [];

    // Get the amount of days.
    const days = Math.floor(diff / 86400000);
    if (days !== 0) parts.push(`${days} days`);

    // Get the amount of hours.
    const hours = Math.floor(diff / 3600000) % 24;
    if (hours !== 0) parts.push(`${hours} hour${hours !== 1 ? "s" : ""}`);

    // Get the amount of minutes.
    const minutes = Math.floor(diff / 60000) % 60;
    if (minutes !== 0) parts.push(`${minutes} minute${minutes !== 1 ? "s" : ""}`);

    // Get the amount of seconds.
    const seconds = Math.floor(diff / 1000) % 60;
    if (seconds !== 0) parts.push(`${seconds} second${seconds !== 1 ? "s" : ""}`);

    // Format the string.
    const last = parts.pop();
    let text = parts.join(", ");
    if (text === "") text = last;
    else text += ` and ${last}`;

    // Return the stringified information.
    return <h2>{text}</h2>;
  }
}

function InformationPanel() {
  return <aside>
    <h3>Why should he resign?</h3>
    <p>Gavin Williamson's policies will have destroyed the lives of many young people. Whilst he did apologise for this, his fixes were too late and were after many people lost their university places.</p>

    <h3>Isn't this website a bit harsh?</h3>
    <p>He had every opportunity to change his course of actions to not destroy thousands of lives. With that said, all I personally want is for him to resign from his position since I believe his actions were too damaging for him to stay on.</p>

    <h3>Should I go and [do social media action to] him?</h3>
    <p><b>No.</b> This website is for informational and satirical purposes only. I do not condone any personal attacks. He only deserves to lose his position as anyone who failed at a job as badly as he did would have to in normal circumstances.</p>
  </aside>;
}

export default class App extends React.Component {
  // Constructs the class.
  constructor() {
    // Load the base class.
    super();

    // There are 4 resignation dates.
    // undefined = not loaded, null = not happened yet, 0 = server error, Date = he's gone
    this.state = {resignationDate: undefined};

    // Get the information every second.
    const f = this.getResignationInfo.bind(this);
    f();
    setInterval(f, 1000);
  }

  // Get the resignation info.
  async getResignationInfo() {
    try {
      const res = await fetch("/api/v1/resigned");
      if (!res.ok) throw new Error();
      const json = await res.json();
      this.setState({resignationDate: json ? new Date(json) : json});
    } catch (_) {
      this.setState({resignationDate: 0});
    }
  }

  // Render the page.
  render() {
    // Render the live part.
    let el;
    switch (this.state.resignationDate) {
      case undefined: {
        el = <main>
          <h1>Loading...</h1>
        </main>;
        break;
      }
      case 0: {
        el = <main>
          <h1>I can't figure out if he resigned.</h1>
          <p>There's an issue either your end, my end or the government's end. This should change in a few seconds when I can update.</p>
        </main>;
        break;
      }
      case null: {
        el = <main>
          <h1>Gavin has not resigned yet.</h1>
          <p>Time elapsed since the A-Level/BTEC results day where his policies altered the lives of many students:</p>
          <ElapsedSinceDoom />
        </main>;
        break;
      }
      default: {
        const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'long', day: '2-digit' }) 
        const [{ value: month },,{ value: day },,{ value: year }] = dateTimeFormat.formatToParts(this.state.resignationDate);
        el = <main>
          <h1>🦀 GAV IS GONE 🦀</h1>
          <p>Gavin resigned on <b>{day} {month} {year}</b>.</p>
          <iframe src="https://www.youtube.com/embed/LDU_Txk06tM?autoplay=1&amp;t=74" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </main>;
      }
    }

    // Return the rendered app.
    return <div className="App">
      {el}
      <hr />
      <InformationPanel />
    </div>;
  }
}
