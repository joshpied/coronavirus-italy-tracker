import React, { Component } from 'react';
import { fetch } from 'whatwg-fetch';

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

  getDateString(date) {
    let [dateString] = date.split('T');
    const [year, month, day] = dateString.split('-');
    const newDate = new Date(year * 1, month * 1 - 1, day * 1);

    return new Intl.DateTimeFormat('en-GB', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(newDate);
  }

  formatNumber(number) {
    return new Intl.NumberFormat().format(number);
  }

  fetchStats() {
    let url;
    if (this.props.date)
      url = `https://coronavirus-italia-api.now.sh/api/stats/national/${this.props.date}`;
    else
      url = `https://coronavirus-italia-api.now.sh/api/stats/national/recent`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        this.setState({
          stats: {
            cases: this.formatNumber(
              data.national_stats.totale_attualmente_positivi
            ),
            deceased: this.formatNumber(data.national_stats.deceduti),
            recovered: this.formatNumber(data.national_stats.dimessi_guariti),
            date: this.getDateString(data.national_stats.data)
          },
          isLoading: false
        });
      })
      .catch(error => {
        this.setState({ error, isLoading: false });
      });
  }

  componentDidMount() {
    this.fetchStats();
  }

  componentDidUpdate(prevProps) {
    if (this.props.date !== prevProps.date) this.fetchStats();
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
              {stats?.date}
            </h2>
            <CardDeck>
              <Card bg="info" text="white">
                <Card.Body>
                  <Card.Text>CASES</Card.Text>
                  <Card.Title>
                    <h2>{stats?.cases}</h2>
                  </Card.Title>
                </Card.Body>
              </Card>
              <Card bg="danger" text="white">
                <Card.Body>
                  <Card.Text>DECEASED</Card.Text>
                  <Card.Title>
                    <h2>{stats?.deceased}</h2>
                  </Card.Title>
                </Card.Body>
              </Card>
              <Card bg="success" text="white">
                <Card.Body>
                  <Card.Text>RECOVERED</Card.Text>
                  <Card.Title>
                    <h2>{stats?.recovered}</h2>
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
