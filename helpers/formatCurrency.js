function formatUang(money){                           
	// body...
	let disp = ''
	if(money){
		disp += `Rp. ${money.toLocaleString()}`
	}else{
		disp += 'Belum Order'
	}

	return disp
}


module.exports = formatUang