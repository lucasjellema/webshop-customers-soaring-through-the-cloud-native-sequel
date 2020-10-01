# webshop-customers-soaring-through-the-cloud-native-sequel
Customers (incl sign in) section of the Soaring through the Clouds Webshop Portal

To build the image

npm install
docker push lonneke/customer-ms-ui

Run locally:
docker run --name customer-ms-ui -p 8080:80 -d  lonneke/customer-ms-ui



