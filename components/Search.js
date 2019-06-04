import React, { Component } from 'react';
import {
  Divider,
  ActivityIndicator,
  Colors,
  Surface,
  Searchbar,
} from 'react-native-paper';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { getColor, financial } from '../utils/functions';

export default class Search extends Component {
  state = {
    text: '',
    coin: [],
    refresh: true,
    loading: false,
    error: null,
  };
  fetchCoin = name => {
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${name}&tsyms=USD`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        const coin = data.Response
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
        color={Colors.green800}
        size="large"
      />
    );
  }
  renderRefresh() {
    return (
      <View style={styles.card}>
        <Text>Look up symbol names to view current stats.</Text>
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
      <View>
        {typeof this.state.coin === 'string'
          ? errorMaker(this.state.coin)
          : searchMaker(this.state.coin, this.state.text)}
      </View>
    );
  }
  render() {
    return (
      <KeyboardAvoidingView
        style={[
          styles.paddingTop,
          styles.containerEnd,
          { backgroundColor: 'rgba(46,204,64,0.3)' },
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

const searchMaker = (coin, name) => (
  <Surface style={styles.surface}>
    <Divider style={styles.divider} />
    <Image
      style={styles.imageModal}
      source={{
        uri: `https://www.cryptocompare.com${coin.DISPLAY[name].USD.IMAGEURL}`,
      }}
    />
    <Text style={styles.text}>{name}</Text>
    <Text style={styles.text}>
      Price: $ {financial(coin.RAW[name].USD.PRICE)}
    </Text>
    <Text style={styles.text}>
      24h:{' '}
      <Text style={getColor(coin.DISPLAY[name].USD.CHANGEPCT24HOUR)}>
        {coin.DISPLAY[name].USD.CHANGEPCT24HOUR}%
      </Text>
    </Text>
    <Text style={styles.text}>
      24h:{' '}
      <Text style={getColor(coin.RAW[name].USD.CHANGE24HOUR)}>
        $ {financial(coin.RAW[name].USD.CHANGE24HOUR)}
      </Text>
    </Text>
    <Text style={styles.text}>Cap: {coin.DISPLAY[name].USD.MKTCAP}</Text>
    <Text style={styles.text}>Low: {coin.DISPLAY[name].USD.HIGHDAY}</Text>
    <Text style={styles.text}>High: {coin.DISPLAY[name].USD.LOWDAY}</Text>
    <Text style={styles.text}>Supply: {coin.DISPLAY[name].USD.SUPPLY}</Text>
    <Divider style={styles.divider} />
  </Surface>
);

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
  imageModal: {
    width: 60,
    height: 60,
    marginBottom: 30,
  },
  text: {
    fontSize: 20,
  },
});
