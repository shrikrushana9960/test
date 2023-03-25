import React, { useEffect, useState } from "react";
import { gql } from "graphql-request";
import { keystoneContext } from "../keystone/context";
import { client } from "../util/request";
import { Card, Col, Row } from 'antd';


const products = () => {
  const [products, setProducts] = useState();
  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    const query = gql`
      {
        products {
          id
          title
          description
          price
          meta
          hsnCode
          vendor {
            id
            name
            email
          }
        }
      }
    `;
    const allProducts = await client.request(query);
    console.log(allProducts)
    setProducts(allProducts.products);

    // const users = await keystoneContext.query.User.findMany({
    //   query: 'id name email',
    // });
    // console.log(users)
  };
  return (
    <div>
        <Row gutter={16}>
      {products && products.map((item: any) => <Col span={12}>
      <Card title={item.title} bordered={false}>
        Card content
      </Card>
    </Col>)}
    </Row>
    </div>
  );
};

export default products;
