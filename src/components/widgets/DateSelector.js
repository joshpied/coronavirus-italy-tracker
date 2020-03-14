import React, { Component } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';

export default class DateSelector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      dates: null,
      error: null
    };
  }

  getDisplayDate(date) {
    let [dateString] = date.split(' ');
    const [year, month, day] = dateString.split('-');
    const newDate = new Date(year * 1, month * 1 - 1, day * 1);

    return new Intl.DateTimeFormat('en-GB', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(newDate);
  }

  getDateKey(date) {
    let [dateString] = date.split(' '); // remove time from date
    return dateString;
  }

  fetchDates() {
    fetch(`https://coronavirus-italia-api.now.sh/api/stats/national`)
      .then(response => response.json())
      .then(data => {
        this.setState({
          dates: data.daily_national_stats
            .map(stat => ({
              dateKey: this.getDateKey(stat.data),
              dateDisplay: this.getDisplayDate(stat.data)
            }))
            .reverse(),
          isLoading: false
        });
      })
      .catch(error => {
        this.setState({ error, isLoading: false });
      });
  }

  setSelectedDate = (eventKey, e) => this.props.setSelectedDate(eventKey);

  componentDidMount() {
    this.fetchDates();
  }

  render() {
    const { dates, isLoading } = this.state;
    return (
      <>
        {isLoading ? (
          <p className="text-light">Loading...</p>
        ) : (
          <Dropdown
            alignRight
            onSelect={(eventKey, e) => {
              this.setSelectedDate(eventKey);
            }}
          >
            <Dropdown.Toggle variant="dark" id="dropdown-basic">
              Date
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {dates.map(date => (
                <Dropdown.Item
                  as="button"
                  key={date.dateKey}
                  eventKey={date.dateKey}
                >
                  {date.dateDisplay}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        )}
      </>
    );
  }
}
