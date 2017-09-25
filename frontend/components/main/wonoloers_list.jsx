import React from 'react';
import {Link, withRouter } from 'react-router-dom';
import WorkerBox from './worker_box';

class WonoloersList extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      workers: [],
      count: 1,
      search: "",
      searchBadgeIds: 1,
      results: [],
      message: ""
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.displayText = this.displayText.bind(this);
    this.updateState = this.updateState.bind(this);
    this.updateSearch = this.updateSearch.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  componentDidMount() {
    let workers = [];
    this.props.fetchUsers(this.props.currentUser.api_access_token, this.state.count).then(() => {
      this.props.users.users.forEach((user) => {
        workers.push(user);
    });
  }).then(() => this.setState({workers: workers}));
  }

  handleSubmit (e) {
  e.preventDefault();
  let workers = [];
  let count;
  if (e.target.id === "next") {
    count = 1;
  } else {
      count = -1;
  }
  this.props.fetchUsers(this.props.currentUser.api_access_token, this.state.count + count).then(() => {
    this.props.users.users.forEach((user) => {
      workers.push(user);
  });
  }).then(() => this.setState({workers: workers}));
  this.setState({count: this.state.count + count});
  this.setState({results: []})
  }

  displayText(value) {
    return this.props.badges.badges.filter(badge => {
    const regex = new RegExp(value, 'gi');
    return badge.name.match(regex);
    });
  }

  updateState() {
    return (e) => {
      this.setState({search :e.currentTarget.value});
      this.setState({results: this.displayText(e.currentTarget.value)});
    };
  }

  updateSearch(id) {
    return (e) => {
      this.setState({searchBadgeIds: id });
      this.setState({search :e.currentTarget.innerText});
      this.setState({results: []});
    };
  }

  handleSearch() {
    let workers = [];
    let ids = [];
    for (var i = 0; i < this.state.workers.length; i++) {
      ids = this.state.workers[i].user_badges.map(badge => badge.badge_id);
      if (ids.includes(this.state.searchBadgeIds)) {
        workers.push(this.state.workers[i]);
      }
    }
    if (workers.length > 0) {
    this.setState({workers: workers, message:""});
    } else {
      this.props.fetchUsers(this.props.currentUser.api_access_token, this.state.count).then(() => {
        this.props.users.users.forEach((user) => {
          workers.push(user);
      });
    }).then(() => this.setState({workers: workers, message:"No workers found!"}));
    }
  }

// }).then(() => this.setState({workers: workers}));
  render(){
    let back;
    let results;
    if (this.state.count > 1) {
      back = (<div className="prev" onClick={this.handleSubmit}>
                <i id="prev" className="material-icons">navigate_before</i><h3 id="prev">Back</h3>
              </div>);
    } else {
      back = "";
    }
    if (this.state.results) {
      results = (this.state.results.map((badge, idx) => {
        return (
        <div key={idx} onClick={this.updateSearch(badge.id)}>{badge.name}</div>
        );
      }));
    } else {
      results = "Search by Badge Name";
    }
    if (this.state.workers.length === 0) {
      return null;
    } else {
    return(
      <div className="badgebox">
        <h1>Wonoloers</h1>
        {this.state.workers.map((worker, idx) => <WorkerBox worker={worker} key={idx} badges={this.props.badges}/>)}
        {this.state.message}
        {back}
        <div className="next" onClick={this.handleSubmit}>
            <i id="next" className="material-icons">navigate_next</i><h3 id="next">Next</h3>
        </div>
        <form className="badgeSearch" onSubmit={this.handleSearch}>
          <input className="search" type="text"
          value={this.state.search}
          onChange={this.updateState()}
          />
          <ul className="results">
            <div>
              {results}
            </div>
          </ul>
        <input className="submit-button" type="submit" value="Submit" />
        </form>
      </div>
    );
  }
  }
}

export default withRouter(WonoloersList);
