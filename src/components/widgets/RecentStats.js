import React, { Component } from 'react';

import CardDeck from 'react-bootstrap/CardDeck';
import Card from 'react-bootstrap/Card';

export default class RecentStats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      stats: null,
      error: null
    };
  }

  fetchStats() {
    fetch(`https://coronavirus-italia-api.now.sh/api/stats/national/recent`)
      .then(response => response.json())
      .then(data => {
        this.setState({
          stats: {
            cases: data.national_stats.totale_attualmente_positivi,
            deceased: data.national_stats.deceduti,
            recovered: data.national_stats.dimessi_guariti,
            date: new Intl.DateTimeFormat('en-GB', {
              dateStyle: 'long'
            }).format(new Date(data.national_stats.data))
          },
          isLoading: false
        });
      })
      .catch(error => this.setState({ error, isLoading: false }));
  }

  componentDidMount() {
    this.fetchStats();
  }

  render() {
    const { isLoading, stats } = this.state;
    return (
      <div>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            <h2
              className="text-light"
              style={{ textTransform: 'uppercase', letterSpacing: '5px' }}
            >
              {stats.date}
            </h2>
            <CardDeck>
              <Card bg="info" text="white">
                {/* <Card.Header>Header</Card.Header> */}
                <Card.Body>
                  <Card.Text>CASES</Card.Text>
                  <Card.Title>
                    <h2>{stats.cases}</h2>
                  </Card.Title>
                </Card.Body>
              </Card>
              <Card bg="danger" text="white">
                <Card.Body>
                  <Card.Text>DECEASED</Card.Text>
                  <Card.Title>
                    <h2>{stats.deceased}</h2>
                  </Card.Title>
                </Card.Body>
              </Card>
              <Card bg="success" text="white">
                <Card.Body>
                  <Card.Text>RECOVERED</Card.Text>
                  <Card.Title>
                    <h2>{stats.recovered}</h2>
                  </Card.Title>
                </Card.Body>
              </Card>
            </CardDeck>
          </>
        )}
      </div>
    );
  }
}
