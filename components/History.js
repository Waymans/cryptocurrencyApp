import React, { Component } from 'react';
import {
  Divider,
  ActivityIndicator,
  Colors,
  Surface,
  Searchbar,
} from 'react-native-paper';
import {
  YAxis,
  BarChart,
  Grid,
} from 'react-native-svg-charts';
import {
  Text,
  View,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';

export default class History extends Component {
  state = {
    text: '',
    coin: [],
    refresh: true,
    loading: false,
    error: null,
  };
  fetchCoin = name => {
    const url = `https://min-api.cryptocompare.com/data/histoday?fsym=${name}&tsym=USD&limit=7`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        const coin =
          data.Response === 'Error'
            ? 'There is no available data for that symbol.'
            : data;
        this.setState({
          text: name,
          coin,
          loading: false,
          error: null,
        });
      })
      .catch(error => {
        this.setState({
          loading: false,
          error: error,
        });
      });
  };
  middleFetch = name => {
    this.setState({ loading: true, refresh: false });
    this.fetchCoin(name);
  };
  renderLoading() {
    return (
      <ActivityIndicator
        style={styles.center}
        animating={true}
        color={Colors.orange800}
        size="large"
      />
    );
  }
  renderRefresh() {
    return (
      <View style={styles.card}>
        <Text>
          Look up symbol names to view their previous 7 day gains/losses.
        </Text>
      </View>
    );
  }
  renderError() {
    return <Text style={styles.center}>Uh oh: {this.state.error.message}</Text>;
  }
  renderCoin() {
    if (this.state.error) {
      return this.renderError();
    }
    return (
      <View style={styles.main}>
        {typeof this.state.coin === 'string'
          ? errorMaker(this.state.coin)
          : graph(this.state.coin, this.state.text)}
      </View>
    );
  }
  render() {
    return (
      <KeyboardAvoidingView
        style={[
          styles.paddingTop,
          styles.containerEnd,
          { backgroundColor: 'rgba(255,133,27,0.3)' },
        ]}>
        <Surface style={[styles.container, styles.surface]}>
          {this.state.refresh ? this.renderRefresh() : null}
          {this.state.loading ? this.renderLoading() : null}
          {!this.state.refresh && !this.state.loading
            ? this.renderCoin()
            : null}
        </Surface>
        <Searchbar
          placeholder="i.e. 'BTC'"
          onChangeText={query => {
            this.setState({ text: query, refresh: true });
          }}
          icon="done"
          value={this.state.text}
          onIconPress={() =>
            this.middleFetch(this.state.text.trim().toUpperCase())
          }
        />
      </KeyboardAvoidingView>
    );
  }
}

const graph = (coin, name) => {
  const start = new Date(coin.TimeFrom * 1000).toLocaleDateString();
  const end = new Date(coin.TimeTo * 1000).toLocaleDateString();
  let data = [];
  for (let i = 0; i < coin.Data.length; i++) {
    data.push(Math.round(coin.Data[i].close - coin.Data[i].open));
  }
  return (
    <View style={{ height: 300, width: 300 }}>
      <Text style={styles.center}>
        7 day history of gains/losses for {name}.
      </Text>
      <Divider style={styles.divider} />
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
        }}>
        <YAxis
          data={data}
          contentInset={{ top: 10, bottom: 10 }}
          svg={{
            fill: 'grey',
            fontSize: 10,
          }}
          numberOfTicks={10}
          formatLabel={value => `$ ${value}`}
        />
        <BarChart
          style={{ flex: 1, marginLeft: 5 }}
          data={data}
          svg={{ fill: '#FF851B' }}
          contentInset={{ top: 10, bottom: 10 }}>
          <Grid />
        </BarChart>
      </View>
      <Divider style={styles.divider} />
      <Text style={styles.center}>
        {start} - {end}
      </Text>
    </View>
  );
};

const errorMaker = text => (
  <Surface style={styles.surface}>
    <Text>{text}</Text>
  </Surface>
);

const styles = StyleSheet.create({
  divider: {
    paddingBottom: 20,
    backgroundColor: 'transparent',
  },
  surface: {
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 10,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  paddingTop: {
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
    padding: 5,
  },
  containerEnd: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
    padding: 5,
  },
  center: {
    alignSelf: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 5,
    margin: 5,
    padding: 5,
    flexDirection: 'row',
  },
});