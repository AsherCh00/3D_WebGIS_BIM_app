
// 替换为您的 Cesium Ion 访问令牌
let accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzMjc0NDEyNS1jMzk1LTQ2ZTgtYTk2OC0zZjNjNWIzNmExOGYiLCJpZCI6MjI5NjQzLCJpYXQiOjE3MjE2MDUyODR9.UujXyNvDw972zHk6tqsF3cKhwCrJObszRFjGuFRd_Kc'
// 替换为您要删的资源 ID
let assetId = 2706305

// const response = await request({
//     url: 'https://api.cesium.com/v1/assets',
//     method: 'DELETE',
//     headers: { Authorization: `Bearer ${accessToken}` },
//     json: true,
//     body: {
//         assetId: '2672866',
//     }
// });

const request = require('request');

request({
    url: `https://api.cesium.com/v1/assets/${assetId}`,
    method: 'DELETE',
    headers: { 
        Authorization: `Bearer ${accessToken}` 
    },
    json: true
}, (error, response, body) => {
    if (error) {
        console.error('Error deleting asset:', error);
    } else if (response.statusCode === 204) {
        console.log('Asset deleted successfully');
    } else {
        console.log('Failed to delete asset:', response.statusCode, body);
    }
});
