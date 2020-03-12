import React, { Component } from 'react';
import './App.css';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ResponsiveEmbed from 'react-bootstrap/ResponsiveEmbed';

import Map from './components/maps/Map';
import RecentStats from './components/widgets/RecentStats';
import DailyCases from './components/charts/DailyCases';

export default class App extends Component {
  render() {
    return (
      <div className="m-4">
        <Row>
          <Col xs={12} className="">
            <h1 className="text-light title">🇮🇹 Italy Coronavirus Tracker</h1>
          </Col>
        </Row>
        <Row>
          <Col lg={7}>
            <ResponsiveEmbed>
              <Map />
            </ResponsiveEmbed>
          </Col>
          <Col lg={5}>
            <RecentStats />
            <h2 className="text-light title mt-4">Daily Totals</h2>
            <DailyCases />
          </Col>
        </Row>
        <footer className="text-light">
          <a href="https://github.com/joshpied" target="_blank">
            Josh Piedimonte
          </a>{' '}
          {new Date().getFullYear()}
        </footer>
      </div>
    );
  }
}
