/* ============================================================
   SITE CONTENT: edit this file to change your portfolio.
   No coding needed beyond changing the text/URLs in quotes.
   ============================================================ */
(function(){
var HX=function(u,w){return 'https://images.higgs.ai/?default=1&output=webp&url='+encodeURIComponent(u)+'&w='+(w||2048)+'&q=85'};
var CF='https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/';
var R2='https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/aaaf/';

window.SITE={
  /* Brand name: shown in the big wordmark and top logo.
     (The wordmark is also in index.html: search for HALDOREN) */
  brand:'HALDOREN',

  /* Background / artwork.  To use your own files, upload them to
     assets/media/ and write e.g. 'assets/media/plate.webp' */
  images:{
    plate:    HX(CF+'hf_20261111_001031_a09dc558-2c69-4e05-83a4-5f01ebdd1363.png'),
    casePlate:HX(CF+'hf_20261111_001031_4a7c3fd9-2168-4219-9736-096a17bbb0e2.png'),
    cutout:   HX(CF+'hf_20261111_001143_ec356b1a-50a2-4b50-82fc-e346c914a406.png'),
    badge:    HX(CF+'hf_20261111_001143_65c037e6-0768-4b12-9f17-17be132ce16b.png',1200)
  },
  video:{
    transition: CF+'hf_20261111_001144_2b054228-95af-41d5-922d-b02979fe485b.mp4'
  },

  /* Your projects. Add, remove or reorder blocks freely.
       v     : video file (URL or assets/media/yourvideo.mp4)
       title : big heading on the ticket
       rows  : three small lines under the title (client / type / year)
       key   : small label above the description
       text  : description          */
  cases:[
    {v:R2+'vell-lookbook.mp4',title:'VELL LOOKBOOK',rows:['STUDIO VELL','E-COMMERCE','2026'],key:'// vell lookbook',
     text:'\u2014 a runway lookbook where every look steps forward on scroll and the cart follows along.'},
    {v:R2+'vasari-vhs-hero.mp4',title:'VASARI SHELF',rows:['VASARI ARCHIVE','PORTFOLIO','2026'],key:'// vasari shelf',
     text:'\u2014 a director\u2019s archive told as a shelf of tapes: pull one out and its story plays.'},
    {v:R2+'living-portrait-hero.mp4',title:'MINA PORTRAIT',rows:['MINA 3D','PERSONAL SITE','2025'],key:'// mina portrait',
     text:'\u2014 a 3D creator\u2019s homepage where the portrait follows your cursor and pulls faces.'}
  ]
};
})();
