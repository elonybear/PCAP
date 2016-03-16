var GoogleSpreadsheet = require('google-spreadsheet');
var my_sheet = new GoogleSpreadsheet('1G0knhyWWjhSumNIQMfOJMYK1q911v-4aW2SbsdDl3vM');

var creds = {
	client_email: 'pcap-1251@appspot.gserviceaccount.com',
	private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCsM2x1PcKqsC/K\nvFV/1HMCPpOUu/hcYd+F3haBR+7Rx7jkVsjEdZduk/7lqnzdFy1drKsrGpmZCHjB\n6bnFMWdTVHySb9qswHjZ6M3FrQVhT4uLkPC6gwczvpxdTNLQHrsMeg0zjMv3dVPb\nZDRQ0Sy43B828r3L+UDm8kKz/pmJ5WlaKOH4NFfWmo5CVwdZj1nxWZiDNil3WTKG\nSQdzY7n7BDpqnrxEqQWgsCZe7KdUEViGxMa38AIcYzO1CW57BrHYo5B2dJD1aV86\n0rp1uFjOkdEXiJvnSmX95djCRBvUIC1rHdxOZaSFxU+AfWHEQV9J6UI8Y9q+/nx3\ngLEy13nlAgMBAAECggEAdiBMjVyRln+IOV3alPcK8gY1PPl5FP561B0WeRb8R+Hm\n/pRd4w77k3poh+nc/9lvYGwbe1Ui+qyqEfOgYRpT1AEH93hNnOXnwSwHREw9fZSQ\nmGwUBw3tOdzO7N3PW79I9vUe6zbxkE5m+QATN0FWmXU+4HXCJxNUJ1kW0tybPNEH\nhYPFCJ80Ch1Syq1odwao8L+mm76U3oUz5BruvQc+1LUccZP00ld/5meZ4QsKyAPP\ndfQukSIn/mW3GRPDwQ5BwKrKA0wjAz7He5V1Ff5gwZDtQR8s63QcOkl+KBcKZOGs\nd+qMirLaYBI6SPX0lKI2FDRTeheZJWEqUY7KXw6cvQKBgQDb+EjDAXud6xBnykPS\n5TE3h2Ny3rfatHRyCkgjxvxbnPt9DF6LTQ2OI23QYGSyjOJIwwjja4AsNYu8C92k\n6v28U1OI20t5ZIRdqXlZcf7DDzO4BK41yIdbH+lDfH0JO9vO0MmXC5D7nUfSwZmk\npaFiw6qcom59Cx6Ii70w7AT8wwKBgQDIaBp5K82DMhz00fbuhpVKNwcutKcfAhDo\nuXagT0u/CNdy4HAcy9PT7nzvRUQ5HYppuwvicsXNWH8YI74GP4XWOaM4UhKr9UOV\ntZrzeFv4ugimXHBBoJeqNCBaM7PkMTAbbGj2DTAX3knH3rDp7MoTKaWbnepkRiYk\nkbaBzENkNwKBgQCkaFtB3R7eti1p1cSBoSn6/ec3mP1DqrKJ9eNbUkOV2awiF5em\neC3Ueeh+4T0CMsiCZ7uB9vwyjsblAt1jgPuqwYDi/jzX+2fvdVasosYuVnNqa50l\nt75rPlujRC1UNHgiiOzTRyLS3QgsnuTOKbmIzwP61HDOZvwoRIFgSlej7wKBgGsQ\nUrRRVmW0rAuO8GDVvYP8ifXFxVKng+kQy/Mw6cKRMqjIhpybt/sM+enKE3x/76Y0\nq1C7CDmAAcYfsjEcVp/wAubf0eHUEds1Pia8MkZa/KwDzmUBKoVfe7k0zfIm5RCB\nhkGNIhheRQRmUBVozzwVj8fnQYV4hIAc6GfHfGlZAoGASPkwPOruu+FvO/+GyWH6\nTBCrcSvEUBf7GhY3oPmUGYY/N9jCF+21/j1w/rmXbzPAku6XbKSUxd4tZFmttGcJ\nkXrzLLZyN4f5g/08viKs/c5K5Xg3nnI2x+1Gb6kPQtfGAaHfFOD0RMJ5lMEzFt/f\nA+lQpP9n2rGIxAf3ocz89xY=\n-----END PRIVATE KEY-----\n'
}

my_sheet.useServiceAccountAuth(creds, function(err){
	my_sheet.getInfo( function(err, sheet_info){
		console.log(sheet_info.title + ' is loaded');
		sheet_info.worksheets.forEach(function(sheet){
			sheet.getRows(function(err, rows){
				rows.forEach(function(row){
					console.log(row.title + ' ' + row.artistnameforlabel + ' ' + row.facilitywhenartworksubmitted);
				});
			});
		})
	});
});
