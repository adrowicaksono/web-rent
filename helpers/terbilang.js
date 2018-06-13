function numberToWords(number) {
    // Your code here
    var words = ['','satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh','delapan','sembilan', 'sepuluh', 'sebelas' ];
   
    if(number >= 0 && number <= 11){
      return words[number] ;
    }
  
    if(number>11 && number<20){
      let angka11_20 = number-10;
      return words[angka11_20] + ' belas';
    }
    
    if(number >= 20 && number < 100){
      let angka20_100 = Math.floor(number/10) ;
      return words[angka20_100] + ' puluh' +' '+ numberToWords(number%10) ;
    }
    
    if(number >= 100 && number < 200){
      let angka100_199 = Math.floor(number-100);
      return 'seratus' + ' ' + numberToWords(angka100_199);
    }
   
    if(number >= 200 && number < 1000){
      let angka200_999 = Math.floor(number/100);
      return words[angka200_999] + ' ratus' + ' ' + numberToWords(number%100)
    }
    
    if(number >= 1000 && number < 2000){
      let angka100_199 = Math.floor(number-1000);
      return 'seribu' + ' ' + numberToWords(angka100_199);
    }
    
    if(number >= 2000 && number < 1000000){
      let angka2000_99999 = Math.floor(number/1000);
      return numberToWords(angka2000_99999) + ' ribu' + ' ' + numberToWords(number%1000)
    }
    
    if(number >= 1000000 && number < 1000000000){
      let angka2000_99999 = Math.floor(number/1000000);
      return numberToWords(angka2000_99999) + ' juta' + ' ' + numberToWords(number%1000000)
    }
    
    if(number >= 1000000000 && number < 1000000000000){
      let angka2000_99999 = Math.floor(number/1000000000);
      return numberToWords(angka2000_99999) + ' miliyar' + ' ' + numberToWords(number%1000000000)
    }
    
    if(number >= 1000000000000 && number < 1000000000000000){
      let angka2000_99999 = Math.floor(number/1000000000000);
      return numberToWords(angka2000_99999) + ' triliun' + ' ' + numberToWords(number%1000000000000)
    }
    
  }

  module.exports = numberToWords