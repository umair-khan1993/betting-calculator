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

		//if(bet[1] === "P") {
		  processBets(bet[1], horseNumber, betAmount);
	  //} else if (bet[1] === "W") {
		  //processWinningBets(horseNumber, betAmount);
		  //processBets(bet[1], horseNumber, betAmount);
	  //}
	} 
}

/*function processWinningBets(horseNumber, betAmount) {

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
}*/

function checkHorseExistence(horseNumber) {
	return function(bet) {
    if (bet.horse === horseNumber) {
    	//console.log("horse found");
    	//console.log(bet);
			return bet;
    	
    }
	}
}

function processBets(betType, horseNumber, betAmount) {
	if (betType === "W") {
	  totalWinnPool = totalWinnPool + betAmount;
		var result = winningBets.filter(checkHorseExistence(horseNumber));

		if (result.length > 0) {
			winningBets[winningBets.indexOf(result[0])].amount = winningBets[winningBets.indexOf(result[0])].amount + betAmount;
		} else {
			winningBets.push({
				horse: horseNumber,
				amount: betAmount
			});
		}
	} else {
		totalPlacePool = totalPlacePool + betAmount;

		var result = placeBets.filter(checkHorseExistence(horseNumber));

		if (result.length > 0) {
			placeBets[placeBets.indexOf(result[0])].amount = placeBets[placeBets.indexOf(result[0])].amount + betAmount;
		} else {
			placeBets.push({
				horse: horseNumber,
				amount: betAmount
			});
		}
	}
}

function computeDividends(result) {
	computeWinningDividend(result.first);
	//computePlaceDividends(result)
}

function computeStakeOnPlaceHorse(horseNumber) {
	var totalBetsForPlaceHorse = 0;
	placeBets.filter(function(obj) {
		if (obj.horse === horseNumber) {
			totalBetsForPlaceHorse = totalBetsForPlaceHorse + obj.amount;
			return obj;
		}
	});

	return totalBetsForPlaceHorse;

}

function computePlaceDividends(result) {
	var totalBetsForPlaceHorse = 0;
	var netPlacePool = computeNetPool(totalPlacePool, 12);

	var totalBetsForFirstHorse = computeStakeOnPlaceHorse(result.first),
		totalBetsForSecondHorse = computeStakeOnPlaceHorse(result.second),
		totalBetsForThirdHorse = computeStakeOnPlaceHorse(result.third);

	dividedWinPool = netPlacePool/3;

	var dividendForFirstHorse = dividedWinPool/totalBetsForFirstHorse,
		dividendForSecondHorse = dividedWinPool/totalBetsForSecondHorse,
		dividendForThirdHorse = dividedWinPool/totalBetsForThirdHorse;

	console.log("First" + dividendForFirstHorse);
	console.log("second" + dividendForSecondHorse);
	console.log("third" + dividendForThirdHorse);
}

function computeNetPool(totalPool, percentage) {
	return totalPool - (totalPool * percentage/100);
}

function computeWinningDividend(horseNumber) {
	var totalBetsForWinningHorse = 0;
	//var netWinPool =  totalWinnPool - (totalWinnPool * 15/100);
	var netWinPool = computeNetPool(totalWinnPool, 15);

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