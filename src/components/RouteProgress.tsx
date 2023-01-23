/* eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access */
import { css, Global } from '@emotion/react';
import Router from 'next/router';
import NProgress from 'nprogress';

import 'nprogress/nprogress.css';

NProgress.configure({
  showSpinner: false,
  trickleSpeed: 200,
});

const progressStyle = css`
  #nprogress .bar {
    height: 3px;
  }

  #nprogress .peg {
  }
`;

const startProgress = () => {
  NProgress.start();
};

const doneProgress = () => {
  NProgress.done();
};

Router.events.on('routeChangeStart', startProgress);
Router.events.on('routeChangeComplete', doneProgress);
Router.events.on('routeChangeError', doneProgress);

const RouteProgress = () => <Global styles={progressStyle} />;

export default RouteProgress;
