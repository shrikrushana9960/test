import React, { useEffect, useState } from 'react';
import type { NextPage, GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { gql } from 'graphql-request';
import { client } from '../util/request';
import { keystoneContext } from '../keystone/context';
import { Header } from '../components/Header';
import Login from "../components/LoginButton"

const Home: NextPage = () => {
  return (
    <div
      style={{
        padding: '0 2rem',
      }}
    >
      <Head>
        <title>Keystone + Next.js</title>
        <meta
          name="description"
          content="Example to use Keystone APIs in a Next.js server environment."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* <Header /> */}
      <Login/>
    </div>
  );
};



function ServerRenderedContent({
  users,
}: {
  users: { id: string; name: string; email: string | null }[];
}) {
  return (
    <div>
      <p>
        <strong>Users fetched from the server (in getServerSideProps)</strong>
      </p>
      <ol>
        {users.map(u => {
          return (
            <li key={u.id}>
              <span>{u.name} </span>
              {u.email ? <span>(email: {u.email})</span> : <span>(email: not authenticated)</span>}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function ClientRenderedContent() {
  const [users, setUsers] = useState<Array<{ id: string; name: string; email: string | null }>>([]);

  // Fetch users from REST api route
  useEffect(() => {
    const query = gql`
      {
        users {
          id
          name
          email
        }
      }
    `;

   
  }, []);

  return (
    <div style={{ minHeight: '8rem' }}>
      <p>
        <strong>Users fetched from the browser (in useEffect())</strong>
      </p>
      {users.length ? (
        <ol>
          {users.map(u => {
            return (
              <li key={u.id}>
                <span>{u.name} </span>

                {u.email ? (
                  <span>(email: {u.email})</span>
                ) : (
                  <span>(email: not authenticated)</span>
                )}
              </li>
            );
          })}
        </ol>
      ) : (
        <div>loading...</div>
      )}
    </div>
  );
}

export default Home;
