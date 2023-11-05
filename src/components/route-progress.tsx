import Router from 'next/router';
import NProgress from 'nprogress';

import 'nprogress/nprogress.css';

NProgress.configure({
  showSpinner: false,
  trickleSpeed: 200,
});

const startProgress = () => {
  NProgress.start();
};

const doneProgress = () => {
  NProgress.done();
};

Router.events.on('routeChangeStart', startProgress);
Router.events.on('routeChangeComplete', doneProgress);
Router.events.on('routeChangeError', doneProgress);

const RouteProgress = () => <div />;

export default RouteProgress;
