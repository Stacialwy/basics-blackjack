
// Get a random index ranging from 0 (inclusive) to max (exclusive).
var getRandomIndex = function (max) {
  return Math.floor(Math.random() * max);
};

var makeDeck = function () {
  // Initialise an empty deck array
  var cardDeck = [];
  // Initialise an array of the 4 suits in our deck. We will loop over this array.
  var suits = ['♣️', '♠️', '♦️', '♥️'];

  // Loop over the suits array
  var suitIndex = 0;
  while (suitIndex < suits.length) {
    // Store the current suit in a variable
    var currentSuit = suits[suitIndex];

    // Loop from 1 to 13 to create all cards for a given suit
    // Notice rankCounter starts at 1 and not 0, and ends at 13 and not 12.
    // This is an example of a loop without an array.
    var rankCounter = 1;
    while (rankCounter <= 13) {
      // By default, the card name is the same as rankCounter
      var cardName = rankCounter;

      // If rank is 1, 11, 12, or 13, set cardName to the ace or face card's name
      if (cardName == 1) {
        cardName = 'ace';
      } else if (cardName == 11) {
        cardName = 'jack';
      } else if (cardName == 12) {
        cardName = 'queen';
      } else if (cardName == 13) {
        cardName = 'king';
      }

      // Create a new card with the current name, suit, and rank
      var card = {
        name: cardName,
        suit: currentSuit,
        rank: rankCounter,
      };

      // Add the new card to the deck
      cardDeck.push(card);

      // Increment rankCounter to iterate over the next rank
      rankCounter += 1;
    }

    // Increment the suit index to iterate over the next suit
    suitIndex += 1;
  }

  // Return the completed card deck
  console.log(cardDeck)
  return cardDeck;
};

var shuffleCards = function (cardDeck) {
  // Loop over the card deck array once
  var currentIndex = 0;
  while (currentIndex < cardDeck.length) {
    // Select a random index in the deck
    var randomIndex = getRandomIndex(cardDeck.length);
    // Select the card that corresponds to randomIndex
    var randomCard = cardDeck[randomIndex];
    // Select the card that corresponds to currentIndex
    var currentCard = cardDeck[currentIndex];
    // Swap positions of randomCard and currentCard in the deck
    cardDeck[currentIndex] = randomCard;
    cardDeck[randomIndex] = currentCard;
    // Increment currentIndex
    currentIndex = currentIndex + 1;
  }
  // Return the shuffled deck
  return cardDeck;
};

var deck = makeDeck()
var shuffledDeck = shuffleCards(deck);

var playerCards = []
var dealerCards = []
var dealerScore = 0
var playerScore = 0


var MODE_GIVE_CARDS = 'MODE_GIVE_CARDS'
var MODE_PLAYER_DECISION = 'MODE_PLAYER_DECISION'
var MODE_PLAYER_HIT = 'MODE_PLAYER_HIT'
var MODE_PLAYER_STAND = 'MODE_PLAYER_STAND'
var MODE_DEALER_DECISION = 'MODE_DEALER_DECISION'
// If dealer less than 17, must draw card
var MODE_DEALER_HIT = 'MODE_DEALER_HIT'
var MODE_PLAY = 'MODE_PLAY'
gamemode = MODE_GIVE_CARDS

