var winningBets = [],
	placeBets = [],
	totalWinnPool = 0,
	totalPlacePool = 0;

var stdin = process.openStdin();

stdin.addListener("data", function(d) {
    // note:  d is an object, and when converted to a string it will
    // end with a linefeed.  so we (rather crudely) account for that  
    // with toString() and then trim() 
    processInput(d);
    /*console.log("you entered: [" + 
        d.toString().trim() + "]");*/

    if (d.toString().trim() === "no") {
    	console.log("no entered");
    	process.exit();
    }
  });

function processInput(input) {
	var formattedInput = input.toString().trim();
	var bet = formattedInput.split(":");

	var betType = bet[0];

	if (betType === "Result") {
		computeDividends({
			first: parseInt(bet[1], 10),
		  second: parseInt(bet[2], 10),
		  third: parseInt(bet[3], 10)
		});
	} else {
		var horseNumber = parseInt(bet[2], 10),
			betAmount = parseInt(bet[3], 10);

		if(bet[1] === "P") {
		  processPlaceBets(horseNumber, betAmount);
	  } else if (bet[1] === "W") {
		  processWinningBets(horseNumber, betAmount);
	  }
	} 
}

function processWinningBets(horseNumber, betAmount) {

	totalWinnPool = totalWinnPool + betAmount;

	var result = winningBets.filter(function(bet) {
		if (bet.horse === horseNumber) {
			return bet;
		}
	});

	if (result.length > 0) {
		winningBets[winningBets.indexOf(result[0])].amount = winningBets[winningBets.indexOf(result[0])].amount + betAmount;
	} else {
		winningBets.push({
			horse: horseNumber,
			amount: betAmount
		});
	}
}

function computeDividends(result) {
	computeWinningDividend(result.first)
}

function computeWinningDividend(horseNumber) {
	var totalBetsForWinningHorse = 0;
	var netWinPool =  totalWinnPool - (totalWinnPool * 15/100);
	var xyz = winningBets.filter(function(obj) {
		if (obj.horse === horseNumber) {
			totalBetsForWinningHorse = totalBetsForWinningHorse + obj.amount;
			return obj;
		}
	});

	var winDividend = netWinPool/totalBetsForWinningHorse;
	console.log("Winning Dividend");
	console.log(winDividend);
}