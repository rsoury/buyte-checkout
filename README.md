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

The widget is an embeddable React.js app responsible for receiving a user's intent to pay, opening the Go page, and displaying a checkout confirmation dialog/modal after the payment has been authorised.  

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

## `window.Buyte`

### Installation

You can use the following script to load the Buyte Widget.  
Please replace the S3 URL in the snippet with your own URL targeting the built widget `index.js` file.  

```javascript
(function(window, document){
   var load = function(){
      var script = document.createElement('script');
      script.async = true;
      script.type = 'text/javascript';
      script.src = 'URL_TO_WIDGET_JS_INDEX.js';
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

### Create your settings

Checkout settings are established in an object. The parameters are as follows:

| Property           | Type    | Description                                                                                                   |
| :---               | :---    | :---                                                                                                          |
| `publicKey`        | string  | **REQUIRED:** The public key retrieved from your Buyte Dashboard, or Buyte API                                |
| `widgetId`         | string  | **REQUIRED:** The ID of the Checkout Widget retrieved from your Buyte Dashboard, or Buyte API                 |
| `options.enabled`  | boolean | Whether to enable the widget or not                                                                           |
| `options.shipping` | boolean | Whether to include shipping options select within the confirmation dialog/modal. Disable for virtual products |
| `options.dark`     | boolean | Whether to render white buttons for a dark background                                                         |
| `items[].name`     | string  | The name of the item in the items array                                                                       |
| `items[].amount`   | integer | The price amount of the item in the items array. Amount is in cents, such that $5.36 is 536                   |
| `items[].quantity` | integer | The item quantity in the items array.                                                                         |

### Load the Checkout

```javascript
window.Buyte("load", {
   publicKey: "pk_ZlQjZlNvLyCfAIDvLu00YlUkXIU2KIKfZPw1KvQiYlpuYyHwXvDh",
   widgetId: "3d50e4a2-ebd9-4c19-8c78-596fe6a07794",
   options: {
      // dark: true
      enabled: true,
      shipping: true
   },
   items: [
      {
         label: "Some drone",
         amount: 5500
      },
      {
         label: "Some other item",
         amount: 1200
         quantity: 2
      },
   ]
});
```

### Callbacks

- `onReady`  
  
  ```javascript
  window.Buyte("onReady", function(){ 
     console.log("I'm ready!") 
  });
  ```
  
- `onShippingRequired`  
  *This is a special callback*  
  Here, a AJAX request to fetch available shipping methods for the given contact must be made and supplied to the Checkout.  
  This is only necessary where `shipping` is enabled.  
  
  ```javascript
  window.Buyte("onShippingRequired", function(shippingContact, setShippingMethods){
      console.log(shippingContact);
      setTimeout(function(){ // Some AJAX request.
      setShippingMethods([
         {
            "id": "free-shipping",
            "name": "Free Shipping",
            // "description": "Delivery in a week",
            "rate": 0,
            "minOrder": 5000
         },
         {
            "id": "express-delivery",
            "name": "Express Delivery",
            // "description": "Delivers overnight",
            "rate": 2900,
            "minOrder": 0
         },
         {
            "id": "standard-shipping",
            "name": "Standard Shipping",
            // "description": "Delivery in a week",
            "rate": 990,
            "minOrder": 0,
            "maxOrder": 5000
         }
      ]);
      }, 2000);
   })
  ```
  
- `onPayment`  
  *This is a special callback*  
  Here, we receive the Buyte Payment Token.  
  This Token must be submitted to the Merchant Server to facilitate the payment with the Buyte API.  
  
  ```javascript
   window.Buyte("onPayment", function(paymentToken, done){
      console.log(paymentToken);
      setTimeout(function(){
         done();
         alert("Apple Pay Payment Authorised! " + JSON.stringify(paymentToken));
      }, 3000)
   });
  ```
  
- `onAbort`  
  Triggered when payment authorisation was aborted.
  
  ```javascript
   window.Buyte("onAbort", function(){
      console.log('From Window: Buyte Closed.');
   });
  ```
- `onStart`  
  You can optionally choose to delay starting the checkout process and opening the Go Page.
  
  ```javascript
   window.Buyte("onStart", function(type, start){
      setTimeout(function(){
         start();
      }, 1000);
   });
  ```
  
- `onDestroy`  
  
  ```javascript
  window.Buyte("onDestroy", function(){
     console.log("The widget has been destroyed...");
  });
  ```
  
- `onShow`  
  
  ```javascript
   window.Buyte("onShow", function(){
      console.log("The widget has been shown!");
   });
  ```
  
- `onHide`  
  
  ```javascript
   window.Buyte("onHide", function(){
      console.log("The widget has been hidden...");
   });
  ```
  
- `onEnable`  
  
  ```javascript
   window.Buyte("onEnable", function(){
      console.log("The widget has been enabled!");
   });
  ```
  
- `onDisable`  
  
  ```javascript
   window.Buyte("onDisable", function(){
      console.log("The widget has been disabled...");
   });
  ```

### Actions

It is important to call some actions within the `onReady` callback to ensure that they affect the checkout.

- Add Item  
   
   ```javascript
   window.Buyte("add", {
      name: "Some drone #2"
      amount: 6000
   });
   ```
   
- Remove Item  
  
  ```javascript
  window.Buyte("remove", {
     name: "Some drone"
   });
   ```
   
- Update Checkout  
  This action is responsible for updating the Checkout's settings.
  
  ```javascript
  window.Buyte("update", {
     items: [
        {
           name: "This is my cool product!",
           amount: 400,
           quantity: 5
         }
      ]
   });
  ```
   
- Enable Checkout  
  Delaying checkout enablement may be necessary for eCommerce websites that fetch product data over an AJAX request. In that case, the checkout may be loaded with empty items in a disabled state until the data has been added accordingly.
   
   ```javascript
   window.Buyte("enable");
   ```
   
- Disable Checkout  
   
   ```javascript
   window.Buyte("enable");
   ```
   
- Hide Checkout  
   
   ```javascript
   window.Buyte("hide");
   ```
   
- Show Checkout  
   
   ```javascript
   window.Buyte("show");
   ```
   
- Destroy Checkout  
   This will require re-loading the checkout.
   
   ```javascript
   window.Buyte("destroy");
   ```

## Contribution

Simply fork this repo and make it your own, or create a pull request and we can build something awesome together!

## Enterprise Support

Whether you're looking to integrate a Legacy Payment Processor or Banking API, or looking for managed deployment and operation in your cloud, you can contact us at [Web Doodle](https://www.webdoodle.com.au/?ref=github-buyte) to discuss tailored solutions.

## Found this repo interesting?

Star this project ⭐️⭐️⭐️, and feel free to follow me on [Github](https://github.com/rsoury), [Twitter](https://twitter.com/@ryan_soury) or [Medium](https://rsoury.medium.com/)