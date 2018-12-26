// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import mapboxgl from 'mapbox-gl';
import config from '../config';

// Import the update helper
import update from '../helpers/update';

// Import Koten class
import { Koten } from './Kot';

// Import the template to use
const mapTemplate = require('../templates/page-with-map.handlebars');

export default () => {
  // Data to be passed to the template
  update(compile(mapTemplate)({}));
  //@@@ also check out mapbox.places-permanent

  // Mapbox code
  if (config.mapBoxToken) {
    mapboxgl.accessToken = config.mapBoxToken;

    const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
    const geocodingClient = mbxGeocoding({ accessToken: mapboxgl.accessToken });

    // eslint-disable-next-line no-unused-vars
    const map = new mapboxgl.Map({
      container: 'map',
      center: [3.725, 51.05],
      style: 'mapbox://styles/hektr/cjq3v4ble6mqg2sn1789jzans', // added custom mapbox studio style
      zoom: 12.5,
      maxBounds: [[3.67, 50.98], [3.8, 51.1]]
    });

    const koten = new Koten();
    koten.getAllAddreses().then(addresses => {
      forwardGeoCodeAddresses(addresses);
    });

    function forwardGeoCodeAddresses(arr) {
      arr.forEach(address => {
        geocodingClient
          .forwardGeocode({
            query: address,
            limit: 3
          })
          .send()
          .then(response => {
            const match = response.body;
            const marker = new mapboxgl.Marker()
              .setLngLat(match.features[0].center)
              .addTo(map);
          });
      });
    }

    map.on('click', function(e) {
      var features = map.queryRenderedFeatures(e.point, {
        layers: ['poi_label'] // replace this with the name of the layer
      });

      if (!features.length) {
        return;
      }

      var feature = features[0];

      var popup = new mapboxgl.Popup({ offset: [0, -15] })
        .setLngLat([3.725, 51.05])
        .setHTML(
          '<h3>' +
            feature.properties.title +
            'Hello world' +
            '</h3><p>' +
            feature.properties.description +
            'lololol' +
            '</p>'
        )
        .setLngLat([3.725, 51.05])
        .addTo(map);
    });

    const marker = new mapboxgl.Marker().setLngLat([3.725, 51.05]).addTo(map);
  } else {
    console.error('Mapbox will crash the page if no access token is given.');
  }
};
