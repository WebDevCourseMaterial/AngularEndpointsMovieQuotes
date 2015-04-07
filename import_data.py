import logging

import api
from google.appengine.ext import deferred
from models import MovieQuote
import webapp2


# Mostly from http://en.wikipedia.org/wiki/AFI%27s_100_Years...100_Movie_Quotes
SAMPLE_MOVIE_QUOTES = [
["""How can we be expected to teach children how to read if they can't event fit inside the building?""","Zoolander"],
["""I'll have what she's having.""","When Harry Met Sally"],
["""Fat guy in a little coat""","Tommy Boy"],
["""These go to eleven.""","This is Spinal Tap"],
["""You're so money and you don't even know it.""","Swingers"],
["""May the Schwartz be with you.""","Spaceballs"],
["""Earmuffs.""","Old School"],
["""Looks like you've been missing a lot of work lately. I wouldn't say I've been "missing" it, Bob.""","Office Space"],
["""I have nipples, Greg. Could you milk me?""","Meet the Parents"],
["""There's no crying in baseball!""","A League of Their Own"],
["""The price is wrong, b****!""","Happy Gilmore"],
["""Ned, I would love to stay here and talk with you, but I'm not going to.""","Groundhog Day"],
["""Pardon my French, but Cameron is so tight that if you stuck a lump of coal up his a**, in two weeks you'd have a diamond.""","Ferris Bueller's Day Off"],
["""Just when I thought you couldn't possibly be any dumber, you go and do something like this... and totally redeem yourself!""","Dumb and Dumber"],
["""Gentlemen, you can't fight in here! This is a war room!""","Dr. Strangelove, or How I Learned to Stop Worrying and Love the Bomb"],
["""Thanks you very little.""","Caddyshack"],
["""We're on a mission from God.  """," Blues Brothers"],
["""Badges? We don't need no stinking badges!""","Blazing Saddles"],
["""If peeing your pants is cool, consider me Miles Davis.""","Billy Madison"],
["""That rug really tied the room together.""","The Big Lebowski"],
["""This one time, at band camp...""","American Pie"],
["""Surely you can't be serious? I am serious.. and don't call me Shirley.""","Airplane"],
["""It's not nice to throw people.""","Frozen"],
["""All right, Mr. DeMille, I'm ready for my close-up.""","Sunset Boulevard"],
["""I'll be back!""","The Terminator"],
["""Hello. My name is Inigo Montoya. You killed my father. Prepare to die.""","The Princess Bride"],
["""I'm going to make him an offer he can't refuse.""","The Godfather"],
["""Frankly, my dear, I don't give a damn.""","Gone with the Wind"],
["""I'm going to make him an offer he can't refuse.""","The Godfather"],
["""You don't understand! I coulda had class. I coulda been a contender. I could've been somebody, instead of a bum, which is what I am.""","On the Waterfront"],
["""Toto, I've got a feeling we're not in Kansas anymore.""","The Wizard of Oz"],
["""Here's looking at you, kid.""","Casablanca"],
["""Go ahead, make my day.""","Sudden Impact"],
["""All right, Mr. DeMille, I'm ready for my close-up.""","Sunset Boulevard"],
["""May the Force be with you.""","Star Wars"],
["""Fasten your seatbelts. It's going to be a bumpy night.""","All About Eve"],
["""You talkin' to me?""","Taxi Driver"],
["""What we've got here is failure to communicate.""","Cool Hand Luke"],
["""I love the smell of napalm in the morning.""","Apocalypse Now"],
["""Love means never having to say you're sorry.""","Love Story"],
["""The stuff that dreams are made of.""","The Maltese Falcon"],
["""E.T. phone home.""","E.T. the Extra-Terrestrial"],
["""They call me Mister Tibbs!""","In the Heat of the Night"],
["""Rosebud.""","Citizen Kane"],
["""Made it, Ma! Top of the world!""","White Heat"],
["""I'm as mad as hell, and I'm not going to take this anymore!""","Network"],
["""Louis, I think this is the beginning of a beautiful friendship.""","Casablanca"],
["""A census taker once tried to test me. I ate his liver with some fava beans and a nice Chianti.""","The Silence of the Lambs"],
["""Bond. James Bond.""","Dr. No"],
["""There's no place like home.""","The Wizard of Oz"],
["""I am big! It's the pictures that got small.""","Sunset Boulevard"],
["""Show me the money!""","Jerry Maguire"],
["""Why don't you come up sometime and see me?""","She Done Him Wrong"],
["""I'm walking here! I'm walking here!""","Midnight Cowboy"],
["""Play it, Sam. Play 'As Time Goes By.'""","Casablanca"],
["""You can't handle the truth!""","A Few Good Men"],
["""I want to be alone.""","Grand Hotel"],
["""After all, tomorrow is another day!""","Gone with the Wind"],
["""Round up the usual suspects.""","Casablanca"],
["""I'll have what she's having.""","When Harry Met Sally..."],
["""You know how to whistle, don't you, Steve? You just put your lips together and blow.""","To Have and Have Not"],
["""You're gonna need a bigger boat.""","Jaws"],
["""Badges? We ain't got no badges! We don't need no badges! I don't have to show you any stinking badges!""","The Treasure of the Sierra Madre"],
["""I'll be back.""","The Terminator"],
["""Today, I consider myself the luckiest man on the face of the Earth.""","The Pride of the Yankees"],
["""If you build it, he will come.""","Field of Dreams"],
["""Mama always said life was like a box of chocolates. You never know what you're gonna get.""","Forrest Gump"],
["""We rob banks.""","Bonnie and Clyde"],
["""Plastics.""","The Graduate"],
["""We'll always have Paris.""","Casablanca"],
["""I see dead people.""","The Sixth Sense"],
["""Stella! Hey, Stella!""","A Streetcar Named Desire"],
["""Oh, don't let's ask for the moon. We have the stars.""","""Voyager"""],
["""Shane. Shane. Come back!""","Shane"],
["""Well, nobody's perfect.""","Some Like It Hot"],
["""It's alive! It's alive!""","Frankenstein"],
["""Houston, we have a problem.""","Apollo 13"],
["""You've got to ask yourself one question: 'Do I feel lucky?' Well, do ya, punk?""","Dirty Harry"],
["""You had me at 'hello.'""","Jerry Maguire"],
["""One morning I shot an elephant in my pajamas. How he got in my pajamas, I don't know.""","Animal Crackers"],
["""There's no crying in baseball!""","A League of Their Own"],
["""La-dee-da, la-dee-da.""","Annie Hall"],
["""A boy's best friend is his mother.""","Psycho"],
["""Greed, for lack of a better word, is good.""","Wall Street"],
["""Keep your friends close, but your enemies closer.""","The Godfather Part II"],
["""As God is my witness, I'll never be hungry again.""","Gone with the Wind"],
["""Well, here's another nice mess you've gotten me into!""","Sons of the Desert"],
["""Say 'hello' to my little friend!""","Scarface"],
["""What a dump.""","Beyond the Forest"],
["""Mrs. Robinson, you're trying to seduce me. Aren't you?""","The Graduate"],
["""Gentlemen, you can't fight in here! This is the War Room!""","Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb"],
["""Elementary, my dear Watson.""","The Adventures of Sherlock Holmes"],
["""Get your stinking paws off me, you damned dirty ape.""","Planet of the Apes"],
["""Of all the gin joints in all the towns in all the world, she walks into mine.""","Casablanca"],
["""Here's Johnny!""","The Shining"],
["""They're here!""","Poltergeist"],
["""Is it safe?""","Marathon Man"],
["""Wait a minute, wait a minute. You ain't heard nothin' yet!""","The Jazz Singer"],
["""No wire hangers, ever!""","Mommie Dearest"],
["""Mother of mercy, is this the end of Rico?""","Little Caesar"],
["""Forget it, Jake, it's Chinatown.""","Chinatown"],
["""I have always depended on the kindness of strangers.""","A Streetcar Named Desire"],
["""Hasta la vista, baby.""","Terminator 2: Judgment Day"],
["""Soylent Green is people!""","Soylent Green"],
["""Open the pod bay doors please, HAL.""","2001: A Space Odyssey"],
["""Striker: "Surely you can't be serious." Rumack: "I am serious...and don't call me Shirley.""","Airplane!"],
["""Yo, Adrian!""","Rocky"],
["""Hello, gorgeous.""","Funny Girl"],
["""Toga! Toga!""","National Lampoon's Animal House"],
["""Listen to them. Children of the night. What music they make.""","Dracula"],
["""Oh, no, it wasn't the airplanes. It was Beauty killed the Beast.""","King Kong"],
["""My precious.""","The Lord of the Rings: The Two Towers"],
["""Attica! Attica!""","Dog Day Afternoon"],
["""Sawyer, you're going out a youngster, but you've got to come back a star!""","42nd Street"],
["""Listen to me, mister. You're my knight in shining armor. Don't you forget it. You're going to get back on that horse, and I'm going to be right behind you, holding on tight, and away we're gonna go, go, go!""","On Golden Pond"],
["""Tell 'em to go out there with all they got and win just one for the Gipper.""","""All American"""],
["""A martini. Shaken, not stirred.""","Goldfinger"],
["""Who's on first?""","The Naughty Nineties"],
["""Cinderella story. Outta nowhere. A former greenskeeper, now, about to become the Masters champion. It looks like a mirac...It's in the hole! It's in the hole! It's in the hole!""","Caddyshack"],
["""Life is a banquet, and most poor suckers are starving to death!""","Auntie Mame"],
["""I feel the need the need for speed!""","Top Gun"],
["""Carpe diem. Seize the day, boys. Make your lives extraordinary.""","Dead Poets Society"],
["""Snap out of it!""","Moonstruck"],
["""My mother thanks you. My father thanks you. My sister thanks you. And I thank you.""","Yankee Doodle Dandy"],
["""Nobody puts Baby in a corner.""","Dirty Dancing"],
["""I'll get you, my pretty, and your little dog too!""","The Wizard of Oz"],
["""I'm the king of the world!""","Titanic"]]

class ImportDataAction(webapp2.RequestHandler):
  def get(self):
    deferred.defer(add_movie_quotes)
    self.redirect("/")

def add_movie_quotes(start_index=0, added=0, skipped=0, total=0):
  ending_index = min(start_index + 10, len(SAMPLE_MOVIE_QUOTES))
  for moviequoteList in SAMPLE_MOVIE_QUOTES[start_index:ending_index]:
    total += 1
    if MovieQuote.query(MovieQuote.quote == moviequoteList[0], ancestor=api.PARENT_KEY).get():
      skipped += 1
    else:
      movie = MovieQuote(parent=api.PARENT_KEY,
                                 quote=moviequoteList[0],
                                 movie=moviequoteList[1])
      movie.put()
      added += 1
  if ending_index < len(SAMPLE_MOVIE_QUOTES):
    logging.info("Progress update - So far " + str(added) + " movie quotes have been added out of the " + str(total) + " records processed.")
    deferred.defer(add_movie_quotes, start_index + 10, added, skipped, total)
  else:
    logging.info("Finished importing movie quotes.  Added: " + str(added) + "  Skipped: " + str(skipped) + "  Total: " + str(total))


app = webapp2.WSGIApplication([
    ("/importdata", ImportDataAction),
], debug=True)
