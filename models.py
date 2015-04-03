from endpoints_proto_datastore.ndb.model import EndpointsModel
from google.appengine.ext import ndb


class MovieQuote(EndpointsModel):
  """ A fun or memorable quote from a movie. """
  _message_fields_schema = ("entityKey", "quote", "movie", "last_touch_date_time")
  quote = ndb.StringProperty()
  movie = ndb.StringProperty()
  last_touch_date_time = ndb.DateTimeProperty(auto_now=True)