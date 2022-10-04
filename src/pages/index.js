import Head from 'next/head';

export default function IndexPage() {
  return (
    <div>
      <h1>Stylish Ethereum DApp</h1>
    </div>
  );
}

IndexPage.getLayout = (page) => (
  <>
    <Head>
      <title>Stylish Ethereum DApp</title>
    </Head>
    {page}
  </>
);
