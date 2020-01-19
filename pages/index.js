import React, { useState } from "react";
import axios from "axios";
import ProductList from "../components/Index/ProductList";
import ProductPagination from "../components/Index/ProductPagination";
import baseUrl from "../utils/baseUrl";
import { Search, Grid, Header, Segment } from 'semantic-ui-react';
import _ from 'lodash'






function Home({ products, totalPages }) {
  const [isLoading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [value, setValue] = useState('');

  // const source = products.reduce((accumulator, currentValue) => {

  //   title: product.name;
  //   price: product.price;
  //   mediaUrl: product.mediaUrl
  // }, []




  // )

  const handleResultSelect = (e, { result }) => setValue(result.name);

  const handleSearchChange = (e, { value }) => {
    setLoading(true);
    setValue(value);

    setTimeout(() => {
      if (value.length < 1) {
        setLoading(false);
        setResults([])
        setValue('');

        return;
      }

      const re = new RegExp(_.escapeRegExp(value), 'i')
      const isMatch = (result) => re.test(result.name)

      setLoading(false);
      setResults(_.filter(products, isMatch))

    }, 300)
  }


  return (
    <>
      <Grid>
        <Grid.Column width={6}>
          <Search
            loading={isLoading}
            onResultSelect={(e, { result }) => handleResultSelect(e, { result })}
            onSearchChange={_.debounce(handleSearchChange, 500, {
              leading: true,
            })}
            results={results}
            value={value}
          />
        </Grid.Column>
      </Grid>

      <ProductList products={products} />
      <ProductPagination totalPages={totalPages} />
    </>
  );
}

Home.getInitialProps = async ctx => {
  const page = ctx.query.page ? ctx.query.page : "1";
  const size = 9;
  const url = `${baseUrl}/api/products`;
  const payload = { params: { page, size } };
  // fetch data on server
  const response = await axios.get(url, payload);
  // return response data as an object
  return response.data;
  // note: this object will be merged with existing props
};

export default Home;
