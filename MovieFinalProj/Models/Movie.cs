public class Movie
{
    public int Id { get; set; }
    public string Title { get; set; } = default!;
    public string? ImageUrl { get; set; }
    public string? Summary { get; set; }
    public DateTime ReleaseDate { get; set; }
    public List<Review> Reviews { get; set; } = new();
    public List<MovieListItem> MovieListItems { get; set; } = new();
    public double AverageRating => Reviews.Any() ? Reviews.Average(r => r.Rating) : 0;
}