var express = require('express');
var router = express.Router();

/* 主页. */
router.get('/', function(req, res, next) {
  res.render('login', { title: '登录页' });
});

/* 内容页. */
router.get('/app', function(req, res, next) {
  res.render('index', { title: '大屏互动' });
});

/* 画板. */
router.get('/draw', function(req, res, next) {
  res.render('draw', { title: '画板',canshu:req.query});
});

/* ppt. */
router.get('/ppt', function(req, res, next) {
  res.render('ppt', { title: 'ppt预览',canshu:req.query});
});

/* word. */
router.get('/word', function(req, res, next) {
  res.render('word', { title: 'ppt预览',canshu:req.query});
});

/* excel. */
router.get('/excel', function(req, res, next) {
  res.render('excel', { title: 'ppt预览',canshu:req.query});
});

/* pdf. */
router.get('/pdf', function(req, res, next) {
  res.render('pdf', { title: 'pdf预览',canshu:req.query});
});

/* pdf.js */
router.get('/pdfwer', function(req, res, next) {
  res.render('viewer', { title: 'pdf预览',canshu:req.query});
});

/* play.js */
router.get('/play', function(req, res, next) {
  res.render('play', { title: 'play',canshu:req.query});
});

module.exports = router;