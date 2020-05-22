import React, { Component } from 'react';
import "./HallOfFame.css"


export default class Leaderboard extends Component {
    constructor() {
        super();
        this.state = {
            scores: [],
        };
    }

    componentDidMount() {
        fetch("http://localhost:62609/api/Scores/GetScoreList", {
            method: 'GET', headers: {
                'Content-Type': 'application/json'
            }
        }).then(results => results.json()).then(
            (result) => {
                return (<table>
                    <thead>
                        <tr>
                            <th>Nume</th>
                            <th>Scor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {result.map((item,index) =>
                            <tr key={index}>
                                <td>{item.personName}</td><td>{item.scoreValue}</td>
                            </tr>)
                        }
                    </tbody>
                </table>
                )
            },
            // Note: it's important to handle errors here
            (error) => {
                alert('Bad API call');
                console.log(error);
            }).then(res=>this.setState({scores:res}))
       
    }

    render() {
        return (
            <div className="leaderboard2">
                <div className="leaderboard2">
                    {this.state.scores}
                </div>
            </div>
        )
    }
}