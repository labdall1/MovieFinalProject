public class MovieListItem
{
    public int Id { get; set; }
    public int MovieId { get; set; }
    public Movie Movie { get; set; } = default!;
    public int MovieListId { get; set; }
    public MovieList MovieList { get; set; } = default!;
    public DateTime AddedAt { get; set; } = DateTime.UtcNow;
}