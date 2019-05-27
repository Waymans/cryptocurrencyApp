import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  ImageBackground,
  Modal,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Constants } from 'expo';
import { CRYPTO_KEY } from 'react-native-dotenv';
import { icons } from './icons';

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
  renderCryptos() {
    if (this.state.error) {
      return this.renderError();
    }
    return (
      <View style={styles.main}>
        {this.state.crypto.map(list => (
          <CoinModal list={list} />
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

class CoinModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
    };
  }
  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }
  render() {
    const { list } = this.props;
    return (
      <View style={styles.container}>
        <Modal
          style={{backgroundColor: 'rgba(250,250,250,0.5)'}}
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={styles.modal}>
            <View style={styles.containModal}>
              {coinMaker(list)}
              <TouchableOpacity
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}>
                <Text style={styles.close}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <View style={styles.card}>
          <TouchableOpacity
            onPress={() => {
              this.setModalVisible(true);
            }}>
            <Image
              style={styles.image}
              source={validateIcons(list.symbol.toLowerCase())}
            />
          </TouchableOpacity>
          {cardMaker(list)}
        </View>
      </View>
    );
  }
}

const cardMaker = list => {
  return (
    <View style={styles.cardSpread}>
      <View style={styles.contain}>
        <Text>
          <Text style={styles.symbol}>{list.symbol}</Text> |{' '}
          <Text>{list.name}</Text>
        </Text>
        <Text>Price: ${financial(list.quote.USD.price)}</Text>
      </View>
      <View style={styles.contain}>
        <Text>
          24h:{' '}
          <Text style={getColor(list.quote.USD.percent_change_24h)}>
            {financial(list.quote.USD.percent_change_24h)}%
          </Text>
        </Text>
        <Text>
          7d:{' '}
          <Text style={getColor(list.quote.USD.percent_change_7d)}>
            {financial(list.quote.USD.percent_change_7d)}%
          </Text>
        </Text>
      </View>
    </View>
  );
};

const coinMaker = list => {
  return (
    <View style={styles.containModal}>
      <Image
        style={styles.imageModal}
        source={validateIcons(list.symbol.toLowerCase())}
      />
      <Text style={styles.text}>
        <Text style={styles.symbol}>{list.symbol}</Text> |{' '}
        <Text style={styles.text}>{list.name}</Text>
      </Text>
      <Text style={styles.text}>Price: ${financial(list.quote.USD.price)}</Text>
      <Text style={styles.text}>Rank: {list.cmc_rank}</Text>
      <Text style={styles.text}>
        1h:{' '}
        <Text style={getColor(list.quote.USD.percent_change_1h)}>
          {financial(list.quote.USD.percent_change_1h)}%
        </Text>
      </Text>
      <Text style={styles.text}>
        24h:{' '}
        <Text style={getColor(list.quote.USD.percent_change_24h)}>
          {financial(list.quote.USD.percent_change_24h)}%
        </Text>
      </Text>
      <Text style={styles.text}>
        7d:{' '}
        <Text style={getColor(list.quote.USD.percent_change_7d)}>
          {financial(list.quote.USD.percent_change_7d)}%
        </Text>
      </Text>
      <Text style={styles.text}>
        Added: {new Date(list.date_added).toDateString()}
      </Text>
    </View>
  );
};

function validateIcons(icon) {
  return icons[icon] ? icons[icon] : icons['coin'];
}

function getColor(color) {
  if (color < 0) {
    return { color: 'red' };
  } else {
    return { color: 'green' };
  }
}
function financial(x) {
  return Number.parseFloat(x).toFixed(2);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
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
  imageModal: {
    width: 30,
    height: 30,
    marginBottom: 30,
  },
  text: {
    fontSize: 20,
  },
  symbol: { fontWeight: 'bold' },
  contain: {
    flexDirection: 'column',
    flexWrap: 'wrap',
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containModal: {
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  close: {
    fontSize: 20,
  },
});