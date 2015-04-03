import endpoints
import protorpc
from models import MovieQuote
import main_bootstrap

@endpoints.api(name="moviequotes", version="v1", description="Movie Quotes API")
class MovieQuotesApi(protorpc.remote.Service):
    """ API to use JSON messages to put MovieQuotes in the cloud from a client. """

    @MovieQuote.method(path="moviequote/insert", name="moviequote.insert", http_method="POST")
    def moviequote_insert(self, request):
        """ Insert (i.e. create and update) a movie quote. """
        if request.from_datastore:
            my_quote = request
        else:
            my_quote = MovieQuote(parent=main_bootstrap.PARENT_KEY, quote=request.quote, movie=request.movie)
        my_quote.put()
        return my_quote

    @MovieQuote.query_method(path="moviequote/list", http_method="GET", name="moviequote.list",
                             query_fields=("limit", "order", "pageToken"))
    def moviequote_list(self, query):
        """ Returns the query for movie quotes based on the limit, order, and pageToken given."""
        return query


    @MovieQuote.method(request_fields=("entityKey",), path="moviequote/delete/{entityKey}",
                       http_method="DELETE", name="moviequote.delete")
    def moviequote_delete(self, request_movie_quote):
        """ Deletes the quote. """
        if not request_movie_quote.from_datastore:
            raise endpoints.NotFoundException("Movie quote not found")
        request_movie_quote.key.delete()
        return MovieQuote(quote="deleted")

app = endpoints.api_server([MovieQuotesApi], restricted=False)
