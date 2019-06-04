import React, { Component } from 'react';
import {
  Appbar,
  Button,
  Divider,
  ActivityIndicator,
  Colors,
  Surface,
} from 'react-native-paper';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  Platform,
} from 'react-native';
import { getColor, financial } from '../utils/functions';

export default class Top extends Component {
  state = {
    crypto: [],
    loading: true,
    error: null,
  };
  componentDidMount() {
    this.fetcher();
  }
  fetcher = () => {
    console.log(1)
    const url =
      'https://min-api.cryptocompare.com/data/top/totalvolfull?limit=25&tsym=USD';
    fetch(url)
      .then(res => res.json())
      .then(data => {
        const crypto = data.Data;
        this.setState({
          crypto,
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
  renderLoading() {
    return (
      <View style={{ justifyContent: 'center' }}>
        <ActivityIndicator
          style={styles.center}
          animating={true}
          color={Colors.blue800}
          size="large"
        />
      </View>
    );
  }
  renderError() {
    return <Text style={styles.center}>Uh oh: {this.state.error.message}</Text>;
  }
  renderCryptos() {
    if (this.state.error) {
      return this.renderError();
    }
    if (this.state.crypto) {
      return (
        <View>
          {this.state.crypto.map(list => cardMaker(list))}
        </View>
      );
    } else {
      this.renderCryptos();
    }
  }
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'rgba(0,116,217,0.3)' }}>
        <Appbar style={styles.top}>
          <Appbar.Action icon="refresh" onPress={() => this.fetcher()} />
          <Appbar.Content title="CryptoC" onPress={() => alert('Welcome!')} />
        </Appbar>
        <View style={styles.container}>
          <ScrollView>
            {this.state.loading ? this.renderLoading() : this.renderCryptos()}
          </ScrollView>
        </View>
      </View>
    );
  }
}

const cardMaker = list => {
  return (
    <Surface style={[styles.card,styles.surface]}>
      <Image
        style={styles.image}
        source={{
          uri: `https://www.cryptocompare.com${list.CoinInfo.ImageUrl}`,
        }}
      />
      <View style={styles.cardSpread}>
        <View style={styles.contain}>
          <Text>
            <Text style={styles.symbol}>{list.CoinInfo.Name}</Text> |{' '}
            <Text>
              {list.CoinInfo.FullName === 'Crypto.com Chain Token'
                ? 'Crypto.com Chain'
                : list.CoinInfo.FullName}
            </Text>
          </Text>
          <Text>Price: $ {financial(list.RAW.USD.PRICE)}</Text>
        </View>
        <View style={styles.contain}>
          <Text>
            24h:{' '}
            <Text style={getColor(list.DISPLAY.USD.CHANGEPCT24HOUR)}>
              {financial(list.DISPLAY.USD.CHANGEPCT24HOUR)}%
            </Text>
          </Text>
          <Text>
            1d:{' '}
            <Text style={getColor(list.DISPLAY.USD.CHANGEPCTDAY)}>
              {financial(list.DISPLAY.USD.CHANGEPCTDAY)}%
            </Text>
          </Text>
        </View>
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  surface: {
    elevation: 4,
  },
  top: {
    paddingTop: Platform.OS === 'ios' ? 15 : 0,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,116,217,0.4)',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
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
  cardSpread: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  image: {
    width: 30,
    height: 30,
    marginTop: 2,
    marginRight: 5,
  },
  symbol: { fontWeight: 'bold' },
  contain: {
    flexDirection: 'column',
    flexWrap: 'wrap',
  },
});
