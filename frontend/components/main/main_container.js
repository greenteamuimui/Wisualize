import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom';
import {fetchBadges} from '../../actions/badges_actions';
import {clearErrors} from '../../actions/errors_actions';
import MainPage from './main';

const mapStatetoProps = (state) => {
  return {
    currentUser: state.currentUser,
    badges: state.badges
  };
};

const mapDispatchtoProps = (dispatch) => {
  return {
    fetchBadges: (token) => dispatch(fetchBadges(token)),
    clearErrors: () => dispatch(clearErrors())
  };
};

export default withRouter(connect(
  mapStatetoProps,
  mapDispatchtoProps
)(MainPage));
