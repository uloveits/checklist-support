/**
 * Created by 网线丶 on 2018/6/23.
 */
// node 后端服务器

const appApi = require('./api/appApi');
const ctrlApi = require('./api/ctrlApi');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// 后端api路由
app.use('/api/app', appApi);
app.use('/api/ctrl', ctrlApi);

// 监听端口
app.listen(3000);
console.log('success listen at port:3000......');
