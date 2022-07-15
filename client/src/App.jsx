import React from 'react';
import ReactDOM from 'react-dom/client';
import ProductOverview from './components/overview/ProductOverview.jsx';
import RatingsAndReviews from './components/ratingsAndReviews/RatingsAndReviews.jsx';
import RelatedAndOutfit from './components/relatedItems/index.jsx';
import QuestionsAnswersMain from './components/questionsAndAnswers/components/QuestionsAnswersMain.jsx';
import $ from 'jquery';
const axios = require('axios');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productId: 71698,
      productInfo: undefined,
      styleInfo: [],
      defaultStyle: undefined,
      reviewData: null,
      reviews: null,
      metaData: null,
      rating: null,
      totalNumberOfRatings: null,
      flag: false
    };
    this.filterRating = this.filterRating.bind(this);
  }

  componentDidMount() {
    this.prodIDChanger(this.state.productId);
  }

  getAllReviewsFunc() {
    return axios.get('/reviews', {
      params: { productId: this.state.productId },
    });
  }

  getAllMetaFunc() {
    return axios.get('/reviews/meta', {
      params: { productId: this.state.productId },
    });
  }

  getProductInfo() {
    return axios.post('/products/:product_id', {
      params: { productId: this.state.productId }
    });
  }

  getProductStyles() {
    return axios.post('/products/:product_id/styles', {
      params: { productId: this.state.productId }
    });
  }

  filterRating(starRating) {
    // console.dir(starRating);

    let filteredReviews = [];
    this.getAllReviewsFunc
      .then((response) => {
        const allReviews = response.data.results;
        allReviews.forEach((review) => {
          if (review.rating === starRating) {
            filteredReviews.push(review);
          }
        });
        this.setState({ reviews: filteredReviews });
      })
      .catch((err) => {
        console.log('error fetching reviews in filterRating', err);
      });
  }

  prodIDChanger(relatedID) {
    this.setState({ productId: relatedID}, () =>{
      this.updateProduct(relatedID);
    });
  }

  updateProduct(proId) {
    this.setState({ flag: false });
    Promise.all([this.getProductInfo(), this.getProductStyles(), this.getAllReviewsFunc(), this.getAllMetaFunc()]).then((values) => {
      console.log(values[0].data);
      console.log(values[1].data);
      const reviewData = values[2].data;
      const reviews = values[2].data.results;
      const metaData = values[3].data;
      const ratings = metaData.ratings;
      let totalNumberOfRatings = 0;
      let totalRatings = 0;
      let rating;

      for (var key in ratings) {
        totalNumberOfRatings += parseInt(ratings[key]);
        totalRatings += parseInt(key) * parseInt(ratings[key]);
      }

      rating = totalRatings / totalNumberOfRatings;
      rating = Math.round(10 * rating) / 10;

      var styles = values[1].data.results;
      var defaultStyle = styles.find(
        (product) => product['default?'] === true
      );
      if (defaultStyle === undefined) { defaultStyle = styles[0]; }

      this.setState({
        flag: true,
        productInfo: values[0].data,
        styleInfo: styles,
        defaultStyle: defaultStyle,
        reviews,
        reviewData,
        metaData,
        rating,
        totalNumberOfRatings
      });
    }).catch((err) => {
      console.log(err);
    });
  }

  // updateProduct(proId) {
  //   this.setState({ flag: false });
  //   Promise.all([this.getProductInfo(), this.getProductStyles()]).then((values) => {
  //     console.log(values[0].data);
  //     console.log(values[1].data);
  //     var styles = values[1].data.results;
  //     var defaultStyle = styles.find(
  //       (product) => product['default?'] === true
  //     );
  //     if (defaultStyle === undefined) { defaultStyle = styles[0]; }
  //     this.setState({
  //       flag: true,
  //       productInfo: values[0].data,
  //       styleInfo: styles,
  //       defaultStyle: defaultStyle
  //     });
  //   }).catch((err) => {
  //     console.log(err);
  //   }).then(() => {
  //     this.getAllReviewsFunc().then((response) => {
  //       const reviewData = response.data;
  //       const reviews = response.data.results;
  //       this.getAllMetaFunc()
  //         .then((response) => {
  //           const metaData = response.data;
  //           const ratings = metaData.ratings;
  //           let totalNumberOfRatings = 0;
  //           let totalRatings = 0;
  //           let rating;
  //           for (var key in ratings) {
  //             totalNumberOfRatings += parseInt(ratings[key]);
  //             totalRatings += parseInt(key) * parseInt(ratings[key]);
  //           }

  //           rating = totalRatings / totalNumberOfRatings;
  //           rating = Math.round(10 * rating) / 10;
  //           this.setState({
  //             reviews,
  //             reviewData,
  //             metaData,
  //             rating,
  //             totalNumberOfRatings,
  //           });
  //         })
  //         .catch((err) => {
  //           console.log('error getting reviews and metaData', err);
  //         });
  //     });
  //   });
  // }

  // updateProduct(productId) {
  //   var query = { productId: productId };
  //   $.ajax({
  //     url: '/products/:product_id',
  //     type: 'POST',
  //     data: query,
  //     success: (data) => {
  //       this.setState({
  //         productId: productId,
  //         productInfo: data,
  //       });
  //     },
  //     error: (err) => {
  //       console.log(err);
  //     },
  //   })
  //     .then(() => {
  //       $.ajax({
  //         url: '/products/:product_id/styles',
  //         type: 'POST',
  //         data: query,
  //         success: (styles) => {
  //           this.setState({
  //             styleInfo: styles.results,
  //             defaultStyle: styles.results.find(
  //               (product) => product['default?'] === true
  //             ),
  //           });
  //           if (this.defaultStyle === undefined) {
  //             this.setState({ defaultStyle: styles.results[0] });
  //           }
  //         },
  //         error: (err) => {
  //           console.log(err);
  //         },
  //       });
  //     })
  //     .then(() => {
  //       this.getAllReviewsFunc().then((response) => {
  //         const reviewData = response.data;
  //         const reviews = response.data.results;
  //         this.getAllMetaFunc()
  //           .then((response) => {
  //             const metaData = response.data;
  //             const ratings = metaData.ratings;
  //             let totalNumberOfRatings = 0;
  //             let totalRatings = 0;
  //             let rating;
  //             for (var key in ratings) {
  //               totalNumberOfRatings += parseInt(ratings[key]);
  //               totalRatings += parseInt(key) * parseInt(ratings[key]);
  //             }

  //             rating = totalRatings / totalNumberOfRatings;
  //             rating = Math.round(10 * rating) / 10;
  //             this.setState({
  //               reviews,
  //               reviewData,
  //               metaData,
  //               rating,
  //               totalNumberOfRatings,
  //             });
  //           })
  //           .catch((err) => {
  //             console.log('error getting reviews and metaData', err);
  //           });
  //       });
  //     });
  // }

  render() {
    if (this.state.flag) {
      return (
        <div>
          <h1>Atelier</h1>
          <ProductOverview
            productInfo={this.state.productInfo}
            defaultStyle={this.state.defaultStyle}
            styleList={this.state.styleInfo}
            rating={3}
          />
          <RelatedAndOutfit
            prodID={this.state.productId}
            prodInfo={this.state.productInfo}
            styleInfo={this.state.styleInfo}
            prodIDChanger={this.prodIDChanger.bind(this)}
          />

          <QuestionsAnswersMain
            productId={this.state.productId}
            productInfo={this.state.productInfo}
            key={this.state.productId}
          />
          <RatingsAndReviews
            productId={this.state.productId}
            reviewData={this.state.reviewData}
            reviews={this.state.reviews}
            metaData={this.state.metaData}
            rating={this.state.rating}
            totalNumberOfRatings={this.state.totalNumberOfRatings}
            filterRating={this.filterRating}
          />
        </div>
      );
    }
  }
}

ReactDOM.createRoot(document.getElementById('app')).render(<App />);

export default App;
