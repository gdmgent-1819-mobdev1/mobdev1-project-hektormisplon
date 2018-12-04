// Pages
import AuthView from './pages/auth';
import HomeView from './pages/home';
import AboutView from './pages/about';
import FirebaseView from './pages/firebase-example';
import MapboxView from './pages/mapbox-example';

export default [
  { path: '/', view: AuthView },
  { path: '/home', view: HomeView },
  { path: '/about', view: AboutView },
  { path: '/firebase', view: FirebaseView },
  { path: '/mapbox', view: MapboxView }
];
