import React from 'react';
import ReactDOM from 'react-dom';
import Board from './components/Board';
import './index.css';
import Leaderboard from './components/HallOfFame';



function Reset() {
  
    function refreshPage() {
      window.location.reload(false);
    }
    
    return (
      <div>
        <button onClick={refreshPage}>Reset!</button>
      </div>
    );
  }
class Game extends React.Component {


    state = {
        height: 8,
        width: 8,
        mines: 10,
        gameStarted: false
    };

    DifficultyPlus = () => {

        if (this.state.mines <= 18) {
            this.setState({
                height: this.state.height+1,
                width: this.state.width+1,
                mines: this.state.mines+3,
            });
        }      
    }

    

    render() {
        const { height, width, mines } = this.state;
        return (
            <div className="game">
                <div className="game-Diff" >
                    <button  onClick={this.DifficultyPlus}>Mareste Dificulatea</button>
                    <button onClick={() => window.location.reload(false)}>Reset</button>
                    <p></p>
                </div>
                {
                    <Board height={height} width={width} mines={mines} />
                }
                 <br></br>
                 <br></br>
                 {
                   < Leaderboard />
                 }
                 
            </div>
        );
    }
}

ReactDOM.render(<Game />, document.getElementById('root'));