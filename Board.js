import React from 'react';
import Cell from './Cell';

export default class Board extends React.Component {
    state = {
        boardData: this.initBoardData(this.props.height, this.props.width, this.props.mines),
        gameWon: false,
        gameLose: false,
        mineCount: this.props.mines,
        score: 0
    };

    /* Helper Functions */

    // get mines
    getMines(data) {
        let mineArray = [];

        data.map(datarow => {
            datarow.map((dataitem) => {
                if (dataitem.isMine) {
                    mineArray.push(dataitem);
                }
            });
        });

        return mineArray;
    }

    // get Flags
    getFlags(data) {
        let mineArray = [];

        data.map(datarow => {
            datarow.map((dataitem) => {
                if (dataitem.isFlagged) {
                    mineArray.push(dataitem);
                }
            });
        });

        return mineArray;
    }

    // get Hidden cells
    getHidden(data) {
        let mineArray = [];

        data.map(datarow => {
            datarow.map((dataitem) => {
                if (!dataitem.isRevealed) {
                    mineArray.push(dataitem);
                }
            });
        });

        return mineArray;
    }

    // get random number given a dimension
    getRandomNumber(dimension) {
        // return Math.floor(Math.random() * dimension);
        return Math.floor((Math.random() * 1000) + 1) % dimension;
    }

    // Gets initial board data
    initBoardData(height, width, mines) {
        let data = [];

        for (let i = 0; i < height; i++) {
            data.push([]);
            for (let j = 0; j < width; j++) {
                data[i][j] = {
                    x: i,
                    y: j,
                    isMine: false,
                    neighbour: 0,
                    isRevealed: false,
                    isEmpty: false,
                    isFlagged: false,
                };
            }
        }
        data = this.plantMines(data, height, width, mines);
        data = this.getNeighbours(data, height, width);
        console.log(data);
        return data;
    }

    // plant mines on the board
    plantMines(data, height, width, mines) {
        let randomx, randomy, minesPlanted = 0;

        while (minesPlanted < mines) {
            randomx = this.getRandomNumber(width);
            randomy = this.getRandomNumber(height);
            if (!(data[randomx][randomy].isMine)) {
                data[randomx][randomy].isMine = true;
                minesPlanted++;
            }
        }

        return (data);
    }

