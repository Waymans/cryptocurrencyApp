import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  ImageBackground,
  Platform,
} from 'react-native';
import { CRYPTO_KEY } from 'react-native-dotenv';

export default class App extends React.Component {
  state = {
    crypto: [],
    loading: true,
    error: null,
  };
  async componentDidMount() {
    const start = 1;
    const limit = 20;
    const url =
      'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=' +
      start +
      '&limit=' +
      limit +
      '&CMC_PRO_API_KEY=' +
      CRYPTO_KEY;
    let thus = this; // 'this' gets lost in async/await
    try {
      let response = await fetch(url);
      let resJson = await response.json();
      const crypto = resJson.data;
      thus.setState({
        crypto,
        loading: false,
        error: null,
      });
      return null;
    } catch (error) {
      thus.setState({
        loading: false,
        error: error,
      });
    }
  }
  renderLoading() {
    return <Text style={styles.center}>Loading...</Text>;
  }
  renderError() {
    return <Text style={styles.center}>Uh oh: {this.state.error.message}</Text>;
  }
  getColor(color) {
    if (color < 0) {
      return { color: 'red' };
    } else {
      return { color: 'green' };
    }
  }
  renderCryptos() {
    if (this.state.error) {
      return this.renderError();
    }
    return (
      <View>
        {this.state.crypto.map(list => (
          <View style={styles.card}>
            <View style={styles.contain}>
              <Text>
                <Text style={styles.symbol}>{list.symbol}</Text> |{' '}
                <Text style={styles.name}>{list.name}</Text>
              </Text>
              <Text style={styles.price}>${list.quote.USD.price}</Text>
              <Text>
                24h:{' '}
                <Text style={this.getColor(list.quote.USD.percent_change_24h)}>
                  {list.quote.USD.percent_change_24h}%
                </Text>
              </Text>
              <Text>
                7d:{' '}
                <Text style={this.getColor(list.quote.USD.percent_change_7d)}>
                  {list.quote.USD.percent_change_7d}%
                </Text>
              </Text>
            </View>
          </View>
        ))}
      </View>
    );
  }
  render() {
    return (
      <ImageBackground
        source={{
          uri:
            'https://themerkle.com/wp-content/uploads/2017/02/rare-cryptocurrency.jpg',
        }}
        style={{ width: '100%', height: '100%' }}>
        <View style={styles.container}>
          <ScrollView>
            {this.state.loading ? this.renderLoading() : this.renderCryptos()}
          </ScrollView>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Platform.OS === 'ios' ? 20 : 5,
    backgroundColor: 'transparent',
    padding: 8,
  },
  center: {
    justifySelf: 'center',
    alignSelf: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 5,
    margin: 10,
    padding: 5,
  },
  name: {},
  symbol: { fontWeight: 'bold' },
  price: {},
  contain: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
});
