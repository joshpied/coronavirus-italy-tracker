import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import { fetch } from 'whatwg-fetch';

export default class RecentStats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      error: null,
      data: { labels: null } 
    };
  }

  getDateString(date) {
    let [dateString] = date.split('T');
    const [year, month, day] = dateString.split('-');
    const newDate = new Date(year * 1, month * 1 - 1, day * 1);

    return new Intl.DateTimeFormat('en-GB', {
      month: 'short',
      day: 'numeric'
    }).format(newDate);
  }

  fetchStats() {
    fetch(`https://coronavirus-italia-api.now.sh/api/stats/national`)
      .then(response => response.json())
      .then(data => {
        this.setState({
          data: {
            labels: data.daily_national_stats.map(day =>
              this.getDateString(day.data)
            ),
            datasets: [
              {
                label: 'Cases',
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(75,192,192,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: data.daily_national_stats.map(
                  day => day.totale_attualmente_positivi
                )
              },
              {
                label: 'Deceased',
                fill: false,
                lineTension: 0.1,
                backgroundColor: '#dc3545',
                borderColor: '#dc3545',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: '#dc3545',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: '#dc3545',
                pointHoverBorderColor: '#dc3545',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: data.daily_national_stats.map(day => day.deceduti)
              },
              {
                label: 'Recovered',
                fill: false,
                lineTension: 0.1,
                backgroundColor: '#28a745',
                borderColor: '#28a745',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: '#28a745',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: '#28a745',
                pointHoverBorderColor: '#28a745',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: data.daily_national_stats.map(day => day.dimessi_guariti)
              }
            ]
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
    const { isLoading, data } = this.state;
    return (
      <div>
        {isLoading ? (
          <p className="text-light">Loading...</p>
        ) : (
          <>
            <Line data={data} />
          </>
        )}
      </div>
    );
  }
}
