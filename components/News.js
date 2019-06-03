import React, { Component } from 'react';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Surface,
  ActivityIndicator,
  Colors,
} from 'react-native-paper';
import HTML from 'react-native-render-html';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  Platform,
  Linking,
} from 'react-native';

export default class News extends Component {
  state = {
    news: [],
    loading: true,
    error: null,
  };
  componentDidMount() {
    const url = 'https://min-api.cryptocompare.com/data/v2/news/?lang=EN';
    fetch(url)
      .then(res => res.json())
      .then(data => {
        const news = data.Data;
        this.setState({
          news,
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
  }
  renderLoading() {
    return (
      <ActivityIndicator
        style={styles.center}
        animating={true}
        color={Colors.red800}
        size="large"
      />
    );
  }
  renderError() {
    return <Text style={styles.center}>Uh oh: {this.state.error.message}</Text>;
  }
  renderNews() {
    if (this.state.error) {
      return this.renderError();
    }
    if (this.state.news) {
      return (
        <View style={styles.main}>
          {this.state.news.map(list => cards(list))}
        </View>
      );
    } else {
      this.renderNews();
    }
  }
  render() {
    return (
      <View
        style={[
          styles.container,
          styles.paddingTop,
          { backgroundColor: 'rgba(255,65,54,0.3)' },
        ]}>
        <ScrollView>
          {this.state.loading ? this.renderLoading() : this.renderNews()}
        </ScrollView>
      </View>
    );
  }
}

const cards = list => (
  <Surface style={styles.surface}>
  <Card style={styles.card}>
    <Card.Cover source={{ uri: list.imageurl }} />
    <Card.Content>
      <Title style={styles.center}>{list.title}</Title>
      <HTML html={list.body} />
    </Card.Content>
    <Card.Actions style={styles.center}>
      <Button
        onPress={() =>
          Linking.openURL(list.url).catch(err =>
            console.error('Linking...', err)
          )
        }>
        Link
      </Button>
    </Card.Actions>
  </Card>
  </Surface>
);

const styles = StyleSheet.create({
  surface: {
    elevation: 4,
    backgroundColor: 'white',
    borderRadius: 5,
    margin: 5,
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
  center: {
    alignSelf: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 5,
    flexDirection: 'row',
  },
});