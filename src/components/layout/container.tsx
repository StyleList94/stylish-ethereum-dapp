import type { ReactNode } from 'react';

import Footer from './footer';
import Header from './header';
import MainContainer from './main-container';

type Props = {
  children: ReactNode;
};

const Container = ({ children }: Props) => (
  <>
    <Header />
    <MainContainer>{children}</MainContainer>
    <Footer />
  </>
);

export default Container;
