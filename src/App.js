import React, { Component } from 'react';
import './App.css';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ResponsiveEmbed from 'react-bootstrap/ResponsiveEmbed';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Map from './components/maps/Map';
import DateSelector from './components/widgets/DateSelector';
import RecentStats from './components/widgets/RecentStats';
import DailyCases from './components/charts/DailyCases';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      date: null
    };
  }

  setSelectedDate = date => this.setState({ date: date });

  render() {
    return (
      <div className="m-4">
        <Row>
          <Col xs={12} md={9}>
            <Header />
          </Col>
          <Col md={3} className="mt-2 mb-2 text-md-right">
            <DateSelector className="" setSelectedDate={this.setSelectedDate} />
          </Col>
        </Row>
        <Row>
          <Col lg={7}>
            <ResponsiveEmbed>
              <Map date={this.state.date} />
            </ResponsiveEmbed>
          </Col>
          <Col lg={5}>
            <div className="recent-stats">
              <RecentStats date={this.state.date} />
            </div>
            <h2 className="text-light title mt-4">Daily Totals</h2>
            <DailyCases />
          </Col>
        </Row>
        <Footer />
      </div>
    );
  }
}
