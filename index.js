const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = '';

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

app.get('/', async (req, res) => {
    const customEndpoint = 'https://api.hubapi.com/crm/v3/objects/p244665714_vehicles?limit=10&properties=name,make,model';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(customEndpoint, { headers });
        const data = resp.data.results;
        res.render('custom', { title: 'Custom | HubSpot APIs', data });      
    } catch (error) {
        console.error('Error fetching custom object data:', error.response?.data || error.message);
        res.status(500).send('Error loading homepage data');
    }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get('/form', async (req, res) => {
    const objectType = 'p244665714_vehicles';
      const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    try {
        const respMake = await axios.get(`https://api.hubapi.com/crm/v3/properties/${objectType}/make`, { headers });
        const respModel = await axios.get(`https://api.hubapi.com/crm/v3/properties/${objectType}/model`, { headers });

        const makeOptions = respMake.data.options || [];
        const modelOptions = respModel.data.options || [];

        res.render('form', {
          title: 'Add or Update Vehicle',
          makeOptions,
          modelOptions
    });
  } catch (error) {
    console.error('Error fetching picklist options:', error.response?.data || error.message);
    res.status(500).send('Error loading form');
  }
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post('/submit', async (req, res) => {
  const { name, make, model } = req.body;
  const customEndpoint = 'https://api.hubapi.com/crm/v3/objects/p244665714_vehicles';
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
  };

  const body = {
    properties: { name, make, model }
  };

  try {
    await axios.post(customEndpoint, body, { headers });
    res.redirect('/');
  } catch (error) {
    console.error('Error creating/updating custom object:', error.response?.data || error.message);
    res.status(500).send('Error submitting form');
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

/** 
* * This is sample code to give you a reference for how you should structure your calls. 

* * App.get sample
app.get('/contacts', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});

* * App.post sample
app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "favorite_book": req.body.newVal
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});
*/


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
