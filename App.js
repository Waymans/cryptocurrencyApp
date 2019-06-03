import React, { Component } from 'react';
import { BottomNavigation } from 'react-native-paper';
import Info from './components/Info';
import News from './components/News';
import History from './components/History';
import Search from './components/Search';
import Top from './components/Top';

const TopRoute = () => <Top />;
const SearchRoute = () => <Search />;
const HistoryRoute = () => <History />;
const NewsRoute = () => <News />;
const InfoRoute = () => <Info />;

export default class App extends Component {
  state = {
    index: 0,
    routes: [
      { key: 'top', title: 'Top25', icon: 'subject', color: '#0074D9' },
      { key: 'search', title: 'Search', icon: 'search', color: '#2ECC40' },
      {
        key: 'history',
        title: 'History',
        icon: 'assessment',
        color: '#FF851B',
      },
      { key: 'news', title: 'News', icon: 'dashboard', color: '#FF4136' },
      { key: 'info', title: 'Info', icon: 'person', color: '#B10DC9' },
    ],
  };
  _handleIndexChange = index => this.setState({ index });
  _renderScene = BottomNavigation.SceneMap({
    top: TopRoute,
    search: SearchRoute,
    history: HistoryRoute,
    news: NewsRoute,
    info: InfoRoute,
  });
  render() {
    return (
      <BottomNavigation
        navigationState={this.state}
        onIndexChange={this._handleIndexChange}
        renderScene={this._renderScene}
      />
    );
  }
}
