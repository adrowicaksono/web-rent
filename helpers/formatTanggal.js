function formatTanggal(date){
    let month = ['januari', 'februari', 'maret', 'april', 'mei', 'juni', 'juli', 'agustus', 'september', 'oktober','november', 'desember']
    let tahun = date.getFullYear()
    let tanggal = date.getDate() 
    let bulan = month[date.getMonth()]
    
    return `${tanggal} - ${bulan} - ${tahun}`
}

module.exports = formatTanggal