    // get number of neighbouring mines for each board cell
    getNeighbours(data, height, width) {
        let updatedData = data, index = 0;

        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                if (data[i][j].isMine !== true) {
                    let mine = 0;
                    const area = this.traverseBoard(data[i][j].x, data[i][j].y, data);
                    area.map(value => {
                        if (value.isMine) {
                            mine++;
                        }
                    });
                    if (mine === 0) {
                        updatedData[i][j].isEmpty = true;
                    }
                    updatedData[i][j].neighbour = mine;
                }
            }
        }

        return (updatedData);
    };

    // looks for neighbouring cells and returns them
    traverseBoard(x, y, data) {
        const el = [];

        //up
        if (x > 0) {
            el.push(data[x - 1][y]);
        }

        //down
        if (x < this.props.height - 1) {
            el.push(data[x + 1][y]);
        }

        //left
        if (y > 0) {
            el.push(data[x][y - 1]);
        }

        //right
        if (y < this.props.width - 1) {
            el.push(data[x][y + 1]);
        }

        // top left
        if (x > 0 && y > 0) {
            el.push(data[x - 1][y - 1]);
        }

        // top right
        if (x > 0 && y < this.props.width - 1) {
            el.push(data[x - 1][y + 1]);
        }

        // bottom right
        if (x < this.props.height - 1 && y < this.props.width - 1) {
            el.push(data[x + 1][y + 1]);
        }

        // bottom left
        if (x < this.props.height - 1 && y > 0) {
            el.push(data[x + 1][y - 1]);
        }

        return el;
    }

    // reveals the whole board
    revealBoard() {
        let updatedData = this.state.boardData;
        updatedData.map((datarow) => {
            datarow.map((dataitem) => {
                dataitem.isRevealed = true;
            });
        });
        this.setState({
            boardData: updatedData
        })
    }

    /* reveal logic for empty cell */
    revealEmpty(x, y, data) {
        let area = this.traverseBoard(x, y, data);
        area.map(value => {
            if (!value.isRevealed && (value.isEmpty || !value.isMine)) {
                data[value.x][value.y].isRevealed = true;
                if (value.isEmpty) {
                    this.revealEmpty(value.x, value.y, data);
                }
            }
        });
        return data;

    }

    // Handle User Events

    handleCellClick(x, y) {
        let win = false;
        let lose = false;
        // check if revealed. return if true.
        if (this.state.boardData[x][y].isRevealed) return null;

        // check if mine. game over if true
        if (this.state.boardData[x][y].isMine) {
            this.revealBoard();
            lose = true;

        }

        let updatedData = this.state.boardData;
        updatedData[x][y].isFlagged = false;
        updatedData[x][y].isRevealed = true;

        if (updatedData[x][y].isEmpty) {
            updatedData = this.revealEmpty(x, y, updatedData);
        }

        if (this.getHidden(updatedData).length === this.props.mines) {
            win = true;
            this.revealBoard();
        }

        this.setState({
            score: this.state.score + 1,
            boardData: updatedData,
            mineCount: this.props.mines - this.getFlags(updatedData).length,
            gameWon: win,
            gameLose: lose
        });
    }

    _handleContextMenu(e, x, y) {
        e.preventDefault();
        let updatedData = this.state.boardData;
        let mines = this.state.mineCount;
        let win = false;

        // check if already revealed
        if (updatedData[x][y].isRevealed) return;

        if (updatedData[x][y].isFlagged) {
            updatedData[x][y].isFlagged = false;
            mines++;
        } else {
            updatedData[x][y].isFlagged = true;
            mines--;
        }

        if (mines === 0) {
            const mineArray = this.getMines(updatedData);
            const FlagArray = this.getFlags(updatedData);
            win = (JSON.stringify(mineArray) === JSON.stringify(FlagArray));
            if (win) {
                this.revealBoard();
            }
        }

        this.setState({
            score: this.state.score + 1,
            boardData: updatedData,
            mineCount: mines,
            gameWon: win,
        });
    }

    renderBoard(data) {
        return data.map((datarow) => {
            return datarow.map((dataitem) => {
                return (
                    <div key={dataitem.x * datarow.length + dataitem.y}>
                        <Cell
                            onClick={() => this.handleCellClick(dataitem.x, dataitem.y)}
                            cMenu={(e) => this._handleContextMenu(e, dataitem.x, dataitem.y)}
                            value={dataitem}
                        />
                        {(datarow[datarow.length - 1] === dataitem) ? <div className="clear" /> : ""}
                    </div>);
            })
        });

    }

    // Component methods
    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(this.props) !== JSON.stringify(nextProps)) {
            this.setState({
                boardData: this.initBoardData(nextProps.height, nextProps.width, nextProps.mines),
                gameWon: false,
                mineCount: nextProps.mines,
            });
        }
    }
    sendScoreToAPI = () => {
        if (this.state.gameWon === true) {
            //get player name from browser prompt
            var name = prompt("Congrats for winning the game! Please enter your name: ", "Unknow");
            if (name != null) {
                var dataToSave = {
                    PersonName: name,
                    ScoreValue: this.state.score, //replace 10 with your actual variable (probably this.state.gameScore or this.state.time)
                    Date: new Date()
                };
                // Actual API call



                fetch(
                    "http://localhost:62609/api/Scores/InsertScore", // replace with the url to your API
                    {
                        method: 'POST', headers: {
                            'Content-Type': 'application/json'
                        }, body: JSON.stringify(dataToSave)
                    }
                )
                    .then(res => res.json())
                    .then(
                        (result) => {
                            alert('You saved your score');
                        },
                        // Note: it's important to handle errors here
                        (error) => {
                            alert('Bad API call');
                            console.log(error);
                        }
                    )
            }
        }
    }


    

    render() {
        return (
            <div className="board">
                <div className="game-info">
                    <span className="info">Mines: {this.state.mineCount}</span><br />
                    <span className="info">{this.state.gameWon ? "Ai castigat" : ""}</span>
                    <span className="info">{" Scor :" + " " + this.state.score}</span>
                    <span className="info">{this.state.gameLose ? " Esti slab" : ""}</span>

                </div>
                {
                    this.renderBoard(this.state.boardData)
                }
                {
                    this.sendScoreToAPI()
                }
            </div>

        );
    }
}