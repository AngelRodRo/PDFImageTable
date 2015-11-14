$(function(){

   //getImages();

   $("#PDF").click(function(){
      generatePDFmake();
   });

});

var sources = [];

function getImageDataUrl(img){

   var canvas     = document.createElement('canvas');
   canvas.width   = img.width;
   canvas.height  = img.height;

   var context = canvas.getContext('2d');
   context.drawImage(img, 0, 0);

   return canvas.toDataURL('image/jpeg');
}


function getImages(){

   var images = $(".image");

   for (var i = 0; i < images.length; i++) {
      getDataUri($(images[0]).attr('src'),function(dataUri){
         sources.push(dataUri);
      });
   }




}

function getDataUri(url, callback) {
    var image = new Image();
    image.crossOrigin="anonymous";


    image.onload = function () {
        var canvas      = document.createElement('canvas');
        canvas.width    = this.width; // or 'width' if you want a special/scaled size
        canvas.height   = this.height; // or 'height' if you want a special/scaled size

        canvas.getContext('2d').drawImage(this, 0, 0);


        callback(canvas.toDataURL('image/png'));
    };

    image.src = url;
}


function generatePDFJsPdf(){
   var height     = 297;
   var width      = 210;
   var fontSize   = 20;

   var today      = new Date();
   var dd         = today.getDate();
   var mm         = today.getMonth()+1; //January is 0!
   var yyyy       = today.getFullYear();

   var doc = new jsPDF('l', 'mm', [height, width]);
   doc.setFontSize(fontSize);

   var text = "Orden de compra de productos";

   doc.text(height/2-text.length/2*3, 20, text);

   text = "Orden de pedido : # 9122102";

   doc.setFontSize(12);
   doc.text(20,35 ,text);
   doc.setFontSize(12);
   doc.text(240,35,'Fecha  : ' +  dd + '/' + mm + '/' + yyyy);

   var elem = $("#basic-table").get(0);
   var res = doc.autoTableHtmlToJson(elem);
}

function generatePDFmake(){
   var columns = [];
   var data = []
   var body = [];
   var flag = true;
   var table = $('#basic-table').tableToJSON();

   var today      = new Date();
   var dd         = today.getDate();
   var mm         = today.getMonth()+1; //January is 0!
   var yyyy       = today.getFullYear();


   for (var i = 0; i < table.length; i++) {
      if(i==0){
         for (var key in table[0]) {
           if (table[0].hasOwnProperty(key)) {
               data.push({
                  text: key,
                  bold: true,
                  alignment : 'center'
               });
           }
         }
      }
      else {
         for (var key in table[i]) {
           if(flag){
              if (table[i].hasOwnProperty(key)) {
                  data.push({
                     image: sources[i-1]
                  });
                  flag = false;
              }
            }
           else {
             if (table[i].hasOwnProperty(key)) {
                 data.push(table[i][key]);
             }
           }
         }
         flag = true;
      }

      body.push(data);
      data = [];

   }


   var dd = {
      pageSize: 'A4',

  // by default we use portrait, you can change it to landscape if you wish
      pageOrientation: 'landscape',
   	content: [
         { text: 'Orden de pedido de compra\n\n', fontSize: 25,alignment: 'center' },
         {
            columns: [
              {
                width: '*',
                text: 'Orden de pedido : Nª 012129',
                alignment : 'left'
              },
              {
                width: '*',
                text: 'Fecha  :  ' +  dd+'/'+mm+'/'+yyyy ,
                alignment : 'right'

              }
            ]
         },
         '\n\n ',
 			{
				table: {
               headerRows: 1,
               widths: [ 'auto', '25%', '25%', '15%','auto','20%' ],
					body: body
				},
				layout: 'headerLineOnly'
			}
      ],
      styles: {
       header: {
         fontSize: 22,
         bold: true
       },
       anotherStyle: {
         italics: true,
         alignment: 'right'
       }
     }
   }

   // open the PDF in a new window
   pdfMake.createPdf(dd).open();

   // print the PDF (temporarily Chrome-only)
   //pdfMake.createPdf(dd).print();

}
