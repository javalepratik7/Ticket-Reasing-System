const axios = require('axios');

const {
  SHOPIFY_STORE_DOMAIN,
  SHOPIFY_API_VERSION,
  SHOPIFY_ACCESS_TOKEN
} = process.env;

/**
 * Fetch user details from Shopify Order
 * @param {number|string} orderId
 * @returns {Object} { userName, userEmail, userPhoneNo, orderId }
 */
async function getUserDetailsFromShopify(orderId) {
  try {
    if (!orderId) {
      throw new Error('OrderId is required');
    }

    const url = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/orders/${orderId}.json`;

    const response = await axios.get(url, {
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
        'Content-Type': 'application/json'
      }
    });

    const order = response.data?.order;

    if (!order) {
      throw new Error('Order not found in Shopify response');
    }

    const userName =
      order.customer
        ? `${order.customer.first_name || ''} ${order.customer.last_name || ''}`.trim()
        : null;

    const userEmail = order.email || order.contact_email || null;
    const userPhoneNo = order.phone || order.customer?.phone || null;

    console.log("userName",userName,"userEmail",userEmail,"userPhoneNo",userPhoneNo)

    // return {
    //   userName,
    //   userEmail,
    //   userPhoneNo,
    //   orderId: order.id
    // };

    // TEMP: Test Dummy response for local testing
    return {
      userName: 'Test User',
      userEmail: 'testuser@yopmail.com',
      userPhoneNo: '+919999999999',
      orderId: orderId // use the same orderId passed to the function
    };


  } catch (error) {
    console.error('Shopify Order Fetch Error:', error.message);
    throw error;
  }
}

module.exports = {
  getUserDetailsFromShopify
};
