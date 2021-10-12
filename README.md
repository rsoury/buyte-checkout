# Buyte Checkout

A drop-in Checkout widget and self-hosted payment page for <a href="https://github.com/rsoury/buyte">Buyte</a> - digital wallet payment orchestration, built with React.js

![Buyte Banner](https://github.com/rsoury/buyte/blob/master/examples/images/banner-1544x500.jpg)

## Demo

[See demo on Youtube](https://www.youtube.com/watch?v=fKnVh8_HLwk)

## Getting Started

These instructions will get you a copy of the project built for deployment or local development.

### Prerequisites

- Node.js 10.0+

### Set up

1. Clone the repository `git clone git@github.com:rsoury/buyte-checkout.git`
2. Install Node.js Dependencies: `yarn`
3. Copy `.env.example` to `.env`, `.env.development` or `.env.production` and configure you environment settings.

### Local Development

- Start the Widget App - `yarn start:widget`
- Start the Go App - `yarn start:go`

### Deployment

1. Build your App
   `yarn build-public`
   1. If you would like to build the widget as a standalone app, use `yarn build-public:widget`
2. Deploy your Widget build files to a public repository to be used in a drop-in script
   1. S3: `aws s3 sync ./build/widget s3://public-bucket/buyte-widget`
3. Deploy your Go (Hosted Payment) App.
   [Netlify](https://netlify.com/) is a great service for hosting static websites
   
## Buyte Widget

The widget is an embeddable React.js app responsible for receiving a user's intent to pay, and displaying a checkout confirmation dialog/modal after the payment has been authorised.  

### Installation 

You can use the following script to load the Buyte Widget.  
Please replace the S3 URL in the snippet with your own URL targeting the built widget `index.js` file.  

```javascript
(function(window, document){
   var load = function(){
      var script = document.createElement('script');
      script.async = true;
      script.type = 'text/javascript';
      script.src = 'https://s3.us-east-2.amazonaws.com/buyte.cdn.production/js/v1/buyte.js';
      var firstScript = document.getElementsByTagName('script')[0];
      firstScript.parentNode.insertBefore(script, firstScript);
   };
   if(document.readyState === "complete"){
      load();
   }else if(window.attachEvent){
      window.attachEvent('onload', load);
   }else{
      window.addEventListener('load', load);
   }
})(window, document);
```

### API Docs

To learn more about the JS API, please visit the [JS API Docs](https://github.com/rsoury/buyte-checkout/blob/master/docs/js-widget-api.md)  

## Buyte Go Page (Hosted Payment Page)

The "Go" Hosted Payment Page is a React.js Web App, separate from the widget, developed to mitigate failed domain verifications and minimise domain verification maintenance when offering Apple Pay.  

> This supports use-cases where a Payment Facilitator can offer Apple Pay through their hosted page, and therefore dismiss the requirement for its clients to manage their own Apple Pay Merchant Id Domain Association File.

### Apple Pay & the Go Page

The **Apple Pay Merchant Id Domain Association File** is required to be hosted on any domain where an Apple Pay purchase is conducted.  
This includes the Go Page.
During an Apple Pay purchase, `https://go.yourdomain.com/.well-known/apple-developer-merchantid-domain-association.txt` will be requested to ensure that the domain is verified.  
You can download this file from your Apple Developer Portal.  

When deploying the Go Page to Netlify or some alternative, we advise using a Proxy configuration for the association file to simplify management and renewal.  
In the `./public/_redirects` file, the following snippet can be added for an association file hosted on S3.  
```
/.well-known/* https://s3-ap-southeast-2.amazonaws.com/buyte.au/well-known/:splat 200
```

Now with this file reachable, third-party websites/domains that have installed their Checkout can redirect to your "Go" Page to facilitate their Apple Pay transactions.  

## Contribution

Simply fork this repo and make it your own, or create a pull request and we can build something awesome together!

## Enterprise Support

Whether you're looking to integrate a Legacy Payment Processor or Banking API, or looking for managed deployment and operation in your cloud, you can contact us at [Web Doodle](https://www.webdoodle.com.au/?ref=github-buyte) to discuss tailored solutions.

## Found this repo interesting?

Star this project ⭐️⭐️⭐️, and feel free to follow me on [Github](https://github.com/rsoury), [Twitter](https://twitter.com/@ryan_soury) or [Medium](https://rsoury.medium.com/)