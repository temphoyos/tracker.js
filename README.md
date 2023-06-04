# tracker.js
Super simple tracking script to track certain user interactions on my personal site. I add a click eventListener to the document object and a callback event handling function. When selected events take place, a defined dataLayer.push() call is executed to populated the Google Tag Manager (GTM) dataLayer.

Additionally, this script handles the following GA4 Enhanced Ecommerce (EEC) event dataLayers:

-view_item_list This event is pushed to the GTM dataLayer when either the home or category pages are displayed <br />
-select_item This event is pushed to the GTM dataLayer when a user clicks on any of the blog posts listed on the home or category pages <br />
-view_item This event is pushed to the GTM dataLayer when a blog post is displayed <br />
-add_to_cart This event is pushed to the GTM dataLayer when a user scroll reaches 50% of the height of a blog post <br />
-purchase This event is pushed to the GTM dataLayer when a user scroll reaches 100% of the height of a blog post <br />
