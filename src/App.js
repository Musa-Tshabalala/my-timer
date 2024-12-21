import './App.css';
import React from 'react'


const Break = (props) => {
  return (
    <div className='session'>
      <h2 id='break-label'>Break Length</h2>
      <div className='buttons'>
        <button className='crements' id='break-decrement' onClick={props.decrement}><i className='bi bi-dash'></i></button>
        <p id='break-length'>{props.length}</p>
        <button className='crements' id='break-increment' onClick={props.increment}><i className='bi bi-plus'></i></button>
      </div>
    </div>
  )
}

const Session = (props) => {
  return (
    <div className='session'>
      <h2 id='session-label'>Session Length</h2>
      <div className='buttons'>
        <button className='crements' id='session-decrement' onClick={props.decrement}><i className='bi bi-dash'></i></button>
        <p id='session-length'>{props.length}</p>
        <button className='crements' id='session-increment' onClick={props.increment}><i className='bi bi-plus'></i></button>
      </div>
    </div>
  )
}

const Timer = (props) => {
  const timeoutColor = {
    color: `${props.timeout ? 'Red' : 'rgb(200, 90, 0)'}`
  }
  return (
    <div id='timer'>
      {<h2 id='timer-label'>{
        props.isBreak ?
        'Break' :
        'Session'
        }</h2>}
      <p id='time-left' style={timeoutColor}>{props.counter}</p>
    </div>
  )
}

const StopTime = (props) => {
  return (
    <div>
      {props.isPaused ? <button id="start_stop" onClick={props.resume}><i className="fa-solid fa-play"></i></button> : <button id='start_stop' onClick={props.pause}><i className="fa-solid fa-pause"></i></button>}
    </div>
  )
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPaused: true,
      isBreak: false,
      breakLength: 5,
      sessionLength: 25,
      remainingSessionTime: 25 * 60,
      remainingBreakTime: 5 * 60,
      counter: '25:00',
      timeout: false,
    };
    this.Audio = React.createRef()
    this.timerId = null;
    this.incrementBreak = this.incrementBreak.bind(this);
    this.IncrementSession = this.IncrementSession.bind(this);
    this.decrementBreak = this.decrementBreak.bind(this);
    this.decrementSession = this.decrementSession.bind(this);
    this.pauseTime = this.pauseTime.bind(this);
    this.resume = this.resume.bind(this);
    this.reset = this.reset.bind(this);
  }

  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  incrementBreak() {
    if (this.timerId) return;
    const length = this.state.breakLength;
    if (length >= 60) return;
    this.setState((prevState) => ({
      breakLength: prevState.breakLength + 1,
    }));
    if (this.state.isBreak) {
      this.setState(prevState => ({
        remainingBreakTime: (prevState.breakLength) * 60,
        counter: this.formatTime((prevState.breakLength) * 60),
        timeout: false
      }))
    }
  }

  IncrementSession() {
    if (this.timerId) return;
    const length = this.state.sessionLength;
    if (length >= 60) return;
    this.setState((prevState) => ({
      sessionLength: prevState.sessionLength + 1,
    }));
    if (!this.state.isBreak) {
      this.setState(prevState => ({
        remainingSessionTime: (prevState.sessionLength) * 60,
        counter: this.formatTime((prevState.sessionLength) * 60),
        timeout: false
      }))
    }
  }

  decrementBreak() {
    if (this.timerId) return;
    const length = this.state.breakLength;
    if (length <= 1) return;
    this.setState((prevState) => ({
      breakLength: prevState.breakLength - 1,
    }));
    if (this.state.isBreak) {
      this.setState(prevState => ({
        remainingBreakTime: (prevState.breakLength) * 60,
        counter: this.formatTime((prevState.breakLength) * 60),
      }))
    }
  }

  decrementSession() {
    if (this.timerId) return;
    const length = this.state.sessionLength;
    if (length <= 1) return;
    this.setState((prevState) => ({
      sessionLength: prevState.sessionLength - 1,
    }));

    if (!this.state.isBreak) {
      this.setState(prevState => ({
        remainingSessionTime: (prevState.sessionLength) * 60,
        counter: this.formatTime((prevState.sessionLength) * 60),
      }))
    }
  }

  pauseTime() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.setState({ isPaused: true });
  }

  resume() {
    if (this.timerId) return;
  
    this.timerId = setInterval(() => {
      this.setState((prevState) => {
        let newTime;
  
        if (!prevState.isBreak) {
          newTime = prevState.remainingSessionTime - 1;

          if (newTime <= 30) {
            this.setState({timeout: true})
          } else {
            this.setState({timeout: false})
          }

          if (newTime === 0) {
            const beep = this.Audio.current
            beep.src = "https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav"
            beep.play()
            .catch(err => console.error("Audio Playback Error:", err))
          }
          
          if (newTime < 0) {
            return {
              isBreak: true,
              remainingBreakTime: prevState.breakLength * 60,
              counter: this.formatTime(prevState.breakLength * 60),
              timeout: false
            };
          }

          return {
            remainingSessionTime: newTime,
            counter: this.formatTime(newTime),
          };
        } else {
          newTime = prevState.remainingBreakTime - 1;

          if (newTime <= 30) {
            this.setState({timeout: true})
          } else {
            this.setState({timeout: false})
          }

          if (newTime === 0) {
            const beep = this.Audio.current
            beep.src = "https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav"
            beep.play()
            .catch(err => console.error("Audio Playback Error:", err))
          }

          if (newTime < 0) {
            return {
              isBreak: false,
              remainingSessionTime: prevState.sessionLength * 60,
              counter: this.formatTime(prevState.sessionLength * 60),
              timeout: false
            };
          }

          return {
            remainingBreakTime: newTime,
            counter: this.formatTime(newTime),
          };
        }
      });
    }, 1000);
  
    this.setState({ isPaused: false });
  }

  reset() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }

    const beep = this.Audio.current;
    beep.pause();
    beep.currentTime = 0;

    this.setState({
      isPaused: true,
      isBreak: false,
      breakLength: 5,
      sessionLength: 25,
      remainingSessionTime: 25 * 60,
      remainingBreakTime: 5 * 60,
      counter: '25:00',
      timeout: false
    });
  }

  render() {
    return (
      <div className="App" id='container'>
        <div id="break-session">
          <Break
            length={this.state.breakLength}
            increment={this.incrementBreak}
            decrement={this.decrementBreak}
          />
          <Session
            length={this.state.sessionLength}
            increment={this.IncrementSession}
            decrement={this.decrementSession}
          />
        </div>
        <div id='timer-container'>
          <Timer timeout={this.state.timeout} isBreak={this.state.isBreak} counter={this.state.counter} />
          <div className='buttons'>
            <StopTime
            resume={this.resume}
            pause={this.pauseTime}
            isPaused={this.state.isPaused}
            />
            <button id="reset" onClick={this.reset}>
            <i className="fa-solid fa-rotate-right"></i>
            </button>
          </div>
        </div>
        <div>
          <audio ref={this.Audio} id='beep' />
        </div>
      </div>
    );
  }
}

export default App;