var main = function (input) {
  if (gamemode == MODE_GIVE_CARDS) {
    // // Player gets two cards
    var drawnCard = shuffledDeck.pop()
    console.log(drawnCard)

    playerCards.push(drawnCard)
    drawnCard = shuffledDeck.pop()
    playerCards.push(drawnCard)
    console.log(playerCards)

    // Dealer cards gets two cards
    drawnCard = shuffledDeck.pop()
    dealerCards.push(drawnCard)
    drawnCard = shuffledDeck.pop()
    dealerCards.push(drawnCard)

    // The cards are analysed for game winning conditions, e.g. Blackjack.

    gamemode = MODE_PLAYER_DECISION
    console.log(gamemode)
    if (isBlackjack(dealerCards) && isBlackjack(playerCards)) {
      return `You have drawn ${displayCards(playerCards)}. <br> <br>The dealer has ${displayCards(dealerCards)}. <br> <br> It's a tie! :|`
    } else if (isBlackjack(dealerCards)) {
      return `You have drawn ${displayCards(playerCards)}. <br> <br>The dealer has ${displayCards(dealerCards)}. <br> <br> You lose to Blackjack! :(`
    } else if (isBlackjack(playerCards)) {
      return `You have drawn ${displayCards(playerCards)}. <br> <br>The dealer has ${displayCards(dealerCards)}. <br> <br> You win by Blackjack! :)`
    }

    playerScore = getScore(playerCards)
    dealerScore = getScore(dealerCards)
    
    // Player show both cards, Dealer 1 card face up, 1 face down
    return `You have drawn ${displayCards(playerCards)}. <br> <br> The dealer has ${dealerCards[0].name} of  ${dealerCards[0].suit} and another card. <br> <br>Player decide whether to hit or stand <br>`
  }

  // The user decides whether to hit or stand, using the submit button to submit their choice.
  else if (gamemode == MODE_PLAYER_DECISION) {
    console.log(`player score : ${playerScore}`)
    if (input == 'hit') {
      gamemode = MODE_PLAYER_HIT
      return `Player chose to hit. Click submit to draw a card.`
    } else if (input == 'stand') {
      gamemode == MODE_PLAYER_STAND
      return `Player chose to stand. Click submit to continue the game.`
    }
  }

// If player wants to hit
  if (gamemode == MODE_PLAYER_HIT) {
    hit(playerCards)
    playerScore = getScore(playerCards)
    // The user's cards are analysed for winning or losing conditions.
    if (playerScore > 21) {
      gamemode = MODE_DEALER_DECISION
      return `Your cards are ${displayCards(playerCards)}. You can no longer draw cards! Click submit to continue the game.`
    } else {
      gamemode = MODE_PLAYER_DECISION
      return `Your cards are ${displayCards(playerCards)}. Player decide whether to hit or stand <br>`

    }
  } else if (gamemode = MODE_PLAYER_STAND) {
    gamemode = MODE_DEALER_DECISION
  }
  // The computer decides to hit or stand automatically based on game rules.
  // The game either ends or continues.
  if (gamemode == MODE_DEALER_DECISION) {
    while (dealerScore < 16 || playerScore < 21 && dealerScore < playerScore && dealerScore < 21) {
      hit(dealerCards)
      dealerScore = getScore(dealerCards)
    }
    
    if (dealerScore == playerScore || (dealerScore > 21 && playerScore > 21)) {
      return `You have drawn ${displayCards(playerCards)} with a score of ${playerScore}. <br> <br>The dealer has ${displayCards(dealerCards)} with a score of ${dealerScore}. <br> <br> It's a tie! :|`
    } else if (playerScore > 21 || (dealerScore < 21 && dealerScore > playerScore)) {
      return `You have drawn ${displayCards(playerCards)} with a score of ${playerScore}. <br> <br>The dealer has ${displayCards(dealerCards)} with a score of ${dealerScore}. <br> <br> You lose! :(`
    } else {
      return `You have drawn ${displayCards(playerCards)} with a score of ${playerScore}. <br> <br>The dealer has ${displayCards(dealerCards)} with a score of ${dealerScore}. <br> <br> You win! :)`
    }
  }
}

var displayCards = function (cardsArray) {
  var myOutputvalue = ''
  for (var b = 0; b < cardsArray.length; b += 1) {
    myOutputvalue += `${cardsArray[b].name} of ${cardsArray[b].suit}`
    if (b != cardsArray.length - 1) {
      myOutputvalue += ', <br>'
    }
  }
  return myOutputvalue
}

var hit = function (cards) {
  var drawnCard = shuffledDeck.pop()
  cards.push(drawnCard)
}

var isBlackjack = function (hand) {
  // Check during the first draw for both senarios
  if (hand[0].name == 'ace') {
    return (hand[1].name == 10 || hand[1].name == 'king' || hand[1].name == 'queen' || hand[1].name == 'jack' || hand[1].name == 'ace')
  } else if (hand[1].name == 'ace') {
    return (hand[0].name == 10 || hand[0].name == 'king' || hand[0].name == 'queen' || hand[0].name == 'jack')

  }
  return false
}

var getScore = function (playerCards) {
  var ace = 0;
  var score = 0
  // Check and add the score of each card
  for (var b = 0; b < playerCards.length; b += 1) {
    var card = playerCards[b]
    if (card.name == 'king' || card.name == 'queen' || card.name == 'jack') {
      score += 10
    }
    // Note if there is an ace
     else if (card.name != 'ace') {
      score += card.name
    } else {
      ace+1
    }
  }
  if (ace > 0) {
    score += (ace - 1)
    if (score + 11 <= 21) {
      return score + 11;
    } else {
      return score + 1;
    }
  }
  return score;
}
